import React, { useState, useContext } from 'react';

import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';

import { PronoContext } from './PronoProvider.js';
import { TeamSelect } from './MatchUtils.js';

const styles = {
  match: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: "10px"
  },
  matchNumber: {
    display: 'flex',
    flexGrow: 2,
    marginTop: "0.5em",
  },
  matchDate: {
    display: 'flex',
    flexGrow: 4,
    marginTop: "0.5em",
  },
  matchTeam: {
    display: 'flex',
    flexGrow: 4,
    justifyContent: 'flex-start',
    width: '90px',
    textAlign: 'left',
    marginTop: "0.5em",
  }
}



function Match(props) {
  const match = props.match;
  const teams = props.teams;
  const date = new Date(match.date);
  const updateMatch = props.updateMatch;
  const deleteMatch = props.deleteMatch;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const formatDate = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    hours = hours < 10 ? '0'+hours : hours;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    let strTime = hours + ':' + minutes;
    return date.getDate() + "-" + (date.getMonth()+1) + "-" + date.getFullYear() + "  " + strTime;
  }

  const parseDate = (strDateTime) => {
    const [strDate, strTime] = strDateTime.split('  ');
    const [day, month, year] = strDate.split('-');
    const [hour, minute] = strTime.split(':');

    const date = new Date(+year, +month - 1, +day, +hour, +minute);
    return date;
  }

  return (
    <div style={{height: '100%'}}>
      <div style={styles.match}>
        <div style={styles.matchNumber}>
          <TextField style={{width: '80px'}} inputProps={{min: 0, style: {textAlign: 'center'}}}
           value={match.number} onChange={(event) => updateMatch(match, {number: event.target.value})} label="Number"/>
        </div>

        <div style={styles.matchDate}>
          <TextField style={{width: '200px'}} inputProps={{min: 0, style: {textAlign: 'center'}}}
           value={formatDate(date)} onChange={(event) => updateMatch(match, {date: parseDate(event.target.value).getTime()})} label="Date"/>
        </div>

        <div style={styles.matchTeam}>
          <TextField style={{width: '100px'}} inputProps={{min: 0, style: {textAlign: 'center'}}}
           value={match.defaultTeam1} onChange={(event) => updateMatch(match, {defaultTeam1: event.target.value})} label="Default Team 1"/>
        </div>
        <div style={styles.matchTeam}>
          <TextField style={{width: '100px'}} inputProps={{min: 0, style: {textAlign: 'center'}}}
           value={match.defaultTeam2} onChange={(event) => updateMatch(match, {defaultTeam2: event.target.value})} label="Default Team 2"/>
        </div>

        <div style={styles.matchTeam}>
          <TeamSelect label="Team 1" selected={{key: match.team1}} teams={teams} onChange={(t) =>  updateMatch(match, {team1: t.key})}/>
        </div>

        <div style={styles.matchTeam}>
          <TeamSelect label="Team 2" selected={{key: match.team2}} teams={teams} onChange={(t) =>  updateMatch(match, {team2: t.key})}/>
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

  const api = props.api;
  const prono = useContext(PronoContext);

  const teams = api.useTeams(prono);
  const matchesObject = api.useMatches(prono);
  const matches = Object.entries(matchesObject).map(val => val[1])

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
      defaultTeam1: "T1",
      defaultTeam2: "T2",
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

  return (
    <div>
      <h2 style={{color: '#ffffff'}}>Matches</h2>
      <div>
        {matches.map((match) => (
           <Paper key={match.key} style={{padding: '5px', marginBottom: '5px', overflowX: 'hidden'}}>
            <Match match={match} updateMatch={updateMatch} deleteMatch={deleteMatch} teams={Object.keys(teams).map(key => teams[key])}/>
          </Paper>
        ))}
        <Button variant="contained" onClick={() => addMatch()}>Add match</Button>
      </div>
    </div>
  );

}

export default ViewMatches;
