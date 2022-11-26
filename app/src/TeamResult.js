import React, { useState, useEffect, useContext } from 'react';

import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';

import { PronoContext } from './PronoProvider.js';

import { Disabled, TeamName, TeamIcon } from './MatchUtils.js';


const stageResultText = [
  {key: '-1', displayName: ' '},
  {key: '0', displayName: 'Geëlimineerd in de groepsfase'},
  {key: '16', displayName: 'Geëlimineerd in de 8e finale'},
  {key: '8', displayName: 'Geëlimineerd in de kwartfinale'},
  {key: '4', displayName: 'Geëlimineerd in de halve finale'},
  {key: '2', displayName: 'Geëlimineerd in de finale'},
  {key: '1', displayName: 'Winnaar'},
]

export function TeamResultProno(props) {
  const user = props.user;
  const team = props.team;
  const currentStage = props.currentStage;
  const stage = props.stage;
  const api = props.api;

  const [dialogStage, setDialogStage] = useState('-1')
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    setDialogStage(stage || '-1')
  }, [user, stage]);

  const prono = useContext(PronoContext);

  const handleChange = (e) => {
    setDialogStage(e.target.value);
  }

  const saveTeamResult = () => {
    api.updateTeamResultProno(prono, user, dialogStage)
    setDialogOpen(false)
  }

  const getStageName = (stage) => {
    const stageKeys = stageResultText.map((val) => val.key);
    const ind = stageKeys.indexOf(stage)
    if(ind > -1){
      return stageResultText[ind].displayName;
    }
    else{
      return ' '
    }
  }

  const editable = (currentStage === 'groupstage' || user.permissions.editDisabledProno);

  return (
    <div style={{width: '100%', marginBottom: '10px'}}>
      <Paper style={{padding: '10px', position: 'relative'}}>
        <div onClick={() => setDialogOpen(true)}>
          <h3 style={{marginTop: '0px'}}>Team resultaat</h3>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={{width: '30px', height: '30px', marginRight: '10px'}}>
              <TeamIcon team={team}/>
            </div>
            <div style={{marginRight: '30px'}}>
              <TeamName team={team} def='BEL'/>
            </div>
            <div style={{height: '40px', fontSize: '18px', fontWeight: 600}}>
              {getStageName(stage)}
            </div>
          </div>
        </div>
        <Disabled disabled={!editable}/>
      </Paper>

      <Dialog onClose={() => setDialogOpen(false)} open={dialogOpen}>
        <form>
          <div style={{display: 'flex', flexDirection: 'column', padding: '20px', width: '350px'}}>
            <div>
              <InputLabel id="select-label">Team resultaat</InputLabel>
              <Select value={dialogStage} onChange={handleChange} labelId="select-label" style={{width: '100%'}}>
                {stageResultText.map((val) => (
                  <MenuItem key={val.key} value={val.key}>
                    {val.displayName}
                  </MenuItem>
                ))}
              </Select>
            </div>

            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: '20px'}}>
              <Button onClick={() => saveTeamResult()}>save</Button>
              <Button onClick={() => setDialogOpen(false)}>cancel</Button>
            </div>
          </div>
        </form>
      </Dialog>
    </div>
  );
};