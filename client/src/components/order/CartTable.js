import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { removeFromCart } from '../../actions/orders';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Tooltip from '@material-ui/core/Tooltip';
import { Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
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

const CartTable = ({ removeFromCart, cart: { cart_items, loading } }) => {
  const classes = useStyles();
  //const [grandTotal, setGrandTotal] = useState(0);
  let total = 0;
  if (cart_items.length > 0) {
    for (let i = 0; i < cart_items.length; i++) {
      total =
        total +
        parseFloat(cart_items[i].quantity) * parseFloat(cart_items[i].rate);
    }
  }
  //setGrandTotal((prevState) => prevState + total);
  const deleteItem = (e, item_name) => {
    console.log('Remove Item from cart');
    removeFromCart(item_name);
  };

  return (
    <Fragment>
      {cart_items === null || cart_items === undefined || loading ? (
        <Typography variant='h6' gutterBottom className={classes.paper}>
          No Items in the cart
        </Typography>
      ) : (
        <Fragment>
          <div className={classes.root}>
            {cart_items.map((items) => {
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
            <Paper className={classes.grandpaper}>Grand Total - {total}</Paper>
          </Grid>
        </Fragment>
      )}
    </Fragment>
  );
};

CartTable.propTypes = {
  cart: PropTypes.object,
  removeFromCart: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  cart: state.orders,
});

export default connect(mapStateToProps, { removeFromCart })(CartTable);
