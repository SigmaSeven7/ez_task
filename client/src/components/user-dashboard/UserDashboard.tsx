import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import './UserDashboard.css';
import UserFiles from '../user-files/UserFiles';
const UserDashboard: React.FC = () => {
 const {selectedUser} = useAppContext();
  return (
    <div className='user-dashboard-wrapper'>
      <h1>User Dashboard</h1>
      <p>Hi {selectedUser}</p>
      <UserFiles/>
    </div>
  );
};

export default UserDashboard;