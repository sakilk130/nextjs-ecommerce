import { SessionProvider } from 'next-auth/react';
import { AppProvider } from '../context/context';
import '../styles/globals.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }: any) {
  return (
    <SessionProvider session={session}>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </SessionProvider>
  );
}

export default MyApp;
