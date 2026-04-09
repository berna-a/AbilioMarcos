import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { BarChart3, Eye, MousePointer, MessageSquare, ShoppingCart, CheckCircle, Mail } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// ── Types ──────────────────────────────────────────────────
interface AnalyticsEvent {
  id: string;
  event_name: string;
  properties: Record<string, any>;
  created_at: string;
}

type Period = '7d' | '30d' | '90d' | 'all';

const PERIOD_LABELS: Record<Period, string> = {
  '7d': 'Últimos 7 dias',
  '30d': 'Últimos 30 dias',
  '90d': 'Últimos 90 dias',
  all: 'Todo o período',
};

// ── Helpers ────────────────────────────────────────────────
function sinceDate(period: Period): string | null {
  if (period === 'all') return null;
  const d = new Date();
  d.setDate(d.getDate() - (period === '7d' ? 7 : period === '30d' ? 30 : 90));
  return d.toISOString();
}

function countByEvent(events: AnalyticsEvent[], name: string) {
  return events.filter(e => e.event_name === name).length;
}

interface RankedRow { title: string; reference: string; count: number; }

function rankByProperty(events: AnalyticsEvent[], eventNames: string[], groupKey = 'title'): RankedRow[] {
  const map = new Map<string, { title: string; reference: string; count: number }>();
  events
    .filter(e => eventNames.includes(e.event_name))
    .forEach(e => {
      const key = e.properties?.[groupKey] || 'Desconhecido';
      const ref = e.properties?.reference || '—';
      const cur = map.get(key) || { title: key, reference: ref, count: 0 };
      cur.count++;
      map.set(key, cur);
    });
  return Array.from(map.values()).sort((a, b) => b.count - a.count).slice(0, 10);
}

interface LangRow { language: string; count: number; }
function countByLanguage(events: AnalyticsEvent[]): LangRow[] {
  const map = new Map<string, number>();
  events.forEach(e => {
    const lang = e.properties?.language || 'unknown';
    map.set(lang, (map.get(lang) || 0) + 1);
  });
  return Array.from(map.entries()).map(([language, count]) => ({ language, count })).sort((a, b) => b.count - a.count);
}

interface SourceRow { source: string; medium: string; campaign: string; count: number; }
function countBySources(events: AnalyticsEvent[]): SourceRow[] {
  const map = new Map<string, SourceRow>();
  events.forEach(e => {
    const src = e.properties?.utm_source || '(directo)';
    const med = e.properties?.utm_medium || '—';
    const camp = e.properties?.utm_campaign || '—';
    const key = `${src}|${med}|${camp}`;
    const cur = map.get(key) || { source: src, medium: med, campaign: camp, count: 0 };
    cur.count++;
    map.set(key, cur);
  });
  return Array.from(map.values()).sort((a, b) => b.count - a.count).slice(0, 10);
}

interface IntentRow { title: string; reference: string; inquiries: number; checkouts: number; }
function rankByIntent(events: AnalyticsEvent[]): IntentRow[] {
  const map = new Map<string, IntentRow>();
  events
    .filter(e => ['inquiry_submitted', 'checkout_started'].includes(e.event_name))
    .forEach(e => {
      const key = e.properties?.title || 'Desconhecido';
      const ref = e.properties?.reference || '—';
      const cur = map.get(key) || { title: key, reference: ref, inquiries: 0, checkouts: 0 };
      if (e.event_name === 'inquiry_submitted') cur.inquiries++;
      else cur.checkouts++;
      map.set(key, cur);
    });
  return Array.from(map.values()).sort((a, b) => (b.inquiries + b.checkouts) - (a.inquiries + a.checkouts)).slice(0, 10);
}

