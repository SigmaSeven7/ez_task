// import React from 'react';
// import { Modal, Box, Typography, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
// import { SelectChangeEvent } from '@mui/material';
// import { useAppContext } from '../contexts/AppContext';


// interface SelectUserModalProps {
//   open: boolean;
//   onClose: () => void;
//   users: { u_id: number; u_name: string }[];
// }

// const SelectUserModal: React.FC<SelectUserModalProps> = ({ open, onClose }) => {
//   const { selectedUser, setSelectedUser, users } = useAppContext();
 

//   const handleSelectChange = (event: SelectChangeEvent<string | number>) => {
//     console.log(event.target.value);
//     setSelectedUser(event.target.value as number);
//   };

//   const handleSelectUser = () => {
//     onClose();
//   };

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
//         <Typography variant="h6" component="h2">
//           Select User
//         </Typography>
//         <FormControl fullWidth sx={{ mt: 2 }}>
//           <InputLabel id="select-user-label">User</InputLabel>
//           <Select
//             labelId="select-user-label"
//             value={selectedUser}
//             onChange={handleSelectChange}
//             label="User"
//           >
//             {users.map((user) => (
//               <MenuItem key={user.u_id} value={user.u_name}>
//                 {user.u_name}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//         <Button variant="contained" color="primary" onClick={handleSelectUser} sx={{ mt: 2 }}>
//           Select
//         </Button>
//       </Box>
//     </Modal>
//   );
// };

// export default SelectUserModal;

import React from 'react';
import { Modal, Box, Typography, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import { useAppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

interface SelectUserModalProps {
  open: boolean;
  onClose: () => void;
  users: { u_id: number; u_name: string }[];
}

const SelectUserModal: React.FC<SelectUserModalProps> = ({ open, onClose }) => {
  const { selectedUser, setSelectedUser, users } = useAppContext();
  const [userId, setUserId] = React.useState<number | string>('');
  const navigate = useNavigate();

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;
    const [id, name] = selectedValue.split('-');
    
    setUserId(parseInt(id));
    setSelectedUser(name);
  };

  const handleSelectUser = () => {
    if (userId && selectedUser) {
      navigate(`/manage-files/${userId}/dashboard`);
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <Typography variant="h6" component="h2">
          Select User
        </Typography>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="select-user-label">User</InputLabel>
          <Select
            labelId="select-user-label"
            value={`${userId}-${selectedUser}` || ''}
            onChange={handleSelectChange}
            label="User"
          >
            {users.map((user) => (
              <MenuItem key={user.u_id} value={`${user.u_id}-${user.u_name}`}>
                {user.u_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleSelectUser} sx={{ mt: 2 }}>
          Select
        </Button>
      </Box>
    </Modal>
  );
};

export default SelectUserModal;
