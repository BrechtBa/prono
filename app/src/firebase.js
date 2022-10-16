import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import 'firebase/storage';

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

export const auth = firebase.auth();
export const db = firebase.database();
export const storage = firebase.storage();


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

class FirebaseAPI {
  constructor(db) {
    this.db = db;
    this.tenant = 'pronogroupid1';
  }

  onAuthStateChanged(callback) {
    const makeDisplayName = (email) => {
      return email.split('@')[0][0].toUpperCase() + email.split('@')[0].replace('_', ' ').replace('.', ' ').slice(1)
    }

    const unsubscribe = auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        const unsubscribe = db.ref(`${this.tenant}/users/${userAuth.uid}`).on("value", snapshot => {

          let userprofile = snapshot.val()
          if(userprofile === null){
            userprofile = {
              displayName: makeDisplayName(userAuth.email),
              profilePicture: '',
              permissions: {}
            }
            db.ref(`${this.tenant}/users/${userAuth.uid}`).set(userprofile)
          }

          const unsubscribe = db.ref(`${this.tenant}/active_prono`).on("value", snapshot => {
            if (snapshot !== undefined){
              const prono = snapshot.val();
              const unsubscribe = db.ref(`${this.tenant}/pronodata/${prono}/userpoints/${userAuth.uid}`).on("value", snapshot => {
              let userpoints = snapshot.val()

              if(userpoints === null){
                userpoints = {
                  active: true,
                  paid: false,
                  showPoints: true,
                  points: {}
                }
                db.ref(`${this.tenant}/pronodata/${prono}/userpoints/${userAuth.uid}`).set(userprofile)
              }
              callback({
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
            }
            else {
              callback({
                key: userAuth.uid,
                email: userAuth.email,
                displayName: userprofile.displayName || makeDisplayName(userAuth.email),
                profilePicture: userprofile.profilePicture || '',
                permissions: userprofile.permissions || {},
                active: true,
                paid: false,
                showPoints: true
              })
            }
          })
          return () => { unsubscribe() }
        })
        return () => { unsubscribe() }
      }
      else {
        callback(null);
        return () => {}
      }
    });
    return () => { unsubscribe() }
  }

  signOut(callback) {
    auth.signOut().then(callback);
  }

  onActivePronoChanged(callback) {
    return this.db.ref(`${this.tenant}/active_prono`).on("value", snapshot => {
      if (snapshot !== undefined){
        callback(snapshot.val());
      }
    });
  }

  updateActiveProno(value) {
    return this.db.ref(`${this.tenant}/active_prono`).set(value)
  }

  duplicateProno(prono) {
    const unsubscribe = this.db.ref(`${this.tenant}/pronodata/${prono.key}`).on("value", snapshot => {
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
        const newRef = this.db.ref(`${this.tenant}/pronodata`).push(newProno);
        this.db.ref(`${this.tenant}/pronos/${newRef.key}/name`).set(newName);
      }
    });
    unsubscribe();
  }

  deleteProno(prono) {
    this.db.ref(`${this.tenant}/pronodata/${prono.key}`).set(null);
    this.db.ref(`${this.tenant}/pronos/${prono.key}`).set(null);
  }
  updateProno(prono, update) {
    var updates = {};
    for (const [path, value] of Object.entries(update)) {
      updates[`${this.tenant}/pronos/${prono.key}/${path}`] = value
    }
    return this.db.ref().update(updates)
  }
  onPronosChanged(callback) {
    return this.db.ref(`${this.tenant}/pronos`).on("value", snapshot => {
      if (snapshot !== undefined){
        let pronos = [];
        snapshot.forEach((snap) => {
          const val = snap.val()
          pronos.push({
            key: snap.key,
            name: val.name
          })
        });


        callback(pronos);
      }
    });
  }

  onRulesChanged(prono, callback) {
    return this.db.ref(`${this.tenant}/pronodata/${prono}/rules`).on("value", snapshot => {
      if (snapshot !== undefined){
        callback(snapshot.val());
      }
    });
  }

