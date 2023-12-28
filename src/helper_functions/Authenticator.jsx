export const Authenticate = (role) => {
  const userData = JSON.parse(localStorage.getItem("user"));

  if (userData) {
    if (userData.Role == role) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};
