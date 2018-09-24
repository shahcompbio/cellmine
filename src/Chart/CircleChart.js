import React, { Component } from "react";
import * as d3 from "d3";
import { select } from "d3";

class CircleChart extends Component {
  constructor(props) {
    super(props);
    this.state = { simulation: null };
  }

  componentDidMount() {
    this.createChart();
  }
  updateDimensions = () => {
    this.updateCircleDimensions();
    this.updateFilterDimensions();
  };
  updateCircleDimensions() {
    if (this.state !== null) {
      var appDim = d3
        .select(".App")
        .node()
        .getBoundingClientRect();

      var circleChartDim = d3
        .select(".CircleChart")
        .node()
        .getBoundingClientRect();

      var forceBubblesLeft = appDim.x + appDim.width / 3;
      var forceBubblesTop = appDim.y + appDim.height / 2;
      var bubblesX = appDim.x + appDim.width * 0.3 - circleChartDim.x;
      var bubblesY = appDim.y + appDim.height / 15 - circleChartDim.y;

      d3
        .select(".CircleChart")
        .attr("transform", "translate(" + bubblesX + "," + bubblesY + ")");

      this.state.simulation.force(
        "center",
        d3.forceCenter(forceBubblesLeft, forceBubblesTop)
      );
    }
  }
  updateFilterDimensions() {
    var containerHeight = d3
      .select(".App")
      .node()
      .getBoundingClientRect().height;
    var numOptions = d3.selectAll(".option")._groups[0].length + 2;
    //Dealing with firefox and chrome
    var optionHeight =
      containerHeight > 602 && containerHeight < 604
        ? 65
        : containerHeight / numOptions > 90
          ? 90
          : containerHeight / numOptions < 60
            ? 60
            : containerHeight / numOptions;

    d3.selectAll(".option").style("height", optionHeight + "px");
  }
  createChart() {
    const libraries = this.props.library,
      samples = this.props.samples,
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
    const simulation = forceSimulation(libraries);

    this.setState({ simulation: simulation }, () => this.updateDimensions());

    window.addEventListener("resize", this.updateFilterDimensions);

    function forceSimulation(updatedData) {
      var horizontalSpread = window.innerWidth * 0.6 < 750 ? 15 : 20;

      return d3
        .forceSimulation(updatedData)
        .force("charge", d3.forceManyBody().strength(-55))
        .force("collision", d3.forceCollide().radius(d => d.r + 5))
        .force(
          "x",
          d3.forceX().x(d => samples.indexOf(d.data.sample) * horizontalSpread)
        )
        .force("y", d3.forceY().y(d => d.y / 10))
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
        .attr("data-template-id", d => d.data.dashboard)
        .attr("data-quality-filter", d => d.data.quality)
        .on("mouseenter", showTooltip)
        .on("mouseleave", hideTooltip)
        .merge(tickedChart)
        .attr("r", d => d.r)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
      //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
