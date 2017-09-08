<template>
    <form class="form-inline" v-on:submit.prevent="onSubmit">
      <div class="form-group">
      <input class="form-control" v-model="amount" type="number" min="1" max="20"></input>
      <button class="btn btn-primary" type="submit">{{ buttonText }}</button>
      </div>
    </form>
</template>

<script>
  export default {
    props: [ 'buttonText' ],
    data: function() {
      return {
        amount: 10
      }
    },
    methods: {
      onSubmit: function() {
        this.$emit("submit", parseInt(this.amount) );
      }
    }
  }
</script>
