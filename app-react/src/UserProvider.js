import React, { createContext, useState, useEffect } from "react";
import { auth, db } from "./firebase.js";



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


export  const signOut = (onSuccess, onError) => {
  auth.signOut().then(onSuccess).catch(onError);
}

export const UserContext = createContext(null);

const makeDisplayName = (email) => {
  return email.split('@')[0][0].toUpperCase() + email.split('@')[0].replace('_', ' ').replace('.', ' ').slice(1)
}


function UserProvider(props){
  const [user, setUser] = useState(null)

  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged(async userAuth => {

      if (userAuth) {
        const unsubscribe = db.ref(`pronogroupid1/users/${userAuth.uid}`).on("value", snapshot => {

          let val = snapshot.val()
          if(val === null){
            val = {
              displayName: makeDisplayName(userAuth.email),
              profilePicture: '',
              paid: false,
              active: true,
              points: {}
            }
            db.ref(`pronogroupid1/users/${userAuth.uid}`).set(val)
          }

          setUser({
            key: userAuth.uid,
            email: userAuth.email,
            displayName: val.displayName || makeDisplayName(userAuth.email),
            profilePicture: val.profilePicture || '',
            paid: val.paid || false,
            active: true,
            points: val.points || {},
            permissions: {
              admin: (val.permission || 1) >=9
            }
          })
        })
        return () => { unsubscribe() }
      }
      else {
        setUser(null);
        return () => {}
      }
    });
    return () => { unsubscribe() }
  }, []);

  return (
    <UserContext.Provider value={user}>
      {props.children}
    </UserContext.Provider>
  );
}

export default UserProvider;