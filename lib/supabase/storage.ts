import { createClient } from '@/lib/supabase/client';

export async function uploadPublicFile(bucket: string, file: File): Promise<string> {
  const supabase = createClient();
  const fileExt = file.name.split('.').pop() || 'png';
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

  const { error } = await supabase.storage.from(bucket).upload(fileName, file);

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}
