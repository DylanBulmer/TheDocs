import React, { Component } from 'react';
import '../css/project.css';
import { Settings } from '@material-ui/icons';
import { Button } from '@material-ui/core'

class Project extends Component {

  state = {
    active: false
  }

  constructor (props) {
    super(props);

    this.state.active = props.isActive;
  }

  handleClick = () => {
    this.props.onUpdate(-1);
  }

  // updates this component everytime App is updated.
  static getDerivedStateFromProps(props, state) {
    state.active = props.isActive;
    state.project = props.project;
    return null;
  }

  render() {
    let project = this.state.project;
    return (
        <div className="Project" style={{display:this.state.active ? "inline-grid" : "none"}}>
          <div className="Box" style={{gridRow: "span 1", gridColumn: "span 3", padding: "0.5em 1em"}}>
            <div className="Title">{project.name}</div>
            <span className="Settings">
              <Button variant="outlined" size="small" onClick={this.handleClick}>
                <Settings style={{fontSize: "20px", marginRight: "4px"}} />
                Settings
              </Button>
            </span>
          </div>
          <div className="Box" style={{gridRow: "span 2"}}>
            <h3>Todo:</h3>
            <DropBox projectId={project.name} items={project.items} type="todo" />
          </div>
          <div className="Box" style={{gridRow: "span 2"}}>
            <h3>In Progress:</h3>
            <DropBox projectId={project.name} items={project.items} type="wip" />
          </div>
          <div className="Box" style={{gridRow: "span 2"}}>
            <h3>Completed:</h3>
            <DropBox projectId={project.name} items={project.items} type="completed" />
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
          (this.props.items.length !== 0) ?
          this.props.items.map((item, index, array) => {
            let type = this.props.type;
            return (item.type === type) 
              ? <DragBox key={this.props.projectId+"-box-"+index} id={this.props.projectId+"-box-"+index} text={item.text} /> 
              : null
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
      <div id={this.props.id} className="DragBox" draggable="true" onDragStart={this.drag}>{this.props.text}</div>
    )
  }
}

export default Project;