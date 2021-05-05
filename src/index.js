import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import Markdown from "./markdown/Markdown.js";
import GuideToolTip from "./ToolTips/ToolTip.js";
import "babel-polyfill";

import { updateDimensions } from "./utils/updateDimensions.js";
const incompatibleBrowsers = ["ie", "edge", "safari"];

const { detect } = require("detect-browser");
const browser = detect();

if (incompatibleBrowsers.indexOf(browser.name) > -1) {
  let isAcceptedVersions = /^(11|10)./;
  if (browser.name === "safari" && isAcceptedVersions.test(browser.version)) {
    startApplication();
  } else {
    ReactDOM.hydrate(
      <Markdown type="Incompatible" />,
      document.querySelector("#incompatible")
    );
  }
} else {
  startApplication();
}

function startApplication() {
  ReactDOM.hydrate(<Markdown type="About" />, document.querySelector("#about"));
  ReactDOM.hydrate(<App />, document.querySelector("#bubbles"));
  window.onresize = updateDimensions;
}
