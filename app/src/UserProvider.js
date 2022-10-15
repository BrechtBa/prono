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
  const root = 'pronogroupid1'
  const prono = 'wk2022'

  const [user, setUser] = useState(null)

  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged(async userAuth => {

      if (userAuth) {
        const unsubscribe = db.ref(`${root}/users/${userAuth.uid}`).on("value", snapshot => {

          let userprofile = snapshot.val()
          if(userprofile === null){
            userprofile = {
              displayName: makeDisplayName(userAuth.email),
              profilePicture: '',
              permissions: {}
            }
            db.ref(`${root}/users/${userAuth.uid}`).set(userprofile)
          }
          const unsubscribe = db.ref(`${root}/pronodata/${prono}/userpoints/${userAuth.uid}`).on("value", snapshot => {
            let userpoints = snapshot.val()
            console.log(userpoints)
            if(userpoints === null){
              userpoints = {
                active: true,
                paid: false,
                showPoints: true,
                points: {}
              }
              db.ref(`${root}/pronodata/${prono}/userpoints/${userAuth.uid}`).set(userprofile)
            }
            setUser({
              key: userAuth.uid,
              email: userAuth.email,
              displayName: userprofile.displayName || makeDisplayName(userAuth.email),
              profilePicture: userprofile.profilePicture || '',
              permissions: userprofile.permissions || {},
              active: userpoints.active || true,
              paid: userpoints.paid || false,
              showPoints: userpoints.showPoints || true
            })
          })
          return () => { unsubscribe() }
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