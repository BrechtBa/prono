import React, { useState, useEffect, useContext } from 'react';


import APIContext from './APIProvider.js';
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
        let full_team = JSON.parse(JSON.stringify(teams[team_key]));
        full_team.points = group.points[team_key] || 0;
        full_teams.push(full_team);
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

  const api = useContext(APIContext);
  const [teams, setTeams] = useState({});
  const [matches, setMatches] = useState({});
  const [groupstage, setGroupstage] = useState([]);
  const [knockoutstages, setKnockoutstages] = useState([]);

  useEffect(() => {
    return api.onTeamsChanged(val => {
      setTeams(val);
      console.log('loaded teams', val)
    });
  }, [api]);

  useEffect(() => {
    return api.onMatchesChanged(val => {
      setMatches(val);
      console.log('loaded matches', val)
    });
  }, [api]);

  useEffect(() => {
    return api.onGroupstageChanged(val => {
      setGroupstage(val);
      console.log('loaded groupstage', val)
    });
  }, [api]);

  useEffect(() => {
    return api.onKnockoutstageChanged(val => {
      setKnockoutstages(val);
      console.log('loaded knockoutstages', val)
    });
  }, [api]);


  const groups = getFullGroupstage(groupstage, matches, teams);
  console.log(groups)

  const stages = getFullKnockoutStages(knockoutstages, matches, teams);
  console.log(stages)

  return (
    <div>
      <h2 style={{color: '#ffffff'}}>Groepsfase</h2>
      <GroupStage groups={groups}/>

      <h2 style={{color: '#ffffff'}}>Knockout fase</h2>
      <KnockoutStage stages={stages}/>

    </div>
  );

}

export default ViewResults;
