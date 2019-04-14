import React, { Component } from 'react';
import Dashboard from './Dashboard';
import Documents from './Documents';
import SideBar from './SideBar';
import { ProjectSettings, UserSettings } from './Settings';
import '../css/app.css';
import '../css/dark.css';
import '../css/markdown.css';
import Project from './Project';

class App extends Component {

  state = {
    user: {
      name: "Dylan Bulmer",
      status: "Workin' Hard",
      avatar: ""
    },
    selected: 0,
    projects: [
      {"name": "Website", "items": [
        {
          "type": "todo",
          "text": "Do a thing",
          "assigned": "Dylan Bulmer"
        },{
          "type": "wip",
          "text": "Do a thing",
          "assigned": "Dylan Bulmer"
        },{
          "type": "wip",
          "text": "Do a thing",
          "assigned": "Dylan Bulmer"
        },{
          "type": "wip",
          "text": "Do a thing",
          "assigned": "Dylan Bulmer"
        },{
          "type": "completed",
          "text": "Do a thing",
          "assigned": "Dylan Bulmer"
        }]
      },
      {"name": "The Docs", "items": [
        {
          "type": "wip",
          "text": "Do a thing",
          "assigned": "Dylan Bulmer"
        },{
          "type": "wip",
          "text": "Do a thing",
          "assigned": "Dylan Bulmer"
        },{
          "type": "wip",
          "text": "Do a thing",
          "assigned": "Dylan Bulmer"
        },{
          "type": "completed",
          "text": "Do a thing",
          "assigned": "Dylan Bulmer"
        },{
          "type": "completed",
          "text": "Do a thing",
          "assigned": "Dylan Bulmer"
        }]
      },
      {"name": "The Map Game", "items": [
        {
          "type": "todo",
          "text": "Do a thing",
          "assigned": "Dylan Bulmer"
        },{
          "type": "todo",
          "text": "Do a thing",
          "assigned": "Dylan Bulmer"
        },{
          "type": "todo",
          "text": "Do a thing",
          "assigned": "Dylan Bulmer"
        },{
          "type": "wip",
          "text": "Do a thing",
          "assigned": "Dylan Bulmer"
        },{
          "type": "wip",
          "text": "Do a thing",
          "assigned": "Dylan Bulmer"
        }]
      }
    ],
    activity: [
      {"project": "The Map Game", "user": "Dylan Bulmer", "type": "document", "action": "edited"},
      {"project": "The Docs",     "user": "Dylan Bulmer", "type": "document", "action": "created"},
      {"project": "Website",      "user": "Dylan Bulmer", "type": "task",     "action": "create"},
      {"project": "The Docs",     "user": "Dylan Bulmer", "type": "task",     "action": "completed"}
    ],
    selectedProject: 0
  };

  handleClick = (index) => {

    if (index > 2) {
      this.setState({
        selectedProject: index - 3,
        selected: index
      });
    } else {
      this.setState({ selected: index });
    }
  }

  render() {
    return (
      <div className="App">
        <SideBar user={this.state.user} selected={this.state.selected} projects={this.state.projects} onUpdate={this.handleClick} />
        <Dashboard index={0} isActive={this.state.selected === 0} activity={this.state.activity} />
        <Documents index={2} isActive={this.state.selected === 2} />
        {
          this.state.projects.map((project, index) => {
            return (
              <Project key={"project-"+index} project={project} index={index+3} isActive={this.state.selected === index + 3} onUpdate={this.handleClick}></Project>
            )
          })
        }
        <ProjectSettings index={-1} isActive={this.state.selected === -1} onUpdate={this.handleClick}/>
        <UserSettings index={-2} isActive={this.state.selected === -2} />
      </div>
    );
  }
}

export default App;
