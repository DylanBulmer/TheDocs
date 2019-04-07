import React, { Component } from 'react';
import '../css/documents.css';

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
      <div className="Documents" style={{display:this.state.active ? "inline-block" : "none"}}>
        <div className="Title">Documents</div>
        <span style={{position:"absolute", height: "40px", top: "1em", right: "1em", display: "inline-block"}}>
          <input className="Search" />
          <div className="SearchBtn">Search</div>
        </span>
      </div>
    );
  }
}

export default Documents;