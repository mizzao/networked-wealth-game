<template>
  <div>
    <h2>Control Panel</h2>  
      <div class="form-group">
        <button class="btn" v-on:click="networkEmpty">Generate Empty Network</button>
      </div>
    
    <number-form buttonText="Give Endowment" v-on:submit="giveEndowment"></number-form>    
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
    networkEmpty() {
      Meteor.call("network-empty");
    },
    'networkMac': function() {
      Meteor.call("network-max-avg-clust");
    },
    giveEndowment: function(amount) {
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