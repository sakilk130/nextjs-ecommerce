import Cookies from 'js-cookie';
import { InitialStateType } from './context';
import { Types } from './type';

export const reducer = (state: InitialStateType, action: any) => {
  switch (action.type) {
    case Types.CART_TO_CART: {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item.name === existItem.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      Cookies.set('cart', JSON.stringify({ ...state.cart, cartItems }));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case Types.REMOVE_FROM_CART: {
      const cartItems = state.cart.cartItems.filter(
        (item) => item.slug !== action.payload
      );
      Cookies.set('cart', JSON.stringify({ ...state.cart, cartItems }));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    default:
      return state;
  }
};
