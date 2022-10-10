const admin = require('firebase-admin');


var serviceAccount = require('./serviceaccountkey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://project-3359822390427923494.firebaseio.com'
});


const db = admin.database();

//db.ref("/").once("value", function(snapshot) {
//  console.log(snapshot.val());
//});


function setUserMatchesPoints(tenantId, pronoId, userId, matches, groupstageMatches){

    db.ref('/'+tenantId+'/pronos/'+pronoId+'/rules').once('value', (rulesSnapshot) => {
        const rules = rulesSnapshot.val();

        db.ref('/'+tenantId+'/pronos/'+pronoId+'/userpronos/'+userId+'/matches').once('value', (pronoSnapshot) => {

            var groupstagePoints = 0
            var knockoutstagePoints = 0
            // loop though all matches
            matches.forEach((match) => {
                const matchId = match.key;

                if(groupstageMatches.indexOf(matchId) > -1){
                    var scoreCorrect = rules.groupstage.score
                    var resultCorrect = rules.groupstage.result
                }
                else{
                    var scoreCorrect = rules.knockoutstage.score
                    var resultCorrect = rules.knockoutstage.result
                }

                var pronoMatch = pronoSnapshot.child(matchId)
                var score1 = parseInt(match.child('score1').val())
                var score2 = parseInt(match.child('score2').val())
                var pronoScore1 = parseInt(pronoMatch.child('score1').val())
                var pronoScore2 = parseInt(pronoMatch.child('score2').val())
                var add = 0
                if(score1 > -1  && score2 > -1 && pronoScore1 > -1  && pronoScore2 > -1){
                    if(score1 == pronoScore1 && score2 == pronoScore2){
                        // score correct
                        add += scoreCorrect
                    }
                    if(score1 > score2 && pronoScore1 > pronoScore2){
                        // team1 wins correct
                        add += resultCorrect
                    }
                    else if(score1 < score2 && pronoScore1 < pronoScore2){
                        // team2 wins correct
                        add += resultCorrect
                    }
                    else if(score1 == score2 && pronoScore1 == pronoScore2){
                        // draw correct
                        add += resultCorrect
                    }
                }
                if(groupstageMatches.indexOf(matchId) > -1){
                    groupstagePoints += add
                }
                else{
                    knockoutstagePoints += add
                }

            });

            // write points to the database
            db.ref('/'+tenantId+'/pronos/'+pronoId+'/userpoints/'+userId+'/points/groupstage').set(groupstagePoints);
            db.ref('/'+tenantId+'/pronos/'+pronoId+'/userpoints/'+userId+'/points/knockoutstage').set(knockoutstagePoints);
            console.log("set groupstage points for " + tenantId + "/" + pronoId + ", user "+userId);
            console.log("set knockoutstage points for " + tenantId + "/" + pronoId + ", user "+userId);
        });
    });
}


function setUserTotalGoalsPoints(tenantId, pronoId, userId){

    db.ref('/'+tenantId+'/pronos/'+pronoId+'/rules').once('value', (rulesSnapshot) => {
        const rules = rulesSnapshot.val();

        db.ref('/'+tenantId+'/pronos/'+pronoId+'/competition/totalgoals').once('value').then( snapshot => {
            db.ref('/'+tenantId+'/pronos/'+pronoId+'/userpronos/'+userId+'/totalgoals').once('value').then(function(pronoSnapshot){
                var points = 0
                if(pronoSnapshot.val() > 0 && snapshot.val() > 0){
                    points = Math.max(0, rules.totalgoals.correct - Math.abs(pronoSnapshot.val()-snapshot.val())*rules.totalgoals.error)
                }
                db.ref('/'+tenantId+'/pronos/'+pronoId+'/userpoints/'+userId+'/points/totalgoals').set(points);
                console.log("set totalgoals points for " + tenantId + "/" + pronoId + ", user "+userId);
            });
        });
    });
}


