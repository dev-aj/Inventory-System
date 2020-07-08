import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import orders from './orders';
import stock from './stock';

export default combineReducers({
  alert,
  auth,
  orders,
  stock,
});
