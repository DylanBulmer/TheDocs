import React, { Component } from 'react';
import Dashboard from './Dashboard';
import Documents from './Documents';
import SideBar from './SideBar';
import { ProjectSettings, UserSettings } from './Settings';
import '../css/app.css';
import '../css/dark.css';
import '../css/markdown.css';
import Project from './Project';
import Theme from '../css/themes';
import { MuiThemeProvider } from '@material-ui/core';

class App extends Component {

  state = {
    themeClass: new Theme('dark'),
    theme: null,
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

  constructor (props) {
    super();
    this.state.theme = this.state.themeClass.getTheme();
  }

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

  setTheme = (type, custom) => {
    switch (type) {
      case "light":
        if (document.body.classList.contains("dark")) {
          document.body.classList.remove("dark");
          this.state.themeClass.setPalette("light");
          this.setState({theme: this.state.themeClass.getTheme()});
        }
        break;
      case "dark":
      case "custom":
      default:
        if (!document.body.classList.contains("dark")) {
          document.body.classList.add("dark");
          this.state.themeClass.setPalette("dark");
          this.setState({theme: this.state.themeClass.getTheme()});
        }
        break;
    }
  }

  render() {
    return (
      <div className="App">
        <MuiThemeProvider theme={this.state.theme}>
          <SideBar user={this.state.user} selected={this.state.selected} projects={this.state.projects} onUpdate={this.handleClick} />
        </MuiThemeProvider>
        <MuiThemeProvider theme={this.state.theme}>
          <Dashboard index={0} isActive={this.state.selected === 0} activity={this.state.activity} />
        </MuiThemeProvider>
        <MuiThemeProvider theme={this.state.theme}>
          <Documents index={2} isActive={this.state.selected === 2} />
        </MuiThemeProvider>        
        <MuiThemeProvider theme={this.state.theme}>
          {
            this.state.projects.map((project, index) => {
              return (
                <Project key={"project-"+index} project={project} index={index+3} isActive={this.state.selected === index + 3} onUpdate={this.handleClick}></Project>
              )
            })
          }
        </MuiThemeProvider>
        <MuiThemeProvider theme={this.state.theme}>
          <ProjectSettings index={-1} isActive={this.state.selected === -1} onUpdate={this.handleClick}/>
        </MuiThemeProvider>
        <MuiThemeProvider theme={this.state.theme}>
          <UserSettings index={-2} isActive={this.state.selected === -2} setTheme={this.setTheme} />
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
