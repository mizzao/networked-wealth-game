import d3 from 'd3';

export default class ForceLayout {

  constructor(elem) {
    this.svg = elem;

    this.init();
  }

  setNodes(nodes) {
    console.log("Got nodes", nodes);
    
    // Could transform data some way here
    this.nodes = nodes;

    const nodeEnter = this.node.data(this.nodes)
    .enter().append("circle")
      .attr("r", (d) => d.size * 2);
    // .attr("fill", function(d) { return color(d.size); });
    // .call(d3.drag()
    //   .on("start", dragstarted)
    //   .on("drag", dragged)
    //   .on("end", dragended));

    nodeEnter.append("title")
      .text(function(d) { return d.id; });

    this.simulation
      .nodes(this.nodes, (d) => d._id)
      .on("tick", () => {
        this.link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

        this.node
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
      });

    this.simulation.restart();
  }

  setEdges(edges) {
    console.log("Got edges", edges);

    this.edges = edges;

    this.link.data(this.edges)
    .enter().append("line")
      .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

    this.simulation.force("link")
      .links(this.edges);

    this.simulation.restart();
  }

  init() {
    // Based on code from https://bl.ocks.org/mbostock/4062045
    // Adapted to a JS object

    // this.color = d3.scaleOrdinal(d3.schemeCategory20);

    this.simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(0, 0)); // already centered by outside g

    this.link = this.svg.append("g")
      .attr("class", "links")
    .selectAll("line")

    this.node = this.svg.append("g")
      .attr("class", "nodes")
    .selectAll("circle")

    // this.simulation.stop();
  }

}
