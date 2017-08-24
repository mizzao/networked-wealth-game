Meteor.methods({
  'giveAmount': function(donor, recipient, amount) {
    PlayerActions.upsert({from: donor, to: recipient}, {$inc: {amount}});
  }
});