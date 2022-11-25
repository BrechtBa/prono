import React, { createContext } from "react";

export const UserContext = createContext(null);


function UserProvider(props){
  const api = props.api;
  const user = api.useAuthUser(null)

  return (
    <UserContext.Provider value={user}>
      {props.children}
    </UserContext.Provider>
  );
}

export default UserProvider;