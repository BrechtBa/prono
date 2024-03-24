import React, { useState, useContext } from 'react';

import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';

import { PronoContext } from './PronoProvider.js';
import ViewProno from './ViewProno.js'


function User(props){

  const user = props.user;
  const api = props.api;

  const prono = useContext(PronoContext);

  const [pronoDialogOpen, setPronoDialogOpen] = useState(false);

  const getFirstLetter = (user) => {
    if(user.displayName !== undefined){
      return user.displayName.substring(0, 1)
    }
    return '';
  }

  const getSquads = (api) => {
    if(api === null){
      return []
    }
    const squads = api.useSquads()

    return Object.keys(squads).map(key => {
      return {key: key, name: squads[key].name}
    });
  }

  const getUserSquads = (user) => {
    if(user.squads === undefined) {
      return [];
    }
    return Object.keys(user.squads);
  }
  const setUserSquads = (val) => {
    api.updateSquads(user, val);
  }

  return (
    <div style={{marginBottom: '5px'}}>

      <Paper style={{padding: '10px'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'end', flexWrap: 'wrap'}}>
          <div style={{display: 'flex', flexGrow: 1, alignItems: 'center', marginRight: '10px', marginBottom: '5px'}}>
            <Avatar alt={user.displayName} src={user.profilePicture} style={{height: '50px', width: '50px', marginRight: '20px'}}>{getFirstLetter(user)}</Avatar>
            <div style={{width: '150px'}}>{user.displayName}</div>
          </div>
          <div style={{display: 'flex', flexGrow: 20, alignItems: 'center', marginRight: '10px', marginBottom: '5px', flexWrap: 'wrap'}}>
            <div>
              <Select multiple value={getUserSquads(user)} label="Squad" renderValue={(selected) => selected.join(', ')} onChange={(e) => setUserSquads(e.target.value)} >
                {getSquads(api).map(s => (
                  <MenuItem key={s.key} value={s.key}>
                    <Checkbox color="secondary" checked={getUserSquads(user).indexOf(s.key) > -1} />
                    <ListItemText primary={s.name} />
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div><Checkbox color="secondary" checked={user.paid} onChange={(e) => api.updatePaid(prono, user, !user.paid)}/> Paid</div>
            <div><Checkbox color="secondary" checked={user.showPoints} onChange={(e) => api.updateShowPoints(prono, user, !user.showPoints)}/> Points</div>
            <div><Checkbox color="secondary" checked={user.permissions.editor || false} onChange={(e) => api.updatePermissionEditor(user, !user.permissions.editor)}/> Editor</div>
            <div><Checkbox color="secondary" checked={user.permissions.editDisabledProno || false} onChange={(e) => api.updatePermissionEditDisabledProno(user, !user.permissions.editDisabledProno)}/> editDisabledProno</div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', marginRight: '10px', marginBottom: '5px', flexWrap: 'wrap'}}>
            <div><Button onClick={() => setPronoDialogOpen(!pronoDialogOpen)}>Edit prono</Button></div>
          </div>
        </div>
      </Paper>

      <div>
        {pronoDialogOpen && <ViewProno user={user} api={api}/>}
      </div>

    </div>
  )

}


function ViewUsers(props) {

  const api = props.api;
  const prono = useContext(PronoContext);

  const users = api.useUsers(prono)
  const [filterActive, setFilterActive] = useState(true);

  const userFilter = (user) => {
    return !filterActive || (user.squads !== undefined && Object.keys(user.squads).length > 0)
  }

  return (
    <div>
      <h2 style={{color: '#ffffff'}}>Users</h2>

      <div><Checkbox checked={filterActive} onChange={(e) => setFilterActive(!filterActive)}/>Hide inactive</div>

      <div>
        {users.filter(userFilter).map((user) => (
          <User key={user.key} user={user} api={api}/>
        ))}
      </div>
    </div>
  );

}

export default ViewUsers;
