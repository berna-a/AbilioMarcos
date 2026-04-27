import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, Image, MessageSquare, Paintbrush, BarChart3, Settings, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAdmin } from '@/i18n';
import SignatureLogo from '@/components/layout/SignatureLogo';

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const admin = useAdmin();

  const navItems = [
    { label: admin.sidebar.dashboard, to: '/admin', icon: LayoutDashboard },
    { label: admin.sidebar.artworks, to: '/admin/artworks', icon: Image },
    { label: admin.sidebar.inquiries, to: '/admin/inquiries', icon: MessageSquare },
    { label: admin.sidebar.commissions, to: '/admin/commissions', icon: Paintbrush },
    { label: admin.sidebar.analytics, to: '/admin/analytics', icon: BarChart3 },
    { label: admin.sidebar.settings, to: '/admin/settings', icon: Settings },
  ];

  const handleSignOut = async () => { await signOut(); navigate('/admin/login'); };
  const isActive = (path: string) => path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-[hsl(0_0%_97%)] flex">
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-[10.5rem] bg-white border-r border-[hsl(0_0%_90%)] flex flex-col transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-14 flex items-center px-5 border-b border-[hsl(0_0%_90%)]">
          <Link to="/admin" className="flex items-center"><SignatureLogo className="h-10 w-36 text-[hsl(0_0%_15%)]" /></Link>
          <button className="ml-auto lg:hidden text-[hsl(0_0%_40%)]" onClick={() => setSidebarOpen(false)}><X className="w-4 h-4" /></button>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-3 py-2 text-[13px] rounded transition-colors ${isActive(item.to) ? 'bg-[hsl(0_0%_95%)] text-[hsl(0_0%_10%)] font-medium' : 'text-[hsl(0_0%_45%)] hover:text-[hsl(0_0%_15%)] hover:bg-[hsl(0_0%_96%)]'}`}>
              <item.icon className="w-4 h-4" />{item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-[hsl(0_0%_90%)]">
          <div className="px-3 py-1.5 mb-1"><p className="text-[11px] text-[hsl(0_0%_50%)] truncate">{user?.email}</p></div>
          <button onClick={handleSignOut} className="flex items-center gap-3 px-3 py-2 text-[13px] text-[hsl(0_0%_45%)] hover:text-[hsl(0_0%_15%)] hover:bg-[hsl(0_0%_96%)] w-full rounded transition-colors">
            <LogOut className="w-4 h-4" />{admin.sidebar.signOut}
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-[hsl(0_0%_90%)] flex items-center px-5 sticky top-0 z-30">
          <button className="lg:hidden mr-4 text-[hsl(0_0%_40%)]" onClick={() => setSidebarOpen(true)}><Menu className="w-5 h-5" /></button>
          <div className="flex-1" />
          <Link to="/" target="_blank" className="text-[11px] tracking-wide text-[hsl(0_0%_50%)] hover:text-[hsl(0_0%_20%)] transition-colors">{admin.sidebar.viewSite}</Link>
        </header>
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
