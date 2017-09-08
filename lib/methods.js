import { check } from 'meteor/check';

Meteor.methods({
  'giveAmount': function(donor, recipient, amount) {
    check(amount, Number);

    const m = Meteor.settings.public.game.multiplier || 2.0;

    // Take amount from donor's endowment, and add amount * m to recipient
    // Nodes represent wealth
    if ( Nodes.update({_id: donor, endowment: {$gte: amount}}, {$inc: {endowment: -amount}}) === 0 ) {
      Meteor._debug(`${donor} doesn't have enough to give ${amount}`);
      return;
    }

    const amountReceived = amount * m;

    // Edges represent reputation; store amount given
    Edges.upsert({from: donor, to: recipient}, {$inc: {value: amount}});

    // Add value to received node
    Nodes.update(recipient, {$inc: {value: amountReceived}})

  },
  'giveDelayed': function(donor, recipient, amount) {
    // Record giving amount for later processing
    PlayerActions.upsert({from: donor, to: recipient}, {$inc: {amount}});
  }
});
