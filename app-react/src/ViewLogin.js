import React, {useState} from "react";

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { auth } from "./firebase.js";


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    error: {

    },
  })
);


function ViewLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const onEmailChangeHandler = (event) => {
      const {name, value} = event.currentTarget;
      setEmail(value);
  };

  const onPasswordChangeHandler = (event) => {
      const {name, value} = event.currentTarget;
      setPassword(value);
  };

  const signInWithEmailAndPasswordHandler = (event, email, password) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password).catch(error => {
      setError("Error signing in with password and email!");
      console.error("Error signing in with password and email", error);
    });
  };

  const signOut = () => {
    auth.signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });
  }

  const openRegisterDialog = () => {

  };

  const openResetPasswordDialog = () => {

  };

  const classes = useStyles();

  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
      <Paper style={{padding: '10px'}}>
        <h1 style={{marginTop: 0}}>Login</h1>

        {error !== null && <div className={classes.error}>{error}</div>}
        <form style={{display: 'flex', flexDirection: 'column'}}>
          <div> </div>
          <TextField label="Email" value={email} onChange={(event) => onEmailChangeHandler(event)}/>
          <TextField label="Password" type="password" value={password} onChange={(event) => onPasswordChangeHandler(event)}/>

          <div>
            <Button id="signInButton" onClick={(event) => {signInWithEmailAndPasswordHandler(event, email, password)}}>
              <span>Sign in</span>
            </Button>
          </div>
        </form>

        <p>Nog geen account? <a href="#" onClick={openRegisterDialog}>register</a></p>
        <p>Wachtwoord vergeten? <a href="#" onClick={openResetPasswordDialog}>reset wachtwoord</a></p>
      </Paper>
    </div>
  );
};


function Register(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [error, setError] = useState(null);

  const createUserWithEmailAndPasswordHandler = async (event, email, password) => {
    event.preventDefault();
    try {
      const {user} = await auth.createUserWithEmailAndPassword(email, password);
    }
    catch(error){
      setError('Error Signing up with email and password');
    }

    setEmail("");
    setPassword("");
    setPasswordRepeat("");
  };

  const onEmailChangeHandler = (event) => {
      setEmail(event.currentTarget.value);
  };

  const onPasswordChangeHandler = (event) => {
      setPassword(event.currentTarget.value);
  };

  const onPasswordRepeatChangeHandler = (event) => {
      setPasswordRepeat(event.currentTarget.value);
  };

  const classes = useStyles();

  return (
    <div>
      <h1 style={{marginTop: 0}}>Register</h1>
      {error !== null && <div className={classes.error}>{error}</div>}

      <form style={{display: 'flex', flexDirection: 'column'}}>
          <div> </div>
          <TextField required label="Email" value={email} onChange={(event) => onEmailChangeHandler(event)}/>
          <TextField required label="Password" type="password" value={password} onChange={(event) => onPasswordChangeHandler(event)}/>
          <TextField required label="Herhaal password" type="password" value={passwordRepeat} onChange={(event) => onPasswordRepeatChangeHandler(event)}/>
          <div>
            <Button onClick={(event) => {createUserWithEmailAndPasswordHandler(event, email, password)}}>
              <span>Sign in</span>
            </Button>
          </div>
        </form>

    </div>
  );
};

export default ViewLogin;
