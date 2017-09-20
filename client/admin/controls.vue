<template>
  <div>

    <div class="row">
      <div class="col-sm-6">
        <div class="well">
        <h2>Reset Game</h2>
        <new-game-form></new-game-form>
        </div>
      </div>
      <div class="col-sm-6" v-if="currentGame">
        <div class="well">
        <h2>Current Game</h2>
        <dl class="dl-horizontal">
          <dt>Players</dt>
          <dd>{{ currentGame.numPlayers }}</dd>
          <dt>Started</dt>
          <dd>{{ currentGame.timestamp.toLocaleString() }}</dd>
          <dt>Round</dt>
          <dd>{{ currentGame.round }}</dd>
          <dt>Multiplier</dt>
          <dd>{{ currentGame.multiplier }}</dd>
          <dt>Endowment Increment</dt>
          <dd>{{ currentGame.endowmentIncrement }}</dd>
          <dt>Wealth Visible</dt>
          <dd>{{ currentGame.wealthVisible }}</dd>
        </dl>

        <button class="btn btn-primary btn-large" v-on:click="advanceRound">
          Give everyone {{currentGame.endowmentIncrement}} units and advance round
        </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import NewGameForm from '/imports/ui/NewGameForm.vue';

export default {
  data: function() {
    return {
      currentGame: null
    }
  },
  meteor: {
    $subscribe: {
      'game': function() {
        return [ false ]; // Just get the active game
      }
    },
    currentGame() {
      return Games.findOne({active: true});
    }
  },
  methods: {
    'networkMac': function() {
      Meteor.call("network-max-avg-clust");
    },
    advanceRound() {
      Meteor.call("advance-round");
    },
    processActions() {
      Meteor.call("process-actions");
    }
  },
  components: {
    NewGameForm
  }
}
</script>

<style>

</style>