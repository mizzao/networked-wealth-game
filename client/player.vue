<template>
  <div class="row">
    <div class="col-md-6">
      User {{ $route.params.id }}
      <network-vis 
      v-bind:player-id="$route.params.id" 
      v-on:hoveredNode="hover"
      v-on:clickedNode="click"></network-vis>
    </div>
    <div class="col-md-6">
      <actions 
      v-bind:selectedPlayer="selectedNode"
      v-bind:myPlayer="$route.params.id"></actions>
    </div>
  </div>  
</template>

<script>  
  import NetworkVis from '/client/network-vis.vue';
  import Actions from '/client/actions.vue';

  export default {    
    components: {
      'network-vis': NetworkVis,
      'actions': Actions
    },
    data: function() {
      return {
        selectedNode: null
      }
    },
    methods: {
      hover: function(node) {
        this.selectedNode = node;
      },
      click: function(node) {
        const from = this.$route.params.id;
        // Don't give if it's to myself
        if (from === node) return;
        
        Meteor.call("giveAmount", from, node, 1);
      }
    }
  }
</script>