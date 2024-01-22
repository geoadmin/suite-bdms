import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";

export function user() {
  const initialState = {
    isFetching: false,
    error: false,
    fcnt: 0,
    rtime: 0, // fetch time
    data: null,
    authentication: null,
  };
  return function _user(state = initialState, action) {
    const { path } = action;
    if (path !== "/user") {
      return state;
    }
    switch (action.type) {
      case "SET_AUTHENTICATION": {
        return {
          ...state,
          authentication: action.user,
        };
      }
      case "UNSET_AUTHENTICATION": {
        return {
          ...initialState,
          data: null,
        };
      }
      case "GET": {
        return {
          ...initialState,
          authentication: {
            ...state.authentication,
          },
          error: false,
          rtime: new Date().getTime(),
          isFetching: true,
        };
      }
      case "GET_OK": {
        let copy = {
          ...state,
          fcnt: state.fcnt + 1,
          isFetching: false,
          error: false,
          rtime: new Date().getTime() - state.rtime,
          data: action.json.data,
        };
        return copy;
      }
      case "GET_ERROR": {
        let copy = {
          ...state,
          fcnt: state.fcnt + 1,
          isFetching: false,
          error: true,
          rtime: new Date().getTime() - state.rtime,
        };
        return copy;
      }
      case "GET_CONNECTION_ERROR": {
        let copy = {
          ...state,
          error: action.error.response.status === 401 ? true : state.error,
          fcnt: state.fcnt + 1,
          isFetching: false,
          rtime: new Date().getTime() - state.rtime,
        };
        return copy;
      }
      case "RELOAD_OK": {
        let copy = {
          ...state,
          data: action.json.data,
        };
        return copy;
      }
      default: {
        return state;
      }
    }
  };
}

export function workgroups() {
  const initialState = {
    isFetching: false,
    fcnt: 0,
    rtime: 0, // fetch time
    id: null,
    data: [],
  };
  return function _workgroups(state = { ...initialState }, action) {
    const { path } = action;
    if (path !== "/user/workgroup/edit") {
      return state;
    }
    switch (action.type) {
      case "LIST": {
        return {
          ...initialState,
          id: action.id,
          rtime: new Date().getTime(),
          isFetching: true,
        };
      }
      case "LIST_OK": {
        let copy = {
          ...state,
          fcnt: state.fcnt + 1,
          isFetching: false,
          rtime: new Date().getTime() - state.rtime,
          data: action.json.data,
        };
        return copy;
      }
      default: {
        return state;
      }
    }
  };
}

export function workflows() {
  const initialState = {
    isFetching: false,
    isSubmitting: false,
    isRejecting: false,
    fcnt: 0,
    rtime: 0, // fetch time
    id: null,
    data: [],
  };
  return function _workflows(state = { ...initialState }, action) {
    const { path } = action;
    if (path !== "/workflow/edit") {
      return state;
    }
    switch (action.type) {
      case "LIST": {
        return {
          ...initialState,
          id: action.id,
          rtime: new Date().getTime(),
          isFetching: true,
        };
      }
      case "LIST_OK": {
        let copy = {
          ...state,
          fcnt: state.fcnt + 1,
          isFetching: false,
          rtime: new Date().getTime() - state.rtime,
          data: action.json.data,
        };
        return copy;
      }
      case "SUBMIT": {
        return {
          ...state,
          rtime: new Date().getTime(),
          isSubmitting: true,
        };
      }
      case "SUBMIT_OK": {
        let copy = {
          ...state,
          fcnt: state.fcnt + 1,
          isSubmitting: false,
          rtime: new Date().getTime() - state.rtime,
          data: action.json.data.length > 1 ? action.json.data : [],
        };
        return copy;
      }
      case "REJECT": {
        return {
          ...state,
          rtime: new Date().getTime(),
          isRejecting: true,
        };
      }
      case "REJECT_OK": {
        let copy = {
          ...state,
          fcnt: state.fcnt + 1,
          isRejecting: false,
          rtime: new Date().getTime() - state.rtime,
          data: action.json.data.length > 1 ? action.json.data : [],
        };
        return copy;
      }
      default: {
        return state;
      }
    }
  };
}

