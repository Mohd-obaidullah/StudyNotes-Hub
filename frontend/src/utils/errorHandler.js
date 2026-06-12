export function getErrorMessage(error) {

  // Request timeout
  if (error.code === "ECONNABORTED") {
    return "Server is taking too long. Please try again.";
  }


  // Network error
  if (!error.response) {
    return "Unable to connect to the server. Check your internet connection.";
  }


  // Backend custom message
  const serverMessage =
    error.response.data?.error ||
    error.response.data?.message;


  if (serverMessage) {
    return serverMessage;
  }


  switch (error.response.status) {

    case 400:
      return "Invalid request.";

    case 401:
      return "Your session has expired. Please login again.";

    case 403:
      return "You are not authorized to perform this action.";

    case 404:
      return "Requested data was not found.";

    case 429:
      return "Too many requests. Please try again later.";

    case 500:
      return "Server error. Please try again later.";

    default:
      return "Something went wrong. Please try again.";
  }
}