import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import './UserDashboard.css';
import UserFiles from '../user-files/UserFiles';
const UserDashboard: React.FC = () => {
  const { u_id } = useParams<{ u_id: string }>();
 const {selectedUser} = useAppContext();
 console.log(selectedUser);
  return (
    <div className='user-dashboard-wrapper'>
      <h1>User Dashboard</h1>
      <p>Hi {selectedUser}</p>
      <UserFiles/>
    </div>
  );
};

export default UserDashboard;