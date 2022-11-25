import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import CheckoutSteps from '../../components/checkout-steps';
import Layout from '../../components/layout';
import { AppContext } from '../../context/context';
import { Types } from '../../context/type';
const Payment = () => {
  const [payment, setPayment] = useState('');
  const { state, dispatch } = useContext(AppContext);
  const { cart } = state;
  const { shippingAddress, paymentMethod } = cart;

  const router = useRouter();
  const paymentMethods = [
    { name: 'PayPal', image: '/images/paypal.png' },
    { name: 'Stripe', image: '/images/stripe.png' },
    {
      name: 'Cash on Delivery',
      image: '/images/cash-on-delivery.webp',
    },
  ];
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: Types.SAVE_PAYMENT_METHOD, payload: payment });
    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        paymentMethod: payment,
      })
    );

    router.push('/place-order');
  };

  useEffect(() => {
    if (!shippingAddress.address) {
      return router.push('/shipping');
    }
    setPayment(paymentMethod || '');
  }, [paymentMethod, router, shippingAddress.address]);

  return (
    <Layout title="Payment">
      <CheckoutSteps activeStep={2} />
      <div className="max-w-screen-md mx-auto mt-2 mb-2">
        <h1 className="text-2xl">Shipping</h1>
        <form onSubmit={handleSubmit}>
          <div className="mt-2">
            <label htmlFor="paymentMethod">Payment Method</label>
            <div className="mt-2">
              {paymentMethods.map((paymentMethod) => (
                <div key={paymentMethod.name} className="flex items-center">
                  <input
                    type="radio"
                    id={paymentMethod.name}
                    name="paymentMethod"
                    required
                    onChange={() => setPayment(paymentMethod.name)}
                    checked={paymentMethod.name === payment}
                  />
                  <label
                    htmlFor={paymentMethod.name}
                    className="flex items-center gap-3"
                  >
                    <span className="ml-2">{paymentMethod.name}</span>
                    <Image
                      height={50}
                      width={100}
                      src={paymentMethod.image}
                      alt={paymentMethod.name}
                      className="ml-2  object-contain"
                      loading="lazy"
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2 flex justify-between">
            <button
              type="button"
              className="bg-gray-200 hover:bg-gray-100 text-black  py-2 px-2 rounded mt-4 shadow-md"
              onClick={() => {
                router.push('/shipping');
              }}
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-black  py-2 px-2 rounded mt-4 shadow-md"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Payment;
