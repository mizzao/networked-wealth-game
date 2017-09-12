<template>
    <form class="form-inline" v-on:submit.prevent="onSubmit">
      <div class="form-group">
      <input class="form-control" v-model="amount" type="number" min="1" max="50"></input>
      <button class="btn btn-primary" type="submit">{{ buttonText }}</button>
      </div>
    </form>
</template>

<script>
  export default {
    props: {
      buttonText: String,
      initialValue: {
        type: Number,
        default: 10
      }
    },
    data: function() {
      return {
        amount: this.initialValue
      }
    },
    methods: {
      onSubmit: function() {
        this.$emit("submit", parseInt(this.amount) );
      }
    }
  }
</script>
