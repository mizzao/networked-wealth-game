<template>
  <div>
    <h2>Player Actions</h2>
    
    <h3>
      Currently selected: {{ selectedPlayer }}
    </h3>

    <h3 v-if="player">
      Wealth: {{player.value}}
    </h3>

  </div>
</template>

<script>
export default {
  props: [ 'selectedPlayer' ],
  data: function() {
    return {
      player: null
    }
  },
  meteor: {
    player: {
      params() {
        return {
          id: this.selectedPlayer
        };
      },
      update({id}) {
        return Nodes.findOne(id);
      }
    }
  },
  methods: {
    
  }
}
</script>

<style>

</style>