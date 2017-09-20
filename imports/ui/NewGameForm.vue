<template>
    <form class="form" v-on:submit.prevent="onSubmit">
      <div class="form-group">
        <label>Number of Players</label>
        <input class="form-control" v-model="players" type="number" min="1" max="50" step="1"></input>
      </div>
      <div class="form-group">
        <label>Giving Multiplier</label>
        <input class="form-control" v-model="multiplier" type="number" min="1" max="4" step="0.1"></input>
      </div>
      <div class="form-group">
        <label>Endowment Increment</label>
        <input class="form-control" v-model="endowmentIncrement" type="number" min="1" max="50" step="1"></input>
      </div>
      <div class="checkbox">
        <label>
          <input type="checkbox" v-model="wealthVisible">
          Show Wealth by Node Size
        </label>
      </div>
      <button class="btn btn-primary" type="submit">New Game</button>
    </form>
</template>

<script>
  export default {
    // Default form values
    data: function() {
      return {
        players: 12,
        multiplier: 2.0,
        endowmentIncrement: 10,
        wealthVisible: true
      }
    },
    methods: {
      onSubmit: function() {
        Meteor.call("new-game",
          parseInt(this.players),
          parseFloat(this.multiplier),
          parseInt(this.endowmentIncrement),
          this.wealthVisible
        );
      }
    }
  }
</script>
