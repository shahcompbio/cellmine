import React, { Component } from "react";
import getData from "./utils/dataFetcher.js";
import Chart from "./Chart/Chart.js";
import Filters from "./Filters/Filters.js";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/js/bootstrap.min.js";

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
        <Chart
          stats={this.state.data.stats}
          library={this.state.data.library}
          samples={this.state.data.samples}
        />
        <Filters
          filters={this.state.data.filters}
          librarySpecificFilters={this.state.data.librarySpecificFilters}
        />
      </div>
    );
  }
}

export default App;