function setUserGroupWinnersPoints(tenantId, pronoId, userId){
    db.ref('/'+tenantId+'/pronos/'+pronoId+'/rules').once('value', (rulesSnapshot) => {
        const rules = rulesSnapshot.val();

        db.ref('/'+tenantId+'/pronos/'+pronoId+'/competition/groupstage').once('value').then( snapshot => {
            db.ref('/'+tenantId+'/pronos/'+pronoId+'/userpronos/'+userId+'/groupwinners').once('value').then(function(pronoSnapshot){
                var points = 0;
                snapshot.forEach(function(group){
                    var teams = [];
                    group.child('points').forEach(function(points){
                        teams.push({id: points.key, points: points.val()});
                    });
                    teams.sort(function(a, b){
                        return b.points-a.points;
                    });
                    if(teams.length > 1 && teams[0].points > 0){
                        if(teams[0].id == pronoSnapshot.child(group.key).child('1').val() || teams[1].id == pronoSnapshot.child(group.key).child('1').val()){
                            points += rules.groupstagewinners.team;
                        }
                        if(teams[0].id == pronoSnapshot.child(group.key).child('2').val() || teams[1].id == pronoSnapshot.child(group.key).child('2').val()){
                            points += rules.groupstagewinners.team;
                        }
                        if(teams[0].id == pronoSnapshot.child(group.key).child('1').val()){
                            points += rules.groupstagewinners.winner;
                        }
                    }
                });

                db.ref('/'+tenantId+'/pronos/'+pronoId+'/userpoints/'+userId+'/points/groupwinners').set(points);
                console.log("set groupwinners points for " + tenantId + "/" + pronoId + ", user "+userId);
            });
        });
    });
}


function setUserKnockoutStageTeamsPoints(tenantId, pronoId, userId, stageTeams){
    // remove the largest stage
    var largest = 0
    for(var key in stageTeams){
        if(parseInt(key) > largest){
            largest = parseInt(key);
        }
    }
    var tempstageteams ={};
    for(var key in stageTeams){
        if(key != largest){
            tempstageteams[key] = stageTeams[key];
        }
    }
    var stageTeams = tempstageteams;

    db.ref('/'+tenantId+'/pronos/'+pronoId+'/rules').once('value', (rulesSnapshot) => {
        const rules = rulesSnapshot.val();

        db.ref('/'+tenantId+'/pronos/'+pronoId+'/userpronos/'+userId+'/knockoutstageteams').once('value').then(function(pronoSnapshot){
            var points = 0;
            pronoSnapshot.forEach(function(stage){
                if(stageTeams[stage.key]){
                    stage.forEach(function(team){
                        if(stageTeams[stage.key].indexOf(team.val()) > -1){
                            points += rules.knockoutstageteams[stage.key];
                        }
                    });
                }
            });
            db.ref('/'+tenantId+'/pronos/'+pronoId+'/userpoints/'+userId+'/points/knockoutstageteams').set(points);
            console.log("set knockoutstageteams points for " + tenantId + "/" + pronoId + ", user "+userId);
            return null;
        });
    });
}


