import { Menu } from '@headlessui/react';
import Cookies from 'js-cookie';
import { NextPage } from 'next';
import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { ReactNode, useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppContext } from '../../context/context';
import { Types } from '../../context/type';
import DropdownLink from '../dropdown-link';

interface ILayout {
  title?: string;
  children: ReactNode;
}

const Layout: NextPage<ILayout> = ({ title, children }) => {
  const { status, data: session } = useSession();
  const { dispatch, state } = useContext(AppContext);
  const { cartItems } = state.cart;
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    setCartItemsCount(
      cartItems.reduce((qty, item) => Number(item.quantity) + qty, 0)
    );
  }, [cartItems]);

  const logoutClickHandler = () => {
    Cookies.remove('cart');
    dispatch({ type: Types.RESET_CART });
    signOut({ callbackUrl: '/login' });
  };

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
                <Menu as="div" className="relative inline-block">
                  <Menu.Button className="text-blue-600">
                    {session?.user?.name}
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white  shadow-lg ">
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/profile">
                        Profile
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink
                        className="dropdown-link"
                        href="/order-history"
                      >
                        Order History
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <a
                        className="dropdown-link"
                        href="#"
                        onClick={logoutClickHandler}
                      >
                        Logout
                      </a>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
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
