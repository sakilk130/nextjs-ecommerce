import Cookies from 'js-cookie';
import { createContext, useReducer } from 'react';
import { IProduct } from '../interface';
import { reducer } from './reducer';

export interface ICard extends IProduct {
  quantity: number;
}

export type InitialStateType = {
  cart: {
    cartItems: ICard[];
  };
};

const initialState = {
  cart: Cookies.get('cart')
    ? JSON.parse(Cookies.get('cart') || '')
    : { cartItems: [] },
};

export const AppContext = createContext<{
  state: InitialStateType;
  dispatch: React.Dispatch<any>;
}>({
  state: initialState,
  dispatch: () => null,
});

interface IAppProvider {
  children: React.ReactNode;
}

export function AppProvider({ children }: IAppProvider) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
