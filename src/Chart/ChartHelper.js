export const shadeColor = (color, percent) => {
  var f = parseInt(color.slice(1), 16),
    t = percent < 0 ? 0 : 255,
    p = percent < 0 ? percent * -1 : percent,
    R = f >> 16,
    G = (f >> 8) & 0x00ff,
    B = f & 0x0000ff;
  return (
    "#" +
    (
      0x1000000 +
      (Math.round((t - R) * p) + R) * 0x10000 +
      (Math.round((t - G) * p) + G) * 0x100 +
      (Math.round((t - B) * p) + B)
    )
      .toString(16)
      .slice(1)
  );
};
export const allowedFilters = [
  "additional_pathology_info",
  "pathology_disease_name",
  "anonymous_patient_id",
  "library",
  "sample",
  "sample_type",
  "cell_line_id",
  "taxonomy_id",
  "jira_ticket"
];
//Global colour scales
export const colourScale = [
  [
    "#d8a8d4",
    "#ade1b8",
    "#a8b2e4",
    "#dbdba4",
    "#69c0df",
    "#d5ab84",
    "#91e5df",
    "#e4a0a7",
    "#65b8b1",
    "#92b283"
  ],
  [
    "#ff9f99",
    "#00d757",
    "#ffb3e7",
    "#befd0a",
    "#626dae",
    "#E2CD76",
    "#dcc5ff",
    "#009e4b",
    "#317b86",
    "#55ffeb"
  ],
  [
    "#7b4a6a",
    "#88b48d",
    "#485b86",
    "#c69a76",
    "#59afc5",
    "#edac9b",
    "#9ea1d2",
    "#B3AF83",
    "#d194ab",
    "#366a51"
  ],
  [
    "#759089",
    "#ffd4e9",
    "#90d3b2",
    "#d19a7a",
    "#90e2ff",
    "#D8D599",
    "#6fd2dd",
    "#e3f1d2",
    "#5d91aa",
    "#c8f5fa"
  ]
];
