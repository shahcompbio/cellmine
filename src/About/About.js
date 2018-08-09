import React, { Component } from "react";
import markdown from "../markdown/about.md";
import "./About.css";
var Markdown = require("react-markdown");

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markdown: null
    };
  }

  componentDidMount() {
    fetch(markdown)
      /*fetch("build" + markdown, {
      credentials: "same-origin"
    })*/
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
    return markdown === null ? null : (
      <div className="about-content">
        <i
          class="fa fa-3x fa-times"
          aria-hidden="true"
          style={{ color: "#adadad" }}
        />
        <Markdown source={markdown} />
      </div>
    );
  }
}

export default About;
