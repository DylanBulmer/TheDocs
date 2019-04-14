
import React, { Component } from 'react';
import { Button, Checkbox, RadioGroup, Radio, FormControlLabel, MuiThemeProvider } from '@material-ui/core';
import '../css/settings.css';
import theme from '../css/themes'

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
      <MuiThemeProvider theme={theme}>
        <div className="FullPage Box" style={{display:this.state.active ? "inline-block" : "none"}}>
          <h2>Project Settings</h2>
          <div className="SettingsGrid">
            <div>Project Name:</div>
            <div>
              <div className="InputWrapper">
                <input placeholder="Project Name" />
              </div>
            </div>
            <div>Description:</div>
            <div>
              <div className="InputWrapper">
                <textarea></textarea>
              </div>
            </div>
            <div>Project Manager:</div>
            <div>Manage's Name</div>
            <div>Transfer Manager:</div>
            <div><Button variant="contained" >Transfer</Button></div>
            <div>Members:</div>
            <div><i>List on members and add memeber button</i></div>
            <div>Leave Project</div>
            <div><Button variant="contained" >Leave</Button></div>
            <div></div>
            <div><Button variant="contained" >Save</Button></div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

class UserSettings extends Component {

  state = {
    active: false,
    theme: 'dark'
  };

  constructor (props) {
    super(props);

    this.state.active = props.isActive;
  }

  onSave = () => {

    // Post to websocket

  }

  handleChange = event => {
    this.setState({ theme: event.target.value });
  };


  static getDerivedStateFromProps(props, state) {
    state.active = props.isActive;
    return null;
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className="FullPage Box" style={{display:this.state.active ? "inline-block" : "none"}}>
          <h2>User's Settings</h2>
          <div className="SettingsGrid" style={{width: "416px"}}>
            <div style={{gridColumn: "span 2"}}>
              <h3>Account Settings:</h3>
            </div>
            <div>
              <div className="InputWrapper">
                <input placeholder="First Name" />
              </div>
            </div>
            <div>
              <div className="InputWrapper">
                <input placeholder="Last Name" />
              </div>
            </div>
            <div style={{gridColumn: "span 2"}}>
              <div className="InputWrapper" style={{width: "calc(100% - 2px)"}}>
                <input placeholder="Email" />
              </div>
            </div>
            <div style={{gridColumn: "span 2"}}>
              <h3>Notifications:</h3>
            </div>
            <div>Desktop Notifications:</div>
            <div>
              <Checkbox defaultChecked style={{padding: 0, color: "#2196f3"}} />
            </div>
            <div>Email Notifications:</div>
            <div>
              <Checkbox defaultChecked={false} disabled style={{padding: 0, color: "#2196f3"}} />
            </div>
            <div style={{gridColumn: "span 2"}}>
              <h3>Theme:</h3>
            </div>
            <div style={{gridColumn: "span 2", textAlign: "center"}}>
              <RadioGroup
                aria-label="theme"
                name="theme"
                value={this.state.theme}
                onChange={this.handleChange}
                row
              >
                <FormControlLabel
                  value="light"
                  control={<Radio color="primary" />}
                  label="Light"
                  labelPlacement="start"
                />
                <FormControlLabel
                  value="dark"
                  control={<Radio color="primary" />}
                  label="Dark"
                  labelPlacement="start"
                />
                <FormControlLabel
                  value="custom"
                  control={<Radio color="primary" />}
                  label="Custom"
                  labelPlacement="start"
                />
              </RadioGroup>
            </div>
            <div style={{gridColumn: "span 2"}}>
              <h3>Color Scheme:</h3>
            </div>
            <div>Button Color:</div>
            <div>
              <div className="InputWrapper">
                <input placeholder="000000" defaultValue="" pattern="[a-fA-F\d]+" />
              </div>
            </div>
            <div>Page Background Color:</div>
            <div>
              <div className="InputWrapper">
                <input placeholder="000000" defaultValue="" pattern="[a-fA-F\d]+" />
              </div>
            </div>
            <div>Content Background Color:</div>
            <div>
              <div className="InputWrapper">
                <input placeholder="000000" defaultValue="" pattern="[a-fA-F\d]+" />
              </div>
            </div>
            <div></div>
            <div><Button variant="contained" style={{float: "right"}} >Save</Button></div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }

}

export { ProjectSettings, UserSettings };
