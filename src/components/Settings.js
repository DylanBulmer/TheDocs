
import React, { Component } from 'react';
import { Button, Checkbox, RadioGroup,
         Radio, FormControlLabel, Paper, 
         TextField, InputAdornment } from '@material-ui/core';
import MaskedInput from 'react-text-mask';
import '../css/settings.css';
import Team from './Team';

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
      <div className="SettingsPageGrid" style={{display:this.state.active ? "inline-grid" : "none"}}>
        <Paper className="AutoScroll">
          <h2>Project Settings</h2>
          <div className="SettingsGrid" style={{width: "416px"}}>
            <div style={{gridColumn: "span 2"}}>
              <h3>About:</h3>
            </div>
            <div style={{gridColumn: "span 2"}}>
              <TextField
                id="project_name"
                label="Name"
                fullWidth
                margin="none"
                variant="filled"
                color="primary"
              />
            </div>
            <div style={{gridColumn: "span 2"}}>
              <TextField
                id="project_desc"
                label="Description"
                fullWidth
                margin="none"
                variant="filled"
                color="primary"
              />
            </div>
            <div/>
            <div>
              <Button variant="contained" color="primary">Save</Button>
            </div>
          </div>
        </Paper>
        <div className="AutoScroll">
          <Team/>
        </div>
      </div>
    );
  }
}

function TextMaskCustom(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      placeholderChar={'_'}
      showMask
    />
  );
}

class UserSettings extends Component {

  state = {
    active: false,
    theme: 'dark'
  };

  constructor (props) {
    super(props);

    this.state.active = props.isActive;

    this.state.phonemask = '(  )    -    ';
    
  }

  handleChangeInput = name => event => {
    this.setState({phonemask: event.target.value});
  };

  onSave = () => {

    // Post to websocket

  }
  

  handleChange = event => {
    this.setState({ theme: event.target.value });
    
    this.props.setTheme(event.target.value);
  };


  static getDerivedStateFromProps(props, state) {
    state.active = props.isActive;
    return null;
  }

  render() {
    return (
      <Paper className="FullPage" style={{display:this.state.active ? "inline-block" : "none"}}>
        <h2>User's Settings</h2>
        <div className="SettingsGrid" style={{width: "416px"}}>
          <div style={{gridColumn: "span 2"}}>
            <h3>Account Settings:</h3>
          </div>
          <div>
            <TextField
              id="first_name"
              label="First Name"
              fullWidth
              margin="none"
              variant="filled"
              color="primary"
            />
          </div>
          <div>
            <TextField
              id="last_name"
              label="Last Name"
              fullWidth
              margin="none"
              variant="filled"
              color="primary"
            />
          </div>
          <div style={{gridColumn: "span 2"}}>
            <TextField
              id="email"
              type="email"
              label="Email"
              fullWidth
              margin="none"
              variant="filled"
              color="primary"
            />
          </div>
          <div style={{gridColumn: "span 2"}}>
            <TextField
              id="phone"
              label="Phone Number"
              fullWidth
              margin="none"
              variant="filled"
              color="primary"
              value={this.state.phonemask}
              onChange={this.handleChangeInput('textmask')}
              InputProps={{
                inputComponent: TextMaskCustom,
              }}
            />
          </div>
          <div style={{gridColumn: "span 2"}}>
            <h3>Reset Password:</h3>
          </div>
          <div>
            <TextField
              id="password"
              label="Password"
              type="password"
              fullWidth
              margin="none"
              variant="filled"
              color="primary"
            />
          </div>
          <div>
            <TextField
              id="confirm_password"
              label="Confirm Password"
              type="password"
              fullWidth
              margin="none"
              variant="filled"
              color="primary"
            />
          </div>
          <div style={{gridColumn: "span 2"}}>
            <h3>Notifications:</h3>
          </div>
          <div>Desktop Notifications:</div>
          <div>
            <Checkbox defaultChecked color="primary" />
          </div>
          <div>Email Notifications:</div>
          <div>
            <Checkbox defaultChecked={false} color="primary" />
          </div>
          <div>SMS Notifications:</div>
          <div>
            <Checkbox defaultChecked={false} color="primary" />
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
                control={<Radio color="primary" disabled />}
                label="Custom"
                labelPlacement="start"
              />
            </RadioGroup>
          </div>
          <div style={{gridColumn: "span 2"}}>
            <h3>Custom Theme: <i>(being developed)</i></h3>
          </div>
          <div style={{lineHeight: "56px"}} >Primary Color:</div>
          <div>
            <TextField
              id="primary"
              label="Hex Value"
              placeholder="000000"
              fullWidth
              margin="none"
              variant="filled"
              color="primary"
              disabled
              InputProps={{
                startAdornment: <InputAdornment position="start">#</InputAdornment>,
              }}
            />
          </div>
          <div style={{lineHeight: "56px"}} >Page Background Color:</div>
          <div>
            <TextField
              id="page_bg"
              label="Hex Value"
              placeholder="000000"
              fullWidth
              margin="none"
              variant="filled"
              color="primary"
              disabled
              InputProps={{
                startAdornment: <InputAdornment position="start">#</InputAdornment>,
              }}
            />
          </div>
          <div style={{lineHeight: "56px"}} >Paper Background Color:</div>
          <div>
            <TextField
              id="paper_bg"
              label="Hex Value"
              placeholder="000000"
              fullWidth
              margin="none"
              variant="filled"
              color="primary"
              disabled
              InputProps={{
                startAdornment: <InputAdornment position="start">#</InputAdornment>,
              }}
            />
          </div>
        </div>
      </Paper>
    );
  }

}

export { ProjectSettings, UserSettings };
