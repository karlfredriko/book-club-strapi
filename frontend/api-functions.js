const BASE_API = "http://localhost:1337";

// SORTING
//http://localhost:1337/api/books?sort=author
//http://localhost:1337/api/books?sort=title

export let noAuthGet = async (url) => {
  let response = await axios.get(`${BASE_API}${url}`);
  return response.data;
};

export let authGet = async (url) => {
  let response = await axios.get(`${BASE_API}${url}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export let authPost = async (url, data) => {
  let response = await axios.post(
    `${BASE_API}${url}`,
    {
      data: data,
    },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  console.log(response);
};

export let authPut = async (url, data) => {
  let response = await axios.put(
    `${BASE_API}${url}`,
    {
      data: data,
    },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  console.log(response);
  // return response.data;
};

export let apiLogin = async (url, username, password) => {
  let response = await axios.post(`${BASE_API}${url}`, {
    identifier: username,
    password: password,
  });
  console.log(response);
  sessionStorage.setItem("token", response.data.jwt);
  sessionStorage.setItem("user", response.data.user.username);
  sessionStorage.setItem("userId", response.data.user.id);
};

export let createUser = async (url, username, password, email) => {
  let response = await axios.post(`${BASE_API}${url}`, {
    username: username,
    email: email,
    password: password,
  });
  console.log(response);
  sessionStorage.setItem("token", response.data.jwt);
  sessionStorage.setItem("user", response.data.user.username);
  sessionStorage.setItem("userId", response.data.user.id);
};
