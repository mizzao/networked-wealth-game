<template>
  <div>
    <h2>Player Actions</h2>
    
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
    
    <div class="well">
      <p v-if="selectedPlayer">
        This is: {{ selectedPlayer }}      
      </p>

      <p v-if="player">
        Wealth: {{player.value}}
      </p>

      <p v-if="playerAction">
        You are giving: {{playerAction.amount}}
      </p>
    </div>

  </div>
</template>

<script>
export default {
  props: [ 'myPlayer', 'selectedPlayer' ],
  data: function() {
    return {
      player: null,
      myActions: []
    }
  },
  meteor: {
    $subscribe: {
      'donorActions': function() {
        return [ this.myPlayer ];
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
    playerAction: {
      params() {
        return {
          from: this.$route.params.id,
          to: this.selectedPlayer
        }
      },
      update({from, to}) {
        return PlayerActions.findOne({from, to});
      }
    },
    myActions() {
      // Currently, not filtered by myself due to publication above
      return PlayerActions.find();
    }
  },
  methods: {
    
  }
}
</script>

<style>

</style>