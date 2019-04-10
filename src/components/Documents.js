import React, { Component } from 'react';
import { Search } from '@material-ui/icons';
import { TextField } from '@material-ui/core'
import '../css/documents.css';

class Documents extends Component {

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
      <div className="Documents" style={{display:this.state.active ? "inline-grid" : "none"}}>
        <div className="Box" style={{padding: "0.5em 1em"}}>
          <div className="Title">Documents</div>
          <span style={{height: "30px", float: "right", display: "inline-block", verticalAlign: "middle"}}>
          {
            /*<TextField
              id="outlined-search"
              label="Search field"
              type="search"
              margin="normal"
              variant="outlined" />*/
          }
            <input className="Search" placeholder="Search The Docs" />
            <div className="SearchBtn">
              <Search />
            </div>
          </span>
        </div>
        <div className="Box" style={{padding:"0", overflow: "auto"}}>
          {
            [0,1,2,3,4,5,6,7,8,9].map((id) => {
              return (<Result key={id} title={"Document " + id}></Result>)
            })
          }
        </div>
      </div>
    );
  }
}

class Result extends Component {

  render() {
    return ( 
      <div className="DocResult">
        <div>
          <div className="DocTitle">{this.props.title}</div>
          &nbsp;| Dylan Bulmer
        </div>
        <div>This is the summary or abstract to this document </div>
      </div>
    )
  }

}

export default Documents;