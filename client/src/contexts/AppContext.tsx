// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { getUsers } from '../api/api';

// // Define the shape of the context state
// interface AppState {
//   count: number;
//   setCount: React.Dispatch<React.SetStateAction<number>>;
//   selectedUser: number | string;
//   setSelectedUser: React.Dispatch<React.SetStateAction<number | string>>;
//   users: { u_id: number; u_name: string }[];
//   setUsers: React.Dispatch<React.SetStateAction<{ u_id: number; u_name: string }[]>>;
// }

// // Create the context with a default value
// const AppContext = createContext<AppState | undefined>(undefined);

// // Create a provider component
// export const AppProvider = ({ children }: { children: ReactNode }) => {
//   const [count, setCount] = useState(0);
//   const [selectedUser, setSelectedUser] = useState<number | string>('');
//   const [users, setUsers] = useState<{ u_id: number; u_name: string }[]>([]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const usersData = await getUsers();
//         setUsers(usersData);
//       } catch (error) {
//         console.error('Failed to fetch users:', error);
//       }
//     };

//     fetchUsers();
//   }, []);

//   return (
//     <AppContext.Provider value={{ count, setCount, selectedUser, setSelectedUser, users, setUsers }}>
//       {children}
//     </AppContext.Provider>
//   );
// };

// // Create a custom hook to use the AppContext
// export const useAppContext = () => {
//   const context = useContext(AppContext);
//   if (context === undefined) {
//     throw new Error('useAppContext must be used within an AppProvider');
//   }
//   return context;
// };


import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUsers } from '../api/api';

// Define the shape of the context state
interface AppState {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  selectedUser: number | string;
  setSelectedUser: (user: number | string) => void;
  users: { u_id: number; u_name: string }[];
  setUsers: React.Dispatch<React.SetStateAction<{ u_id: number; u_name: string }[]>>;
}

// Create the context with a default value
const AppContext = createContext<AppState | undefined>(undefined);

// Create a provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [count, setCount] = useState(0);
  const [selectedUser, setSelectedUserState] = useState<number | string>(() => {
    const storedUser = sessionStorage.getItem('selectedUser');
    return storedUser !== null ? JSON.parse(storedUser) : '';
  });
  const [users, setUsers] = useState<{ u_id: number; u_name: string }[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        console.log('usersData:', usersData);
        setUsers(usersData || []);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Update sessionStorage whenever selectedUser changes
  useEffect(() => {
    sessionStorage.setItem('selectedUser', JSON.stringify(selectedUser));
  }, [selectedUser]);

  // A setter function that also updates sessionStorage
  const setSelectedUser = (user: number | string) => {
    setSelectedUserState(user);
    sessionStorage.setItem('selectedUser', JSON.stringify(user));
  };

  return (
    <AppContext.Provider value={{ count, setCount, selectedUser, setSelectedUser, users, setUsers }}>
      {children}
    </AppContext.Provider>
  );
};

// Create a custom hook to use the AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
