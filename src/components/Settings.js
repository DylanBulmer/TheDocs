
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
        <h2>Settings</h2>
        <table className="SettingsTable">
          <thead></thead>
          <tbody>
            <tr>
              <td style={{width: "200px"}}>Project Name:</td>
              <td><Input /></td>
            </tr>
            <tr>
              <td>Description:</td>
              <td><textarea></textarea></td>
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

export { ProjectSettings };
