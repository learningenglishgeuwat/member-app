import { supabase } from './supabase';

export type ExtensionRequestStatus = 'pending' | 'approved' | 'rejected';

export interface ExtensionRequest {
  id: string;
  user_id: string;
  status: ExtensionRequestStatus;
  payment_method: string | null;
  proof_url: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateExtensionRequestInput {
  userId: string;
  paymentMethod?: string | null;
  proofUrl?: string | null;
  note?: string | null;
}

export async function getLatestExtensionRequest(userId: string): Promise<ExtensionRequest | null> {
  const { data, error } = await supabase
    .from('extension_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching extension request:', error);
    return null;
  }

  if (!data) return null;
  return data as ExtensionRequest;
}

export async function createExtensionRequest(input: CreateExtensionRequestInput): Promise<ExtensionRequest | null> {
  const { userId, paymentMethod = 'gopay', proofUrl = null, note = null } = input;
  const { data, error } = await (supabase as any)
    .from('extension_requests')
    .insert({
      user_id: userId,
      status: 'pending',
      payment_method: paymentMethod,
      proof_url: proofUrl,
      note
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error creating extension request:', error);
    return null;
  }

  return data as ExtensionRequest;
}
