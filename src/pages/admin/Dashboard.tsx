import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Link } from 'react-router-dom';
import { thumbUrl } from '@/lib/images';
import { Eye, Inbox, Tag, MousePointerClick, ArrowRight } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface ArtworkEngagement { slug: string; title: string; image: string | null; views: number; interests: number; rate: number; }
interface DayVisits { day: string; visits: number; }
interface Lead { id: string; name: string; email: string; artwork_title: string | null; status: string; created_at: string; }
interface TagRow { tag: string; views: number; interests: number; rate: number; }

type ArtworkTab = 'views' | 'interest' | 'rate';
type TagDim = 'theme' | 'dominant_color' | 'art_style';

const TAG_DIMS: { key: TagDim; label: string }[] = [
  { key: 'theme', label: 'Tema' },
  { key: 'dominant_color', label: 'Cor' },
  { key: 'art_style', label: 'Estilo' },
];

const TABS: { key: ArtworkTab; label: string; hint: string }[] = [
  { key: 'views', label: 'Mais vistas', hint: 'Obras que atraem mais visitantes' },
  { key: 'interest', label: 'Mais interesse', hint: 'Obras com mais cliques "Adquirir"' },
  { key: 'rate', label: 'Melhor taxa', hint: 'Maior rácio interesse ÷ visitas — obras mais eficazes' },
];

const leadStatusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700', responded: 'bg-emerald-100 text-emerald-700', closed: 'bg-gray-100 text-gray-500',
};
const leadStatusLabels: Record<string, string> = { new: 'Nova', responded: 'Respondida', closed: 'Fechada' };

