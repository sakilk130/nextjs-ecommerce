import Link from 'next/link';
import Layout from '../../components/layout';

const Login = () => {
  return (
    <Layout title="Login">
      <div className=" mx-auto max-w-screen-md">
        <h1 className="text-2xl">Login</h1>
        <div className="mt-4">
          <label htmlFor="email">Email</label>
          <input
            className="w-full border border-slate-300 rounded px-2 py-2"
            type="email"
            name="email"
            id="email"
          />
        </div>
        <div className="mt-4">
          <label htmlFor="password">Password</label>
          <input
            className="w-full border border-slate-300 rounded px-2 py-2"
            type="password"
            name="password"
            id="password"
          />
        </div>
        <button className="bg-yellow-400 hover:bg-yellow-500 text-black  py-2 px-2 rounded mt-4">
          Login
        </button>
        <p className="mt-4">
          Don&apos;t have an account?{' '}
          <Link href="/register">
            <a className="text-yellow-300 hover:text-yellow-400">Register</a>
          </Link>
        </p>
      </div>
    </Layout>
  );
};

export default Login;
