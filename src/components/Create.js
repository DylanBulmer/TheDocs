import React, { Component } from 'react';
import { Button, Input } from '@material-ui/core';
import '../css/settings.css';

class CreateDoc extends Component {

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
        <div>Create a new document</div>
      </div>
    );
  }
}

export { CreateDoc };
