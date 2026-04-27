import { authFetch } from "./index";


export function getKitchen() {
  return authFetch("/kitchen");
}

export function getIngredients() {
  return authFetch("/kitchen/ingredients");
}


export function addItem(data) {
  return authFetch("/kitchen", {method: "POST", body: JSON.stringify(data)});
}

export function updateItem(id, data) {
  return authFetch("/kitchen/" + id, { method: "PUT", body: JSON.stringify(data),});
}


export function deleteItem(id) {
  return authFetch("/kitchen/" + id, {method: "DELETE" });
}

export function moveChecked() {
  return authFetch("/kitchen/move-checked", {method: "POST"});
}


export function clearItems(params = {}) {
  const qs = new URLSearchParams(params).toString();
  let path = "/kitchen/clear";
  if (qs) path += "?" + qs;
  return authFetch(path, {method: "DELETE"});
}