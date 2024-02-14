export const lithologySearchData = [
  {
    id: 0,
    type: "Input",
    label: "fromdepth",
    value: "layer_depth_from_from",
    isNumber: true,
    inputType: "number",
    hasTwoFields: true,
    isVisibleValue: "layer.depth_from",
    placeholder: "from",
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
    placeholder: "to",
  },
  {
    id: 2,
    type: "Input",
    label: "todepth",
    value: "layer_depth_to_from",
    isNumber: true,
    inputType: "number",
    hasTwoFields: true,
    isVisibleValue: "layer.depth_to",
    isVisible: true,
    placeholder: "from",
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
    placeholder: "to",
  },
  {
    id: 4,
    type: "Dropdown",
    label: "qt_description",
    value: "qt_description",
    schema: "qt_description",
    multiple: false,
    search: false,
    isVisibleValue: "layer.qt_description",
  },
  {
    id: 5,
    type: "DomainTree",
    label: "lithology",
    value: "lithology",
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
    type: "Input",
    label: "original_lithology",
    value: "original_lithology",
    require: false,
    isVisibleValue: "original_lithology",
  },
  {
    id: 7,
    type: "Input",
    label: "uscs_original",
    value: "uscs_original",
    require: false,
    isVisibleValue: "layer.uscs_original",
  },
  {
    id: 8,
    type: "Dropdown",
    label: "uscs_determination",
    value: "uscs_determination",
    schema: "uscs_determination",
    multiple: false,
    search: true,
    isVisibleValue: "layer.uscs_determination",
  },
  {
    id: 9,
    type: "Dropdown",
    label: "uscs_1",
    value: "uscs_1",
    schema: "uscs_type",
    multiple: false,
    search: false,
    isVisibleValue: "layer.uscs_1",
  },
  {
    id: 10,
    type: "Dropdown",
    label: "grain_size_1",
    value: "grain_size_1",
    schema: "mlpr109",
    multiple: false,
    search: false,
    isVisibleValue: "layer.grain_size_1",
  },
  {
    id: 11,
    type: "Dropdown",
    label: "uscs_2",
    value: "uscs_2",
    schema: "uscs_type",
    multiple: false,
    search: false,
    isVisibleValue: "layer.uscs_2",
  },
  {
    id: 12,
    type: "Dropdown",
    label: "grain_size_2",
    value: "grain_size_2",
    schema: "mlpr109",
    multiple: false,
    search: false,
    isVisibleValue: "layer.grain_size_2",
  },
  {
    id: 13,
    type: "Dropdown",
    label: "uscs_3",
    value: "uscs_3",
    schema: "uscs_type",
    multiple: false,
    search: true,
    isVisibleValue: "layer.uscs_3",
  },
  {
    id: 14,
    type: "Dropdown",
    label: "grain_shape",
    value: "grain_shape",
    schema: "mlpr110",
    multiple: false,
    search: true,
    isVisibleValue: "layer.grain_shape",
  },
  {
    id: 15,
    type: "Dropdown",
    label: "grain_granularity",
    value: "grain_granularity",
    schema: "mlpr115",
    multiple: false,
    search: true,
    isVisibleValue: "layer.grain_granularity",
  },
  {
    id: 16,
    type: "Dropdown",
    label: "organic_component",
    value: "organic_component",
    schema: "mlpr108",
    multiple: false,
    search: true,
    isVisibleValue: "layer.organic_component",
  },
  {
    id: 17,
    type: "Dropdown",
    label: "debris",
    value: "debris",
    schema: "debris",
    multiple: false,
    search: true,
    isVisibleValue: "layer.debris",
  },
  {
    id: 18,
    type: "Dropdown",
    label: "layer_lithology_top_bedrock",
    value: "layer_lithology_top_bedrock",
    schema: "custom.lithology_top_bedrock",
    multiple: false,
    search: true,
    isVisibleValue: "layer.lithology_top_bedrock",
  },
  {
    id: 19,
    type: "Radio",
    label: "striae",
    value: "striae",
    to: false,
    hasUnknown: true,
    isVisibleValue: "layer.striae",
  },
  {
    id: 20,
    type: "Dropdown",
    label: "color",
    value: "color",
    schema: "mlpr112",
    multiple: false,
    search: true,
    isVisibleValue: "layer.color",
  },
  {
    id: 21,
    type: "Dropdown",
    label: "consistance",
    value: "consistance",
    schema: "consistency",
    multiple: false,
    search: true,
    isVisibleValue: "layer.consistance",
  },
  {
    id: 22,
    type: "Dropdown",
    label: "plasticity",
    value: "plasticity",
    schema: "plasticity",
    multiple: false,
    search: false,
    isVisibleValue: "layer.plasticity",
  },
  {
    id: 23,
    type: "Dropdown",
    label: "compactness",
    value: "compactness",
    schema: "compactness",
    multiple: false,
    search: false,
    isVisibleValue: "layer.compactness",
  },
  {
    id: 24,
    type: "Dropdown",
    label: "cohesion",
    value: "cohesion",
    schema: "mlpr116",
    multiple: false,
    search: false,
    isVisibleValue: "layer.cohesion",
  },
  {
    id: 25,
    type: "Dropdown",
    label: "gradation",
    value: "layer_gradation",
    schema: "gradation",
    multiple: false,
    search: true,
    isVisibleValue: "layer.gradation",
  },
  {
    id: 26,
    type: "Dropdown",
    label: "humidity",
    value: "humidity",
    schema: "humidity",
    multiple: false,
    search: false,
    isVisibleValue: "layer.humidity",
  },
  {
    id: 27,
    type: "Dropdown",
    label: "alteration",
    value: "alteration",
    schema: "mlpr106",
    multiple: false,
    search: false,
    isVisibleValue: "layer.alteration",
  },
];
