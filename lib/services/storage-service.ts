import { createSupabaseClient } from '../supabase';

export const storageService = {
  async uploadFile(
    bucket: string,
    path: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return urlData.publicUrl;
  },

  async uploadMultiple(
    bucket: string,
    files: File[],
    basePath: string,
    onProgress?: (index: number, progress: number) => void
  ): Promise<string[]> {
    const urls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const path = `${basePath}/${Date.now()}-${file.name}`;

      const url = await this.uploadFile(bucket, path, file, (progress) => {
        onProgress?.(i, progress);
      });

      urls.push(url);
    }

    return urls;
  },

  async deleteFile(bucket: string, path: string): Promise<void> {
    const supabase = createSupabaseClient();

    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) throw error;
  },

  async getSignedUrl(bucket: string, path: string, expiresIn = 3600): Promise<string> {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) throw error;

    return data.signedUrl;
  },

  async listFiles(bucket: string, path: string): Promise<any[]> {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase.storage.from(bucket).list(path);

    if (error) throw error;

    return data || [];
  },
};
