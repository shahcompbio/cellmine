import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import About from "./About/About";

ReactDOM.render(<About />, document.querySelector("#about"));
ReactDOM.render(<App />, document.querySelector("#bubbles"));
