import { authFetch } from "./index";


export function getCookbook() {
  return authFetch("/cookbook");
}

export function saveRecipe(id) {
  return authFetch("/cookbook/" + id, {method: "POST" });
}

export function unsaveRecipe(id) {
  return authFetch("/cookbook/" + id, { method: "DELETE"});
}