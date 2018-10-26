import React, { Component } from "react";
import aboutMarkdown from "./about.md";
import incompatibleMarkdown from "./incompatible.md";
import fig1 from "./figures/fig1.png";
import fig2 from "./figures/fig2.png";
import IE from "./figures/IE.png";
import config from "../utils/config.js";
import * as d3 from "d3";

import "./Markdown.css";

var ReactMarkdown = require("react-markdown");
var Remarkable = require("remarkable");
var md = new Remarkable({ html: true, breaks: true });

class Markdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markdown: null
    };
  }

  componentDidMount() {
    const type = this.props.type;
    if (type === "About") {
      var markdown = aboutMarkdown;
    } else {
      var markdown = incompatibleMarkdown;
      d3.select("#incompatible").classed("hidden", false);
    }
    fetch(markdown, config.MARKDOWNCREDENTIALS)
      .then(response => {
        return response.text();
      })
      .then(text => {
        this.setState({
          markdown: text
        });
      });
  }

  render() {
    const { markdown } = this.state;
    const className = this.props.type + " App";
    var parsedMarkdown = md.render(markdown);
    return markdown === null ? null : (
      <div className={className}>
        <i
          className="fa fa-3x fa-times"
          aria-hidden="true"
          style={{ color: "#adadad" }}
        />
        <div dangerouslySetInnerHTML={{ __html: parsedMarkdown }} />
      </div>
    );
  }
}
export default Markdown;
