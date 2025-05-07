import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landing";
import Feature from "./components/feature";
import Contact from "./components/contact";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import DashBoard from "./pages/dashboard";
import Budget from "./pages/budget";
import Addexpense from "./pages/addexpense";
import Report from "./pages/report";
import Notification from "./pages/notification";
import SignupComplete from "./pages/signup_complete";
import SendOTP from "./pages/sendotp";
import ResetPassword from "./pages/resetpassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/feature" element={<Feature />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup_complete" element={<SignupComplete />} />
        <Route path="/send-otp" element={<SendOTP/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />
        <Route path="/dashboard" element={<DashBoard />}/>
        <Route path="/budget" element={<Budget />} />
        <Route path="/addexpense" element={<Addexpense/>}/>
        <Route path="/report" element={<Report/>}/>
        <Route path="/notification" element={<Notification/>}/>
      </Routes>
    </Router>
  );
}

export default App;
