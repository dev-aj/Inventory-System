import React, { useState, Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addItems, getItemNames } from '../../actions/stocks';
import clsx from 'clsx';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Loader from '../layout/Loader';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing(3),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: '25ch',
  },
  button: {
    margin: theme.spacing(3),
  },
  formControl: {
    margin: theme.spacing(3),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(3),
  },
}));
function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}
const Createstock = ({
  addItems,
  getItemNames,
  stocks: { item_names, loading, msg, error },
}) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = useState({
    item_name: '',
    quantity: '',
    rate: '',
  });

  const { item_name, rate, quantity } = formData;

  useEffect(() => {
    getItemNames();
  }, [getItemNames]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log('Form: ', formData);
    addItems(formData, 1);
    setFormData({ ...formData, item_name: '', rate: '', quantity: '' });
    setOpen(true);
  };

  return (
    <Fragment>
      <br />
      <br />
      {loading ? (
        <Loader />
      ) : (
        <form>
          <div>
            <FormControl variant='outlined' className={classes.formControl}>
              <InputLabel id='demo-simple-select-outlined-label'>
                Item Name
              </InputLabel>
              <Select
                labelId='demo-simple-select-outlined-label'
                id='demo-simple-select-outlined'
                value={item_name}
                onChange={(e) => onChange(e)}
                label='Item Name'
                name='item_name'
              >
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
                {item_names.map((item) => (
                  <MenuItem value={item.item_name} key={item.item_name}>
                    {item.item_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label='Enter Rate Of Item'
              id='outlined-start-adornment'
              type='number'
              className={clsx(classes.margin, classes.textField)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>/Pc</InputAdornment>
                ),
              }}
              variant='outlined'
              name='rate'
              value={rate}
              onChange={(e) => onChange(e)}
            />
            <TextField
              label='Enter Quantity Of Item'
              id='outlined-start-adornment'
              type='number'
              className={clsx(classes.margin, classes.textField)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>Pcs</InputAdornment>
                ),
              }}
              variant='outlined'
              name='quantity'
              value={quantity}
              onChange={(e) => onChange(e)}
            />
          </div>
          <div>
            <Button
              variant='contained'
              color='primary'
              size='small'
              className={classes.button}
              startIcon={<SaveIcon />}
              onClick={(e) => onSubmit(e)}
            >
              Submit
            </Button>
          </div>
        </form>
      )}
      {msg !== null ? (
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
          <Alert onClose={handleClose} severity='success'>
            {msg}!
          </Alert>
        </Snackbar>
      ) : (
        ''
      )}
    </Fragment>
  );
};

Createstock.propTypes = {
  addItems: PropTypes.func.isRequired,
  getItemNames: PropTypes.func.isRequired,
  stocks: PropTypes.object,
};

const mapStateToProps = (state) => ({
  stocks: state.stock,
});

export default connect(mapStateToProps, { addItems, getItemNames })(
  Createstock
);
