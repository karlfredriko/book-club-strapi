import { authGet, noAuthFetch, authPut } from "./api-functions.js";
import { affirmationModal } from "./modals.js";

let loginBtn = document.querySelector("#login");
let logoutBtn = document.querySelector("#logout");
let createUserBtn = document.querySelector("#createUser");
let allBooks = document.querySelector("#allBooks");
let myBooks = document.querySelector("#myBooks");
let myRatedBooks = document.querySelector("#myRatedBooks");
let userFeatures = document.querySelector("#userFeatures");
let displayUser = document.querySelector("#displayUser");
let main = document.querySelector("main");

let getAverageRating = (arr) => {
  let total = 0;
  let average = 0;
  arr.forEach((rating) => {
    if (rating.attributes) {
      let { userRating } = rating.attributes;
      total += userRating;
    } else {
      total += rating.userRating;
    }
  });
  return (average = total / arr.length).toFixed(1);
};

export let checkForRating = (arr) => {
  let articles = document.querySelectorAll("article");
  for (let i = 0; i < articles.length; i++) {
    arr.forEach((rating) => {
      if (articles[i].id === `id${rating.book.id}`) {
        let { book, userRating } = rating;
        console.log("MATCH");
        let option = document.querySelector(`#opt${book.id}val${userRating}`);
        option.selected = true;
      }
    });
  }
};

export let createRatingMenu = (element, id) => {
  let select = document.createElement("select");
  select.style.pointerEvents = "all";
  select.id = `select${id}`;
  select.innerHTML = `
    <option selected hidden>Välj betyg</option>
    <option id="opt${id}val1">1</option>
    <option id="opt${id}val2">2</option>
    <option id="opt${id}val3">3</option>
    <option id="opt${id}val4">4</option>
    <option id="opt${id}val5">5</option>
    <option id="opt${id}val6">6</option>
    <option id="opt${id}val7">7</option>
    <option id="opt${id}val8">8</option>
    <option id="opt${id}val9">9</option>
    <option id="opt${id}val10">10</option>
    `;
  element.append(select);
};

export let createBookCard = (
  id,
  title,
  author,
  rating,
  totalPages,
  releaseDate,
  url,
  altText,
  clickable,
  rateable
) => {
  let article = document.createElement("article");
  article.classList = "book-card";
  article.id = `id${id}`;
  article.innerHTML = `
    <h2 class="book-title">${title}</h2>
      <div>
        <div class="book-info">
          <div id="div${id}">
            <h3>${author}</h3>
            <h3>${rating}</h3>
          </div>
          <div>
            <h4>${totalPages} pages</h4>
            <h4>${releaseDate}</h4>
          </div>
        </div>
        <img src="http://localhost:1337${url}" alt="${altText}" />
      </div>
      `;
  main.append(article);
  if (rateable) {
    let div = document.querySelector(`#div${id}`);
    createRatingMenu(div, id);
  }
  if (clickable) {
    article.onclick = async (e) => {
      if (e.target.id.includes("id") && sessionStorage.getItem("user")) {
        let url = `/api/books/${e.target.id.slice(2)}`;
        let data = {
          user: sessionStorage.getItem("userId"),
        };
        console.log("url", url);
        console.log("data", data);
        await authPut(url, data);
        affirmationModal(title);
        modal.style.display = "block";
      }
    };
  }
};

export let printBooks = (arr, clickable, rateable) => {
  main.innerHTML = "";
  let rating = "Inte Betygsatt";
  if (arr[0].attributes) {
    arr.forEach((element) => {
      console.log("book", element);
      let { data } = element.attributes.ratings;
      let { author, title, releaseDate, totalPages } = element.attributes;
      let { url, alternativeText } =
        element.attributes.coverImage.data.attributes;
      if (data.length > 0) {
        rating = getAverageRating(data);
      }
      createBookCard(
        element.id,
        title,
        author,
        rating,
        totalPages,
        releaseDate,
        url,
        alternativeText,
        clickable,
        rateable
      );
    });
  } else {
    arr.forEach((element) => {
      let { ratings } = element;
      let { author, title, releaseDate, totalPages } = element;
      let { url, alternativeText } = element.coverImage;
      if (ratings.length > 0) {
        rating = getAverageRating(ratings);
      }
      createBookCard(
        element.id,
        title,
        author,
        rating,
        totalPages,
        releaseDate,
        url,
        alternativeText,
        clickable,
        rateable
      );
    });
  }
};

export let userLoggedIn = async () => {
  loginBtn.classList = "none";
  createUserBtn.classList = "none";
  logoutBtn.classList = "";
  userFeatures.classList = "";
  displayUser.innerText = `${sessionStorage.getItem("user")}`;
  let books = await noAuthFetch("/api/books?populate=deep");
  printBooks(books.data, true);
};

allBooks.addEventListener("click", async () => {
  let books = await noAuthFetch("/api/books?populate=deep");
  printBooks(books.data, true, false);
});

myBooks.addEventListener("click", async () => {
  let userInfo = await authGet("/api/users/me?populate=deep");
  console.log("my books", userInfo.books);
  console.log("ratings", userInfo.ratings);
  printBooks(userInfo.books, false, true);
  checkForRating(userInfo.ratings);
});

export let renderPage = async () => {
  if (sessionStorage.getItem("user")) {
    console.log("user logged in");
    userLoggedIn();
  } else {
    console.log("user not logged in");
    loginBtn.classList = "";
    createUserBtn.classList = "";
    logoutBtn.classList = "none";
    userFeatures.classList = "hidden";
    displayUser.innerText = "";
    let books = await noAuthFetch("/api/books?populate=deep");
    printBooks(books.data);
  }
};
