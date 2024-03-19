import { useState, useEffect } from 'react';

import { initializeApp } from "firebase/app";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue, set, get, push, update} from "firebase/database";
import { getStorage, ref as storageRef, uploadString} from "firebase/storage";


const makeDisplayName = (email) => {
  return email.split('@')[0][0].toUpperCase() + email.split('@')[0].replace('_', ' ').replace('.', ' ').slice(1)
}

const get_iso_icon = (iso_code) => {
  return `images/flags/${iso_code}.png`
}


const initializeUser = (db, tenant, squad, userAuth) => {
  console.log(userAuth)
  // initialize user profile
  set(ref(db, `${tenant}/users/${userAuth.uid}/displayName`), makeDisplayName(userAuth.email));

  set(ref(db, `${tenant}/users/${userAuth.uid}/squads`), {[squad]: true});

  // initialize user prono
  get(ref(db, `${tenant}/activeProno`)).then((snapshot) => {
    if (snapshot !== undefined){

      const prono = snapshot.val();

      // points
      set(ref(db, `${tenant}/pronoData/${prono}/userPoints/${userAuth.uid}`), {
        groupStage: 0,
        groupWinners: 0,
        homeTeamResult: 0,
        knockoutStage: 0,
        knockoutStageTeams: 0,
        totalGoals: 0
      });
    }
    else {
      console.error("no active prono")
    }
  });

}

