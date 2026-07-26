import { getConvexClient } from '@/lib/convexClient';
import { api } from '../../convex/_generated/api';
import { Inquiry } from '@/lib/types';
import { getAttribution, getAnalyticsSessionId } from '@/lib/analytics';
import type { Doc, Id } from '../../convex/_generated/dataModel';

const mapInquiry = (d: Doc<'inquiries'>): Inquiry => ({
  id: d._id,
  artwork_id: d.artwork_id ?? null,
  artwork_title: d.artwork_title ?? null,
  name: d.name ?? '',
  email: d.email ?? '',
  phone: d.phone ?? null,
  message: d.message ?? '',
  budget_range: d.budget_range ?? null,
  created_at: d.created_at ?? '',
  status: (d.status as Inquiry['status']) ?? 'new',
});

export const createInquiry = async (
  inquiry: Omit<Inquiry, 'id' | 'created_at' | 'status'>,
  source = 'inquiry',
): Promise<boolean> => {
  try {
    // Carimbar a lead com a origem (UTM/referrer/landing) para atribuição no CRM.
    await getConvexClient().mutation(api.inquiries.createInquiry, {
      ...inquiry,
      attribution: getAttribution(),
      session_id: getAnalyticsSessionId(),
      source,
    });
    return true;
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return false;
  }
};

export const getInquiries = async (): Promise<Inquiry[]> => {
  try {
    const data = await getConvexClient().query(api.inquiries.getInquiries, {});
    return (data || []).map(mapInquiry);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return [];
  }
};

export const updateInquiryStatus = async (id: string, status: Inquiry['status']): Promise<boolean> => {
  try {
    await getConvexClient().mutation(api.inquiries.updateInquiryStatus, {
      id: id as Id<'inquiries'>,
      status,
    });
    return true;
  } catch (error) {
    console.error('Error updating inquiry:', error);
    return false;
  }
};
