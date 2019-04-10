import React, { Component } from 'react';
import '../css/dashboard.css';

class Dashboard extends Component {

  state = {
    active: false
  }

  constructor (props) {
    super(props);

    this.state.activity = props.activity;
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
        <div className="Box">
          <h3>Create a new</h3>
          <span className="ButtonGroup" style={{marginBottom: 0}}>
            <div className="Button">Document</div>
            <div className="Button">Project</div>
          </span>
        </div>
        <div className="Box" style={{gridRow: "span 3", gridColumn: "span 1"}}>
          <h3>My Tasks</h3>
        </div>
        <div className="Box" style={{gridRow: "span 2"}}>
          <h3>Recent Activity</h3>
          <div className="DashHolder">
            {
              this.state.activity.map((activity, index, array) => {
                return (
                  <Activity key={"act-"+index} data={activity}></Activity>
                )
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

class Activity extends Component {

  render() {
    let data = this.props.data;
    return (
      <div className="Activity" >
        {data.user + " " + data.action + " a " + data.type + " for " + this.props.data.project}
      </div>
    )
  }

}

export default Dashboard;