import React, { useState, useEffect } from 'react';

import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';


export function TeamName(props) {
  const team = props.team;
  const def = props.def;

  if (team !== null){
    return (
      <div>{team.name}</div>
    )
  }
  else{
    return (
      <div>{def}</div>
    )
  }


}

export function TeamIcon(props) {
  const team = props.team;

  if (team !== null){
    return (
      <img src={team.icon_url} style={{width: '100%'}} alt={team.name}/>
    )
  }
  else{
    return (
      <div></div>
    )
  }
}


export function TeamSelect(props){
  const label = props.label;
  const teams = props.teams;
  const selected = props.selected;
  const onSelect = props.onChange

  const handleChange = (e) => {
    const key = e.target.value;
    if (key !== -1){
      const teamsKeys = teams.map((team) => team.key)
      const ind = teamsKeys.indexOf(key)
      if(ind >= 0){
        onSelect(teams[ind]);
      }
      else{
        onSelect({key: -1})
      }
    }
    else{
      onSelect({key: -1})
    }
  }

  const styles = {
    teamIcon: {
      maxWidth: '30px', 
      maxHeight: '30px'
    }
  }

  return (
    <div style={{width: '100%', marginBottom: '20px'}}>
      <InputLabel id="select-label">{label}</InputLabel>
      <Select value={selected.key} onChange={handleChange} labelId="select-label" style={{width: '100%'}}>
        <MenuItem value={-1}></MenuItem>

        {teams.map((team) => (
          <MenuItem key={team.key} value={team.key}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <div style={styles.teamIcon}>
                <TeamIcon team={team}/>
              </div>
              <div style={{marginLeft: '20px'}}>
                <TeamName team={team} def=""/>
              </div>
            </div>
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}


export function MatchSelect(props){
  const label = props.label;
  const matches = props.matches;
  const selected = props.selected;
  const onSelect = props.onChange

  const handleChange = (e) => {
    const key = e.target.value;
    if (key !== -1){
      const matchesKeys = matches.map((match) => match.key)
      const ind = matchesKeys.indexOf(key)
      if(ind >= 0){
        onSelect(matches[ind]);
      }
      else{
        onSelect({key: -1})
      }
    }
    else{
      onSelect({key: -1})
    }
  }

  return (
    <div style={{width: '100%', marginBottom: '20px'}}>
      <InputLabel id="select-label">{label}</InputLabel>
      <Select value={selected.key} onChange={handleChange} labelId="select-label" style={{width: '100%'}}>
        <MenuItem value={-1}></MenuItem>

        {matches.map((match) => (
          <MenuItem key={match.key} value={match.key}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <div style={{marginLeft: '20px'}}>
                {match.number}
              </div>
              <div style={{marginLeft: '20px'}}>
                {match.defaultteam1} - {match.defaultteam2}
              </div>
            </div>
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}

export function EditScoreDialog(props){
  const match = props.match;
  const editPenalties = props.editPenalties;
  const editTeams = props.editTeams;
  const teams = props.teams;

  const open = props.open;
  const setOpen = props.setOpen;
  const onSave = props.onSave;

  const [score1, setScore1] = useState(match.score1 >= 0 ? match.score1  : '')
  const [score2, setScore2] = useState(match.score2 >= 0 ? match.score2  : '')
  const [penalty1, setPenalty1] = useState(match.penalty1 >= 0 ? match.penalty1  : '')
  const [penalty2, setPenalty2] = useState(match.penalty2 >= 0 ? match.penalty2  : '')
  const [team1, setTeam1] = useState({key: -1})
  const [team2, setTeam2] = useState({key: -1})

  useEffect(() => {
    setTeam1(JSON.parse(JSON.stringify(match.team1 || {key: -1})));
    setTeam2(JSON.parse(JSON.stringify(match.team2 || {key: -1})));
  }, [match]);

  const deformatScore = (score) => {
    var scoreInt = parseInt(score);
    if(isNaN(scoreInt)){
      scoreInt = -1;
    }
    return scoreInt;
  }

  const validateScore = (score) => {
    return (score === '') || (parseInt(score) >= 0);
  }

  const handleSave = () => {
    onSave(match, deformatScore(score1), deformatScore(score2), deformatScore(penalty1), deformatScore(penalty2), team1.key, team2.key)
    setOpen(false)
  }

  const styles = {
    matchHorizontal: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: '10px'
    },
    team1: {
      display: 'flex',
      flexGrow: 4,
      justifyContent: 'flex-start',
      width: '110px',
      textAlign: 'left',
    },
    team2: {
      display: 'flex',
      flexGrow: 4,
      justifyContent: 'flex-end',
      width: '110px',
      textAlign: 'right'
    },
    teamIcon: {
      maxWidth: '30px', maxHeight: '30px'
    },
    score: {
      width: '60px',
      display:'flex',
      flexDirection: 'row',
      justifyContent: 'center'
    },

  }
  return (
    <Dialog onClose={() => setOpen(false)} open={open}>
      <form>
        <div style={{display: 'flex', flexDirection: 'column', padding: '20px'}}>
          {!editTeams && (
            <div style={styles.matchHorizontal}>
              <div style={styles.team1}>
                <TeamName team={team1} def={match.defaultteam1} />
              </div>

               -
              <div style={styles.team2}>
                <TeamName team={team2} def={match.defaultteam2} />
              </div>
            </div>
          )}
          {editTeams && (
            <div style={styles.matchHorizontal}>
              <div style={styles.team1}>
                <TeamSelect label="Team 1" selected={team1} teams={teams} onChange={(t) => setTeam1(t)}/>
              </div>

               -
              <div style={styles.team2}>
                <TeamSelect  label="Team 2" selected={team2} teams={teams} onChange={(t) => setTeam2(t)}/>
              </div>
            </div>
          )}
          <div style={styles.matchHorizontal}>
            <div style={styles.teamIcon}>
              <TeamIcon team={team1}/>
            </div>
            <div style={{styles: '100px', display: 'flex', flexGrow: 2, justifyContent: 'center', alignItems: 'center'}}>
              <TextField style={{width: '80px', marginLeft: '10px', marginRight: '10px'}} inputProps={{min: 0, style: {textAlign: 'center'}}} value={score1} onChange={(event) => setScore1(event.currentTarget.value)} error={!validateScore(score1)}/>
               -
              <TextField style={{width: '80px', marginLeft: '10px', marginRight: '10px'}} inputProps={{min: 0, style: {textAlign: 'center'}}} value={score2} onChange={(event) => setScore2(event.currentTarget.value)} error={!validateScore(score1)}/>
            </div>
            <div style={styles.teamIcon}>
              <TeamIcon team={team2} />
            </div>
          </div>

          {editPenalties && (
            <div style={styles.matchHorizontal}>
              <div style={{width: '100px', display: 'flex', flexGrow: 2, justifyContent: 'center', alignItems: 'center'}}>
                (<TextField style={{width: '80px'}} inputProps={{min: 0, style: { textAlign: 'center' }}} value={penalty1} onChange={(event) => setPenalty1(event.currentTarget.value)} error={!validateScore(penalty1)}/>)
                 -
                (<TextField style={{width: '80px'}} inputProps={{min: 0, style: { textAlign: 'center' }}} value={penalty2} onChange={(event) => setPenalty2(event.currentTarget.value)} error={!validateScore(penalty2)}/>)
              </div>
            </div>
          )}

          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: '20px'}}>
            <Button onClick={() => handleSave()}>save</Button>
            <Button onClick={() => setOpen(false)}>cancel</Button>
          </div>

        </div>

      </form>
    </Dialog>
  )
}
