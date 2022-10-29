import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { ReactNode, useContext } from 'react';
import { AppContext } from '../../context/context';

interface ILayout {
  title?: string;
  children: ReactNode;
}

const Layout: NextPage<ILayout> = ({ title, children }) => {
  const { state } = useContext(AppContext);
  const { cartItems } = state.cart;

  const getCartCount = () => {
    return cartItems.reduce((qty, item) => Number(item.quantity) + qty, 0);
  };

  return (
    <>
      <Head>
        <title>{title ? title + ' - Amazona' : 'Amazona'}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="E-commerce" />
      </Head>
      <div className="flex min-h-screen flex-col justify-between ">
        <header className="shadow-md">
          <nav className="flex justify-between gap-3 p-5">
            <Link href="/">
              <a className="text-lg font-bold">Amazona</a>
            </Link>
            <div className="flex gap-3">
              <Link href="/cart">
                <a>
                  Cart
                  {cartItems.length > 0 && (
                    <span className="ml-1 rounded-full bg-yellow-400 px-2 py-1 text-xs font-bold text-white">
                      {getCartCount()}
                    </span>
                  )}
                </a>
              </Link>
              <Link href="/login">
                <a>Login</a>
              </Link>
            </div>
          </nav>
        </header>
        <main className="container m-auto mt-4 px-4">{children}</main>
        <footer className="flex h-10 justify-center items-center shadow-inner">
          <p>Copyright © 2022 Amazona</p>
        </footer>
      </div>
    </>
  );
};

export default Layout;
