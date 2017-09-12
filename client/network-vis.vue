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
      // create an array with nodes
      const visNodes = new vis.DataSet([]);

      // create an array with edges
      const visEdges = new vis.DataSet([]);

      const BIGNODE_SIZE = 50;

      // create a network
      const options = {
        nodes: {
          shape: "dot",
          scaling: {
            min: 5, // Minimum node size (otherwise we can't click on it)
            customScalingFunction(min, max, total, value) {
              // Scale node diameter according to sqrt
              // Also, don't take into account minimum values. Show absolute value.
              // See docs: http://visjs.org/docs/network/nodes.html
              if (max == min) return 0;
              const scale = 1 / Math.sqrt(Math.max(BIGNODE_SIZE, max));
              return Math.max(0, Math.sqrt(value) * scale);
            }
          }
        },
        edges: {
          color: {
            inherit: "from" // Makes outgoing edges share color of self node
          },
          scaling: {
            min: 3 // Minimum edge thickness (so the line isn't too skinny)
          }
        },
        interaction: {
          hover: true
        }
      };

      this.network = new vis.Network(this.$el, {
        nodes: visNodes,
        edges: visEdges
      }, options);

      // Bind events to network
      // Hovering and blurring nodes
      this.network.on("hoverNode", (e) => {
        this.$emit('hoveredNode', e.node);
      });
      this.network.on("blurNode", (e) => {
        this.$emit('hoveredNode', null);
      });

      // Clicking on nodes
      this.network.on("click", (selection) => {
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
          // Set special color for myself
          if (id === this.playerId) fields.color = "#E50000";
          visNodes.add(fields);
        },
        changed: function(id, fields) {
          fields.id = id;
          visNodes.update(fields);
        },
        removed: (id) => {
          visNodes.remove({id});

          // A dirty hack to go back to the home page upon a route reset
          if (id === this.playerId) this.$router.push('/');
        }
      });

      this.edgesHandle = Edges.find().observeChanges({
        added: (id, fields) => {
          // Save id for later removal
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
      Meteor.setTimeout( () => this.network.fit(), 3000 );
    },

    beforeDestroy: function() {
      this.nodesHandle.stop();
      this.edgesHandle.stop();

      this.network.destroy();
    }
  }

</script>

<style>
  .network {
    height: 600px;
    border: 1px solid #000;
  }
</style>
