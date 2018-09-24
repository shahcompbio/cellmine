import React, { Component } from "react";
import markdown from "../markdown/about.md";
import fig1 from "../markdown/figures/fig1.png";
import fig2 from "../markdown/figures/fig2.png";
import config from "../utils/config.js";

import "./About.css";
var Markdown = require("react-markdown");
var Remarkable = require("remarkable");
var md = new Remarkable({ html: true, breaks: true });

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markdown: null
    };
  }

  componentDidMount() {
    const url = config.URL;

    fetch(markdown, config.ABOUTCREDENTIALS)
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
    var parsedMarkdown = md.render(markdown);
    return markdown === null ? null : (
      <div className="about-content">
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
export default About;
