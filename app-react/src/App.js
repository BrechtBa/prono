import PronoLayout from './Layout.js';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';


const redTheme = createMuiTheme({
  palette: {
    background: {
      default: "#ab0000",
      gradient: "linear-gradient(#DD0000, #440000)",
      paper: "#ffffff"
    },
    primary: {
      main: "#ffffff",
      light: "rgba(55, 55, 55, 1)",
      dark: "rgba(10, 10, 10, 1)",
      contrastText: "#333333",
    },
    secondary: {
      main: "rgba(229, 229, 229, 1)",
      light: "rgba(220, 220, 220, 1)",
      dark: "rgba(200, 200, 200, 1)",
      contrastText: "rgba(33, 33, 33, 1)",
    },
    text: {
      primary: "#333333",
      secondary: "#333333",
      disabled: "#555555",
      hint: "#333333",
    },
  },

  overrides: {
    MuiSlider: {
      colorPrimary: {
        color: "rgba(240, 240, 240, 1)",
      },
    },
  }

});


function App() {

  const isAuthenticated = true;
  const user = {
    displayName: 'BB',
    permissions: {
      admin: true
    }
  };

  return (
    <div className="App" style={{height: '100%'}}>
      <ThemeProvider theme={redTheme}>
        <PronoLayout isAuthenticated={isAuthenticated} user={user}/>
      </ThemeProvider>
    </div>
  );

}

export default App;