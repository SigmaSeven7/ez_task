
import { useState } from 'react';
import './App.css';
import { useAppContext } from './contexts/AppContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserDashboard from './components/user-dashboard/UserDashboard';
import UserSelection from './components/user-selection/UserSelection';

function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={
        <UserSelection/>
        } />
        <Route path="manage-files/:u_id/dashboard" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;