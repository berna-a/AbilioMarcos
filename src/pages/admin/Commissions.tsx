import AdminLayout from '@/components/admin/AdminLayout';

const Commissions = () => (
  <AdminLayout>
    <div className="mb-8">
      <h1 className="text-xl font-medium text-[hsl(0_0%_12%)]">Commission Requests</h1>
      <p className="text-[13px] text-[hsl(0_0%_50%)] mt-1">Manage commission requests from clients.</p>
    </div>
    <div className="py-16 text-center bg-white border border-[hsl(0_0%_90%)]">
      <p className="text-[13px] text-[hsl(0_0%_50%)]">No commission requests yet.</p>
      <p className="text-[11px] text-[hsl(0_0%_60%)] mt-2">Commission management will be implemented in a future update.</p>
    </div>
  </AdminLayout>
);

export default Commissions;
