import React, { createContext, useState, useEffect } from "react";
import { auth, db } from "./firebase.js";

export const UserContext = createContext(null);


function UserProvider(props){
  const [user, setUser] = useState(null)

  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged(async userAuth => {
      console.log(userAuth)
      if (userAuth) {

        const unsubscribe = db.ref(`pronogroupid1/users/${userAuth.uid}`).on("value", snapshot => {
          setUser({
            key: userAuth.uid,
            email: userAuth.email,
            displayName: snapshot.val().displayName,
            profilePicture:  snapshot.val().profilePicture,
            paid: snapshot.val().paid,
            active: true,
            points: snapshot.val().points,
            permissions: {
              admin: snapshot.val().permission >=9
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