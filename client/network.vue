<template>
    <svg :width="width" :height="height">
        <g :style="{transform: `translate(${width/2}px, ${height/2}px)`}">
            <g class="links">
                <line v-for="edge in edges"
                      :stroke-width="Math.sqrt(edge.value)">
                </line>
            </g>
            <g class="nodes">
                <circle v-for="node in nodes" :r="node.size * 2">
                    <title>{{ node._id }}</title>
                </circle>
            </g>
        </g>
    </svg>
</template>

<script>
  import d3 from 'd3';
  import ForceLayout from './forceLayout';

  export default {
    props: {
      width: {
        type: Number,
        default: 800
      },
      height: {
        type: Number,
        default: 600
      }
    },

    data() { // default data initialization
      return {
        nodes: [],
        edges: []
      }
    },

    // Subscribe to network, and update data from observer
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

    watch: {
      nodes: function() {
        this.layout.setNodes(this.nodes);
      },
      edges: function() {
        this.layout.setEdges(this.edges);
      }
    },

    created: function() {
      
    },
    mounted: function() {
      const svg = d3.select(this.$el);

      this.layout = new ForceLayout(svg.select('g'));
    }

  }
</script>

<style>
    .links line {
        stroke: #999;
        stroke-opacity: 0.6;
    }

    .nodes circle {
        stroke: #fff;
        stroke-width: 1.5px;
    }
</style>
