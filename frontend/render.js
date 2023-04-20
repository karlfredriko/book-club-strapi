import { authGet, noAuthGet, authPut, authPost } from "./api-functions.js";
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

let checkTheme = async () => {
  let response = await noAuthGet("/api/theme");
  let r = document.querySelector(":root");
  let { color } = response.data.attributes;
  if (color === "blue") {
    r.style.setProperty("--background", "#f0ffff");
    r.style.setProperty("--font", "#144db8");
  } else if (color === "brownish") {
    r.style.setProperty("--background", "#ffc99a");
    r.style.setProperty("--font", "#7a0a0a");
  } else if (color === "crazy") {
    r.style.setProperty(
      "--background",
      "linear-gradient(red, yellow 30%, red)"
    );
    r.style.setProperty("--font", "#520000");
  }
};
checkTheme();

let checkForSortingMenu = () => {
  if (document.querySelector("#sortingMenu")) {
    document.querySelector("#sortingMenu").remove();
  }
};

let sortingWords = (arr, property) => {
  let sortedArray;
  return (sortedArray = arr.sort((a, b) => {
    const propA = a[property].toUpperCase();
    const propB = b[property].toUpperCase();
    if (propA < propB) {
      return -1;
    }
    if (propA > propB) {
      return 1;
    }
    return 0;
  }));
};

let updateAverageRating = async (bookId, element) => {
  let result = await authGet(`/api/books/${bookId}?populate=ratings`);
  let newRating = getAverageRating(result.data.attributes.ratings.data);
  element.innerText = newRating;
};

let createSortingMenu = () => {
  if (!document.querySelector("#sortingMenu")) {
    let select = document.createElement("select");
    select.id = "sortingMenu";
    select.innerHTML = `
        <option value="default" selected hidden>Sortera lista</option>
        <option value="author">Författare</option>
        <option value="title">Titel</option>
        <option value="userRating">Ditt betyg</option>
    `;
    userFeatures.append(select);
  } else {
    let select = document.querySelectorAll("#sortingMenu option");
    select.forEach((option) => {
      if (option.value === "default") {
        option.selected = "true";
      }
    });
  }
  let menu = document.querySelector("#sortingMenu");
  menu.addEventListener("change", async (e) => {
    let data = await authGet("/api/users/me?populate=deep");
    if (e.target.value === "title" || e.target.value === "author") {
      console.log("im here", e.target.value);
      let sortedArray = sortingWords(data.books, e.target.value);
      let finalArray = sortedArray.filter(
        (objekt) => objekt.ratings.length > 0
      );
      printBooks(finalArray, false, true);
    } else if (e.target.value === "userRating") {
      let sortedArray = data.ratings.sort(
        (a, b) => b.userRating - a.userRating
      );
      console.log("sortedArray", sortedArray);
      let newArray = [];
      sortedArray.forEach((i) => {
        newArray.push(i.book);
      });
      printBooks(newArray, false, true);
    }
    checkForRating(data.ratings);
  });
};

export let getAverageRating = (arr) => {
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
  return `${(average = total / arr.length).toFixed(1)} / 10`;
};

export let checkForRating = (arr) => {
  let articles = document.querySelectorAll("article");
  for (let i = 0; i < articles.length; i++) {
    arr.forEach((rating) => {
      if (articles[i].id === `id${rating.book.id}`) {
        let { book, userRating } = rating;
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
  select.innerHTML = "<option selected hidden>Välj betyg</option>";
  for (let i = 1; i < 11; i++) {
    let option = document.createElement("option");
    option.id = `opt${id}val${i}`;
    option.innerText = `${i}`;
    select.append(option);
  }
  element.append(select);
  select.addEventListener("change", async (e) => {
    let ratingExists = false;
    let ratingId = "";
    let data = await authGet("/api/users/me?populate=deep");
    console.log(data);
    data.ratings.forEach((rating) => {
      if (rating.book.id === id) {
        ratingExists = true;
        ratingId = rating.id;
        return ratingExists;
      }
    });
    console.log("rating?", ratingExists);
    if (ratingExists) {
      console.log("update rating");
      let data = {
        userRating: e.target.value,
      };
      await authPut(`/api/ratings/${ratingId}`, data);
    } else {
      console.log("create rating");
      let data = {
        userRating: e.target.value,
        book: id,
        user: sessionStorage.getItem("userId"),
      };
      await authPost("/api/ratings", data);
    }
    await updateAverageRating(id, document.querySelector(`#rating${id}`));
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
            <h3 id="rating${id}">${rating}</h3>
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

export let isEmpty = async () => {
  main.innerHTML = "";
  let response = await authGet("/api/empty?populate=deep");
  console.log(response.data.attributes.meme.data.attributes);
  let { url, alternativeText } = response.data.attributes.meme.data.attributes;
  main.innerHTML = `
      <img src="http://localhost:1337${url}" alt="${alternativeText}" style="height: 600px">`;
};

export let printBooks = (arr, clickable, rateable) => {
  main.innerHTML = "";
  if (arr[0].attributes) {
    arr.forEach((element) => {
      let rating = "Inte Betygsatt";
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
      let rating = "Inte Betygsatt";
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
  let books = await noAuthGet("/api/books?populate=deep");
  printBooks(books.data, true);
};

allBooks.addEventListener("click", async () => {
  let books = await noAuthGet("/api/books?populate=deep");
  printBooks(books.data, true, false);
  checkForSortingMenu();
});

myBooks.addEventListener("click", async () => {
  let userInfo = await authGet("/api/users/me?populate=deep");
  if (userInfo.books.length === 0) {
    isEmpty();
  } else {
    console.log("my books", userInfo.books);
    console.log("ratings", userInfo.ratings);
    printBooks(userInfo.books, false, true);
    checkForRating(userInfo.ratings);
    checkForSortingMenu();
  }
});

myRatedBooks.addEventListener("click", async () => {
  let userInfo = await authGet("/api/users/me?populate=deep");
  if (userInfo.ratings.length === 0) {
    isEmpty();
  } else {
    console.log("ratings", userInfo.ratings);
    let ratedBooks = [];
    userInfo.ratings.forEach((rating) => {
      ratedBooks.push(rating.book);
    });
    printBooks(ratedBooks, false, true);
    checkForRating(userInfo.ratings);
    createSortingMenu();
  }
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
    let books = await noAuthGet("/api/books?populate=deep");
    printBooks(books.data);
  }
};
