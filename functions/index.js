// free plan: 125 k calls per month
// 25USD plan: 2 M calls per month

const functions = require('firebase-functions');
const admin = require('firebase-admin');

//PRODUCTION
admin.initializeApp(functions.config().firebase);

//TESTING
//var serviceAccount = require('./serviceaccountkey.json');
//admin.initializeApp({
//    credential: admin.credential.cert(serviceAccount),
//    databaseURL: 'https://project-3359822390427923494.firebaseio.com'
//});


// rules
var rules = {
    "groupstage" : {
        "result" : 3,
        "score" : 4
    },
    "groupwinners" : {
        "team" : 2,
        "winner" : 4
    },
    "hometeamresult" : {
        "1" : 150,
        "2" : 100,
        "4" : 50,
        "8" : 30,
        "16" : 10,
        "groupstage" : 5
    },
    "knockoutstage" : {
        "result" : 6,
        "score" : 8
    },
    "knockoutstageteams" : {
        "1" : 60,
        "2" : 42,
        "4" : 28,
        "8" : 18
    },
    "totalgoals" : {
        "correct" : 100,
        "error" : 6
    }
}


function setUserMatchesPoints(pronoGroupId, userId, matches, groupstageMatches){
    admin.database().ref('/'+pronoGroupId+'/userpronos/'+userId+'/matches').once('value').then(function(pronoSnapshot){

        var groupstagePoints = 0
        var knockoutstagePoints = 0
        // loop though all matches
        matches.forEach(function(match){
            var matchId = match.key
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
        admin.database().ref('/'+pronoGroupId+'/users/'+userId+'/points/groupstage').set(groupstagePoints);
        admin.database().ref('/'+pronoGroupId+'/users/'+userId+'/points/knockoutstage').set(knockoutstagePoints);
        console.log("set groupstage points for user "+userId);
        console.log("set knockoutstage points for user "+userId);
    });
}


function setUserTotalGoalsPoints(pronoGroupId, userId){
    admin.database().ref('/'+pronoGroupId+'/competition/totalgoals').once('value').then( snapshot => {
        admin.database().ref('/'+pronoGroupId+'/userpronos/'+userId+'/totalgoals').once('value').then(function(pronoSnapshot){
            var points = 0
            if(pronoSnapshot.val() > 0 && snapshot.val() > 0){
                points = Math.max(0, rules.totalgoals.correct - Math.abs(pronoSnapshot.val()-snapshot.val())*rules.totalgoals.error)
            }
            admin.database().ref('/'+pronoGroupId+'/users/'+userId+'/points/totalgoals').set(points);
            console.log("set totalgoals points for user "+userId);
        });
    });
}


function setUserGroupWinnersPoints(pronoGroupId, userId){
    admin.database().ref('/'+pronoGroupId+'/competition/stages/groupstage').once('value').then( snapshot => {
        admin.database().ref('/'+pronoGroupId+'/userpronos/'+userId+'/groupwinners').once('value').then(function(pronoSnapshot){
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
                        points += rules.groupwinners.team;
                    }
                    if(teams[0].id == pronoSnapshot.child(group.key).child('2').val() || teams[1].id == pronoSnapshot.child(group.key).child('2').val()){
                        points += rules.groupwinners.team;
                    }
                    if(teams[0].id == pronoSnapshot.child(group.key).child('1').val()){
                        points += rules.groupwinners.winner;
                    }
                }
            });

            admin.database().ref('/'+pronoGroupId+'/users/'+userId+'/points/groupwinners').set(points);
            console.log("set groupwinners points for user "+userId);
        });
    });
}


function setUserKnockoutStageTeamsPoints(pronoGroupId, userId, stageTeams){
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

    admin.database().ref('/'+pronoGroupId+'/userpronos/'+userId+'/knockoutstageteams').once('value').then(function(pronoSnapshot){
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
        admin.database().ref('/'+pronoGroupId+'/users/'+userId+'/points/knockoutstageteams').set(points);
        console.log("set knockoutstageteams points for user "+userId);
        return null;
    });
}


