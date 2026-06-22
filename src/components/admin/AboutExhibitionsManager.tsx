import { useEffect, useState } from 'react';
import {
  AboutExhibition, ExhibitionKind,
  getAllExhibitions, createExhibition, updateExhibition, deleteExhibition, reorderExhibitions,
} from '@/lib/about-exhibitions';
import { ArrowUp, ArrowDown, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const KINDS: { key: ExhibitionKind; label: string }[] = [
  { key: 'individual', label: 'Individuais' },
  { key: 'collective', label: 'Colectivas' },
  { key: 'collection', label: 'Colecções' },
];

const AboutExhibitionsManager = () => {
  const [all, setAll] = useState<AboutExhibition[]>([]);
  const [kind, setKind] = useState<ExhibitionKind>('individual');
  const [loading, setLoading] = useState(true);

  const load = async () => { setLoading(true); setAll(await getAllExhibitions()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const items = all.filter((e) => e.kind === kind);
  const patchLocal = (id: string, patch: Partial<AboutExhibition>) =>
    setAll((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  const saveField = async (id: string, patch: Partial<AboutExhibition>) => {
    patchLocal(id, patch);
    const ok = await updateExhibition(id, patch);
    if (!ok) { toast.error('Falha ao guardar. Tenta de novo.'); await load(); }
    else toast.success('Guardado ✓');
  };

  const add = async () => {
    const order = items.length ? Math.min(...items.map((i) => i.display_order)) - 10 : 0;
    const created = await createExhibition({
      kind,
      title: kind === 'collection' ? 'Nova colecção' : 'Nova entrada',
      year: kind === 'collection' ? null : new Date().getFullYear(),
      display_order: order,
      published: true,
    });
    if (created) { setAll((prev) => [created, ...prev]); toast.success('Adicionado ✓'); }
    else toast.error('Falha ao adicionar.');
  };

  const del = async (id: string, title: string) => {
    if (!confirm(`Eliminar "${title}"? Esta acção é irreversível.`)) return;
    if (await deleteExhibition(id)) { setAll((prev) => prev.filter((e) => e.id !== id)); toast.success('Eliminado'); }
    else toast.error('Falha ao eliminar.');
  };

  const move = async (id: string, dir: -1 | 1) => {
    const idx = items.findIndex((e) => e.id === id);
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    const reordered = [...items];
    [reordered[idx], reordered[target]] = [reordered[target], reordered[idx]];
    const withOrders = reordered.map((e, i) => ({ id: e.id, display_order: i * 10 }));
    setAll((prev) => prev.map((e) => {
      const u = withOrders.find((w) => w.id === e.id);
      return u ? { ...e, display_order: u.display_order } : e;
    }));
    await reorderExhibitions(withOrders);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {KINDS.map((k) => (
          <button
            key={k.key}
            onClick={() => setKind(k.key)}
            className={`px-3 py-1.5 text-[13px] border transition-colors ${kind === k.key ? 'bg-[hsl(0_0%_12%)] text-white border-[hsl(0_0%_12%)]' : 'border-[hsl(0_0%_85%)] text-[hsl(0_0%_40%)] hover:border-[hsl(0_0%_60%)]'}`}
          >
            {k.label} <span className="opacity-60">({all.filter((e) => e.kind === k.key).length})</span>
          </button>
        ))}
        <button onClick={add} className="ml-auto inline-flex items-center gap-2 px-3 py-1.5 text-[13px] bg-[hsl(0_0%_12%)] text-white hover:bg-[hsl(0_0%_25%)] transition-colors">
          <Plus className="w-4 h-4" /> Adicionar
        </button>
      </div>

      <p className="text-[12px] text-[hsl(0_0%_55%)] mb-4">
        As alterações guardam automaticamente ao sair de cada campo. Desmarca <strong>Visível</strong> para esconder uma entrada sem a apagar.
      </p>

      {loading ? (
        <p className="text-[13px] text-[hsl(0_0%_50%)] py-8 text-center">A carregar…</p>
      ) : items.length === 0 ? (
        <p className="text-[13px] text-[hsl(0_0%_50%)] py-8 text-center bg-white border border-[hsl(0_0%_90%)]">Sem entradas. Adiciona a primeira.</p>
      ) : (
        <div className="bg-white border border-[hsl(0_0%_90%)] divide-y divide-[hsl(0_0%_94%)]">
          {items.map((e, i) => (
            <div key={e.id} className="flex items-start gap-2 p-3">
              <div className="flex flex-col pt-1">
                <button onClick={() => move(e.id, -1)} disabled={i === 0} className="p-0.5 text-[hsl(0_0%_45%)] hover:text-[hsl(0_0%_15%)] disabled:opacity-25" title="Subir"><ArrowUp className="w-3.5 h-3.5" /></button>
                <button onClick={() => move(e.id, 1)} disabled={i === items.length - 1} className="p-0.5 text-[hsl(0_0%_45%)] hover:text-[hsl(0_0%_15%)] disabled:opacity-25" title="Descer"><ArrowDown className="w-3.5 h-3.5" /></button>
              </div>
              {kind !== 'collection' && (
                <input
                  type="number"
                  defaultValue={e.year ?? ''}
                  onBlur={(ev) => { const v = ev.target.value ? parseInt(ev.target.value, 10) : null; if (v !== e.year) saveField(e.id, { year: v }); }}
                  className="w-16 px-2 py-1.5 text-[13px] border border-[hsl(0_0%_88%)] focus:outline-none focus:border-[hsl(0_0%_50%)]"
                  placeholder="Ano"
                />
              )}
              <div className="flex-1 space-y-2 min-w-0">
                <input
                  type="text"
                  defaultValue={e.title}
                  onBlur={(ev) => { if (ev.target.value !== e.title) saveField(e.id, { title: ev.target.value }); }}
                  className="w-full px-2 py-1.5 text-[13px] border border-[hsl(0_0%_88%)] focus:outline-none focus:border-[hsl(0_0%_50%)]"
                  placeholder={kind === 'collection' ? 'Categoria (ex.: Museus)' : 'Local / título (ex.: Galeria X, Lisboa)'}
                />
                {kind === 'collection' && (
                  <textarea
                    defaultValue={e.description ?? ''}
                    onBlur={(ev) => { if (ev.target.value !== (e.description ?? '')) saveField(e.id, { description: ev.target.value || null }); }}
                    rows={2}
                    className="w-full px-2 py-1.5 text-[13px] leading-[1.6] border border-[hsl(0_0%_88%)] focus:outline-none focus:border-[hsl(0_0%_50%)]"
                    placeholder="Descrição"
                  />
                )}
              </div>
              <label className="flex items-center gap-1.5 text-[11px] text-[hsl(0_0%_45%)] pt-2 whitespace-nowrap cursor-pointer select-none">
                <input type="checkbox" checked={e.published} onChange={(ev) => saveField(e.id, { published: ev.target.checked })} /> Visível
              </label>
              <button onClick={() => del(e.id, e.title)} className="p-1.5 text-[hsl(0_0%_50%)] hover:text-red-600 transition-colors mt-1" title="Eliminar"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AboutExhibitionsManager;
