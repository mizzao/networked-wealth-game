import d3 from 'd3';

export default class ForceLayout {

  constructor(elem) {
    this.svg = elem;

    this.init();
  }

  setNodes(nodes) {
    console.log("Got nodes", nodes.length);
    if( nodes.length === 0 ) return;
    
    // This is kinda sketchy - depends on d3 and vue ordering to be the same
    // But also, whenever data is loaded, should have the right number of elements in the DOM
    const node = this.svg
    .selectAll(".nodes circle")
      .data(nodes)
    .attr("fill", (d) => this.color(d.size) )
    .call(d3.drag()
      .on("start", (d) => {
        if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", function(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      })
      .on("end", (d) => {
        if (!d3.event.active) this.simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      })
    );

    this.simulation
      .nodes(nodes)
      .on("tick.nodes", function() {
        node
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
      })
      .restart();
  }

  setEdges(edges) {
    console.log("Got edges", edges.length);
    if( edges.length === 0 ) return;

    d3.select(this.$el)
      .selectAll(".links line")
      .data(edges);

    this.simulation
      .on("tick.edges", function() {
        link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
      }).restart();
  }

  init() {
    // Based on code from https://bl.ocks.org/mbostock/4062045
    // Adapted to a JS object and Vue
    console.log("Setting up network");

    this.color = d3.scaleOrdinal(d3.schemeCategory20);



    // this.simulation.stop();
  }

}
