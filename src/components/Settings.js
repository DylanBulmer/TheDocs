
import React, { Component } from 'react';
import { Button, Input } from '@material-ui/core';
import '../css/settings.css';

class ProjectSettings extends Component {

  state = {
    active: false
  }

  constructor (props) {
    super(props);

    this.state.active = props.isActive;
  }

  onSave = () => {

    // Post to websocket

  }

  static getDerivedStateFromProps(props, state) {
    state.active = props.isActive;
    return null;
  }

  render() {
    return (
      <div className="FullPage Box" style={{display:this.state.active ? "inline-block" : "none"}}>
        <h2>Project Settings</h2>
        <table className="SettingsTable">
          <tbody>
            <tr>
              <td>Project Name:</td>
              <td><Input /></td>
            </tr>
            <tr>
              <td>Description:</td>
              <td><textarea></textarea></td>
            </tr>
            <tr>
              <td>Transfer project manager:</td>
              <td><Button variant="contained" >Transfer</Button></td>
            </tr>
            <tr>
              <td>Add a member:</td>
              <td><Button variant="contained" >Add</Button></td>
            </tr>
            <tr>
              <td>Leave Project?</td>
              <td><Button variant="contained" >Leave</Button></td>
            </tr>
            <tr>
              <td></td>
              <td><Button variant="contained" >Save</Button></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

class UserSettings extends Component {

  state = {
    active: false
  }

  constructor (props) {
    super(props);

    this.state.active = props.isActive;
  }

  onSave = () => {

    // Post to websocket

  }

  static getDerivedStateFromProps(props, state) {
    state.active = props.isActive;
    return null;
  }

  render() {
    return (
      <div className="FullPage Box" style={{display:this.state.active ? "inline-block" : "none"}}>
        <h2>User's Settings</h2>
      </div>
    );
  }

}

export { ProjectSettings };
