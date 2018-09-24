import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import About from "./About/About";
import GuideToolTip from "./ToolTips/ToolTip.js";

//ReactDOM.hydrate(<About />, document.querySelector("#about"));
ReactDOM.hydrate(<App />, document.querySelector("#bubbles"));
