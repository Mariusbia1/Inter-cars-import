/**
 * Service d'expédition d'emails de notification pour les demandes de devis
 * Achemine les emails directement à l'adresse officielle : contact@inter-cars-import.fr
 * Format 100% en Français avec tableau structuré et réponse directe au client.
 */
export const emailNotificationService = {
  async sendLeadNotification(leadData, recipientEmail = 'contact@inter-cars-import.fr') {
    const targetEmail = recipientEmail || 'contact@inter-cars-import.fr';
    const vehicleName = `${leadData.brand_sought || 'Véhicule'} ${leadData.model_sought || ''}`.trim();
    const clientName = leadData.full_name || 'Client';
    const subject = `Demande de Devis : ${vehicleName} — ${clientName}`;

    try {
      const payload = {
        _subject: subject,
        _template: 'table',
        _captcha: 'false',
        _replyto: leadData.email || targetEmail,
        _autoresponse: `Bonjour ${clientName},\n\nNous avons bien reçu votre demande concernant votre recherche de ${vehicleName}.\n\nNotre équipe d'experts analyse actuellement votre dossier auprès de notre réseau de partenaires exclusifs en France. Un conseiller dédié prendra contact avec vous par téléphone ou par email sous 24h à 48h ouvrées.\n\nRestant à votre entière disposition,\n\nBien cordialement,\nL'équipe commerciale Inter Cars Import\nEmail : contact@inter-cars-import.fr\nSite web : https://inter-cars-import.fr`,
        'Nom et Prénom': clientName,
        'Numéro de Téléphone': leadData.phone || 'Non renseigné',
        'Adresse Email du Client': leadData.email || 'Non renseignée',
        'Véhicule Recherché': vehicleName,
        'Catégorie': leadData.vehicle_type || 'Non spécifiée',
        'Motorisation Souhaitée': leadData.fuel_type || 'Indifférent',
        'Kilométrage Maximum': leadData.mileage_max || 'Non spécifié',
        'Délai Souhaité': leadData.preferred_timeline || 'Moins de 30 jours',
        'Ville de Livraison': leadData.delivery_city || 'France',
        'Critères et Équipements': leadData.message || 'Aucune remarque particulière',
        'Date et Heure de Réception': new Date().toLocaleString('fr-FR', {
          timeZone: 'Europe/Paris',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        'Source de la Demande': 'Formulaire Web Officiel — Inter Cars Import'
      };

      const response = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log('📬 Notification email transmise :', result);

      return {
        success: result.success === 'true' || result.success === true,
        data: result
      };
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de la notification email:', error);
      return { success: false, error: error.message };
    }
  }
};
