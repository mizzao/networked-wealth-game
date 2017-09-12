Nodes = new Mongo.Collection('nodes');
Edges = new Mongo.Collection('edges');

// { from, to, amount }
PlayerActions = new Mongo.Collection('actions');

// Games from which we can download data
// { _id, timestamp, numPlayers, round, active }
Games = new Mongo.Collection('games');

// { gameId, round, timestamp, nodes, edges }
GameData = new Mongo.Collection('gamedata');

if( Meteor.isServer ) {
  GameData._ensureIndex({ gameId: 1, round: 1 });
}
