import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const slugify = (text: string) =>
  text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

const initialForm = {
  title: '',
  slug: '',
  year: new Date().getFullYear(),
  medium: '',
  dimensions: '',
  description: '',
  status: 'draft' as const,
  availability: 'available' as const,
  price: '',
  price_amount: '' as string,
  price_display: '',
  sales_mode: 'inquiry_only' as 'direct_purchase' | 'hybrid' | 'inquiry_only',
  purchase_url: '',
  shipping_time: '',
  shipping_notes: '',
  certificate_included: true,
  returns_policy_short: '',
  is_featured: false,
  is_masterwork: false,
  primary_image_url: '',
  additional_images: [] as string[],
};

const ArtworkForm = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();

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
        medium: data.medium || '',
        dimensions: data.dimensions || '',
        description: data.description || '',
        status: data.status || 'draft',
        availability: data.availability || 'available',
        price: data.price || '',
        price_amount: data.price_amount != null ? String(data.price_amount) : '',
        price_display: data.price_display || '',
        sales_mode: data.sales_mode || 'inquiry_only',
        purchase_url: data.purchase_url || '',
        shipping_time: data.shipping_time || '',
        shipping_notes: data.shipping_notes || '',
        certificate_included: data.certificate_included ?? true,
        returns_policy_short: data.returns_policy_short || '',
        is_featured: data.is_featured || false,
        is_masterwork: data.is_masterwork || false,
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
      setError('Failed to upload image.');
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
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.slug.trim()) { setError('Slug is required.'); return; }

    setSaving(true);
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      year: form.year,
      medium: form.medium.trim(),
      dimensions: form.dimensions.trim(),
      description: form.description.trim() || null,
      status: form.status,
      availability: form.availability,
      price: form.price.trim() || null,
      price_amount: form.price_amount ? parseFloat(form.price_amount) : null,
      price_display: form.price_display.trim() || null,
      sales_mode: form.sales_mode,
      purchase_url: form.purchase_url.trim() || null,
      shipping_time: form.shipping_time.trim() || null,
      shipping_notes: form.shipping_notes.trim() || null,
      certificate_included: form.certificate_included,
      returns_policy_short: form.returns_policy_short.trim() || null,
      is_featured: form.is_featured,
      is_masterwork: form.is_masterwork,
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
    return <AdminLayout><p className="text-[13px] text-[hsl(0_0%_50%)]">Loading…</p></AdminLayout>;
  }

  const showPurchaseUrl = form.sales_mode === 'direct_purchase' || form.sales_mode === 'hybrid';

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <div className="mb-8">
          <Link to="/admin/artworks" className="inline-flex items-center gap-2 text-[12px] text-[hsl(0_0%_50%)] hover:text-[hsl(0_0%_20%)] mb-4 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Artworks
          </Link>
          <h1 className="text-xl font-medium text-[hsl(0_0%_12%)]">{isNew ? 'New Artwork' : 'Edit Artwork'}</h1>
        </div>

        {error && <div className="mb-6 text-[12px] text-red-600 py-2 px-3 bg-red-50 border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Title *">
              <input type="text" value={form.title} onChange={(e) => updateField('title', e.target.value)} className="admin-input" placeholder="Artwork title" />
            </Field>
            <Field label="Slug *">
              <input type="text" value={form.slug} onChange={(e) => { setSlugManual(true); updateField('slug', e.target.value); }} className="admin-input" placeholder="artwork-slug" />
            </Field>
          </div>

          {/* Year, Medium, Dimensions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Year">
              <input type="number" value={form.year} onChange={(e) => updateField('year', parseInt(e.target.value) || 0)} className="admin-input" />
            </Field>
            <Field label="Medium">
              <input type="text" value={form.medium} onChange={(e) => updateField('medium', e.target.value)} className="admin-input" placeholder="Oil on canvas" />
            </Field>
            <Field label="Dimensions">
              <input type="text" value={form.dimensions} onChange={(e) => updateField('dimensions', e.target.value)} className="admin-input" placeholder="120 × 150 cm" />
            </Field>
          </div>

          {/* Description */}
          <Field label="Description">
            <textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} className="admin-input min-h-[120px] resize-y" placeholder="Artist's note or description…" />
          </Field>

          {/* Status, Availability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Status">
              <select value={form.status} onChange={(e) => updateField('status', e.target.value)} className="admin-input">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </Field>
            <Field label="Availability">
              <select value={form.availability} onChange={(e) => updateField('availability', e.target.value)} className="admin-input">
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="not_for_sale">Not for Sale</option>
              </select>
            </Field>
          </div>

          {/* Commerce section */}
          <div className="pt-4 border-t border-[hsl(0_0%_90%)]">
            <h3 className="text-[12px] tracking-wider uppercase text-[hsl(0_0%_40%)] mb-4">Commerce</h3>

            <div className="space-y-4">
              <Field label="Sales Mode" hint="Controls how this artwork is sold on the public site.">
                <select value={form.sales_mode} onChange={(e) => updateField('sales_mode', e.target.value)} className="admin-input">
                  <option value="inquiry_only">Inquiry Only — collectors inquire privately</option>
                  <option value="hybrid">Hybrid — both online purchase and inquiry</option>
                  <option value="direct_purchase">Direct Purchase — online checkout link</option>
                </select>
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Price Amount" hint="Numeric value (e.g. 2500). Used for sorting and filtering.">
                  <input type="text" value={form.price_amount} onChange={(e) => updateField('price_amount', e.target.value)} className="admin-input" placeholder="2500" />
                </Field>
                <Field label="Price Display" hint="What the visitor sees (e.g. '€2,500' or 'Price on Request').">
                  <input type="text" value={form.price_display} onChange={(e) => updateField('price_display', e.target.value)} className="admin-input" placeholder="€2,500" />
                </Field>
              </div>

              <Field label="Legacy Price" hint="Original price field — kept for backwards compatibility.">
                <input type="text" value={form.price} onChange={(e) => updateField('price', e.target.value)} className="admin-input" placeholder="Price on Request" />
              </Field>

              {showPurchaseUrl && (
                <Field label="Purchase URL" hint="External checkout or payment link (Stripe, Gumroad, etc.)">
                  <input type="url" value={form.purchase_url} onChange={(e) => updateField('purchase_url', e.target.value)} className="admin-input" placeholder="https://checkout.stripe.com/…" />
                </Field>
              )}
            </div>
          </div>

          {/* Shipping & Trust */}
          <div className="pt-4 border-t border-[hsl(0_0%_90%)]">
            <h3 className="text-[12px] tracking-wider uppercase text-[hsl(0_0%_40%)] mb-4">Shipping & Trust</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Shipping Time" hint="e.g. '5–10 business days'">
                  <input type="text" value={form.shipping_time} onChange={(e) => updateField('shipping_time', e.target.value)} className="admin-input" placeholder="5–10 business days" />
                </Field>
                <Field label="Shipping Notes" hint="e.g. 'Ships worldwide, insured'">
                  <input type="text" value={form.shipping_notes} onChange={(e) => updateField('shipping_notes', e.target.value)} className="admin-input" placeholder="Ships worldwide, insured" />
                </Field>
              </div>

              <Field label="Returns Policy" hint="Short policy text shown on artwork page.">
                <input type="text" value={form.returns_policy_short} onChange={(e) => updateField('returns_policy_short', e.target.value)} className="admin-input" placeholder="14-day return policy" />
              </Field>

              <label className="flex items-center gap-2 text-[13px] text-[hsl(0_0%_35%)] cursor-pointer">
                <input type="checkbox" checked={form.certificate_included} onChange={(e) => updateField('certificate_included', e.target.checked)} className="accent-[hsl(0_0%_20%)]" />
                Certificate of Authenticity included
              </label>
            </div>
          </div>

          {/* Flags */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-[13px] text-[hsl(0_0%_35%)] cursor-pointer">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => updateField('is_featured', e.target.checked)} className="accent-[hsl(0_0%_20%)]" /> Featured
            </label>
            <label className="flex items-center gap-2 text-[13px] text-[hsl(0_0%_35%)] cursor-pointer">
              <input type="checkbox" checked={form.is_masterwork} onChange={(e) => updateField('is_masterwork', e.target.checked)} className="accent-[hsl(0_0%_20%)]" /> Masterwork
            </label>
          </div>

          {/* Primary Image */}
          <Field label="Primary Image">
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
                {uploading ? 'Uploading…' : 'Upload primary image'}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(file, 'primary'); }} />
              </label>
            )}
          </Field>

          {/* Additional Images */}
          <Field label="Additional Images">
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
              {uploading ? 'Uploading…' : 'Add image'}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(file, 'additional'); }} />
            </label>
          </Field>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-[hsl(0_0%_90%)]">
            <button type="submit" disabled={saving} className="px-6 py-2.5 text-[12px] tracking-wider uppercase bg-[hsl(0_0%_12%)] text-white hover:bg-[hsl(0_0%_20%)] transition-colors disabled:opacity-50">
              {saving ? 'Saving…' : isNew ? 'Create Artwork' : 'Save Changes'}
            </button>
            <Link to="/admin/artworks" className="px-6 py-2.5 text-[12px] tracking-wider uppercase border border-[hsl(0_0%_85%)] text-[hsl(0_0%_40%)] hover:border-[hsl(0_0%_60%)] transition-colors">
              Cancel
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
