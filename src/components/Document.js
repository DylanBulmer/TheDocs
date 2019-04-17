import React, { Component } from 'react';
import { Search } from '@material-ui/icons';
import '../css/document.css';
import { Paper } from '@material-ui/core';

class Document extends Component {

  state = {
    active: false
  }

  constructor (props) {
    super(props);

    this.state.active = props.isActive;
  }

  // updates this component everytime App is updated.
  static getDerivedStateFromProps(props, state) {
    state.active = props.isActive;
    return null;
  }

  render() {
    return (
        <Paper className="Document" style={{display:this.state.active ? "inline-grid" : "none"}}>
          <div style={{padding: "0.5em 1em"}}>
            <div className="Title">Documents</div>
          </div>
        </Paper>
    );
  }
}

class Result extends Component {

  render() {
    return ( 
      <div className="DocResult">
        <div>
          <div className="DocTitle">{this.props.title}</div>
          &nbsp;| The Docs
        </div>
        <div className="DocAuthor">
          By Dylan Bulmer on 00/00/0000
        </div>
        <div>This is the summary or abstract to this document </div>
      </div>
    )
  }

}

export default Document;