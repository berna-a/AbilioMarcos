import AdminLayout from '@/components/admin/AdminLayout';
import { useAdmin } from '@/i18n';

const Commissions = () => {
  const admin = useAdmin();
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-xl font-medium text-[hsl(0_0%_12%)]">{admin.commissions.title}</h1>
        <p className="text-[13px] text-[hsl(0_0%_50%)] mt-1">{admin.commissions.subtitle}</p>
      </div>
      <div className="py-16 text-center bg-white border border-[hsl(0_0%_90%)]">
        <p className="text-[13px] text-[hsl(0_0%_50%)]">{admin.commissions.noCommissions}</p>
        <p className="text-[11px] text-[hsl(0_0%_60%)] mt-2">{admin.commissions.comingSoon}</p>
      </div>
    </AdminLayout>
  );
};

export default Commissions;
