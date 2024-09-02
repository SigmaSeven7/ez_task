import { useState } from 'react';
import './App.css';
import { Button } from '@mui/material';
import SelectUserModal from './components/SelectUser';
import { useAppContext } from './contexts/AppContext';


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
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src="/react.svg" className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Select User
        </Button>
        {selectedUser && <p>Selected User: {selectedUser}</p>}
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <SelectUserModal
        open={isModalOpen}
        onClose={handleCloseModal}
        users={users}
      />
    </>
  );
}

export default App;