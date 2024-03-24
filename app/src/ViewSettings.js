import React, { useState, useContext } from 'react';
import { useTheme } from '@mui/material/styles';

import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';


import { PronoContext } from './PronoProvider.js';


function Prono(props) {
  const prono = props.prono;
  const active = props.active;
  const deleteProno = props.deleteProno;
  const updateProno = props.updateProno;
  const duplicateProno = props.duplicateProno;
  const setActiveProno = props.setActiveProno;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  return (
    <div>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <div style={{margin: '5px', flexGrow: 1}}>
          <TextField style={{width: '150px'}} value={prono.name} onChange={(event) => updateProno(prono, {name: event.target.value})} label="Name"/>
        </div>
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


function TenantSettings(props) {
  const api = props.api;

  const activeProno = useContext(PronoContext);
  const pronos = api.usePronos([]);

  const duplicateProno = (prono) => {
    api.duplicateProno(prono);
  };

  const deleteProno = (prono) => {
    api.deleteProno(prono);
  }

  const updateProno = (prono, update) => {
    api.updateProno(prono, update);
  }

  const setActiveProno = (prono) => {
    api.updateActiveProno(prono.key);
  }

  const theme = useTheme();

  return (
    <div>
      <h3 style={{color: theme.palette.text.headers}}>Pronos</h3>

      <div style={{display: 'flex', flexDirection: 'column'}}>
        {pronos.map((prono) => (
          <Paper key={prono.key}>
            <Prono prono={prono} deleteProno={deleteProno} updateProno={updateProno} duplicateProno={duplicateProno} setActiveProno={setActiveProno} active={prono.key === activeProno} />
          </Paper>
        ))}
      </div>
    </div>
  );
}



function ViewSettings(props){
  const api = props.api;

  const prono = useContext(PronoContext);

  const currentStage = api.useCurrentStage(prono, 'finished');
  const homeTeamResult = api.useHomeTeamResult(prono, '-1');
  const deadlines = api.useDeadlines(prono, {});

  const handleCurrentStageChange = (e) =>{
    api.updateCurrentStage(prono, e.target.value)
  }

  const handleHomeTeamResultChange = (e) => {
    api.updateHomeTeamResult(prono, e.target.value)
  }

  const formatDate = (dt) => {
    if (dt === undefined) {
      return '';
    }
    if(dt instanceof Date && !isNaN(dt)){
      return dt.toISOString();
    }
    return dt;
  }

  const handleDealineChange = (stage, str) => {
    const dt = new Date(str);

    if(dt instanceof Date && !isNaN(dt)){
      let update = {}
      update[stage] = dt.getTime()
      api.updateDeadlines(prono, update)
    }
  }

  const theme = useTheme();
  const styles = {
    paper: {
      padding: '10px',
      margin: '5px'
    }
  }

  return (
    <div>
      <h3 style={{color: theme.palette.text.headers}}>Competition Settings</h3>

      <Paper style={styles.paper}>
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

      <Paper style={styles.paper}>
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

      <Paper style={styles.paper}>
        <h3 style={{marginTop: 0}}>Deadlines</h3>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <div>
            <TextField style={{width: '400px'}} value={formatDate(deadlines['groupStage'])} onChange={(e) => handleDealineChange('groupStage', e.target.value)} label="Groupstage"/>
          </div>
          <div>
            <TextField style={{width: '400px'}} value={formatDate(deadlines['16'])} onChange={(e) => handleDealineChange('16', e.target.value)} label="Round of 16"/>
          </div>
          <div>
            <TextField style={{width: '400px'}} value={formatDate(deadlines['8'])} onChange={(e) => handleDealineChange('8', e.target.value)} label="Quarter finals"/>
          </div>
          <div>
            <TextField style={{width: '400px'}} value={formatDate(deadlines['4'])} onChange={(e) => handleDealineChange('4', e.target.value)} label="Semi finals"/>
          </div>
          <div>
            <TextField style={{width: '400px'}} value={formatDate(deadlines['2'])} onChange={(e) => handleDealineChange('2', e.target.value)} label="Final"/>
          </div>
        </div>
      </Paper>

      <TenantSettings api={api}/>
    </div>
  );

}

export default ViewSettings;
