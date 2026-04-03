import AdminLayout from '@/components/admin/AdminLayout';

const SiteSettings = () => (
  <AdminLayout>
    <div className="mb-8">
      <h1 className="text-xl font-medium text-[hsl(0_0%_12%)]">Site Settings</h1>
      <p className="text-[13px] text-[hsl(0_0%_50%)] mt-1">Manage site configuration and content.</p>
    </div>
    <div className="py-16 text-center bg-white border border-[hsl(0_0%_90%)]">
      <p className="text-[13px] text-[hsl(0_0%_50%)]">Settings management coming soon.</p>
      <p className="text-[11px] text-[hsl(0_0%_60%)] mt-2">This section will allow editing site text, hero content, and other configuration.</p>
    </div>
  </AdminLayout>
);

export default SiteSettings;