function setUserHomeTeamResultPoints(tenantId, pronoId, userId, stage){
    db.ref('/'+tenantId+'/pronos/'+pronoId+'/rules').once('value', (rulesSnapshot) => {
        const rules = rulesSnapshot.val();

        db.ref('/'+tenantId+'/pronos/'+pronoId+'/userpronos/'+userId+'/hometeamresult').once('value').then(function(pronoSnapshot){
            var points = 0
            if(stage == pronoSnapshot.val() && (stage > 0 || stage == 'groupstage')){
                points = rules.hometeamresult[stage]
            }
            db.ref('/'+tenantId+'/pronos/'+pronoId+'/userpoints/'+userId+'/points/hometeamresult').set(points);
            console.log("set hometeamresult points for " + tenantId + "/" + pronoId + ", user "+userId);
        });
    });
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Helpers
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getMatches(tenantId, pronoId){
    matchesPromise = db.ref('/'+tenantId+'/pronos/'+pronoId+'/competition/matches').once('value').then( snapshot => {
        return snapshot;
    });
    return matchesPromise;
}


function getGroupstageMatches(tenantId, pronoId){
    matchesPromise = db.ref('/'+tenantId+'/pronos/'+pronoId+'/competition/groupstage').once('value').then( snapshot => {
        var matches = []
        snapshot.forEach( function(group){
            group.child('matches').forEach(function(match){
                matches.push(match.val());
            });
        });
        return matches;
    });
    return matchesPromise;
}


function getKnockoutstageTeams(tenantId, pronoId){

    stageTeamsPromise = db.ref('/'+tenantId+'/pronos/'+pronoId+'/competition/matches').once('value').then(function(matchesSnapshot){
        stageTeamsPromise = db.ref('/'+tenantId+'/pronos/'+pronoId+'/competition/knockoutstage').once('value').then(function(snapshot){

            var stages = []
            var stageTeams = {}

            // get the teams in all stages
            snapshot.forEach(function(stage){
                  stages.push(stage.key)
                  stageTeams[stage.key] = []
                  Object.entries(stage.matches || {}).map(val => val[1]).forEach(function(matchid){
                      match = matchesSnapshot.child(matchid.val())
                      team1 = match.child('team1').val()
                      team2 = match.child('team2').val()
                      if(team1){
                          stageTeams[stage.key].push(team1)
                      }
                      if(team2){
                          stageTeams[stage.key].push(team2)
                      }
                  });
            });

            // add the winner if available
            matchid = snapshot.child(2).child(0).val();
            team1 = matchesSnapshot.child(matchid).child('team1').val();
            score1 = parseInt(matchesSnapshot.child(matchid).child('score1').val()) + 0.01*parseInt(matchesSnapshot.child(matchid).child('penalty1').val());
            team2 = matchesSnapshot.child(matchid).child('team2').val();
            score2 = parseInt(matchesSnapshot.child(matchid).child('score2').val()) + 0.01*parseInt(matchesSnapshot.child(matchid).child('penalty2').val());

            if(score1 > score2){
                stageTeams['1'] = [team1]
            }
            else if(score2 > score1){
                stageTeams['1'] = [team2]
            }
            else{
                stageTeams['1'] = []
            }
            return stageTeams;
        });
        return stageTeamsPromise
    });
    return stageTeamsPromise
}


function setTotalGoals(tenantId, pronoId){
    db.ref('/'+tenantId+'/pronos/'+pronoId+'/competition/matches').once('value').then( snapshot => {
        totalGoals = 0
        snapshot.forEach( match => {
            score1 = parseInt(match.child('score1').val())
            score2 = parseInt(match.child('score2').val())
            if(score1 > -1  && score2 > -1){
                totalGoals += score1 + score2
            }
        });
        db.ref('/'+tenantId+'/pronos/'+pronoId+'/competition/totalgoals').set(totalGoals);
    });
}


//function getTeamResult(stageTeams, teamId){
//    var stage = null
//
//    // make a sorted list of stages
//    var stages = []
//    for(key in stageTeams){
//        stages.push(key)
//    }
//
//    thestage = '1'
//    if(stageTeams[thestage].indexOf(teamId) > -1){
//        return thestage;
//    }
//    thestage = stages[stages.length-1]
//    if(stageTeams[thestage].length == parseInt(thestage) && stageTeams[thestage].indexOf(teamId) < 0){
//        return 'groupstage';
//    }
//
//    for(var i=1; i<stages.length;i++){
//        if(stageTeams[stages[i-1]].length == parseInt(stages[i-1]) && stageTeams[stages[i]].indexOf(teamId) > -1 && stageTeams[stages[i-1]].indexOf(teamId) < 0){
//            return stages[i];
//        }
//    }
//    return stage
//}


//function getHomeTeamResult(tenantId, pronoId){
//    var stagePromise = db.ref('/'+tenantId+'/pronos/'+pronoId+'/competition/hometeam').once('value').then(function(teamId){
//        return getTeamResult(tenantId, pronoId, teamId)
//    })
//}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Exports
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const totalGoalsChangedHandler = (tenantId, pronoId) => {
    admin.database().ref(`/${tenantId}/pronos/${pronoId}/userpoints`).once('value', snapshot => {
          snapshot.forEach( user => {
              setUserTotalGoalsPoints(tenantId, pronoId, user.key)
          });
    });
}

const teamPointsChangedHandler = (tenantId, pronoId) => {
    admin.database().ref(`/${tenantId}/pronos/${pronoId}/userpoints`).once('value', (snapshot) => {
        snapshot.forEach( user => {
            setUserGroupWinnersPoints(tenantId, pronoId, user.key)
        });
    });
}


matchChangedHandler = (tenantId, pronoId) => {
    admin.database().ref(`/${tenantId}/pronos/${pronoId}/competition/matches`).once('value', (matches) => {
        admin.database().ref(`/${tenantId}/pronos/${pronoId}/userpoints`).once('value', users => {

          // update knockoutstage teams points
          getKnockoutstageTeams(tenantId, pronoId).then((stageTeams) => {
            users.forEach(user => {
                setUserKnockoutStageTeamsPoints(tenantId, pronoId, user.key, stageTeams)
            });
          });

          // update matches points
          getGroupstageMatches(tenantId, pronoId).then((groupstageMatches) => {
            users.forEach((user) => {
              setUserMatchesPoints(tenantId, pronoId, user.key, matches, groupstageMatches);
            });
          });

          // set total goals
          setTotalGoals(tenantId, pronoId);

        });
    });
}

homeTeamResultChangedHandler = (tenantId, pronoId) => {
    admin.database().ref(`/${tenantId}/pronos/${pronoId}/competition/hometeamresult`).once('value', (hometeamresult) => {
        admin.database().ref(`/${tenantId}/pronos/${pronoId}/userpoints`).once('value', (users) => {
            users.forEach( user => {
                setUserHomeTeamResultPoints(tenantId, pronoId, user.key, hometeamresult.val())
            });
        });
    });
}

// this triggers an infinite loop
//somethingChanged = db.ref('/').on("value", snapshot => {
//    snapshot.forEach(tenant => {
//        tenant.child("pronos").forEach(prono => {
//
//            console.log(`updating points for ${pronoGroup.key}/${prono.key}`);
//            totalGoalsChangedHandler(pronoGroup.key, prono.key);
//            teamPointsChangedHandler(pronoGroup.key, prono.key);
//            matchChangedHandler(pronoGroup.key, prono.key);
//            homeTeamResultChangedHandler(pronoGroup.key, prono.key);
//        });
//    })
//    return null;
//});


// there are no wildcards in the nodejs api so this does not work but would be more efficient
const tenantId = 'pronogroupid1';
const pronoId = 'wk2022';

totalGoalsChanged = db.ref(`/${tenantId}/pronos/${pronoId}/competition/totalgoals`).on("value", snapshot => {
    totalGoalsChangedHandler(tenantId, pronoId)
    return null;
});


teamPointsChanged = db.ref(`/${tenantId}/pronos/${pronoId}/competition/groupstage`).on("value", (snapshot) => {
    teamPointsChangedHandler(tenantId, pronoId)
    return null;
});


matchChanged = db.ref(`/${tenantId}/pronos/${pronoId}/competition/matches`).on("value", (matches) => {
  matchChangedHandler(tenantId, pronoId)
  return null;
});


homeTeamResultChanged = db.ref(`/${tenantId}/pronos/${pronoId}/competition/hometeamresult`).on('value', (snapshot) => {
    homeTeamResultChangedHandler(tenantId, pronoId)
});