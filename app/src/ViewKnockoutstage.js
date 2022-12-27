import React, { useState, useContext } from 'react';
import { createStyles, makeStyles } from '@mui/material/styles';

import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';

import { PronoContext } from './PronoProvider.js';
import { MatchSelect } from './MatchUtils.js';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {},
    stage: {
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
    matchDate: {
      display: 'flex',
      flexGrow: 4,
    },
    matchTeam: {
      display: 'flex',
      flexGrow: 4,
    }
  })
);



function Match(props) {
  const match = props.match;
  const date = new Date(match.date);
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

  const classes = useStyles();

  return (
    <div style={{height: '100%'}}>
      <div className={classes.match}>
        <div className={classes.matchNumber}>
          {match.number}
        </div>

        <div className={classes.matchDate}>
          {formatDate(date)}
        </div>

        <div className={classes.matchTeam}>
          {match.defaultteam1} -  {match.defaultteam2}
        </div>
        <div>
          <Button onClick={() => setDeleteDialogOpen(true)}>Delete</Button>
        </div>
      </div>

      <Dialog onClose={() => setDeleteDialogOpen(false)} open={deleteDialogOpen}>
        <div style={{margin: "20px"}}>
          <div>Do you really want to delete match {match.number} from this stage?</div>
          <div style={{marginTop: "10px"}}>
            <Button onClick={() => deleteMatch(match)}>Delete</Button>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Dialog>

    </div>
  )
}


function Stage(props) {
  const stage = props.stage;
  const matches = props.matches;

  const deleteStage = props.deleteStage;
  const updateStage = props.updateStage;
  const addMatch = props.addMatch;
  const deleteMatch = props.deleteMatch;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  let stageMatches = [];
  stage.matches.forEach((key) => {
    const match = matches[key];
    if(match !== undefined){
      stageMatches.push(match);
    }
  });

  const classes = useStyles();

  return (
    <div style={{height: '100%'}}>
      <div className={classes.stage}>
        <TextField style={{width: '200px', marginLeft: '10px', marginRight: '10px'}}
          value={stage.name} onChange={(event) => updateStage(stage, {name: event.target.value})} label="Stage name"/>
        <div>
          <h4>Matches</h4>
          {stageMatches.map((match) => (
            <Paper key={match.key}  style={{padding: '5px', marginBottom: '5px'}}>
              <Match match={match} deleteMatch={deleteMatch} />
            </Paper>
          ))}
          <MatchSelect label="Add match" matches={Object.entries(matches).map(val => val[1])} selected={{key: -1}}
            onChange={(match) => {if(match.key !== -1){addMatch(match)}}}/>

        </div>

        <div style={{display: "flex", justifyContent: 'flex-end'}}>
          <Button variant="contained" onClick={() => setDeleteDialogOpen(true)}>Delete Stage</Button>
        </div>
      </div>

      <Dialog onClose={() => setDeleteDialogOpen(false)} open={deleteDialogOpen}>
        <div style={{margin: "20px"}}>
          <div>Do you really want to delete stage {stage.key}?</div>
          <div style={{marginTop: "10px"}}>
            <Button onClick={() => deleteStage(stage)}>Delete</Button>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Dialog>

    </div>
  )

}


function ViewKnockoutstage(props) {

  const api = props.api;
  const prono = useContext(PronoContext);

  const stages = api.useKnockoutStage(prono);
  const matches = api.useMatches(prono);

  const stageKeys = [2, 4, 6, 8, 16, 32]
  //  const stageNames = {
  //    2: 'Final',
  //    4: 'Semi-Final',
  //    8: 'Quarter-Final',
  //    16: 'Round of 16',
  //    32: 'Round of 32',
  //  }


  const updateStage = (stage, update) => {
    api.updateStage(prono, stage, update);
  }
  const deleteStage = (stage) => {
    api.deleteStage(prono, stage);
  }

  const addMatchFactory = (stage) => {
    return (match) => api.stageAddMatch(prono, stage, match.key);
  };
  const deleteMatchFactory = (stage) => {
    return (match) => api.stageDeleteMatch(prono, stage, match.key);
  };

  const addStage = () => {
    const key = stageKeys[stages.length]
    const stage = {
      key: key,
      name: stageKeys[key],
      matches: [],
    }
    api.addStage(prono, stage);
  }

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <h2 style={{color: '#ffffff'}}>Knockout stage</h2>
      <div>
        {stages.map((stage) => (
          <Paper key={stage.key}  style={{padding: '5px', marginBottom: '5px'}}>
            <Stage key={stage.key} stage={stage} matches={matches} deleteStage={deleteStage} updateStage={updateStage}
              addMatch={addMatchFactory(stage)} deleteMatch={deleteMatchFactory(stage)} />
          </Paper>
        ))}
        <Button variant="contained" onClick={() => addStage()}>Add stage</Button>
      </div>
    </div>
  );

}

export default ViewKnockoutstage;
