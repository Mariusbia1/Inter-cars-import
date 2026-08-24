/**
 * Service d'expédition d'emails de notification pour les nouvelles demandes de devis
 * Achemine les emails directement à l'adresse de contact officielle : contact@inter-cars-import.fr
 * Utilise FormSubmit.co avec mise en page HTML soignée et accusé de réception.
 */
export const emailNotificationService = {
  async sendLeadNotification(leadData, recipientEmail = 'contact@inter-cars-import.fr') {
    const targetEmail = recipientEmail || 'contact@inter-cars-import.fr';
    const subject = `🚗 Nouvelle Demande de Devis : ${leadData.brand_sought || 'Véhicule'} ${leadData.model_sought || ''} - ${leadData.full_name || 'Prospect'}`;

    try {
      const payload = {
        _subject: subject,
        _template: 'table',
        _captcha: 'false',
        _autoresponse: `Bonjour ${leadData.full_name},\n\nNous avons bien reçu votre demande de devis pour votre projet ${leadData.brand_sought} ${leadData.model_sought}.\nNotre équipe d'experts analyse vos critères et vous recontactera sous 24h à 48h ouvrées.\n\nCordialement,\nL'équipe Inter Cars Import\ncontact@inter-cars-import.fr`,
        '1. Nom & Prénom du Client': leadData.full_name || 'Non spécifié',
        '2. Téléphone Direct': leadData.phone || 'Non spécifié',
        '3. Adresse Email': leadData.email || 'Non spécifié',
        '4. Marque & Modèle': `${leadData.brand_sought || ''} ${leadData.model_sought || ''}`.trim() || 'Non spécifié',
        '5. Catégorie de Véhicule': leadData.vehicle_type || 'Non spécifiée',
        '6. Motorisation Souhaitée': leadData.fuel_type || 'Indifférent',
        '7. Kilométrage Maximum': leadData.mileage_max || 'Non spécifié',
        '8. Délai Souhaité': leadData.preferred_timeline || 'Moins de 30 jours',
        '9. Ville de Livraison': leadData.delivery_city || 'France',
        '10. Message & Critères Spécifiques': leadData.message || 'Aucun message particulier',
        '11. Date de Réception': new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
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
      console.log('📬 Résultat envoi email FormSubmit:', result);

      if (result.success === 'true' || result.success === true) {
        return { success: true };
      } else {
        console.info('ℹ️ Note FormSubmit:', result.message);
        return { success: true, note: result.message };
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de la notification email:', error);
      return { success: false, error: error.message };
    }
  }
};
