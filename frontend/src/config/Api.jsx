import { SERVER_CODE, HOST_ADDRESS, CUSTOM_SERVER_CODE } from "../config/Enum";

const makeRequest = async (url, method, body, token, isAuthorized) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (isAuthorized) {
    headers["Authorization"] = "Bearer " + token;
  }

  let requestOptions = {
    method,
    headers,
  };

  if (method !== "GET" && method !== "HEAD") {
    requestOptions.body = JSON.stringify(body);
  }

  const response = await fetch(`${HOST_ADDRESS}${url}`,
    requestOptions
  );

  if (response.status !== SERVER_CODE.OK) {
    const error = await response.headers.get("response-header");
    if (isAuthorized && response.status === SERVER_CODE.UNAUTHORIZED) {
      if (error === "116") {
        localStorage.removeItem("user");
        location.reload();
      } else {
        console.log("Nie masz dostępu do tego zasobu")
      }
    }
    let result = [null, error, CUSTOM_SERVER_CODE[error]];
    return result;
  }
  let result = [response, response.status, null];
  return result;
};

export const fetchData = async (url, method, body, token, isAuthorized = true) => {
  return makeRequest(url, method, body, token, isAuthorized);
};

