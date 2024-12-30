import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabaseClient';

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { provider } = req.body;

        if (!provider) {
            return res.status(400).json({ error: 'Provider is required' });
        }

        const { user, session, error } = await supabase.auth.signIn({ provider });

        if (error) {
            return res.status(401).json({ error: error.message });
        }

        res.status(200).json({ user, session });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}