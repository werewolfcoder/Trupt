import React from "react";
import { Route, Routes } from "react-router-dom";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignUp";
import OrgLogin from "./pages/OrgLogin";
import OrgSignup from "./pages/OrgSignUp";
import Home from "./pages/Home";
import Userlogout from "./pages/UserLogout";
import Orglogout from "./pages/OrgLogout";
import UserProtectedWrapper from "./pages/UserProtectedWrapper";
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<UserProtectedWrapper><Home /></UserProtectedWrapper>} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/org-login" element={<OrgLogin />} />
        <Route path="/logout" element={<Userlogout/>} />
        <Route path="/org-logout" element={<Orglogout/>} />
        <Route path="/org-signup" element={<OrgSignup />} />
        </Routes>
    </div>
  );
};

export default App;