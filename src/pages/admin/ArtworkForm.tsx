import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SizeCategory, getSalesMode } from '@/lib/types';
import { useAdmin } from '@/i18n';

const slugify = (text: string) =>
  text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

const sizeLabels: Record<SizeCategory, string> = {
  small: 'Small — 80 × 80 cm',
  medium: 'Medium — 90 × 90 cm',
  large: 'Large — 91 × 121 cm',
  other: 'Other — custom dimensions',
};

const initialForm = {
  title: '',
  slug: '',
  year: new Date().getFullYear(),
  description: '',
  status: 'published' as const,
  availability: 'available' as const,
  price: '' as string,
  size_category: 'medium' as SizeCategory,
  custom_width_cm: '' as string,
  custom_height_cm: '' as string,
  reference: '',
  is_featured: false,
  primary_image_url: '',
  additional_images: [] as string[],
};

const ArtworkForm = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const admin = useAdmin();
  const t = admin.artworkForm;

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [slugManual, setSlugManual] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isNew) return;
    const fetch = async () => {
      const { data, error } = await supabase.from('artworks').select('*').eq('id', id).single();
      if (error || !data) { navigate('/admin/artworks'); return; }
      setForm({
        title: data.title || '',
        slug: data.slug || '',
        year: data.year || new Date().getFullYear(),
        description: data.description || '',
        status: data.status || 'draft',
        availability: data.availability || 'available',
        price: data.price != null ? String(data.price) : '',
        size_category: data.size_category || 'medium',
        custom_width_cm: data.custom_width_cm != null ? String(data.custom_width_cm) : '',
        custom_height_cm: data.custom_height_cm != null ? String(data.custom_height_cm) : '',
        reference: data.reference || '',
        is_featured: data.is_featured || false,
        primary_image_url: data.primary_image_url || '',
        additional_images: data.additional_images || [],
      });
      setSlugManual(true);
      setLoading(false);
    };
    fetch();
  }, [id, isNew, navigate]);

  const updateField = (field: string, value: any) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'title' && !slugManual) next.slug = slugify(value);
      return next;
    });
  };

  const handleImageUpload = async (file: File, type: 'primary' | 'additional') => {
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('artworks').upload(path, file, { cacheControl: '3600', upsert: false });
    if (uploadError) {
      setError(t.uploadFailed);
      setUploading(false);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from('artworks').getPublicUrl(path);
    if (type === 'primary') {
      setForm((prev) => ({ ...prev, primary_image_url: publicUrl }));
    } else {
      setForm((prev) => ({ ...prev, additional_images: [...prev.additional_images, publicUrl] }));
    }
    setUploading(false);
  };

  const removeAdditionalImage = (index: number) => {
    setForm((prev) => ({ ...prev, additional_images: prev.additional_images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) { setError(t.titleRequired); return; }
    if (!form.slug.trim()) { setError(t.slugRequired); return; }

    setSaving(true);
    const priceNum = form.price ? parseFloat(form.price) : null;
    const payload: Record<string, any> = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      year: form.year,
      description: form.description.trim() || null,
      status: form.status,
      availability: form.availability,
      price: priceNum,
      size_category: form.size_category,
      custom_width_cm: form.size_category === 'other' && form.custom_width_cm ? parseFloat(form.custom_width_cm) : null,
      custom_height_cm: form.size_category === 'other' && form.custom_height_cm ? parseFloat(form.custom_height_cm) : null,
      reference: form.reference.trim() || null,
      is_featured: form.is_featured,
      primary_image_url: form.primary_image_url || null,
      additional_images: form.additional_images.length > 0 ? form.additional_images : null,
      updated_at: new Date().toISOString(),
    };

    if (isNew) {
      const { error } = await supabase.from('artworks').insert([payload]);
      if (error) { setError(error.message); setSaving(false); return; }
    } else {
      const { error } = await supabase.from('artworks').update(payload).eq('id', id);
      if (error) { setError(error.message); setSaving(false); return; }
    }
    navigate('/admin/artworks');
  };

  if (loading) {
    return <AdminLayout><p className="text-[13px] text-[hsl(0_0%_50%)]">{t.loading}</p></AdminLayout>;
  }

  const priceNum = form.price ? parseFloat(form.price) : null;
  const derivedMode = getSalesMode(priceNum);

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <div className="mb-8">
          <Link to="/admin/artworks" className="inline-flex items-center gap-2 text-[12px] text-[hsl(0_0%_50%)] hover:text-[hsl(0_0%_20%)] mb-4 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> {t.backToArtworks}
          </Link>
          <h1 className="text-xl font-medium text-[hsl(0_0%_12%)]">{isNew ? t.newArtwork : t.editArtwork}</h1>
        </div>

        {error && <div className="mb-6 text-[12px] text-red-600 py-2 px-3 bg-red-50 border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label={`${t.title} *`}>
              <input type="text" value={form.title} onChange={(e) => updateField('title', e.target.value)} className="admin-input" placeholder={t.artworkTitle} />
            </Field>
            <Field label={`${t.slug} *`}>
              <input type="text" value={form.slug} onChange={(e) => { setSlugManual(true); updateField('slug', e.target.value); }} className="admin-input" placeholder={t.artworkSlug} />
            </Field>
          </div>

          {/* Year, Ref & Size */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label={t.year}>
              <input type="number" value={form.year} onChange={(e) => updateField('year', parseInt(e.target.value) || 0)} className="admin-input" />
            </Field>
            <Field label={t.ref} hint={t.refHint}>
              <input type="text" value={form.reference} onChange={(e) => updateField('reference', e.target.value)} className="admin-input" placeholder={t.refPlaceholder} />
            </Field>
            <Field label={t.size}>
              <select value={form.size_category} onChange={(e) => updateField('size_category', e.target.value)} className="admin-input">
                {(Object.keys(sizeLabels) as SizeCategory[]).map((k) => (
                  <option key={k} value={k}>{sizeLabels[k]}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Custom dimensions */}
          {form.size_category === 'other' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label={t.widthCm}>
                <input type="number" value={form.custom_width_cm} onChange={(e) => updateField('custom_width_cm', e.target.value)} className="admin-input" placeholder="120" />
              </Field>
              <Field label={t.heightCm}>
                <input type="number" value={form.custom_height_cm} onChange={(e) => updateField('custom_height_cm', e.target.value)} className="admin-input" placeholder="150" />
              </Field>
            </div>
          )}

          {/* Description */}
          <Field label={t.description}>
            <textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} className="admin-input min-h-[120px] resize-y" placeholder={t.descriptionPlaceholder} />
          </Field>

          {/* Status, Availability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label={t.status}>
              <select value={form.status} onChange={(e) => updateField('status', e.target.value)} className="admin-input">
                <option value="draft">{t.draft}</option>
                <option value="published">{t.published}</option>
                <option value="archived">{t.archived}</option>
              </select>
            </Field>
            <Field label={t.availability}>
              <select value={form.availability} onChange={(e) => updateField('availability', e.target.value)} className="admin-input">
                <option value="available">{t.available}</option>
                <option value="sold">{t.sold}</option>
                <option value="not_for_sale">{t.notForSale}</option>
              </select>
            </Field>
          </div>

          {/* Pricing */}
          <div className="pt-4 border-t border-[hsl(0_0%_90%)]">
            <h3 className="text-[12px] tracking-wider uppercase text-[hsl(0_0%_40%)] mb-4">{t.pricing}</h3>

            <div className="space-y-4">
              <Field label={t.priceLabel} hint={t.priceHint}>
                <input type="number" value={form.price} onChange={(e) => updateField('price', e.target.value)} className="admin-input" placeholder="2500" min="0" step="1" />
              </Field>

              <p className="text-[11px] text-[hsl(0_0%_55%)] py-2 px-3 bg-[hsl(0_0%_97%)] border border-[hsl(0_0%_92%)]">
                {t.salesMode}: <span className="font-medium text-[hsl(0_0%_30%)]">{t.salesModes[derivedMode as keyof typeof t.salesModes]}</span>
              </p>
            </div>
          </div>

          {/* Flag */}
          <div className="pt-4 border-t border-[hsl(0_0%_90%)]">
            <label className="flex items-center gap-2 text-[13px] text-[hsl(0_0%_35%)] cursor-pointer">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => updateField('is_featured', e.target.checked)} className="accent-[hsl(0_0%_20%)]" />
              {t.selectedWork}
            </label>
          </div>

          {/* Primary Image */}
          <Field label={t.primaryImage}>
            {form.primary_image_url ? (
              <div className="relative inline-block">
                <img src={form.primary_image_url} alt="" className="w-48 h-48 object-cover" />
                <button type="button" onClick={() => setForm((prev) => ({ ...prev, primary_image_url: '' }))} className="absolute top-1 right-1 bg-white/90 p-1 hover:bg-white transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-2 px-4 py-3 border border-dashed border-[hsl(0_0%_80%)] cursor-pointer hover:border-[hsl(0_0%_60%)] transition-colors text-[13px] text-[hsl(0_0%_50%)]">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploading ? t.uploading : t.uploadPrimary}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(file, 'primary'); }} />
              </label>
            )}
          </Field>

          {/* Additional Images */}
          <Field label={t.additionalImages}>
            <div className="flex flex-wrap gap-3 mb-3">
              {form.additional_images.map((url, i) => (
                <div key={i} className="relative">
                  <img src={url} alt="" className="w-24 h-24 object-cover" />
                  <button type="button" onClick={() => removeAdditionalImage(i)} className="absolute top-0.5 right-0.5 bg-white/90 p-0.5 hover:bg-white transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <label className="inline-flex items-center gap-2 px-4 py-2 border border-dashed border-[hsl(0_0%_80%)] cursor-pointer hover:border-[hsl(0_0%_60%)] transition-colors text-[12px] text-[hsl(0_0%_50%)]">
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              {uploading ? t.uploading : t.addImage}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(file, 'additional'); }} />
            </label>
          </Field>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-[hsl(0_0%_90%)]">
            <button type="submit" disabled={saving} className="px-6 py-2.5 text-[12px] tracking-wider uppercase bg-[hsl(0_0%_12%)] text-white hover:bg-[hsl(0_0%_20%)] transition-colors disabled:opacity-50">
              {saving ? t.saving : isNew ? t.createArtwork : t.saveChanges}
            </button>
            <Link to="/admin/artworks" className="px-6 py-2.5 text-[12px] tracking-wider uppercase border border-[hsl(0_0%_85%)] text-[hsl(0_0%_40%)] hover:border-[hsl(0_0%_60%)] transition-colors">
              {t.cancel}
            </Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-[11px] tracking-wide text-[hsl(0_0%_45%)] mb-1.5 uppercase">{label}</label>
    {hint && <p className="text-[11px] text-[hsl(0_0%_60%)] mb-1.5">{hint}</p>}
    {children}
  </div>
);

export default ArtworkForm;
