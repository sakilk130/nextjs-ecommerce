import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { SessionProvider, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { AppProvider } from '../context/context';
import '../styles/globals.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }: any) {
  return (
    <SessionProvider session={session}>
      <AppProvider>
        <PayPalScriptProvider
          deferLoading={true}
          options={{ 'client-id': process.env.PAYPAL_CLIENT_ID as string }}
        >
          {Component?.auth ? (
            <Auth>
              <Component {...pageProps} />
            </Auth>
          ) : (
            <Component {...pageProps} />
          )}
        </PayPalScriptProvider>
      </AppProvider>
    </SessionProvider>
  );
}

interface IProps {
  children: any;
}

function Auth({ children }: IProps) {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/unauthorized?message=login required');
    },
  });
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return children;
}

export default MyApp;
