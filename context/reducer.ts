import { InitialStateType } from './context';
import { Types } from './type';

export const reducer = (state: InitialStateType, action: any) => {
  switch (action.type) {
    case Types.CART_TO_CART: {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug
      );
      if (existItem) {
        return {
          ...state,
          cart: {
            cartItems: state.cart.cartItems.map((item) =>
              item.slug === existItem.slug
                ? { ...existItem, quantity: existItem.quantity + 1 }
                : item
            ),
          },
        };
      }
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems: [...state.cart.cartItems, newItem],
        },
      };
    }
    case Types.REMOVE_FROM_CART: {
      const slug = action.payload;
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems: state.cart.cartItems.filter((item) => item.slug !== slug),
        },
      };
    }
    default:
      return state;
  }
};
