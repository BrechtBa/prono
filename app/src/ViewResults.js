import React, { useContext } from 'react';

import { PronoContext } from './PronoProvider.js';
import { UserContext } from "./UserProvider.js";
import { GroupStage } from './GroupStage.js';
import { KnockoutStage } from './KnockoutStage.js';



const getFullGroupstage = (groupstage, matches, teams) => {

  let groups = []
  groupstage.forEach((group) => {
    let full_group = JSON.parse(JSON.stringify(group));
    let full_matches = []
    if(group.matches !== undefined){
      group.matches.forEach((match_key) => {
        let full_match = JSON.parse(JSON.stringify(matches[match_key]));
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
        full_matches.push(full_match);
      });
    }
    full_group.matches = full_matches;
    let full_teams = [];
    if(group.teams !== undefined){
      group.teams.forEach((team_key) => {
        if (teams[team_key] !== undefined){
          let full_team = JSON.parse(JSON.stringify(teams[team_key]));
          full_team.points = group.points[team_key] || 0;
          full_teams.push(full_team);
        }
      });
    }
    full_group.teams = full_teams;

    groups.push(full_group);
  });

  return groups;
}


const getFullKnockoutStages = (knockoutstages, matches, teams) => {

  const stages = knockoutstages.map((stage) => {
    let full_stage = JSON.parse(JSON.stringify(stage));
    const full_matches = stage.matches.map((match_key) => {
      let full_match = JSON.parse(JSON.stringify(matches[match_key]));
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
    full_stage.matches = full_matches;
    return full_stage;
  })
  return stages;

}


function ViewResults(props) {

  const api = props.api;
  const user = useContext(UserContext);
  const prono = useContext(PronoContext);

  const teams = api.useTeams(prono);
  const matches = api.useMatches(prono);
  const groupstage = api.useGroupStage(prono);
  const knockoutstages = api.useKnockoutStage(prono);

  const groups = getFullGroupstage(groupstage, matches, teams);
  console.log(groups)

  const stages = getFullKnockoutStages(knockoutstages, matches, teams);
  console.log(stages)

  return (
    <div>
      <h2 style={{color: '#ffffff'}}>Groepsfase</h2>
      <GroupStage groups={groups} editable={user.permissions.editor || false} api={api}/>

      <h2 style={{color: '#ffffff'}}>Knockout fase</h2>
      <KnockoutStage stages={stages} editable={user.permissions.editor || false} teams={user.permissions.editor ? Object.keys(teams).map(key => teams[key]) : [] } api={api}/>

    </div>
  );

}

export default ViewResults;
