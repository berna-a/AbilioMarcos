import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Link } from 'react-router-dom';

interface Stats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  available: number;
  sold: number;
  inquiriesNew: number;
  inquiriesTotal: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({ total: 0, published: 0, draft: 0, archived: 0, available: 0, sold: 0, inquiriesNew: 0, inquiriesTotal: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [artRes, inqRes] = await Promise.all([
        supabase.from('artworks').select('status, availability'),
        supabase.from('inquiries').select('status'),
      ]);
      const rows = artRes.data || [];
      const inqs = inqRes.data || [];
      setStats({
        total: rows.length,
        published: rows.filter(r => r.status === 'published').length,
        draft: rows.filter(r => r.status === 'draft').length,
        archived: rows.filter(r => r.status === 'archived').length,
        available: rows.filter(r => r.availability === 'available').length,
        sold: rows.filter(r => r.availability === 'sold').length,
        inquiriesTotal: inqs.length,
        inquiriesNew: inqs.filter(i => i.status === 'new').length,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Artworks', value: stats.total },
    { label: 'Published', value: stats.published },
    { label: 'Drafts', value: stats.draft },
    { label: 'Available', value: stats.available },
    { label: 'Sold', value: stats.sold },
    { label: 'New Inquiries', value: stats.inquiriesNew },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-xl font-medium text-[hsl(0_0%_12%)]">Dashboard</h1>
        <p className="text-[13px] text-[hsl(0_0%_50%)] mt-1">Overview of your artworks and activity.</p>
      </div>

      {loading ? (
        <p className="text-[13px] text-[hsl(0_0%_50%)]">Loading…</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {cards.map((card) => (
            <div key={card.label} className="bg-white border border-[hsl(0_0%_90%)] p-5">
              <p className="text-[11px] tracking-wide uppercase text-[hsl(0_0%_50%)] mb-2">{card.label}</p>
              <p className="text-2xl font-medium text-[hsl(0_0%_12%)]">{card.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/admin/inquiries" className="bg-white border border-[hsl(0_0%_90%)] p-6 hover:border-[hsl(0_0%_70%)] transition-colors">
          <h2 className="text-[13px] font-medium text-[hsl(0_0%_25%)] mb-3">Recent Inquiries</h2>
          <p className="text-[12px] text-[hsl(0_0%_55%)]">
            {stats.inquiriesTotal > 0
              ? `${stats.inquiriesTotal} total · ${stats.inquiriesNew} new`
              : 'No inquiries yet.'}
          </p>
        </Link>
        <div className="bg-white border border-[hsl(0_0%_90%)] p-6">
          <h2 className="text-[13px] font-medium text-[hsl(0_0%_25%)] mb-3">Commission Requests</h2>
          <p className="text-[12px] text-[hsl(0_0%_55%)]">No commission requests yet.</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
