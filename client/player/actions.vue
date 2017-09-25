<template>
  <div>
    <h2 v-if="currentGame">
      Round {{ currentGame.round }}
    </h2>

    <div class="alert alert-info">
      <h3 v-if="myNode">Your wealth: <span class="label label-primary">{{ myNode.value }}</span></h3>

      <h3 v-if="myNode">You have <span class="label label-success">{{ myNode.endowment || "nothing" }}</span> to give.</h3>
    </div>

    <div class="well" v-if="selectedNode">
      <div v-if="selectedPlayer == myPlayer">
        <h3>This is you.</h3>
      </div>
      <div v-else>
        <h3>Anonymous {{ selectedNode.label }}</h3>
        <h3 v-if="currentGame.wealthVisible || !myNode">
          Their wealth: <span class="label label-default">{{selectedNode.value}}</span>
          </h3>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: [ 'myPlayer', 'selectedPlayer' ],
  data: function() {
    return {
      myNode: null,
      selectedNode: null,
      currentGame: null
    }
  },
  meteor: {
    selectedNode: {
      params() {
        return {
          id: this.selectedPlayer
        };
      },
      update({id}) {
        return Nodes.findOne(id);
      }
    },
    myNode: {
      params() {
        return {
          id: this.myPlayer
        };
      },
      update({id}) {
        return Nodes.findOne(id);
      }
    },
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

  }
}
</script>

<style>

</style>