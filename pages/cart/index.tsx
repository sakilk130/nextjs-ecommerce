import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import XCircleIcon from '../../components/icons/XCircleIcon';
import Layout from '../../components/layout';
import { AppContext } from '../../context/context';
import { Types } from '../../context/type';

const Cart = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(AppContext);

  const totalItems = state.cart.cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const subTotal = state?.cart?.cartItems?.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const removeFromCart = (slug: string) => {
    dispatch({ type: Types.REMOVE_FROM_CART, payload: slug });
  };

  const updateCartHandler = (item: any, qty: any) => {
    const quantity = Number(qty);
    dispatch({ type: Types.CART_TO_CART, payload: { ...item, quantity } });
  };

  return (
    <Layout title="Shopping Cart">
      <h1 className="text-xl">Shopping Cart</h1>
      {state?.cart?.cartItems?.length === 0 ? (
        <div>
          <p>
            Your cart is empty.{' '}
            <Link href="/">
              <a>Go back</a>
            </Link>
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3 mb-4 md:mb-0">
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  <th className="p-3 text-start">Item</th>
                  <th className="p-3 text-start">Quantity</th>
                  <th className="p-3 text-start">Price</th>
                  <th className="p-3 text-start">Action</th>
                </tr>
              </thead>
              <tbody>
                {state?.cart?.cartItems?.map((item) => (
                  <tr className="border-b" key={Math.random()}>
                    <td className="p-3 text-start flex items-center">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={50}
                        height={50}
                      />
                      <Link href={`/product/${item.slug}`}>
                        <a className="ml-3">{item.name}</a>
                      </Link>
                    </td>
                    <td className="p-3 text-start">
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateCartHandler(item, e.target.value)
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 text-start">
                      ${item.price * item.quantity}
                    </td>
                    <td className="p-3 text-start">
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.slug)}
                      >
                        <XCircleIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <div className="card p-4">
              <div className="flex justify-between mb-3">
                <span>Subtotal ({totalItems} items):</span>
                <span>${subTotal}</span>
              </div>
              <button
                className="primary-btn w-full"
                onClick={() => router.push('/shipping')}
              >
                Check Out
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(Cart), { ssr: false });
