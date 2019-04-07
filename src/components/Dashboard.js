import React, { Component } from 'react';
import '../css/dashboard.css';

class Dashboard extends Component {

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
      <div className="Dashboard" style={{display:this.state.active ? "inline-grid" : "none"}}>
        <div className="DashItem">
          <h3>Create a new</h3>
          <span className="ButtonGroup" style={{marginBottom: 0}}>
            <div className="Button">Journal</div>
            <div className="Button">Document</div>
            <div className="Button">Project</div>
          </span>
        </div>
        <div className="DashItem" style={{gridRow: "span 3", gridColumn: "span 1"}}>
          <h3>My Tasks</h3>
        </div>
        <div className="DashItem" style={{gridRow: "span 2"}}>
          <h3>Recent Activity</h3>
        </div>
      </div>
    );
  }
}

export default Dashboard;