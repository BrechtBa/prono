import React, {useState} from "react";

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "./UserProvider.js";


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    error: {
      marginBottom: '10px',
      color: '#ff0000'
    },
    message: {
      marginBottom: '10px',
    },
  })
);


function Register(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [error, setError] = useState(null);


  const onEmailChangeHandler = (event) => {
      setEmail(event.currentTarget.value);
  };

  const onPasswordChangeHandler = (event) => {
      setPassword(event.currentTarget.value);
  };

  const onPasswordRepeatChangeHandler = (event) => {
      setPasswordRepeat(event.currentTarget.value);
  };

  const register = () => {
    if(password === passwordRepeat){
      createUserWithEmailAndPassword(email, password, () => {
        setEmail('');
        setPassword('');
        setPasswordRepeat('');
      }, (error) => {
        console.log(error)
        if(error.code === 'auth/invalid-email'){
          setError("Ongeldig email adres!");
        }
        else if(error.code === 'auth/email-already-in-use'){
          setError("Email adres is al in gebruik!");
        }
        else if(error.code === 'auth/weak-password'){
          setError("Wachtwoord moet minstens 6 tekens bevatten");
        }
        else{
          setError("error!");
        }
      })
    }
    else{
      setError("Het wachtwoord was niet gelijk!");
      setPassword('');
      setPasswordRepeat('');
    }
  }

  const classes = useStyles();

  return (
    <div>
      <h1 style={{marginTop: 0}}>Register</h1>
      {error !== null && <div className={classes.error}>{error}</div>}

      <form style={{display: 'flex', flexDirection: 'column'}}>
          <div> </div>
          <TextField label="Email" value={email} onChange={(event) => onEmailChangeHandler(event)} style={{marginBottom: '10px'}}/>
          <TextField label="Password" type="password" value={password} onChange={(event) => onPasswordChangeHandler(event)} style={{marginBottom: '10px'}}/>
          <TextField label="Herhaal password" type="password" value={passwordRepeat} onChange={(event) => onPasswordRepeatChangeHandler(event)}/>
          <div style={{marginTop: '20px', marginBottom: '10px'}}>
            <Button onClick={() => register()}>
              <span>Registreer</span>
            </Button>
          </div>
        </form>

    </div>
  );
};


function ResetPassword(props){
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const reset = () => {
    sendPasswordResetEmail(email, () => {
      setError(null)
      setMessage('Email verstuurd, controleer je email voor een reset link.')
    }, (error) => {
      console.log(error)
      setMessage(null)
      if(error.code === 'auth/invalid-email'){
        setError("Ongeldig email adres!");
      }
      else if(error.code === 'auth/user-not-found'){
        setError("Onbekend email adres!");
      }
      else{
        setError('error')
      }
    })
  }
  const classes = useStyles();

  return (
    <div>
      <h1 style={{marginTop: 0}}>Wachtwoord resetten</h1>
      {error !== null && <div className={classes.error}>{error}</div>}

      <form style={{display: 'flex', flexDirection: 'column'}}>
        <div> </div>
        <TextField label="Email" value={email} onChange={(event) => setEmail(event.currentTarget.value)} style={{marginBottom: '10px'}}/>
        <div style={{marginTop: '20px', marginBottom: '10px'}}>
          <Button onClick={() => reset()}>
            <span>Stuur reset link</span>
          </Button>
        </div>
      </form>

      {message !== null && <div className={classes.message}>{message}</div>}

    </div>
  )
}


function ViewLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const [registerDialogOpen, setRegisterDialogOpen] = useState(false)
  const [resetDialogOpen, setResetDialogOpen] = useState(false)

  const onEmailChangeHandler = (event) => {
      setEmail(event.currentTarget.value);
  };

  const onPasswordChangeHandler = (event) => {
      setPassword(event.currentTarget.value);
  };

  const signInWithEmailAndPasswordHandler = (event, email, password) => {
    event.preventDefault();
    signInWithEmailAndPassword(email, password, () => {}, (error) => {
      console.log("Error signing in with password and email", error);
      if(error.code === 'auth/invalid-email'){
        setError("Ongeldig email adres!");
      }
      else if(error.code === 'auth/user-not-found'){
        setError("Onbekend email adres!");
      }
      else if(error.code === 'auth/wrong-password'){
        setError("Verkeerd wachtwoord!");
      }
      else{
        setError("error!");
      }
    });
  };

  const classes = useStyles();

  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
      <Paper style={{padding: '10px'}}>
        <h1 style={{marginTop: 0}}>Login</h1>

        {error !== null && <div className={classes.error}>{error}</div>}

        <form style={{display: 'flex', flexDirection: 'column'}}>
          <TextField label="Email" value={email} onChange={(event) => onEmailChangeHandler(event)} style={{marginBottom: '10px'}}/>
          <TextField label="Password" type="password" value={password} onChange={(event) => onPasswordChangeHandler(event)} style={{marginBottom: '10px'}}/>
          <div style={{marginTop: '20px', marginBottom: '10px'}}>
            <Button id="signInButton" onClick={(event) => {signInWithEmailAndPasswordHandler(event, email, password)}}>
              <span>Sign in</span>
            </Button>
          </div>
        </form>

        <div>Nog geen account? <Button onClick={() => setRegisterDialogOpen(true)}>register</Button></div>
        <div>Wachtwoord vergeten? <Button onClick={() => setResetDialogOpen(true)}>reset wachtwoord</Button></div>
      </Paper>

      <Dialog onClose={() => setRegisterDialogOpen(false)} open={registerDialogOpen}>
        <div style={{padding: '20px', width: '360px'}}>
          <Register />
        </div>
      </Dialog>

      <Dialog onClose={() => setResetDialogOpen(false)} open={resetDialogOpen}>
        <div style={{padding: '20px', width: '360px'}}>
          <ResetPassword />
        </div>
      </Dialog>
    </div>
  );
};


export default ViewLogin;
