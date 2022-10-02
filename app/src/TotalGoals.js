import React, { useState, useEffect, useContext } from 'react';

import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import APIContext from './APIProvider.js';
import PronoContext from './PronoProvider.js';
import { Disabled } from './MatchUtils.js';


export function TotalGoalsProno(props) {
  const user = props.user;
  const currentStage = props.currentStage;
  const goals = props.goals;

  const [dialogGoals, setDialogGoals] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    setDialogGoals(goals)
  }, [user, goals]);

  const api = useContext(APIContext);
  const prono = useContext(PronoContext);

  const validateGoals = (goals) => {
    return (goals === '') || (parseInt(goals) >= 0);
  }

  const deformatGoals = (goals) => {
    var goalsInt = parseInt(goals);
    if(isNaN(goalsInt)){
      goalsInt = -1;
    }
    return goalsInt;
  }

  const saveGoals = () => {
    api.updateTotalGoalsProno(prono, user, deformatGoals(dialogGoals))
    setDialogOpen(false)
  }

  return (
    <div style={{width: '100%', marginBottom: '10px'}}>
      <Paper style={{padding: '10px', position: 'relative'}}>
        <div onClick={() => setDialogOpen(true)}>
          <h3 style={{marginTop: '0px'}}>Totaal aantal goals</h3>
          <div style={{height: '40px', fontSize: '30px', fontWeight: 600, marginLeft: '20px'}}>
            {goals >= 0 ? goals  : ''}
          </div>
        </div>
        <Disabled disabled={currentStage !== 'groupstage'}/>
      </Paper>


      <Dialog onClose={() => setDialogOpen(false)} open={dialogOpen}>
        <form>
          <div style={{display: 'flex', flexDirection: 'column', padding: '20px'}}>
            <div>
              <TextField style={{ marginLeft: '10px', marginRight: '10px'}} inputProps={{min: 0, style: {textAlign: 'center'}}} label="Totaal aantal goals" value={dialogGoals} onChange={(event) => setDialogGoals(event.currentTarget.value)} error={!validateGoals(goals)}/>
            </div>

            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: '20px'}}>
              <Button onClick={() => saveGoals()}>save</Button>
              <Button onClick={() => setDialogOpen(false)}>cancel</Button>
            </div>
          </div>
        </form>
      </Dialog>
    </div>
  );
};