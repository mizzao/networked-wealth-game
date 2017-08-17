<template>
  <div class="row">
    <div class="col-md-6">
      User {{ $route.params.id }}
      <network-vis v-bind:player-id="$route.params.id" v-on:selectedNode="select"></network-vis>
    </div>
    <div class="col-md-6">
      <actions v-bind:selectedPlayer="selectedNode"></actions>
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
      select: function(node) {
        this.selectedNode = node;
      }
    }
  }
</script>