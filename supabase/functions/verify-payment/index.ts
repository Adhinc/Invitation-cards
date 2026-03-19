import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHmac } from 'https://deno.land/std@0.168.0/node/crypto.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const authHeader = req.headers.get('Authorization')!;
    const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (!user) throw new Error('Unauthorized');

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    const secret = Deno.env.get('RAZORPAY_KEY_SECRET')!;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = createHmac('sha256', secret).update(body).digest('hex');

    if (expectedSignature !== razorpay_signature) {
      throw new Error('Invalid payment signature');
    }

    const { data: payment } = await supabase
      .from('payments')
      .select('*')
      .eq('razorpay_order_id', razorpay_order_id)
      .single();

    if (!payment) throw new Error('Payment not found');

    await supabase
      .from('payments')
      .update({ razorpay_payment_id, status: 'paid' })
      .eq('id', payment.id);

    const { data: invitation } = await supabase
      .from('invitations')
      .select('form_data')
      .eq('id', payment.invitation_id)
      .single();

    const formData = invitation!.form_data as any;
    const baseSlug = generateSlug(formData);
    const slug = await getUniqueSlug(supabase, baseSlug);

    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + payment.plan_duration);

    await supabase
      .from('invitations')
      .update({
        slug,
        status: 'active',
        published_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq('id', payment.invitation_id);

    return new Response(JSON.stringify({ slug, expires_at: expiresAt.toISOString() }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateSlug(formData: any): string {
  const { eventType, person1Name, person2Name } = formData;
  const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  if (['wedding', 'betrothal'].includes(eventType) && person2Name) {
    return `${clean(person1Name)}-and-${clean(person2Name)}`;
  }

  const labels: Record<string, string> = {
    birthday: 'birthday', baptism: 'baptism', holy_communion: 'holy-communion',
    naming_ceremony: 'naming-ceremony', baby_shower: 'baby-shower', housewarming: 'housewarming',
  };
  return `${clean(person1Name)}-${labels[eventType] ?? eventType}`;
}

async function getUniqueSlug(supabase: any, baseSlug: string): Promise<string> {
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
