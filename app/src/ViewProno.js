import React, { useContext } from 'react';

import { UserContext } from "./UserProvider.js";
import { GroupstageProno } from './GroupStage.js';
import { KnockoutStageProno } from './KnockoutStage.js';
import { KnockoutStageTeamsProno, pronoStages } from './prono/KnockoutStageTeams.js';
import { TotalGoalsProno } from './prono/TotalGoals.js'
import { TeamResultProno } from './prono/TeamResult.js'
import { DeadlineMessage } from './prono/PronoUtils.js'


const getFullGroupstage = (groupstage, matches, teams, matchesProno, groupWinnersProno) => {

  const groups = groupstage.map((group) => {
    let full_group = JSON.parse(JSON.stringify(group));

    if(group.matches !== undefined){
      full_group.matches = group.matches.map((match_key) => {
        let full_match = JSON.parse(JSON.stringify(matches[match_key]));

        if(matchesProno[match_key] !== undefined && matchesProno[match_key].score1 !== undefined){
          full_match.score1 = matchesProno[match_key].score1;
        }
        else{
          full_match.score1 = -1;
        }
        if(matchesProno[match_key] !== undefined && matchesProno[match_key].score2 !== undefined){
          full_match.score2 = matchesProno[match_key].score2;
        }
        else{
          full_match.score2 = -1;
        }

        if(teams[full_match.team1] !== undefined){
          full_match.team1 = JSON.parse(JSON.stringify(teams[full_match.team1]));
        }
        else{
          full_match.team1 = null
        }
        if(teams[full_match.team2] !== undefined){
          full_match.team2 = JSON.parse(JSON.stringify(teams[full_match.team2]));
        }
        else{
          full_match.team2 = null
        }
        return full_match;
      });
    }
    else{
      full_group.matches = []
    }

    if(group.teams !== undefined){
      full_group.teams = group.teams.map((team_key) => {
        if (teams[team_key] !== undefined){
          let full_team = JSON.parse(JSON.stringify(teams[team_key]));
          full_team.points = group.points[team_key] || 0;
          return full_team;
        }
        return {name: '', icon: '', points: 0};
      });
    }
    else{
      full_group.teams = []
    }

    full_group.winners = {
      1: {key: -1},
      2: {key: -1}
    }
    if(groupWinnersProno[group.key] !== undefined){
      if(teams[groupWinnersProno[group.key][1]] !== undefined){
          full_group.winners[1] = JSON.parse(JSON.stringify(teams[groupWinnersProno[group.key][1]]));
      }
      if(teams[groupWinnersProno[group.key][2]] !== undefined){
          full_group.winners[2] = JSON.parse(JSON.stringify(teams[groupWinnersProno[group.key][2]]));
      }
    }

    return full_group;
  });

  return groups;
}


const getFullKnockoutStages = (knockoutstages, matches, teams, matchesProno) => {

  const stages = knockoutstages.map((stage) => {
    let full_stage = JSON.parse(JSON.stringify(stage));
    full_stage.matches = stage.matches.map((match_key) => {
      let full_match = JSON.parse(JSON.stringify(matches[match_key]));

      if(matchesProno[match_key] !== undefined && matchesProno[match_key].score1 !== undefined){
        full_match.score1 = matchesProno[match_key].score1;
      }
      else{
        full_match.score1 = -1;
      }
      if(matchesProno[match_key] !== undefined && matchesProno[match_key].score2 !== undefined){
        full_match.score2 = matchesProno[match_key].score2;
      }
      else{
        full_match.score2 = -1;
      }

      if(teams[full_match.team1] !== undefined){
        full_match.team1 = JSON.parse(JSON.stringify(teams[full_match.team1]));
      }
      else{
        full_match.team1 = null
      }
      if(teams[full_match.team2] !== undefined){
        full_match.team2 = JSON.parse(JSON.stringify(teams[full_match.team2]));
      }
      else{
        full_match.team2 = null
      }
      return full_match;
    })
    return full_stage;
  })
  return stages;

}


const getFullStageTeams = (teams, stageTeamsProno) => {
  const fullStageTeamsProno = JSON.parse(JSON.stringify(stageTeamsProno));

  Object.keys(stageTeamsProno).forEach(function(key) {
    if(stageTeamsProno[key].teams !== undefined){
      fullStageTeamsProno[key].teams = stageTeamsProno[key].teams.filter((team_key) => {
        return teams[team_key] !== undefined;
      }).map((team_key) => {
        return teams[team_key]
      });
    }
    else{
      fullStageTeamsProno[key].teams = []
    }
  });
  return fullStageTeamsProno;
}


