import * as d3 from "d3";

export const updateDimensions = () => {
  if (d3.select(".Filters").node() !== null) {
    updateWindowDimensions(".App");
    updateFilterDimensions();
    updateBubblesDimensions();
  }
  if (d3.select(".About").node() !== null) {
    updateWindowDimensions(".App");
  }
};

function updateFilterDimensions() {
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
        : containerHeight / numOptions < 60 ? 60 : containerHeight / numOptions;

  d3.selectAll(".option").style("height", optionHeight + "px");
}

export const getBubbleWindowRatio = () => {
  return window.innerWidth >= 2000
    ? 0.5
    : window.innerWidth <= 2000 && window.innerWidth >= 1200 ? 0.7 : 1;
};

function getBubbleAppRatio() {
  var appDim = getBoundingBox(".App").width;
  return appDim + "px" === d3.select(".App").style("min-width")
    ? 1.5
    : appDim + "px" === d3.select(".App").style("max-width") ? 1.3 : 1.4;
}

function updateWindowDimensions(className) {
  var appDim = getBoundingBox(className);

  if (appDim.width === 1200) {
    d3.selectAll(className).style("margin-left", "25vw");
  } else {
    d3.selectAll(className).style("margin-left", "20vw");
  }
}
function updateBubblesDimensions(simulation) {
  var appWidth = getBoundingBox(".App").width;
  var viewBoxRatio = getBubbleAppRatio();
  d3
    .select(".CircleChart")
    .attr("viewBox", "0 0 " + appWidth * viewBoxRatio + " 1500");
}

export const getBoundingBox = elementName => {
  return d3
    .select(elementName)
    .node()
    .getBoundingClientRect();
};
