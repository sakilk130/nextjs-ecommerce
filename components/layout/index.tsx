import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { ReactNode, useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppContext } from '../../context/context';

interface ILayout {
  title?: string;
  children: ReactNode;
}

const Layout: NextPage<ILayout> = ({ title, children }) => {
  const { status, data: session } = useSession();
  const { state } = useContext(AppContext);
  const { cartItems } = state.cart;
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    setCartItemsCount(
      cartItems.reduce((qty, item) => Number(item.quantity) + qty, 0)
    );
  }, [cartItems]);

  return (
    <>
      <Head>
        <title>{title ? title + ' - Amazona' : 'Amazona'}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="E-commerce" />
      </Head>
      <ToastContainer position="bottom-center" limit={1} />
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
                  {cartItemsCount > 0 && (
                    <span className="ml-1 rounded-full bg-yellow-400 px-2 py-1 text-xs font-bold text-white">
                      {cartItemsCount}
                    </span>
                  )}
                </a>
              </Link>
              {status === 'loading' ? (
                'Loading...'
              ) : session?.user ? (
                session.user.name
              ) : (
                <Link href="/login">
                  <a>Login</a>
                </Link>
              )}
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
