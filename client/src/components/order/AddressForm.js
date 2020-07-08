import React, { Fragment, useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { insertAddress } from '../../actions/orders';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const today = new Date();
const default_date =
  today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
const time =
  today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
const dateTime = default_date + ' | ' + time;

const AddressForm = ({ insertAddress, add }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    student_name: '',
    customer_name: '',
    adm_no: '',
    date_time: dateTime,
    address: '',
    contact: '',
  });
  const [warning, setWarning] = useState(false);

  useEffect(() => {
    if (add !== null && add !== undefined) {
      setFormData({
        student_name: add.student_name,
        customer_name: add.customer_name,
        adm_no: add.adm_no,
        date_time: dateTime,
        address: add.address,
        contact: add.contact,
      });
    }
  }, [add]);

  const {
    student_name,
    customer_name,
    adm_no,
    date_time,
    address,
    contact,
  } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onClick = (e) => {
    e.preventDefault();
    if (
      student_name === '' ||
      customer_name === '' ||
      adm_no === '' ||
      date_time === '' ||
      address === '' ||
      contact === ''
    ) {
      setOpen(true);
      setWarning(true);
    } else {
      setOpen(true);
      insertAddress(formData);
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
        Customer Details
      </Typography>
      {warning ? (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity='warning'>
            Please Fill all the fields
          </Alert>
        </Snackbar>
      ) : (
        ''
      )}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id='studentName'
            name='student_name'
            label='Student Name'
            value={student_name}
            onChange={(e) => onChange(e)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id='customerName'
            name='customer_name'
            label='Customer Name'
            value={customer_name}
            onChange={(e) => onChange(e)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id='admissionNo'
            name='adm_no'
            label='Admission No'
            value={adm_no}
            onChange={(e) => onChange(e)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id='date'
            name='date'
            label='Date | Time'
            value={date_time}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id='address1'
            name='address'
            label='Address'
            value={address}
            onChange={(e) => onChange(e)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id='contact'
            name='contact'
            label='Contact (Enter 10 digit Mobile no.)'
            inputProps={{ min: '1000000000', max: '10000000000' }}
            value={contact}
            type='number'
            onChange={(e) => onChange(e)}
            fullWidth
          />
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
      {add === null || add === undefined || add.length <= 0 || warning ? (
        ''
      ) : (
        <Grid container spacing={3}>
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity='info'>
              Address Added successfully, Click on Next to proceed
            </Alert>
          </Snackbar>
        </Grid>
      )}
    </Fragment>
  );
};

AddressForm.propTypes = {
  insertAddress: PropTypes.func.isRequired,
  add: PropTypes.object,
};

const mapStateToProps = (state) => ({
  add: state.orders.address,
});

export default connect(mapStateToProps, { insertAddress })(AddressForm);
