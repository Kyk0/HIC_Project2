import { API_URL } from "./index";


export function login(email, password) {
  
  return fetch(API_URL +"/auth/login", {
method: "POST",
    headers: {"Content-Type" : "application/json"}, 
    body: JSON.stringify({email, password }), 
  }).then(r => r.json());
}


export function signup(username, email, password) {
  
  return fetch(API_URL + "/auth/signup", {
    method: "POST",
    headers: {"Content-Type" : "application/json"},
    body: JSON.stringify({ username, email, password }),
  }).then(r => r.json());
}

export function getMe() {

  const token = localStorage.getItem("token");
  return fetch(API_URL + "/auth/me", {headers: { Authorization: "Bearer " + token},}).then(r => r.json());
}