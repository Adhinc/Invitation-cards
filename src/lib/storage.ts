import { supabase } from './supabase';

export async function uploadInvitationImage({
  userId,
  invitationId,
  file,
  type,
  displayOrder,
}: {
  userId: string;
  invitationId: string;
  file: File;
  type: 'profile_person1' | 'profile_person2' | 'gallery';
  displayOrder: number;
}) {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `${userId}/${invitationId}/${type}-${displayOrder}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('invitation-images')
    .upload(path, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { error: dbError } = await supabase
    .from('invitation_images')
    .insert({
      invitation_id: invitationId,
      storage_path: path,
      display_order: displayOrder,
      type,
    });

  if (dbError) throw dbError;

  return path;
}

export function getImageUrl(storagePath: string): string {
  const { data } = supabase.storage
    .from('invitation-images')
    .getPublicUrl(storagePath);

  return data.publicUrl;
}

export async function uploadAllImages({
  userId,
  invitationId,
  images,
}: {
  userId: string;
  invitationId: string;
  images: { file: File; type: 'profile_person1' | 'profile_person2' | 'gallery' }[];
}) {
  const results = [];
  for (let i = 0; i < images.length; i++) {
    const { file, type } = images[i];
    const path = await uploadInvitationImage({
      userId,
      invitationId,
      file,
      type,
      displayOrder: i,
    });
    results.push(path);
  }
  return results;
}
