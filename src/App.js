import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/loginPage/loginPage';
import HomePage from './components/homepage/homePage';
import Profile from './components/profile/profile';
// import PrivateRoute from './components/auth/privateRoute';
import SearchPage from './components/searchPage/searchPage';
import ConnectionsPage from './components/connectionsPage/connectionsPage';
import ConnectionsView from './components/connectionsPage/connectionsView/connectionsView';
import ConnectionRequestsView from './components/connectionsPage/connectionsView/connectionsRequestView';
import DocumentEditor from './components/documentEditor/documentEditor';
import Settings from './components/setttings/settings';
import PasswordReset from './components/passwordReset/passwordReset';
import './App.css';


// App component
function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/search/:query" element={<SearchPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/document/:documentId" element={<DocumentEditor />} />
        <Route path="/:username" element={<Profile />} />
        <Route path="/connections" element={<ConnectionsPage children={<ConnectionsView />} />} />
        <Route path="/connections/requests" element={<ConnectionsPage children={<ConnectionRequestsView />} />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/settings" element={<Settings/>} />
        <Route path="/password-reset" element={<PasswordReset/>} />
      </Routes>
    </Router>
  );
}

export default App;
