import Link from 'next/link';
import { useForm } from 'react-hook-form';
import Layout from '../../components/layout';

type Inputs = {
  email: string;
  password: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit = (data: Inputs) => {
    //FIXME: console.log(data);
    // eslint-disable-next-line no-console
    console.log(data);
  };

  return (
    <Layout title="Login">
      <div className=" mx-auto max-w-screen-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="text-2xl">Login</h1>
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
              autoFocus
            />
            {errors.password && (
              <div className="text-red-500">{errors.password?.message}</div>
            )}
          </div>
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-black  py-2 px-2 rounded mt-4"
          >
            Login
          </button>
          <p className="mt-4">
            Don&apos;t have an account?{' '}
            <Link href="/register">
              <a className="text-yellow-300 hover:text-yellow-400">Register</a>
            </Link>
          </p>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
