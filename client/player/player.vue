<template>
  <div class="row">
    <div class="col-md-6">
      User {{ $route.params.id }}
      <network-vis
      v-bind:player-id="myNodeId"
      v-on:hoveredNode="hover"
      v-on:clickedNode="click"></network-vis>
    </div>
    <div class="col-md-6">
      <actions
      v-bind:selectedPlayer="selectedNodeId"
      v-bind:myPlayer="myNodeId"></actions>
    </div>
  </div>
</template>

<script>
  import NetworkVis from '/imports/game/network-vis.vue';
  import Actions from '/client/player/actions.vue';

  export default {
    components: {
      'network-vis': NetworkVis,
      'actions': Actions
    },
    props: [ 'myNodeId' ],
    data: function() {
      return {
        selectedNodeId: null
      }
    },
    methods: {
      hover: function(node) {
        this.selectedNodeId = node;
      },
      click: function(node) {
        const from = this.myNodeId;
        // Don't give if it's to myself
        if (from === node) return;

        Meteor.call("giveAmount", from, node, 1);
      }
    }
  }
</script>