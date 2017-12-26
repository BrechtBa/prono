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
    "groupstagewinners" : {
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
    "knockouttageteams" : {
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


function setUserGroupstagePoints(groupId, userId){
    // get all groupstage matches
    var matches = []
    admin.database().ref('/'+pronoGroupId+'/competition/stages/groupstage').once('value').then( snapshot => {
        snapshot.forEach( group => {
                group.forEach( match => {
                matches.push(match.val());
            });
        });
    }).then( canceled => {
        // loop though all matches
        admin.database().ref('/'+pronoGroupId+'/competition/matches/').once('value').then(function(snapshot){
            admin.database().ref('/'+pronoGroupId+'/userpronos/'+userId+'/matches').once('value').then(function(pronoSnapshot){
                var groupstagePoints = 0
                var knockoutstagePoints = 0

                snapshot.forEach(function(childSnapshot){
                    var matchId = childSnapshot.key
                    if(matches.indexOf(matchId) > -1){
                        scoreCorrect = rules.groupstage.score
                        resultCorrect = rules.groupstage.result
                    }
                    else{
                        scoreCorrect = rules.knockoutstage.score
                        resultCorrect = rules.knockoutstage.result
                    }

                    match = childSnapshot
                    pronoMatch = pronoSnapshot.child(matchId)
                    if(match.child('score1').val() > -1  && match.child('score2').val() > -1 && pronoMatch.child('score1').val() > -1  && pronoMatch.child('score2').val() > -1){
                        if(match.child('score1').val() == pronoMatch.child('score1').val() && match.child('score2').val() == pronoMatch.child('score2').val()){
                            // score correct
                            groupstagePoints += scoreCorrect
                        }
                        if(match.child('score1').val() > match.child('score2').val() && pronoMatch.child('score1').val() > pronoMatch.child('score2').val()){
                            // team1 wins correct
                            groupstagePoints += resultCorrect
                        }
                        else if(match.child('score1').val() < match.child('score2').val() && pronoMatch.child('score1').val() < pronoMatch.child('score2').val()){
                            // team2 wins correct
                            groupstagePoints += resultCorrect
                        }
                        else if(match.child('score1').val() == match.child('score2').val() && pronoMatch.child('score1').val() == pronoMatch.child('score2').val()){
                            // draw correct
                            groupstagePoints += resultCorrect
                        }
                    }

                });
                // write points to the database
                admin.database().ref('/'+pronoGroupId+'/users/'+userId+'/points/groupstage').set(groupstagePoints);
                admin.database().ref('/'+pronoGroupId+'/users/'+userId+'/points/knockoutstage').set(knockoutstagePoints);
            });
        });
    });
}


function setUserTotalGoalsPoints(pronoGroupId, userId){
    admin.database().ref('/'+pronoGroupId+'/competition/totalgoals').once('value').then( snapshot => {
        admin.database().ref('/'+pronoGroupId+'/userpronos/'+userId+'/totalgoals').once('value').then(function(pronoSnapshot){
            if(pronoSnapshot.val() > 0 && snapshot.val() > 0){
                points = Math.max(0, rules.totalgoals.correct - Math.abs(pronoSnapshot.val()-snapshot.val())*rules.totalgoals.error)
                admin.database().ref('/'+pronoGroupId+'/users/'+userId+'/points/totalgoals').set(points);
            }
        });
    });
}


function setUserGroupstageWinnersPoints(pronoGroupId, userId){
    admin.database().ref('/'+pronoGroupId+'/competition/stages/groupstage').once('value').then( snapshot => {
        admin.database().ref('/'+pronoGroupId+'/userpronos/'+userId+'/groupstagewinners').once('value').then(function(pronoSnapshot){
            var points = 0
            snapshot.forEach(function(group){
                var teams = []
                group.child('teams').forEach(function(team){
                    teams.push({id: team.key, points: team.child('points').val()})
                })
                teams.sort(function(a, b){
                    return b.points-a.points
                })
                if(teams.length > 1 && teams[0].points > 0){
                    if(teams[0].id == pronoSnapshot.child(group.key).child('1').val() || teams[1].id == pronoSnapshot.child(group.key).child('1').val()){
                        points += rules.groupstagewinners.team
                    }
                    if(teams[0].id == pronoSnapshot.child(group.key).child('2').val() || teams[1].id == pronoSnapshot.child(group.key).child('2').val()){
                        points += rules.groupstagewinners.team
                    }
                    if(teams[0].id == pronoSnapshot.child(group.key).child('1').val()){
                        points += rules.groupstagewinners.winner
                    }
                }
            });
            admin.database().ref('/'+pronoGroupId+'/users/'+userId+'/points/groupstagewinners').set(points);
        });
    });
}


function setTotalGoals(pronoGroupId){
    admin.database().ref('/'+pronoGroupId+'/competition/matches').once('value').then( snapshot => {
        totalGoals = 0
        snapshot.forEach( match => {
            if(match.child('score1').val() > -1  && match.child('score2').val() > -1){
                totalGoals += match.child('score1').val() + match.child('score2').val()
            }
        });
        admin.database().ref('/'+pronoGroupId+'/competition/totalgoals').set(totalGoals);
    });
}



exports.matchScore1Changed = functions.database.ref('/{pronoGroupId}/competition/matches/{matchId}/score1').onWrite(event => {
    admin.database().ref('/'+event.params.groupId+'/users').once('value').then( snapshot => {
        snapshot.forEach( user => {

            setUserGroupstagePoints(event.params.pronoGroupId, user.key);
            setTotalGoals(event.params.groupId);
        });
    });
    return null;
});
exports.matchScore2Changed = functions.database.ref('/{pronoGroupId}/competition/matches/{matchId}/score2').onWrite(event => {
    admin.database().ref('/'+event.params.groupId+'/users').once('value').then( snapshot => {
        snapshot.forEach( user => {

            setUserGroupstagePoints(event.params.pronoGroupId, user.key)
            setTotalGoals(event.params.groupId);
        });
    });
    return null;
});
exports.totalGoalsChanged = functions.database.ref('/{pronoGroupId}/competition/totalgoals').onWrite(event => {
    admin.database().ref('/'+event.params.groupId+'/users').once('value').then( snapshot => {
        snapshot.forEach( user => {
            setUserTotalGoalsPoints(event.params.pronoGroupId, user.key)
        });
    });
    return null;
});
exports.teamPointsChanged = functions.database.ref('/{pronoGroupId}/competition/stages/groupstage/{groupId}/teams/{teamId}/points').onWrite(event => {
    admin.database().ref('/'+event.params.groupId+'/users').once('value').then( snapshot => {
        snapshot.forEach( user => {
            setUserGroupstageWinnersPoints(event.params.pronoGroupId, user.key)
        });
    });
    return null;
});