export function workflow() {
  const initialState = {
    isFetching: false,
    isPatching: false,
    error: "",
    fcnt: 0,
    rtime: 0, // fetch time
    id: null,
    previous: null, // previous comment
    data: null,
  };
  return function _workflow(state = { ...initialState }, action) {
    const { path } = action;
    if (path !== "/workflow/edit") {
      return state;
    }
    switch (action.type) {
      case "LIST": {
        return {
          ...initialState,
          id: action.id,
          rtime: new Date().getTime(),
          isFetching: true,
        };
      }
      case "LIST_OK": {
        let copy = {
          ...state,
          fcnt: state.fcnt + 1,
          isFetching: false,
          rtime: new Date().getTime() - state.rtime,
          previous:
            action.json.data.length > 1
              ? action.json.data[action.json.data.length - 2]
              : null,
          data:
            action.json.data.length > 0
              ? action.json.data[action.json.data.length - 1]
              : null,
        };
        return copy;
      }
      case "SUBMIT_OK": {
        let copy = {
          ...state,
          fcnt: state.fcnt + 1,
          isFetching: false,
          rtime: new Date().getTime() - state.rtime,
          previous:
            action.json.data.length > 1
              ? action.json.data[action.json.data.length - 2]
              : null,
          data:
            action.json.data.length > 0
              ? action.json.data[action.json.data.length - 1]
              : null,
        };
        return copy;
      }
      case "REJECT_OK": {
        let copy = {
          ...state,
          fcnt: state.fcnt + 1,
          isFetching: false,
          rtime: new Date().getTime() - state.rtime,
          previous:
            action.json.data.length > 1
              ? action.json.data[action.json.data.length - 2]
              : null,
          data:
            action.json.data.length > 0
              ? action.json.data[action.json.data.length - 1]
              : null,
        };
        return copy;
      }
      case "UPDATE": {
        let copy = {
          ...state,
          isPatching: true,
        };
        copy.data[action.field] = action.value;
        return copy;
      }
      case "PATCH": {
        return {
          ...state,
          isPatching: true,
        };
      }
      case "PATCH_OK": {
        return {
          ...state,
          data: {
            ...state.data,
          },
          isPatching: false,
        };
      }
      case "PATCH_ERROR": {
        return {
          ...state,
          error: action.json.message,
          isPatching: false,
        };
      }
      default: {
        return state;
      }
    }
  };
}

export function borehole() {
  const initialState = {
    isFetching: false,
    isLocking: false,
    fcnt: 0,
    rtime: 0, // fetch time
    error: null,
    ...{
      data: {
        id: null,
        visible: false,
        lock: null,
        kind: null,
        restriction: null,
        restriction_until: null,
        national_interest: null,
        location_x: "",
        location_y: "",
        srs: null,
        qt_location: null,
        elevation_z: "",
        hrs: null,
        qt_elevation: null,
        drilling_date: null,
        bore_inc: null,
        bore_inc_dir: null,
        length: null,
        ...{
          extended: {
            original_name: "",
            method: null,
            purpose: null,
            status: null,
            top_bedrock: null,
            groundwater: null,
          },
        },
        ...{
          custom: {
            identifiers: null,
            public_name: "",
            project_name: "",
            country: null,
            canton: null,
            municipality: null,
            address: "",
            landuse: null,
            cuttings: null,
            drill_diameter: "",
            qt_bore_inc_dir: null,
            qt_depth: null,
            qt_top_bedrock: null,
            lithology_top_bedrock: null,
            lit_str_top_bedrock: null,
            chro_str_top_bedrock: null,
            remarks: "",
            national_relevance: null,
          },
        },
        ...{
          updater: {},
        },
        workgroup: null,
        workflow: null,
        role: null,
      },
    },
  };
  return function _borehole(state = initialState, action) {
    const { path } = action;
    if (
      path !== "/borehole/edit" &&
      path !== "/borehole" &&
      path !== "/workflow/edit"
    ) {
      return state;
    }

    if (path === "/workflow/edit") {
      switch (action.type) {
        case "SUBMIT_OK": {
          return {
            ...state,
            isLocking: false,
            data: {
              ...state.data,
              lock: null,
            },
          };
        }
        case "REJECT_OK": {
          return {
            ...state,
            isLocking: false,
            data: {
              ...state.data,
              lock: null,
            },
          };
        }
        default: {
          return state;
        }
      }
    } else {
      switch (action.type) {
        case "CLEAR": {
          return {
            ...initialState,
            fcnt: state.fcnt,
          };
        }
        case "GET": {
          return {
            ...initialState,
            fcnt: state.fcnt,
            rtime: new Date().getTime(),
            isFetching: true,
          };
        }
        case "GET_OK": {
          let copy = {
            ...state,
            fcnt: state.fcnt + 1,
            isFetching: false,
            rtime: new Date().getTime() - state.rtime,
            data: {
              ...initialState.data,
              ...action.json.data,
              extended: {
                ...initialState.data.extended,
                ...action.json.data.extended,
              },
              custom: {
                ...initialState.data.custom,
                ...action.json.data.custom,
              },
            },
          };
          return copy;
        }
        case "EDIT": {
          return {
            ...initialState,
            fcnt: state.fcnt,
            rtime: new Date().getTime(),
            isFetching: true,
          };
        }
        case "EDIT_OK": {
          let copy = {
            ...state,
            fcnt: state.fcnt + 1,
            isFetching: false,
            rtime: new Date().getTime() - state.rtime,
            data: {
              ...initialState.data,
              ...action.json.data,
              extended: {
                ...initialState.data.extended,
                ...action.json.data.extended,
              },
              custom: {
                ...initialState.data.custom,
                ...action.json.data.custom,
              },
            },
          };
          return copy;
        }
        case "EDIT_ERROR": {
          let copy = {
            ...state,
            fcnt: state.fcnt + 1,
            isFetching: false,
            rtime: new Date().getTime() - state.rtime,
            data: action.json.data,
            error: action.json.error,
          };
          return copy;
        }
        case "UPDATE": {
          return {
            ...state,
            data: action.data,
          };
        }
        case "LOCK": {
          return {
            ...state,
            isLocking: true,
          };
        }
        case "LOCK_OK": {
          return {
            ...state,
            isLocking: false,
            data: {
              ...state.data,
              lock: action.json.data,
            },
          };
        }
        case "UNLOCK": {
          return {
            ...state,
            isLocking: true,
          };
        }
        case "UNLOCK_OK": {
          return {
            ...state,
            isLocking: false,
            data: {
              ...state.data,
              lock: null,
            },
          };
        }
        default: {
          return state;
        }
      }
    }
  };
}

