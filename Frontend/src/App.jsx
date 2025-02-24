import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignUp";
import OrgLogin from "./pages/OrgLogin";
import OrgSignup from "./pages/OrgSignUp";
import Home from "./pages/Home";
import OrgContext from './context/OrgContext';
import UserContext from './context/UserContext';

const App = () => {
  return (
    <OrgContext>
      <UserContext>
        
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/signup" element={<UserSignup />} />
            <Route path="/org-login" element={<OrgLogin />} />
            <Route path="/org-signup" element={<OrgSignup />} />
          </Routes>
             </UserContext>
    </OrgContext>
  );
};

export default App;