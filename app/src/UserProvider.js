import React, { createContext, useState, useEffect, useContext } from "react";

import APIContext from './APIProvider.js';


export const UserContext = createContext(null);


function UserProvider(props){
  const api = useContext(APIContext);

  const [user, setUser] = useState(null)

  useEffect(() => {
    api.onAuthStateChanged( user => setUser(user));
  }, [api]);

  return (
    <UserContext.Provider value={user}>
      {props.children}
    </UserContext.Provider>
  );
}

export default UserProvider;