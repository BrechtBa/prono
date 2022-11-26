import { useState, useEffect } from 'react';

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import 'firebase/storage';


const makeDisplayName = (email) => {
  return email.split('@')[0][0].toUpperCase() + email.split('@')[0].replace('_', ' ').replace('.', ' ').slice(1)
}

const get_iso_icon = (iso_code) => {
  return `images/flags/${iso_code}.png`
}


function firebaseApi(auth, db, storage, tenant) {

  function createUserWithEmailAndPassword(email, password, onSuccess, onError) {
    auth.createUserWithEmailAndPassword(email, password).then(onSuccess).catch(onError);
  };

  function signInWithEmailAndPassword(email, password, onSuccess, onError) {
    auth.signInWithEmailAndPassword(email, password).then(onSuccess).catch(onError);
  }

  function sendPasswordResetEmail(email, onSuccess, onError) {
    const actionCodeSettings = {
      url: 'https://project-3359822390427923494.firebaseapp.com/',
    }
    auth.sendPasswordResetEmail(email, actionCodeSettings).then(onSuccess).catch(onError);
  }

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

  function useUsers(prono) {

    const [users, setUsers] = useState([]);
    useEffect(() => {
      return db.ref(`${tenant}/pronodata/${prono}/userpoints`).on("value", snapshot => {
        const closing = db.ref(`${tenant}/users`).on("value", profileSnapshot => {

          let users = [];
          let userProfiles = {};

          if (profileSnapshot !== undefined){
            profileSnapshot.forEach((snap) => {
              const val = snap.val()
              userProfiles[snap.key] = {
                displayName: val.displayName,
                permissions: val.permissions || {},
                profilePicture: val.profilePicture,
              }
            });

            if (snapshot !== undefined){
              snapshot.forEach((snap) => {
                const val = snap.val()
                users.push({
                  key: snap.key,
                  paid: val.paid,
                  showPoints: val.showPoints,
                  active: val.active === undefined ? true : val.active,
                  points: val.points,
                  displayName: userProfiles[snap.key] === undefined ? '' : userProfiles[snap.key].displayName,
                  permissions: userProfiles[snap.key] === undefined ? {} : userProfiles[snap.key].permissions,
                  profilePicture: userProfiles[snap.key] === undefined ? undefined : userProfiles[snap.key].profilePicture
                });
              });
            }
          }
          setUsers(users);
        });
        return () => { closing() };
      });
    }, [prono]);
    return users;
  }

  function useRules(prono, initialValue){
    const [rules, setRules] = useState(initialValue)

    useEffect(() => {
      return db.ref(`${tenant}/pronodata/${prono}/rules`).on("value", snapshot => {
        if (snapshot !== undefined){

          const val = snapshot.val();
          const rules = {
            groupstage: val.groupstage || {},
            groupstageWinners: val.groupstagewinners || {},
            knockoutstageTeams: val.knockoutstageteams || {},
            homeTeamTesult: val.hometeamresult || {},
            knockoutstage: val.knockoutstage || {},
            totalGoals: val.totalgoals || {},
            prizes: val.prizes || {},
            cost: val.cost,
          };

          setRules(rules);
        }
      });
    }, [prono]);
    return rules;
  }

  function useGroupStage(prono) {

    const [groupstage, setGroupstage] = useState([]);
    useEffect(() => {
      return db.ref(`${tenant}/pronodata/${prono}/competition/groupstage`).on("value", snapshot => {
        let groupstage = [];
        if (snapshot !== undefined){
          snapshot.forEach((snap) => {
            const val = snap.val()
            groupstage.push({
              key: snap.key,
              name: val.name,
              matches: val.matches || [],
              teams: val.teams || [],
              points: val.points || {}
            });
          });
        }
        groupstage.sort((a, b) => {
          if(a.name > b.name){
            return 1;
          }
          else{
            return -1;
          }
        })
        setGroupstage(groupstage);
      });
    }, [prono]);
    return groupstage;
  }

  function useKnockoutStage(prono) {
    const [knockoutstages, setKnockoutstages] = useState([]);
    useEffect(() => {
      return db.ref(`${tenant}/pronodata/${prono}/competition/knockoutstage`).on("value", snapshot => {
        let knockoutstage = [];
        if (snapshot !== undefined){
          snapshot.forEach((snap) => {
            const val = snap.val()
            knockoutstage.push({
              key: snap.key,
              stage: snap.stage,
              name: val.name,
              matches: val.matches || [],
            });
          });
        }
        setKnockoutstages(knockoutstage.sort((a, b) => parseInt(b.key) - parseInt(a.key)));
      });
    }, [prono]);
    return knockoutstages;
  }

  function useTeams(prono){
    const [teams, setTeams] = useState({});
    useEffect(() => {
      return db.ref(`${tenant}/pronodata/${prono}/competition/teams`).on("value", snapshot => {
        let teams = {};
        if (snapshot !== undefined){
          snapshot.forEach((snap) => {
            const val = snap.val()
            teams[snap.key] = {
              key: snap.key,
              name: val.name,
              abbreviation: val.abbreviation,
              iso_icon: val.iso_icon,
              icon: val.icon,
              icon_url: val.icon || get_iso_icon(val.iso_icon),
            };
          });
        }
        setTeams(teams);
      });
    }, [prono]);

    return teams;
  }

  function useMatches(prono){
    const [matches, setMatches] = useState({});
    useEffect(() => {
      return db.ref(`${tenant}/pronodata/${prono}/competition/matches`).on("value", snapshot => {
        let matches = {};
        if (snapshot !== undefined){
          snapshot.forEach((snap) => {
            const val = snap.val()
            matches[snap.key] = {
              key: snap.key,
              number: val.number,
              date: val.date,
              defaultteam1: val.defaultteam1,
              defaultteam2: val.defaultteam2,
              team1: val.team1,
              team2: val.team2,
              score1: val.score1,
              score2: val.score2,
              penalty1: val.penalty1,
              penalty2: val.penalty2,
            };
          });
        }
        setMatches(matches);
      });
    }, [prono]);

    return matches;
  }

  function updateMatch(prono, match, update) {
    var updates = {};
    for (const [path, value] of Object.entries(update)) {
      updates[`${tenant}/pronodata/${prono}/competition/matches/${match.key}/${path}`] = value
    }
    return db.ref().update(updates)
  }

  function updateGroupPoints(prono, group, teams) {
    let points = {}
    teams.forEach((team) => {
      points[team.key] = parseFloat(team.points);
    });
    return db.ref(`${tenant}/pronodata/${prono}/competition/groupstage/${group.key}/points`).set(points)
  }

  function updateMatchProno(prono, user, match, update) {
    var updates = {};
    for (const [path, value] of Object.entries(update)) {
      updates[`${tenant}/pronodata/${prono}/userpronos/${user.key}/matches/${match.key}/${path}`] = value
    }
    return db.ref().update(updates)
  }

  function updateGroupWinnersProno(prono, user, group, groupwinners) {
    const obj = {1: groupwinners[1].key, 2: groupwinners[2].key}
    return db.ref(`${tenant}/pronodata/${prono}/userpronos/${user.key}/groupwinners/${group.key}`).set(obj)
  }

  function useUserPronoMatches(prono, user){
    const [value, setValue] = useState({});
    useEffect(() => {
      if (user !== undefined){
        return db.ref(`${tenant}/pronodata/${prono}/userpronos/${user.key}/matches`).on("value", snapshot => {
          let matches = {};
          if (snapshot !== undefined){
            snapshot.forEach((snap) => {
              const val = snap.val()
              matches[snap.key] = {
                key: snap.key,
                score1: val.score1,
                score2: val.score2,
              };
            });
          }
          setValue(matches);
        });
      }
      else {
        return () => {}
      }
    }, [prono, user]);
    return value;
  }

  function useUserPronoGroupWinners(prono, user){
    const [value, setValue] = useState({});
    useEffect(() => {
      if (user !== undefined){
        return db.ref(`${tenant}/pronodata/${prono}/userpronos/${user.key}/groupwinners`).on("value", snapshot => {
          let groupWinners = {};
          if (snapshot !== undefined){
            snapshot.forEach((snap) => {
              const val = snap.val()
              groupWinners[snap.key] = {
                key: snap.key,
                1: val['1'],
                2: val['2'],
              };
            });
          }
          setValue(groupWinners);
        });
      }
      else {
        return () => {}
      }
    }, [prono, user]);
    return value;
  }

  function useUserPronoStageTeams(prono, user){
    const [value, setValue] = useState({});
    useEffect(() => {
      if (user !== undefined){
        return db.ref(`${tenant}/pronodata/${prono}/userpronos/${user.key}/knockoutstageteams`).on("value", snapshot => {
          let stageTeams = {};
          if (snapshot !== undefined){
            snapshot.forEach((snap) => {
              const val = snap.val()
              stageTeams[snap.key] = {
                key: snap.key,
                teams: val,
              };
            });
          }
          setValue(stageTeams);
        });
      }
      else {
        return () => {}
      }
    }, [prono, user]);
    return value;
  }

  function useUserPronoTotalGoals(prono, user){
    const [value, setValue] = useState(-1);
    useEffect(() => {
      if (user !== undefined){
        return db.ref(`${tenant}/pronodata/${prono}/userpronos/${user.key}/totalgoals`).on("value", snapshot => {
          let goals = -1
          if (snapshot !== undefined){
            goals = snapshot.val()
          }
          setValue(goals);
        });
      }
      else {
        return () => {}
      }
    }, [prono, user]);
    return value;
  }

  function useUserPronoHomeTeamResult(prono, user){

    const [value, setValue] = useState({});
    useEffect(() => {
      if (user !== undefined){
        return db.ref(`${tenant}/pronodata/${prono}/userpronos/${user.key}/hometeamresult`).on("value", snapshot => {
          let stage = '-1'
          if (snapshot !== undefined){
            stage = snapshot.val()
          }
          setValue(stage);
        });
      }
      else {
        return () => {}
      }
    }, [prono, user]);
    return value;
  }

  function updateDisplayName(user, displayName) {
    return db.ref(`${tenant}/users/${user.key}/displayName`).set(displayName)
  }
  function updatePaid(prono, user, paid) {
    return db.ref(`${tenant}/pronodata/${prono}/userpoints/${user.key}/paid`).set(paid)
  }
  function updateActive(prono, user, active) {
    return db.ref(`${tenant}/pronodata/${prono}/userpoints/${user.key}/active`).set(active)
  }
  function updateShowPoints(prono, user, showPoints) {
    return db.ref(`${tenant}/pronodata/${prono}/userpoints/${user.key}/showPoints`).set(showPoints)
  }
  function updatePermissionEditor(user, editor) {
    return db.ref(`${tenant}/users/${user.key}/permissions/editor`).set(editor)
  }
  function updatePermissionEditDisabledProno(user, val) {
    return db.ref(`${tenant}/users/${user.key}/permissions/editDisabledProno`).set(val)
  }

  function updateProfilePicture(user, image) {
    var ref = storage.ref(`users/${user.key}/profilePicture`);
    var uploadTask = ref.putString(image, 'data_url');
    uploadTask.on('state_changed',
      (snapshot) => {}, (error) => {}, () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          return db.ref(`${tenant}/users/${user.key}/profilePicture`).set(downloadURL)
        });
    });
  }

