import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { check } from 'meteor/check';
import { shuffle } from '/imports/util';

Meteor.startup(() => {

});

Meteor.publish('network', function( playerId ){
  console.log(playerId);
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

Meteor.methods({
  'reset-network': function() {
    Nodes.remove({});
    Edges.remove({});
  },
  'network-lesmis':  function() {
    Meteor.call('reset-network');
    // Data format:
    // nodes: {id, value}
    // edges: {from, to, value}
    const data = JSON.parse(Assets.getText("miserables.json"));

    if( Nodes.find().count() === 0 ) {
      data.nodes.forEach(function(n) {
        Nodes.insert(n);
      });
    }

    if( Edges.find().count() === 0 ) {
      data.links.forEach(function (e) {
        Edges.insert(e);
      });
    }
  },
  'network-empty': function(numPlayers) {
    Meteor.call('reset-network');

    const nicknames = Assets.getText('animals.txt').split('\n');
    if (numPlayers > nicknames.length) throw new Meteor.Error(400, "Network too large");

    shuffle(nicknames);
    // Create this many nodes and grab their ids
    // Give them convenient animal nicknames for identification
    for( let i = 0; i < numPlayers; i++ ) {
      Nodes.insert({ value: 0, label: nicknames[i] });
    }
  },
  'network-max-avg-clust': function() {
    Meteor.call('reset-network');

    // Generate the 16-node max avg clustering network from Mason & Watts
    const nids = [];

    // Create 16 nodes and grab their ids
    for( let i = 0; i < 16; i++ ) {
      nids.push( Nodes.insert({ value: 1}) );
    }

    // Create clusters and links between them:
    // 0-1, 0-2, 1-2, 1-3, 2-3 mod 4
    for( let j = 0; j < 4; j++ ) {
      const b = 4*j;
      // Links between clusters
      Edges.insert({from: nids[b], to: nids[b+1], value: 1 });
      Edges.insert({from: nids[b], to: nids[b+2], value: 1 });
      Edges.insert({from: nids[b+1], to: nids[b+2], value: 1 });
      Edges.insert({from: nids[b+1], to: nids[b+3], value: 1 });
      Edges.insert({from: nids[b+2], to: nids[b+3], value: 1 });

      // Link to next clusters
      Edges.insert({from: nids[b+3], to: nids[(b+4) % 16], value: 1 });
    }
  },
  'give-endowment'(amount) {
    check(amount, Number);

    Meteor._debug(`Each player is getting ${amount}.`);
    // Each node gets {amount} endowment, and the rest moves into value
    Nodes.find().forEach((node) => {
      Nodes.update(node._id, {
        $inc: {value: node.endowment || 0},
        $set: {endowment: amount}
      });
    });
  },
  'process-actions'() {
    PlayerActions.find().forEach(function(a, i) {
      // Skip self-links
      if( a.from === a.to ) return;

      // Edges represent reputation
      Edges.upsert({from: a.from, to: a.to}, {$inc: {value: a.amount}});
      // Nodes represent wealth
      Nodes.upsert(a.to, {$inc: {value: a.amount}});

      PlayerActions.remove(a._id);
    });
  },
});