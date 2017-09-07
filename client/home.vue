<template>  
  <ul>
    <li>
      <router-link :to="{ name:'overview' }" exact>Overview</router-link>
    </li>
    
    <li v-for="(node, idx) in nodes">
      <router-link :to="{ name: 'player', params: { myNodeId: node._id } }" exact>Player {{ idx+1 }}</router-link>            
    </li>

    <li>
      <router-link :to="{ name:'controls' }" exact>Control Panel</router-link>
    </li>
  </ul>
</template>

<script>
  export default {

    data: function() {
      return  {
        nodes: []
      }
    },

    meteor: {
      $subscribe: {
        'network': []
      },
      nodes() {
        return Nodes.find();
      }
    }

  }
</script>