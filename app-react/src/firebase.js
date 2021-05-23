import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

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


class FirebaseAPI {
  constructor(db) {
    this.db = db;
    this.root = 'pronogroupid1';
  }

  onRulesChanged(callback) {
    return this.db.ref(`${this.root}/rules`).on("value", snapshot => {
      if (snapshot !== undefined){
        callback(snapshot.val());
      }
    });
  }

  onUsersChanged(callback) {
    return this.db.ref(`${this.root}/users`).on("value", snapshot => {
      let users = [];
      if (snapshot !== undefined){
        snapshot.forEach((snap) => {
          const val = snap.val()
          users.push({
            key: snap.key,
            displayName: val.displayName,
            paid: val.paid,
            active: val.active || true,
            permission: val.permission,
            points: val.points,
            profilePicture: val.profilePicture,
          });
        });
      }
      callback(users);
    });
  }

  onCurrentStageChanged(callback) {
    return this.db.ref(`${this.root}/competition/currentstage`).on("value", snapshot => {
      if(snapshot !== undefined){
        callback(snapshot.val());
      }
    });
  }

  onGroupstageChanged(callback) {
    return this.db.ref(`${this.root}/competition/stages/groupstage`).on("value", snapshot => {
      let groupstage = [];
      if (snapshot !== undefined){
        snapshot.forEach((snap) => {
          const val = snap.val()
          groupstage.push({
            key: snap.key,
            name: snap.key,
            matches: val.matches,
            teams: val.teams,
            points: val.points
          });
        });
      }
      callback(groupstage);
    });
  }

  onKnockoutstageChanged(callback) {
    return this.db.ref(`${this.root}/competition/stages`).on("value", snapshot => {
      let knockoutstage = [];
      if (snapshot !== undefined){
        snapshot.forEach((snap) => {
          const val = snap.val()
          if(snap.key !== 'groupstage'){
            knockoutstage.push({
              key: snap.key,
              matches: val,
            });
          }
        });
      }
      callback(knockoutstage.sort((a, b) => parseInt(b.key) - parseInt(a.key)));
    });
  }

  onMatchesChanged(callback) {
    return this.db.ref(`${this.root}/competition/matches`).on("value", snapshot => {
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

  onTeamsChanged(callback) {
    return this.db.ref(`${this.root}/competition/teams`).on("value", snapshot => {
      let teams = {};
      if (snapshot !== undefined){
        snapshot.forEach((snap) => {
          const val = snap.val()
          teams[snap.key] = {
            key: snap.key,
            name: val.name,
            abbreviation: val.abr,
            icon: val.icon || this._get_iso_icon(val.iso_icon),
          };
        });
      }
      callback(teams);
    });
  }

  onUserPronoMatchesChanged(user, callback) {

    if (user !== undefined){
      return this.db.ref(`${this.root}/userpronos/${user.key}/matches`).on("value", snapshot => {
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

  onUserPronoStageTeamsChanged(user, callback) {

    if (user !== undefined){
      return this.db.ref(`${this.root}/userpronos/${user.key}/knockoutstageteams`).on("value", snapshot => {
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

  onUserPronoGroupWinnersChanged(user, callback) {

    if (user !== undefined){
      return this.db.ref(`${this.root}/userpronos/${user.key}/groupwinners`).on("value", snapshot => {
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

  onUserPronoTotalGoalsChanged(user, callback) {
    if (user !== undefined){
      return this.db.ref(`${this.root}/userpronos/${user.key}/totalgoals`).on("value", snapshot => {
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

  onUserPronoHomeTeamResultChanged(user, callback) {
    if (user !== undefined){
      return this.db.ref(`${this.root}/userpronos/${user.key}/hometeamresult`).on("value", snapshot => {
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

  updateMatch(match, update) {
    var updates = {};
    for (const [path, value] of Object.entries(update)) {
      updates[`${this.root}/competition/matches/${match.key}/${path}`] = value
    }
    return this.db.ref().update(updates)
  }

  updateGroupPoints(group, teams) {
    let points = {}
    teams.forEach((team) => {
      points[team.key] = parseFloat(team.points);
    });
    return this.db.ref(`${this.root}/competition/stages/groupstage/${group.key}/points`).set(points)
  }

  updateMatchProno(user, match, update) {
    var updates = {};
    for (const [path, value] of Object.entries(update)) {
      updates[`${this.root}/userpronos/${user.key}/matches/${match.key}/${path}`] = value
    }
    return this.db.ref().update(updates)
  }

  updateGroupWinnersProno(user, group, groupwinners) {
    const obj = {1: groupwinners[1].key, 2: groupwinners[2].key}
    return this.db.ref(`${this.root}/userpronos/${user.key}/groupwinners/${group.key}`).set(obj)
  }

  updateStageTeamsProno(user, stage, teams) {
    const teamKeys = teams.map((team) => {return team.key;})
    return this.db.ref(`${this.root}/userpronos/${user.key}/knockoutstageteams/${stage.key}`).set(teamKeys)
  }

  updateTotalGoalsProno(user, goals) {
    return this.db.ref(`${this.root}/userpronos/${user.key}/totalgoals`).set(goals)
  }

  updateTeamResultProno(user, stage) {
    return this.db.ref(`${this.root}/userpronos/${user.key}/hometeamresult`).set(stage)
  }

  _get_iso_icon(iso_code){
    return `images/flags/${iso_code}.png`
  }


}
export const api = new FirebaseAPI(db)
