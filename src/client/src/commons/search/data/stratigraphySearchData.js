export const stratigraphySearchData = [
  {
    id: 0,
    type: "Input",
    label: "layer_depth_from",
    value: "layer_depth_from_from",
    isNumber: true,
    inputType: "number",
    hasTwoFields: true,
    isVisibleValue: "layer.depth_from",
    placeholder: "fromdepth",
  },
  {
    id: 1,
    type: "Input",
    label: "",
    value: "layer_depth_from_to",
    isNumber: true,
    inputType: "number",
    hasTwoFields: true,
    isVisibleValue: "layer.depth_from",
    placeholder: "todepth",
  },
  {
    id: 2,
    type: "Input",
    label: "layer_depth_to",
    value: "layer_depth_to_from",
    isNumber: true,
    inputType: "number",
    hasTwoFields: true,
    isVisibleValue: "layer.depth_to",
    isVisible: true,
    placeholder: "fromdepth",
  },
  {
    id: 3,
    type: "Input",
    label: "",
    value: "layer_depth_to_to",
    isNumber: true,
    inputType: "number",
    hasTwoFields: true,
    isVisibleValue: "layer.depth_to",
    isVisible: true,
    placeholder: "todepth",
  },
  {
    id: 4,
    type: "Dropdown",
    label: "layer_qt_description",
    value: "layer_qt_description",
    schema: "qt_description",
    multiple: false,
    search: false,
    isVisibleValue: "layer.qt_description",
  },
  {
    id: 5,
    type: "DomainTree",
    label: "layer_lithology",
    value: "layer_lithology",
    schema: "custom.lithology_top_bedrock",
    levels: {
      1: "rock",
      2: "process",
      3: "type",
    },
    isVisibleValue: "layer.lithology",
  },
  {
    id: 6,
    type: "DomainTree",
    label: "layer_lithostratigraphy",
    value: "layer_lithostratigraphy",
    schema: "custom.lithostratigraphy_top_bedrock",
    levels: {
      1: "super",
      2: "group",
      3: "subgroup",
      4: "superformation",
      5: "formation",
    },
    isVisibleValue: "layer.lithostratigraphy",
  },
  {
    id: 7,
    type: "DomainTree",
    label: "layer_chronostratigraphy",
    value: "layer_chronostratigraphy",
    schema: "custom.chronostratigraphy_top_bedrock",
    levels: {
      1: "1st_order_eon",
      2: "2nd_order_era",
      3: "3rd_order_period",
      4: "4th_order_epoch",
      5: "5th_order_sub_epoch",
      6: "6th_order_sub_stage",
    },
    isVisibleValue: "layer.chronostratigraphy",
  },
  {
    id: 8,
    type: "Input",
    label: "layer_uscs_original",
    value: "layer_uscs_original",
    require: false,
    isVisibleValue: "layer.uscs_original",
  },
  {
    id: 9,
    type: "Dropdown",
    label: "layer_uscs_determination",
    value: "layer_uscs_determination",
    schema: "mcla104",
    multiple: false,
    search: true,
    isVisibleValue: "layer.uscs_determination",
  },
  {
    id: 10,
    type: "Dropdown",
    label: "layer_uscs_1",
    value: "layer_uscs_1",
    schema: "mcla101",
    multiple: false,
    search: false,
    isVisibleValue: "layer.uscs_1",
  },
  {
    id: 11,
    type: "Dropdown",
    label: "layer_grain_size_1",
    value: "layer_grain_size_1",
    schema: "mlpr109",
    multiple: false,
    search: false,
    isVisibleValue: "layer.grain_size_1",
  },
  {
    id: 12,
    type: "Dropdown",
    label: "layer_uscs_2",
    value: "layer_uscs_2",
    schema: "mcla101",
    multiple: false,
    search: false,
    isVisibleValue: "layer.uscs_2",
  },
  {
    id: 13,
    type: "Dropdown",
    label: "layer_grain_size_2",
    value: "layer_grain_size_2",
    schema: "mlpr109",
    multiple: false,
    search: false,
    isVisibleValue: "layer.grain_size_2",
  },
  {
    id: 14,
    type: "Dropdown",
    label: "layer_uscs_3",
    value: "layer_uscs_3",
    schema: "mcla101",
    multiple: false,
    search: false,
    isVisibleValue: "layer.uscs_3",
  },
  {
    id: 15,
    type: "Dropdown",
    label: "layer_grain_shape",
    value: "layer_grain_shape",
    schema: "mlpr110",
    multiple: false,
    search: true,
    isVisibleValue: "layer.grain_shape",
  },
  {
    id: 16,
    type: "Dropdown",
    label: "layer_grain_granularity",
    value: "layer_grain_granularity",
    schema: "mlpr115",
    multiple: false,
    search: true,
    isVisibleValue: "layer.grain_granularity",
  },
  {
    id: 17,
    type: "Dropdown",
    label: "layer_organic_component",
    value: "layer_organic_component",
    schema: "mlpr108",
    multiple: false,
    search: true,
    isVisibleValue: "layer.organic_component",
  },
  {
    id: 18,
    type: "Dropdown",
    label: "layer_debris",
    value: "layer_debris",
    schema: "mcla107",
    multiple: false,
    search: true,
    isVisibleValue: "layer.debris",
  },
  {
    id: 19,
    type: "Dropdown",
    label: "layer_lithology_top_bedrock",
    value: "layer_lithology_top_bedrock",
    schema: "custom.lithology_top_bedrock",
    multiple: false,
    search: true,
    isVisibleValue: "layer.lithology_top_bedrock",
  },
  {
    id: 20,
    type: "Radio",
    label: "layer_striae",
    value: "layer_striae",
    to: false,
    hasUnknown: true,
    isVisibleValue: "layer.striae",
  },
  {
    id: 21,
    type: "Dropdown",
    label: "layer_color",
    value: "layer_color",
    schema: "mlpr112",
    multiple: false,
    search: true,
    isVisibleValue: "layer.color",
  },
  {
    id: 22,
    type: "Dropdown",
    label: "layer_consistance",
    value: "layer_consistance",
    schema: "mlpr103",
    multiple: false,
    search: true,
    isVisibleValue: "layer.consistance",
  },
  {
    id: 23,
    type: "Dropdown",
    label: "layer_plasticity",
    value: "layer_plasticity",
    schema: "mlpr101",
    multiple: false,
    search: false,
    isVisibleValue: "layer.plasticity",
  },
  {
    id: 24,
    type: "Dropdown",
    label: "layer_compactness",
    value: "layer_compactness",
    schema: "mlpr102",
    multiple: false,
    search: false,
    isVisibleValue: "layer.compactness",
  },
  {
    id: 25,
    type: "Dropdown",
    label: "layer_cohesion",
    value: "layer_cohesion",
    schema: "mlpr116",
    multiple: false,
    search: false,
    isVisibleValue: "layer.cohesion",
  },
  {
    id: 26,
    type: "Dropdown",
    label: "gradation",
    value: "layer_gradation",
    schema: "gradation",
    multiple: false,
    search: true,
    isVisibleValue: "layer.gradation",
  },
  {
    id: 27,
    type: "Dropdown",
    label: "layer_humidity",
    value: "layer_humidity",
    schema: "mlpr105",
    multiple: false,
    search: false,
    isVisibleValue: "layer.humidity",
  },
  {
    id: 28,
    type: "Dropdown",
    label: "layer_alteration",
    value: "layer_alteration",
    schema: "mlpr106",
    multiple: false,
    search: false,
    isVisibleValue: "layer.alteration",
  },
];
