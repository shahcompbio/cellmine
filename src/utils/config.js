let url;
let markdownCredentials = {};
let dataFetcherCredentials = {};

const hostname = window && window.location && window.location.hostname;

if (hostname === "localhost" || hostname === "") {
  //url = "http://localhost:2210/meta_data_stats/_search?size=10000";
  url = "https://cellmine.org/meta_data_stats/_search?size=10000";
} else {
  url = "/meta_data_stats/_search?size=10000";
  markdownCredentials = {
    credentials: "same-origin"
  };
  dataFetcherCredentials = {
    method: "POST",
    credentials: "same-origin"
  };
}
const config = {
  URL: url,
  MARKDOWNCREDENTIALS: markdownCredentials,
  DATACREDENTIALS: dataFetcherCredentials
};

export default config;
