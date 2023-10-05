import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './features/login/LoginPage';
import MainPage from './features/main/MainPage';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ChatContent from './features/chat/list/ChatContent';
import SettingsPage from './features/settings/SettingsPage';
import SocialPage from './features/social/SocialPage';
import FeedPage from './features/feed/FeedPage';
import AlarmPage from './features/alarm/AlarmPage';

const App = () => {
  return (
    <>
      <GoogleOAuthProvider
        clientId={
          process.env.OAUTH_GOOGLE_CLIENT_ID ||
          '984239734284-247u46nsg99v73c843agb1jipdlv2qm2.apps.googleusercontent.com'
        }
      >
        <Routes>
          <Route path="/" element={<MainPage />}>
            <Route path="/social" element={<SocialPage />}></Route>
            <Route path="/feed" element={<FeedPage />}>
              <Route path=":id" element={<></>} />
            </Route>
            <Route path="/chat" element={<ChatContent />}></Route>
            <Route path="/alarm" element={<AlarmPage />}></Route>
            <Route path="/settings" element={<SettingsPage />}></Route>
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/:signup" element={<LoginPage />} />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </GoogleOAuthProvider>
    </>
  );
};

export default App;
