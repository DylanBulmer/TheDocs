import React, { Component } from 'react';
import { Button, TextField, Paper } from '@material-ui/core';
import '../css/login.css';

class Login extends Component {

  constructor (props) {
    super(props);
  }

  onLoggedIn = () => {

    this.props.onLogin({
      name: document.getElementById('name').value,
      status: document.getElementById('status').value,
      avatar: ""
    });

  }

  render() {
    return (
      <Paper className="Login Box">
        <div style={{width: "100%", textAlign: "center"}}>
          <div className="Title">The Docs</div>
          <h3>Login</h3>
        </div>
        <br/>
        <TextField 
          id="name"
          label="Name"
          margin="dense"
          variant="filled"
          color="primary"
          fullWidth ></TextField>
        <TextField 
          id="status"
          label="Status"
          margin="dense"
          variant="filled"
          color="primary"
          fullWidth ></TextField>
          <Button className="small" variant="contained" color="primary" onClick={this.onLoggedIn}>Login</Button>
      </Paper>
    );
  }
}

export { Login as default };
