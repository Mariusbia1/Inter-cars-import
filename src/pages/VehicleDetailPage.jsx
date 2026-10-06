import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  ArrowLeft, 
  Share2, 
  Heart, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Gauge, 
  Zap, 
  Phone,
  Car
} from 'lucide-react';
import { useVehicles } from '../context/VehicleContext';
import { vehiclesService } from '../services/vehiclesService';
import { VehicleGallery } from '../components/vehicle/VehicleGallery';
import { VehicleBuyBox } from '../components/vehicle/VehicleBuyBox';
import { VehicleSpecsAndEquipments } from '../components/vehicle/VehicleSpecsAndEquipments';
import { VehicleLeadForm } from '../components/vehicle/VehicleLeadForm';
import { SimilarVehicles } from '../components/vehicle/SimilarVehicles';
import { FinalCta } from '../components/home/FinalCta';
import { useToast } from '../context/ToastContext';

export const VehicleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vehicles } = useVehicles();
  const { addToast } = useToast();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const quoteFormRef = useRef(null);

  // Charger le véhicule
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadVehicle = async () => {
      // Chercher d'abord dans le context
      const foundInContext = vehicles.find((v) => String(v.id) === String(id));
      if (foundInContext) {
        if (isMounted) {
          setVehicle(foundInContext);
          setLoading(false);
        }
        return;
      }

      // Sinon charger via le service
      try {
        const fetched = await vehiclesService.getVehicleById(id);
        if (isMounted) {
          if (fetched) {
            setVehicle(fetched);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading vehicle:', err);
        if (isMounted) setLoading(false);
      }
    };

    loadVehicle();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      isMounted = false;
    };
  }, [id, vehicles]);

  const handleScrollToQuoteForm = () => {
    if (quoteFormRef.current) {
      quoteFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: vehicle?.title || 'Véhicule Inter Cars Import',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Lien de la fiche copié dans le presse-papier !', 'success');
    }
  };

  if (loading) {
    return (
      <div className="pt-36 pb-24 min-h-screen bg-surface flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-rolex border-t-gold rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-600">Chargement de la fiche véhicule...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="pt-36 pb-24 min-h-screen bg-surface flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
          <Car className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">
          Véhicule introuvable ou déjà vendu
        </h2>
        <p className="text-sm text-slate-500 max-w-md mb-6">
          Ce véhicule n'est plus disponible ou l'identifiant est incorrect. Découvrez nos autres opportunités certifiées en stock.
        </p>
        <Link
          to="/vehicules-livres"
          className="px-6 py-3 rounded-lg bg-rolex text-gold font-bold text-xs uppercase tracking-wider shadow-md hover:bg-rolex-dark transition-colors"
        >
          Voir tous les véhicules disponibles
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 sm:pt-32 bg-[#f8fafc] min-h-screen">
      
      {/* 1. Fil d'Ariane & Barre d'Actions Supérieure */}
      <div className="bg-white border-b border-slate-200 py-3 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-rolex transition-colors">Accueil</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link to="/vehicules-livres" className="hover:text-rolex transition-colors">Véhicules Disponibles</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-400">{vehicle.brand}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-none">
              {vehicle.title}
            </span>
          </nav>

          {/* Boutons d'actions rapides */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={() => navigate(-1)}
              className="text-xs font-semibold text-slate-600 hover:text-rolex flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Retour
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 rounded-md text-slate-600 hover:text-rolex hover:bg-slate-100 transition-colors"
              title="Partager cette annonce"
              aria-label="Partager"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setIsSaved(!isSaved);
                addToast(isSaved ? 'Véhicule retiré des favoris' : 'Véhicule ajouté aux favoris !', 'info');
              }}
              className={`p-1.5 rounded-md transition-colors ${
                isSaved ? 'text-rose-600 bg-rose-50' : 'text-slate-600 hover:text-rose-600 hover:bg-slate-100'
              }`}
              title="Ajouter aux favoris"
              aria-label="Favoris"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. En-tête Titre & Localisation du Véhicule */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-rolex text-gold border border-gold/30">
                {vehicle.category}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gold" /> {vehicle.origin_country || 'Réseau Partenaire France'} • Livrable partout en France
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-extrabold text-slate-900 tracking-tight">
              {vehicle.title}
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> 1ère Main Certifiée
            </span>
            <span className="flex items-center gap-1 text-rolex bg-rolex/5 px-2.5 py-1 rounded-md border border-rolex/20">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" /> 150 Pts Contrôlés
            </span>
          </div>
        </div>
      </div>

      {/* 3. Zone Principale Haute (Galerie Miniatures à Gauche + Bloc Prix / Variantes / CTA à Droite) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Galerie Photo (8 colonnes sur grand écran) */}
          <div className="lg:col-span-8">
            <VehicleGallery
              vehicle={vehicle}
            />
          </div>

          {/* Bloc d'Achat & Tarification (4 colonnes sur grand écran) */}
          <div className="lg:col-span-4 sticky top-28">
            <VehicleBuyBox
              vehicle={vehicle}
              onRequestQuoteClick={handleScrollToQuoteForm}
            />
          </div>
        </div>
      </div>

      {/* 4. Caractéristiques Techniques & Rapport d'Audit 150 Points */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <VehicleSpecsAndEquipments vehicle={vehicle} />
      </div>

      {/* 5. Avis Client / Témoignage lié au véhicule */}
      {vehicle.client_review && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-rolex-dark via-rolex to-rolex-forest text-white border border-gold/30 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gold text-rolex-dark font-serif font-bold text-base flex items-center justify-center shadow-md">
                  {vehicle.client_name?.charAt(0) || 'C'}
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg text-white">
                    {vehicle.client_name}
                  </h4>
                  <p className="text-xs text-slate-300">
                    Acheteur vérifié • Livré à {vehicle.client_city || 'domicile'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-gold text-base">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
                <span className="text-xs text-slate-200 ml-1 font-semibold">(5.0 / 5)</span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-200 italic font-light leading-relaxed">
              "{vehicle.client_review}"
            </p>
          </div>
        </div>
      )}

      {/* 6. Formulaire de Demande de Devis & Réservation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <VehicleLeadForm
          vehicle={vehicle}
          formRef={quoteFormRef}
        />
      </div>

      {/* 7. Suggestions de Véhicules Similaires */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <SimilarVehicles
          currentVehicle={vehicle}
          allVehicles={vehicles}
        />
      </div>

      {/* 8. CTA Final */}
      <FinalCta />
    </div>
  );
};
