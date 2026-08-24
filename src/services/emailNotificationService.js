/**
 * Service d'expédition d'emails de notification pour les nouvelles demandes de devis
 * Utilise l'API Web3Forms / Formspree pour acheminer les emails directement à la direction.
 */
export const emailNotificationService = {
  async sendLeadNotification(leadData, recipientEmail = 'direction@intercarsimport.fr') {
    try {
      const subject = `🚗 Nouvelle Demande de Devis : ${leadData.brand_sought || 'Véhicule'} ${leadData.model_sought || ''} - ${leadData.full_name}`;
      
      const emailBody = `
======================================================
NOUVELLE DEMANDE DE DEVIS REÇUE SUR INTER CARS IMPORT
======================================================

👤 INFORMATIONS DU CLIENT :
• Nom & Prénom : ${leadData.full_name || 'Non spécifié'}
• Téléphone : ${leadData.phone || 'Non spécifié'}
• Email : ${leadData.email || 'Non spécifié'}
• Ville de Livraison : ${leadData.delivery_city || 'France'}

🚘 VÉHICULE RECHERCHÉ :
• Marque : ${leadData.brand_sought || 'Non spécifiée'}
• Modèle : ${leadData.model_sought || 'Non spécifié'}
• Catégorie : ${leadData.vehicle_type || 'Non spécifiée'}
• Motorisation : ${leadData.fuel_type || 'Non spécifiée'}
• Kilométrage max : ${leadData.mileage_max || 'Non spécifié'}
• Délai souhaité : ${leadData.preferred_timeline || 'Moins de 30 jours'}

📝 MESSAGE / CRITÈRES SPÉCIFIQUES :
${leadData.message || 'Aucun message supplémentaire.'}

------------------------------------------------------
Date de réception : ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}
Source : Formulaire Web Inter Cars Import
======================================================
      `.trim();

      // Envoi via Web3Forms API
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: '92e947d1-0f72-4d20-a681-364dfebdfae5', // Clé Web3Forms active
          subject: subject,
          from_name: 'Inter Cars Import - Formulaire Web',
          to_email: recipientEmail,
          email: leadData.email,
          name: leadData.full_name,
          phone: leadData.phone,
          message: emailBody,
          vehicle_brand: leadData.brand_sought,
          vehicle_model: leadData.model_sought,
          vehicle_category: leadData.vehicle_type,
          delivery_city: leadData.delivery_city,
          timeline: leadData.preferred_timeline
        })
      });

      const result = await response.json();
      if (result.success) {
        console.log('✅ Notification email envoyée avec succès à :', recipientEmail);
        return { success: true };
      } else {
        console.warn('⚠️ Échec envoi email Web3Forms:', result);
        return { success: false, error: result.message };
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de la notification email:', error);
      return { success: false, error: error.message };
    }
  }
};
