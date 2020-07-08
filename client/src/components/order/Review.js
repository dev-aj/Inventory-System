import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  listItem: {
    padding: theme.spacing(1, 0),
  },
  total: {
    fontWeight: 700,
  },
  title: {
    marginTop: theme.spacing(2),
  },
}));

const Review = ({ orders: { cart_items, payment, address, loading } }) => {
  const classes = useStyles();
  let total = 0;

  if (cart_items.length > 0) {
    for (let i = 0; i < cart_items.length; i++) {
      total =
        total +
        parseFloat(cart_items[i].quantity) * parseFloat(cart_items[i].rate);
    }
  }

  return (
    <Fragment>
      {loading ? (
        <Typography variant='h6' gutterBottom>
          Order summary is loading...
        </Typography>
      ) : (
        <Fragment>
          <Typography variant='h6' gutterBottom>
            Order summary
          </Typography>
          <List disablePadding>
            {cart_items.map((product) => (
              <ListItem className={classes.listItem} key={product.item_name}>
                <ListItemText
                  primary={product.name}
                  secondary={product.item_name}
                />
                <ListItemText
                  primary={product.name}
                  secondary={product.quantity}
                />
                <ListItemText primary={product.name} secondary={product.rate} />
                <Typography variant='body2'>
                  {parseFloat(product.rate) * parseFloat(product.quantity)}
                </Typography>
              </ListItem>
            ))}
            <ListItem className={classes.listItem}>
              <ListItemText primary='Total' />
              <Typography variant='subtitle1' className={classes.total}>
                {total}
              </Typography>
            </ListItem>
          </List>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant='h6' gutterBottom className={classes.title}>
                Shipping Details
              </Typography>
              <Typography gutterBottom>{address.customer_name}</Typography>
              <Typography gutterBottom>
                {address.student_name},{address.adm_no}
              </Typography>
              <Typography gutterBottom>{address.address}</Typography>
              <Typography gutterBottom>{address.contact}</Typography>
            </Grid>
            <Grid item container direction='column' xs={12} sm={6}>
              <Typography variant='h6' gutterBottom className={classes.title}>
                Payment details
              </Typography>
              <Grid container>
                <Grid item xs={6}>
                  <Typography gutterBottom>
                    {'Payment Mode - '}
                    {payment.modeOfPayment}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom>
                    {'Paid Amount - '}
                    {payment.amountPaid}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom>
                    {'Dues Amount - '}
                    {payment.duesAmount}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Fragment>
      )}
    </Fragment>
  );
};

Review.propTypes = {
  orders: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  orders: state.orders,
});

export default connect(mapStateToProps, null)(Review);
