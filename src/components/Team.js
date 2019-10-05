import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary,
         Typography, List, ListItem, ListItemText } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  list: {
    width: '100%',
    maxWidth: '360px',
    backgroundColor: theme.palette.background.paper,
  }
});

class Team extends React.Component {
  state = {
    expanded: null,
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  render() {
    const { classes } = this.props;
    const { expanded } = this.state;

    return (
      <div className={classes.root}>
        <ExpansionPanel expanded={expanded==='panel1' } onChange={this.handleChange( 'panel1')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Dev Team</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <List component="nav" className={classes.list}>
              { 
                [1,2,3,4].map((name, index) => { 
                  return (
                    <ListItem key={index}>
                      <ListItemText primary={"Memeber " + name} />
                    </ListItem>
                  )
                })
              }
            </List>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel expanded={expanded==='panel2' } onChange={this.handleChange( 'panel2')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Design Team</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <List component="nav" className={classes.list}>
              { 
                [1,2,3].map((name, index) => { 
                  return (
                    <ListItem key={index}>
                      <ListItemText primary={"Memeber " + name} />
                    </ListItem>
                  )
                })
              }
            </List>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel expanded={expanded==='panel3' } onChange={this.handleChange( 'panel3')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Support Team</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <List component="nav" className={classes.list}>
              { 
                [1,2,3].map((name, index) => { 
                  return (
                    <ListItem key={index}>
                      <ListItemText primary={"Memeber " + name} />
                    </ListItem>
                  )
                })
              }
            </List>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

Team.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Team);