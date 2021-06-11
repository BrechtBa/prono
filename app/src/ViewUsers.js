import React, { useState, useEffect, useContext } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

import APIContext from './APIProvider.js';
import ViewProno from './ViewProno.js'


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {}
  })
);


function User(props){

  const user = props.user;

  const api = useContext(APIContext);
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
        <div style={{display: 'flex', alignItems: 'center'}}>
          <Avatar alt={user.displayName} src={user.profilePicture} style={{height: '50px', width: '50px', marginRight: '20px'}}>{getFirstLetter(user)}</Avatar>
          <div style={{width: '150px'}}>{user.displayName}</div>
          <div><Checkbox checked={user.active} onChange={(e) => api.updateActive(user, !user.active)}/> Active</div>
          <div><Checkbox checked={user.paid} onChange={(e) => api.updatePaid(user, !user.paid)}/> Paid</div>
          <div><Checkbox checked={user.permissions.editor} onChange={(e) => api.updatePermissionEditor(user, !user.permissions.editor)}/> Editor</div>
          <div><Button onClick={() => setPronoDialogOpen(true)}>Edit prono</Button></div>
        </div>
      </Paper>

      <Dialog onClose={() => setPronoDialogOpen(false)} open={pronoDialogOpen} PaperProps={{style: {backgroundColor: '#DD0000'}}}>
        <ViewProno user={user}/>
      </Dialog>
    </div>
  )

}


function ViewUsers(props) {

  const api = useContext(APIContext);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.onUsersChanged(users => {
      setUsers(users);
    });
  }, [api]);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <h2 style={{color: '#ffffff'}}>Users</h2>

      {users.map((user) => (
        <User key={user.key} user={user} ranking={user.rank}/>
      ))}

    </div>
  );

}

export default ViewUsers;
