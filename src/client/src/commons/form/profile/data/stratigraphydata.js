export const stratigraphyData = {
  profileInfo: [
    {
      id: 0,
      type: "Input",
      label: "stratigraphy_name",
      value: "name",
      require: true,
    },
    {
      id: 1,
      type: "Date",
      label: "date",
      value: "date",
    },
  ],
  profileAttribute: [
    {
      id: 0,
      type: "Input",
      label: "fromdepth",
      value: "fromDepth",
      require: true,
      isNumber: true,
      isVisible: true,
    },
    {
      id: 1,
      type: "Input",
      label: "todepth",
      value: "toDepth",
      require: true,
      isNumber: true,
      isVisible: true,
    },
    {
      id: 2,
      type: "Radio",
      label: "layer_last",
      value: "isLast",
      to: false,
      isVisibleValue: "layer_last",
    },
    {
      id: 3,
      type: "Dropdown",
      label: "completeness",
      value: "qtDescriptionId",
      schema: "qt_description",
      multiple: false,
      search: false,
      require: true,
      isVisibleValue: "qt_description",
    },
    {
      id: 4,
      type: "DomainTree",
      label: "lithology",
      value: "lithologyId",
      schema: "custom.lithology_top_bedrock",
      levels: {
        1: "rock",
        2: "process",
        3: "type",
      },

      require: true,
      isVisibleValue: "lithology",
    },
    {
      id: 5,
      type: "Input",
      label: "original_lithology",
      value: "originalLithology",
      require: false,
      isVisibleValue: "original_lithology",
    },
    {
      id: 6,
      type: "Input",
      label: "uscs_original",
      value: "originalUscs",
      require: false,
      isVisibleValue: "uscs_original",
    },
    {
      id: 7,
      type: "Dropdown",
      label: "uscs_determination",
      value: "uscsDeterminationId",
      schema: "mcla104",
      multiple: false,
      search: true,
      isVisibleValue: "uscs_determination",
    },
    {
      id: 8,
      type: "Dropdown",
      label: "uscs_1",
      value: "uscs1Id",
      schema: "mcla101",
      multiple: false,
      search: false,
      isVisibleValue: "uscs_1",
    },
    {
      id: 9,
      type: "Dropdown",
      label: "grain_size_1",
      value: "grainSize1Id",
      schema: "mlpr109",
      multiple: false,
      search: false,
      isVisibleValue: "grain_size_1",
    },
    {
      id: 10,
      type: "Dropdown",
      label: "uscs_2",
      value: "uscs2Id",
      schema: "mcla101",
      multiple: false,
      search: false,
      isVisibleValue: "uscs_2",
    },
    {
      id: 11,
      type: "Dropdown",
      label: "grain_size_2",
      value: "grainSize2Id",
      schema: "mlpr109",
      multiple: false,
      search: false,
      isVisibleValue: "grain_size_2",
    },
    {
      id: 12,
      type: "Dropdown",
      label: "uscs_3",
      value: "uscs_3",
      schema: "mcla101",
      multiple: true,
      search: false,
      isVisibleValue: "uscs_3",
    },
    {
      id: 13,
      type: "Dropdown",
      label: "grain_shape",
      value: "grain_shape",
      schema: "mlpr110",
      multiple: true,
      search: true,
      isVisibleValue: "grain_shape",
    },
    {
      id: 14,
      type: "Dropdown",
      label: "grain_granularity",
      value: "grain_granularity",
      schema: "mlpr115",
      multiple: true,
      search: true,
      isVisibleValue: "grain_granularity",
    },
    {
      id: 15,
      type: "Dropdown",
      label: "organic_component",
      value: "organic_component",
      schema: "mlpr108",
      multiple: true,
      search: true,
      isVisibleValue: "organic_component",
    },
    {
      id: 16,
      type: "Dropdown",
      label: "debris",
      value: "debris",
      schema: "mcla107",
      multiple: true,
      search: true,
      isVisibleValue: "debris",
    },
    {
      id: 17,
      type: "Dropdown",
      label: "layer_lithology_top_bedrock",
      value: "lithologyTopBedrockId",
      schema: "custom.lithology_top_bedrock",
      multiple: false,
      search: true,
      isVisibleValue: "layer_lithology_top_bedrock",
    },
    {
      id: 18,
      type: "Radio",
      label: "striae",
      value: "isStriae",
      to: false,
      isVisibleValue: "striae",
    },
    {
      id: 19,
      type: "Dropdown",
      label: "color",
      value: "color",
      schema: "mlpr112",
      multiple: true,
      search: true,
      isVisibleValue: "color",
    },
    {
      id: 20,
      type: "Dropdown",
      label: "consistance",
      value: "consistanceId",
      schema: "mlpr103",
      multiple: false,
      search: true,
      isVisibleValue: "consistance",
    },
    {
      id: 21,
      type: "Dropdown",
      label: "plasticity",
      value: "plasticityId",
      schema: "mlpr101",
      multiple: false,
      search: false,
      isVisibleValue: "plasticity",
    },
    {
      id: 22,
      type: "Dropdown",
      label: "compactness",
      value: "compactnessId",
      schema: "mlpr102",
      multiple: false,
      search: false,
      isVisibleValue: "compactness",
    },
    {
      id: 23,
      type: "Dropdown",
      label: "cohesion",
      value: "cohesionId",
      schema: "mlpr116",
      multiple: false,
      search: false,
      isVisibleValue: "cohesion",
    },
    {
      id: 24,
      type: "Dropdown",
      label: "gradation",
      value: "gradationId",
      schema: "gradation",
      multiple: false,
      search: true,
      isVisibleValue: "gradation",
    },
    {
      id: 25,
      type: "Dropdown",
      label: "humidity",
      value: "humidityId",
      schema: "mlpr105",
      multiple: false,
      search: false,
      isVisibleValue: "humidity",
    },
    {
      id: 26,
      type: "Dropdown",
      label: "alteration",
      value: "alterationId",
      schema: "mlpr106",
      multiple: false,
      search: false,
      isVisibleValue: "alteration",
    },
    {
      id: 27,
      type: "TextArea",
      label: "notes",
      value: "notes",
      isVisibleValue: "notes",
    },
  ],
};
