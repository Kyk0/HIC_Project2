import { API_URL, authFetch } from "./index";

export function getComments(recipeId) {
  return fetch(`${API_URL}/recipes/${recipeId}/comments`).then(r => r.json());
}

export function postComment(recipeId, body) {
  return authFetch(`/recipes/${recipeId}/comments`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
}

export function updateComment(id, body) {
  return authFetch(`/comments/${id}`, {
    method: "PUT",
    body: JSON.stringify({ body }),
  });
}

export function deleteComment(id) {
  return authFetch(`/comments/${id}`, { method: "DELETE" });
}
