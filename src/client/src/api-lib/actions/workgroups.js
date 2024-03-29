import { fetch } from "./index";

export function createWorkgroup(name) {
  return fetch("/user/workgroup/edit", {
    action: "CREATE",
    name: name,
  });
}

export function enableWorkgroup(id) {
  return fetch("/user/workgroup/edit", {
    action: "ENABLE",
    id: id,
  });
}

export function disableWorkgroup(id) {
  return fetch("/user/workgroup/edit", {
    action: "DISABLE",
    id: id,
  });
}

export function deleteWorkgroup(id) {
  return fetch("/user/workgroup/edit", {
    action: "DELETE",
    id: id,
  });
}

export function updateWorkgroup(id, name) {
  return fetch("/user/workgroup/edit", {
    action: "UPDATE",
    id: id,
    name: name,
  });
}

export function listWorkgroups() {
  return fetch("/user/workgroup/edit", {
    type: "LIST",
  });
}

export function setRole(user_id, workgroup_id, role_name, activateRole = true) {
  return fetch("/user/workgroup/edit", {
    action: "SET",
    user_id: user_id,
    workgroup_id: workgroup_id,
    role_name: role_name,
    active: activateRole,
  });
}
