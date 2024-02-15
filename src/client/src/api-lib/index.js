import { getHeight, downloadBorehole } from "./actions";

import { loadSettings, patchSettings } from "./actions/settings";

import {
  acceptTerms,
  draftTerms,
  getTerms,
  getTermsDraft,
  publishTerms,
} from "./actions/terms";

import {
  draftContent,
  getContent,
  getContentDraft,
  publishContent,
} from "./actions/content";

import {
  setAuthentication,
  unsetAuthentication,
  loadUser,
  reloadUser,
  updateUser,
  disableUser,
  deleteUser,
  enableUser,
} from "./actions/user";

import {
  createWorkgroup,
  enableWorkgroup,
  disableWorkgroup,
  deleteWorkgroup,
  listWorkgroups,
  setRole,
  updateWorkgroup,
} from "./actions/workgroups";

import {
  getBorehole,
  updateBorehole,
  loadBorehole,
  loadBoreholes,
  getdBoreholeIds,
  loadEditingBoreholes,
  createBorehole,
  lockBorehole,
  unlockBorehole,
  editBorehole,
  deleteBorehole,
  deleteBoreholes,
  patchBorehole,
  patchBoreholes,
  getGeojson,
} from "./actions/borehole";

import {
  listIdentifier,
  createIdentifier,
  deleteIdentifier,
  updateIdentifier,
  addIdentifier,
  removeIdentifier,
} from "./actions/identifier";

import {
  loadWorkflows,
  patchWorkflow,
  updateWorkflow,
  submitWorkflow,
  rejectWorkflow,
  resetWorkflow,
} from "./actions/workflow";

import {
  createLayer,
  deleteLayer,
  gapLayer,
  getLayers,
} from "./actions/stratigraphy";

import { getProfile, getProfileLayers } from "./actions/profile";

import { loadDomains, patchCodeConfig } from "./actions/domains";

import { getWms } from "./actions/geoapi";

import { createFeedback } from "./actions/feedback";

import store, {
  injectReducer,
  configureStore,
  createReducer,
} from "./reducers";

export {
  getHeight,
  downloadBorehole,
  loadSettings,
  patchSettings,
  acceptTerms,
  draftTerms,
  getTerms,
  getTermsDraft,
  publishTerms,
  draftContent,
  getContent,
  getContentDraft,
  publishContent,
  setAuthentication,
  unsetAuthentication,
  loadUser,
  reloadUser,
  updateUser,
  disableUser,
  deleteUser,
  enableUser,
  createWorkgroup,
  enableWorkgroup,
  disableWorkgroup,
  deleteWorkgroup,
  listWorkgroups,
  setRole,
  updateWorkgroup,
  getBorehole,
  loadBorehole,
  updateBorehole,
  loadBoreholes,
  loadEditingBoreholes,
  getdBoreholeIds,
  createBorehole,
  lockBorehole,
  unlockBorehole,
  editBorehole,
  deleteBorehole,
  deleteBoreholes,
  patchBorehole,
  patchBoreholes,
  getGeojson,
  listIdentifier,
  createIdentifier,
  deleteIdentifier,
  updateIdentifier,
  addIdentifier,
  removeIdentifier,
  loadWorkflows,
  patchWorkflow,
  updateWorkflow,
  submitWorkflow,
  rejectWorkflow,
  resetWorkflow,
  createLayer,
  deleteLayer,
  gapLayer,
  getLayers,
  getProfile,
  getProfileLayers,
  loadDomains,
  patchCodeConfig,
  getWms,
  createFeedback,

  // Reducers
  store,
  configureStore,
  createReducer,
  injectReducer,
};
