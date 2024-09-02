// import { useState } from 'react';
// import './App.css';
// import { Button } from '@mui/material';
// import SelectUserModal from './components/SelectUser';
// import { useAppContext } from './contexts/AppContext';


// function App() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const { selectedUser, users } = useAppContext();

//   const handleOpenModal = () => {
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   return (
//     <>
//       <div>
//       </div>
//       <div className="card">
//         <Button variant="contained" color="primary" onClick={handleOpenModal}>
//           Select User
//         </Button>
//         {selectedUser && <p>Selected User: {selectedUser}</p>}
//       </div>
//       <SelectUserModal
//         open={isModalOpen}
//         onClose={handleCloseModal}
//         users={users}
//       />
//     </>
//   );
// }

// export default App;

import { useState } from 'react';
import './App.css';
import { Button } from '@mui/material';
import SelectUserModal from './components/SelectUser';
import { useAppContext } from './contexts/AppContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserDashboard from './components/user-dashboard/UserDashboard';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedUser, users } = useAppContext();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <div>
            </div>
            <div className="card">
              <Button variant="contained" color="primary" onClick={handleOpenModal}>
                Select User
              </Button>
              {selectedUser && <p>Selected User: {selectedUser}</p>}
            </div>
            <SelectUserModal
              open={isModalOpen}
              onClose={handleCloseModal}
              users={users}
            />
          </>
        } />
        <Route path="manage-files/:u_id/dashboard" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;