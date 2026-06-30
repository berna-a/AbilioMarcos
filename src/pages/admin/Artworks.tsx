import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Artwork } from '@/lib/types';
import AdminLayout from '@/components/admin/AdminLayout';
import { Plus, Search, Pencil, Trash2, ChevronUp, ChevronDown, Languages } from 'lucide-react';
import { useAdmin } from '@/i18n';
import { translateContent } from '@/lib/translate';
import { toast } from 'sonner';

const statusColors: Record<string, string> = { published: 'bg-emerald-100 text-emerald-700', draft: 'bg-amber-100 text-amber-700', archived: 'bg-gray-100 text-gray-500' };

type SortKey = 'title' | 'reference' | 'year' | 'status' | 'availability' | 'price' | 'is_featured';
type SortDir = 'asc' | 'desc';

const AdminArtworks = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('year');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [backfilling, setBackfilling] = useState<{ done: number; total: number } | null>(null);
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const valA = (a as any)[sortKey];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // Edição rápida na lista (disponibilidade / destaque) — sem abrir o formulário.
  const updateField = async (id: string, patch: Partial<Artwork>) => {
    setUpdating(id);
    setArtworks((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
    const { error } = await supabase
      .from('artworks')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      console.error('Update error:', error);
      toast.error('Não foi possível guardar. Tenta de novo.');
      await fetchArtworks();
    } else {
      toast.success('Atualizado ✓');
    }
    setUpdating(null);
  };

  const handleBackfillTranslations = async () => {
    if (!confirm('Traduzir todas as obras sem traduções e todas as secções "Sobre"? Pode demorar alguns minutos.')) return;
    type Row = { id: string; title?: string | null; description?: string | null; content?: string | null; title_translations?: unknown; description_translations?: unknown; content_translations?: unknown };

    const { data: artRows } = await supabase
      .from('artworks')
      .select('id, title, description, title_translations, description_translations');
    const { data: aboutRows } = await supabase
      .from('about_content')
      .select('id, title, content, title_translations, content_translations');

    const artworkJobs = (artRows ?? []).filter((r: Row) => !r.title_translations || (r.description && !r.description_translations));
    const aboutJobs = (aboutRows ?? []).filter((r: Row) => !r.title_translations || (r.content && !r.content_translations));
    const total = artworkJobs.length + aboutJobs.length;
    if (total === 0) {
      alert('Tudo já traduzido.');
      return;
    }
    let done = 0;
    setBackfilling({ done, total });

    for (const r of artworkJobs as Row[]) {
      const patch: Record<string, unknown> = {};
      if (!r.title_translations && r.title) {
        const t = await translateContent(r.title, 'artwork_title');
        if (t) patch.title_translations = t;
      }
      if (!r.description_translations && r.description) {
        const t = await translateContent(r.description, 'artwork_description');
        if (t) patch.description_translations = t;
      }
      if (Object.keys(patch).length) {
        await supabase.from('artworks').update(patch).eq('id', r.id);
      }
      done += 1;
      setBackfilling({ done, total });
    }
    for (const r of aboutJobs as Row[]) {
      const patch: Record<string, unknown> = {};
      if (!r.title_translations && r.title) {
        const t = await translateContent(r.title, 'about_title');
        if (t) patch.title_translations = t;
      }
      if (!r.content_translations && r.content) {
        const t = await translateContent(r.content, 'about_section');
        if (t) patch.content_translations = t;
      }
      if (Object.keys(patch).length) {
        await supabase.from('about_content').update(patch).eq('id', r.id);
      }
      done += 1;
      setBackfilling({ done, total });
    }
    setBackfilling(null);
    await fetchArtworks();
    alert(`Traduções concluídas: ${total} item(s).`);
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
        <div className="flex items-center gap-2">
          <button
            onClick={handleBackfillTranslations}
            disabled={!!backfilling}
            className="inline-flex items-center gap-2 px-3 py-2 text-[12px] tracking-wider uppercase border border-[hsl(0_0%_85%)] text-[hsl(0_0%_30%)] hover:border-[hsl(0_0%_50%)] transition-colors disabled:opacity-50"
            title="Traduzir conteúdo em falta para EN/FR/DE/ES"
          >
            <Languages className="w-3.5 h-3.5" />
            {backfilling ? `A traduzir ${backfilling.done}/${backfilling.total}` : 'Traduzir tudo'}
          </button>
          <Link to="/admin/artworks/new" className="flex items-center gap-2 px-4 py-2 text-[12px] tracking-wider uppercase bg-[hsl(0_0%_12%)] text-white hover:bg-[hsl(0_0%_20%)] transition-colors">
            <Plus className="w-3.5 h-3.5" />{admin.artworks.newArtwork}
          </Link>
        </div>
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
                  <td className="px-4 py-3">
                    <select
                      value={artwork.availability}
                      onChange={(e) => updateField(artwork.id, { availability: e.target.value as Artwork['availability'] })}
                      disabled={updating === artwork.id}
                      className="text-[13px] text-[hsl(0_0%_40%)] bg-transparent border border-transparent hover:border-[hsl(0_0%_85%)] focus:border-[hsl(0_0%_50%)] rounded px-1.5 py-0.5 focus:outline-none cursor-pointer disabled:opacity-50 transition-colors"
                    >
                      <option value="available">{admin.artworks.availabilityLabels.available}</option>
                      <option value="sold">{admin.artworks.availabilityLabels.sold}</option>
                      <option value="not_for_sale">{admin.artworks.availabilityLabels.not_for_sale}</option>
                      <option value="exhibition">{admin.artworks.availabilityLabels.exhibition || 'Em exposição'}</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[hsl(0_0%_40%)]">{artwork.price != null ? `€${artwork.price.toLocaleString()}` : '—'}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => updateField(artwork.id, { is_featured: !artwork.is_featured })}
                      disabled={updating === artwork.id}
                      title={admin.artworks.selected}
                      className="text-[15px] leading-none transition-transform hover:scale-110 disabled:opacity-50"
                    >
                      <span className={artwork.is_featured ? 'text-amber-500' : 'text-[hsl(0_0%_80%)]'}>★</span>
                    </button>
                  </td>
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
