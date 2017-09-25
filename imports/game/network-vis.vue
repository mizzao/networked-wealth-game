<template>
  <div class="network">

  </div>
</template>

<script>
  import vis from 'vis';
  import Vue from 'vue';
  import Config from '/imports/config';

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
        'game': function() {
          return [ false ]; // Just get the active game
        },
        'network': function() {
          return [ this.playerId ];
        },
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

      // create a network
      // For more information on this library see http://visjs.org/docs/network/
      const options = {
        nodes: {
          shape: "dot"
          // Scaling options determined by network settings, see below
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
        },
        layout: {
          improvedLayout: true
        },
        physics: { // These parameters can improve the rendering of the network layout
          solver: "forceAtlas2Based"
          // Playing with these parameters didn't really work, so went with the above
          // barnesHut: {
          //   gravitationalConstant: -5000,
          //   centralGravity: 0.3,
          //   springLength: 90,
          //   springConstant: 0.1,
          //   damping: 0.7,
          //   avoidOverlap: 0
          // }
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

      // Watch for changes to the active game, wealth visibility etc
      this.gameHandle = Games.find().observeChanges({
        added: (id, fields) => {
          // Show wealth in overview mode, or according to game settings
          const wealthVisible = fields.wealthVisible || !this.playerId;
          this.setWealthVisibility(wealthVisible);
        }
      });

      // Watch for changes
      // Note this is not using Vue reactivity, but just passing changes directly to Vis
      this.nodesHandle = Nodes.find().observeChanges({
        added: (id, fields) => {
          // We have to copy _id to id here, or it won't sync correctly
          fields.id = id;
          // Set special color for myself
          if (id === this.playerId) fields.color = Config.player.ownColor;
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
      Meteor.setTimeout( () => {
        // If we browsed off too quickly, might throw an error
        try { this.network.fit(); }
        catch(e) {}
      }, 3000 );
    },
    methods: {
      setWealthVisibility(visible = true) {
        // XXX seems to be a bug in vis.js:
        // If there are no edges, this setting seems to be ignored.
        // This is a corner case and shouldn't affect this demo game too much:
        // At the beginning of the game everyone is the same size, and as soon as edges are added this displays properly.

        if (visible) {
          console.log("Wealth shown by node size.");
          this.network.setOptions({
            nodes: {
              scaling: {
                min: 5, // Minimum node size (otherwise we can't click on it)
                customScalingFunction(min, max, total, value) {
                  // Scale node diameter according to sqrt
                  // Also, don't take into account minimum values. Show absolute value.
                  // See docs: http://visjs.org/docs/network/nodes.html
                  if (max == min) return 0;
                  const scale = 1 / Math.sqrt(Math.max(Config.network.largestNodeSize, max));
                  return Math.max(0, Math.sqrt(value) * scale);
                }
              }
            }
          })
        }
        else {
          console.log("Wealth not visible by node size.");
          this.network.setOptions({
            nodes: {
              scaling: {
                min: 15,
                max: 15
              }
            }
          })
        }
      }
    },
    beforeDestroy: function() {
      this.gameHandle.stop();
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
