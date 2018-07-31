import React, { Component } from "react";
var Markdown = require("react-markdown");

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markdown: null
    };
  }

  componentWillMount() {
    const markdown = require("./markdown/about.md");

    fetch(markdown)
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
    return markdown === null ? null : <Markdown source={markdown} />;
  }
}

export default About;
