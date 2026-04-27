import { authFetch } from "./index";

export function getProfile() {
  return authFetch("/profile");
}

export function updateProfile(data) {
  return authFetch("/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function updatePassword(data) {
  return authFetch("/profile/password", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
