import React, { useState, useContext } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';

import APIContext from './APIProvider.js';
import { PronoContext } from './PronoProvider.js';

import { TeamName, TeamIcon, EditScoreDialog, Disabled } from './MatchUtils.js';


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
      flexDirection: 'column',
      alignItems: 'center',
      height: '100%',
    },
    team1: {
      width: '5px',
      display: 'flex',
      justifyContent: 'center',
    },
    team2: {
      width: '5px',
      display: 'flex',
      justifyContent: 'center',
    },
    teamIcon: {
      maxWidth: '30px', maxHeight: '30px'
    },
    score: {
      width: '5px',
      display:'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      flexGrow: 4,
    },
    scoreRegular: {
      width: '40px',
      textAlign: 'center'
    },
    scorePenalty: {
      fontSize: '0.8em',
      width: '40px',
      textAlign: 'center'
    }
  })
);


function Match(props) {
  const match = props.match;
  const editPenalties = props.showPenaltyEdit;
  const collapsed = props.collapsed;
  const onSave = props.onSave
  const editable = props.editable;
  const editTeams = props.editTeams;
  const teams = props.teams;

  const [editScoreDialogOpen, setEditScoreDialogOpen] = useState(false)

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

  const classes = useStyles();

  return (
    <div style={{height: '100%'}}>
      <div className={classes.match} onClick={() => editable && setEditScoreDialogOpen(true)}>
        <div className={classes.team1}>
          <TeamName team={match.team1} def={match.defaultteam1} />
        </div>
        <div className={classes.teamIcon}>
            <TeamIcon team={match.team1} />
        </div>
        <div className={classes.score}>
          <div className={classes.scoreRegular}>{formatScore(match.score1)} - {formatScore(match.score2)}</div>

          {showPenalty(match.penalty1, match.penalty2, collapsed) &&
            <div className={classes.scorePenalty}>({formatScore(match.penalty1)} - {formatScore(match.penalty2)})</div>
          }
        </div>
        <div className={classes.teamIcon}>
            <TeamIcon team={match.team2} />
        </div>
        <div className={classes.team2}>
            <TeamName team={match.team2} def={match.defaultteam2} />
        </div>
      </div>

      <EditScoreDialog match={match} open={editScoreDialogOpen} setOpen={setEditScoreDialogOpen} onSave={onSave} editPenalties={editPenalties}
        editTeams={editTeams} teams={teams}/>
    </div>
  )


}


const getMatchColumns = (knockoutstages) => {
  if(knockoutstages.length > 0) {
    const finalStage = knockoutstages[knockoutstages.length-1]
    const otherStages = knockoutstages.slice(0, knockoutstages.length-1)

    const matchColumnsLeft = otherStages.map((stage) => {
      return {
        key: `L${stage.key}`,
        stage: stage.key,
        matches: stage.matches.slice(0, stage.matches.length/2)
      }
    });
    matchColumnsLeft.push({
      key: 'F',
      stage: finalStage.key,
      matches: finalStage.matches
    })

    const matchColumnsRight = otherStages.reverse().map((stage) => {
      return {
        key: `R${stage.key}`,
        stage: stage.key,
        matches: stage.matches.slice(stage.matches.length/2, stage.matches.length)
      }
    });

    const matchColumns = matchColumnsLeft.concat(matchColumnsRight);
    return matchColumns;
  }
  return []
}


export function KnockoutStage(props) {
  const stages = props.stages;
  const columns = getMatchColumns(stages);
  const editable = props.editable;
  const editTeams = true;
  const teams = props.teams;

  const [openStage, setOpenStage] = useState('16')

  const getStageGrow = (stage, openStage) => {
    if(stage === openStage){
      return 4;
    }
    else{
      return 1
    }
  }

  const getJustifyContent = (key) => {
  console.log(key)
    if(key === 'F'){
      return 'center';
    }
    else{
      return 'space-around';
    }
  }

  const api = useContext(APIContext);
  const prono = useContext(PronoContext);

  const saveMatch = (match, score1, score2, penalty1, penalty2, team1, team2) => {
    api.updateMatch(prono, match, {score1: score1, score2: score2, penalty1: penalty1, penalty2: penalty2, team1: team1, team2: team2})
  }

  return (
    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%'}}>
      {columns.map( (column) => (
        <div key={column.key} style={{display: 'flex', flexDirection: 'column', justifyContent: getJustifyContent(column.key), flexGrow: getStageGrow(column.stage, openStage), height: '680px', marginRight: '5px', marginLeft: '5px'}}
         onClick={() => setOpenStage(column.stage)}>

          {column.matches.map((match, matchIndex) => (
            <div key={match.key}>
              {(column.key === 'R4' && matchIndex === 0)  && (<div style={{height: '80px'}}></div>)}

              <Paper style={{padding: '5px', height: '160px', marginTop: '5px', marginBottom: '5px', overflowX: 'hidden'}}>
                <Match match={match} showPenaltyEdit={true} onSave={saveMatch} editable={editable} editTeams={editTeams} teams={teams}/>
              </Paper>

              {(column.key === 'L4' && matchIndex === 0)  && (<div style={{height: '80px'}}></div>)}
            </div>
          ))}

        </div>
      ))}
    </div>
  );
};


export function KnockoutStageProno(props) {
  const user = props.user;
  const currentStage = props.currentStage;
  const stages = props.stages;
  const columns = getMatchColumns(stages);

  const [openStage, setOpenStage] = useState('16')

  const getStageGrow = (stage, openStage) => {
    if(stage === openStage){
      return 4;
    }
    else{
      return 1
    }
  }
  const getJustifyContent = (key) => {
    if(key === 'F'){
      return 'center';
    }
    else{
      return 'space-around';
    }
  }

  const api = useContext(APIContext);
  const prono = useContext(PronoContext);

  const saveMatch = (match, score1, score2, penalty1, penalty2) => {
    api.updateMatchProno(prono, user, match, {score1: score1, score2: score2, penalty1: penalty1, penalty2: penalty2})
  }

  const getEditable  = (stage) => (currentStage === stage || user.permissions.editDisabledProno);

  return (
    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%'}}>
      {columns.map( (column) => (
        <div key={column.key} style={{display: 'flex', flexDirection: 'column', justifyContent: getJustifyContent(column.key), height: '680px', flexGrow: getStageGrow(column.stage, openStage), marginRight: '5px', marginLeft: '5px'}}
         onClick={() => setOpenStage(column.stage)}>

          {column.matches.map((match, matchIndex) => (
            <div key={match.key}>
              {(column.key === 'R4' && matchIndex === 0)  && (<div style={{height: '80px'}}></div>)}

              <Paper style={{padding: '5px', height: '160px', marginTop: '5px', marginBottom: '5px', overflowX: 'hidden', position: 'relative'}}>
                <Match match={match} showPenaltyEdit={false} onSave={saveMatch} editable={getEditable(column.stage)}
                  editTeams={false} teams={[]}/>
                <Disabled disabled={!getEditable(column.stage)}/>
              </Paper>

              {(column.key === 'L4' && matchIndex === 0)  && (<div style={{height: '80px'}}></div>)}
            </div>
          ))}

        </div>
      ))}
    </div>
  );
};
