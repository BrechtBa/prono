import React, { useState, useEffect, useContext } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import APIContext from './APIProvider.js';
import GroupStage from './GroupStage.js';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
  })
);


function ViewResults(props) {

  const testgroups = [{
    key: 'A',
    title: 'A',
    matches: [{
      key: 1,
      team1: {name: 'Belgie', abbreviation: 'BEL', icon: 'images/flags/BE.png'},
      team2: {name: 'Rusland', abbreviation: 'RUS', icon: 'images/flags/BE.png'},
      score1: 5,
      score2: 1,
    }, {
      key: 2,
      team1: {name: 'Noord-Macedonië', abbreviation: 'BEL', icon: 'images/flags/BH.png'},
      team2: {name: 'Zwitserland', abbreviation: 'RUS', icon: 'images/flags/CH.png'},
      score1: -1,
      score2: -1,
    }]
  }, {
    key: 'B',
    title: 'B',
    matches: [{
      key: 3,
      team1: {name: 'Denemarken', abbreviation: 'BEL', icon: 'images/flags/DE.png'},
      team2: {name: 'Rusland', abbreviation: 'RUS', icon: 'images/flags/RU.png'},
      score1: -1,
      score2: -1,
    }, {
      key: 4,
      team1: {name: 'Belgie', abbreviation: 'BEL', icon: 'images/flags/BE.png'},
      team2: {name: 'Wales', abbreviation: 'RUS', icon: 'images/flags/_wales.png'},
      score1: -1,
      score2: -1,
    }]
  }]


  const api = useContext(APIContext);
  const [teams, setTeams] = useState({});
  const [matches, setMatches] = useState({});
  const [groupstage, setGroupstage] = useState([]);

  useEffect(() => {
    return api.onTeamsChanged(val => {
      setTeams(val);
      console.log('loaded teams', val)
    });
  }, []);

  useEffect(() => {
    return api.onMatchesChanged(val => {
      setMatches(val);
      console.log('loaded matches', val)
    });
  }, []);

  useEffect(() => {
    return api.onGroupstageChanged(val => {
      setGroupstage(val);
      console.log('loaded groupstage', val)
    });
  }, []);


  let groups = []
  groupstage.forEach((group) => {
    let full_group = JSON.parse(JSON.stringify(group));
    let full_matches = []
    if(group.matches !== undefined){
      group.matches.forEach((match_key) => {
        let full_match = JSON.parse(JSON.stringify(matches[match_key]));
        full_match.team1 = JSON.parse(JSON.stringify(teams[full_match.team1]));
        full_match.team2 = JSON.parse(JSON.stringify(teams[full_match.team2]));
        full_matches.push(full_match);
      });
    }
    full_group.matches = full_matches;
    let full_teams = [];
    if(group.teams !== undefined){
      group.teams.forEach((team_key) => {
        full_teams.push(JSON.parse(JSON.stringify(teams[team_key])));
      });
    }
    full_group.teams = full_teams;

    groups.push(full_group);
  });

  console.log(groups)

  return (
    <div>
      <h2 style={{color: '#ffffff'}}>Groepsfase</h2>
      <GroupStage groups={groups}/>

      <h2 style={{color: '#ffffff'}}>Knockout fase</h2>

    </div>
  );

}

export default ViewResults;
