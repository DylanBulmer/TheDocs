import React, { Component } from 'react';
import { Search, Settings } from '@material-ui/icons';
import { Button, Paper } from '@material-ui/core'
import '../css/sidebar.css';

class SideBar extends Component {

  state = {}

  constructor (props) {
    super(props);

    this.state.activeIndex = props.selected;
  }

  handleClick = (index) => {
    this.setState({ activeIndex: index });
    this.props.onUpdate(index);
  }

  openSettings = (e) => {
    this.setState({ activeIndex: -2 });
    this.props.onUpdate(-2); 
  }

  render() {
    return (
      <Paper className="SideBar" style={{paddingTop: "calc(40px + 2em)"}}>
        <div className="Menu" onClick={this.openSettings}>
          <img className="Avatar" alt=""></img>
          <span className="NameGroup">
            <p className="Name">{this.props.user.name}</p>
            <p className="Name Status">{this.props.user.status}</p>
          </span>
          <div className="MenuSettings">
            <Settings />
          </div>
        </div>
        <span className="ButtonGroup">
          <Tab index={0} isActive={this.state.activeIndex === 0} onClick={this.handleClick} name="Dashboard"></Tab>
          <Tab index={2} isActive={this.state.activeIndex === 2} onClick={this.handleClick} name="Documents"></Tab>
        </span>
        <h3>
          Projects:
          <span style={{float: "right"}}>
            <Search />
          </span>
        </h3>
        <span className="ButtonGroup">
          {this.state.projects}
          {
            this.props.projects.map((project, i) => {
              return (
                <Tab index={i+3} key={i+3} isActive={this.state.activeIndex === (i+3)} onClick={this.handleClick} name={project.name}></Tab>
              )
            })
          }
        </span>
      </Paper>
    );
  }
}

class Tab extends Component {
  handleClick = () => this.props.onClick(this.props.index);
  
  render() {
    return (
      <div>
        <Button className={(this.props.isActive===true ? " show":"")} color="primary" variant="contained" onClick={this.handleClick} >{this.props.name}</Button>
      </div>
    )
  }
}

export default SideBar;