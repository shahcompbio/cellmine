import React from "react";
import * as d3 from "d3";
import "d3-transition";
import CircleChart from "./CircleChart.js";
import { getBubbleWindowRatio } from "../utils/updateDimensions.js";
const Chart = ({ stats, library, samples }) => {
  /**
   * Initializes an svg element.
   *
   * @param {String} type - Class name for given svg.
   */
  function initializeSvg() {
    var windowWidthRatio = getBubbleWindowRatio();

    d3
      .select("#bubbles")
      .attr("width", "100%")
      .attr("height", "100%");

    return d3
      .select(".Charts")
      .attr("width", "70%")
      .attr("height", "100%")
      .classed("svg-container", true)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .select(".CircleChart")
      .attr("viewBox", "0 0 " + window.innerWidth * windowWidthRatio + " 1500")
      .classed("svg-content-responsive", true)
      .attr("id", "bubbleChartToolTip");
  }
  /**
   * Initialize the tooltip.
   */
  function initializeTooltip() {
    return d3
      .select("body")
      .append("div")
      .attr("class", "chartToolTip");
  }

  /**
   * Show the tooltip.
   *
   * @param {Object} d - data of hovered element
   */
  function showTooltip(d) {
    d3
      .select(".chartToolTip")
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
    d3.select(".chartToolTip").classed("hover", false);
  }

  //Append the main CircleChart svg container
  initializeSvg();
  initializeTooltip();

  return (
    <div className="Charts">
      <CircleChart
        library={library}
        samples={samples}
        stats={stats}
        initializeSvg={initializeSvg}
        showTooltip={showTooltip}
        hideTooltip={hideTooltip}
      />
    </div>
  );
};
export default Chart;
