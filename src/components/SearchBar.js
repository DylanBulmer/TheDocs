import React from 'react';
import { Search } from '@material-ui/icons';
import { InputBase } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';

const styles = theme => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.background.search, 0.05),
    '&:hover': {
      backgroundColor: fade(theme.palette.background.search, 0.15)
    },
    marginLeft: 0,
    width: '250px',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit
    },
    display: "inline-block",
    float: "right"
  },
  searchIcon: {
    width: theme.spacing.unit * 6,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit',
    width: '100%'
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 6,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200
      }
    }
  }
});

function SearchBar(props) {

  let { classes } = props;

  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <Search color="inherit"/>
      </div>
      <InputBase
        placeholder="Search…"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
      />
    </div>
  );
}

export default withStyles(styles)(SearchBar);