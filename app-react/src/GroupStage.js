import React, { useState, useContext } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import APIContext from './APIProvider.js';
import UserContext from './UserProvider.js';
import { Disabled, TeamName, TeamIcon, EditScoreDialog } from './MatchUtils.js';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    group: {
      position: 'relative',
      width: '100%',
      maxWidth: '400px',
      padding: '10px',
      margin: '5px'
    },
    match: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
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


export function Match(props) {
  const match = props.match;
  const collapsed = props.collapsed;
  const onSave = props.onSave

  const [editScoreDialogOpen, setEditScoreDialogOpen] = useState(false)

  const formatScore = (score) => {
    if(score >= 0){
      return score
    }
    else{
      return ''
    }
  }

  const classes = useStyles();

  return (
    <div>
      <div className={classes.match} onClick={() => setEditScoreDialogOpen(true)}>
        <div className={classes.team1}>
          <TeamName team={match.team1} def={match.defaultteam1} />
        </div>
        <div className={classes.teamIcon}>
            <TeamIcon team={match.team1} />
        </div>
        <div className={classes.score}>
          <div className={classes.scoreRegular}>{formatScore(match.score1)} - {formatScore(match.score2)}</div>
        </div>
        <div className={classes.teamIcon}>
            <TeamIcon team={match.team2} />
        </div>
        <div className={classes.team2}>
            <TeamName team={match.team2} def={match.defaultteam2} />
        </div>
      </div>

      <EditScoreDialog match={match} open={editScoreDialogOpen} setOpen={setEditScoreDialogOpen} onSave={onSave} showPenaltyEdit={false}/>
    </div>
  )
}


export function GroupStage(props) {
  const groups = props.groups;

  const api = useContext(APIContext);

  const saveMatch = (match, score1, score2, penalty1, penalty2) => {
    api.updateMatch(match.key, {score1: score1, score2: score2, penalty1: penalty1, penalty2: penalty2})
  }

  const classes = useStyles();

  return (
    <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
      {groups.map((group) => (
        <Paper key={group.key} className={classes.group}>
          <h3 style={{marginTop: 0}}>Groep {group.name}</h3>

          <div>
            {group.matches.map((match) => (
             <Match key={match.key} match={match} onSave={saveMatch}/>
            ))}
          </div>

          <div style={{marginTop: '10px'}}>
            {group.teams.map((team) => (
              <div key={team.key} style={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%'}}>
                <div className={classes.teamIcon}>
                  <TeamIcon team={team} />
                </div>
                <div className={classes.team1} style={{marginLeft: '15px'}}>
                  <TeamName className={classes.TeamName} team={team}/>
                </div>
                <div style={{width: '50px'}}>{Math.floor(team.points)}</div>
              </div>
            ))}
          </div>

          <Disabled disabled={false}/>
        </Paper>
      ))}

    </div>
  );
};


export function GroupstageProno(props) {
  const groups = props.groups;

  const api = useContext(APIContext);
  const user = useContext(UserContext);

  const saveMatch = (match, score1, score2, penalty1, penalty2) => {
    //api.updateMatchProno(user.key match.key, {score1: score1, score2: score2})
  }

  const classes = useStyles();

  return (
    <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
      {groups.map((group) => (
        <Paper key={group.key} className={classes.group}>
          <h3 style={{marginTop: 0}}>Groep {group.name}</h3>

          <div>
            {group.matches.map((match) => (
             <Match key={match.key} match={match} onSave={saveMatch} showPenaltyEdit={false}/>
            ))}
          </div>

          <Disabled disabled={false}/>
        </Paper>
      ))}

    </div>
  );
};

