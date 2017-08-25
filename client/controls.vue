<template>
  <div>
    <h2>Control Panel</h2>
    <button class="btn" v-on:click="networkEmpty">Generate Empty Network</button>
    <button class="btn" v-on:click="networkMac">Generate Maximum Average Clustering</button>
    <button class="btn btn-primary "v-on:click="processActions">Process Actions</button>
  </div>
</template>

<script>
export default {
  methods: {
    networkEmpty() {
      Meteor.call("network-empty");
    },
    'networkMac': function() {
      Meteor.call("network-max-avg-clust");
    },
    processActions() {
      Meteor.call("process-actions");
    }
  }
}
</script>

<style>

</style>