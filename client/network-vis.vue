<template>
  <div class="network">

  </div>
</template>

<script>
  import vis from 'vis';
  import Vue from 'vue';

  export default {
    props: [ 'playerId' ],

    data: function() {
      return  {
        nodes: [],
        edges: []
      }
    },

    meteor: {
      $subscribe: {
        'network': function() {
          return [ this.playerId ];
        }
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
        },
        interaction: {
          hover: true
        }
      };

      const network = new vis.Network(this.$el, {
        nodes: visNodes,
        edges: visEdges
      }, options);

      // Bind events to network
      // Hovering and blurring nodes
      network.on("hoverNode", (e) => {
        console.log(e);
        this.$emit('hoveredNode', e.node);
      });
      network.on("blurNode", (e) => {
        this.$emit('hoveredNode', null);
      });

      // Clicking on nodes
      network.on("click", (selection) => {
        const node = selection.nodes[0];
        if (node == null) return;
        this.$emit('clickedNode', node);
      });
      
      // Watch for changes
      // Note this is not using Vue reactivity, but just passing changes directly to Vis
      this.nodesHandle = Nodes.find().observeChanges({
        added: (id, fields) => {
          // We have to copy _id to id here, or it won't sync correctly
          fields.id = id;
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
          fields.id = id;
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
