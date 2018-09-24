import React, { Component } from "react";
import getData from "./utils/dataFetcher.js";
import Chart from "./Chart/Chart.js";
import Filters from "./Filters/Filters.js";
import "./App.css";
import GuideToolTip from "./ToolTips/ToolTip.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }

  componentDidMount() {
    const dataCallback = data => {
      this.setState({ data });
    };

    getData(dataCallback);
  }

  render() {
    return this.state.data === null ? null : (
      <div className="App">
        <div className="Filters">
          <span className="selectText">Select A Library:</span>
          <Filters
            filters={this.state.data.filters}
            librarySpecificFilters={this.state.data.librarySpecificFilters}
          />
        </div>
        <Chart
          stats={this.state.data.stats}
          library={this.state.data.library}
          samples={this.state.data.samples}
        />
        <i className="fa fa-3x fa-times" aria-hidden="true" />
        <div>
          <i className="fa fa-2x fa-question-circle" id="toolTipGuideButton" />
        </div>
        <GuideToolTip />
      </div>
    );
  }
}

export default App;