const DeltaBadge = ({ delta }: { delta: number | null }) => {
  if (delta === null) return null;
  const pos = delta >= 0;
  return (
    <span className={`text-[11px] font-medium ${pos ? 'text-emerald-600' : 'text-red-500'}`}>
      {pos ? '↑' : '↓'} {Math.abs(delta)}% vs mês anterior
    </span>
  );
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [sold, setSold] = useState(0);
  const [acquireClicks, setAcquireClicks] = useState(0);
  const [acquireDelta, setAcquireDelta] = useState<number | null>(null);
  const [artworkEngagement, setArtworkEngagement] = useState<ArtworkEngagement[]>([]);
  const [artworkTab, setArtworkTab] = useState<ArtworkTab>('views');
  const [visits, setVisits] = useState<DayVisits[]>([]);
  const [visitsDelta, setVisitsDelta] = useState<number | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tagDim, setTagDim] = useState<TagDim>('theme');
  const [tagRows, setTagRows] = useState<TagRow[]>([]);

  useEffect(() => {
    supabase.rpc('dashboard_tag_breakdown', { p_days: 30, p_dimension: tagDim }).then(({ data }) => {
      setTagRows(((data || []) as TagRow[]).map((r) => ({ ...r, views: Number(r.views), interests: Number(r.interests), rate: Number(r.rate) })));
    });
  }, [tagDim]);

  useEffect(() => {
    const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const since60 = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();

    const load = async () => {
      const [artRes, leadRes, engagementRes, visitRes, acquireRes, acquirePrevRes] = await Promise.all([
        supabase.from('artworks').select('availability'),
        supabase.from('inquiries').select('id, name, email, artwork_title, status, created_at').order('created_at', { ascending: false }).limit(6),
        supabase.rpc('dashboard_artwork_engagement', { p_days: 30, p_limit: 20 }),
        supabase.rpc('dashboard_daily_visits', { p_days: 60 }),
        supabase.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_name', 'acquire_online_clicked').gte('created_at', since30),
        supabase.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_name', 'acquire_online_clicked').gte('created_at', since60).lt('created_at', since30),
      ]);

      setSold((artRes.data || []).filter((a: { availability: string }) => a.availability === 'sold').length);
      setLeads((leadRes.data as Lead[]) || []);

      const eng = ((engagementRes.data || []) as ArtworkEngagement[]).map((e) => ({
        ...e, views: Number(e.views), interests: Number(e.interests), rate: Number(e.rate),
      }));
      setArtworkEngagement(eng);

      // Visits: split 60d into current (last 30) vs previous (30–60)
      const allDays = ((visitRes.data as DayVisits[]) || []).map((d) => ({ ...d, visits: Number(d.visits) }));
      const since30ts = Date.now() - 30 * 24 * 60 * 60 * 1000;
      const current30 = allDays.filter((d) => new Date(d.day + 'T00:00:00').getTime() >= since30ts);
      const prev30 = allDays.filter((d) => new Date(d.day + 'T00:00:00').getTime() < since30ts);
      const totalCurrent = current30.reduce((s, d) => s + d.visits, 0);
      const totalPrev = prev30.reduce((s, d) => s + d.visits, 0);
      setVisits(current30);
      setVisitsDelta(totalPrev > 0 ? Math.round(((totalCurrent - totalPrev) / totalPrev) * 100) : null);

      // Acquire clicks + delta
      const curAcquire = acquireRes.count || 0;
      const prevAcquire = acquirePrevRes.count || 0;
      setAcquireClicks(curAcquire);
      setAcquireDelta(prevAcquire > 0 ? Math.round(((curAcquire - prevAcquire) / prevAcquire) * 100) : null);

      setLoading(false);
    };
    load();
  }, []);

  const totalVisits = visits.reduce((s, d) => s + d.visits, 0);
  const newLeads = leads.filter((l) => l.status === 'new').length;
  const chartData = visits.map((d) => ({
    label: new Date(d.day + 'T00:00:00').toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' }),
    visits: d.visits,
  }));

  // Tab data: sort by the active dimension, take top 5
  const sortedArtworks = (tab: ArtworkTab) => {
    const sorted = [...artworkEngagement].sort((a, b) =>
      tab === 'views' ? b.views - a.views : tab === 'interest' ? b.interests - a.interests : b.rate - a.rate
    );
    return tab === 'views' ? sorted.slice(0, 5) : sorted.filter((a) => (tab === 'interest' ? a.interests > 0 : a.rate > 0)).slice(0, 5);
  };
  const tabItems = sortedArtworks(artworkTab);
  const maxValue = Math.max(1, ...tabItems.map((a) => artworkTab === 'views' ? a.views : artworkTab === 'interest' ? a.interests : a.rate));
  const getValue = (a: ArtworkEngagement) => artworkTab === 'views' ? a.views : artworkTab === 'interest' ? a.interests : a.rate;
  const formatValue = (a: ArtworkEngagement) =>
    artworkTab === 'rate' ? `${a.rate}%` : String(artworkTab === 'views' ? a.views : a.interests);

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' });

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-xl font-medium text-[hsl(0_0%_12%)]">Painel</h1>
        <p className="text-[13px] text-[hsl(0_0%_50%)] mt-1">Visão geral do negócio do Abílio — últimos 30 dias.</p>
      </div>

      {loading ? (
        <p className="text-[13px] text-[hsl(0_0%_50%)] py-12 text-center">A carregar…</p>
      ) : (
        <>
          {/* Métricas-chave */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Visitas */}
            <div className="bg-white border border-[hsl(0_0%_90%)] p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] tracking-wide uppercase text-[hsl(0_0%_50%)]">Visitas (30 dias)</p>
                <Eye className="w-4 h-4 text-[hsl(0_0%_65%)]" />
              </div>
              <p className="text-3xl font-medium text-[hsl(0_0%_12%)] leading-none">{totalVisits.toLocaleString('pt-PT')}</p>
              <div className="flex flex-col gap-0.5">
                <p className="text-[11px] text-[hsl(0_0%_55%)]">páginas vistas</p>
                <DeltaBadge delta={visitsDelta} />
              </div>
            </div>

            {/* Leads */}
            <div className="bg-white border border-[hsl(0_0%_90%)] p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] tracking-wide uppercase text-[hsl(0_0%_50%)]">Leads ativas</p>
                <Inbox className="w-4 h-4 text-[hsl(0_0%_65%)]" />
              </div>
              <p className="text-3xl font-medium text-[hsl(0_0%_12%)] leading-none">{newLeads}</p>
              <p className="text-[11px] text-[hsl(0_0%_55%)]">{leads.length} no total</p>
            </div>

            {/* Obras vendidas */}
            <div className="bg-white border border-[hsl(0_0%_90%)] p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] tracking-wide uppercase text-[hsl(0_0%_50%)]">Obras vendidas</p>
                <Tag className="w-4 h-4 text-[hsl(0_0%_65%)]" />
              </div>
              <p className="text-3xl font-medium text-[hsl(0_0%_12%)] leading-none">{sold}</p>
              <p className="text-[11px] text-[hsl(0_0%_55%)]">até hoje</p>
            </div>

            {/* Interesse de compra */}
            <div className="bg-white border border-[hsl(0_0%_90%)] p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] tracking-wide uppercase text-[hsl(0_0%_50%)]">Interesse de compra</p>
                <MousePointerClick className="w-4 h-4 text-[hsl(0_0%_65%)]" />
              </div>
              <p className="text-3xl font-medium text-[hsl(0_0%_12%)] leading-none">{acquireClicks}</p>
              <div className="flex flex-col gap-0.5">
                <p className="text-[11px] text-[hsl(0_0%_55%)]">cliques "Adquirir" (30d)</p>
                <DeltaBadge delta={acquireDelta} />
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Obras — com tabs */}
            <div className="bg-white border border-[hsl(0_0%_90%)] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-1">
                  {TABS.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setArtworkTab(tab.key)}
                      title={tab.hint}
                      className={`px-2.5 py-1 text-[11px] transition-colors ${artworkTab === tab.key ? 'bg-[hsl(0_0%_12%)] text-white' : 'text-[hsl(0_0%_50%)] hover:text-[hsl(0_0%_20%)]'}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <span className="text-[11px] text-[hsl(0_0%_55%)]">30 dias</span>
              </div>

              {tabItems.length === 0 ? (
                <p className="text-[12px] text-[hsl(0_0%_55%)] py-8 text-center">Ainda sem dados suficientes.</p>
              ) : (
                <div className="space-y-4">
                  {tabItems.map((a, i) => (
                    <Link key={a.slug} to={`/obra/${a.slug}`} target="_blank" className="flex items-center gap-3 group">
                      <span className="text-[12px] text-[hsl(0_0%_60%)] w-4 tabular-nums">{i + 1}</span>
                      {a.image ? (
                        <img src={thumbUrl(a.image, 96) || a.image} alt="" className="w-11 h-11 object-cover flex-shrink-0 bg-[hsl(0_0%_95%)]" />
                      ) : <div className="w-11 h-11 bg-[hsl(0_0%_93%)] flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-[hsl(0_0%_20%)] truncate group-hover:text-[hsl(0_0%_5%)] transition-colors">{a.title}</p>
                        <div className="mt-1.5 h-1.5 bg-[hsl(0_0%_94%)] rounded-full overflow-hidden">
                          <div className="h-full bg-[hsl(0_0%_35%)] rounded-full" style={{ width: `${(getValue(a) / maxValue) * 100}%` }} />
                        </div>
                      </div>
                      <span className="text-[13px] font-medium text-[hsl(0_0%_30%)] tabular-nums w-12 text-right">{formatValue(a)}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Tendência de visitas */}
            <div className="bg-white border border-[hsl(0_0%_90%)] p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[13px] font-medium text-[hsl(0_0%_25%)]">Tendência de visitas</h2>
                <span className="text-[11px] text-[hsl(0_0%_55%)]">30 dias</span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData} margin={{ top: 5, right: 8, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="visitsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(0 0% 20%)" stopOpacity={0.18} />
                      <stop offset="100%" stopColor="hsl(0 0% 20%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'hsl(0 0% 60%)' }} interval="preserveStartEnd" axisLine={false} tickLine={false} minTickGap={24} />
                  <YAxis tick={{ fontSize: 10, fill: 'hsl(0 0% 60%)' }} axisLine={false} tickLine={false} width={30} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid hsl(0 0% 90%)' }}
                    labelStyle={{ color: 'hsl(0 0% 30%)' }}
                    formatter={(v: number) => [`${v} visitas`, '']}
                  />
                  <Area type="monotone" dataKey="visits" stroke="hsl(0 0% 25%)" strokeWidth={1.5} fill="url(#visitsGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Conversão por classificação (tags) */}
          <div className="mt-6 bg-white border border-[hsl(0_0%_90%)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[13px] font-medium text-[hsl(0_0%_25%)]">Conversão por classificação</h2>
              <div className="flex gap-1">
                {TAG_DIMS.map((d) => (
                  <button
                    key={d.key}
                    onClick={() => setTagDim(d.key)}
                    className={`px-2.5 py-1 text-[11px] transition-colors ${tagDim === d.key ? 'bg-[hsl(0_0%_12%)] text-white' : 'text-[hsl(0_0%_50%)] hover:text-[hsl(0_0%_20%)]'}`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {tagRows.length === 1 && tagRows[0].tag === '(sem classificação)' ? (
              <p className="text-[12px] text-[hsl(0_0%_55%)] py-6 text-center">
                Classifica as obras (campo <span className="font-medium">Classificação</span> na obra) para veres que tipo atrai e converte.
              </p>
            ) : (
              <div>
                <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-6 text-[11px] uppercase tracking-wide text-[hsl(0_0%_55%)] pb-2 border-b border-[hsl(0_0%_93%)]">
                  <span>{TAG_DIMS.find((d) => d.key === tagDim)?.label}</span>
                  <span className="text-right">Vistas</span>
                  <span className="text-right">Interesse</span>
                  <span className="text-right">Taxa</span>
                </div>
                <div className="divide-y divide-[hsl(0_0%_95%)]">
                  {tagRows.map((r) => (
                    <div key={r.tag} className="grid grid-cols-[1fr_auto_auto_auto] gap-x-6 items-center py-2.5 text-[13px]">
                      <span className="text-[hsl(0_0%_20%)] truncate">{r.tag}</span>
                      <span className="text-right tabular-nums text-[hsl(0_0%_45%)]">{r.views}</span>
                      <span className="text-right tabular-nums text-[hsl(0_0%_45%)]">{r.interests}</span>
                      <span className="text-right tabular-nums font-medium text-[hsl(0_0%_20%)]">{r.rate}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Leads recentes */}
          <div className="mt-6 bg-white border border-[hsl(0_0%_90%)] p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[13px] font-medium text-[hsl(0_0%_25%)]">Leads recentes</h2>
              <Link to="/admin/inquiries" className="inline-flex items-center gap-1 text-[12px] text-[hsl(0_0%_45%)] hover:text-[hsl(0_0%_15%)] transition-colors">
                Ver todas <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {leads.length === 0 ? (
              <p className="text-[12px] text-[hsl(0_0%_55%)] py-6 text-center">Ainda não há contactos.</p>
            ) : (
              <div className="divide-y divide-[hsl(0_0%_95%)]">
                {leads.map((l) => (
                  <div key={l.id} className="flex items-center gap-4 py-2.5">
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-[hsl(0_0%_20%)] truncate">{l.name || l.email}</p>
                      <p className="text-[12px] text-[hsl(0_0%_55%)] truncate">{l.artwork_title || l.email}</p>
                    </div>
                    <span className="text-[12px] text-[hsl(0_0%_55%)] whitespace-nowrap">{fmtDate(l.created_at)}</span>
                    <span className={`inline-block px-2 py-0.5 text-[11px] font-medium ${leadStatusColors[l.status] || 'bg-gray-100 text-gray-500'}`}>{leadStatusLabels[l.status] || l.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default Dashboard;
