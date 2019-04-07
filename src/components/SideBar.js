import React, { Component } from 'react';
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

  render() {
    return (
      <div className="SideBar">
        <img className="Avatar" alt=""></img>
        <span className="NameGroup">
          <p className="Name">{this.props.user.name}</p>
          <p className="Name Status">{this.props.user.status}</p>
        </span>
        <span className="ButtonGroup">
          <Tab index={0} isActive={this.state.activeIndex === 0} onClick={this.handleClick} name="Dashboard"></Tab>
          {
            //<Tab index={1} isActive={this.state.activeIndex === 1} onClick={this.handleClick} name="Journals"></Tab>
          }
          <Tab index={2} isActive={this.state.activeIndex === 2} onClick={this.handleClick} name="Documents"></Tab>
        </span>
        <h3>Projects:</h3>
        <span className="ButtonGroup">
          {this.state.projects}
          {
            this.props.projects.map((name, i) => {
              return (
                <Tab index={i+3} key={i+3} isActive={this.state.activeIndex === (i+3)} onClick={this.handleClick} name={name}></Tab>
              )
            })
          }
        </span>
      </div>
    );
  }
}

class Tab extends Component {
  handleClick = () => this.props.onClick(this.props.index);
  
  render() {
    return (
      <div className={"Button" + (this.props.isActive===true ? " show":"")} onClick={this.handleClick}>{this.props.name}</div>
    )
  }
}

export default SideBar;