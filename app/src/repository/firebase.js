import { useState, useEffect } from 'react';

import { initializeApp } from "firebase/app";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue, set, get, push} from "firebase/database";
import { getStorage, ref as storageRef, uploadString} from "firebase/storage";


const makeDisplayName = (email) => {
  return email.split('@')[0][0].toUpperCase() + email.split('@')[0].replace('_', ' ').replace('.', ' ').slice(1)
}

const get_iso_icon = (iso_code) => {
  return `images/flags/${iso_code}.png`
}


function firebaseApi(auth, db, storage, tenant) {

  return {

    /*************************************************************************/
    /* User login logout register                                            */
    /*************************************************************************/

    createUserWithEmailAndPassword: (email, password, onSuccess, onError) => {
      createUserWithEmailAndPassword(auth, email, password).then(onSuccess).catch(onError);
    },

    signInWithEmailAndPassword: (email, password, onSuccess, onError) => {
      signInWithEmailAndPassword(auth, email, password).then(onSuccess).catch(onError);
    },

    sendPasswordResetEmail: (email, onSuccess, onError) => {
      const actionCodeSettings = {
        url: 'https://project-3359822390427923494.firebaseapp.com/',
      }
      sendPasswordResetEmail(auth, email, actionCodeSettings).then(onSuccess).catch(onError);
    },

    useAuthUser: (initialUser) => {
      const [user, setUser] = useState(initialUser);

      useEffect(() => {
        onAuthStateChanged(auth, (userAuth) => {
          if (userAuth) {

            // get the userProfile
            onValue(ref(db, `${tenant}/users/${userAuth.uid}`), (snapshot) => {
              let userprofile = snapshot.val() || {}

              if(userprofile.displayName === undefined){
                userprofile.displayName = makeDisplayName(userAuth.email);
                set(ref(db, `${tenant}/users/${userAuth.uid}/displayName`), userprofile.displayName);
              }
              if(userprofile.profilePicture === undefined){
                userprofile.profilePicture = null;
              }
              if(userprofile.permissions === undefined){
                userprofile.permissions = {};
              }
              if(userprofile.squads === undefined){
                userprofile.squads = {};
              }

              // get(ref(db, `${tenant}/activeProno`)).then((snapshot) => {
              //   if (snapshot !== undefined){

              //     const prono = snapshot.val();
              //     get(ref(db, `${tenant}/pronoData/${prono}/userpoints/${userAuth.uid}`)).then((snapshot) => {
              //       let userpoints = snapshot.val()

              //       if(userpoints === null){
              //         userpoints = {
              //           active: true,
              //           paid: false,
              //           showPoints: true,
              //           points: {}
              //         }
              //         set(ref(db, `${tenant}/pronoData/${prono}/userpoints/${userAuth.uid}`), userpoints)
              //       }
              //       setUser({
              //         key: userAuth.uid,
              //         email: userAuth.email,
              //         displayName: userprofile.displayName || makeDisplayName(userAuth.email),
              //         profilePicture: userprofile.profilePicture || '',
              //         permissions: userprofile.permissions || {},
              //         active: (userpoints.active === undefined) ? true: userpoints.active,
              //         paid: (userpoints.paid === undefined) ? false: userpoints.paid,
              //         showPoints: (userpoints.showPoints === undefined) ? true: userpoints.showPoints,
              //       })
              //     });

              //   }
              //   else {
              //     setUser({
              //       key: userAuth.uid,
              //       email: userAuth.email,
              //       displayName: userprofile.displayName || makeDisplayName(userAuth.email),
              //       profilePicture: userprofile.profilePicture || '',
              //       permissions: userprofile.permissions || {},
              //       active: true,
              //       paid: false,
              //       showPoints: true,
              //       editOverride: false,
              //     })
              //   }
              // });
              setUser({
                key: userAuth.uid,
                email: userAuth.email,
                displayName: userprofile.displayName,
                profilePicture: userprofile.profilePicture,
                permissions: userprofile.permissions,
                squads: userprofile.squads,
                active: true,
                paid: false,
                showPoints: true,
                editOverride: false,
              })
            });
          }
          else {
            setUser(null);
            return () => {}
          }
        });
      }, []);
      return user;
    },

    signOut: (callback) => {
      signOut(auth).then(callback);
    },

    updateDisplayName: (user, displayName) => {
      return set(ref(db, `${tenant}/users/${user.key}/displayName`), displayName)
    },

    updateProfilePicture: (user, image) => {
      var ref = storageRef(storage, `users/${user.key}/profilePicture`);
      uploadString(ref, image, 'data_url').then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          set(ref(db, `${tenant}/users/${user.key}/profilePicture`), downloadURL)
        });
      })
    },
    
    /*************************************************************************/
    /* Active Prono                                                          */
    /*************************************************************************/

    useActiveProno: (initialActiveProno) => {
        const [activeProno, setActiveProno] = useState(initialActiveProno);

        useEffect(() => {
          onValue(ref(db, `${tenant}/activeProno`), (snapshot) => {
            if (snapshot !== undefined){
              setActiveProno(snapshot.val());
            }
          });
        }, []);

        return activeProno;
    },

    updateActiveProno: (value) => {
      return ref(db, `${tenant}/activeProno`).set(value)
    },

    usePronos: () => {
        const [pronos, setPronos] = useState([]);
        useEffect(() => {
          return ref(db, `${tenant}/pronos`).on("value", snapshot => {
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
    },

    updateProno: (prono, update) => {
      var updates = {};
      for (const [path, value] of Object.entries(update)) {
        updates[`${tenant}/pronos/${prono.key}/${path}`] = value
      }
      return ref().update(updates)
    },

    deleteProno: (prono) => {
      ref(db, `${tenant}/pronoData/${prono.key}`).set(null);
      ref(db, `${tenant}/pronos/${prono.key}`).set(null);
    },

    duplicateProno: (prono) => {
      get(ref(db, `${tenant}/pronoData/${prono.key}`)).then( (snapshot) => {
        if (snapshot !== undefined){
          const pronodata = snapshot.val();
          const newProno = {
            competition: pronodata.competition,
            deadlines: pronodata.deadlines,
            rules: pronodata.rules,
            userPoints: {},
            userPronos: {}
          }
          const newName = `${prono.name} copy`;
          const newRef = push(ref(db, `${tenant}/pronoData`), newProno);
          set(ref(db, `${tenant}/pronos/${newRef.key}/name`), newName);
        }
      });
    },

    /*************************************************************************/
    /* Squads                                                                */
    /*************************************************************************/

    useSquadName: (squad) => {
      const [squadName, setSquadName] = useState(null);
      useEffect(() => {
        onValue(ref(db, `${tenant}/squads/${squad}/name`), (snapshot) => {
          if (snapshot !== undefined) {
            setSquadName(snapshot.val())
          }
        });
      }, [squad])
      return squadName;
    },

    useSquadUsers: (prono, squad) => {
      const [squadUsers, setSquadUsers] = useState([]);

      useEffect(() => {
        onValue(ref(db, `${tenant}/pronoData/${prono}/userPoints`), (pointsSnapshot) => {
          if (pointsSnapshot !== undefined) {

            onValue(ref(db, `${tenant}/users`), (profileSnapshot) => {
              const userProfiles = profileSnapshot.val()

              if(profileSnapshot !== undefined) {
                let users = [];
                pointsSnapshot.forEach((snap) => {
                  const userSquads = userProfiles[snap.key].squads || {};

                  if (Object.keys(userSquads).find(k => userSquads[k] && k === squad)) {
                    users.push({
                      key: snap.key,
                      showPoints: snap.val().showPoints === undefined ? true : snap.val().showPoints,
                      points: snap.val(),
                      displayName: userProfiles[snap.key] === undefined ? '' : userProfiles[snap.key].displayName,
                      permissions: userProfiles[snap.key] === undefined ? {} : userProfiles[snap.key].permissions,
                      profilePicture: userProfiles[snap.key] === undefined ? undefined : userProfiles[snap.key].profilePicture
                    });
                  }
                });
                setSquadUsers(users)
              }
            });
  
          }
        });
      }, [prono, squad]);

      return squadUsers;
    },


    useUsers: (prono) => {
      const [users, setUsers] = useState([]);
      useEffect(() => {
        onValue(ref(db, `${tenant}/pronoData/${prono}/userPoints`), (snapshot) => {
          onValue(ref(db, `${tenant}/users`), (profileSnapshot) => {

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
                    points: val,
                    displayName: userProfiles[snap.key] === undefined ? '' : userProfiles[snap.key].displayName,
                    permissions: userProfiles[snap.key] === undefined ? {} : userProfiles[snap.key].permissions,
                    profilePicture: userProfiles[snap.key] === undefined ? undefined : userProfiles[snap.key].profilePicture
                  });
                });
              }
            }
            setUsers(users);
          });
        });
      }, [prono]);
      return users;
    },


    useCurrentStage: (prono, initialCurrentStage) => {
      const [currentStage, setCurrentStage] = useState(initialCurrentStage);
      useEffect(() => {
        ref(db, `${tenant}/pronoData/${prono}/competition/currentstage`).on("value", snapshot => {
          if(snapshot !== undefined){
            setCurrentStage(snapshot.val());
          }
        })
      }, [prono])
      return currentStage;
    },

    updateCurrentStage: (prono, value) => {
      return ref(db, `${tenant}/pronoData/${prono}/competition/currentstage`).set(value);
    },

    useHomeTeamResult: (prono, initialValue) => {
      const [homeTeamResult, setHomeTeamResult] = useState(initialValue)
      useEffect(() => {
        return ref(db, `${tenant}/pronoData/${prono}/competition/hometeamresult`).on("value", snapshot => {
          let stage = '-1'
          if (snapshot !== undefined){
            stage = snapshot.val()
          }
          setHomeTeamResult(stage);
        });
      }, [prono]);
      return homeTeamResult;
    },

    updateHomeTeamResult: (prono, result) => {
      return ref(db, `${tenant}/pronoData/${prono}/competition/hometeamresult`).set(result);
    },

    useDeadlines: (prono, initialValue) => {
      const [deadlines, setDeadlines] = useState(initialValue);
      useEffect(() => {
        return ref(db, `${tenant}/pronoData/${prono}/deadlines`).on("value", snapshot => {
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
    },

    updateDeadlines: (prono, update) => {
      var updates = {};
      for (const [path, value] of Object.entries(update)) {
        updates[`${tenant}/pronoData/${prono}/deadlines/${path}`] = value
      }
      return ref().update(updates)
    },

    useRules: (prono, initialValue) => {
      const [rules, setRules] = useState(initialValue)

      useEffect(() => {
        onValue(ref(db, `${tenant}/pronoData/${prono}/rules`), (snapshot) => {
          if (snapshot !== undefined){

            const val = snapshot.val();
            console.log(val)
            const rules = {
              groupStage: val.groupStage || {},
              groupWinners: val.groupWinners || {},
              knockoutStageTeams: val.knockoutStageTeams || {},
              homeTeamTesult: val.homeTeamResult || {},
              knockoutStage: val.knockoutStage || {},
              totalGoals: val.totalGoals || {}
            };

            setRules(rules);
          }
        });
      }, [prono]);
      return rules;
    },

    useGroupStage: (prono) => {

      const [groupstage, setGroupstage] = useState([]);
      useEffect(() => {
        onValue(ref(db, `${tenant}/pronoData/${prono}/competition/groupstage`), (snapshot) => {
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
    },

    addGroup: (prono, group) => {
      ref(db, `${tenant}/pronoData/${prono}/competition/groupstage`).push(group);
    },

    deleteGroup: (prono, group) => {
      ref(db, `${tenant}/pronoData/${prono}/competition/groupStage/${group.key}`).set(null);
    },

    updateGroup: (prono, group, update) => {
      var updates = {};
      for (const [path, value] of Object.entries(update)) {
        updates[`${tenant}/pronoData/${prono}/competition/groupStage/${group.key}/${path}`] = value
      }
      return ref().update(updates)
    },

    groupAddTeam: (prono, group, teamKey) => {
      let newTeams = JSON.parse(JSON.stringify(group.teams));
      newTeams.push(teamKey)
      ref(db, `${tenant}/pronoData/${prono}/competition/groupStage/${group.key}/teams`).set(newTeams);
      ref(db, `${tenant}/pronoData/${prono}/competition/groupStage/${group.key}/points/${teamKey}`).set(0);
    },

    groupDeleteTeam: (prono, group, teamKey) => {
      let newTeams = [];
      group.teams.forEach((team) => {
        if (team !== teamKey){
          newTeams.push(team);
        }
      })
      ref(db, `${tenant}/pronoData/${prono}/competition/groupStage/${group.key}/teams`).set(newTeams);
      ref(db, `${tenant}/pronoData/${prono}/competition/groupStage/${group.key}/points/${teamKey}`).set(null);

      // cascade to user prono's?
    },

    groupAddMatch: (prono, group, matchKey) => {
      let newMatches = JSON.parse(JSON.stringify(group.matches));
      newMatches.push(matchKey)
      ref(db, `${tenant}/pronoData/${prono}/competition/groupStage/${group.key}/matches`).set(newMatches);
    },

    groupDeleteMatch: (prono, group, matchKey) => {
      let newMatches = [];
      group.matches.forEach((match) => {
        if (match !== matchKey){
          newMatches.push(match);
        }
      })
      ref(db, `${tenant}/pronoData/${prono}/competition/groupStage/${group.key}/matches`).set(newMatches);
    },

    useKnockoutStage: (prono) => {
      const [knockoutStages, setKnockoutstages] = useState([]);
      useEffect(() => {
        onValue(ref(db, `${tenant}/pronoData/${prono}/competition/knockoutStage`), (snapshot) => {
          let tempKnockoutStages = [];
          if (snapshot !== undefined){
            snapshot.forEach((snap) => {
              const val = snap.val()
              tempKnockoutStages.push({
                key: snap.key,
                stage: snap.stage,
                name: val.name,
                matches: val.matches || [],
              });
            });
          }
          setKnockoutstages(tempKnockoutStages.sort((a, b) => parseInt(b.key) - parseInt(a.key)));
        });
      }, [prono]);
      return knockoutStages;
    },

    useTeams: (prono) => {
      const [teams, setTeams] = useState({});
      useEffect(() => {
        return ref(db, `${tenant}/pronoData/${prono}/competition/teams`).on("value", snapshot => {
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
    },

    addTeam: (prono, team) => {
      ref(db, `${tenant}/pronoData/${prono}/competition/teams`).push(team);
    },

    updateTeam: (prono, team, update) => {
      var updates = {};
      for (const [path, value] of Object.entries(update)) {
        updates[`${tenant}/pronoData/${prono}/competition/teams/${team.key}/${path}`] = value
      }
      return ref().update(updates)
    },

    deleteTeam: (prono, team) => {
      ref(db, `${tenant}/pronoData/${prono}/competition/teams/${team.key}`).set(null);
    },

    useMatches: (prono) => {
      const [matches, setMatches] = useState({});
      useEffect(() => {
        return ref(db, `${tenant}/pronoData/${prono}/competition/matches`).on("value", snapshot => {
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
    },

    updateMatch: (prono, match, update) => {
      var updates = {};
      for (const [path, value] of Object.entries(update)) {
        updates[`${tenant}/pronoData/${prono}/competition/matches/${match.key}/${path}`] = value
      }
      return ref().update(updates)
    },

    addMatch: (prono, match) => {
      ref(db, `${tenant}/pronoData/${prono}/competition/matches`).push(match);
    },

    deleteMatch: (prono, match) => {
      ref(db, `${tenant}/pronoData/${prono}/competition/matches/${match.key}`).set(null);
    },

    updateGroupPoints: (prono, group, teams) => {
      let points = {}
      teams.forEach((team) => {
        points[team.key] = parseFloat(team.points);
      });
      return ref(db, `${tenant}/pronoData/${prono}/competition/groupStage/${group.key}/points`).set(points)
    },

    updateMatchProno: (prono, user, match, update) => {
      var updates = {};
      for (const [path, value] of Object.entries(update)) {
        updates[`${tenant}/pronoData/${prono}/userPronos/${user.key}/matches/${match.key}/${path}`] = value
      }
      return ref().update(updates)
    },

    updateGroupWinnersProno: (prono, user, group, groupwinners) => {
      const obj = {1: groupwinners[1].key, 2: groupwinners[2].key}
      return ref(db, `${tenant}/pronoData/${prono}/userPronos/${user.key}/groupwinners/${group.key}`).set(obj)
    },

    updateStageTeamsProno: (prono, user, stage, teams) => {
      const teamKeys = teams.map((team) => {return team.key;})
      return ref(db, `${tenant}/pronoData/${prono}/userPronos/${user.key}/knockoutStageTeams/${stage.key}`).set(teamKeys)
    },

    updateTotalGoalsProno: (prono, user, goals) => {
      return ref(db, `${tenant}/pronoData/${prono}/userPronos/${user.key}/totalgoals`).set(goals)
    },

    updateTeamResultProno: (prono, user, stage) => {
      return ref(db, `${tenant}/pronoData/${prono}/userPronos/${user.key}/hometeamresult`).set(stage)
    },

    useUserPronoMatches: (prono, user) => {
      const [value, setValue] = useState({});
      useEffect(() => {
        if (user !== undefined){
          return ref(db, `${tenant}/pronoData/${prono}/userPronos/${user.key}/matches`).on("value", snapshot => {
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
    },

    useUserPronoGroupWinners: (prono, user) => {
      const [value, setValue] = useState({});
      useEffect(() => {
        if (user !== undefined){
          return ref(db, `${tenant}/pronoData/${prono}/userPronos/${user.key}/groupwinners`).on("value", snapshot => {
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
    },

    useUserPronoStageTeams: (prono, user) => {
      const [value, setValue] = useState({});
      useEffect(() => {
        if (user !== undefined){
          return ref(db, `${tenant}/pronoData/${prono}/userPronos/${user.key}/knockoutStageTeams`).on("value", snapshot => {
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
    },

    useUserPronoTotalGoals: (prono, user) => {
      const [value, setValue] = useState(-1);
      useEffect(() => {
        if (user !== undefined){
          return ref(db, `${tenant}/pronoData/${prono}/userPronos/${user.key}/totalgoals`).on("value", snapshot => {
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
    },

    useUserPronoHomeTeamResult: (prono, user) => {

      const [value, setValue] = useState({});
      useEffect(() => {
        if (user !== undefined){
          return ref(db, `${tenant}/pronoData/${prono}/userPronos/${user.key}/hometeamresult`).on("value", snapshot => {
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
    },

    updatePaid: (prono, user, paid) => {
      return ref(db, `${tenant}/pronoData/${prono}/userpoints/${user.key}/paid`).set(paid)
    },
    updateActive: (prono, user, active) => {
      return ref(db, `${tenant}/pronoData/${prono}/userpoints/${user.key}/active`).set(active)
    },
    updateShowPoints: (prono, user, showPoints) => {
      return ref(db, `${tenant}/pronoData/${prono}/userpoints/${user.key}/showPoints`).set(showPoints)
    },
    updatePermissionEditor: (user, editor) => {
      return ref(db, `${tenant}/users/${user.key}/permissions/editor`).set(editor)
    },
    updatePermissionEditDisabledProno: (user, val) => {
      return ref(db, `${tenant}/users/${user.key}/permissions/editDisabledProno`).set(val)
    },

    addStage: (prono, stage) => {
      ref(db, `${tenant}/pronoData/${prono}/competition/knockoutStage/`).push(stage);
    },

    deleteStage: (prono, stage) => {
      ref(db, `${tenant}/pronoData/${prono}/competition/knockoutStage/${stage.key}`).set(null);
    },

    stageAddMatch: (prono, stage, matchKey) => {
      let newMatches = JSON.parse(JSON.stringify(stage.matches));
      newMatches.push(matchKey)
      ref(db, `${tenant}/pronoData/${prono}/competition/knockoutStage/${stage.key}/matches`).set(newMatches);
    },

    stageDeleteMatch: (prono, stage, matchKey) => {
      let newMatches = [];
      stage.matches.forEach((match) => {
        if (match !== matchKey){
          newMatches.push(match);
        }
      })
      ref(db, `${tenant}/pronoData/${prono}/competition/knockoutStage/${stage.key}/matches`).set(newMatches);
    },
  }
}


export function getApi(tenant){

  const firebaseConfig = {
    apiKey: "AIzaSyCa8aBURSPVw6ayEYpZBdlhiA0DCv1LH5A",
    authDomain: "project-3359822390427923494.firebaseapp.com",
    databaseURL: "https://project-3359822390427923494.firebaseio.com",
    projectId: "project-3359822390427923494",
    storageBucket: "project-3359822390427923494.appspot.com",
    messagingSenderId: "365760395874",
    appId: "1:365760395874:web:b534013572afab7af0ef3b"
  };

  initializeApp(firebaseConfig);

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getDatabase(app);
  const storage = getStorage(app);

  return firebaseApi(auth, db, storage, tenant)
}
