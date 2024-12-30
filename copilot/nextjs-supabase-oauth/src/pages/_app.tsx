import { AppProps } from 'next/app';
import { SessionProvider } from '@supabase/auth-helpers-react';
import { supabase } from '../lib/supabaseClient';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider supabaseClient={supabase}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;