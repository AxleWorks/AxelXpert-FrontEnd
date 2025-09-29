import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Layout/Header";

import Home from "./pages/Home";
import Signup from "./components/auth/Signup";
import SignIn from "./components/auth/SignIn";
import ForgetPassword from "./pages/ForgetPassword";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth routes without Header */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forget-password" element={<ForgetPassword />} />

        {/* All other routes with Header */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
