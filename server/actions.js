import { Meteor } from 'meteor/meteor';

Meteor.publish("donorActions", function(donorId) {
  return PlayerActions.find({from: donorId});
});
