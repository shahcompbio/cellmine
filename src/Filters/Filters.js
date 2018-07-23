import React, { Component } from "react";
import * as d3 from "d3";
import { select } from "d3";

class Filters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allowedChoosenFilters: []
    };
    this.allowedFilter = this.allowedFilter.bind(this);
  }
  allowedFilter = () => {
    this.setState({
      allowedChoosenFilters: []
    });
  };
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

    const allowedFilters = {
      anonymous_patient_id: "Anonymous Patient ID",
      library: "Library",
      pool_id: "Sample ID",
      sample_type: " Sample Type",
      cell_line_id: "Cell Line ID",
      taxonomy_id: "Taxonomy",
      jira_ticket: "Ticket Number"
    };

    function addFilters(filters, librarySpecificFilters) {
      if (filters !== undefined && filters !== null) {
        var htmlBoxes = d3
          .selectAll(".Filters")
          .attr("width", windowDim.screenWidth)
          .attr("height", windowDim.screenHeight)
          .append("div")
          .attr("class", "dropdown")
          .append("ul")
          .attr("class", "filterList");

        Object.keys(filters)
          .filter(filter => allowedFilters.hasOwnProperty(filter))
          .map(filter => {
            var data = filters[filter];
            var box = htmlBoxes.append("li").classed("filters", true);

            box.append("div").text(d => allowedFilters[filter]);

            box
              .append("button")
              .attr("data-toggle", "dropdown")
              .attr("id", filter + "-filter")
              .attr("type", "button")
              .attr(
                "class",
                filter + " btn btn-default btn-md dropdown-toggle btn btn-light"
              )
              .append("span")
              .classed("button-text", true)
              .text("");

            box
              .select("button")
              .append("span")
              .attr("class", "caret pull-right");

            box
              .append("ul")
              .attr("class", "dropdown-menu")
              .attr("role", "menu")
              .attr("id", filter + "-filter")
              .selectAll("li")
              .data(data)
              .enter()
              .append("li")
              .attr("role", "presentation")
              .on("mouseover", function(d) {
                d3.select(this).classed("filterHover", true);
              })
              .on("mouseout", function(d) {
                d3.select(this).classed("filterHover", false);
              })
              .on("click", function(d) {
                var allowedLibraries = chooseFilter(d, librarySpecificFilters);
                applyFilter(d, allowedLibraries);
              })
              .append("input")
              .attr("type", "checkbox")
              .attr("value", d => (filter === "taxonomy_id" ? "tax-" + d : d))
              .text(d => d);

            box
              .selectAll("li")
              .data(data)
              .append("a")
              .attr("tabindex", "-1")
              .attr("role", "menuitem")
              .attr("href", "#")
              .attr("data-value", d => {
                var dataValue = d.replace(/\((.*)\)/, "_$1_").replace(" ", "_");
                return "data-" + dataValue;
              })
              .text(d => d);
          });
      }
    }

    function updateCheckmark(selectedElement, uncheck) {
      var parentElement = selectedElement.select(function() {
        return this.parentNode;
      });
      parentElement.select("input").attr("checked", uncheck);
    }

    function disableAllFilterOptions() {
      //Disable all
      d3
        .selectAll(".filterList .filters li")
        .classed("selected", false)
        .classed("disabled", true);
    }
    function getChoosenFilters() {
      var alreadyChoosenFilters = [];
      d3.selectAll(".filters").each(function(d) {
        d3
          .select(this)
          .selectAll(".selected")
          .each(function(d) {
            alreadyChoosenFilters.push(d);
          });
      });
      return alreadyChoosenFilters;
    }
    function chooseFilter(d, librarySpecificFilters) {
      var element = d.replace(/\((.*)\)/, "_$1_").replace(" ", "_");
      var isDisabled = d3
        .select("a[data-value = data-" + element + "]")
        .classed("disabled");

      if (!isDisabled) {
        var selectedElement = d3.select("a[data-value = data-" + element + "]");
        var isSelected = d3
          .select("a[data-value = data-" + element + "]")
          .classed("selected");

        selectedElement.classed("selected", !isSelected);
        var checkMarkValue = isSelected ? null : "";
        updateCheckmark(selectedElement, checkMarkValue);

        var alreadyChoosenFilters = getChoosenFilters();

        var notAllowedLibraries = [];
        librarySpecificFilters.map(library => {
          alreadyChoosenFilters.map(filter => {
            if (
              Object.values(library).indexOf(filter) <= -1 &&
              notAllowedLibraries.indexOf(library) <= -1
            ) {
              notAllowedLibraries.push(library);
            }
          });
        });

        var allowedLibraries = librarySpecificFilters.filter(function(x) {
          return notAllowedLibraries.indexOf(x) < 0;
        });

        disableAllFilterOptions();
        clearAllFilterTitles();
        //enable only allowed ones
        allowedLibraries.map(library => {
          Object.keys(library).map(key => {
            if (library[key] !== "" && allowedFilters.hasOwnProperty(key)) {
              var modifiedDataValue = library[key]
                .replace(/\((.*)\)/, "_$1_")
                .replace(" ", "_");

              var activeSelection = d3.select(
                "a[data-value = data-" + modifiedDataValue + "]"
              );
              var parentNode = activeSelection.select(function() {
                return this.parentNode;
              });

              if (alreadyChoosenFilters.indexOf(library[key]) > -1) {
                updateCheckmark(activeSelection, "");
                activeSelection.classed("selected", true);
                var buttonNode = parentNode
                  .select(function() {
                    return this.parentNode;
                  })
                  .select(function() {
                    return this.parentNode;
                  })
                  .select("button");
                buttonNode.select(".button-text").text(library[key]);
              }
              //Enable option and move to the top
              parentNode.classed("disabled", false);
              parentNode.lower();
            }
          });
        });
        return allowedLibraries;
      }
    }
    function clearAllFilterTitles() {
      d3.selectAll(".button-text").text("");
    }
    function applyFilter(d, allowedLibraries) {
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
    addFilters(filters, librarySpecificFilters);
  }
  render() {
    if (this.props.data === null) {
      return null;
    }

    return <div className="Filters" ref={node => (this.node = node)} />;
  }
}

export default Filters;
