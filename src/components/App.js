import React, { Component } from 'react';
import Dashboard from './Dashboard';
import Documents from './Documents';
import SideBar from './SideBar';
import '../css/app.css';
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
    projects: ["Website", "The Docs", "The Map Game"],
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
        <Project name={this.state.projects[this.state.selectedProject]} index={this.state.selected} isActive={this.state.selected > 2} />
      </div>
    );
  }
}

export default App;
