import { useState, useEffect } from 'react';
import { db, auth } from './firebase.js';


const makeDisplayName = (email) => {
  return email.split('@')[0][0].toUpperCase() + email.split('@')[0].replace('_', ' ').replace('.', ' ').slice(1)
}


function firebaseApi(db, tenant) {

  function useAuthUser(initialUser) {
    const [user, setUser] = useState(initialUser);

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(async userAuth => {
        if (userAuth) {
          const unsubscribe = db.ref(`${tenant}/users/${userAuth.uid}`).on("value", snapshot => {

            let userprofile = snapshot.val()
            if(userprofile === null){
              userprofile = {
                displayName: makeDisplayName(userAuth.email),
                profilePicture: '',
                permissions: {}
              }
              db.ref(`${tenant}/users/${userAuth.uid}`).set(userprofile)
            }

            const unsubscribe = db.ref(`${tenant}/active_prono`).on("value", snapshot => {
              if (snapshot !== undefined){
                const prono = snapshot.val();
                const unsubscribe = db.ref(`${tenant}/pronodata/${prono}/userpoints/${userAuth.uid}`).on("value", snapshot => {
                let userpoints = snapshot.val()

                if(userpoints === null){
                  userpoints = {
                    active: true,
                    paid: false,
                    showPoints: true,
                    points: {}
                  }
                  db.ref(`${tenant}/pronodata/${prono}/userpoints/${userAuth.uid}`).set(userpoints)
                }
                setUser({
                  key: userAuth.uid,
                  email: userAuth.email,
                  displayName: userprofile.displayName || makeDisplayName(userAuth.email),
                  profilePicture: userprofile.profilePicture || '',
                  permissions: userprofile.permissions || {},
                  active: (userpoints.active === undefined) ? true: userpoints.active,
                  paid: (userpoints.paid === undefined) ? false: userpoints.paid,
                  showPoints: (userpoints.showPoints === undefined) ? true: userpoints.showPoints,
                })
              })
              return () => { unsubscribe() }
              }
              else {
                setUser({
                  key: userAuth.uid,
                  email: userAuth.email,
                  displayName: userprofile.displayName || makeDisplayName(userAuth.email),
                  profilePicture: userprofile.profilePicture || '',
                  permissions: userprofile.permissions || {},
                  active: true,
                  paid: false,
                  showPoints: true,
                  editOverride: false,
                })
              }
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
    return user;
  }

  function signOut(callback) {
    auth.signOut().then(callback);
  }

  function useActiveProno(initialActiveProno) {
      const [activeProno, setActiveProno] = useState(initialActiveProno);

      useEffect(() => {
        return db.ref(`${tenant}/active_prono`).on("value", snapshot => {
          if (snapshot !== undefined){
            setActiveProno(snapshot.val());
          }
        });
      });

      return activeProno;
  }

  function updateActiveProno(value) {
    return db.ref(`${tenant}/active_prono`).set(value)
  }

  function usePronos() {
      const [pronos, setPronos] = useState([]);
      useEffect(() => {
        return db.ref(`${tenant}/pronos`).on("value", snapshot => {
          if (snapshot !== undefined){
            let pronos = [];
            snapshot.forEach((snap) => {
              const val = snap.val()
              pronos.push({
                key: snap.key,
                name: val.name
              })
            });
            setPronos(pronos);
          }
        });
      }, []);
      return pronos;
  }

  function updateProno(prono, update) {
    var updates = {};
    for (const [path, value] of Object.entries(update)) {
      updates[`${tenant}/pronos/${prono.key}/${path}`] = value
    }
    return db.ref().update(updates)
  }

  function deleteProno(prono) {
    db.ref(`${tenant}/pronodata/${prono.key}`).set(null);
    db.ref(`${tenant}/pronos/${prono.key}`).set(null);
  }

  function duplicateProno(prono) {
    const unsubscribe = db.ref(`${tenant}/pronodata/${prono.key}`).on("value", snapshot => {
      if (snapshot !== undefined){
        const pronodata = snapshot.val();
        const newProno = {
          competition: pronodata.competition,
          deadlines: pronodata.deadlines,
          rules: pronodata.rules,
          settings: pronodata.settings,
          userpoints: {},
          userpronos: {}
        }
        const newName = `${prono.name} copy`;
        console.log(newProno, newName)
        const newRef = db.ref(`${tenant}/pronodata`).push(newProno);
        db.ref(`${tenant}/pronos/${newRef.key}/name`).set(newName);
      }
    });
    unsubscribe();
  }

  function useCurrentStage(prono, initialCurrentStage) {
    const [currentStage, setCurrentStage] = useState(initialCurrentStage);
    useEffect(() => {
      db.ref(`${tenant}/pronodata/${prono}/competition/currentstage`).on("value", snapshot => {
        if(snapshot !== undefined){
          setCurrentStage(snapshot.val());
        }
      })
    }, [prono])
    return currentStage;
  }

  function updateCurrentStage(prono, value) {
    return db.ref(`${tenant}/pronodata/${prono}/competition/currentstage`).set(value);
  }

  function useHomeTeamResult(prono, initialValue){
    const [homeTeamResult, setHomeTeamResult] = useState(initialValue)
    useEffect(() => {
      return db.ref(`${tenant}/pronodata/${prono}/competition/hometeamresult`).on("value", snapshot => {
        let stage = '-1'
        if (snapshot !== undefined){
          stage = snapshot.val()
        }
        setHomeTeamResult(stage);
      });
    }, [prono]);
    return homeTeamResult;
  }

  function updateHomeTeamResult(prono, result) {
    return db.ref(`${tenant}/pronodata/${prono}/competition/hometeamresult`).set(result);
  }

  function useDeadlines(prono, initialValue){
    const [deadlines, setDeadlines] = useState(initialValue);
    useEffect(() => {
      return db.ref(`${tenant}/pronodata/${prono}/deadlines`).on("value", snapshot => {
        let deadlines = {
          'groupstage': Date.now()-100000,
          '16': Date.now()-100000,
          '8': Date.now()-100000,
          '4': Date.now()-100000,
          '2': Date.now()-100000,
        }
        if (snapshot !== undefined){
          const val = snapshot.val();
          deadlines['groupstage'] = new Date(val['groupstage']);
          deadlines['16'] = new Date(val['16']);
          deadlines['8'] = new Date(val['8']);
          deadlines['4'] = new Date(val['4']);
          deadlines['2'] = new Date(val['2']);
        }
        setDeadlines(deadlines);
      });
    }, [prono]);
    return deadlines;
  }

  function updateDeadlines(prono, update) {
    var updates = {};
    for (const [path, value] of Object.entries(update)) {
      updates[`${tenant}/pronodata/${prono}/deadlines/${path}`] = value
    }
    return db.ref().update(updates)
  }

  return {
    useAuthUser: useAuthUser,
    signOut: signOut,
    useActiveProno: useActiveProno,
    updateActiveProno: updateActiveProno,
    usePronos: usePronos,
    updateProno: updateProno,
    deleteProno: deleteProno,
    duplicateProno: duplicateProno,
    useCurrentStage: useCurrentStage,
    updateCurrentStage: updateCurrentStage,
    useHomeTeamResult: useHomeTeamResult,
    updateHomeTeamResult: updateHomeTeamResult,
    useDeadlines: useDeadlines,
    updateDeadlines: updateDeadlines,
  }

}


export function getFirebaseApi(tenant){
  return firebaseApi(db, tenant)
}
