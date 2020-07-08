import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { insertPayment, removeFromCart } from '../../actions/orders';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Tooltip from '@material-ui/core/Tooltip';
import { Box } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 220,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  grandpaper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    backgroundColor: theme.palette.warning.main,
  },
}));

//Main Component Start
const PaymentForm = ({ removeFromCart, insertPayment, cartItems, payment }) => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    modeOfPayment: '',
    amountPaid: 0,
    duesAmount: 0,
  });
  const [warning, setWarning] = useState(false);
  const [open, setOpen] = useState(false);
  const [dues, setDues] = useState(0);

  const { modeOfPayment, amountPaid } = formData;
  let total = 0;

  if (cartItems.length > 0) {
    for (let i = 0; i < cartItems.length; i++) {
      total =
        total +
        parseFloat(cartItems[i].quantity) * parseFloat(cartItems[i].rate);
    }
  }

  const handleChange = (e) => {
    e.persist();

    if (e.target.name === 'amountPaid' && parseFloat(e.target.value) > 0) {
      setDues((prevState) => total - parseFloat(e.target.value));
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const deleteItem = (e, item_name) => {
    console.log('Remove Item from cart');
    removeFromCart(item_name);
  };

  const onClick = (e) => {
    e.preventDefault();
    if (modeOfPayment === '' || amountPaid === '') {
      setOpen(true);
      setWarning(true);
    } else {
      setOpen(true);
      setWarning(false);
      setFormData({ ...formData, duesAmount: dues });
      insertPayment(formData, dues);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Fragment>
      <Typography variant='h6' gutterBottom>
        Cart Details
      </Typography>
      <Fragment>
        {cartItems === null || cartItems === undefined ? (
          <Typography variant='h6' gutterBottom className={classes.paper}>
            No Items in the cart
          </Typography>
        ) : (
          <Fragment>
            <div className={classes.root}>
              {cartItems.map((items) => {
                return (
                  <Grid container spacing={2} key={items.item_name}>
                    <Grid item xs={6} sm={3}>
                      <Typography
                        variant='h6'
                        gutterBottom
                        className={classes.paper}
                      >
                        {items.item_name}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography
                        variant='h6'
                        gutterBottom
                        className={classes.paper}
                      >
                        {items.quantity}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography
                        variant='h6'
                        gutterBottom
                        className={classes.paper}
                      >
                        {items.rate}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography
                        variant='h6'
                        gutterBottom
                        className={classes.paper}
                      >
                        {parseFloat(items.rate) * parseFloat(items.quantity)}
                        <Box component='span' m={2}>
                          <Tooltip title='Delete'>
                            <DeleteForeverIcon
                              onClick={(e) => deleteItem(e, items.item_name)}
                            />
                          </Tooltip>
                        </Box>
                      </Typography>
                    </Grid>
                  </Grid>
                );
              })}
            </div>
            <Grid item xs={6} sm={3}>
              <Paper className={classes.grandpaper}>
                Grand Total - {total}
              </Paper>
            </Grid>
          </Fragment>
        )}
      </Fragment>
      {warning ? (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity='warning'>
            Please Fill all the fields
          </Alert>
        </Snackbar>
      ) : (
        ''
      )}
      <br />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id='paidAmount'
            label='Enter Paid Amount'
            type='number'
            name='amountPaid'
            value={amountPaid}
            onChange={(e) => handleChange(e)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl className={classes.formControl}>
            <InputLabel>Mode of Payment</InputLabel>
            <Select
              inputProps={{
                name: 'modeOfPayment',
              }}
              value={modeOfPayment}
              onChange={(e) => handleChange(e)}
            >
              <option value={'cash'}>Cash</option>
              <option value={'account'}>Account</option>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.grandpaper}>Dues Amount = {dues}</Paper>
        </Grid>
        <Button
          variant='contained'
          color='primary'
          size='small'
          onClick={(e) => onClick(e)}
        >
          Done
        </Button>
      </Grid>
      {payment === null ||
      payment === undefined ||
      payment.length <= 0 ||
      warning ? (
        ''
      ) : (
        <Grid container spacing={3}>
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity='info'>
              Payment Added successfully, Click on Next to proceed
            </Alert>
          </Snackbar>
        </Grid>
      )}
    </Fragment>
  );
};

PaymentForm.propTypes = {
  cartItems: PropTypes.array.isRequired,
  payment: PropTypes.object,
  insertPayment: PropTypes.func.isRequired,
  removeFromCart: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  cartItems: state.orders.cart_items,
  payment: state.orders.payment,
});

export default connect(mapStateToProps, { insertPayment, removeFromCart })(
  PaymentForm
);
