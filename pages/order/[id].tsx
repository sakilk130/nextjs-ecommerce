/* eslint-disable no-unused-vars */
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/layout';
import { getError } from '../../utils/error';

interface OrderState {
  loading: boolean;
  error: string | null;
  order: any;
}
interface OrderAction {
  type: string;
  payload?: any;
}

enum Types {
  ORDER_REQUEST = 'ORDER_REQUEST',
  ORDER_SUCCESS = 'ORDER_SUCCESS',
  ORDER_FAIL = 'ORDER_FAIL',
  ORDER_PAY_REQUEST = 'ORDER_PAY_REQUEST',
  ORDER_PAY_SUCCESS = 'ORDER_PAY_SUCCESS',
  ORDER_PAY_FAIL = 'ORDER_PAY_FAIL',
  ORDER_PAY_RESET = 'ORDER_PAY_RESET',
  ORDER_DELIVER_REQUEST = 'ORDER_DELIVER_REQUEST',
  ORDER_DELIVER_SUCCESS = 'ORDER_DELIVER_SUCCESS',
  ORDER_DELIVER_FAIL = 'ORDER_DELIVER_FAIL',
  ORDER_DELIVER_RESET = 'ORDER_DELIVER_RESET',
}

const orderReducer = (state: OrderState, action: OrderAction) => {
  switch (action.type) {
    case Types.ORDER_REQUEST:
      return { ...state, loading: true };
    case Types.ORDER_SUCCESS:
      return { ...state, loading: false, order: action.payload };
    case Types.ORDER_FAIL:
      return { ...state, loading: false, error: action.payload };
    case Types.ORDER_PAY_REQUEST:
      return { ...state, loadingPay: true };
    case Types.ORDER_PAY_SUCCESS:
      return { ...state, loadingPay: false, successPay: true };
    case Types.ORDER_PAY_FAIL:
      return { ...state, loadingPay: false, error: action.payload };
    case Types.ORDER_PAY_RESET:
      return { ...state, loadingPay: false, successPay: false };
    case Types.ORDER_DELIVER_REQUEST:
      return { ...state, loadingDeliver: true };
    case Types.ORDER_DELIVER_SUCCESS:
      return { ...state, loadingDeliver: false, successDeliver: true };
    case Types.ORDER_DELIVER_FAIL:
      return { ...state, loadingDeliver: false, error: action.payload };
    case Types.ORDER_DELIVER_RESET:
      return { ...state, loadingDeliver: false, successDeliver: false };
    default:
      return state;
  }
};

const Order = () => {
  const [{ isPending }, paypalDispatch]: any = usePayPalScriptReducer();
  const router = useRouter();
  const { id } = router.query;

  const InitialState = {
    loading: true,
    error: null,
    order: {},
  };

  const [{ loading, error, order }, dispatch] = useReducer(
    orderReducer,
    InitialState
  );
  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
    successPay,
    successDeliver,
  } = order;

  function createOrder(data: any, actions: any) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderID: any) => {
        return orderID;
      });
  }

  function onApprove(data: any, actions: any) {
    return actions.order.capture().then(async function (details: any) {
      try {
        dispatch({ type: Types.ORDER_PAY_REQUEST });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details
        );
        dispatch({ type: Types.ORDER_PAY_SUCCESS, payload: data });
        toast.success('Order is paid successgully');
      } catch (err) {
        dispatch({ type: Types.ORDER_PAY_FAIL, payload: getError(err) });
        toast.error(getError(err));
      }
    });
  }
  function onError(err: any) {
    toast.error(getError(err));
  }

  useEffect(() => {
    const fetchOrder = async () => {
      dispatch({ type: Types.ORDER_REQUEST });
      try {
        const { data } = await axios.get(`/api/orders/${id}`);
        dispatch({ type: Types.ORDER_SUCCESS, payload: data });
      } catch (err) {
        dispatch({ type: Types.ORDER_FAIL, payload: getError(err) });
      }
    };
    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== id)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
      if (successDeliver) {
        dispatch({ type: 'DELIVER_RESET' });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal');
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
  }, [order, id, paypalDispatch, successDeliver, successPay]);

  return (
    <Layout title={`Order ${id}`}>
      <h1 className="mb-4 text-xl">{`Order ${id}`}</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <div className="p-5 card">
              <h2 className="mb-2 text-lg">Shipping Address</h2>
              <div>
                {shippingAddress.fullName}, {shippingAddress.address},{' '}
                {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                {shippingAddress.country}
              </div>
              {isDelivered ? (
                <div className="alert-success">Delivered at {deliveredAt}</div>
              ) : (
                <div className="alert-error">Not delivered</div>
              )}
            </div>
            <div className="p-5 card">
              <h2 className="mb-2 text-lg">Payment Method</h2>
              <div>{paymentMethod}</div>
              {isPaid ? (
                <div className="alert-success">Paid at {paidAt}</div>
              ) : (
                <div className="alert-error">Not paid</div>
              )}
            </div>
            <div className="p-5 overflow-x-auto card">
              <h2 className="mb-2 text-lg">Order Items</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">Item</th>
                    <th className="p-5 text-right ">Quantity</th>
                    <th className="p-5 text-right ">Price</th>
                    <th className="p-5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item: any) => (
                    <tr key={item._id} className="border-b">
                      <td>
                        <Link href={`/product/${item.slug}`}>
                          <a className="flex items-center">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                              loading="lazy"
                              placeholder="blur"
                              blurDataURL={item.image}
                            />
                            &nbsp;
                            {item.name}
                          </a>
                        </Link>
                      </td>
                      <td className="p-5 text-right ">{item.quantity}</td>
                      <td className="p-5 text-right">${item.price}</td>
                      <td className="p-5 text-right">
                        ${item.quantity * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <div className="p-5 card">
              <h2 className="mb-2 text-lg">Order Summary</h2>
              <ul>
                <li>
                  <div className="flex justify-between mb-2">
                    <div>Items</div>
                    <div>${itemsPrice}</div>
                  </div>
                </li>{' '}
                <li>
                  <div className="flex justify-between mb-2">
                    <div>Tax</div>
                    <div>${taxPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="flex justify-between mb-2">
                    <div>Shipping</div>
                    <div>${shippingPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="flex justify-between mb-2">
                    <div>Total</div>
                    <div>${totalPrice}</div>
                  </div>
                </li>
                {!isPaid && (
                  <li>
                    {isPending ? (
                      <div className="alert-info">Processing payment...</div>
                    ) : (
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      />
                    )}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
Order.auth = true;
export default Order;
