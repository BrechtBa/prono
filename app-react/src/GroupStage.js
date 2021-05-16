import React, { useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    group: {
      position: 'relative',
      width: '100%',
      maxWidth: '360px',
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


function Disabled(props) {
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


function TeamName(props) {
  const name = props.team.name;
  const abbreviation = props.team.abbreviation;
  const def = props.team.default;

  return (
    <div>{name}</div>
  )
}

function TeamIcon(props) {
  const src = props.team.icon;

  return (
    <img src={src} style={{width: '100%'}}/>
  )
}

function Match(props) {
  const match = props.match;
  const collapsed = false;

  const formatScore = (score) => {
    if(score >= 0){
      return score

    }
    else{
      return ''
    }
  }

  const showPenalty = (penalty1, penalty2, collapsed) => {
    return (!collapsed && penalty1 > -1 && penalty2 >-1);
  }

  const openEditScoreDialog = () => {

  }

  const classes = useStyles();

  return (
    <div className={classes.matchHorizontal} onClick={openEditScoreDialog}>
      <div className={classes.team1}>
        <TeamName team={match.team1}/>
      </div>
      <div className={classes.teamIcon}>
          <TeamIcon team={match.team1} />
      </div>
      <div className={classes.score}>
        <div className={classes.scoreRegular}>{formatScore(match.score1)} - {formatScore(match.score2)}</div>

        {showPenalty(match.penalty1, match.penalty2, collapsed) &&
          <div className={classes.scorePenalty}>{formatScore(match.score1)} - {formatScore(match.score2)}</div>
        }
      </div>
      <div className={classes.teamIcon}>
          <TeamIcon team={match.team2} />
      </div>
      <div className={classes.team2}>
          <TeamName team={match.team2} />
      </div>
    </div>
  )
}

function GroupStage(props) {

  const groups = props.groups;

  const classes = useStyles();

  return (
    <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
      {groups.map((group) => (
        <Paper key={group.key} className={classes.group}>
          <h3 style={{marginTop: 0}}>Groep {group.name}</h3>
          <div>
            {group.matches.map((match) => (
             <Match key={match.key} match={match}/>
            ))}
          </div>
          <Disabled disabled={false}/>
        </Paper>
      ))}

    </div>
  );

}

export default GroupStage;
