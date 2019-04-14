import React, { Component } from 'react';
import '../css/project.css';
import { Settings } from '@material-ui/icons';
import { Button, MuiThemeProvider } from '@material-ui/core'
import theme from '../css/themes'

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
      <MuiThemeProvider theme={theme}>
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
          <div className="Box">
            <h3>Todo:</h3>
            <DropBox projectId={project.name} items={project.items} type="todo" />
          </div>
          <div className="Box">
            <h3>In Progress:</h3>
            <DropBox projectId={project.name} items={project.items} type="wip" />
          </div>
          <div className="Box">
            <h3>Completed:</h3>
            <DropBox projectId={project.name} items={project.items} type="completed" />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

class DropBox extends Component {
  state = {}

  drop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let data = e.dataTransfer.getData("text/plain");
    if (data !== e.target.id && e.target.classList.contains("DropBox")) e.target.appendChild(document.getElementById(data));
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
              ? <DragBox key={this.props.projectId+"-box-"+index} id={this.props.projectId+"-box-"+index} item={item} /> 
              : null
          }) : null
        }
      </div>
    )
  }
}

class DragBox extends Component {

  dragStart = (e) => {
    e.dataTransfer.setData("text/plain", e.target.id);
    e.target.style.opacity = '0.4';
  }

  dragEnd = (e) => {
    e.target.style.opacity = 1;
  }

  render () {
    return (
      <div id={this.props.id} className="DragBox" draggable="true" onDragStart={this.dragStart} onDragEnd={this.dragEnd}>
        <div>{this.props.item.text}</div>
        <div className="TaskAssignedTo">Assigned to {this.props.item.assigned}</div>
      </div>
    )
  }
}

export default Project;