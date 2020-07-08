import axios from 'axios';
//import { setAlert } from './alert';
import {
  GET_STOCK,
  ADD_CART,
  STOCK_ERROR,
  REMOVE_ITEM,
  ADD_ADDR,
  ADD_PAY,
} from './types';

//Get all the items with rate and quantity

export const getItems = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/order');
    dispatch({
      type: GET_STOCK,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: STOCK_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Add items to cart
export const insertIntoCart = (cartItems) => (dispatch) => {
  try {
    dispatch({ type: ADD_CART, payload: cartItems });
  } catch (err) {
    console.log(err);
  }
};

//Add Address
export const insertAddress = (address) => (dispatch) => {
  try {
    console.log('Add:', address);
    dispatch({ type: ADD_ADDR, payload: address });
  } catch (err) {
    console.log(err);
  }
};

//Add payment details
export const insertPayment = (payment, dues) => (dispatch) => {
  try {
    const paymentInfo = { ...payment, duesAmount: dues };
    dispatch({ type: ADD_PAY, payload: paymentInfo });
  } catch (err) {
    console.log(err);
  }
};

//Remove Item from cart

export const removeFromCart = (item_name) => (dispatch) => {
  try {
    dispatch({
      type: REMOVE_ITEM,
      payload: item_name,
    });
  } catch (error) {
    console.log(error);
  }
};
