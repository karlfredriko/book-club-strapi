import { loginModal, createUserModal } from "./modals.js";
import { renderPage } from "./render.js";

let loginBtn = document.querySelector("#login");
let logoutBtn = document.querySelector("#logout");
let createUserBtn = document.querySelector("#createUser");

// LOGOUT BTN
logoutBtn.addEventListener("click", () => {
  sessionStorage.clear();
  renderPage();
});

// CREATE USER BTN
createUserBtn.addEventListener("click", () => {
  createUserModal();
  let modal = document.querySelector("#modal");
  modal.style.display = "block";
});

// LOGIN BTN
loginBtn.addEventListener("click", () => {
  loginModal();
  let modal = document.querySelector("#modal");
  modal.style.display = "block";
});

renderPage();
