import * as d3 from "d3";
import config from "./config.js";
const getData = callback => {
  const index = "meta_data_stats";
  const url = "http://localhost:2210/meta_data_stats/_search?size=10000";

  fetchUrl(url, [], arr => {
    const libraries = processLibs(arr);
    const samples = sampleFilter(libraries);
    const data = {
      filters: processFilters(arr),
      librarySpecificFilters: libraries,
      library: packNodes(nestedNotation(libraries)),
      samples: samples,
      stats: {
        libraryCount: libraries.length
      }
    };
    callback(data);
  });
};

async function fetchUrl(index, arr, callback) {
  /*fetch(config.HOST + index + config.SEARCH, {
    method: "POST",
    credentials: "same-origin"
  })*/
  fetch(index)
    .then(
      response => response.json(),
      error => console.log("An error occured.", error)
    )
    .then(response => {
      const jsonArr = Object.values(response.hits.hits);
      callback(jsonArr);
    });
}

function processFilters(data) {
  //Only keep unique values
  return data
    .reduce((result, hit) => [...result, hit["_source"]], [])
    .reduce((result, hit) => {
      Object.keys(hit).filter(key => {
        if (!result.hasOwnProperty(key)) {
          result[key] = [];
        }
        return result[key].includes(hit[key]) || hit[key] === ""
          ? result
          : result[key].push(hit[key]);
      });
      return result;
    }, {});
}

function processLibs(data) {
  var parseTime = d3.timeParse("%Y-%m-%d");

  return data.map(hit => ({
    anonymous_patient_id: hit["_source"].anonymous_patient_id,
    jira_ticket: hit["_source"].jira_ticket,
    description: hit["_source"].description,
    pool_id: hit["_source"].pool_id,
    sample: hit["_source"].sample_id,
    sample_type: hit["_source"].sample_type,
    size: hit["_source"].num_sublibraries,
    cell_line_id: hit["_source"].cell_line_id,
    taxonomy_id: hit["_source"].taxonomy_id,
    seq: parseTime(hit["_source"].submission_date)
  }));
}

function sampleFilter(data) {
  return data.reduce((result, hit) => {
    return !result.includes(hit.sample) ? [...result, hit.sample] : result;
  }, []);
}

const pack = d3
  .pack()
  .size([window.innerWidth * 0.9, window.innerHeight * 0.8]);

function packNodes(libraries) {
  return pack(libraries)
    .descendants()
    .filter(d => d.depth === 2)
    .sort((a, b) => a.data.seq - b.data.seq);
}

function nestedNotation(data) {
  const nested = d3
    .nest()
    .key(d => d.sample)
    .entries(data)
    .map(d => ({ name: d.key, children: d.values }));

  return d3
    .hierarchy({ name: "root", children: nested })
    .sum(function(d) {
      return d.size;
    })
    .sort(function(a, b) {
      return a.data.seq - b.data.seq;
    });
}

export default getData;
