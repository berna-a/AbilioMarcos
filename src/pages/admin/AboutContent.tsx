import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  AboutSection,
  createAboutSection,
  deleteAboutSection,
  getAboutSections,
  reorderAboutSections,
  updateAboutSection,
} from '@/lib/about-content';
import { translateContent } from '@/lib/translate';
import { ArrowDown, ArrowUp, Languages, Plus, Trash2 } from 'lucide-react';

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/(^_|_$)/g, '') || 'seccao';

const AboutContentAdmin = () => {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, { title: string; content: string }>>({});

  const load = async () => {
    setLoading(true);
    const data = await getAboutSections();
    setSections(data);
    setDrafts(
      Object.fromEntries(data.map((s) => [s.id, { title: s.title, content: s.content }])),
    );
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (id: string) => {
    const draft = drafts[id];
    if (!draft) return;
    const current = sections.find((s) => s.id === id);
    setSavingId(id);

    const titleChanged = !current || draft.title !== current.title;
    const contentChanged = !current || draft.content !== current.content;

    const patch: Parameters<typeof updateAboutSection>[1] = { ...draft };
    if (titleChanged) {
      const t = await translateContent(draft.title, 'about_title');
      if (t) patch.title_translations = t as Record<string, string>;
    }
    if (contentChanged) {
      const t = await translateContent(draft.content, 'about_section');
      if (t) patch.content_translations = t as Record<string, string>;
    }

    const ok = await updateAboutSection(id, patch);
    setSavingId(null);
    if (ok) {
      setSections((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...patch } as AboutSection : s)),
      );
    } else {
      alert('Falha ao guardar.');
    }
  };

  const handleRetranslate = async (id: string) => {
    const current = sections.find((s) => s.id === id);
    if (!current) return;
    setSavingId(id);
    const [titleT, contentT] = await Promise.all([
      translateContent(current.title, 'about_title'),
      translateContent(current.content, 'about_section'),
    ]);
    const patch: Parameters<typeof updateAboutSection>[1] = {};
    if (titleT) patch.title_translations = titleT as Record<string, string>;
    if (contentT) patch.content_translations = contentT as Record<string, string>;
    const ok = await updateAboutSection(id, patch);
    setSavingId(null);
    if (ok) {
      setSections((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...patch } as AboutSection : s)),
      );
    } else {
      alert('Falha a regenerar traduções.');
    }
  };

  const handleAdd = async () => {
    const title = 'Nova Secção';
    const order = (sections[sections.length - 1]?.display_order ?? 0) + 10;
    const created = await createAboutSection({
      section: slugify(title) + '_' + Date.now(),
      title,
      content: '',
      title_translations: null,
      content_translations: null,
      display_order: order,
    });
    if (created) {
      setSections((prev) => [...prev, created]);
      setDrafts((prev) => ({
        ...prev,
        [created.id]: { title: created.title, content: created.content },
      }));
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Eliminar a secção "${title}"? Esta acção é irreversível.`)) return;
    const ok = await deleteAboutSection(id);
    if (ok) {
      setSections((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const move = async (id: string, dir: -1 | 1) => {
    const idx = sections.findIndex((s) => s.id === id);
    const target = idx + dir;
    if (idx < 0 || target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[idx], next[target]] = [next[target], next[idx]];
    const reindexed = next.map((s, i) => ({ ...s, display_order: (i + 1) * 10 }));
    setSections(reindexed);
    await reorderAboutSections(
      reindexed.map((s) => ({ id: s.id, display_order: s.display_order })),
    );
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-medium text-[hsl(0_0%_12%)]">Página Sobre</h1>
          <p className="text-[13px] text-[hsl(0_0%_50%)] mt-1">
            Gerir as secções editoriais da página pública /sobre.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 px-3 py-2 text-[13px] bg-[hsl(0_0%_12%)] text-white hover:bg-[hsl(0_0%_25%)] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Adicionar secção
        </button>
      </div>

      {loading ? (
        <p className="text-[13px] text-[hsl(0_0%_50%)] py-12 text-center">A carregar…</p>
      ) : sections.length === 0 ? (
        <div className="py-16 text-center bg-white border border-[hsl(0_0%_90%)]">
          <p className="text-[13px] text-[hsl(0_0%_50%)]">Sem secções. Adiciona a primeira.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((s, i) => {
            const draft = drafts[s.id] ?? { title: s.title, content: s.content };
            const dirty =
              draft.title !== s.title || draft.content !== s.content;
            return (
              <div
                key={s.id}
                className="bg-white border border-[hsl(0_0%_90%)] p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex flex-col">
                    <button
                      onClick={() => move(s.id, -1)}
                      disabled={i === 0}
                      className="p-1 text-[hsl(0_0%_45%)] hover:text-[hsl(0_0%_15%)] disabled:opacity-25"
                      title="Mover para cima"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => move(s.id, 1)}
                      disabled={i === sections.length - 1}
                      className="p-1 text-[hsl(0_0%_45%)] hover:text-[hsl(0_0%_15%)] disabled:opacity-25"
                      title="Mover para baixo"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[11px] tracking-wide uppercase text-[hsl(0_0%_55%)]">
                    Ordem {s.display_order} · {s.section}
                  </span>
                  <div className="ml-auto flex items-center gap-2">
                    <button
                      onClick={() => handleDelete(s.id, s.title)}
                      className="p-1.5 text-[hsl(0_0%_50%)] hover:text-red-600 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <label className="block text-[11px] tracking-wide uppercase text-[hsl(0_0%_50%)] mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) =>
                    setDrafts((prev) => ({
                      ...prev,
                      [s.id]: { ...draft, title: e.target.value },
                    }))
                  }
                  className="w-full mb-4 px-3 py-2 text-[14px] border border-[hsl(0_0%_85%)] bg-white focus:outline-none focus:border-[hsl(0_0%_50%)] transition-colors"
                />

                <label className="block text-[11px] tracking-wide uppercase text-[hsl(0_0%_50%)] mb-1">
                  Conteúdo
                </label>
                <textarea
                  value={draft.content}
                  onChange={(e) =>
                    setDrafts((prev) => ({
                      ...prev,
                      [s.id]: { ...draft, content: e.target.value },
                    }))
                  }
                  rows={Math.max(8, Math.min(24, draft.content.split('\n').length + 2))}
                  className="w-full px-3 py-2 text-[13px] leading-[1.7] border border-[hsl(0_0%_85%)] bg-white font-mono focus:outline-none focus:border-[hsl(0_0%_50%)] transition-colors"
                />

                <div className="mt-3 flex items-center justify-end gap-3">
                  {dirty && (
                    <span className="text-[12px] text-[hsl(35_60%_40%)]">
                      Alterações por guardar
                    </span>
                  )}
                  <button
                    onClick={() => handleSave(s.id)}
                    disabled={!dirty || savingId === s.id}
                    className="px-4 py-2 text-[13px] bg-[hsl(0_0%_12%)] text-white hover:bg-[hsl(0_0%_25%)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {savingId === s.id ? 'A guardar…' : 'Guardar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
};

export default AboutContentAdmin;
