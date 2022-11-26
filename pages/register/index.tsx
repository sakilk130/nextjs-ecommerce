import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Layout from '../../components/layout';
import { getError } from '../../utils/error';

type Inputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { redirect }: any = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [router, session, redirect]);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();
  const onSubmit = async ({ name, email, password }: Inputs) => {
    try {
      await axios.post('/api/auth/signup', {
        name,
        email,
        password,
      });
      const result: any = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Create Account">
      <div className=" mx-auto max-w-screen-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="text-2xl">Register</h1>
          <div className="mt-4">
            <label htmlFor="name">Name</label>
            <input
              className={`w-full border ${
                errors?.name ? 'border-red-500' : 'border-stone-300'
              } rounded px-2 py-2 outline-none`}
              type="text"
              id="name"
              placeholder="Enter your name"
              {...register('name', {
                required: 'Please enter name',
              })}
              autoFocus
            />
            {errors.name && (
              <div className="text-red-500">{errors.name?.message}</div>
            )}
          </div>
          <div className="mt-4">
            <label htmlFor="email">Email</label>
            <input
              className={`w-full border ${
                errors?.email ? 'border-red-500' : 'border-stone-300'
              } rounded px-2 py-2 outline-none`}
              type="email"
              id="email"
              {...register('email', {
                required: 'Please enter email',
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                  message: 'Please enter valid email',
                },
              })}
              placeholder="Enter your email"
              autoFocus
            />
            {errors.email && (
              <div className="text-red-500">{errors.email?.message}</div>
            )}
          </div>
          <div className="mt-4">
            <label htmlFor="password">Password</label>
            <input
              className={`w-full border ${
                errors?.password ? 'border-red-500' : 'border-stone-300'
              } rounded px-2 py-2 outline-none`}
              type="password"
              id="password"
              {...register('password', {
                required: 'Please enter password',
                minLength: {
                  value: 5,
                  message: 'Password must be at least 6 characters',
                },
              })}
              placeholder="Enter your password"
              autoFocus
            />
            {errors.password && (
              <div className="text-red-500">{errors.password?.message}</div>
            )}
          </div>
          <div className="mt-4">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              className={`w-full border ${
                errors?.confirmPassword ? 'border-red-500' : 'border-stone-300'
              } rounded px-2 py-2 outline-none`}
              type="password"
              id="confirmPassword"
              {...register('confirmPassword', {
                required: 'Please enter confirm password',
                validate: (value) =>
                  value === getValues('password') ||
                  'The passwords do not match',
                minLength: {
                  value: 5,
                  message: 'Password must be at least 6 characters',
                },
              })}
              placeholder="Enter your confirm password"
              autoFocus
            />
            {errors.confirmPassword && (
              <div className="text-red-500">
                {errors.confirmPassword?.message}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-black  py-2 px-2 rounded mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Loading...' : 'Register'}
          </button>
          <p className="mt-4">
            have an account?{' '}
            <Link href="/login">
              <a className="text-yellow-300 hover:text-yellow-400">Login</a>
            </Link>
          </p>
        </form>
      </div>
    </Layout>
  );
};

export default Register;