function setUserHomeTeamResultPoints(pronoGroupId, userId, stage){
    admin.database().ref('/'+pronoGroupId+'/userpronos/'+userId+'/hometeamresult').once('value').then(function(pronoSnapshot){
        var points = 0
        if(stage == pronoSnapshot.val()){
            points = rules.hometeamresult[stage]
        }
        admin.database().ref('/'+pronoGroupId+'/users/'+userId+'/points/hometeamresult').set(points);
        console.log("set hometeamresult points for user "+userId);
    });
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Helpers
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getMatches(pronoGroupId){
    matchesPromise = admin.database().ref('/'+pronoGroupId+'/competition/matches').once('value').then( snapshot => {
        return snapshot;
    });
    return matchesPromise;
}


function getGroupstageMatches(pronoGroupId){
    matchesPromise = admin.database().ref('/'+pronoGroupId+'/competition/stages/groupstage').once('value').then( snapshot => {
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


function getKnockoutstageTeams(pronoGroupId){

    stageTeamsPromise = admin.database().ref('/'+pronoGroupId+'/competition/matches').once('value').then(function(matchesSnapshot){
        stageTeamsPromise = admin.database().ref('/'+pronoGroupId+'/competition/stages').once('value').then(function(snapshot){

            var stages = []
            var stageTeams = {}

            // get the teams in all stages
            snapshot.forEach(function(stage){
                if(stage.key != 'groupstage'){
                    stages.push(stage.key)
                    stageTeams[stage.key] = []
                    stage.forEach(function(matchid){
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
                }
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


function setTotalGoals(pronoGroupId){
    admin.database().ref('/'+pronoGroupId+'/competition/matches').once('value').then( snapshot => {
        totalGoals = 0
        snapshot.forEach( match => {
            score1 = parseInt(match.child('score1').val())
            score2 = parseInt(match.child('score2').val())
            if(score1 > -1  && score2 > -1){
                totalGoals += score1 + score2
            }
        });
        admin.database().ref('/'+pronoGroupId+'/competition/totalgoals').set(totalGoals);
    });
}


function getTeamResult(stageTeams, teamId){
    var stage = null

    // make a sorted list of stages
    var stages = []
    for(key in stageTeams){
        stages.push(key)
    }

    thestage = '1'
    if(stageTeams[thestage].indexOf(teamId) > -1){
        return thestage;
    }
    thestage = stages[stages.length-1]
    if(stageTeams[thestage].length == parseInt(thestage) && stageTeams[thestage].indexOf(teamId) < 0){
        return 'groupstage';
    }

    for(var i=1; i<stages.length;i++){
        if(stageTeams[stages[i-1]].length == parseInt(stages[i-1]) && stageTeams[stages[i]].indexOf(teamId) > -1 && stageTeams[stages[i-1]].indexOf(teamId) < 0){
            return stages[i];
        }
    }
    return stage
}


function getHomeTeamResult(pronoGroupId){
    var stagePromise = admin.database().ref('/'+pronoGroupId+'/competition/hometeam').once('value').then(function(teamId){
        return getTeamResult(pronoGroupId, teamId)
    })
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Exports
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.totalGoalsChanged = functions.database.ref('/{pronoGroupId}/competition/totalgoals').onWrite((data, context) => {
    var pronoGroupId = context.params.pronoGroupId;
    admin.database().ref('/'+pronoGroupId+'/users').once('value').then( snapshot => {
        snapshot.forEach( user => {
            setUserTotalGoalsPoints(pronoGroupId, user.key)
        });
    });
    return null;
});
exports.teamPointsChanged = functions.database.ref('/{pronoGroupId}/competition/stages/groupstage/{groupId}/points/{teamId}/').onWrite((data, context) => {
    var pronoGroupId = context.params.pronoGroupId;
    admin.database().ref('/'+pronoGroupId+'/users').once('value').then( snapshot => {
        snapshot.forEach( user => {
            setUserGroupWinnersPoints(pronoGroupId, user.key)
        });
    });
    return null;
});
exports.matchChanged = functions.database.ref('/{pronoGroupId}/competition/matches/{matchId}/{key}').onWrite((data, context) => {
    var key = context.params.key;
    var pronoGroupId = context.params.pronoGroupId;
    var matchId = context.params.matchId
    if(key == 'team1' || key == 'team2'){
        admin.database().ref('/'+pronoGroupId+'/users').once('value').then(function(users){
            getKnockoutstageTeams(pronoGroupId).then(function(stageTeams){
                users.forEach( user => {
                    setUserKnockoutStageTeamsPoints(pronoGroupId, user.key, stageTeams)
                });
                admin.database().ref('/'+pronoGroupId+'/competition/hometeam').once('value').then(function(teamId){
                    var stage = getTeamResult(stageTeams, teamId.val())
                    users.forEach( user => {
                        setUserHomeTeamResultPoints(pronoGroupId, user.key, stage)
                    });
                });
            });
        });
    }
    if (key == 'score1' || key == 'score2'){
        setTotalGoals(pronoGroupId);
        admin.database().ref('/'+pronoGroupId+'/users').once('value').then(function(users){
            admin.database().ref('/'+pronoGroupId+'/competition/matches/').once('value').then(function(matches){
                getGroupstageMatches(pronoGroupId).then(function(groupstageMatches){
                    users.forEach(function(user){
                        setUserMatchesPoints(pronoGroupId, user.key, matches, groupstageMatches);
                    });
                });
            });
         });
    }
    if(key == 'score1' || key == 'score2' || key == 'penalty1' || key == 'penalty2'){
        // check if it is the final
        admin.database().ref('/'+pronoGroupId+'/competition/stages/2/0').once('value').then( snapshot => {
            if(snapshot.val() == matchId){
                admin.database().ref('/'+pronoGroupId+'/users').once('value').then(function(users){
                    getKnockoutstageTeams(pronoGroupId).then(function(stageTeams){
                        users.forEach( user => {
                            setUserKnockoutStageTeamsPoints(pronoGroupId, user.key, stageTeams)
                        });
                        admin.database().ref('/'+pronoGroupId+'/competition/hometeam').once('value').then(function(teamId){
                            var stage = getTeamResult(stageTeams, teamId.val())
                            users.forEach( user => {
                                setUserHomeTeamResultPoints(pronoGroupId, user.key, stage)
                            });
                        });
                    });
                });
            }
        });
    }
    return null;
});
exports.createUser = functions.auth.user().onCreate((user) => {
    var pronoGroupId = 'pronogroupid1';
    var email = user.email;
    var displayName = email.split('@')[0][0].toUpperCase() + email.split('@')[0].replace('_', ' ').replace('.', ' ').slice(1);
    admin.database().ref('/'+pronoGroupId+'/users/'+user.uid+'/permission').set(1);
    admin.database().ref('/'+pronoGroupId+'/users/'+user.uid+'/displayName').set(displayName);
    var points = {};
    for(var key in rules) {
        points[key] = 0;
    }
    admin.database().ref('/'+pronoGroupId+'/users/'+user.uid+'/points').set(points);

    return null;
});
