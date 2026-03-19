import { supabase } from './supabase';

interface FormData {
  eventType: string;
  person1Name: string;
  person2Name?: string;
  date: string;
  time?: string;
  address?: string;
  location?: string;
  coords?: { lat: number; lng: number };
  parents?: Record<string, string | null> | null;
  images?: string[];
  [key: string]: unknown;
}

function generateSlug(formData: FormData): string {
  const { eventType, person1Name, person2Name } = formData;
  const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const coupleEvents = ['wedding', 'betrothal'];
  if (coupleEvents.includes(eventType) && person2Name) {
    return `${clean(person1Name)}-and-${clean(person2Name)}`;
  }

  const eventLabels: Record<string, string> = {
    birthday: 'birthday',
    baptism: 'baptism',
    holy_communion: 'holy-communion',
    naming_ceremony: 'naming-ceremony',
    baby_shower: 'baby-shower',
    housewarming: 'housewarming',
  };

  const label = eventLabels[eventType] ?? eventType;
  return `${clean(person1Name)}-${label}`;
}

async function getUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const { data } = await supabase
      .from('invitations')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (!data) return slug;
    counter++;
    slug = `${baseSlug}-${counter}`;
  }
}

export async function saveInvitation({
  userId,
  formData,
  templateId,
}: {
  userId: string;
  formData: FormData;
  templateId: string;
}) {
  const { data, error } = await supabase
    .from('invitations')
    .insert({
      user_id: userId,
      event_type: formData.eventType,
      template_id: templateId,
      status: 'draft',
      form_data: formData,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function publishInvitation(invitationId: string, planDuration: number) {
  const { data: invitation } = await supabase
    .from('invitations')
    .select('form_data')
    .eq('id', invitationId)
    .single();

  if (!invitation) throw new Error('Invitation not found');

  const baseSlug = generateSlug(invitation.form_data as FormData);
  const slug = await getUniqueSlug(baseSlug);

  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + planDuration);

  const { data, error } = await supabase
    .from('invitations')
    .update({
      slug,
      status: 'active',
      published_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      updated_at: now.toISOString(),
    })
    .eq('id', invitationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getInvitationBySlug(slug: string) {
  const { data, error } = await supabase
    .from('invitations')
    .select('*, invitation_images(*)')
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (error) throw error;
  return data;
}

export async function getUserInvitations(userId: string) {
  const { data, error } = await supabase
    .from('invitations')
    .select('*, rsvps(count)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function submitRsvp(invitationId: string, guestName: string, status: 'attending' | 'declined', phone?: string) {
  const { data, error } = await supabase
    .from('rsvps')
    .insert({ invitation_id: invitationId, guest_name: guestName, status, phone });

  if (error) throw error;
  return data;
}

export async function getRsvps(invitationId: string) {
  const { data, error } = await supabase
    .from('rsvps')
    .select('*')
    .eq('invitation_id', invitationId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
