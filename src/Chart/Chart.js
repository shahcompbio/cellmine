import React, { Component } from "react";
import * as d3 from "d3";
import { select } from "d3";
import "d3-transition";
import CircleChart from "./CircleChart.js";

const Chart = ({ stats, library, samples }) => {
  //Chart dimensions according to screen size
  const windowDim = {
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    width: window.innerWidth * 0.9,
    height: window.innerHeight * 0.8
  };

  //Global margins
  const margin = {
    top: windowDim.screenHeight / 15,
    right: 10,
    bottom: 5,
    left: windowDim.screenWidth / 15,
    general: 10
  };

  //Global colour scales
  const colourScale = [
    [
      "#d8a8d4",
      "#ade1b8",
      "#a8b2e4",
      "#dbdba4",
      "#69c0df",
      "#d5ab84",
      "#91e5df",
      "#e4a0a7",
      "#65b8b1",
      "#92b283"
    ],
    [
      "#ff9f99",
      "#00d757",
      "#ffb3e7",
      "#befd0a",
      "#626dae",
      "#E2CD76",
      "#dcc5ff",
      "#009e4b",
      "#317b86",
      "#55ffeb"
    ],
    [
      "#7b4a6a",
      "#88b48d",
      "#485b86",
      "#c69a76",
      "#59afc5",
      "#edac9b",
      "#9ea1d2",
      "#B3AF83",
      "#d194ab",
      "#366a51"
    ],
    [
      "#759089",
      "#ffd4e9",
      "#90d3b2",
      "#d19a7a",
      "#90e2ff",
      "#D8D599",
      "#6fd2dd",
      "#e3f1d2",
      "#5d91aa",
      "#c8f5fa"
    ]
  ];
  /**
   * Initializes an svg element.
   *
   * @param {String} type - Class name for given svg.
   */
  function initializeSvg(type) {
    return d3
      .selectAll(type)
      .attr("width", windowDim.screenWidth)
      .attr("height", windowDim.screenHeight)
      .classed("svg-container", true)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr(
        "viewBox",
        "0 0 " + windowDim.screenWidth + " " + windowDim.screenHeight + ""
      )
      .classed("svg-content-responsive", true);
  }

  /**
   * Initialize the tooltip.
   */
  function initializeTooltip() {
    return d3
      .select("body")
      .append("div")
      .attr("class", "tooltip");
  }

  /**
   * Show the tooltip.
   *
   * @param {Object} d - data of hovered element
   */
  function showTooltip(d) {
    d3
      .select(".tooltip")
      .classed("hover", true)
      .html(function() {
        return (
          "<b>Sample</b>: " +
          d.data.sample +
          "<br/> <b>Library</b>: " +
          d.data.library +
          "<br /> <b>Total Cells</b>: " +
          d.data.size +
          "<br /> <b>Seq Date</b>: " +
          d3.timeFormat("%Y-%m-%d")(d.data.seq)
        );
      })
      .style("left", d3.event.pageX + "px")
      .style("top", d3.event.pageY + "px");
  }

  /**
   * Hide the tooltip.
   */
  function hideTooltip() {
    d3.select(".tooltip").classed("hover", false);
  }

  //Append the main CircleChart svg container
  initializeSvg(".CircleChart");
  initializeTooltip();

  return (
    <div className="Charts">
      <CircleChart
        library={library}
        samples={samples}
        stats={stats}
        margin={margin}
        windowDim={windowDim}
        colourScale={colourScale}
        showTooltip={showTooltip}
        hideTooltip={hideTooltip}
      />
    </div>
  );
};
export default Chart;
