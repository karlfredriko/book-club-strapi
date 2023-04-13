export let noAuthFetch = async (url) => {
  let response = await axios.get(`http://localhost:1337${url}`);
  console.log("Response", response);
  return response.data;
};

export let apiLogin = async (url, username, password) => {
  let response = await axios.post(`http://localhost:1337${url}`, {
    identifier: username,
    password: password,
  });
  console.log(response);
  sessionStorage.setItem("token", response.data.jwt);
  sessionStorage.setItem("user", response.data.user.username);
};
