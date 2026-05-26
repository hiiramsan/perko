import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  // Simple extraction of your custom session cookie
  const token = cookieHeader
    .split('; ')
    .find((row) => row.startsWith('perko_session='))
    ?.split('=')[1];

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return NextResponse.json({ user: payload }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}