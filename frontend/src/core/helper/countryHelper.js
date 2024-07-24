export const getAuthToken = () => {
  return fetch("https://www.universal-tutorial.com/api/getaccesstoken", {
    method: "GET",
  }).then((response) => {
    console.log(response.json());
  });
};
