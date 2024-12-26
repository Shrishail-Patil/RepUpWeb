'use client';

import { useEffect } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error.message);
        alert('Failed to complete login.');
      } else {
        router.push('/auth/Profile'); // Redirect to your desired page
      }
    };

    handleAuthCallback();
  }, [router]);

  return <p>Completing authentication...</p>;
}
