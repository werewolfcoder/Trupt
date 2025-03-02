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
import EditProfile from "./pages/EditProfile"
import OrgContext from './context/OrgContext';
import UserContext from './context/UserContext';
import UserProtectedWrapper from "./pages/UserProtectedWrapper"
import OrgProtectedWrapper from "./pages/OrgProtectedWrapper"
import UserLogOut from "./pages/UserLogout"
import LiveTracking from "./components/LiveTracking";
import Tracking from "./pages/Tracking"
import TrackingPage from './pages/TrackingPage';
import DonationProvider from './context/DonationContext';

const App = () => {
  return (
    <OrgContext>
      <UserContext>
        <DonationProvider>
          <Routes>
            <Route path="/" element={<UserProtectedWrapper><Home></Home></UserProtectedWrapper>} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/signup" element={<UserSignup />} />
            <Route path="/logout" element={<UserProtectedWrapper><UserLogOut></UserLogOut></UserProtectedWrapper>} />
            <Route path="/org-login" element={<OrgLogin />} />
            <Route path="/org-signup" element={<OrgSignup />} />
            <Route path="/tracking" element={<Tracking/>}/>
            <Route path="/community" element={<UserProtectedWrapper><CommunityPage></CommunityPage></UserProtectedWrapper>} />
            <Route path="/notifications" element={<UserProtectedWrapper><NotificationsPage></NotificationsPage></UserProtectedWrapper>} />
            <Route path="/add" element={<UserProtectedWrapper><AddItemPage></AddItemPage></UserProtectedWrapper>} />
            <Route path="/profile" element={<UserProtectedWrapper><ProfilePage></ProfilePage></UserProtectedWrapper>} />
            <Route path="/edit-profile" element={<UserProtectedWrapper><EditProfile></EditProfile></UserProtectedWrapper>} />
            <Route 
              path="/tracking/:donationId" 
              element={
                  <UserProtectedWrapper>
                      <TrackingPage />
                  </UserProtectedWrapper>
              } 
            />
          </Routes>
        </DonationProvider>
      </UserContext>
    </OrgContext>
  );
};

export default App;