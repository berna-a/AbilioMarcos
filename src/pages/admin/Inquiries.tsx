import AdminLayout from '@/components/admin/AdminLayout';

const Inquiries = () => (
  <AdminLayout>
    <div className="mb-8">
      <h1 className="text-xl font-medium text-[hsl(0_0%_12%)]">Inquiries</h1>
      <p className="text-[13px] text-[hsl(0_0%_50%)] mt-1">Manage artwork inquiries from collectors.</p>
    </div>
    <div className="py-16 text-center bg-white border border-[hsl(0_0%_90%)]">
      <p className="text-[13px] text-[hsl(0_0%_50%)]">No inquiries yet.</p>
      <p className="text-[11px] text-[hsl(0_0%_60%)] mt-2">Inquiry management will be implemented in a future update.</p>
    </div>
  </AdminLayout>
);

export default Inquiries;
