import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

const Profile = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const session = supabase.auth.session();
    if (!session) {
      router.push('/');
    } else {
      setUser(session.user);
    }
  }, [router]);

  if (!user) return null;

  return (
    <div>
      <h1>Profile</h1>
      <p>Email: {user.email}</p>
      <p>UID: {user.id}</p>
    </div>
  );
};

export default Profile;