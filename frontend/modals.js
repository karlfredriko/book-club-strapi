import { noAuthFetch, apiLogin, createUser } from "./api-functions.js";
import { renderPage } from "./render.js";

let main = document.querySelector("main");

export let loginModal = () => {
  //CREATES MODAL
  let div = document.createElement("div");
  div.id = "modal";
  div.classList = "modal";
  div.innerHTML = `
  <div class="modal-content">
    <p class="modal-welcome">Skriv in dina inloggnings uppgifter</p>
    <input type="text" id="username" placeholder="Username" />
    <input type="password" id="password" placeholder="Password" />
    <div>
    <p id="msg" class="msg"></p>
    <button id="loginBtn">Logga in</button>
    </div>
  </div>
  `;
  main.prepend(div);
  //LOCAL DOM REFS
  let userInput = document.querySelector("#username");
  let passwordInput = document.querySelector("#password");
  let loginBtn = document.querySelector("#loginBtn");
  let message = document.querySelector("#msg");
  let modal = document.querySelector("#modal");
  //LOGIN-BTN FUNCTIONALITY
  loginBtn.addEventListener("click", async () => {
    console.log(userInput.value, passwordInput.value);
    try {
      await apiLogin("/api/auth/local", userInput.value, passwordInput.value);
      message.innerText = `${sessionStorage.getItem("user")} loggas in...`;
      console.log("soon login");
      setTimeout(() => {
        modal.remove();
      }, 2000);
      renderPage();
    } catch (err) {
      message.innerText = `Error: ${err} \nVänligen försök igen.`;
    }
  });
};

export let createUserModal = () => {
  //CREATES MODAL
  let div = document.createElement("div");
  div.id = "modal";
  div.classList = "modal";
  div.innerHTML = `
  <div class="modal-content">
    <p class="modal-welcome">Skapa din användare</p>
    <input type="text" id="username" placeholder="Username" />
    <input type="email" id="email" placeholder="Email" />
    <input type="password" id="password" placeholder="Password" />
    <div>
    <p id="msg" class="msg"></p>
    <button id="createBtn">Skapa</button>
    </div>
  </div>
  `;
  main.prepend(div);
  //LOCAL DOM REFS
  let userInput = document.querySelector("#username");
  let emailInput = document.querySelector("#email");
  let passwordInput = document.querySelector("#password");
  let createBtn = document.querySelector("#createBtn");
  let message = document.querySelector("#msg");
  let modal = document.querySelector("#modal");
  //LOGIN-BTN FUNCTIONALITY
  createBtn.addEventListener("click", async () => {
    try {
      await createUser(
        "/api/auth/local/register",
        userInput.value,
        passwordInput.value,
        emailInput.value
      );
      message.innerText = `${sessionStorage.getItem(
        "user"
      )}, inlogg skapas och du loggas in..`;
      setTimeout(() => {
        modal.remove();
      }, 2000);
      renderPage();
    } catch (err) {
      message.innerText = `Error: ${err} \nVänligen försök igen.`;
    }
  });
};
