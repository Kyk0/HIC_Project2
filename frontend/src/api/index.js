export const API_URL = "http://localhost:8000";


export function authFetch(path, options = {}) {

  const token = localStorage.getItem("token");
  
  return fetch(API_URL + path, {
    ...options,
    
    headers: {
      "Content-Type" : "application/json",
      ...(token ? {Authorization: "Bearer " + token } : {}),
      ...options.headers,
    },
  }).then(r => r.json());
}