<template>  
  <div>
    <router-link :to="{ name:'overview' }" exact>Overview</router-link>
    
    <router-link v-for="id in players" :to="{ name: 'player', params: { id } }" exact>Player {{ id }}</router-link>        
    
  </div>
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