  onUsersChanged(prono, callback) {
    return this.db.ref(`${this.tenant}/pronodata/${prono}/userpoints`).on("value", snapshot => {
      const closing = this.db.ref(`${this.tenant}/users`).on("value", profileSnapshot => {

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
                profilePicture: userProfiles[snap.key] === undefined ? undefined : userProfiles[snap.key].profilePicture,
              });
            });
          }
        }
        callback(users);
      });
      return () => { closing() };
    });
  }


  onCurrentStageChanged(prono, callback) {
    return this.db.ref(`${this.tenant}/pronodata/${prono}/competition/currentstage`).on("value", snapshot => {
      if(snapshot !== undefined){
        callback(snapshot.val());
      }
    });
  }

  onGroupstageChanged(prono, callback) {
    return this.db.ref(`${this.tenant}/pronodata/${prono}/competition/groupstage`).on("value", snapshot => {
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
      callback(groupstage);
    });
  }

  onKnockoutstageChanged(prono, callback) {
    return this.db.ref(`${this.tenant}/pronodata/${prono}/competition/knockoutstage`).on("value", snapshot => {
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
      callback(knockoutstage.sort((a, b) => parseInt(b.key) - parseInt(a.key)));
    });
  }

  onMatchesChanged(prono, callback) {
    return this.db.ref(`${this.tenant}/pronodata/${prono}/competition/matches`).on("value", snapshot => {
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
      callback(matches);
    });
  }

  onTeamsChanged(prono, callback) {
    return this.db.ref(`${this.tenant}/pronodata/${prono}/competition/teams`).on("value", snapshot => {
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
            icon_url: val.icon || this._get_iso_icon(val.iso_icon),
          };
        });
      }
      callback(teams);
    });
  }

  onUserPronoMatchesChanged(prono, user, callback) {

    if (user !== undefined){
      return this.db.ref(`${this.tenant}/pronodata/${prono}/userpronos/${user.key}/matches`).on("value", snapshot => {
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
        callback(matches);
      });
    }
    else {
      return () => {}
    }
  }

  onUserPronoStageTeamsChanged(prono, user, callback) {

    if (user !== undefined){
      return this.db.ref(`${this.tenant}/pronodata/${prono}/userpronos/${user.key}/knockoutstageteams`).on("value", snapshot => {
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
        callback(stageTeams);
      });
    }
    else {
      return () => {}
    }
  }

  onUserPronoGroupWinnersChanged(prono, user, callback) {

    if (user !== undefined){
      return this.db.ref(`${this.tenant}/pronodata/${prono}/userpronos/${user.key}/groupwinners`).on("value", snapshot => {
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
        callback(groupWinners);
      });
    }
    else {
      return () => {}
    }
  }

  onUserPronoTotalGoalsChanged(prono, user, callback) {
    if (user !== undefined){
      return this.db.ref(`${this.tenant}/pronodata/${prono}/userpronos/${user.key}/totalgoals`).on("value", snapshot => {
        let goals = -1
        if (snapshot !== undefined){
          goals = snapshot.val()
        }
        callback(goals);
      });
    }
    else {
      return () => {}
    }
  }

  onUserPronoHomeTeamResultChanged(prono, user, callback) {
    if (user !== undefined){
      return this.db.ref(`${this.tenant}/pronodata/${prono}/userpronos/${user.key}/hometeamresult`).on("value", snapshot => {
        let stage = '-1'
        if (snapshot !== undefined){
          stage = snapshot.val()
        }
        callback(stage);
      });
    }
    else {
      return () => {}
    }
  }

  onHomeTeamResultChanged(prono, callback) {
    return this.db.ref(`${this.tenant}/pronodata/${prono}/competition/hometeamresult`).on("value", snapshot => {
      let stage = '-1'
      if (snapshot !== undefined){
        stage = snapshot.val()
      }
      callback(stage);
    });
  }

  onDeadlinesChanged(prono, callback) {
    return this.db.ref(`${this.tenant}/pronodata/${prono}/deadlines`).on("value", snapshot => {
      let deadlines = {
        'groupstage': Date.now()-100000,
        '16': Date.now()-100000,
        '8': Date.now()-100000,
        '4': Date.now()-100000,
        '2': Date.now()-100000,
      }
      if (snapshot !== undefined){
        const val = snapshot.val()
        deadlines['groupstage'] = new Date(val['groupstage'])
      }
      callback(deadlines);
    });
  }

  updateMatch(prono, match, update) {
    var updates = {};
    for (const [path, value] of Object.entries(update)) {
      updates[`${this.tenant}/pronodata/${prono}/competition/matches/${match.key}/${path}`] = value
    }
    return this.db.ref().update(updates)
  }

  updateGroupPoints(prono, group, teams) {
    let points = {}
    teams.forEach((team) => {
      points[team.key] = parseFloat(team.points);
    });
    return this.db.ref(`${this.tenant}/pronodata/${prono}/competition/groupstage/${group.key}/points`).set(points)
  }

  updateMatchProno(prono, user, match, update) {
    var updates = {};
    for (const [path, value] of Object.entries(update)) {
      updates[`${this.tenant}/pronodata/${prono}/userpronos/${user.key}/matches/${match.key}/${path}`] = value
    }
    return this.db.ref().update(updates)
  }

  updateGroupWinnersProno(prono, user, group, groupwinners) {
    const obj = {1: groupwinners[1].key, 2: groupwinners[2].key}
    return this.db.ref(`${this.tenant}/pronodata/${prono}/userpronos/${user.key}/groupwinners/${group.key}`).set(obj)
  }

  updateStageTeamsProno(prono, user, stage, teams) {
    const teamKeys = teams.map((team) => {return team.key;})
    return this.db.ref(`${this.tenant}/pronodata/${prono}/userpronos/${user.key}/knockoutstageteams/${stage.key}`).set(teamKeys)
  }

  updateTotalGoalsProno(prono, user, goals) {
    return this.db.ref(`${this.tenant}/pronodata/${prono}/userpronos/${user.key}/totalgoals`).set(goals)
  }

  updateTeamResultProno(prono, user, stage) {
    return this.db.ref(`${this.tenant}/pronodata/${prono}/userpronos/${user.key}/hometeamresult`).set(stage)
  }

  updateDisplayName(user, displayName) {
    return this.db.ref(`${this.tenant}/users/${user.key}/displayName`).set(displayName)
  }
  updatePaid(prono, user, paid) {
    return this.db.ref(`${this.tenant}/pronodata/${prono}/userpoints/${user.key}/paid`).set(paid)
  }
  updateActive(prono, user, active) {
    return this.db.ref(`${this.tenant}/pronodata/${prono}/userpoints/${user.key}/active`).set(active)
  }
  updateShowPoints(prono, user, showPoints) {
    return this.db.ref(`${this.tenant}/pronodata/${prono}/userpoints/${user.key}/showPoints`).set(showPoints)
  }
  updatePermissionEditor(user, editor) {
    return this.db.ref(`${this.tenant}/users/${user.key}/permissions/editor`).set(editor)
  }

  updateProfilePicture(user, image) {
    var ref = storage.ref(`users/${user.key}/profilePicture`);
    var uploadTask = ref.putString(image, 'data_url');
    uploadTask.on('state_changed',
      (snapshot) => {}, (error) => {}, () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          return this.db.ref(`${this.tenant}/users/${user.key}/profilePicture`).set(downloadURL)
        });
    });
  }

  updateCurrentStage(prono, currentStage) {
    return this.db.ref(`${this.tenant}/pronodata/${prono}/competition/currentstage`).set(currentStage);
  }

  updateHomeTeamResult(prono, result) {
    return this.db.ref(`${this.tenant}/pronodata/${prono}/competition/hometeamresult`).set(result);
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Teams
  addTeam(prono, team) {
    this.db.ref(`${this.tenant}/pronodata/${prono}/competition/teams`).push(team);
  }

  updateTeam(prono, team, update) {
    var updates = {};
    for (const [path, value] of Object.entries(update)) {
      updates[`${this.tenant}/pronodata/${prono}/competition/teams/${team.key}/${path}`] = value
    }
    return this.db.ref().update(updates)
  }

  deleteTeam(prono, team) {
    this.db.ref(`${this.tenant}/pronodata/${prono}/competition/teams/${team.key}`).set(null);
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Matches
  addMatch(prono, match) {
    this.db.ref(`${this.tenant}/pronodata/${prono}/competition/matches`).push(match);
  }

  deleteMatch(prono, match) {
    this.db.ref(`${this.tenant}/pronodata/${prono}/competition/matches/${match.key}`).set(null);
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Groupstage
  addGroup(prono, group) {
    this.db.ref(`${this.tenant}/pronodata/${prono}/competition/groupstage`).push(group);
  }

  deleteGroup(prono, group) {
    this.db.ref(`${this.tenant}/pronodata/${prono}/competition/groupstage/${group.key}`).set(null);
  }
  updateGroup(prono, group, update) {
    var updates = {};
    for (const [path, value] of Object.entries(update)) {
      updates[`${this.tenant}/pronodata/${prono}/competition/groupstage/${group.key}/${path}`] = value
    }
    return this.db.ref().update(updates)
  }

  groupAddTeam(prono, group, teamKey) {
    let newTeams = JSON.parse(JSON.stringify(group.teams));
    newTeams.push(teamKey)
    this.db.ref(`${this.tenant}/pronodata/${prono}/competition/groupstage/${group.key}/teams`).set(newTeams);
    this.db.ref(`${this.tenant}/pronodata/${prono}/competition/groupstage/${group.key}/points/${teamKey}`).set(0);
  }

  groupDeleteTeam(prono, group, teamKey) {
    let newTeams = [];
    group.teams.forEach((team) => {
      if (team !== teamKey){
        newTeams.push(team);
      }
    })
    this.db.ref(`${this.tenant}/pronodata/${prono}/competition/groupstage/${group.key}/teams`).set(newTeams);
    this.db.ref(`${this.tenant}/pronodata/${prono}/competition/groupstage/${group.key}/points/${teamKey}`).set(null);

    // cascade to user prono's?
  }

  groupAddMatch(prono, group, matchKey) {
    let newMatches = JSON.parse(JSON.stringify(group.matches));
    newMatches.push(matchKey)
    this.db.ref(`${this.tenant}/pronodata/${prono}/competition/groupstage/${group.key}/matches`).set(newMatches);
  }

  groupDeleteMatch(prono, group, matchKey) {
    let newMatches = [];
    group.matches.forEach((match) => {
      if (match !== matchKey){
        newMatches.push(match);
      }
    })
    this.db.ref(`${this.tenant}/pronodata/${prono}/competition/groupstage/${group.key}/matches`).set(newMatches);
  }


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Knockout Stage
  addStage(prono, stage) {
    this.db.ref(`${this.tenant}/pronodata/${prono}/competition/knockoutstage/`).push(stage);
  }

  deleteStage(prono, stage) {
    this.db.ref(`${this.tenant}/pronodata/${prono}/competition/knockoutstage/${stage.key}`).set(null);
  }
  stageAddMatch(prono, stage, matchKey) {
    let newMatches = JSON.parse(JSON.stringify(stage.matches));
    newMatches.push(matchKey)
    this.db.ref(`${this.tenant}/pronodata/${prono}/competition/knockoutstage/${stage.key}/matches`).set(newMatches);
  }

  stageDeleteMatch(prono, stage, matchKey) {
    let newMatches = [];
    stage.matches.forEach((match) => {
      if (match !== matchKey){
        newMatches.push(match);
      }
    })
    this.db.ref(`${this.tenant}/pronodata/${prono}/competition/knockoutstage/${stage.key}/matches`).set(newMatches);
  }


  _get_iso_icon(iso_code){
    return `images/flags/${iso_code}.png`
  }


}
export const api = new FirebaseAPI(db)