function firebaseApi(auth, db, storage, tenant) {

  return {

    /*************************************************************************/
    /* User login logout register                                            */
    /*************************************************************************/

    createUserWithEmailAndPassword: (email, password, squad, onSuccess, onError) => {
      if(squad !== undefined){
        createUserWithEmailAndPassword(auth, email, password).then((e) => {
          // setup user
          initializeUser(db, tenant, squad, e.user)

          onSuccess()
        }).catch(onError);
      }
      else {
        onError({code: 'no-squad'});
      }
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

    useActiveProno: () => {
        const [activeProno, setActiveProno] = useState(null);

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
      set(ref(db, `${tenant}/activeProno`), value)
    },

    usePronos: () => {
        const [pronos, setPronos] = useState([]);
        useEffect(() => {
          onValue(ref(db, `${tenant}/pronos`), (snapshot) => {
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

    updateProno: (prono, updateData) => {
      var updates = {};
      for (const [path, value] of Object.entries(updateData)) {
        updates[`${tenant}/pronos/${prono.key}/${path}`] = value
      }
      return update(ref(db), updates)
    },

    deleteProno: (prono) => {
      set(ref(db, `${tenant}/pronoData/${prono.key}`), null);
      set(ref(db, `${tenant}/pronos/${prono.key}`), null);
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

    /*************************************************************************/
    /* PronoData                                                             */
    /*************************************************************************/

    useCurrentStage: (prono, initialCurrentStage) => {
      const [currentStage, setCurrentStage] = useState(initialCurrentStage);
      useEffect(() => {
        onValue(ref(db, `${tenant}/pronoData/${prono}/competition/currentStage`), (snapshot) => {
          if(snapshot !== undefined){
            setCurrentStage(snapshot.val());
          }
        })
      }, [prono])
      return currentStage;
    },

    updateCurrentStage: (prono, value) => {
      return set(ref(db, `${tenant}/pronoData/${prono}/competition/currentStage`), value);
    },

    useHomeTeamResult: (prono, initialValue) => {
      const [homeTeamResult, setHomeTeamResult] = useState(initialValue)
      useEffect(() => {
        onValue(ref(db, `${tenant}/pronoData/${prono}/competition/homeTeamResult`), (snapshot) => {
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
      set(ref(db, `${tenant}/pronoData/${prono}/competition/homeTeamResult`), result);
    },

    useDeadlines: (prono, initialValue) => {
      const [deadlines, setDeadlines] = useState(initialValue);
      useEffect(() => {
        onValue(ref(db, `${tenant}/pronoData/${prono}/deadlines`), (snapshot) => {
          let deadlines = {
            'groupStage': Date.now()-100000,
            '16': Date.now()-100000,
            '8': Date.now()-100000,
            '4': Date.now()-100000,
            '2': Date.now()-100000,
          }
          const val = snapshot.val();
          if (val !== null){
            deadlines['groupStage'] = new Date(val['groupStage']);
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

    updateDeadlines: (prono, updateData) => {
      var updates = {};
      for (const [path, value] of Object.entries(updateData)) {
        updates[`${tenant}/pronoData/${prono}/deadlines/${path}`] = value
      }
      return update(ref(db), updates)
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

    /*************************************************************************/
    /* GroupStage                                                            */
    /*************************************************************************/

    useGroupStage: (prono) => {
      const [groupstage, setGroupstage] = useState([]);
      useEffect(() => {
        onValue(ref(db, `${tenant}/pronoData/${prono}/competition/groupStage`), (snapshot) => {
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
      ref(db, `${tenant}/pronoData/${prono}/competition/groupStage`).push(group);
    },

    deleteGroup: (prono, group) => {
      set(ref(db, `${tenant}/pronoData/${prono}/competition/groupStage/${group.key}`), null);
    },

    updateGroup: (prono, group, updateData) => {
      var updates = {};
      for (const [path, value] of Object.entries(updateData)) {
        updates[`${tenant}/pronoData/${prono}/competition/groupStage/${group.key}/${path}`] = value
      }
      return update(ref(db), updates)
    },

    groupAddTeam: (prono, group, teamKey) => {
      let newTeams = JSON.parse(JSON.stringify(group.teams));
      newTeams.push(teamKey)
      set(ref(db, `${tenant}/pronoData/${prono}/competition/groupStage/${group.key}/teams`), newTeams);
      set(ref(db, `${tenant}/pronoData/${prono}/competition/groupStage/${group.key}/points/${teamKey}`), 0);
    },

    groupDeleteTeam: (prono, group, teamKey) => {
      let newTeams = [];
      group.teams.forEach((team) => {
        if (team !== teamKey){
          newTeams.push(team);
        }
      })
      set(ref(db, `${tenant}/pronoData/${prono}/competition/groupStage/${group.key}/teams`), newTeams);
      set(ref(db, `${tenant}/pronoData/${prono}/competition/groupStage/${group.key}/points/${teamKey}`), null);

      // cascade to user prono's?
    },

    groupAddMatch: (prono, group, matchKey) => {
      let newMatches = JSON.parse(JSON.stringify(group.matches));
      newMatches.push(matchKey)
      set(ref(db, `${tenant}/pronoData/${prono}/competition/groupStage/${group.key}/matches`), newMatches);
    },

    groupDeleteMatch: (prono, group, matchKey) => {
      let newMatches = [];
      group.matches.forEach((match) => {
        if (match !== matchKey){
          newMatches.push(match);
        }
      })
      set(ref(db, `${tenant}/pronoData/${prono}/competition/groupStage/${group.key}/matches`), newMatches);
    },

    /*************************************************************************/
    /* KnockoutStage                                                         */
    /*************************************************************************/

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
        onValue(ref(db, `${tenant}/pronoData/${prono}/competition/teams`), (snapshot) => {
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

    updateTeam: (prono, team, updateData) => {
      var updates = {};
      for (const [path, value] of Object.entries(updateData)) {
        updates[`${tenant}/pronoData/${prono}/competition/teams/${team.key}/${path}`] = value
      }
      return update(ref(db), updates)
    },

    deleteTeam: (prono, team) => {
      set(ref(db, `${tenant}/pronoData/${prono}/competition/teams/${team.key}`), null);
    },

    useMatches: (prono) => {
      const [matches, setMatches] = useState({});
      useEffect(() => {
        onValue(ref(db, `${tenant}/pronoData/${prono}/competition/matches`), (snapshot) => {
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

    updateMatch: (prono, match, updateData) => {
      var updates = {};
      for (const [path, value] of Object.entries(updateData)) {
        updates[`${tenant}/pronoData/${prono}/competition/matches/${match.key}/${path}`] = value
      }
      return update(ref(db), updates)
    },

    addMatch: (prono, match) => {
      ref(db, `${tenant}/pronoData/${prono}/competition/matches`).push(match);
    },

    deleteMatch: (prono, match) => {
      set(ref(db, `${tenant}/pronoData/${prono}/competition/matches/${match.key}`), null);
    },

    updateGroupPoints: (prono, group, teams) => {
      let points = {}
      teams.forEach((team) => {
        points[team.key] = parseFloat(team.points);
      });
      set(ref(db, `${tenant}/pronoData/${prono}/competition/groupStage/${group.key}/points`), points)
    },

    updateMatchProno: (prono, user, match, updateData) => {
      var updates = {};
      for (const [path, value] of Object.entries(updateData)) {
        updates[`${tenant}/pronoData/${prono}/userPronos/${user.key}/matches/${match.key}/${path}`] = value
      }
      return update(ref(db), updates)
    },

    updateGroupWinnersProno: (prono, user, group, groupwinners) => {
      const obj = {1: groupwinners[1].key, 2: groupwinners[2].key}
      set(ref(db, `${tenant}/pronoData/${prono}/userPronos/${user.key}/groupWinners/${group.key}`), obj)
    },

    updateStageTeamsProno: (prono, user, stage, teams) => {
      const teamKeys = teams.map((team) => {return team.key;})
      set(ref(db, `${tenant}/pronoData/${prono}/userPronos/${user.key}/knockoutStageTeams/${stage.key}`), teamKeys)
    },

    updateTotalGoalsProno: (prono, user, goals) => {
      set(ref(db, `${tenant}/pronoData/${prono}/userPronos/${user.key}/totalGoals`), goals)
    },

    updateTeamResultProno: (prono, user, stage) => {
      set(ref(db, `${tenant}/pronoData/${prono}/userPronos/${user.key}/homeTeamResult`), stage)
    },

    useUserPronoMatches: (prono, user) => {
      const [value, setValue] = useState({});
      useEffect(() => {
        if (user !== undefined){
          onValue(ref(db, `${tenant}/pronoData/${prono}/userPronos/${user.key}/matches`), (snapshot) => {
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
          onValue(ref(db, `${tenant}/pronoData/${prono}/userPronos/${user.key}/groupWinners`), (snapshot) => {
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
          onValue(ref(db, `${tenant}/pronoData/${prono}/userPronos/${user.key}/knockoutStageTeams`), (snapshot) => {
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
          onValue(ref(db, `${tenant}/pronoData/${prono}/userPronos/${user.key}/totalGoals`), (snapshot) => {
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
          onValue(ref(db, `${tenant}/pronoData/${prono}/userPronos/${user.key}/homeTeamResult`), (snapshot) => {
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
      set(ref(db, `${tenant}/pronoData/${prono}/userpoints/${user.key}/paid`), paid)
    },
    updateActive: (prono, user, active) => {
      set(ref(db, `${tenant}/pronoData/${prono}/userpoints/${user.key}/active`), active)
    },
    updateShowPoints: (prono, user, showPoints) => {
      set(ref(db, `${tenant}/pronoData/${prono}/userpoints/${user.key}/showPoints`), showPoints)
    },
    updatePermissionEditor: (user, editor) => {
      set(ref(db, `${tenant}/users/${user.key}/permissions/editor`), editor)
    },
    updatePermissionEditDisabledProno: (user, val) => {
      set(ref(db, `${tenant}/users/${user.key}/permissions/editDisabledProno`), val)
    },

    addStage: (prono, stage) => {
      ref(db, `${tenant}/pronoData/${prono}/competition/knockoutStage`).push(stage);
    },

    deleteStage: (prono, stage) => {
      set(ref(db, `${tenant}/pronoData/${prono}/competition/knockoutStage/${stage.key}`), null);
    },

    stageAddMatch: (prono, stage, matchKey) => {
      let newMatches = JSON.parse(JSON.stringify(stage.matches));
      newMatches.push(matchKey)
      set(ref(db, `${tenant}/pronoData/${prono}/competition/knockoutStage/${stage.key}/matches`), newMatches);
    },

    stageDeleteMatch: (prono, stage, matchKey) => {
      let newMatches = [];
      stage.matches.forEach((match) => {
        if (match !== matchKey){
          newMatches.push(match);
        }
      })
      set(ref(db, `${tenant}/pronoData/${prono}/competition/knockoutStage/${stage.key}/matches`), newMatches);
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
