import {
  GET_ITEM,
  ITEM_ERROR,
  GET_STOCK,
  ADD_STOCK,
  REMOVE_STOCK,
  UPDATE_STOCK,
  STOCK_ERROR,
} from '../actions/types';

const initialState = {
  item_names: [],
  msg: null,
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
        msg: null,
        error: {},
      };
    case GET_ITEM:
      return {
        ...state,
        item_names: payload,
        loading: false,
        error: {},
      };
    case ADD_STOCK:
    case UPDATE_STOCK:
      return {
        ...state,
        msg: payload,
        loading: false,
        error: {},
      };
    case REMOVE_STOCK:
      return {
        ...state,
        msg: payload,
        loading: false,
        error: {},
      };
    case STOCK_ERROR:
    case ITEM_ERROR:
      return {
        ...state,
        loading: false,
        error: 'Something went wrong! Try Again',
      };
    default:
      return state;
  }
}
