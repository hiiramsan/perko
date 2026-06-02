'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function JoinPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();

  useEffect(() => {
    if (slug) {
      document.cookie = `perko_join_business_slug=${slug}; path=/; max-age=600; samesite=lax`;
      
      router.replace('/register?role=customer');
    }
  }, [slug, router]);
  return null;
}