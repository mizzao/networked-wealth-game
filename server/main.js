import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

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
  }
});