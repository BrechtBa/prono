import React, { useState, useContext } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import APIContext from './APIProvider.js';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    group: {
      position: 'relative',
      width: '100%',
      maxWidth: '400px',
      padding: '10px',
      margin: '5px'
    },
    matchHorizontal: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    },
    matchVertical: {
      display: 'flex',
      flexDirection: 'col',
      justifyContent: 'center'
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
    scoreRegular: {
    },
    scorePenalty: {
    }

  })
);


export function Disabled(props) {
  const disabled = props.disabled;

  if(disabled){
    return (
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(1,1,1,0.3)', borderRadius: 'inherit'}}>
      </div>
    )
  }
  else{
    return ''
  }
}


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
      <img src={team.icon} style={{width: '100%'}}/>
    )
  }
  else{
    return (
      <div></div>
    )
  }
}


export function EditScoreDialog(props){
  const match = props.match;
  const showPenaltyEdit = props.showPenaltyEdit;
  const open = props.open;
  const setOpen = props.setOpen;
  const onSave = props.onSave;

  const [score1, setScore1] = useState(match.score1 >= 0 ? match.score1  : '')
  const [score2, setScore2] = useState(match.score2 >= 0 ? match.score2  : '')
  const [penalty1, setPenalty1] = useState(match.penalty1 >= 0 ? match.penalty1  : '')
  const [penalty2, setPenalty2] = useState(match.penalty2 >= 0 ? match.penalty2  : '')

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
    onSave(match, deformatScore(score1), deformatScore(score2), deformatScore(penalty1), deformatScore(penalty2))
    setOpen(false)
  }

  const classes = useStyles();

  return (
    <Dialog onClose={() => setOpen(false)} open={open}>
      <form>
        <div style={{display: 'flex', flexDirection: 'column', padding: '20px'}}>
          <div className={classes.matchHorizontal} style={{marginBottom: '10px'}}>
            <div className={classes.team1}>
              <TeamName team={match.team1} def={match.defaultteam1} />
            </div>
             -
            <div className={classes.team2}>
              <TeamName team={match.team2} def={match.defaultteam2} />
            </div>
          </div>
          <div className={classes.matchHorizontal} style={{marginBottom: '10px'}}>
            <div className={classes.teamIcon}>
              <TeamIcon team={match.team1}/>
            </div>
            <div style={{width: '100px', display: 'flex', flexGrow: 2, justifyContent: 'center', alignItems: 'center'}}>
              <TextField style={{width: '80px', marginLeft: '10px', marginRight: '10px'}} inputProps={{min: 0, style: {textAlign: 'center'}}} value={score1} onChange={(event) => setScore1(event.currentTarget.value)} error={!validateScore(score1)}/>
               -
              <TextField style={{width: '80px', marginLeft: '10px', marginRight: '10px'}} inputProps={{min: 0, style: {textAlign: 'center'}}} value={score2} onChange={(event) => setScore2(event.currentTarget.value)} error={!validateScore(score1)}/>
            </div>
            <div className={classes.teamIcon}>
              <TeamIcon team={match.team2} />
            </div>
          </div>

          {showPenaltyEdit && (
            <div className={classes.matchHorizontal} style={{marginBottom: '10px'}}>
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