export function boreholeList() {
  const initialState = {
    isFetching: false,
    rtime: 0, // fetch time
    fcnt: 0, // fetch counter
    dlen: 0, // data counter
    data: [],
    direction: null,
    orderby: null,
    page: 1,
    pages: 0,
  };
  return function boreholes(state = initialState, action) {
    const { path } = action;
    if (path !== "/borehole") {
      return state;
    }
    switch (action.type) {
      case "LIST": {
        return {
          ...initialState,
          rtime: new Date().getTime(),
          page: state.page,
          pages: state.pages,
          direction: state.direction,
          orderby: state.orderby,
          isFetching: true,
        };
      }
      case "LIST_OK": {
        let copy = {
          ...state,
          fcnt: state.fcnt + 1,
          dlen: action.json.rows,
          isFetching: false,
          rtime: new Date().getTime() - state.rtime,
          data: action.json.data,
          pages: action.json.hasOwnProperty("pages") ? action.json.pages : null,
          page: action.json.hasOwnProperty("page") ? action.json.page : null,
          direction: action.json.hasOwnProperty("direction")
            ? action.json.direction
            : null,
          orderby: action.json.hasOwnProperty("orderby")
            ? action.json.orderby
            : null,
        };
        return copy;
      }
      default: {
        return state;
      }
    }
  };
}

export function boreholeEditorList() {
  const initialState = {
    isFetching: false,
    rtime: 0, // fetch time
    fcnt: 0, // fetch counter
    dlen: 0, // data counter
    data: [],
    direction: null,
    orderby: null,
    page: 1,
    pages: 0,
  };
  return function boreholesEditor(state = initialState, action) {
    const { path } = action;
    if (path !== "/borehole/edit") {
      return state;
    }
    switch (action.type) {
      case "LIST": {
        return {
          ...initialState,
          rtime: new Date().getTime(),
          page: state.page,
          pages: state.pages,
          direction: state.direction,
          orderby: state.orderby,
          isFetching: true,
        };
      }
      case "LIST_OK": {
        let copy = {
          ...state,
          fcnt: state.fcnt + 1,
          dlen: action.json.rows,
          isFetching: false,
          rtime: new Date().getTime() - state.rtime,
          data: action.json.data,
          pages: action.json.hasOwnProperty("pages") ? action.json.pages : null,
          page: action.json.hasOwnProperty("page") ? action.json.page : null,
          direction: action.json.hasOwnProperty("direction")
            ? action.json.direction
            : null,
          orderby: action.json.hasOwnProperty("orderby")
            ? action.json.orderby
            : null,
        };
        return copy;
      }
      default: {
        return state;
      }
    }
  };
}

export function projectList() {
  const initialState = {
    isFetching: false,
    rtime: 0, // fetch time
    fcnt: 0, // fetch counter
    dlen: 0, // data counter
    data: [],
    page: 1,
    pages: 0,
  };
  return function projects(state = initialState, action) {
    const { path } = action;
    if (path !== "/borehole/project") {
      return state;
    }
    switch (action.type) {
      case "LIST": {
        return {
          ...initialState,
          rtime: new Date().getTime(),
          page: state.page,
          pages: state.pages,
          isFetching: true,
        };
      }
      case "LIST_OK": {
        let copy = {
          ...state,
          fcnt: state.fcnt + 1,
          dlen: action.json.rows,
          isFetching: false,
          rtime: new Date().getTime() - state.rtime,
          data: action.json.data,
          pages: action.json.hasOwnProperty("pages") ? action.json.pages : null,
          page: action.json.hasOwnProperty("page") ? action.json.page : null,
        };
        return copy;
      }
      default: {
        return state;
      }
    }
  };
}

