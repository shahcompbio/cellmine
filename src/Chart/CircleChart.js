import React, { Component } from "react";
import * as d3 from "d3";
import { select } from "d3";
import "./Circle.css";
import { updateDimensions, getBoundingBox } from "../utils/updateDimensions.js";
import { shadeColor, allowedFilters, colourScale } from "./ChartHelper.js";

class CircleChart extends Component {
  constructor(props) {
    super(props);
    this.state = { simulation: null, height: null, width: null };
  }

  componentDidMount() {
    this.createChart();
  }

  updateCirclePosition = () => {
    //Resize circles according to screen size
    var appDim = getBoundingBox(".App");

    var widthRatio, heightRatio;
    if (appDim.width + "px" === d3.select(".App").style("max-width")) {
      widthRatio = 50;
      heightRatio = 1.5;
    } else if (appDim.width + "px" === d3.select(".App").style("min-width")) {
      widthRatio = 250;
      heightRatio = 1;
    } else {
      widthRatio = 200;
      heightRatio = 1.3;
    }

    var forceBubblesLeft = appDim.x + widthRatio;
    var forceBubblesTop = appDim.y + appDim.height / heightRatio;

    var resizeWidth = window.innerWidth;
    var resizeHeight = window.innerHeight;
    var resizeRadiusRatio =
      (resizeWidth / this.state.width + resizeHeight / this.state.height) / 2;

    this.props.library.map(node => (node.r = node.r * resizeRadiusRatio));
    //reforce and restart simulation
    this.state.simulation
      .force("center", d3.forceCenter(forceBubblesLeft, forceBubblesTop))
      .force("collision", d3.forceCollide().radius(d => d.r + 5))
      .force("radius", d => d.r)
      .restart();
    //set the state with new dimsensions
    this.setState({ width: resizeWidth, height: resizeHeight });
  };

  createChart() {
    const libraries = this.props.library,
      samples = this.props.samples,
      node = select(this.node),
      initializeSvg = this.props.initializeSvg.bind(this),
      hideTooltip = this.props.hideTooltip.bind(this),
      showTooltip = this.props.showTooltip.bind(this);

    //Initialize the bubble colours
    const chartColours = initializeChartColours(samples.length);
    initializeSvg();
    //Initialize location of circles according to similiar samples
    const clusters = getClusters();
    //Create a forced simulation and append circles to screen
    const simulation = forceSimulation(libraries);

    //  this.setState({ simulation: simulation }, () => this.updateDimensions());
    this.setState({ width: window.innerWidth, height: window.innerHeight });
    this.setState({ simulation: simulation }, () =>
      this.updateCirclePosition()
    );
    //Update app dimensions
    updateDimensions();
    var that = this;
    window.addEventListener("resize", that.updateCirclePosition);

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

    function ticked(updatedData) {
      var circleDim = getBoundingBox(".CircleChart");

      const tickedChart = node
        .selectAll("circle")
        .data(updatedData)
        .style("fill", function(d, i) {
          return chartColours(samples.indexOf(d.data.sample));
        })
        .style("stroke", function(d, i) {
          var colour = chartColours(samples.indexOf(d.data.sample));
          return shadeColor(colour, -0.2);
        })
        .style("stroke-width", "2px");

      tickedChart
        .enter()
        .append("a")
        .attr("target", "_blank")
        .append("circle")
        .attr("class", "circles")
        .attr("class", "open-view")
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
