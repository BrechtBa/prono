import React, { useState, useContext } from 'react';
import { UserContext } from "./UserProvider.js";

import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';

import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import { signOut } from "./UserProvider.js";

import ViewRanking from './ViewRanking.js';
import ViewProno from './ViewProno.js';
import ViewResults from './ViewResults.js';
import ViewLogin from './ViewLogin.js';

const drawerWidth = 320;


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      minHeight: '100%',
      background: theme.palette.background.gradient,
    },

    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },

    drawerPaper: {
      width: drawerWidth,
    },

    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },

    user: {
      backgroundColor: theme.palette.background.default,
    },

    navigationItem: {
      textDecoration: 'none',
      color: theme.palette.primary.contrastText,
      width: 'auto',
    },

    version: {
      marginLeft: '5px',
      marginTop: '30px'
    },
  }),


);


function User(props) {

  const user = props.user

  const classes = useStyles();
  return (
    <div className={classes.user}>
      <Avatar alt={user.displayName} src={user.profilePicture} />
      <div>{user.displayName}</div>
      <div>{user.email}</div>
    </div>
  );
}


function Navigation(props) {

  const isAdmin = props.isAdmin;
  const onNavigation = props.onNavigation;

  const links = [{
    title: 'Rangschikking',
    path: 'ranking'
  }, {
    title: 'Prono',
    path: 'prono'
  }, {
    title: 'Resultaten',
    path: 'results'
  }, {
    title: 'Regels',
    path: 'rules'
  }]

  const adminLinks = [{
    title: 'Users',
    path: 'users'
  }, {
    title: 'Settings',
    path: 'settings'
  }, {
    title: 'Teams',
    path: 'teams'
  }, {
    title: 'Matches',
    path: 'matches'
  }, {
    title: 'Groupstage',
    path: 'groupstage'
  }, {
    title: 'Knockoutstage',
    path: 'kockoutstage'
  }]
  const classes = useStyles();

  const navigationItem = (link, index) => {
    return (
      <Link key={index} to={link.path} className={classes.navigationItem} onClick={onNavigation()}>
        <ListItem button key={link.title}>
          <ListItemText primary={link.title} />
        </ListItem>
      </Link>
    );
  }

  return (
    <div>
      <List>
        {links.map((link, index) => navigationItem(link, index))}
      </List>

      <Divider/>
      {isAdmin &&
        adminLinks.map((link, index) => navigationItem(link, index))
      }
      {isAdmin &&
        <Divider/>
      }
    </div>
  );
}


function Version() {
  const classes = useStyles();

  return (
    <div className={classes.version}>v2.0</div>
   )
}

function PronoLayout(props) {

  const user = useContext(UserContext);

  const classes = useStyles();
  const [navigationOpen, setNavigationOpen] = useState(false);

  const toggleNavigation = (open) => (event) => {
    if(open === undefined){
      setNavigationOpen(!navigationOpen);
    }
    else{
      setNavigationOpen(open);
    }
  }

  if(user !== null){
    return (
      <BrowserRouter>
        <div className={classes.root}>
          <CssBaseline />
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar style={{display: "flex", paddingRight: "12px"}}>

                <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={toggleNavigation()}>
                  <MenuIcon/>
                </IconButton>

              <Typography variant="h6" style={{flexGrow: 1}}  noWrap>
                  Prono
              </Typography>
            </Toolbar>
          </AppBar>

          <SwipeableDrawer anchor="left" className={classes.drawer} classes={{paper: classes.drawerPaper}}
           open={navigationOpen} onClose={toggleNavigation(false)} onOpen={toggleNavigation(true)}>
            <User user={user}/>
            <Navigation isAdmin={user.permissions.admin} onNavigation={toggleNavigation}/>

            <ListItem button>
              <ListItemText primary={"Sign out"} onClick={() => signOut(() => {setNavigationOpen(false)})}/>
            </ListItem>

            <Divider/>
            <Version/>
          </SwipeableDrawer>

          <main className={classes.content}>
            <Toolbar />
            <Switch>
              <Route path="/ranking"> <ViewRanking/> </Route>
              <Route path="/prono"> <ViewProno/> </Route>
              <Route path="/results"> <ViewResults/> </Route>
              <Route path="/rules">
                Rules
              </Route>


              <Route path="/users">
                Users
              </Route>
              <Route path="/settings">
                Users
              </Route>
              <Route path="/teams">
                Users
              </Route>
              <Route path="/matches">
                Users
              </Route>
              <Route path="/hroupstage">
                hroupstage
              </Route>
              <Route path="/knockoutstage">
                Users
              </Route>

              <Route path="/"> <ViewRanking/> </Route>

            </Switch>
          </main>

        </div>
      </BrowserRouter>
    );
  }
  else {
    return (
      <div className={classes.root}>
        <ViewLogin />
      </div>
    )
  }

}

export default PronoLayout;
