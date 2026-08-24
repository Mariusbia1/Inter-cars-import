/**
 * Service d'expédition d'emails de notification pour les demandes de devis
 * Achemine les emails à la direction (contact@inter-cars-import.fr) et un accusé de réception soigné au client.
 * 100% en Français, professionnel, sans emoji et sans mise en forme superflue.
 */
export const emailNotificationService = {
  async sendLeadNotification(leadData, recipientEmail = 'contact@inter-cars-import.fr') {
    const targetEmail = recipientEmail || 'contact@inter-cars-import.fr';
    const vehicleName = `${leadData.brand_sought || 'Véhicule'} ${leadData.model_sought || ''}`.trim();
    const clientName = leadData.full_name || 'Client';
    const clientEmail = leadData.email || '';
    const subject = `Demande de Devis : ${vehicleName} — ${clientName}`;

    // Message d'accusé de réception automatique élégant et formel envoyé au client
    const clientConfirmationMessage = `Bonjour ${clientName},

Nous avons bien enregistré votre demande de devis concernant votre recherche de : ${vehicleName}.

Notre équipe commerciale étudie vos critères auprès de notre réseau de concessions partenaires officielles en France. Un conseiller dédié prendra contact avec vous au ${leadData.phone || 'téléphone'} sous 24 à 48 heures ouvrées afin de vous présenter les opportunités sélectionnées.

Récapitulatif de votre demande :
• Véhicule ciblé : ${vehicleName}
• Catégorie : ${leadData.vehicle_type || 'Non spécifiée'}
• Motorisation : ${leadData.fuel_type || 'Indifférent'}
• Kilométrage max : ${leadData.mileage_max || 'Non spécifié'}
• Délai souhaité : ${leadData.preferred_timeline || 'Moins de 30 jours'}
• Ville de livraison : ${leadData.delivery_city || 'France'}
• Remarques : ${leadData.message || 'Aucune'}

Nous restons à votre entière disposition pour toute question.

Bien cordialement,
La Direction Commerciale
Inter Cars Import
contact@inter-cars-import.fr
https://inter-cars-import.fr`;

    try {
      // 1. Tenter l'envoi via la fonction Serverless Vercel (/api/send-email)
      const apiResponse = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...leadData,
          recipientEmail: targetEmail,
          clientConfirmationMessage: clientConfirmationMessage
        })
      });

      if (apiResponse.ok) {
        const result = await apiResponse.json();
        console.log('Notification email traitée par API Serverless :', result);
        return { success: true, method: 'serverless' };
      }
    } catch (apiErr) {
      console.info('Envoi direct fallback...');
    }

    // 2. Fallback direct avec présentation propre, soignée, 100% française et sans emoji
    try {
      const payload = {
        _subject: subject,
        _template: 'box',
        _captcha: 'false',
        _replyto: clientEmail || targetEmail,
        _autoresponse: clientConfirmationMessage,
        'email': clientEmail,
        'Nom et Prenom': clientName,
        'Numero de Telephone': leadData.phone || 'Non renseigne',
        'Adresse Email du Client': clientEmail || 'Non renseignee',
        'Vehicule Recherche': vehicleName,
        'Categorie': leadData.vehicle_type || 'Non specifiee',
        'Motorisation Souhaitee': leadData.fuel_type || 'Indifferent',
        'Kilometrage Maximum': leadData.mileage_max || 'Non specifie',
        'Delai de Livraison': leadData.preferred_timeline || 'Moins de 30 jours',
        'Ville de Livraison': leadData.delivery_city || 'France',
        'Criteres et Remarques': leadData.message || 'Aucune remarque particuliere',
        'Date de Reception': new Date().toLocaleString('fr-FR', {
          timeZone: 'Europe/Paris',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        'Entite Commerciale': 'Inter Cars Import SAS'
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
      console.error('Erreur dispatch email:', error);
      return { success: false, error: error.message };
    }
  }
};
