import React, { useState, useEffect, useContext } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import APIContext from './APIProvider.js';
import PronoContext from './PronoProvider.js';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      color: theme.palette.text.headers,
    },
    paper: {
      marginBottom: '10px',
      padding: '10px',
    },
  })
);

function ViewSettings(){
  const [currentStage, setCurrentStage] = useState('finished')
  const [homeTeamResult, setHomeTeamResult] = useState('-1')

  const api = useContext(APIContext);
  const prono = useContext(PronoContext);

  useEffect(() => {
    return api.onCurrentStageChanged(prono, val => {
      setCurrentStage(val);
    });
  }, [api, prono]);

  const handleCurrentStageChange = (e) =>{
    api.updateCurrentStage(prono, e.target.value)
  }

 useEffect(() => {
    return api.onHomeTeamResultChanged(prono, val => {
      setHomeTeamResult(val);
    });
  }, [api, prono]);

  const handleHomeTeamResultChange = (e) =>{
    api.updateHomeTeamResult(prono, e.target.value)
  }

  const classes = useStyles();

  return (
    <div>
      <h3 className={classes.header}>Settings</h3>

      <Paper className={classes.paper}>
        <h3 style={{marginTop: 0}}>Tournament stages</h3>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <div>
            <InputLabel id="select-label">Current stage</InputLabel>
            <Select value={currentStage} onChange={handleCurrentStageChange} labelId="select-label" style={{width: '100%'}}>
              <MenuItem value="groupstage">Groupstage</MenuItem>
              <MenuItem value="16">Round of 16</MenuItem>
              <MenuItem value="8">Quarter finals</MenuItem>
              <MenuItem value="4">Semi finals</MenuItem>
              <MenuItem value="2">Final</MenuItem>
              <MenuItem value="finished">Finished</MenuItem>
            </Select>
          </div>
        </div>
      </Paper>

      <Paper className={classes.paper}>
        <h3 style={{marginTop: 0}}>Home team</h3>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <div>
            <InputLabel id="select-label">Home team result</InputLabel>
            <Select value={homeTeamResult} onChange={handleHomeTeamResultChange} labelId="select-label" style={{width: '100%'}}>
              <MenuItem value="-1">Still playing</MenuItem>
              <MenuItem value="0">Eliminated in the Groupstage</MenuItem>
              <MenuItem value="16">Eliminated in the Round of 16</MenuItem>
              <MenuItem value="8">Eliminated in the Quarter finals</MenuItem>
              <MenuItem value="4">Eliminated in the Semi finals</MenuItem>
              <MenuItem value="2">Eliminated in the Final</MenuItem>
              <MenuItem value="1">Winner</MenuItem>
            </Select>
          </div>
        </div>
      </Paper>

    </div>

  );

}

export default ViewSettings;
