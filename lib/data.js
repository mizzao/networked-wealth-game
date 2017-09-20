Nodes = new Mongo.Collection('nodes');
Edges = new Mongo.Collection('edges');

// Games from which we can download data
// { _id, timestamp, numPlayers, round, active }
// config parameters:
// { multiplier, wealthVisible, endowmentIncrement }
Games = new Mongo.Collection('games');

// { gameId, round, timestamp, nodes, edges }
GameData = new Mongo.Collection('gamedata');

if( Meteor.isServer ) {
  GameData._ensureIndex({ gameId: 1, round: 1 });
}
