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
      info = this.props.info,
      samples = this.props.samples,
      stats = this.props.stats,
      node = select(this.node),
      dim = this.props.windowDim,
      margin = this.props.margin,
      colourScale = this.props.colourScale,
      initializeSvg = this.props.initializeSvg.bind(this),
      hideTooltip = this.props.hideTooltip.bind(this),
      showTooltip = this.props.showTooltip.bind(this);

    const allowedFilters = [
      "anonymous_patient_id",
      "library",
      "sample",
      "sample_type",
      "cell_line_id",
      "taxonomy_id",
      "jira_ticket"
    ];
    //Initialize the bubble colours
    const chartColours = initializeChartColours(samples.length);
    initializeSvg();
    //Initialize location of circles according to similiar samples
    const clusters = getClusters();
    //Create a forced simulation and append circles to screen
    forceSimulation(libraries);

    function forceSimulation(updatedData) {
      return d3
        .forceSimulation(updatedData)
        .force("center", d3.forceCenter(dim.width / 2, dim.height / 2))
        .force("charge", d3.forceManyBody().strength(-55))
        .force("collision", d3.forceCollide().radius(d => d.r + 5))
        .force("x", d3.forceX().x(d => samples.indexOf(d.data.sample) * 25))
        .force("y", d3.forceY().y(d => d.y / 15))
        .alphaDecay(0.1)
        .alphaTarget(0.08)
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
    function shadeColor2(color, percent) {
      var f = parseInt(color.slice(1), 16),
        t = percent < 0 ? 0 : 255,
        p = percent < 0 ? percent * -1 : percent,
        R = f >> 16,
        G = (f >> 8) & 0x00ff,
        B = f & 0x0000ff;
      return (
        "#" +
        (
          0x1000000 +
          (Math.round((t - R) * p) + R) * 0x10000 +
          (Math.round((t - G) * p) + G) * 0x100 +
          (Math.round((t - B) * p) + B)
        )
          .toString(16)
          .slice(1)
      );
    }
    function ticked(updatedData) {
      const tickedChart = node
        .selectAll("circle")
        .data(updatedData)
        .style("fill", function(d, i) {
          return chartColours(samples.indexOf(d.data.sample));
        })
        .style("stroke", function(d, i) {
          var colour = chartColours(samples.indexOf(d.data.sample));
          return shadeColor2(colour, -0.2);
        })
        .style("stroke-width", "2px");

      tickedChart
        .enter()
        .append("a")
        .attr("target", "_blank")
        .append("circle")
        .attr("class", "circles")
        .attr("class", d => {
          var classes = "open-view ";
          allowedFilters.map(
            filter => (classes += "tag-" + d.data[filter] + " ")
          );
          return classes;
        })
        .attr("id", d => "library-" + d.data.id)
        .attr("data-filter-term", d => d.data.jira_ticket)
        .attr("data-sample-id", d => d.data.jira_ticket)
        .attr("data-template-id", "QC Dashboard")
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

    return <svg className="CircleChart" ref={node => (this.node = node)} />;
  }
}

export default CircleChart;
