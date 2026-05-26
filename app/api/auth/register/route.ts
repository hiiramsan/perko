import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'; // Use service role key here to bypass RLS for signup
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { email, password, fullName, role } = await request.json();

    // 1. Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 12);

    // 2. Initialize Supabase with the admin/service_role key to allow public insertions
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 3. Insert the user directly into your public.profiles table
    const { data: newProfile, error: dbError } = await supabaseAdmin
      .from('profiles')
      .insert([
        { 
          email, 
          name: fullName, 
          role: role, // 'admin' or 'customer'
          custom_password_hash: hashedPassword
        }
      ])
      .select()
      .single();

    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 400 });

    // 4. TODO: Send your verification email here using your custom SMTP/Email service provider
    // await myCustomEmailProvider.sendVerification({ email, token: '...' });

    return NextResponse.json({ success: true, profile: newProfile });

  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}