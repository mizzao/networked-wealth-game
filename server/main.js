import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  const data = JSON.parse(Assets.getText("miserables.json"));

  if( Nodes.find().count() === 0 ) {
    data.nodes.forEach(function(n) {
      Nodes.insert({_id: n.id, size: n.group});
    });
  }

  if( Edges.find().count() === 0 ) {
    data.links.forEach(function (e) {
      Edges.insert(e);
    });
  }
  
});

Meteor.publish('network', function(){
  return [
    Nodes.find(),
    Edges.find()
  ];
});
