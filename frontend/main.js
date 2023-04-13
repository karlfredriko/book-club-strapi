import { noAuthFetch, apiLogin } from "./api-functions.js";

let main = document.querySelector("main");
let login = document.querySelector("#login");
let logoutBtn = document.querySelector("logout");
let header = document.querySelector("header");

// LOGOUT BTN
// logoutBtn.addEventListener("click", () => {
//   sessionStorage.clear();
//   renderPage();
// });

login.addEventListener("click", () => {
  createLoginModal();
  let loginModal = document.querySelector("#loginModal");
  loginModal.style.display = "block";
});

let createLoginModal = () => {
  //CREATES MODAL
  let div = document.createElement("div");
  div.id = "loginModal";
  div.classList = "modal";
  div.innerHTML = `
  <div class="modal-content">
    <input type="text" id="username" placeholder="Username" />
    <input type="text" id="password" placeholder="Password" />
    <div>
    <p id="msg" class="msg"></p>
    <button id="loginBtn">Login</button>
    </div>
  </div>
  `;
  main.prepend(div);
  //LOCAL DOM REFS
  let userInput = document.querySelector("#username");
  let passwordInput = document.querySelector("#password");
  let loginBtn = document.querySelector("#loginBtn");
  let message = document.querySelector("#msg");
  //CLOSE MODAL
  window.onclick = (event) => {
    let loginModal = document.querySelector("#loginModal");
    if (event.target === loginModal) {
      loginModal.remove();
    }
  };
  //LOGIN-BTN FUNCTIONALITY
  loginBtn.addEventListener("click", async () => {
    console.log(userInput.value, passwordInput.value);
    try {
      await apiLogin("/api/auth/local", userInput.value, passwordInput.value);
      message.innerText = `${sessionStorage.getItem("user")} loggas in...`;
      console.log("soon login");
      setTimeout(() => {
        loginModal.remove();
      }, 2000);
      renderPage();
    } catch (err) {
      message.innerText = `Error: ${err} \nVänligen försök igen.`;
    }
  });
};

let userLoggedIn = async () => {
  let books = await noAuthFetch("/api/books?populate=deep", "data.data");
  print(books.data);
};

let print = (arr) => {
  arr.forEach((element) => {
    console.log("book", element);
    let { author, title, releaseDate, totalPages } = element.attributes;
    let { url, alternativeText } =
      element.attributes.coverImage.data.attributes;
    let article = document.createElement("article");
    article.classList = "book-card";
    article.innerHTML = `
    <h2 class="book-title">${title}</h2>
      <div>
        <div class="book-info">
          <h3>${author}</h3>
          <h4>Pages: ${totalPages}</h4>
          <h4>Released: ${releaseDate}</h4>;
        </div>
        <img src="http://localhost:1337${url}" alt="${alternativeText}" />
      </div>
      `;
    main.append(article);
  });
};

let renderPage = async () => {
  // await noAuthFetch("/api/users?populate=deep", "data");
  if (sessionStorage.getItem("user")) {
    console.log("user logged in");
    userLoggedIn();
  } else {
    console.log("user not logged in");
    let books = await noAuthFetch("/api/books?populate=deep", "data.data");
    print(books.data);
  }
};

renderPage();
