<template>
  <div>
    <h2>Control Panel</h2>
    <button v-on:click="networkMac">Generate Maximum Average Clustering</button>
  </div>
</template>

<script>
export default {
  methods: {
    'networkMac': function() {
      Meteor.call("network-max-avg-clust");
    }
  }
}
</script>

<style>

</style>