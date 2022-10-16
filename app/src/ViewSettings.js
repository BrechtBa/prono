import React, { useState, useEffect, useContext } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

import APIContext from './APIProvider.js';
import { PronoContext } from './PronoProvider.js';

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


function Prono(props) {
  const prono = props.prono;
  const active = props.active;
  const deleteProno = props.deleteProno;
  const duplicateProno = props.duplicateProno;
  const setActiveProno = props.setActiveProno;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  return (
    <div>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <div style={{margin: '5px', flexGrow: 1}}>{prono.name}</div>
        <div style={{margin: '5px'}}><Button variant="contained" onClick={() => setActiveProno(prono)} disabled={active}>{active ? 'Active' : 'Activate'}</Button></div>
        <div style={{margin: '5px'}}><Button variant="contained" onClick={() => duplicateProno(prono)}>Duplicate</Button></div>
        <div style={{margin: '5px'}}><Button variant="contained" onClick={() => setDeleteDialogOpen(true)} disabled={active}>Delete</Button></div>

      </div>

      <Dialog onClose={() => setDeleteDialogOpen(false)} open={deleteDialogOpen}>
        <div style={{display: 'flex', flexDirection: 'column', padding: '20px'}}>
          <h3>Are you sure you want to delete {prono.name}</h3>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: '20px'}}>
            <Button onClick={() => deleteProno(prono)}>delete</Button>
            <Button onClick={() => setDeleteDialogOpen(false)}>cancel</Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}


function TenantSettings() {
  const [pronos, setPronos] = useState([]);

  const api = useContext(APIContext);
  const activeProno = useContext(PronoContext);

  useEffect(() => {
    return api.onPronosChanged(val => {
      setPronos(val);
    });
  }, [api]);


  const duplicateProno = (prono) => {
    api.duplicateProno(prono);
  };

  const deleteProno = (prono) => {
    api.deleteProno(prono);
  }

  const setActiveProno = (prono) => {
    api.updateActiveProno(prono.key);
  }

  const classes = useStyles();

  return (
    <div>
      <h3 className={classes.header}>Pronos</h3>

      <div style={{display: 'flex', flexDirection: 'column'}}>
        {pronos.map((prono) => (
          <Paper key={prono.key} className={classes.paper}>
            <Prono prono={prono} deleteProno={deleteProno} duplicateProno={duplicateProno} setActiveProno={setActiveProno} active={prono.key === activeProno} />
          </Paper>
        ))}
      </div>
    </div>
  );
}



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
      <h3 className={classes.header}>Competition Settings</h3>

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

      <TenantSettings />
    </div>
  );

}

export default ViewSettings;
