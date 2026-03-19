import { supabase } from './supabase';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentOptions {
  invitationId: string;
  planId: string;
  amount: number;
  planDuration: number;
  userEmail: string;
  onSuccess: (data: { slug: string; expires_at: string }) => void;
  onFailure: (error: string) => void;
}

export async function initiatePayment({
  invitationId,
  planId,
  amount,
  planDuration,
  userEmail,
  onSuccess,
  onFailure,
}: PaymentOptions) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { data, error } = await supabase.functions.invoke('create-order', {
      body: { invitation_id: invitationId, plan_id: planId, amount, plan_duration: planDuration },
    });

    if (error) throw error;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency: 'INR',
      name: 'InvitationAI',
      description: `Invitation - ${planId}`,
      order_id: data.order_id,
      prefill: { email: userEmail },
      theme: { color: '#B8405E' },
      handler: async (response: any) => {
        const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-payment', {
          body: {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          },
        });

        if (verifyError) {
          onFailure(verifyError.message);
          return;
        }

        onSuccess(verifyData);
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (response: any) => {
      onFailure(response.error.description);
    });
    rzp.open();
  } catch (err) {
    onFailure((err as Error).message);
  }
}
