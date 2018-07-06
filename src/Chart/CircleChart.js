import React, { Component } from "react";
import * as d3 from "d3";
import { select } from "d3";

class CircleChart extends Component {
  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate() {
    this.createChart();
  }

  createChart() {
    const libraries = this.props.library,
      samples = this.props.samples,
      stats = this.props.stats,
      node = select(this.node),
      dim = this.props.windowDim,
      margin = this.props.margin,
      colourScale = this.props.colourScale,
      hideTooltip = this.props.hideTooltip.bind(this),
      showTooltip = this.props.showTooltip.bind(this),
      colossusUrl = "https://40.86.218.15:44111/?dashboard=";

    //Initialize the bubble colours
    const chartColours = initializeChartColours(samples.length);

    //Initialize location of circles according to similiar samples
    const clusters = getClusters();
    //Create a forced simulation and append circles to screen
    forceSimulation(libraries);

    function forceSimulation(updatedData) {
      //Hide the chart if looking at
      if (d3.select("#visualization-area").childElementCount != 0) {
        d3.select("#bubbles").classed("hideBubbles", true);
      }

      return d3
        .forceSimulation(updatedData)
        .force("center", d3.forceCenter(dim.width / 2, dim.height / 2))
        .force("charge", d3.forceManyBody().strength(-30))
        .force("collision", d3.forceCollide().radius(d => d.r + 2))
        .force("x", d3.forceX().x(d => samples.indexOf(d.data.sample) * 20))
        .force("y", d3.forceY().y(d => d.y / 6))
        .force("cluster", clustering)
        .on("tick", function() {
          ticked(updatedData);
        });
    }

    function getClusters() {
      const clusters = new Array(samples.length);

      libraries.forEach(function(d) {
        const i = samples.indexOf(d.data.sample);
        if (!clusters[i] || d.r > clusters[i].r) {
          clusters[i] = d;
        }
      });

      return clusters;
    }

    function clustering(alpha) {
      return libraries.map(node => {
        const cluster = clusters[samples.indexOf(node.data.sample)];
        if (cluster === node) return;
        var x = node.x - cluster.x,
          y = node.y - cluster.y,
          l = Math.sqrt(x * x + y * y),
          r = node.r + cluster.r;
        if (l !== r) {
          l = (l - r) / l * alpha;
          node.x -= x *= l;
          node.y -= y *= l;
          cluster.x += x;
          cluster.y += y;
        }
      });
    }

    function ticked(updatedData) {
      const tickedChart = node
        .selectAll("circle")
        .data(updatedData)
        .style("fill", function(d, i) {
          return chartColours(samples.indexOf(d.data.sample));
        });

      tickedChart
        .enter()
        .append("a")
        .attr("href", function(d) {
          return colossusUrl + d.data.ticket;
        })
        .attr("target", "_blank")
        .append("circle")
        .attr("class", "circles")
        .attr("class", d => "sample-" + d.data.sample)
        .attr("id", d => "library-" + d.data.id)
        .on("mouseenter", showTooltip)
        .on("mouseleave", hideTooltip)
        .merge(tickedChart)
        .attr("r", d => d.r)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      tickedChart.exit().remove();
    }

    function initializeChartColours(libraryCount) {
      //Choose a random colour scale
      var randomScaleIndex = Math.floor(Math.random() * colourScale.length);
      return d3
        .scaleOrdinal()
        .range(colourScale[randomScaleIndex])
        .domain([0, libraryCount]);
    }
  }
  render() {
    if (this.props.data === null) {
      return null;
    }

    return (
      <svg
        className="CircleChart"
        ref={node => (this.node = node)}
        width={this.props.windowDim.width}
        height={this.props.windowDim.height}
      />
    );
  }
}

export default CircleChart;
