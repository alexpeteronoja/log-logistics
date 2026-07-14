import Cookies from "js-cookie";

const withAuth = () => {
  const token = Cookies.get("userAccessToken");
  const userRole = Cookies.get("userRole");

  return {
    isAuthenticated: !!token,
    userRole: userRole || null,
  };
};

export default withAuth;
