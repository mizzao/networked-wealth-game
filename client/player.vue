<template>
  <div>
    User {{ $route.params.id }}
    <network-vis v-bind:player-id="$route.params.id"></network-vis>
  </div>  
</template>

<script>  
  import NetworkVis from '/client/network-vis.vue';

  export default {
    components: {
      'network-vis': NetworkVis
    }
  }
</script>