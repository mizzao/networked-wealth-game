import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { check } from 'meteor/check';
import { shuffle } from '/imports/util';
import json2csv from 'json2csv';

Meteor.publish('game', function(allGames=false) {
  if (allGames) {
    return Games.find();
  }
  return Games.find({active: true});
});

Meteor.publish('network', function( playerId ){
  if (playerId != null) {
    // Return a player-specific view
    return [
      Nodes.find(),
      Edges.find({
        $or: [
          { from: playerId },
          { to: playerId }
        ]
      })
    ];
  }

  return [
    Nodes.find(),
    Edges.find()
  ];
});

function resetNetwork() {
  // Save any existing game data
  const game = saveData();
  // Set any game that is active to inactive
  if (game != null ) Games.update(game._id, {$set: {active: false}});

  Nodes.remove({});
  Edges.remove({});
}

function saveData() {
  const game = Games.findOne({active: true});
  if ( game == null ) return;

  // Save existing data
  const nodes = Nodes.find({}, { fields: {value: 1} }).fetch()
  const edges = Edges.find({}, { fields: { from: 1, to: 1, value: 1}}).fetch();

  GameData.insert({
    gameId: game._id,
    round: game.round, // end of the current round.
    timestamp: new Date,
    nodes,
    edges
  })

  return game;
}

Meteor.methods({
  'new-game': function(numPlayers, multiplier, endowmentIncrement, wealthVisible) {
    check(numPlayers, Number);
    check(multiplier, Number);
    check(endowmentIncrement, Number);
    check(wealthVisible, Boolean);

    resetNetwork();

    const nicknames = Assets.getText('animals.txt').split('\n');
    if (numPlayers > nicknames.length) throw new Meteor.Error(400, "Network too large");

    shuffle(nicknames);
    // Create this many nodes and grab their ids
    // Give them convenient animal nicknames for identification
    for( let i = 0; i < numPlayers; i++ ) {
      Nodes.insert({ value: 0, label: nicknames[i] });
    }

    Games.insert({
      active: true,
      timestamp: new Date,
      numPlayers,
      round: 0,
      multiplier,
      endowmentIncrement,
      wealthVisible
    });
  },
  'advance-round'() {
    const game = saveData();
    if( game == null ) throw new Meteor.Error(400, "No active game");

    let amount = game.endowmentIncrement;
    if( amount == null ) {
      console.log(`Endowment not set for game ${game._id}, giving default amount of 10.`)
      amount = 10;
    }

    // Increment game round.
    Games.update(game._id, {$inc: {round: 1}});

    Meteor._debug(`Each player is getting ${amount}.`);
    // Each node gets {amount} endowment, and the rest moves into value
    Nodes.find().forEach((node) => {
      Nodes.update(node._id, {
        $inc: {value: node.endowment || 0},
        $set: {endowment: amount}
      });
    });
  },
  'dl-game-data'(gameId) {
    const data = Games.find(gameId).fetch();

    return json2csv({data});
  },
  'dl-node-data'(gameId) {
    const data = GameData.find({gameId}, {fields: {edges: 0}}).fetch();

    const fields = [
      'round',
      'timestamp',
      'nodes._id',
      'nodes.value'
    ];

    return json2csv({data, fields, unwindPath: 'nodes'});
  },
  'dl-edge-data'(gameId) {
    const data = GameData.find({gameId}, {fields: {nodes: 0}}).fetch();

    const fields = [
      'round',
      'timestamp',
      'edges.from',
      'edges.to',
      'edges.value'
    ];

    return json2csv({data, fields, unwindPath: 'edges'});
  },
});