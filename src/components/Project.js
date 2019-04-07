import React, { Component } from 'react';
import '../css/project.css';

class Project extends Component {

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
        <div className="Project" style={{display:this.state.active ? "inline-grid" : "none"}}>
          <div className="Box" style={{gridRow: "span 1", gridColumn: "span 3"}}>
            <div className="Title">{this.props.name}</div>
          </div>
          <div className="Box" style={{gridRow: "span 2"}}>
            <h3>Todo:</h3>
          </div>
          <div className="Box" style={{gridRow: "span 2"}}>
            <h3>In Progress:</h3>
          </div>
          <div className="Box" style={{gridRow: "span 2"}}>
            <h3>Completed:</h3>
          </div>
        </div>
    );
  }
}

export default Project;