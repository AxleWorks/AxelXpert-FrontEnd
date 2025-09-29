import React, { useEffect } from "react";
import LoginComponent from "../components/auth/SignIn";

const Login = () => {
  useEffect(() => {
    const root = document.getElementById("root");
    const originalStyles = {
      bodyMargin: document.body.style.margin,
      bodyPadding: document.body.style.padding,
      htmlMargin: document.documentElement.style.margin,
      htmlPadding: document.documentElement.style.padding,
      rootMargin: root?.style.margin,
      rootPadding: root?.style.padding,
    };

    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    if (root) {
      root.style.margin = "0";
      root.style.padding = "0";
    }

    return () => {
      document.body.style.margin = originalStyles.bodyMargin;
      document.body.style.padding = originalStyles.bodyPadding;
      document.documentElement.style.margin = originalStyles.htmlMargin;
      document.documentElement.style.padding = originalStyles.htmlPadding;
      if (root) {
        root.style.margin = originalStyles.rootMargin;
        root.style.padding = originalStyles.rootPadding;
      }
    };
  }, []);

  return <LoginComponent />;
};

export default Login;
