import {
  GET_STOCK,
  ADD_CART,
  STOCK_ERROR,
  REMOVE_ITEM,
  ADD_ADDR,
  ADD_PAY,
} from '../actions/types';

const initialState = {
  cart_items: [],
  address: null,
  payment: null,
  items: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_STOCK:
      return {
        ...state,
        items: payload,
        loading: false,
      };
    case ADD_CART:
      return {
        ...state,
        cart_items: [...state.cart_items, payload],
        loading: false,
      };
    case ADD_ADDR:
      return {
        ...state,
        address: payload,
        loading: false,
      };
    case ADD_PAY:
      return {
        ...state,
        payment: payload,
        loading: false,
      };
    case REMOVE_ITEM:
      return {
        ...state,
        cart_items: state.cart_items.filter(
          (cartItem) => cartItem.item_name !== payload
        ),
        loading: false,
      };
    case STOCK_ERROR:
      return {
        ...state,
        loading: false,
        error: 'Something went wrong! Try Again',
      };
    default:
      return state;
  }
}
