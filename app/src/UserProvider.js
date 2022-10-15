import React, { createContext, useState, useEffect, useContext } from "react";
import { auth } from "./firebase.js";

import APIContext from './APIProvider.js';


export const createUserWithEmailAndPassword = (email, password, onSuccess, onError) => {
  auth.createUserWithEmailAndPassword(email, password).then(onSuccess).catch(onError);
};

export const signInWithEmailAndPassword = (email, password, onSuccess, onError) => {
  auth.signInWithEmailAndPassword(email, password).then(onSuccess).catch(onError);
}

export const sendPasswordResetEmail = (email, onSuccess, onError) => {
  const actionCodeSettings = {
    url: 'https://project-3359822390427923494.firebaseapp.com/',
  }
  auth.sendPasswordResetEmail(email, actionCodeSettings).then(onSuccess).catch(onError);
}

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