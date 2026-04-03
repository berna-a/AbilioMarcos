import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';

interface Stats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  available: number;
  sold: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({ total: 0, published: 0, draft: 0, archived: 0, available: 0, sold: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase.from('artworks').select('status, availability');
      if (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
        return;
      }
      const rows = data || [];
      setStats({
        total: rows.length,
        published: rows.filter(r => r.status === 'published').length,
        draft: rows.filter(r => r.status === 'draft').length,
        archived: rows.filter(r => r.status === 'archived').length,
        available: rows.filter(r => r.availability === 'available').length,
        sold: rows.filter(r => r.availability === 'sold').length,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Artworks', value: stats.total },
    { label: 'Published', value: stats.published },
    { label: 'Drafts', value: stats.draft },
    { label: 'Archived', value: stats.archived },
    { label: 'Available', value: stats.available },
    { label: 'Sold', value: stats.sold },
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

      {/* Placeholder sections */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-[hsl(0_0%_90%)] p-6">
          <h2 className="text-[13px] font-medium text-[hsl(0_0%_25%)] mb-3">Recent Inquiries</h2>
          <p className="text-[12px] text-[hsl(0_0%_55%)]">No inquiries yet. This section will show recent inquiry submissions.</p>
        </div>
        <div className="bg-white border border-[hsl(0_0%_90%)] p-6">
          <h2 className="text-[13px] font-medium text-[hsl(0_0%_25%)] mb-3">Commission Requests</h2>
          <p className="text-[12px] text-[hsl(0_0%_55%)]">No commission requests yet. This section will show recent commission submissions.</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
