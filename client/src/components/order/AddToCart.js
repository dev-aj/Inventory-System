import React, { useState, Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { insertIntoCart, getItems } from '../../actions/orders';
import clsx from 'clsx';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
//import MuiAlert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import FormHelperText from '@material-ui/core/FormHelperText';
import CartTable from './CartTable';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(1),
  },
  textField: {
    width: '20ch',
  },
  button: {
    margin: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(1),
  },
  cartHeading: {
    backgroundColor: theme.palette.info.main,
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    backgroundColor: theme.palette.warning.main,
  },
  grand: {
    padding: theme.spacing(1),
    align: 'center',
    backgroundColor: theme.palette.warning.main,
  },
}));

// function Alert(props) {
//   return <MuiAlert elevation={6} variant='filled' {...props} />;
// }

const AddToCart = ({
  getItems,
  insertIntoCart,
  stocks: { items, loading, msg, error },
}) => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    item_name: '',
    quantity: '0',
    rate: '0',
  });
  const [getMaxQuantity, setMaxQuantity] = useState(0);
  const { item_name, quantity, rate } = formData;

  useEffect(() => {
    getItems();
  }, [getItems]);

  const onQuantityChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onItemChange = (e) => {
    let itemRate;
    if (
      e.target.name === 'item_name' &&
      e.target.value !== 'None' &&
      e.target.value !== ''
    ) {
      itemRate = items.filter((item) => item.item_name === e.target.value);
      setMaxQuantity(itemRate[0].quantity);
    } else {
      setMaxQuantity(0);
    }

    if (itemRate !== undefined && itemRate !== null) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        rate: itemRate[0].rate,
      });
    }
  };

  const onAddItem = (e) => {
    e.preventDefault();
    if (
      formData.item_Name !== 'None' &&
      formData.item_name !== '' &&
      parseFloat(formData.quantity) > 0
    ) {
      insertIntoCart(formData);
    }

    setFormData({ ...formData, item_name: '', quantity: '0', rate: '0' });
  };

  return (
    <Fragment>
      {loading ? (
        <h3>Loading..</h3>
      ) : (
        <div>
          <FormControl required className={classes.formControl}>
            <InputLabel id='demo-simple-select-required-label'>
              Item Name
            </InputLabel>
            <Select
              labelId='demo-simple-select-required-label'
              id='demo-simple-select-required'
              value={item_name}
              onChange={(e) => onItemChange(e)}
              name='item_name'
              size='small'
            >
              <MenuItem value='None'>
                <em>None</em>
              </MenuItem>
              {items.map((item) => (
                <MenuItem value={item.item_name} key={item.item_name}>
                  {item.item_name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Required</FormHelperText>
          </FormControl>
          <TextField
            label='Rate'
            disabled
            id='standard-basic'
            className={clsx(classes.margin, classes.textField)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>/Pc</InputAdornment>
              ),
            }}
            name='rate'
            value={rate}
            size='small'
          />
          <TextField
            label='Quantity*'
            id='standard-basic'
            type='number'
            className={clsx(classes.margin, classes.textField)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>Pcs</InputAdornment>
              ),
            }}
            inputProps={{ min: '0', max: getMaxQuantity }}
            name='quantity'
            value={quantity}
            onChange={(e) => onQuantityChange(e)}
            size='small'
          />
          <Button
            variant='contained'
            color='primary'
            size='small'
            className={classes.button}
            startIcon={<AddShoppingCartIcon />}
            onClick={(e) => onAddItem(e)}
          >
            ADD
          </Button>
        </div>
      )}
      <div>
        <Grid item xs={12}>
          <Paper className={classes.cartHeading}>
            <Typography variant='h5' gutterBottom align='center'>
              <AddShoppingCartIcon /> Items in your Cart
            </Typography>
          </Paper>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={6} sm={3}>
            <Paper className={classes.paper}>Product</Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper className={classes.paper}>Quantity</Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper className={classes.paper}>Rate</Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper className={classes.paper}>Total</Paper>
          </Grid>
        </Grid>
        <CartTable />
      </div>
    </Fragment>
  );
};

AddToCart.propTypes = {
  getItems: PropTypes.func.isRequired,
  insertIntoCart: PropTypes.func.isRequired,
  stocks: PropTypes.object,
};

const mapStateToProps = (state) => ({
  stocks: state.orders,
});

export default connect(mapStateToProps, { getItems, insertIntoCart })(
  AddToCart
);
