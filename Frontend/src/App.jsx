import React from "react";
import { Route, Routes } from "react-router-dom";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignUp";
import OrgLogin from "./pages/OrgLogin";
import OrgSignup from "./pages/OrgSignUp";
import Home from "./pages/Home";
import CommunityPage from "./pages/CommunityPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import AddItemPage from "./pages/AddItemPage";

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
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/add" element={<AddItemPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </UserContext>
    </OrgContext>
  );
};

export default App;