import React, { Component } from "react";
import * as d3 from "d3";
import Select from "react-select";
import makeAnimated from "react-select/lib/animated";
import ReactResponsiveSelect from "react-responsive-select";
import GuideToolTip from "../ToolTips/ToolTip.js";

class Filters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allowedChoosenFilters: [],
      allowedLibraries: this.props.librarySpecificFilters,
      selectedOption: null
    };
    this.allowedFilters = {
      anonymous_patient_id: "Patient ID",
      library: "Library",
      pool_id: "Library ID",
      sample_type: " Sample Type",
      cell_line_id: "Cell Line ID",
      taxonomy_id: "Taxonomy",
      jira_ticket: "Dataset",
      xenograft_id: "Xenograft ID"
    };
  }
  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate() {
    this.createChart();
  }

  createChart() {
    const allowedLibraries = this.state.allowedLibraries;

    function applyFilter() {
      d3.selectAll(".CircleChart circle").classed("hidden", true);

      allowedLibraries.map(library => {
        d3
          .selectAll(".CircleChart circle.tag-" + library["jira_ticket"])
          .classed("hidden", false)
          .attr("r", 5)
          .transition()
          .duration(500)
          .attr("r", d => d.r);
      });
    }
    applyFilter();
  }

  isFilterAllowed = (addedOption, type) => {
    var isFilterAllowed = false;
    this.state.allowedLibraries.map(library => {
      if (library.hasOwnProperty(type) && library[type] === addedOption) {
        isFilterAllowed = true;
      }
    });
    return isFilterAllowed;
  };

  setAllowedLibraries = () => {
    var hiddenLibraries = [];
    Object.keys(this.state.allowedChoosenFilters).map(filter => {
      this.props.librarySpecificFilters.map(library => {
        var selectedFilters = this.state.allowedChoosenFilters[filter];
        if (
          selectedFilters.length !== 0 &&
          selectedFilters.indexOf(library[filter]) <= -1 &&
          hiddenLibraries.indexOf(library) <= -1
        ) {
          hiddenLibraries.push(library);
        }
      });
    });

    this.state.allowedLibraries = this.props.librarySpecificFilters.filter(
      function(x) {
        return hiddenLibraries.indexOf(x) < 0;
      }
    );
  };

  handleChange = (selectedOption, state, type) => {
    var oldFilters = state.allowedChoosenFilters[type];
    if (state.selectedOption !== null && oldFilters !== undefined) {
      var newFilters = [];
      //A deletion
      if (selectedOption === null) {
        state.allowedChoosenFilters[type] = [];
      } else {
        //If allowed, add filter to accepted filter
        if (this.isFilterAllowed(selectedOption.value, type)) {
          this.state.allowedChoosenFilters[type] = [selectedOption.value];
        }
      }
    } else {
      if (selectedOption === null) {
        state.allowedChoosenFilters[type] = [];
      } else if (this.isFilterAllowed(selectedOption.value, type)) {
        //Is the first choosen item
        this.state.allowedChoosenFilters[type] = [selectedOption.value];
      }
    }
    this.setAllowedLibraries();

    this.setState({ selectedOption });
  };

  clearFilters() {
    this.setState({
      allowedChoosenFilters: [],
      allowedLibraries: this.props.librarySpecificFilters,
      selectedOption: []
    });
  }

  render() {
    return (
      <div className="filterContainer" id="filterContainerToolTip">
        <div className="filtersGroup" id="filtersGroupToolTip">
          {this.renderSelectFilters()}
        </div>
        <div>{this.renderClearFiltersButton()}</div>
      </div>
    );
  }

  renderClearFiltersButton() {
    return (
      <button
        type="button"
        className="clearButton"
        onClick={e => this.clearFilters()}
      >
        Clear
      </button>
    );
  }

  resetDisabledFilters(filterDisabled) {
    return Object.keys(filterDisabled).map(key => {
      filterDisabled[key] = false;
    });
  }
  handleValue(state, selectType) {
    var displayValue = null;
    var allowedChoosenFilterKeys = Object.keys(state.allowedChoosenFilters);
    if (allowedChoosenFilterKeys.length > 0) {
      allowedChoosenFilterKeys.map(filter => {
        if (filter === selectType) {
          displayValue = state.allowedChoosenFilters[filter];
        }
      });
    }
    if (displayValue !== null) {
      displayValue = displayValue.map(value => {
        return {
          label: value,
          value: value
        };
      }, []);
    }
    return displayValue;
  }
  renderSelectFilters() {
    if (this.props.data === null) {
      return null;
    }

    const allowedFilters = this.allowedFilters;

    var allAllowedFilters = {};

    this.state.allowedLibraries.map(library => {
      Object.keys(library).map(key => {
        var value = library[key];
        if (value !== "") {
          allAllowedFilters[value] = "";
        }
      });
    });

    var filters = {};
    var filterDisabled = {};

    Object.keys(this.props.filters).map(filter => {
      var choosenFilter = this.props.filters[filter];
      if (allowedFilters.hasOwnProperty(filter)) {
        filters[filter] = choosenFilter;
        choosenFilter.map(value => {
          filterDisabled[value] = allAllowedFilters.hasOwnProperty(value)
            ? false
            : true;
        });
      }
    });

    return Object.keys(filters).map(selectType => {
      return (
        <div className="option">
          <span className="controlTitle">
            {this.allowedFilters[selectType]}
          </span>
          <Select
            className="control"
            closeMenuOnSelect={true}
            isClearable={true}
            isSearchable={true}
            autoFocus={false}
            components={makeAnimated}
            loadingMessage={true}
            onChange={e => this.handleChange(e, this.state, selectType)}
            value={this.handleValue(this.state, selectType)}
            options={filters[selectType]
              .sort(
                (a, b) =>
                  a - b ||
                  a.localeCompare(b, undefined, {
                    numeric: true,
                    sensitivity: "base"
                  })
              )
              .map(option => {
                return {
                  label: option,
                  value: option,
                  isDisabled: filterDisabled[option]
                };
              })}
          />
        </div>
      );
    });
  }
}

export default Filters;
