import { NextRequest, NextResponse } from 'next/server';

// Supabase email confirmation callbacks typically look like:
//   /auth/callback?code=XXXX&next=...
// This handler exchanges the code for a session (via Supabase auth) and then
// redirects the user to the app.
//
// NOTE: Requires the Supabase SSR cookie helper configured in `lib/supabase/server.ts`.

import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  // Supabase will redirect here with the `code` query param.
  if (!code) {
    // Nothing to exchange; redirect to login.
    return NextResponse.redirect(new URL('/login', url.origin));
  }

  const supabase = await createClient();

  // This will set the auth session cookies using the SSR cookie adapter.
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    // If the code is invalid/expired, send user back to login.
    return NextResponse.redirect(new URL('/login', url.origin));
  }

  // Redirect after successful confirmation.
  // If you store role in user_metadata, you can enhance this to route to
  // /doctor or /patient.
  return NextResponse.redirect(new URL('/', url.origin));
}

