import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class LoginDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      username: null,
      password: null
    };
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.googleLogin = this.googleLogin.bind(this);
    this.enterUsername = this.enterUsername.bind(this);
    this.enterPassword = this.enterPassword.bind(this);
  }

  //
  // ─── METHODS ────────────────────────────────────────────────────────────────────
  //
  handleClickOpen() {
    this.setState({
      open: true
    });
  }

  handleClose() {
    this.setState({
      open: false
    });
  }

  enterUsername(e) {
    this.setState({
      username: e.target.value
    });
  }

  enterPassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  handleLogin() {
    // this.setState({
    //   open: false
    // });
    this.props.login(this.state.username, this.state.password);
  }

  googleLogin() {
    this.setState({
      open: false
    });
    this.props.googleLogin();
  }


  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //
  render() {
    console.log('ERROR', this.props.error);
    const loginError = this.props.error ? (
      <DialogContentText id="login-error">
        That user does not exist.
      </DialogContentText>
    ) : null;

    return (
      <div>
        <Button onClick={this.handleClickOpen}>Login</Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Login
              <Button
              variant="raised"
              style={{ float: 'right' }}
              href='/auth/google'>
              Login with Google</Button>
          </DialogTitle>
          <DialogContent>
            {loginError}
            <TextField
              id="full-width"
              label="Username"
              // InputLabelProps={{
              //   shrink: true,
              // }}
              fullWidth
              margin="normal"
              autoFocus={true}
              onChange={this.enterUsername}
            />
            <TextField
              id="full-width"
              label="Password"
              // InputLabelProps={{
              //   shrink: true,
              // }}
              fullWidth
              margin="normal"
              type="password"
              onChange={this.enterPassword}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose}>
              Cancel
            </Button>
            <Button onClick={this.handleLogin}>
              Login
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default LoginDialog;