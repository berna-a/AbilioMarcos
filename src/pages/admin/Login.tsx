import { useState } from 'react';
import abmaGif from '@/assets/AbMa_GIF.gif';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/i18n';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const admin = useAdmin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    const { error } = await signIn(email, password, rememberMe);
    if (error) { setError(admin.login.invalidCredentials); setLoading(false); } else { navigate('/admin'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfdfd] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <img src={abmaGif} alt="Abílio Marcos" className="h-[13.75rem] mx-auto" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-[12px] text-red-600 text-center py-2 bg-red-50 border border-red-100">{error}</div>}
          <div>
            <label className="block text-[11px] tracking-wide text-[hsl(0_0%_45%)] mb-1.5 uppercase">{admin.login.email}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2.5 text-[13px] border border-[hsl(0_0%_85%)] bg-white focus:outline-none focus:border-[hsl(0_0%_50%)] transition-colors" placeholder="admin@example.com" />
          </div>
          <div>
            <label className="block text-[11px] tracking-wide text-[hsl(0_0%_45%)] mb-1.5 uppercase">{admin.login.password}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2.5 text-[13px] border border-[hsl(0_0%_85%)] bg-white focus:outline-none focus:border-[hsl(0_0%_50%)] transition-colors" />
          </div>
          <label className="flex items-center gap-2 text-[12px] text-[hsl(0_0%_35%)] select-none cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-3.5 w-3.5 accent-[hsl(0_0%_12%)]"
            />
            {admin.login.rememberMe}
          </label>
          <button type="submit" disabled={loading} className="w-full py-2.5 text-[12px] tracking-wider uppercase bg-[hsl(0_0%_12%)] text-white hover:bg-[hsl(0_0%_20%)] transition-colors disabled:opacity-50">
            {loading ? admin.login.signingIn : admin.login.signIn}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
