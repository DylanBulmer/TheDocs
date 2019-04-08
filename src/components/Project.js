import React, { Component } from 'react';
import '../css/project.css';
import { Settings } from '@material-ui/icons';

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
          <div className="Box" style={{gridRow: "span 1", gridColumn: "span 3", padding: "0.5em 1em"}}>
            <div className="Title">{this.props.name}</div>
            <span className="Settings">
              <Settings />
              Settings
            </span>
          </div>
          <div className="Box" style={{gridRow: "span 2"}}>
            <h3>Todo:</h3>
            <DropBox items={true} />
          </div>
          <div className="Box" style={{gridRow: "span 2"}}>
            <h3>In Progress:</h3>
            <DropBox />
          </div>
          <div className="Box" style={{gridRow: "span 2"}}>
            <h3>Completed:</h3>
            <DropBox />
          </div>
        </div>
    );
  }
}

class DropBox extends Component {
  state = {}

  drop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let data = e.dataTransfer.getData("text/plain");
    document.getElementById(data).style.opacity = 1;
    if (data !== e.target.id) e.target.appendChild(document.getElementById(data));
  }

  allowDrop = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  render() {
    return (
      <div onDrop={this.drop} onDragOver={this.allowDrop} className="DropBox" >
        {
          (this.props.items) ?
          [1,2,3,4,5].map((id, index, array) => {
            return <DragBox key={"box-"+id} id={id} />
          }) : null
        }
      </div>
    )
  }
}

class DragBox extends Component {
  state = {}

  drag = (e) => {
    e.dataTransfer.setData("text/plain", e.target.id);
    e.target.style.opacity = '0.4';
  }

  render () {
    return (
      <div id={"box-"+this.props.id} className="DragBox" draggable="true" onDragStart={this.drag}>Todo Task #{this.props.id}</div>
    )
  }
}

export default Project;