<template>
  <div class="row">
    <div class="col-sm-6">
      <router-link class="btn btn-lg btn-success" :to="{ name:'overview' }" exact>Overview</router-link>
      <router-link class="btn btn-lg btn-warning" :to="{ name:'controls' }" exact>Control Panel</router-link>
    </div>

    <div class="clearfix"></div>

    <div class="col-sm-3" v-for="(node, idx) in nodes">
      <div class="well">
      <router-link class="btn btn-lg btn-primary" :to="{ name: 'player', params: { myNodeId: node._id } }" exact>
        Player {{ idx+1 }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {

    data: function() {
      return  {
        nodes: []
      }
    },

    meteor: {
      $subscribe: {
        'network': []
      },
      nodes() {
        return Nodes.find();
      }
    }

  }
</script>