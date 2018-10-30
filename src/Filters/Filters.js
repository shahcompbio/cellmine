import React, { Component } from "react";
import * as d3 from "d3";
import Select from "react-select";
import makeAnimated from "react-select/lib/animated";
import ReactResponsiveSelect from "react-responsive-select";
import GuideToolTip from "../ToolTips/ToolTip.js";
import "./Filters.css";

class Filters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allowedChoosenFilters: [],
      allowedLibraries: this.props.librarySpecificFilters,
      selectedOption: null
    };
    this.allowedFilters = {
      additional_pathology_info: { name: "Tumor Subtype", position: 8 },
      pathology_disease_name: { name: "Tumor Type", position: 7 },
      anonymous_patient_id: { name: "Patient ID", position: 3 },
      library: { name: "Library", position: -1 },
      pool_id: { name: "Library ID", position: 1 },
      sample_type: { name: " Sample Type", position: 5 },
      cell_line_id: { name: "Cell Line ID", position: 2 },
      taxonomy_id: { name: "Taxonomy", position: 6 },
      jira_ticket: { name: "Dataset", position: 0 },
      xenograft_id: { name: "Xenograft ID", position: 4 }
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

    //Hide circles that do not apply to the choosen filter(s)
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
  //Check to see if a filter is disabled or not
  isFilterAllowed = (addedOption, type) => {
    var isFilterAllowed = false;
    this.state.allowedLibraries.map(library => {
      if (library.hasOwnProperty(type) && library[type] === addedOption) {
        isFilterAllowed = true;
      }
    });
    return isFilterAllowed;
  };

  //Set the libraries that will be displayed after a filter is choosen
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

  //On filter change set the state accordingly
  handleChange = (selectedOption, state, type) => {
    var oldFilters = state.allowedChoosenFilters[type];
    if (state.selectedOption !== null && oldFilters !== undefined) {
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

  //If the clear filter button is pressed
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
          if (!allAllowedFilters.hasOwnProperty(value)) {
            allAllowedFilters[value] = {};
          }
          allAllowedFilters[value][key] = "";
        }
      });
    });

    var filters = {};
    var filterDisabled = {};

    Object.keys(this.props.filters).map(filter => {
      var choosenFilter = this.props.filters[filter];
      //Some filters are not needed
      if (allowedFilters.hasOwnProperty(filter)) {
        //Set filters that will be displayed
        filters[filter] = choosenFilter;
        choosenFilter.map(value => {
          if (!filterDisabled.hasOwnProperty(value)) {
            filterDisabled[value] = {};
          }
          filterDisabled[value][filter] = allAllowedFilters.hasOwnProperty(
            value
          )
            ? allAllowedFilters[value].hasOwnProperty(filter) ? false : true
            : true;
        });
      }
    });

    function disableFilterOption(option) {
      return {
        label: option,
        value: option,
        isDisabled: filterDisabled[option][this.filter]
      };
    }
    return Object.keys(filters)
      .sort(function(a, b) {
        //Sort filters by position listed in allowedFilters object
        return allowedFilters[a].position - allowedFilters[b].position;
      })
      .map(selectType => {
        return (
          <div className="option">
            <span className="controlTitle">
              {allowedFilters[selectType].name}
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
                .map(disableFilterOption, { filter: selectType })}
            />
          </div>
        );
      });
  }
}

export default Filters;
