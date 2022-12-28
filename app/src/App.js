import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material';

import PronoProvider from './PronoProvider.js';
import UserProvider from "./UserProvider.js";
import { Routes, Route } from "react-router-dom";

import { getApi } from './repository/firebase.js';

import { PronoWrapper } from './Layout.js';
import ViewRanking from './ViewRanking.js';
import ViewProfile from './ViewProfile.js';
// import ViewProno from './ViewProno.js';
// import ViewResults from './ViewResults.js';
import ViewRules from './ViewRules.js';

// import ViewSettings from './ViewSettings.js';
// import ViewUsers from './ViewUsers.js';
// import ViewMatches from './ViewMatches.js';
// import ViewTeams from './ViewTeams.js';
// import ViewGroupstage from './ViewGroupstage.js';
// import ViewKnockoutstage from './ViewKnockoutstage.js';



const redTheme = createTheme({
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

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: "#333333",
        }
      }
    }
  }

});


const tenantId = 'tenantId1';
const api = getApi(tenantId);

function App() {

  return (
    <div className="App" style={{height: '100%'}}>
      <ThemeProvider theme={redTheme}>
          <PronoProvider api={api}>
            <UserProvider api={api}>
              <BrowserRouter>

                <Routes>

                  {/* 
                  <Route path="/:squad/prono"> <ViewProno api={api}/> </Route>
                  <Route path="/:squad/results"> <ViewResults api={api}/> </Route>
                  <Route path="/:squad/rules">  <ViewRules api={api}/> </Route>

                  <Route path="/users"> <ViewUsers api={api}/> </Route>
                  <Route path="/settings"> <ViewSettings api={api}/> </Route>
                  <Route path="/teams"> <ViewTeams api={api}/> </Route>
                  <Route path="/matches"> <ViewMatches api={api}/> </Route>
                  <Route path="/groupstage"> <ViewGroupstage api={api}/> </Route>
                  <Route path="/knockoutstage"> <ViewKnockoutstage api={api}/> </Route>*/}


                  <Route path="/ranking/:squad" element={ <PronoWrapper api={api} content={ <ViewRanking api={api}/> }/> } />
                  <Route path="/ranking" element={ <PronoWrapper api={api} content={ <ViewRanking api={api}/> }/> } /> 
                  <Route path="/profile" element={ <PronoWrapper api={api} content={ <ViewProfile api={api}/> }/> } />

                  <Route path="/rules" element={ <PronoWrapper api={api} content={ <ViewRules api={api}/> }/> } />
                  <Route path="/:squad" element={ <PronoWrapper api={api} content={ <ViewRanking api={api}/> }/> } /> 
                  <Route path="/" element={ <PronoWrapper api={api} content={ <ViewRanking api={api}/> }/> } /> 

                </Routes>

              </BrowserRouter>
            </UserProvider>
          </PronoProvider>
      </ThemeProvider>

    </div>
  );

}

export default App;
