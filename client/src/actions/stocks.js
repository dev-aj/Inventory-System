import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_STOCK,
  ADD_STOCK,
  REMOVE_STOCK,
  UPDATE_STOCK,
  GET_ITEM,
  ITEM_ERROR,
  STOCK_ERROR,
} from './types';

//View all stocks

export const viewItems = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/stock');
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

//Add stock
//Update stock
export const addItems = (formData, type) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post('/api/stock/add', formData, config);
    if (type === 1) {
      dispatch({
        type: ADD_STOCK,
        payload: res.data,
      });
    } else {
      dispatch({
        type: UPDATE_STOCK,
        payload: res.data,
      });
    }
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: STOCK_ERROR,
    });
  }
};

//Delete something from stock
export const deleteItems = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/stock/delete/${id}`);

    dispatch({ type: REMOVE_STOCK, payload: res.data });
  } catch (err) {
    dispatch({
      type: STOCK_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//get all items name
export const getItemNames = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/stock/getitems');
    // console.log(res);
    dispatch({ type: GET_ITEM, payload: res.data });
  } catch (err) {
    dispatch({
      type: ITEM_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
