import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Artwork } from '@/lib/types';
import AdminLayout from '@/components/admin/AdminLayout';
import { Plus, Search, Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { useAdmin } from '@/i18n';

const statusColors: Record<string, string> = { published: 'bg-emerald-100 text-emerald-700', draft: 'bg-amber-100 text-amber-700', archived: 'bg-gray-100 text-gray-500' };

type SortKey = 'title' | 'reference' | 'year' | 'status' | 'availability' | 'price' | 'is_featured';
type SortDir = 'asc' | 'desc';

const AdminArtworks = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('year');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const admin = useAdmin();

  const fetchArtworks = async () => {
    const { data, error } = await supabase.from('artworks').select('*').order('year', { ascending: false });
    if (error) console.error('Error fetching artworks:', error);
    else setArtworks(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchArtworks(); }, []);

  const toggleSort = useCallback((key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }, [sortKey]);

  const filtered = useMemo(() => {
    const list = artworks.filter((a) => {
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });

    return [...list].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      const valA = (a as any)[sortKey];
      const valB = (b as any)[sortKey];
      if (valA == null && valB == null) return 0;
      if (valA == null) return 1;
      if (valB == null) return -1;
      if (typeof valA === 'boolean') return (valA === valB ? 0 : valA ? -1 : 1) * dir;
      if (typeof valA === 'number') return (valA - valB) * dir;
      return String(valA).localeCompare(String(valB)) * dir;
    });
  }, [artworks, search, statusFilter, sortKey, sortDir]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(admin.artworks.confirmDelete.replace('{title}', title))) return;
    setDeleting(id);
    const { error } = await supabase.from('artworks').delete().eq('id', id);
    if (error) { console.error('Delete error:', error); alert(admin.artworks.deleteError); }
    else setArtworks((prev) => prev.filter((a) => a.id !== id));
    setDeleting(null);
  };

  const statusLabels: Record<string, string> = { draft: admin.artworks.draft, published: admin.artworks.published, archived: admin.artworks.archived };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronUp className="w-3 h-3 opacity-0 group-hover:opacity-30 transition-opacity" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-[hsl(0_0%_25%)]" />
      : <ChevronDown className="w-3 h-3 text-[hsl(0_0%_25%)]" />;
  };

  const Th = ({ col, children }: { col: SortKey; children: React.ReactNode }) => (
    <th
      onClick={() => toggleSort(col)}
      className="group px-4 py-3 text-[11px] tracking-wide uppercase text-[hsl(0_0%_50%)] font-medium cursor-pointer select-none hover:text-[hsl(0_0%_30%)] transition-colors"
    >
      <span className="inline-flex items-center gap-1">{children}<SortIcon col={col} /></span>
    </th>
  );

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-medium text-[hsl(0_0%_12%)]">{admin.artworks.title}</h1>
          <p className="text-[13px] text-[hsl(0_0%_50%)] mt-1">{artworks.length} {admin.artworks.total}</p>
        </div>
        <Link to="/admin/artworks/new" className="flex items-center gap-2 px-4 py-2 text-[12px] tracking-wider uppercase bg-[hsl(0_0%_12%)] text-white hover:bg-[hsl(0_0%_20%)] transition-colors">
          <Plus className="w-3.5 h-3.5" />{admin.artworks.newArtwork}
        </Link>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(0_0%_55%)]" />
          <input type="text" placeholder={admin.artworks.searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 text-[13px] border border-[hsl(0_0%_85%)] bg-white focus:outline-none focus:border-[hsl(0_0%_50%)] transition-colors" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 text-[13px] border border-[hsl(0_0%_85%)] bg-white focus:outline-none focus:border-[hsl(0_0%_50%)] transition-colors">
          <option value="all">{admin.artworks.allStatus}</option>
          <option value="draft">{admin.artworks.draft}</option>
          <option value="published">{admin.artworks.published}</option>
          <option value="archived">{admin.artworks.archived}</option>
        </select>
      </div>
      {loading ? (
        <p className="text-[13px] text-[hsl(0_0%_50%)] py-12 text-center">{admin.artworks.loading}</p>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center bg-white border border-[hsl(0_0%_90%)]">
          <p className="text-[13px] text-[hsl(0_0%_50%)] mb-4">{artworks.length === 0 ? admin.artworks.noArtworks : admin.artworks.noMatch}</p>
          {artworks.length === 0 && (
            <Link to="/admin/artworks/new" className="inline-flex items-center gap-2 px-4 py-2 text-[12px] tracking-wider uppercase bg-[hsl(0_0%_12%)] text-white hover:bg-[hsl(0_0%_20%)] transition-colors">
              <Plus className="w-3.5 h-3.5" />{admin.artworks.createFirst}
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white border border-[hsl(0_0%_90%)] overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[hsl(0_0%_92%)]">
                <Th col="title">{admin.artworks.artwork}</Th>
                <Th col="reference">{admin.artworks.ref}</Th>
                <Th col="year">{admin.artworks.year}</Th>
                <Th col="status">{admin.artworks.status}</Th>
                <Th col="availability">{admin.artworks.availability}</Th>
                <Th col="price">{admin.artworks.price}</Th>
                <Th col="is_featured">{admin.artworks.selected}</Th>
                <th className="px-4 py-3 text-[11px] tracking-wide uppercase text-[hsl(0_0%_50%)] font-medium w-20"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((artwork) => (
                <tr key={artwork.id} className="border-b border-[hsl(0_0%_95%)] last:border-b-0 hover:bg-[hsl(0_0%_98%)] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {artwork.primary_image_url ? <img src={artwork.primary_image_url} alt="" className="w-10 h-10 object-cover flex-shrink-0" /> : <div className="w-10 h-10 bg-[hsl(0_0%_93%)] flex-shrink-0" />}
                      <p className="text-[13px] font-medium text-[hsl(0_0%_15%)]">{artwork.title}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[hsl(0_0%_50%)] font-mono">{artwork.reference || '—'}</td>
                  <td className="px-4 py-3 text-[13px] text-[hsl(0_0%_40%)]">{artwork.year}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 text-[11px] font-medium ${statusColors[artwork.status] || ''}`}>{statusLabels[artwork.status] || artwork.status}</span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[hsl(0_0%_40%)]">{admin.artworks.availabilityLabels[artwork.availability as keyof typeof admin.artworks.availabilityLabels] || artwork.availability}</td>
                  <td className="px-4 py-3 text-[13px] text-[hsl(0_0%_40%)]">{artwork.price != null ? `€${artwork.price.toLocaleString()}` : '—'}</td>
                  <td className="px-4 py-3 text-[13px] text-[hsl(0_0%_40%)]">{artwork.is_featured && <span className="text-[11px] text-amber-600">★</span>}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link to={`/admin/artworks/${artwork.id}`} className="p-1.5 text-[hsl(0_0%_55%)] hover:text-[hsl(0_0%_20%)] transition-colors" title={admin.artworks.edit}><Pencil className="w-3.5 h-3.5" /></Link>
                      <button onClick={() => handleDelete(artwork.id, artwork.title)} disabled={deleting === artwork.id} className="p-1.5 text-[hsl(0_0%_55%)] hover:text-red-600 transition-colors disabled:opacity-50" title={admin.artworks.delete}><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminArtworks;
