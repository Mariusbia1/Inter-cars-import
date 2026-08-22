import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, KeyRound, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { LuxuryButton } from '../../components/common/LuxuryButton';
import { BrandLogo } from '../../components/common/BrandLogo';
import { useToast } from '../../context/ToastContext';

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await login(email, password);
      if (res.success) {
        addToast('Connexion réussie à l’espace Conciergerie Privée !', 'success');
        navigate('/admin');
      } else {
        setError(res.error || 'Identifiants invalides.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-rolex-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Texture de fond dorée */}
      <div className="absolute inset-0 bg-[radial-gradient(#C6A15B_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />

      {/* Bouton Retour Site Public */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold uppercase tracking-wider border border-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Retour au site
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md bg-white/[0.04] backdrop-blur-xl border border-gold/40 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 text-white"
      >
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-2">
            <BrandLogo size="lg" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-white">
              Espace Conciergerie Privée
            </h1>
            <p className="text-xs uppercase tracking-widest text-gold font-semibold mt-0.5">
              Accès Réservé à l'Administration
            </p>
          </div>
        </div>

        {/* Message d'Erreur */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs leading-relaxed text-center">
            {error}
          </div>
        )}

        {/* Formulaire de Connexion Sécurisé (Champs Vides) */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
              Identifiant / Email Administrateur
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@inter-cars-import.fr"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-slate-500 outline-none focus:border-gold transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
              Mot de Passe Sécurisé
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-slate-500 outline-none focus:border-gold transition-colors"
              />
            </div>
          </div>

          <div className="pt-2">
            <LuxuryButton
              type="submit"
              disabled={loading}
              variant="gold"
              size="md"
              className="w-full justify-center shadow-gold-glow font-bold tracking-wider"
              icon={ArrowRight}
            >
              {loading ? 'Authentification...' : 'Se Connecter'}
            </LuxuryButton>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
