import { API_URL, authFetch } from "./index";


export function getRecipes(params = {}) {

  const qs = new URLSearchParams(params).toString();
  let path = "/recipes";
  if (qs) {path = path + "?" + qs}
  
  return fetch(API_URL + path).then(r => r.json());
}


export function getRecipe(id) {
  return fetch(API_URL + "/recipes/" + id).then(r => r.json());
}

export function createRecipe(data) {
  return authFetch("/recipes", {method: "POST", body: JSON.stringify(data)});
}


export function updateRecipe(id, data) {
  return authFetch("/recipes/" + id, {method: "PUT", body: JSON.stringify(data)});
}

export function deleteRecipe(id) {
  return authFetch("/recipes/" + id, {method: "DELETE" });
}