import React, { Component } from 'react';
import '../css/documents.css';
import { Paper } from '@material-ui/core';
import SearchBar from './SearchBar';

class Documents extends Component {

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
        <div className="Documents" style={{display:this.state.active ? "inline-grid" : "none"}}>
          <Paper style={{padding: "0.5em 1em"}}>
            <div className="Title">Documents</div>
            <SearchBar />
          </Paper>
          <Paper style={{padding:"0", overflow: "auto"}}>
            {
              [0,1,2,3,4,5,6,7,8,9].map((id) => {
                return (<Result key={id} title={"Document " + id}></Result>)
              })
            }
          </Paper>
        </div>
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

export default Documents;