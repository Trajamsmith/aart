import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import axios from 'axios';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import { GridLoader } from 'react-spinners';
import Search from './components/Search.jsx';
import WordCloud from './components/WordCloud.jsx';
import AlbumGrid from './components/AlbumGrid.jsx';
import Welcome from './components/Welcome.jsx';

//
// ─── MATERIAL UI THEMING ────────────────────────────────────────────────────────
//
const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#212121',
      light: '#ffffff',
      dark: '#bcbcbc'
    },
    secondary: {
      main: '#eeeeee',
      light: '#8e8e8e',
      dark: '#373737'
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
});

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});


//
// ─── APP ITSELF ─────────────────────────────────────────────────────────────────
//
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currArtistName: null,
      currAlbumUrls: [],
      currAttributes: null,

      welcome: true,
      loading: false,

      loggedIn: false,
      loggedInUsername: null,
      loginError: false,
    };
  }

  componentDidMount() {
    console.log('PAGE RELOADED');
    axios.get('/checklogin')
      .then(res => {
        console.log(res);
        if (res.data.user) {
          console.log('Logged in as:', res.data.user.username);
          this.setState({
            loggedIn: true,
            loggedInUsername: res.data.user.username,
            loginError: false,
          });
        }
      });
  }

  search(artist) {
    this.setState({
      currArtistName: null,
      currAlbumUrls: [],
      currAttributes: null,
      loading: true,
      welcome: false
    });
    axios.get('/albums', { params: { artistName: artist } })
      .then(res => {
        this.setState({
          currArtistName: res.data.artistName,
          currAlbumUrls: res.data.nameUrls,
          currAttributes: res.data.annotations,
          loading: false
        });
      })
      .catch(err => console.log('WHAT IS THIS ERROR', err));
  }


  //
  // ─── USER AUTH ──────────────────────────────────────────────────────────────────
  //
  subscribe(email, username, password) {
    console.log(`Subscribe with ${username} and ${password}`);
    axios.get('/subscribe', {
      params: {
        email,
        username,
        password
      }
    })
      .then(
        this.setState({
          loggedIn: true,
          loggedInUsername: username
        }))
      .catch(console.log);
  }

  login(username, password) {
    console.log(`Login with ${username} and ${password}`);
    axios.post('/login', {
      username,
      password
    })
      .then(res => {
        console.log('DATA', res);
        if (res.config.data) {
          console.log('Logged in as:', JSON.parse(res.config.data).username);
          this.setState({
            loggedIn: true,
            loggedInUsername: JSON.parse(res.config.data).username
          });
        }
      })
      .catch(
        (error => {
          console.log(this);
          this.setState({
            loginError: true
          });
        })()
      );
  }

  logout() {
    axios.get('/logout')
      .then(res => {
        console.log('Logging out');
        this.setState({
          loggedIn: false,
          loginError: false
        });
      })
  }


  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        {/* <CssBaseline /> */}
        <Search
          keyUp={this.search.bind(this)}
          login={this.login.bind(this)}
          logout={this.logout.bind(this)}
          subscribe={this.subscribe.bind(this)}
          loggedIn={this.state.loggedIn}
          username={this.state.loggedInUsername}
          error={this.state.loginError} />

        {/* LOADING SPINNER */}
        {this.state.loading ? (<div class="spinner">
          <GridLoader
            color={'#0f0f0f'}
            loading={this.state.loading}
            size='30'
          />
        </div>) : null}

        <Grid container spacing={8}>

          {/* WELCOME VIEW */}
          {this.state.welcome ?
            <Grid container justify='center'>
              <Welcome />
            </Grid> : null}


          {/* SEARCH VIEW */}
          <Grid item xs={3}>
            <WordCloud
              artist={this.state.currArtistName}
              words={this.state.currAttributes} />
          </Grid>
          <Grid item xs={9} style={{ 'margin-top': '10px' }}>
            <AlbumGrid
              albumUrls={this.state.currAlbumUrls} />
          </Grid>
        </Grid>
      </MuiThemeProvider>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));