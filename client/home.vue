<template>  
  <ul>
    <li>
      <router-link :to="{ name:'overview' }" exact>Overview</router-link>
    </li>
    
    <li v-for="id in players">
      <router-link :to="{ name: 'player', params: { id } }" exact>Player {{ id }}</router-link>            
    </li>
  </ul>
</template>

<script>
  export default {

    data: function() {
      return {
        players: [ 1, 2, 3, 4 ]
      }
    }

  }
</script>