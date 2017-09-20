<template>
  <div class="row">
    <div class="col-sm-8">
      <network-vis v-on:hoveredNode="hover"></network-vis>
    </div>
    <div class="col-sm-4">
      <actions v-bind:selectedPlayer="selectedNodeId"></actions>
    </div>
  </div class="row">

</template>

<script>
  import NetworkVis from '/imports/game/network-vis.vue';
  import Actions from '/client/player/actions.vue';

  export default {
    components: {
      'network-vis': NetworkVis,
      'actions': Actions
    },
    data: function() {
      return {
        selectedNodeId: null
      }
    },
    methods: {
      hover: function(node) {
        this.selectedNodeId = node;
      }
    }
  }
</script>
