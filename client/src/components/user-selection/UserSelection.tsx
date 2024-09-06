import React from "react";
import SelectUserModal from "./SelectUserModal";
import { useAppContext } from "../../contexts/AppContext";



const UserSelection: React.FC<{}> = () => {

  const { selectedUser, users } = useAppContext();
  return (
    <div>
      <h1>Welcome to the file management system</h1>
      <div className="card">
        {selectedUser && <p>Selected User: {selectedUser}</p>}
      </div>
      <SelectUserModal open={true}  users={users} />
    </div>
  );
};

export default UserSelection;
