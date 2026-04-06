import { useEffect, useState, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Inquiry } from '@/lib/types';
import { getInquiries, updateInquiryStatus } from '@/lib/inquiries';
import { Search, X } from 'lucide-react';

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  responded: 'bg-emerald-100 text-emerald-700',
  closed: 'bg-gray-100 text-gray-500',
};

const Inquiries = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Inquiry | null>(null);

  useEffect(() => {
    getInquiries().then((data) => {
      setInquiries(data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    return inquiries.filter((inq) => {
      if (statusFilter !== 'all' && inq.status !== statusFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          inq.name.toLowerCase().includes(s) ||
          inq.email.toLowerCase().includes(s) ||
          (inq.artwork_title || '').toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [inquiries, search, statusFilter]);

  const handleStatusChange = async (id: string, status: Inquiry['status']) => {
    const success = await updateInquiryStatus(id, status);
    if (success) {
      setInquiries((prev) => prev.map((inq) => (inq.id === id ? { ...inq, status } : inq)));
      if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : null);
    }
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-xl font-medium text-[hsl(0_0%_12%)]">Inquiries</h1>
        <p className="text-[13px] text-[hsl(0_0%_50%)] mt-1">
          {inquiries.length} total · {inquiries.filter(i => i.status === 'new').length} new
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(0_0%_55%)]" />
          <input
            type="text"
            placeholder="Search by name, email, or artwork…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-[13px] border border-[hsl(0_0%_85%)] bg-white focus:outline-none focus:border-[hsl(0_0%_50%)] transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-[13px] border border-[hsl(0_0%_85%)] bg-white focus:outline-none focus:border-[hsl(0_0%_50%)] transition-colors"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="responded">Responded</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {loading ? (
        <p className="text-[13px] text-[hsl(0_0%_50%)] py-12 text-center">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center bg-white border border-[hsl(0_0%_90%)]">
          <p className="text-[13px] text-[hsl(0_0%_50%)]">
            {inquiries.length === 0 ? 'No inquiries yet.' : 'No inquiries match the current filters.'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-[hsl(0_0%_90%)] overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[hsl(0_0%_92%)]">
                <th className="px-4 py-3 text-[11px] tracking-wide uppercase text-[hsl(0_0%_50%)] font-medium">Date</th>
                <th className="px-4 py-3 text-[11px] tracking-wide uppercase text-[hsl(0_0%_50%)] font-medium">Name</th>
                <th className="px-4 py-3 text-[11px] tracking-wide uppercase text-[hsl(0_0%_50%)] font-medium">Email</th>
                <th className="px-4 py-3 text-[11px] tracking-wide uppercase text-[hsl(0_0%_50%)] font-medium">Artwork</th>
                <th className="px-4 py-3 text-[11px] tracking-wide uppercase text-[hsl(0_0%_50%)] font-medium">Status</th>
                <th className="px-4 py-3 text-[11px] tracking-wide uppercase text-[hsl(0_0%_50%)] font-medium w-16"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inq) => (
                <tr
                  key={inq.id}
                  className="border-b border-[hsl(0_0%_95%)] last:border-b-0 hover:bg-[hsl(0_0%_98%)] transition-colors cursor-pointer"
                  onClick={() => setSelected(inq)}
                >
                  <td className="px-4 py-3 text-[13px] text-[hsl(0_0%_40%)]">{formatDate(inq.created_at)}</td>
                  <td className="px-4 py-3 text-[13px] font-medium text-[hsl(0_0%_15%)]">{inq.name}</td>
                  <td className="px-4 py-3 text-[13px] text-[hsl(0_0%_40%)]">{inq.email}</td>
                  <td className="px-4 py-3 text-[13px] text-[hsl(0_0%_40%)] italic">{inq.artwork_title || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 text-[11px] font-medium capitalize ${statusColors[inq.status]}`}>
                      {inq.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[hsl(0_0%_55%)]">View</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-lg mx-4 bg-white border border-[hsl(0_0%_90%)] p-6 max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-[hsl(0_0%_50%)] hover:text-[hsl(0_0%_20%)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-medium text-[hsl(0_0%_12%)] mb-4">Inquiry Details</h2>

            <div className="space-y-3 text-[13px]">
              <DetailRow label="Date" value={formatDate(selected.created_at)} />
              <DetailRow label="Name" value={selected.name} />
              <DetailRow label="Email" value={selected.email} />
              {selected.phone && <DetailRow label="Phone" value={selected.phone} />}
              {selected.artwork_title && <DetailRow label="Artwork" value={selected.artwork_title} />}
              {selected.budget_range && <DetailRow label="Budget" value={selected.budget_range} />}

              <div className="pt-2">
                <p className="text-[11px] tracking-wide uppercase text-[hsl(0_0%_50%)] mb-1">Message</p>
                <p className="text-[hsl(0_0%_25%)] leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>

              <div className="pt-4 border-t border-[hsl(0_0%_92%)]">
                <p className="text-[11px] tracking-wide uppercase text-[hsl(0_0%_50%)] mb-2">Status</p>
                <div className="flex gap-2">
                  {(['new', 'responded', 'closed'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(selected.id, s)}
                      className={`px-3 py-1.5 text-[11px] capitalize border transition-colors ${
                        selected.status === s
                          ? 'bg-[hsl(0_0%_12%)] text-white border-[hsl(0_0%_12%)]'
                          : 'border-[hsl(0_0%_85%)] text-[hsl(0_0%_40%)] hover:border-[hsl(0_0%_60%)]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-baseline">
    <span className="text-[11px] tracking-wide uppercase text-[hsl(0_0%_50%)]">{label}</span>
    <span className="text-[hsl(0_0%_20%)]">{value}</span>
  </div>
);

export default Inquiries;
