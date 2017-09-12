<template>
  <div>
    <h2>Control Panel</h2>

    <div class="row">
      <div class="col-sm-6">
        <number-form buttonText="Reset Network" :initialValue="12" v-on:submit="networkEmpty"></number-form>
      </div>
      <div class="col-sm-6">
        <number-form buttonText="Give Endowment" v-on:submit="giveEndowment"></number-form>
      </div>
    </div>

    <!--
    <button class="btn" v-on:click="networkMac">Generate Maximum Average Clustering</button>
    <button class="btn btn-primary "v-on:click="processActions">Process Actions</button>
    -->

  </div>
</template>

<script>
import NumberForm from '/imports/ui/NumberForm.vue';

export default {
  methods: {
    networkEmpty(numPlayers) {
      Meteor.call("network-empty", numPlayers);
    },
    'networkMac': function() {
      Meteor.call("network-max-avg-clust");
    },
    giveEndowment(amount) {
      Meteor.call("give-endowment", amount);
    },
    processActions() {
      Meteor.call("process-actions");
    }
  },
  components: {
    NumberForm
  }
}
</script>

<style>

</style>