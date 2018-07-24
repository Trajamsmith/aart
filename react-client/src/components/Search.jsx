import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LoginDialog from './LoginDialog.jsx';
import SubscribeDialog from './SubscribeDialog.jsx';
import UserMenu from './UserMenu.jsx';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.keyUp = props.keyUp.bind(this);
  }

  searchByArtist(e) {
    if (e.key === 'Enter') {
      return this.keyUp(e.target.value);
    }
  }

  render() {
    const authentication = this.props.loggedIn ?
      (
        <UserMenu
          logout={this.props.logout}
          username={this.props.username} />
      )
      : (
        <Toolbar style={{
          padding: '0px'
        }}>
          <LoginDialog
            login={this.props.login}
            error={this.props.error} />
          <SubscribeDialog subscribe={this.props.subscribe} />
        </Toolbar>
      );

    return (
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography
            variant="title"
            color="inherit"
            className={'title'}
            style={{
              marginRight: '30px',
              fontFamily: '"Amatic SC", cursive',
              fontSize: '70px'
            }}>
            AArt
          </Typography>
          <TextField
            className="search-bar"
            id="full-width"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder=".   .   ."
            fullWidth
            margin="normal"
            onKeyUp={this.searchByArtist.bind(this)} />

          {authentication}
        </Toolbar>
      </AppBar>)
  }
}

export default Search;