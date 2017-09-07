<template>
  <table class="table">
    <thead>
      <tr>
        <th>Player</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="action in myActions">
        <td>{{action.to}}</td>
        <td>{{action.amount}}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: [ 'selectedPlayer' ],
  data: function() {
    return {
      myActions: []
    }
  },
  meteor: {
    $subscribe: {
      'donorActions': function() {
        return [ this.selectedPlayer ];
      }
    },
    player: {
      params() {
        return {
          id: this.selectedPlayer
        };
      },
      update({id}) {
        return Nodes.findOne(id);
      }
    },
    myActions() {
      // Currently, not filtered by myself due to publication above
      return PlayerActions.find();
    }
  }
}
</script>