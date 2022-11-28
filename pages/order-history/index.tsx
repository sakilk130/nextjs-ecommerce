/* eslint-disable no-unused-vars */
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useReducer } from 'react';
import Layout from '../../components/layout';
import { getError } from '../../utils/error';

interface IInitialState {
  loading: boolean;
  orders: any;
  error: string;
}

const initialState = {
  loading: true,
  orders: [],
  error: '',
};
interface IAction {
  type: string;
  payload?: any;
}
enum Types {
  ORDER_LIST_REQUEST = 'ORDER_LIST_REQUEST',
  ORDER_LIST_SUCCESS = 'ORDER_LIST_SUCCESS',
  ORDER_LIST_FAIL = 'ORDER_LIST_FAIL',
}

function reducer(state: IInitialState, action: IAction) {
  switch (action.type) {
    case Types.ORDER_LIST_REQUEST:
      return { ...state, loading: true, error: '' };
    case Types.ORDER_LIST_SUCCESS:
      return { ...state, loading: false, orders: action.payload, error: '' };
    case Types.ORDER_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
function OrderHistory() {
  const [{ loading, error, orders }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch({ type: Types.ORDER_LIST_REQUEST });
        const { data } = await axios.get(`/api/orders/history`);
        dispatch({ type: Types.ORDER_LIST_SUCCESS, payload: data });
      } catch (err) {
        dispatch({ type: Types.ORDER_LIST_FAIL, payload: getError(err) });
      }
    };
    fetchOrders();
  }, []);

  return (
    <Layout title="Order History">
      <h1 className="mb-4 text-xl">Order History</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b">
              <tr>
                <th className="px-5 text-left">ID</th>
                <th className="p-5 text-left">DATE</th>
                <th className="p-5 text-left">TOTAL</th>
                <th className="p-5 text-left">PAID</th>
                <th className="p-5 text-left">DELIVERED</th>
                <th className="p-5 text-left">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => (
                <tr key={order._id} className="border-b">
                  <td className="p-5 ">{order._id.substring(20, 24)}</td>
                  <td className="p-5 ">{order.createdAt.substring(0, 10)}</td>
                  <td className="p-5 ">${order.totalPrice}</td>
                  <td className="p-5 ">
                    {order.isPaid
                      ? `${order.paidAt.substring(0, 10)}`
                      : 'not paid'}
                  </td>
                  <td className="p-5 ">
                    {order.isDelivered
                      ? `${order.deliveredAt.substring(0, 10)}`
                      : 'not delivered'}
                  </td>
                  <td className="p-5 ">
                    <Link href={`/order/${order._id}`} passHref>
                      <a>Details</a>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}

OrderHistory.auth = true;
export default OrderHistory;
