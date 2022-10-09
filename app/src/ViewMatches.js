import React, { useState, useEffect, useContext } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';

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
  const updateMatch = props.updateMatch;
  const deleteMatch = props.deleteMatch;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const formatDate = (date) => {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    hours = hours < 10 ? '0'+hours : hours;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes;
    return date.getDate() + "-" + (date.getMonth()+1) + "-" + date.getFullYear() + "  " + strTime;
  }

  const parseDate = (strDateTime) => {
    const [strDate, strTime] = strDateTime.split('  ');
    const [day, month, year] = strDate.split('-');
    const [hour, minute] = strTime.split(':');

    const date = new Date(+year, +month - 1, +day, +hour, +minute);
    return date;
  }

  const classes = useStyles();

  return (
    <div style={{height: '100%'}}>
      <div className={classes.match}>
        <div className={classes.matchNumber}>
          <TextField style={{width: '80px', marginLeft: '10px', marginRight: '10px'}} inputProps={{min: 0, style: {textAlign: 'center'}}}
           value={match.number} onChange={(event) => updateMatch(match, {number: event.target.value})}/>
        </div>

        <div className={classes.matchDate}>
          <TextField style={{width: '200px', marginLeft: '10px', marginRight: '10px'}} inputProps={{min: 0, style: {textAlign: 'center'}}}
           value={formatDate(date)} onChange={(event) => updateMatch(match, {date: parseDate(event.target.value).getTime()})}/>
        </div>

        <div className={classes.team}>
          <TextField style={{width: '100px', marginLeft: '10px', marginRight: '10px'}} inputProps={{min: 0, style: {textAlign: 'center'}}}
           value={match.defaultteam1} onChange={(event) => updateMatch(match, {defaultteam1: event.target.value})}/>
        </div>
        <div className={classes.matchTeam}>
          <TextField style={{width: '100px', marginLeft: '10px', marginRight: '10px'}} inputProps={{min: 0, style: {textAlign: 'center'}}}
           value={match.defaultteam2} onChange={(event) => updateMatch(match, {defaultteam2: event.target.value})}/>
        </div>

        <div>
          <Button onClick={() => setDeleteDialogOpen(true)}>Delete</Button>
        </div>
      </div>

      <Dialog onClose={() => setDeleteDialogOpen(false)} open={deleteDialogOpen}>
        <div style={{margin: "20px"}}>
          <div>Do you really want to delete match {match.number}?</div>
          <div style={{marginTop: "10px"}}>
            <Button onClick={() => deleteMatch(match)}>Delete</Button>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Dialog>

    </div>
  )
}


function ViewMatches(props) {

  const api = useContext(APIContext);
  const prono = useContext(PronoContext);

  const [matches, setMatches] = useState([]);

  const updateMatch = (match, update) => {
    api.updateMatch(prono, match, update);
  }

  const deleteMatch = (match) => {
    api.deleteMatch(prono, match);
  }

  const addMatch = () => {
    const date = new Date()
    const match = {
      date: date.getTime(),
      defaultteam1: "T1",
      defaultteam2: "T2",
      number: matches.length + 1,
      penalty1: -1,
      penalty2: -1,
      score1: -1,
      score2: -1,
      team1: -1,
      team2: -1
    }
    api.addMatch(prono, match);
  }

  useEffect(() => {
    api.onMatchesChanged(prono, matches => {
      setMatches(Object.entries(matches).map(val => val[1]));
    });
  }, [api, prono]);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <h2 style={{color: '#ffffff'}}>Matches</h2>
      <div>
        {matches.map((match) => (
           <Paper key={match.key} style={{padding: '5px', height: '50px', marginBottom: '5px', overflowX: 'hidden'}}>
            <Match match={match} updateMatch={updateMatch} deleteMatch={deleteMatch}/>
          </Paper>
        ))}
        <Button variant="contained" onClick={() => addMatch()}>Add match</Button>
      </div>
    </div>
  );

}

export default ViewMatches;
