import React, { useState, useEffect, useContext } from 'react';


import APIContext from './APIProvider.js';
import { UserContext } from "./UserProvider.js";
import { GroupstageProno } from './GroupStage.js';
import { KnockoutStageProno } from './KnockoutStage.js';



const getFullGroupstage = (groupstage, matches, teams, matchesProno) => {

  const groups = groupstage.map((group) => {
    let full_group = JSON.parse(JSON.stringify(group));
    let full_matches = []
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
        let full_team = JSON.parse(JSON.stringify(teams[team_key]));
        full_team.points = group.points[team_key] || 0;
        return full_team;
      });
    }
    else{
      full_group.teams = []
    }
    return full_group;
  });

  return groups;
}


const getFullKnockoutStages = (knockoutstages, matches, teams, matchesProno) => {

  const stages = knockoutstages.map((stage) => {
    let full_stage = JSON.parse(JSON.stringify(stage));
    const full_matches = stage.matches.map((match_key) => {
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
    full_stage.matches = full_matches;
    return full_stage;
  })
  return stages;

}

function KnockoutStageTeamsProno(props) {
  const user = props.user;

  return (

  );
}


function ViewProno(props) {
  const user = useContext(UserContext);
  const api = useContext(APIContext);

  const [teams, setTeams] = useState({});
  const [matches, setMatches] = useState({});
  const [groupstage, setGroupstage] = useState([]);
  const [knockoutstages, setKnockoutstages] = useState([]);
  const [matchesProno, setMatchesProno] = useState({});
  const [pronoUser, setPronoUser] = useState(user);

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

  useEffect(() => {
    return api.onUserPronoMatchesChanged(user, val => {
      setMatchesProno(val);
      console.log('loaded prono matches', val)
    });
  }, [api, pronoUser]);


  const groups = getFullGroupstage(groupstage, matches, teams, matchesProno);
  console.log(groups)

  const stages = getFullKnockoutStages(knockoutstages, matches, teams, matchesProno);
  console.log(stages)

  return (
    <div>
      <h2 style={{color: '#ffffff'}}>Groepsfase</h2>
      <div style={{color: '#ffffff'}}>Je hebt nog 10 dagen voor dit deel</div>
      <GroupstageProno groups={groups} user={pronoUser}/>

      <h2 style={{color: '#ffffff'}}>Knockout fase</h2>
      <KnockoutStageProno stages={stages} user={pronoUser}/>

    </div>
  );

}

export default ViewProno;
