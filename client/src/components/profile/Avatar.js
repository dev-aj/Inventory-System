import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { deepPurple } from '@material-ui/core/colors';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
    size: { height: 200, width: 200 },
  },

  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
}));

const LetterAvatars = ({ letter }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Avatar className={classes.purple}>{letter}</Avatar>
    </div>
  );
};

LetterAvatars.propTypes = {
  letter: PropTypes.string,
};

export default LetterAvatars;
