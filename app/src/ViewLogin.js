import React, {useState} from "react";

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    error: {
      marginBottom: '10px',
      color: '#ff0000'
    },
    message: {
      marginBottom: '10px',
    },
    paragraph: {
      marginBottom: '10px',
    },
    link: {
      textDecoration: 'underline',
      color: '#0000ff',
      cursor: 'pointer'
    }
  })
);


function Terms(){
  const classes = useStyles();
  return (
    <div>
      <div className={classes.paragraph}>
        Prono gebruikt cookies enkel voor functionele doeleinden.
        Er zullen gegevens op je toestel worden opgeslagen.
      </div>
      <div className={classes.paragraph}>
        Er zullen gegevens die jij deelt worden opgeslagen in een database.
        Deze gegevens worden als vertrouwelijk behandeld en worden enkel gebruikt voor de werking van Prono.
        Gegevens die jij deelt zullen nooit aan anderen worden doorgegeven of verkocht.
      </div>
      <div className={classes.paragraph}>
        Indien de Prono server gehackt wordt zijn wij niet verantwoordelijk voor de verspreiding van de gegevens.
        We zullen echter ons best doen om dit te voorkomen.
      </div>
    </div>
  );
}


function Register(props) {
  const api = props.api;
  const close = props.close;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [termsChecked, setTermsChecked] = useState(false);
  const [error, setError] = useState(null);

  const [termsDialogOpen, setTermsDialogOpen] = useState(false);

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
    if(termsChecked){
      if(password === passwordRepeat){
        api.createUserWithEmailAndPassword(email.trim(), password, () => {
          setEmail('');
          setPassword('');
          setPasswordRepeat('');
        }, (error) => {
          console.error(error)
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
    else{
      setError("Je moet de algemene voorwaarden aanvaarden om te kunnen registreren!");
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
        <TextField label="Herhaal password" type="password" value={passwordRepeat} onChange={(event) => onPasswordRepeatChangeHandler(event)} style={{marginBottom: '10px'}}/>

        <div>
          <Checkbox value={termsChecked} onChange={e => setTermsChecked(!termsChecked)}/> Ik ga akkoord met de <span className={classes.link} onClick={(e) => setTermsDialogOpen(true)}>algemene voorwaarden.</span>
        </div>

        <div style={{marginTop: '20px', marginBottom: '10px'}}>
          <Button onClick={() => register()}>
            <span>Registreer</span>
          </Button>
          <Button onClick={() => close()}>Cancel</Button>
        </div>
      </form>

      <Dialog onClose={() => setTermsDialogOpen(false)} open={termsDialogOpen}>
        <div style={{padding: '20px', minWidth: '150px', maxWidth: '100%'}}>
          <Terms />
        </div>
        <Button onClick={(e) => setTermsDialogOpen(false)}>Sluiten</Button>

      </Dialog>

    </div>
  );
};



function ResetPassword(props){
  const api = props.api;
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const close = props.close;

  const reset = () => {
    api.sendPasswordResetEmail(email.trim(), () => {
      setError(null)
      setMessage('Email verstuurd, controleer je email voor een reset link.')
    }, (error) => {
      console.error(error)
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
      <h1 style={{marginTop: 0}}>Reset Wachtwoord</h1>
      {error !== null && <div className={classes.error}>{error}</div>}

      <form style={{display: 'flex', flexDirection: 'column'}}>
        <div> </div>
        <TextField label="Email" value={email} onChange={(event) => setEmail(event.currentTarget.value)} style={{marginBottom: '10px'}}/>
        <div style={{marginTop: '20px', marginBottom: '10px'}}>
          <Button onClick={() => reset()}>
            <span>Stuur reset link</span>
          </Button>
          <Button onClick={() => close()}>Cancel</Button>
        </div>
      </form>

      {message !== null && <div className={classes.message}>{message}</div>}

    </div>
  )
}


function ViewLogin(props) {
  const api = props.api;
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
    api.signInWithEmailAndPassword(email.trim(), password, () => {}, (error) => {
      console.error("Error signing in with password and email", error);
      if(error.code === 'auth/invalid-email'){
        setError(`Ongeldig email adres! "${email}"`);
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
    <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
      <div style={{display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center', width: '100%'}}>
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
      </div>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
        <div style={{margin: '20px', textAlign: 'center', color: '#ffffff'}}>Deze app gebruikt enkel cookies noodzakelijk voor de werking van de app.</div>
      </div>

      <Dialog onClose={() => setRegisterDialogOpen(false)} open={registerDialogOpen}>
        <div style={{padding: '20px', minWidth: '320px', maxWidth: '100%'}}>
          <Register close={() => setRegisterDialogOpen(false)} api={api}/>
        </div>
      </Dialog>

      <Dialog onClose={() => setResetDialogOpen(false)} open={resetDialogOpen}>
        <div style={{padding: '20px', minWidth: '320px', maxWidth: '100%'}}>
          <ResetPassword close={() => setResetDialogOpen(false)} api={api}/>
        </div>
      </Dialog>
    </div>
  );
};


export default ViewLogin;