function ViewProno(props) {
  const api = props.api;

  const user = useContext(UserContext);

  const prono = api.useProno();
  const teams = api.useTeams(prono);
  const matches = api.useMatches(prono);
  const groupstage = api.useGroupStage(prono);
  const knockoutstages = api.useKnockoutStage(prono);
  const deadlines = api.useDeadlines(prono, {});
  const currentStage = api.useCurrentStage(prono, 'finished');

  const pronoUser = props.user || user;

  const matchesProno = api.useUserPronoMatches(prono, pronoUser);
  const groupWinnersProno = api.useUserPronoGroupWinners(prono, pronoUser);
  const stageTeamsProno = api.useUserPronoStageTeams(prono, pronoUser);
  const totalGoalsProno = api.useUserPronoTotalGoals(prono, pronoUser);
  const teamResultProno = api.useUserPronoHomeTeamResult(prono, pronoUser);

  const groups = getFullGroupstage(groupstage, matches, teams, matchesProno, groupWinnersProno);
  const stages = getFullKnockoutStages(knockoutstages, matches, teams, matchesProno);
  const stageTeams = getFullStageTeams(teams, stageTeamsProno);

  const groupstageComplete = (groups) => {
    let complete = true;
    groups.forEach((group) => {
      group.matches.forEach((match) => {
        if(match.score1 < 0 || match.score2 < 0){
          complete = false;
          return false
        }
      });
      if(group.winners === undefined || group.winners[1] === undefined || group.winners[1].key === undefined || group.winners[1].key === -1){
        complete = false;
        return false
      }
      if(group.winners === undefined || group.winners[2] === undefined || group.winners[2].key === undefined || group.winners[2].key === -1){
        complete = false;
        return false
      }
    });
    return complete;
  }

  const stageTeamsComplete = (stageTeams) => {
    let complete = true;
    pronoStages.forEach((stage) => {
      if(stageTeams[stage.key] === undefined || stageTeams[stage.key].teams === undefined || stageTeams[stage.key].teams.length < parseInt(stage.key)){
        complete = false;
        return false;
      }
    });
    return complete;
  }

  const totalGoalsComplete = (totalGoalsProno) => {
    return totalGoalsProno !== undefined && totalGoalsProno >= 0;
  }

  const teamResultPronoComplete = (teamResultProno) => {
    return teamResultProno !== undefined && teamResultProno >= 0;
  }

  return (
    <div>
      <h2 style={{color: '#ffffff'}}>Groepsfase</h2>
      <DeadlineMessage deadline={deadlines['groupstage']} complete={groupstageComplete(groups)} active={currentStage === 'groupstage'}/>
      <GroupstageProno groups={groups} user={pronoUser} currentStage={currentStage}  api={api}/>

      <h2 style={{color: '#ffffff'}}>Teams in elke eliminatie fase</h2>
      <DeadlineMessage deadline={deadlines['groupstage']} complete={stageTeamsComplete(stageTeams)} active={currentStage === 'groupstage'}/>
      <KnockoutStageTeamsProno stageTeams={stageTeams} teams={teams} user={pronoUser} currentStage={currentStage} api={api} />

      <h2 style={{color: '#ffffff'}}>Extra punten</h2>
      <DeadlineMessage deadline={deadlines['groupstage']} complete={totalGoalsComplete(totalGoalsProno)} active={currentStage === 'groupstage'}/>
      <TotalGoalsProno goals={totalGoalsProno} user={pronoUser} currentStage={currentStage} api={api} />

      <DeadlineMessage deadline={deadlines['groupstage']} complete={teamResultPronoComplete(teamResultProno)} active={currentStage === 'groupstage'}/>
      <TeamResultProno stage={teamResultProno} user={pronoUser} team={{abbreviation: "BEL", icon: "images/flags/BE.png", name: "België"}} currentStage={currentStage} api={api} />

      <h2 style={{color: '#ffffff'}}>Knockout fase</h2>
      <KnockoutStageProno stages={stages} user={pronoUser} currentStage={currentStage} api={api} />

    </div>
  );

}

export default ViewProno;
