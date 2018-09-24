import React, { Component } from "react";
import * as d3 from "d3";
import { Tooltip } from "reactstrap";
import "font-awesome/css/font-awesome.min.css";
import "./Tooltip.css";

const guideMapping = {
  1: {
    className: ".CircleChart circle",
    message: "Choose a library by clicking on a circle",
    placement: "left",
    target: ".CircleChart",
    targetPaddingMin: 20,
    targetPaddingMax: 50
  },
  2: {
    className: ".control",
    message: "Filter out libraries by using these filters",
    placement: "left-start",
    target: "#filterContainerToolTip",
    targetPaddingMin: 5,
    targetPaddingMax: 5
  }
};

class GuideToolTip extends Component {
  state = {
    isOpen: false,
    step: 0,
    tooltipPlacement: "auto-start",
    target: "#bubbles"
  };

  resize = e => {
    var step = guideMapping[this.state.step];
    if (step !== undefined) {
      var c = {};
      //Find bounding box for tooltip target
      var boundingBoxElements = d3.selectAll(step.className);
      boundingBoxElements.nodes().map(element => {
        var elementDim = element.getBoundingClientRect();
        c["xMin"] = c.hasOwnProperty("xMin")
          ? elementDim.x < c.xMin ? elementDim.x : c.xMin
          : elementDim.x;
        c["yMin"] = c.hasOwnProperty("yMin")
          ? elementDim.y < c.yMin ? elementDim.y : c.yMin
          : elementDim.y;
        c["xMax"] = c.hasOwnProperty("xMax")
          ? elementDim.x + elementDim.width > c.xMax
            ? elementDim.x + elementDim.width
            : c.xMax
          : elementDim.x + elementDim.width;
        c["yMax"] = c.hasOwnProperty("yMax")
          ? elementDim.y + elementDim.height > c.yMax
            ? elementDim.y + elementDim.height
            : c.yMax
          : elementDim.y + elementDim.height;
      });
      //Add extra padding
      c.x = c["xMin"] - step.targetPaddingMin;
      c.y = c["yMin"] - step.targetPaddingMin;
      c.width = c["xMax"] - c["xMin"] + step.targetPaddingMax;
      c.height = c["yMax"] - c["yMin"] + step.targetPaddingMax;

      d3
        .select("#guide")
        .classed("hidden", false)
        .style("left", c.x + "px")
        .style("top", c.y + "px")
        .style("width", c.width + "px")
        .style("height", c.height + "px");
    }
  };
  //Continue onto next guide step
  nextStep = () => {
    this.setState({ step: ++this.state.step });
    //If the tooltip is open and there are more steps
    if (
      this.state.isOpen &&
      this.state.step <= Object.keys(guideMapping).length
    ) {
      //Get the step
      var step = guideMapping[this.state.step];
      this.setState({ tooltipPlacement: step.placement, target: step.target });

      //Move the tooltip target to the bounding box
      this.resize();
      //Append the tooltip message
      d3
        .select("#guideToolTip")
        .text(step.message)
        .append("i")
        .classed("fa fa-1x fa-arrow-right", true);

      //Only show once on init, first tooltip step
      if (this.state.step === 1) {
        this.showToolTipElements();
      }
    } else {
      //Hide all tool tip related elements
      d3.select("#guideToolTip").classed("hidden", true);
      d3.select(".bs-tooltip-left").classed("showGuideToolTip", false);
      d3.select("#guide").classed("hidden", true);

      //Reset the step to 0
      this.setState({ step: 0 });
    }
  };

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
    this.nextStep();
  };

  showToolTipElements = () => {
    d3.select(".bs-tooltip-left").classed("showGuideToolTip", true);
    d3.select(".showGuideToolTip").on("mousedown", this.nextStep);
  };
  componentDidMount() {
    //Trigger a toggle if the ? is pressed
    document
      .getElementById("toolTipGuideButton")
      .addEventListener("click", this.toggle);

    //Handle resize
    window.addEventListener("resize", this.resize);
  }

  render() {
    return (
      <Tooltip
        id="guideToolTip"
        placement={this.state.tooltipPlacement}
        isOpen={this.state.isOpen}
        target={this.state.target}
        arrowClassName="guideArrow"
      />
    );
  }
}
export default GuideToolTip;
