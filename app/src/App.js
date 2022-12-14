import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from '@material-ui/core/styles';
import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core';

import PronoProvider from './PronoProvider.js';
import UserProvider from "./UserProvider.js";
import PronoLayout from './Layout.js';

import { getApi } from './repository/firebase.js';

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
      secondary: "#444444",
      disabled: "#555555",
      hint: "#333333",
      headers: "#ffffff",
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


const tenantId = 'pronogroupid1';
const api = getApi(tenantId);

function App() {

  return (
    <div className="App" style={{height: '100%'}}>
      <ThemeProvider theme={redTheme}>
          <PronoProvider api={api}>
            <UserProvider api={api}>
              <BrowserRouter>
                <PronoLayout api={api}/>
              </BrowserRouter>
            </UserProvider>
          </PronoProvider>
      </ThemeProvider>

    </div>
  );

}

export default App;
