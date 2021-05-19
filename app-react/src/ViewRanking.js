import React, { useState, useEffect, useContext } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import APIContext from './APIProvider.js';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {}
  })
);


function ViewRanking(props) {

  const api = useContext(APIContext);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.onUsersChanged(users => {
      setUsers(users);
      console.log(users)
    });
  }, [api]);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <h2 style={{color: '#ffffff'}}>Rangschikking</h2>

      {users.map((user, index) => {
        return (<div key={user.key}>{user.displayName}</div>)

      })}
    </div>
  );

}

export default ViewRanking;
