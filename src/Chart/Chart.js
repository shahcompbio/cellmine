import React from "react";
import * as d3 from "d3";
import "d3-transition";
import CircleChart from "./CircleChart.js";

const Chart = ({ stats, library, samples }) => {
  //Chart dimensions according to screen size
  const windowDim = {
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    appWidth: window.innerWidth * 0.6,
    appHeight: window.innerHeight * 0.6,
    width: window.innerWidth * 0.6,
    height: window.innerHeight
  };

  //Global margins
  const margin = {
    top: windowDim.screenHeight / 10,
    right: 10,
    bottom: 5,
    left: windowDim.screenWidth / 10,
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
  function initializeSvg() {
    d3
      .select("#bubbles")
      .attr("width", windowDim.screenWidth + "px")
      .attr("height", windowDim.screenHeight + "px");

    return d3
      .select(".Charts")
      .attr("width", windowDim.screenWidth)
      .attr("height", windowDim.height)
      .classed("svg-container", true)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .select(".CircleChart")
      .attr(
        "viewBox",
        "0 0 " + windowDim.screenWidth * 0.7 + " " + windowDim.height + ""
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
        var formattedDescription = "<br/>";
        var descriptionArray = d.data.description.split("");
        descriptionArray.map((character, index) => {
          formattedDescription +=
            index % 25 === 0 && index !== 0
              ? character === " " ? "<br/>" : character + "-<br/>"
              : character;
        });

        //d.data.description.length;
        return (
          "<b>Sample</b>: " +
          d.data.sample +
          "<br/> <b>Library</b>: " +
          d.data.pool_id +
          "<br />" +
          "<b>Description</b>: " +
          d.data.description +
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
        initializeSvg={initializeSvg}
        showTooltip={showTooltip}
        hideTooltip={hideTooltip}
      />
    </div>
  );
};
export default Chart;
