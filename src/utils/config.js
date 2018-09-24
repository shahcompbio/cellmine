let url;
let aboutCredentials = {};
let dataFetcherCredentials = {};

const hostname = window && window.location && window.location.hostname;

if (hostname === "localhost" || hostname === "") {
  url = "http://localhost:2210/meta_data_stats/_search?size=10000";
} else {
  url = "/meta_data_stats/_search?size=10000";
  aboutCredentials = {
    credentials: "same-origin"
  };
  dataFetcherCredentials = {
    method: "POST",
    credentials: "same-origin"
  };
}
const config = {
  URL: url,
  ABOUTCREDENTIALS: aboutCredentials,
  DATACREDENTIALS: dataFetcherCredentials
};

export default config;
