import React, { useState, useEffect, useContext } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

import APIContext from './APIProvider.js';
import { PronoContext } from './PronoProvider.js';
import ViewProno from './ViewProno.js'


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {}
  })
);


function User(props){

  const user = props.user;

  const api = useContext(APIContext);
  const prono = useContext(PronoContext);

  const [pronoDialogOpen, setPronoDialogOpen] = useState(false);

  const getFirstLetter = (user) => {
    if(user.displayName !== undefined){
      return user.displayName.substring(0, 1)
    }
    return '';
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
            <div><Checkbox checked={user.active} onChange={(e) => api.updateActive(prono, user, !user.active)}/> Active</div>
            <div><Checkbox checked={user.paid} onChange={(e) => api.updatePaid(prono, user, !user.paid)}/> Paid</div>
            <div><Checkbox checked={user.showPoints} onChange={(e) => api.updateShowPoints(prono, user, !user.showPoints)}/> Points</div>
            <div><Checkbox checked={user.permissions.editor} onChange={(e) => api.updatePermissionEditor(user, !user.permissions.editor)}/> Editor</div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', marginRight: '10px', marginBottom: '5px', flexWrap: 'wrap'}}>
            <div><Button onClick={() => setPronoDialogOpen(!pronoDialogOpen)}>Edit prono</Button></div>
          </div>
        </div>
      </Paper>

      <div>
        {pronoDialogOpen && <ViewProno user={user}/>}
      </div>

    </div>
  )

}


function ViewUsers(props) {

  const api = useContext(APIContext);
  const prono = useContext(PronoContext);

  const [users, setUsers] = useState([]);
  const [filterActive, setFilterActive] = useState(true);

  useEffect(() => {
    api.onUsersChanged(prono, users => {
      setUsers(users);
    });
  }, [api, prono]);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <h2 style={{color: '#ffffff'}}>Users</h2>

      <div><Checkbox checked={filterActive} onChange={(e) => setFilterActive(!filterActive)}/>Hide inactive</div>

      <div>
        {users.filter((user) => !filterActive || user.active).map((user) => (
          <User key={user.key} user={user} ranking={user.rank}/>
        ))}
      </div>
    </div>
  );

}

export default ViewUsers;
