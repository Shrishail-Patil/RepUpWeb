import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

const Navbar = () => {
    const supabase = useSupabaseClient();
    const user = useUser();
    const router = useRouter();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    return (
        <nav>
            <ul>
                <li>
                    <a href="/">Home</a>
                </li>
                {user ? (
                    <>
                        <li>
                            <a href="/profile">Profile</a>
                        </li>
                        <li>
                            <button onClick={handleSignOut}>Sign Out</button>
                        </li>
                    </>
                ) : (
                    <li>
                        <a href="/api/auth">Sign in with Google</a>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;