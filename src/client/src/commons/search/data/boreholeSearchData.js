export const boreholeSearchData = [
  // isVisibleValue + placeholder + hasUnknown for Radio + hasTwoFields + inputType ==>new
  // remove isVisable + require
  {
    id: 0,
    type: "Dropdown",
    label: "kind",
    value: "kind",
    schema: "kind",
    multiple: false,
    search: false,
    isVisibleValue: "kind",
  },
  {
    id: 1,
    type: "Dropdown",
    label: "drilling_method",
    value: "method",
    schema: "extended.drilling_method",
    multiple: false,
    search: false,
    isVisibleValue: "extended.method",
  },
  {
    id: 2,
    type: "Dropdown",
    label: "purpose",
    value: "purpose",
    schema: "extended.purpose",
    multiple: false,
    search: false,
    isVisibleValue: "extended.purpose",
  },
  {
    id: 3,
    type: "Dropdown",
    label: "cuttings",
    value: "cuttings",
    schema: "custom.cuttings",
    multiple: false,
    search: false,
    isVisibleValue: "custom.cuttings",
  },
  {
    id: 4,
    type: "Date",
    label: "spud_date",
    value: "spud_date_from",
    isVisibleValue: "spud_date",
    hasTwoFields: true,
    placeholder: "afterdate",
  },
  {
    id: 5,
    type: "Date",
    label: "",
    value: "spud_date_to",
    isVisibleValue: "spud_date",
    hasTwoFields: true,
    placeholder: "beforedate",
  },
  {
    id: 6,
    type: "Date",
    label: "drilling_end_date",
    value: "drilling_date_from",
    isVisibleValue: "drilling_date",
    hasTwoFields: true,
    placeholder: "afterdate",
  },
  {
    id: 7,
    type: "Date",
    label: "",
    value: "drilling_date_to",
    isVisibleValue: "drilling_date",
    hasTwoFields: true,
    placeholder: "beforedate",
  },
  {
    id: 8,
    type: "Input",
    label: "drill_diameter",
    value: "drill_diameter_from",
    isNumber: true,
    inputType: "number",
    hasTwoFields: true,
    isVisibleValue: "custom.drill_diameter",
    placeholder: "fromdiameter",
  },
  {
    id: 9,
    type: "Input",
    label: "",
    value: "drill_diameter_to",
    isNumber: true,
    inputType: "number",
    hasTwoFields: true,
    isVisibleValue: "custom.drill_diameter",
    placeholder: "todiameter",
  },
  {
    id: 10,
    type: "Dropdown",
    label: "boreholestatus",
    value: "status",
    schema: "extended.status",
    multiple: false,
    search: false,
    isVisibleValue: "extended.status",
  },
  {
    id: 11,
    type: "Input",
    label: "inclination",
    value: "bore_inc_from",
    isNumber: true,
    inputType: "number",
    hasTwoFields: true,
    isVisibleValue: "bore_inc",
    placeholder: "from",
  },
  // from degree and to degree in placeholder
  {
    id: 12,
    type: "Input",
    label: "",
    value: "bore_inc_to",
    isNumber: true,
    inputType: "number",
    hasTwoFields: true,
    isVisibleValue: "bore_inc",
    placeholder: "to",
  },
  {
    id: 13,
    type: "Input",
    label: "inclination_direction",
    value: "bore_inc_dir_from",
    isNumber: true,
    inputType: "number",
    hasTwoFields: true,
    isVisibleValue: "bore_inc_dir",
    placeholder: "from",
  },
  // from degree and to degree in placeholder
  {
    id: 14,
    type: "Input",
    label: "",
    value: "bore_inc_dir_to",
    isNumber: true,
    inputType: "number",
    hasTwoFields: true,
    isVisibleValue: "bore_inc_dir",
    placeholder: "to",
  },
  {
    id: 15,
    type: "Dropdown",
    label: "qt_bore_inc_dir",
    value: "qt_inclination_direction",
    schema: "custom.qt_bore_inc_dir",
    multiple: false,
    search: false,
    isVisibleValue: "qt_bore_inc_dir",
  },
  {
    id: 16,
    type: "Input",
    label: "totaldepth",
    value: "length_from",
    isNumber: true,
    inputType: "number",
    hasTwoFields: true,
    isVisibleValue: "length",
    placeholder: "from",
  },
  {
    id: 17,
    type: "Input",
    label: "",
    value: "length_to",
    isNumber: true,
    inputType: "number",
    hasTwoFields: true,
    isVisibleValue: "length",
    placeholder: "to",
  },
  {
    id: 18,
    type: "Input",
    label: "total_depth_tvd",
    value: "total_depth_tvd_from",
    isNumber: true,
    inputType: "number",
    hasTwoFields: true,
    isVisibleValue: "total_depth_tvd",
    placeholder: "from",
  },
  {
    id: 19,
    type: "Input",
    label: "",
    value: "total_depth_tvd_to",
    isNumber: true,
    inputType: "number",
    hasTwoFields: true,
    isVisibleValue: "total_depth_tvd",
    placeholder: "to",
  },
  {
    id: 20,
    type: "Input",
    label: "top_bedrock",
    value: "top_bedrock_from",
    isNumber: true,
    inputType: "number",
    hasTwoFields: true,
    isVisibleValue: "extended.top_bedrock",
    placeholder: "from",
  },
  {
    id: 21,
    type: "Input",
    label: "",
    value: "top_bedrock_to",
    isNumber: true,
    inputType: "number",
    hasTwoFields: true,
    isVisibleValue: "extended.top_bedrock",
    placeholder: "to",
  },
  {
    id: 22,
    type: "Input",
    label: "top_bedrock_tvd",
    value: "top_bedrock_tvd_from",
    isNumber: true,
    inputType: "number",
    hasTwoFields: true,
    isVisibleValue: "extended.top_bedrock_tvd",
    placeholder: "from",
  },
  {
    id: 23,
    type: "Input",
    label: "",
    value: "top_bedrock_tvd_to",
    isNumber: true,
    inputType: "number",
    hasTwoFields: true,
    isVisibleValue: "extended.top_bedrock_tvd",
    placeholder: "to",
  },
  {
    id: 24,
    type: "Dropdown",
    label: "qt_depth",
    value: "qt_depth",
    schema: "custom.qt_top_bedrock",
    multiple: false,
    search: false,
    isVisibleValue: "qt_depth",
  },
  {
    id: 25,
    type: "Dropdown",
    label: "total_depth_tvd_qt",
    value: "qt_total_depth_tvd",
    schema: "custom.qt_top_bedrock",
    multiple: false,
    search: false,
    isVisibleValue: "total_depth_tvd_qt",
  },
  {
    id: 26,
    type: "Dropdown",
    label: "qt_top_bedrock",
    value: "qt_top_bedrock",
    schema: "custom.qt_top_bedrock",
    multiple: false,
    search: false,
    isVisibleValue: "qt_top_bedrock",
  },
  {
    id: 27,
    type: "Dropdown",
    label: "top_bedrock_tvd_qt",
    value: "qt_top_bedrock_tvd",
    schema: "custom.qt_top_bedrock",
    multiple: false,
    search: false,
    isVisibleValue: "top_bedrock_tvd_qt",
  },
  {
    id: 28,
    type: "Radio",
    label: "groundwater",
    value: "groundwater",
    hasUnknown: true,
    to: false,
    isVisibleValue: "extended.groundwater",
  },
  {
    id: 29,
    type: "DomainTree",
    label: "lithology_top_bedrock",
    value: "lithology_top_bedrock",
    schema: "custom.lithology_top_bedrock",
    levels: {
      1: "rock",
      2: "process",
      3: "type",
    },
    isVisibleValue: "custom.lit_pet_top_bedrock",
  },
  {
    id: 30,
    type: "DomainTree",
    label: "lithostratigraphy_top_bedrock",
    value: "lithostratigraphy_top_bedrock",
    schema: "custom.lithostratigraphy_top_bedrock",
    levels: {
      1: "super",
      2: "group",
      3: "subgroup",
      4: "superformation",
      5: "formation",
    },
    isVisibleValue: "custom.lit_str_top_bedrock",
  },
  {
    id: 31,
    type: "DomainTree",
    label: "chronostratigraphy_top_bedrock",
    value: "chronostratigraphy_top_bedrock",
    schema: "custom.chronostratigraphy_top_bedrock",
    levels: {
      1: "1st_order_eon",
      2: "2nd_order_era",
      3: "3rd_order_period",
      4: "4th_order_epoch",
      5: "5th_order_sub_epoch",
      6: "6th_order_sub_stage",
    },
    isVisibleValue: "custom.chro_str_top_bedrock",
  },
];