function volumeOverTime(events: AnalyticsEvent[], period: Period) {
  const map = new Map<string, number>();
  events.forEach(e => {
    const d = e.created_at.slice(0, 10);
    map.set(d, (map.get(d) || 0) + 1);
  });
  return Array.from(map.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(period === '7d' ? -7 : period === '30d' ? -30 : period === '90d' ? -90 : 0);
}

// ── Component ──────────────────────────────────────────────
const AdminAnalytics = () => {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>('30d');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      let query = supabase.from('analytics_events').select('id, event_name, properties, created_at').order('created_at', { ascending: false }).limit(5000);
      const since = sinceDate(period);
      if (since) query = query.gte('created_at', since);
      const { data } = await query;
      setEvents(data || []);
      setLoading(false);
    };
    fetch();
  }, [period]);

  const kpis = useMemo(() => [
    { label: 'Visualizações de obras', value: countByEvent(events, 'artwork_view'), icon: Eye },
    { label: 'Cliques em obras', value: countByEvent(events, 'artwork_card_click'), icon: MousePointer },
    { label: 'Inquiries submetidos', value: countByEvent(events, 'inquiry_submitted'), icon: MessageSquare },
    { label: 'Checkouts iniciados', value: countByEvent(events, 'checkout_started'), icon: ShoppingCart },
    { label: 'Compras concluídas', value: countByEvent(events, 'checkout_completed'), icon: CheckCircle },
    { label: 'Newsletter', value: countByEvent(events, 'newsletter_signup'), icon: Mail },
  ], [events]);

  const mostViewed = useMemo(() => rankByProperty(events, ['artwork_view']), [events]);
  const mostClicked = useMemo(() => rankByProperty(events, ['artwork_card_click']), [events]);
  const intentRows = useMemo(() => rankByIntent(events), [events]);
  const langRows = useMemo(() => countByLanguage(events), [events]);
  const sourceRows = useMemo(() => countBySources(events), [events]);
  const timeline = useMemo(() => volumeOverTime(events, period), [events, period]);
  const topViewedChart = useMemo(() => mostViewed.slice(0, 6).map(r => ({ name: r.title.length > 20 ? r.title.slice(0, 20) + '…' : r.title, value: r.count })), [mostViewed]);

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-medium text-[hsl(0_0%_12%)]">Métricas</h1>
          <p className="text-[13px] text-[hsl(0_0%_50%)] mt-1">Indicadores de desempenho e comportamento.</p>
        </div>
        <div className="flex gap-1.5">
          {(Object.entries(PERIOD_LABELS) as [Period, string][]).map(([key, label]) => (
            <button key={key} onClick={() => setPeriod(key)} className={`px-3 py-1.5 text-[11px] tracking-wide transition-colors ${period === key ? 'bg-[hsl(0_0%_12%)] text-white' : 'bg-white border border-[hsl(0_0%_85%)] text-[hsl(0_0%_45%)] hover:border-[hsl(0_0%_60%)]'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-[13px] text-[hsl(0_0%_50%)]">A carregar…</p>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
            {kpis.map(kpi => (
              <div key={kpi.label} className="bg-white border border-[hsl(0_0%_90%)] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <kpi.icon className="w-3.5 h-3.5 text-[hsl(0_0%_55%)]" />
                  <p className="text-[11px] tracking-wide uppercase text-[hsl(0_0%_50%)]">{kpi.label}</p>
                </div>
                <p className="text-2xl font-medium text-[hsl(0_0%_12%)]">{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          {(timeline.length > 1 || topViewedChart.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
              {timeline.length > 1 && (
                <div className="bg-white border border-[hsl(0_0%_90%)] p-5">
                  <h2 className="text-[13px] font-medium text-[hsl(0_0%_25%)] mb-4">Volume de eventos</h2>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={timeline}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 92%)" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={v => v.slice(5)} />
                      <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                      <Line type="monotone" dataKey="count" stroke="hsl(0 0% 25%)" strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
              {topViewedChart.length > 0 && (
                <div className="bg-white border border-[hsl(0_0%_90%)] p-5">
                  <h2 className="text-[13px] font-medium text-[hsl(0_0%_25%)] mb-4">Obras mais vistas</h2>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={topViewedChart} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 92%)" />
                      <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={120} />
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                      <Bar dataKey="value" fill="hsl(0 0% 30%)" radius={[0, 2, 2, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <TableBlock title="Obras mais vistas" empty="Sem dados de visualizações." columns={['Ref.', 'Título', 'Visualizações']} rows={mostViewed.map(r => [r.reference, r.title, String(r.count)])} />
            <TableBlock title="Obras com mais cliques" empty="Sem dados de cliques." columns={['Ref.', 'Título', 'Cliques']} rows={mostClicked.map(r => [r.reference, r.title, String(r.count)])} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <div className="bg-white border border-[hsl(0_0%_90%)] p-5">
              <h2 className="text-[13px] font-medium text-[hsl(0_0%_25%)] mb-4">Obras com mais intenção comercial</h2>
              {intentRows.length === 0 ? (
                <p className="text-[12px] text-[hsl(0_0%_55%)]">Sem dados de intenção comercial.</p>
              ) : (
                <table className="w-full text-[12px]">
                  <thead><tr className="border-b border-[hsl(0_0%_92%)]">
                    <th className="text-left py-2 font-medium text-[hsl(0_0%_45%)]">Ref.</th>
                    <th className="text-left py-2 font-medium text-[hsl(0_0%_45%)]">Título</th>
                    <th className="text-right py-2 font-medium text-[hsl(0_0%_45%)]">Inquiries</th>
                    <th className="text-right py-2 font-medium text-[hsl(0_0%_45%)]">Checkouts</th>
                  </tr></thead>
                  <tbody>
                    {intentRows.map((r, i) => (
                      <tr key={i} className="border-b border-[hsl(0_0%_96%)]">
                        <td className="py-2 text-[hsl(0_0%_40%)]">{r.reference}</td>
                        <td className="py-2 text-[hsl(0_0%_20%)]">{r.title}</td>
                        <td className="py-2 text-right text-[hsl(0_0%_20%)]">{r.inquiries}</td>
                        <td className="py-2 text-right text-[hsl(0_0%_20%)]">{r.checkouts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <TableBlock title="Idiomas mais usados" empty="Sem dados de idioma." columns={['Idioma', 'Eventos']} rows={langRows.map(r => [r.language.toUpperCase(), String(r.count)])} />
          </div>

          <div className="grid grid-cols-1 gap-6 mb-10">
            <div className="bg-white border border-[hsl(0_0%_90%)] p-5">
              <h2 className="text-[13px] font-medium text-[hsl(0_0%_25%)] mb-4">Fontes / Campanhas</h2>
              {sourceRows.length === 0 ? (
                <p className="text-[12px] text-[hsl(0_0%_55%)]">Sem dados de campanhas.</p>
              ) : (
                <table className="w-full text-[12px]">
                  <thead><tr className="border-b border-[hsl(0_0%_92%)]">
                    <th className="text-left py-2 font-medium text-[hsl(0_0%_45%)]">Fonte</th>
                    <th className="text-left py-2 font-medium text-[hsl(0_0%_45%)]">Meio</th>
                    <th className="text-left py-2 font-medium text-[hsl(0_0%_45%)]">Campanha</th>
                    <th className="text-right py-2 font-medium text-[hsl(0_0%_45%)]">Eventos</th>
                  </tr></thead>
                  <tbody>
                    {sourceRows.map((r, i) => (
                      <tr key={i} className="border-b border-[hsl(0_0%_96%)]">
                        <td className="py-2 text-[hsl(0_0%_20%)]">{r.source}</td>
                        <td className="py-2 text-[hsl(0_0%_40%)]">{r.medium}</td>
                        <td className="py-2 text-[hsl(0_0%_40%)]">{r.campaign}</td>
                        <td className="py-2 text-right text-[hsl(0_0%_20%)]">{r.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

// ── Reusable table block ───────────────────────────────────
function TableBlock({ title, empty, columns, rows }: { title: string; empty: string; columns: string[]; rows: string[][] }) {
  return (
    <div className="bg-white border border-[hsl(0_0%_90%)] p-5">
      <h2 className="text-[13px] font-medium text-[hsl(0_0%_25%)] mb-4">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-[12px] text-[hsl(0_0%_55%)]">{empty}</p>
      ) : (
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-[hsl(0_0%_92%)]">
            {columns.map(c => (
              <th key={c} className={`py-2 font-medium text-[hsl(0_0%_45%)] ${c === columns[columns.length - 1] ? 'text-right' : 'text-left'}`}>{c}</th>
            ))}
          </tr></thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-[hsl(0_0%_96%)]">
                {row.map((cell, j) => (
                  <td key={j} className={`py-2 ${j === row.length - 1 ? 'text-right text-[hsl(0_0%_20%)]' : j === 0 ? 'text-[hsl(0_0%_40%)]' : 'text-[hsl(0_0%_20%)]'}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminAnalytics;
