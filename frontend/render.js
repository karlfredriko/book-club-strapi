import { authGet, noAuthFetch, authPut } from "./api-functions.js";

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
    let { userRating } = rating.attributes;
    total += userRating;
  });
  return (average = total / arr.length).toFixed(1);
};

let usersRatedBooks = (arr) => {
  let ratedArr = [];
  arr.forEach((element) => {
    if (element.attributes.includes(sessionStorage.getItem("user"))) {
    }
  });
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
  clickable
) => {
  let article = document.createElement("article");
  article.classList = "book-card";
  article.id = `id${id}`;
  article.innerHTML = `
    <h2 class="book-title">${title}</h2>
      <div>
        <div class="book-info">
          <div>
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
  if (clickable) {
    article.onclick = (e) => {
      if (e.target.id.includes("id") && sessionStorage.getItem("user")) {
        let id = e.target.id.slice(-1);
        console.log(`the book id is: ${id}`);
      }
    };
  }
};

export let printBooks = (arr, clickable) => {
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
        clickable
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
        clickable
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
  printBooks(books.data, true);
});

myBooks.addEventListener("click", async () => {
  let myBooks = await authGet("/api/users/me?populate=deep");
  console.log("my books", myBooks.books);
  printBooks(myBooks.books);
});

export let renderPage = async () => {
  // await noAuthFetch("/api/users?populate=deep", "data");
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
