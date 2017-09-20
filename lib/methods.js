import { check } from 'meteor/check';

Meteor.methods({
  'giveAmount': function(donor, recipient, amount) {
    check(amount, Number);

    // TODO: read multiplier from settings
    const game = Games.findOne({active: true});
    if ( game == null ) {
      throw new Meteor.Error(400, "Can't find an active game");
      return;
    }

    // Take amount from donor's endowment, and add amount * m to recipient
    // Nodes represent wealth
    if ( Nodes.update({_id: donor, endowment: {$gte: amount}}, {$inc: {endowment: -amount}}) === 0 ) {
      Meteor._debug(`${donor} doesn't have enough to give ${amount}`);
      return;
    }

    const amountReceived = amount * game.multiplier;

    // Edges represent reputation; store amount given
    Edges.upsert({from: donor, to: recipient}, {$inc: {value: amount}});

    // Add value to received node
    Nodes.update(recipient, {$inc: {value: amountReceived}})

  }
});
