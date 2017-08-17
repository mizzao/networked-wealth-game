<template>
  <div class="network">

  </div>
</template>

<script>
  import vis from 'vis';
  import Vue from 'vue';

  export default {

    data: function() {
      return  {
        nodes: [],
        edges: []
      }
    },

    meteor: {
      $subscribe: {
        'network': []
      },
      nodes() {
        return Nodes.find();
      },
      edges() {
        return Edges.find();
      }
    },
    
    mounted: function() {
      console.log(this.$el);

      // create an array with nodes
      const visNodes = new vis.DataSet([]);

      // create an array with edges
      const visEdges = new vis.DataSet([]);

      // create a network
      const options = {
        nodes: {
          shape: "dot",
          scaling: {
            min: 10,
            max: 30
          }
        }
      };

      const network = new vis.Network(this.$el, {
        nodes: visNodes,
        edges: visEdges
      }, options);
      
      // Watch for changes
      // Note this is not using Vue reactivity, but just passing changes directly to Vis
      this.nodesHandle = Nodes.find().observeChanges({
        added: (id, fields) => {
          visNodes.add(fields);
        },
        changed: function(id, fields) {
          fields.id = id;
          visNodes.update(fields);
        },
        removed: function(id) {
          visNodes.remove({id});
        }
      });

      this.edgesHandle = Edges.find().observeChanges({
        added: (id, fields) => {
          visEdges.add(fields);
        },
        changed: function(id, fields) {
          fields.id = id;
          visEdges.update(fields);
        },
        removed: function(id) {
          visEdges.remove({id});
        }
      });

      // Make sure we can see everything after loading
      Meteor.setTimeout( () => network.fit(), 4000 );
    },

    beforeDestroy: function() {
      this.nodesHandle.stop();
      this.edgesHandle.stop();
    }
  }

</script>

<style>
  .network {
    height: 600px;
    border: 1px solid #000;
  }
</style>
