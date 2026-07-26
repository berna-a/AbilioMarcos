import { useEffect, useState, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { getConvexClient } from '@/lib/convexClient';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import { Search, Package } from 'lucide-react';
import { toast } from 'sonner';

interface Order {
  id: string;
  artwork_title: string | null;
  customer_email: string | null;
  amount: number | null;
  currency: string | null;
  payment_status: string | null;
  shipping_status: string;
  created_at: string;
}

const SHIPPING = ['aguarda_envio', 'enviado', 'entregue'] as const;
const shippingLabels: Record<string, string> = {
  aguarda_envio: 'Aguarda envio',
  enviado: 'Enviado',
  entregue: 'Entregue',
};
const shippingColors: Record<string, string> = {
  aguarda_envio: 'bg-amber-100 text-amber-700',
  enviado: 'bg-blue-100 text-blue-700',
  entregue: 'bg-emerald-100 text-emerald-700',
};
const paymentColors: Record<string, string> = {
  paid: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  failed: 'bg-red-100 text-red-700',
};
const paymentLabels: Record<string, string> = {
  paid: 'Pago', pending: 'Pendente', failed: 'Falhou',
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [shipFilter, setShipFilter] = useState('all');
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const data = await getConvexClient().query(api.orders.getOrders, {});
      setOrders(
        (data || []).map((o) => ({
          id: o._id,
          artwork_title: o.artwork_title ?? null,
          customer_email: o.customer_email ?? null,
          amount: o.amount != null ? Number(o.amount) : null,
          currency: o.currency ?? null,
          payment_status: o.payment_status ?? null,
          shipping_status: o.shipping_status ?? 'aguarda_envio',
          created_at: o.created_at ?? '',
        })),
      );
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    setLoading(false);
  };
  useEffect(() => { fetchOrders(); }, []);

  const filtered = useMemo(() => orders.filter((o) => {
    if (shipFilter !== 'all' && o.shipping_status !== shipFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (o.customer_email || '').toLowerCase().includes(s) || (o.artwork_title || '').toLowerCase().includes(s);
    }
    return true;
  }), [orders, search, shipFilter]);

  const updateShipping = async (id: string, shipping_status: string) => {
    setUpdating(id);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, shipping_status } : o)));
    try {
      await getConvexClient().mutation(api.orders.updateShippingStatus, { id: id as Id<'orders'>, shipping_status });
      toast.success('Estado de envio atualizado ✓');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Não foi possível guardar. Tenta de novo.');
      await fetchOrders();
    }
    setUpdating(null);
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' });
  const formatAmount = (a: number | null, c: string | null) =>
    a != null ? `${(c || 'eur').toUpperCase() === 'EUR' ? '€' : ''}${Number(a).toLocaleString('pt-PT')}` : '—';

  const aguardam = orders.filter((o) => o.shipping_status === 'aguarda_envio').length;

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-xl font-medium text-[hsl(0_0%_12%)]">Encomendas</h1>
        <p className="text-[13px] text-[hsl(0_0%_50%)] mt-1">{orders.length} no total · {aguardam} a aguardar envio</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(0_0%_55%)]" />
          <input type="text" placeholder="Procurar por obra ou email…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 text-[13px] border border-[hsl(0_0%_85%)] bg-white focus:outline-none focus:border-[hsl(0_0%_50%)] transition-colors" />
        </div>
        <select value={shipFilter} onChange={(e) => setShipFilter(e.target.value)} className="px-3 py-2 text-[13px] border border-[hsl(0_0%_85%)] bg-white focus:outline-none focus:border-[hsl(0_0%_50%)] transition-colors">
          <option value="all">Todos os envios</option>
          <option value="aguarda_envio">Aguarda envio</option>
          <option value="enviado">Enviado</option>
          <option value="entregue">Entregue</option>
        </select>
      </div>
      {loading ? (
        <p className="text-[13px] text-[hsl(0_0%_50%)] py-12 text-center">A carregar…</p>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center bg-white border border-[hsl(0_0%_90%)]">
          <Package className="w-8 h-8 mx-auto text-[hsl(0_0%_75%)] mb-3" />
          <p className="text-[13px] text-[hsl(0_0%_50%)]">{orders.length === 0 ? 'Ainda não há encomendas.' : 'Nenhuma encomenda corresponde aos filtros.'}</p>
        </div>
      ) : (
        <div className="bg-white border border-[hsl(0_0%_90%)] overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[hsl(0_0%_92%)]">
                <th className="px-4 py-3 text-[11px] tracking-wide uppercase text-[hsl(0_0%_50%)] font-medium">Data</th>
                <th className="px-4 py-3 text-[11px] tracking-wide uppercase text-[hsl(0_0%_50%)] font-medium">Obra</th>
                <th className="px-4 py-3 text-[11px] tracking-wide uppercase text-[hsl(0_0%_50%)] font-medium">Comprador</th>
                <th className="px-4 py-3 text-[11px] tracking-wide uppercase text-[hsl(0_0%_50%)] font-medium">Montante</th>
                <th className="px-4 py-3 text-[11px] tracking-wide uppercase text-[hsl(0_0%_50%)] font-medium">Pagamento</th>
                <th className="px-4 py-3 text-[11px] tracking-wide uppercase text-[hsl(0_0%_50%)] font-medium">Envio</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-[hsl(0_0%_95%)] last:border-b-0 hover:bg-[hsl(0_0%_98%)] transition-colors">
                  <td className="px-4 py-3 text-[13px] text-[hsl(0_0%_40%)] whitespace-nowrap">{formatDate(o.created_at)}</td>
                  <td className="px-4 py-3 text-[13px] font-medium text-[hsl(0_0%_15%)]">{o.artwork_title || '—'}</td>
                  <td className="px-4 py-3 text-[13px] text-[hsl(0_0%_40%)]">{o.customer_email || '—'}</td>
                  <td className="px-4 py-3 text-[13px] text-[hsl(0_0%_40%)] whitespace-nowrap">{formatAmount(o.amount, o.currency)}</td>
                  <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 text-[11px] font-medium ${paymentColors[o.payment_status || ''] || 'bg-gray-100 text-gray-500'}`}>{paymentLabels[o.payment_status || ''] || o.payment_status || '—'}</span></td>
                  <td className="px-4 py-3">
                    <select
                      value={o.shipping_status}
                      onChange={(e) => updateShipping(o.id, e.target.value)}
                      disabled={updating === o.id}
                      className={`text-[12px] font-medium border-0 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[hsl(0_0%_50%)] cursor-pointer disabled:opacity-50 ${shippingColors[o.shipping_status] || 'bg-gray-100 text-gray-600'}`}
                    >
                      {SHIPPING.map((s) => <option key={s} value={s}>{shippingLabels[s]}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default Orders;
