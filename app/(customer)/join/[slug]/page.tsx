// app/(customer)/join/[slug]/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export default async function JoinPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('perko_session')?.value;

  if (sessionToken) {
    try {
      await jwtVerify(sessionToken, JWT_SECRET);
    } catch {
      redirect('/login?role=customer');
    }
    redirect(`/api/join/${slug}`);
  }

  // No session → send to register, slug cookie will be set by the API route
  // We pass the slug as a query param so the register page can set the cookie
  redirect(`/register?role=customer&join=${slug}`);
}