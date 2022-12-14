import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import CheckoutSteps from '../../components/checkout-steps';
import Layout from '../../components/layout';
import { AppContext } from '../../context/context';
import { Types } from '../../context/type';
import { IShippingAddress } from '../../interface';

const Shipping = () => {
  const { state, dispatch } = useContext(AppContext);
  const { cart } = state;
  const { shippingAddress } = cart;
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IShippingAddress>();
  const onSubmit = (data: any) => {
    dispatch({ type: Types.SAVE_SHIPPING_ADDRESS, payload: data });
    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        shippingAddress: data,
      })
    );

    router.push('/payment');
  };

  useEffect(() => {
    setValue('fullName', shippingAddress?.fullName);
    setValue('address', shippingAddress?.address);
    setValue('city', shippingAddress?.city);
    setValue('postalCode', shippingAddress?.postalCode);
    setValue('country', shippingAddress?.country);
  }, [setValue, shippingAddress]);

  return (
    <Layout title="Shipping">
      <CheckoutSteps activeStep={1} />
      <div className="mx-auto max-w-screen-md mt-2 mb-2">
        <h1 className="text-2xl">Shipping</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-2">
            <label htmlFor="fullName">Full Name</label>
            <input
              className={`w-full border p-2 rounded-md outline-none ${
                errors?.fullName ? 'border-red-500' : 'border-stone-300'
              }`}
              type="text"
              id="fullName"
              placeholder="Enter full name"
              {...register('fullName', {
                required: 'Please enter your full name',
              })}
              autoFocus
            />
            {errors.fullName && (
              <div className="text-red-500">{errors.fullName?.message}</div>
            )}
          </div>
          <div className="mt-2">
            <label htmlFor="address">Address</label>
            <input
              className={`w-full border p-2 rounded-md outline-none ${
                errors?.address ? 'border-red-500' : 'border-stone-300'
              }`}
              type="text"
              id="address"
              placeholder="Enter address"
              {...register('address', {
                required: 'Please enter your address',
              })}
              autoFocus
            />
            {errors.address && (
              <div className="text-red-500">{errors.address?.message}</div>
            )}
          </div>
          <div className="mt-2">
            <label htmlFor="city">City</label>
            <input
              className={`w-full border p-2 rounded-md outline-none ${
                errors?.city ? 'border-red-500' : 'border-stone-300'
              }`}
              type="text"
              id="city"
              placeholder="Enter city"
              {...register('city', {
                required: 'Please enter your city',
              })}
            />
            {errors.city && (
              <div className="text-red-500">{errors.city?.message}</div>
            )}
          </div>
          <div className="mt-2">
            <label htmlFor="postalCode">Postal Code</label>
            <input
              className={`w-full border p-2 rounded-md outline-none ${
                errors?.postalCode ? 'border-red-500' : 'border-stone-300'
              }`}
              type="text"
              id="postalCode"
              placeholder="Enter postal code"
              {...register('postalCode', {
                required: 'Please enter your postal code',
              })}
            />
            {errors.postalCode && (
              <div className="text-red-500">{errors.postalCode?.message}</div>
            )}
          </div>
          <div className="mt-2">
            <label htmlFor="country">Country</label>
            <input
              className={`w-full border p-2 rounded-md outline-none ${
                errors?.country ? 'border-red-500' : 'border-stone-300'
              }`}
              type="text"
              id="country"
              placeholder="Enter country"
              {...register('country', {
                required: 'Please enter your country',
              })}
            />
            {errors.country && (
              <div className="text-red-500">{errors.country?.message}</div>
            )}
          </div>
          <div className="mt-2">
            <label />
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-black  py-2 px-2 rounded mt-4"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

Shipping.auth = true;
export default Shipping;
