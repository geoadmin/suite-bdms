export const boreholeSearchData = [
  // isVisibleValue + placeholder + hasUnknown for Radio + hasTwoFields + inputType ==>new
  // remove isVisable + require
  {
    id: 0,
    type: "Dropdown",
    label: "borehole_type",
    value: "borehole_type",
    schema: "borehole_type",
    multiple: false,
    search: false,
    isVisibleValue: "borehole_type",
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
    schema: "depth_precision",
    multiple: false,
    search: false,
    isVisibleValue: "qt_depth",
  },
  {
    id: 26,
    type: "Input",
    label: "qt_top_bedrock",
    value: "qt_top_bedrock_from",
    isNumber: true,
    inputType: "number",
    hasTwoFields: true,
    isVisibleValue: "qt_top_bedrock",
    placeholder: "from",
  },
  {
    id: 27,
    type: "Input",
    label: "",
    value: "qt_top_bedrock_to",
    isNumber: true,
    inputType: "number",
    hasTwoFields: true,
    isVisibleValue: "qt_top_bedrock",
    placeholder: "to",
  },
  {
    id: 28,
    type: "Input",
    label: "top_bedrock_tvd_qt",
    value: "qt_top_bedrock_tvd_from",
    isNumber: true,
    inputType: "number",
    hasTwoFields: true,
    isVisibleValue: "top_bedrock_tvd_qt",
    placeholder: "from",
  },
  {
    id: 29,
    type: "Input",
    label: "",
    value: "qt_top_bedrock_tvd_to",
    isNumber: true,
    inputType: "number",
    hasTwoFields: true,
    isVisibleValue: "top_bedrock_tvd_qt",
    placeholder: "to",
  },
  {
    id: 30,
    type: "Radio",
    label: "groundwater",
    value: "groundwater",
    hasUnknown: true,
    to: false,
    isVisibleValue: "extended.groundwater",
  },
  {
    id: 31,
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
    id: 32,
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
    id: 33,
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
