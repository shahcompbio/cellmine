import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import About from "./About/About";
import GuideToolTip from "./ToolTips/ToolTip.js";

import { updateDimensions } from "./utils/updateDimensions.js";

//ReactDOM.hydrate(<About />, document.querySelector("#about"));
ReactDOM.hydrate(<App />, document.querySelector("#bubbles"));
window.onresize = updateDimensions;
