import { supabase } from '@/lib/supabase';
import { Inquiry } from '@/lib/types';

export const createInquiry = async (inquiry: Omit<Inquiry, 'id' | 'created_at' | 'status'>): Promise<boolean> => {
  const { error } = await supabase.from('inquiries').insert([inquiry]);
  if (error) {
    console.error('Error creating inquiry:', error);
    return false;
  }
  return true;
};

export const getInquiries = async (): Promise<Inquiry[]> => {
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching inquiries:', error);
    return [];
  }
  return data || [];
};

export const updateInquiryStatus = async (id: string, status: Inquiry['status']): Promise<boolean> => {
  const { error } = await supabase.from('inquiries').update({ status }).eq('id', id);
  if (error) {
    console.error('Error updating inquiry:', error);
    return false;
  }
  return true;
};
