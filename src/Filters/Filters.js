import React, { Component } from "react";
import * as d3 from "d3";
import { select } from "d3";
import Select from "react-select";
import Animated from "react-select/lib/animated";
import makeAnimated from "react-select/lib/animated";

class Filters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allowedChoosenFilters: []
    };
    this.allowedFilters = {
      anonymous_patient_id: "Anonymous Patient ID",
      library: "Library",
      pool_id: "Sample ID",
      sample_type: " Sample Type",
      cell_line_id: "Cell Line ID",
      taxonomy_id: "Taxonomy",
      jira_ticket: "Ticket Number"
    };

    this.allowedLibraries = this.props.librarySpecificFilters;
  }
  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate() {
    this.createChart();
  }

  createChart() {
    const windowDim = {
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      width: window.innerWidth * 0.9,
      height: window.innerHeight * 0.8
    };
    const filters = this.props.filters;
    const librarySpecificFilters = this.props.librarySpecificFilters;

    function applyFilter(allowedLibraries) {
      d3.selectAll(".CircleChart circle").classed("hiddenCircle", true);

      allowedLibraries.map(library => {
        d3
          .selectAll(".CircleChart circle.tag-" + library["jira_ticket"])
          .classed("hiddenCircle", false)
          .attr("r", 5)
          .transition()
          .duration(500)
          .attr("r", d => d.r);
      });
    }
    applyFilter(this.allowedLibraries);
  }
  state = {
    selectedOption: null
  };

  isFilterAllowed = (addedOption, type) => {
    var isFilterAllowed = false;
    this.allowedLibraries.map(library => {
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

    this.allowedLibraries = this.props.librarySpecificFilters.filter(function(
      x
    ) {
      return hiddenLibraries.indexOf(x) < 0;
    });
  };

  handleChange = (selectedOption, state, type) => {
    var oldFilters = state.allowedChoosenFilters[type];
    if (state.selectedOption !== undefined && oldFilters !== undefined) {
      var newFilters = [];
      //A deletion
      if (selectedOption.length < oldFilters.length) {
        //Go through all the old choosen options and find the one that is removed
        var removedOption = oldFilters.filter(function(x) {
          return selectedOption.map(hit => hit.value).indexOf(x) < 0;
        });
        //Get all the new options
        //  var index = state.allowedChoosenFilters[type].indexOf(removedOption[0]);
        this.state.allowedChoosenFilters[type] = state.allowedChoosenFilters[
          type
        ].filter(hit => hit !== removedOption[0]);
      } else {
        //selectedOption
        var addedOption = selectedOption.filter(function(x) {
          return oldFilters.indexOf(x.value) < 0;
        });
        if (this.isFilterAllowed(addedOption[0].value, type)) {
          this.state.allowedChoosenFilters[
            type
          ] = state.allowedChoosenFilters.hasOwnProperty(type)
            ? [...state.allowedChoosenFilters[type], addedOption[0].value]
            : [addedOption[0].value];
        }
      }
    } else {
      if (this.isFilterAllowed(selectedOption[0].value, type)) {
        //Is the first choosen item
        this.state.allowedChoosenFilters[type] = [selectedOption[0].value];
      }
    }
    this.setAllowedLibraries();
    console.log(this.allowedLibraries);
    //    applyFilter()
    this.setState({ selectedOption });
  };
  render() {
    if (this.props.data === null) {
      return null;
    }

    const { selectedOption } = this.state;
    const allowedFilters = this.allowedFilters;

    var allAllowedFilters = {};
    this.allowedLibraries.map(library => {
      console.log(library);
      Object.keys(library).map(key => {
        var value = library[key];
        console.log(value);
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
        <Select
          closeMenuOnSelect={false}
          components={makeAnimated()}
          isMulti
          value={this.selectedOption}
          onChange={e => this.handleChange(e, this.state, selectType)}
          options={filters[selectType].map(option => {
            return {
              label: option,
              value: option,
              isDisabled: filterDisabled[option]
            };
          })}
        />
      );
    });
  }
}

export default Filters;