export function stratigraphyList() {
  const initialState = {
    isFetching: false,
    rtime: 0, // fetch time
    fcnt: 0, // fetch counter
    dlen: 0, // data counter
    data: [],
    page: 1,
    pages: 0,
  };
  return function stratigraphy(state = initialState, action) {
    const { path } = action;
    if (path !== "/borehole/stratigraphy") {
      return state;
    }
    switch (action.type) {
      case "LIST": {
        return {
          ...initialState,
          rtime: new Date().getTime(),
          page: state.page,
          pages: state.pages,
          isFetching: true,
        };
      }
      case "LIST_OK": {
        let copy = {
          ...state,
          fcnt: state.fcnt + 1,
          dlen: action.json.rows,
          isFetching: false,
          rtime: new Date().getTime() - state.rtime,
          data: action.json.data,
          pages: action.json.hasOwnProperty("pages") ? action.json.pages : null,
          page: action.json.hasOwnProperty("page") ? action.json.page : null,
        };
        return copy;
      }
      default: {
        return state;
      }
    }
  };
}

export function domainsList() {
  const initialState = {
    isFetching: false,
    rtime: 0, // fetch time
    fcnt: 0, // fetch counter
    data: {},
  };
  return function domains(state = initialState, action) {
    const { path } = action;
    if (path === "/borehole/codes") {
      switch (action.type) {
        case "LIST": {
          return {
            ...initialState,
            rtime: new Date().getTime(),
            data: {},
            isFetching: true,
          };
        }
        case "LIST_OK": {
          let copy = {
            ...state,
            fcnt: state.fcnt + 1,
            isFetching: false,
            rtime: new Date().getTime() - state.rtime,
            data: action.json.data,
          };
          return copy;
        }
        case "PATCH_OK": {
          let copy = {
            ...state,
          };
          if (copy.data.hasOwnProperty(action.json.schema)) {
            const data = copy.data[action.json.schema];
            for (let idx = 0; idx < data.length; idx++) {
              const element = data[idx];
              if (element.id === action.json.code_id) {
                element.conf = action.json.data;
                break;
              }
            }
          }
          return copy;
        }
        default: {
          return state;
        }
      }
    } else if (path === "/borehole/identifier") {
      switch (action.type) {
        case "LIST": {
          return {
            ...state,
            rtime: new Date().getTime(),
            isFetching: true,
          };
        }
        case "LIST_OK": {
          let copy = {
            ...state,
            fcnt: state.fcnt + 1,
            isFetching: false,
            rtime: new Date().getTime() - state.rtime,
            data: {
              ...state.data,
              ...action.json.data,
            },
          };
          return copy;
        }
        default: {
          return state;
        }
      }
    }
    return state;
  };
}

export function layersList() {
  const initialState = {
    isFetching: false,
    rtime: 0, // fetch time
    fcnt: 0, // fetch counter
    data: [],
  };
  return function layers(state = initialState, action) {
    const { path } = action;
    if (path !== "/borehole/stratigraphy/layer") {
      return state;
    }
    switch (action.type) {
      case "LIST": {
        return {
          ...initialState,
          rtime: new Date().getTime(),
          data: [],
          isFetching: true,
        };
      }
      case "LIST_OK": {
        let copy = {
          ...state,
          fcnt: state.fcnt + 1,
          isFetching: false,
          rtime: new Date().getTime() - state.rtime,
          data: action.json.data,
        };
        return copy;
      }
      default: {
        return state;
      }
    }
  };
}

// Function that add dynamically reducers to the store
// Inspired by: https://stackoverflow.com/a/33044701
export function createReducer(pluginsReducers) {
  const combinedReducers = combineReducers({
    core_user: user(),
    core_workgroups: workgroups(),
    core_workflow: workflow(),
    core_workflows: workflows(),
    core_borehole: borehole(),
    core_borehole_list: boreholeList(),
    core_borehole_editor_list: boreholeEditorList(),
    core_project_list: projectList(),
    core_stratigraphy_list: stratigraphyList(),
    core_domain_list: domainsList(),
    core_layers_list: layersList(),
    ...pluginsReducers,
  });
  return combinedReducers;
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export function configureStore() {
  const store = createStore(
    createReducer(),
    composeEnhancers(applyMiddleware(thunkMiddleware)),
  );
  store.pluginsReducers = {};
  return store;
}

export function injectReducer(store, reducer) {
  store.pluginsReducers = {
    ...store.pluginsReducers,
    ...reducer,
  };
  store.replaceReducer(createReducer(store.pluginsReducers));
}

const store = configureStore();
export default store;
