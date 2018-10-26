import * as d3 from "d3";

export const setTooltipDimensions = step => {
  var c = { targetPaddingMax: {}, targetPaddingMin: {} };
  //Find bounding box for tooltip target
  var boundingBoxElements = d3.selectAll(step.className);

  boundingBoxElements.nodes().map(element => {
    var elementDim = element.getBoundingClientRect();

    c["xMin"] = c.hasOwnProperty("xMin")
      ? elementDim.x < c.xMin ? elementDim.x : c.xMin
      : elementDim.x;
    if (
      c["xMin"] === elementDim.x &&
      !step.hasOwnProperty("targetPaddingMin")
    ) {
      c.targetPaddingMin["x"] = elementDim.width / 2;
    }

    c["yMin"] = c.hasOwnProperty("yMin")
      ? elementDim.y < c.yMin ? elementDim.y : c.yMin
      : elementDim.y;
    if (
      c["yMin"] === elementDim.y &&
      !step.hasOwnProperty("targetPaddingMin")
    ) {
      c.targetPaddingMin["y"] = elementDim.height;
    }

    c["xMax"] = c.hasOwnProperty("xMax")
      ? elementDim.x + elementDim.width > c.xMax
        ? elementDim.x + elementDim.width
        : c.xMax
      : elementDim.x + elementDim.width;
    if (
      c["xMax"] === elementDim.x + elementDim.width &&
      !step.hasOwnProperty("targetPaddingMax")
    ) {
      c.targetPaddingMax["x"] = elementDim.width * 2;
    }

    c["yMax"] = c.hasOwnProperty("yMax")
      ? elementDim.y + elementDim.height > c.yMax
        ? elementDim.y + elementDim.height
        : c.yMax
      : elementDim.y + elementDim.height;

    if (
      c["yMax"] === elementDim.y + elementDim.height &&
      !step.hasOwnProperty("targetPaddingMax")
    ) {
      c.targetPaddingMax["y"] = elementDim.height * 2;
    }
  });
  if (!step.hasOwnProperty("targetPaddingMax")) {
    step.targetPaddingMax = { ...c.targetPaddingMax };
  }
  if (!step.hasOwnProperty("targetPaddingMin")) {
    step.targetPaddingMin = { ...c.targetPaddingMin };
  }
  c.x = c["xMin"] - step.targetPaddingMin.x;

  c.y = c["yMin"] - step.targetPaddingMin.y;

  c.width = c["xMax"] - c["xMin"] + step.targetPaddingMax.x;

  c.height = c["yMax"] - c["yMin"] + step.targetPaddingMax.y;

  return c;
};
