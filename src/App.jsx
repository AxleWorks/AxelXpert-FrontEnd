import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "./Layout/MainLayout";
import Home from "./pages/Home";
import CalendarPage from "./pages/CalendarPage";
import Vehicles from "./pages/Vehicles";
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
          path="/*"
          element={
            <MainLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/vehicles" element={<Vehicles />} />
              </Routes>
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
