import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

const styles = {
  avatar: {
    marginRight: 8,
    width: 40,
    height: 40,
    verticalAlign: "middle",
    display: "inline-flex"
  }
};

function DynamicAvatar(props) {
  const { classes, user } = props;

  return (
    <Avatar alt={user.name} className={classes.avatar} >{user.name.substring(0, 1)}</Avatar>
  );
}

DynamicAvatar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DynamicAvatar);