//  function usex(prono){
//    const [value, setValue] = useState({});
//    useEffect(() => {
//
//
//
//    }, [prono]);
//    return value;
//  }

  return {
    createUserWithEmailAndPassword: createUserWithEmailAndPassword,
    signInWithEmailAndPassword: signInWithEmailAndPassword,
    sendPasswordResetEmail: sendPasswordResetEmail,

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
    useUsers: useUsers,
    useRules: useRules,
    useGroupStage: useGroupStage,
    useKnockoutStage: useKnockoutStage,
    useTeams: useTeams,
    useMatches: useMatches,
    updateMatch: updateMatch,
    updateGroupPoints: updateGroupPoints,

    updateMatchProno: updateMatchProno,
    updateGroupWinnersProno: updateGroupWinnersProno,
    useUserPronoMatches: useUserPronoMatches,
    useUserPronoGroupWinners: useUserPronoGroupWinners,
    useUserPronoStageTeams: useUserPronoStageTeams,
    useUserPronoTotalGoals: useUserPronoTotalGoals,
    useUserPronoHomeTeamResult: useUserPronoHomeTeamResult,

    updateDisplayName: updateDisplayName,
    updateProfilePicture: updateProfilePicture,

    updatePaid: updatePaid,
    updateActive: updateActive,
    updateShowPoints: updateShowPoints,
    updatePermissionEditor: updatePermissionEditor,
    updatePermissionEditDisabledProno: updatePermissionEditDisabledProno,
  }

}


export function getFirebaseApi(tenant){

  const firebaseConfig = {
    apiKey: "AIzaSyCa8aBURSPVw6ayEYpZBdlhiA0DCv1LH5A",
    authDomain: "project-3359822390427923494.firebaseapp.com",
    databaseURL: "https://project-3359822390427923494.firebaseio.com",
    projectId: "project-3359822390427923494",
    storageBucket: "project-3359822390427923494.appspot.com",
    messagingSenderId: "365760395874",
    appId: "1:365760395874:web:b534013572afab7af0ef3b"
  };

  firebase.initializeApp(firebaseConfig);

  const auth = firebase.auth();
  const db = firebase.database();
  const storage = firebase.storage();

  return firebaseApi(auth, db, storage, tenant)
}
