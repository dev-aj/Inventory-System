import React from 'react';
import { emphasize, withStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Chip from '@material-ui/core/Chip';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import HomeIcon from '@material-ui/icons/Home';
const StyledBreadcrumb = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.info.light,
    height: theme.spacing(3),
    color: theme.palette.grey[800],
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.warning.light,
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(theme.palette.grey[300], 0.12),
    },
  },
}))(Chip); // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591

const ActionSelector = (props) => {
  function handleClick(val) {
    props.setView(val);
    // console.info('You clicked a breadcrumb.', val);
  }
  return (
    <Breadcrumbs aria-label='breadcrumb'>
      <StyledBreadcrumb
        label={props.options[0]}
        icon={<ShowChartIcon fontSize='small' />}
        onClick={() => handleClick('view')}
      />
      <StyledBreadcrumb
        label={props.options[1]}
        icon={<AddCircleOutlineIcon fontSize='small' />}
        onClick={() => handleClick('add')}
      />
      {props.options.length >= 3 ? (
        <StyledBreadcrumb
          label={props.options[2]}
          icon={<HomeIcon fontSize='small' />}
          onClick={() => handleClick('remove')}
        />
      ) : (
        ''
      )}
    </Breadcrumbs>
  );
};

export default ActionSelector;
