import React from "react";
import { Link } from "react-router-dom";
import LoginComponent from "../components/auth/SignIn";

const Login = () => {
  return (
    <>
      <LoginComponent />
      <div className="text-right">
        <Link
          to="/forgot-password"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Forgot Password?
        </Link>
      </div>
    </>
  );
};

export default Login;
