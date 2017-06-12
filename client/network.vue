<template>
    <svg width="800" height="600"></svg>
</template>

<script>
  import d3 from 'd3';
  import ForceLayout from './forceLayout';

  export default {
    props: [],
    data() { // default data initialization
      return {
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
      const width = +svg.attr('width');
      const height = +svg.attr('height');

      const g = svg.append('g').attr('transform',
        `translate(${width/2}, ${height/2})`);

      this.layout = new ForceLayout(g);
    }

  }
</script>
