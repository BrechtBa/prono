import React, { useState, useEffect, useContext } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import APIContext from './APIProvider.js';
import PronoContext from './PronoProvider.js';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    stage: {
    },
    group: {
    },
    match: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    },
    matchNumber: {
      display: 'flex',
      flexGrow: 2,
    },
    matchStage: {
      display: 'flex',
      flexGrow: 4,
    },
    matchDate: {
      display: 'flex',
      flexGrow: 4,
    },
    matchTeam: {
      display: 'flex',
      flexGrow: 4,
      justifyContent: 'flex-start',
      width: '90px',
      textAlign: 'left',
      overflow: 'hidden'
    }
  })
);



function Match(props) {
  const match = props.match;
  const date = new Date(match.date);
  const updateMatch = props.updateMatch

  const formatDate = (date) => {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    hours = hours < 10 ? '0'+hours : hours;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes;
    return (date.getMonth()+1) + "-" + date.getDate() + "-" + date.getFullYear() + "  " + strTime;
  }

  const classes = useStyles();

  return (
    <div style={{height: '100%'}}>
      <div className={classes.match}>
        <div className={classes.matchNumber}>
          <TextField style={{width: '80px', marginLeft: '10px', marginRight: '10px'}} inputProps={{min: 0, style: {textAlign: 'center'}}}
           value={match.number} onChange={(event) => updateMatch(match, {number: event.target.value})}/>
        </div>

        <div className={classes.matchDate}>{formatDate(date)}</div>

        <div className={classes.team}>
          <TextField style={{width: '80px', marginLeft: '10px', marginRight: '10px'}} inputProps={{min: 0, style: {textAlign: 'center'}}}
           value={match.defaultteam1} onChange={(event) => updateMatch(match, {defaultteam1: event.target.value})}/>
        </div>
        <div className={classes.matchTeam}>
          <TextField style={{width: '80px', marginLeft: '10px', marginRight: '10px'}} inputProps={{min: 0, style: {textAlign: 'center'}}}
           value={match.defaultteam2} onChange={(event) => updateMatch(match, {defaultteam2: event.target.value})}/>
        </div>

      </div>
    </div>

  )
}

function Group(props) {
  const group = props.group;
  const matches = props.matches;
  const updateMatch = props.updateMatch;

  const classes = useStyles();
  const groupMatches = []
  group.matches.forEach((key) => {
    const match = matches[key];
    if(match !== undefined){
      groupMatches.push(match);
    }
  })
  console.log(groupMatches)

  return (
    <div style={{height: '100%'}}>
      <div className={classes.group}>
        <h4 style={{color: '#ffffff'}}>Group {group.name}</h4>

        {groupMatches.map((match) => (
          <Paper style={{padding: '5px', height: '50px', marginBottom: '5px', overflowX: 'hidden'}}>
            <Match key={match.key} match={match} updateMatch={updateMatch}/>
          </Paper>
        ))}

      </div>
    </div>
  )

}


function ViewMatches(props) {

  const api = useContext(APIContext);
  const prono = useContext(PronoContext);

  const [groupStageGroups, setGroupStageGroups] = useState([]);
  const [knockoutStages, setKnockoutStages] = useState([]);

  const [matches, setMatches] = useState({});

  const updateMatch = (match, update) => {
    console.log(match, update)
    api.updateMatch(prono, match, update)
  }


  useEffect(() => {
    api.onGroupstageChanged(prono, groups => {
      setGroupStageGroups(groups);
    });
  }, [api, prono]);

  useEffect(() => {
    api.onMatchesChanged(prono, matches => {
      setMatches(matches);
    });
  }, [api, prono]);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <h2 style={{color: '#ffffff'}}>Matches</h2>
      <h3 style={{color: '#ffffff'}}>Groupstage</h3>
      <div>
        {groupStageGroups.map((group) => (
          <Group group={group} matches={matches} updateMatch={updateMatch} />
        ))}
      </div>
    </div>
  );

}

export default ViewMatches;
