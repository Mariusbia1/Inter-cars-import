/**
 * Service d'expédition d'emails de notification pour les demandes de devis
 * Achemine les emails via la fonction API Serverless /api/send-email avec template HTML haute fidélité.
 * 100% en Français, direct et soigné.
 */
export const emailNotificationService = {
  async sendLeadNotification(leadData, recipientEmail = 'contact@inter-cars-import.fr') {
    const targetEmail = recipientEmail || 'contact@inter-cars-import.fr';
    const vehicleName = `${leadData.brand_sought || 'Véhicule'} ${leadData.model_sought || ''}`.trim();
    const clientName = leadData.full_name || 'Client';
    const subject = `🚗 Demande de Devis : ${vehicleName} — ${clientName}`;

    try {
      // 1. Tenter l'envoi via la fonction Serverless Vercel (/api/send-email)
      const apiResponse = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...leadData,
          recipientEmail: targetEmail
        })
      });

      if (apiResponse.ok) {
        const result = await apiResponse.json();
        console.log('✅ Email envoyé via API Serverless :', result);
        return { success: true, method: 'serverless' };
      }
    } catch (apiErr) {
      console.info('ℹ️ Envoi direct fallback...');
    }

    // 2. Fallback direct avec présentation soignée
    try {
      const payload = {
        _subject: subject,
        _template: 'box',
        _captcha: 'false',
        _replyto: leadData.email || targetEmail,
        '👤 Nom & Prénom': clientName,
        '📞 Numéro de Téléphone': leadData.phone || 'Non renseigné',
        '📧 Adresse Email': leadData.email || 'Non renseignée',
        '🚘 Véhicule Recherché': vehicleName,
        '📁 Catégorie': leadData.vehicle_type || 'Non spécifiée',
        '⛽ Motorisation': leadData.fuel_type || 'Indifférent',
        '🛣️ Kilométrage Max': leadData.mileage_max || 'Non spécifié',
        '⏱️ Délai Souhaité': leadData.preferred_timeline || 'Moins de 30 jours',
        '📍 Ville de Livraison': leadData.delivery_city || 'France',
        '📝 Remarques & Équipements': leadData.message || 'Aucune remarque spécifique',
        '📅 Date & Heure': new Date().toLocaleString('fr-FR', {
          timeZone: 'Europe/Paris',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        '🏢 Société': 'Inter Cars Import (Vente de Véhicules d\'Occasion)'
      };

      const fallbackRes = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const json = await fallbackRes.json();
      return { success: true, data: json };
    } catch (error) {
      console.error('❌ Erreur dispatch email:', error);
      return { success: false, error: error.message };
    }
  }
};
