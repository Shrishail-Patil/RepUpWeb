import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

const Home = () => {
  const router = useRouter();

  const handleLogin = async () => {
    const { user, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) console.error('Error logging in:', error.message);
    if (user) router.push('/profile');
  };

  useEffect(() => {
    const { user } = supabase.auth;
    if (user) {
      router.push('/profile');
    }
  }, [router]);

  return (
    <div>
      <h1>Welcome to the Next.js Supabase OAuth Example</h1>
      <button onClick={handleLogin}>Sign in with Google</button>
    </div>
  );
};

export default Home;