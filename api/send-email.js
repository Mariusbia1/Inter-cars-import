import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Méthode non autorisée' });
  }

  try {
    const leadData = req.body || {};
    const recipientEmail = process.env.NOTIFICATION_EMAIL || process.env.EMAIL || 'contact@inter-cars-import.fr';
    const vehicleName = `${leadData.brand_sought || 'Véhicule'} ${leadData.model_sought || ''}`.trim();
    const clientName = leadData.full_name || 'Client';
    const clientEmail = leadData.email || '';
    const subject = `Demande de Devis : ${vehicleName} — ${clientName}`;

    const dateFormatted = new Date().toLocaleString('fr-FR', {
      timeZone: 'Europe/Paris',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // Modèle HTML soigné et sobre (Sans emoji, Typographie haut de gamme)
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #0f172a; }
        .container { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
        .header { background: #004d2e; padding: 28px 24px; text-align: center; color: #ffffff; border-bottom: 3px solid #c6a15b; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 1px; color: #ffffff; text-transform: uppercase; }
        .header p { margin: 6px 0 0 0; color: #e2c285; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; }
        .content { padding: 28px 24px; }
        .section-header { font-size: 13px; font-weight: 700; color: #004d2e; text-transform: uppercase; letter-spacing: 0.8px; margin: 20px 0 10px 0; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0; }
        .section-header:first-child { margin-top: 0; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 13px; }
        th, td { padding: 9px 12px; text-align: left; vertical-align: middle; }
        th { width: 36%; color: #64748b; font-weight: 600; background: #f8fafc; border-radius: 4px 0 0 4px; }
        td { color: #0f172a; font-weight: 500; background: #f8fafc; border-radius: 0 4px 4px 0; }
        tr { border-bottom: 3px solid #ffffff; }
        .highlight { color: #004d2e; font-weight: 700; font-size: 14px; }
        .message-box { background: #f1f5f9; border-left: 3px solid #c6a15b; padding: 12px 16px; border-radius: 0 6px 6px 0; font-size: 13px; color: #334155; line-height: 1.6; margin-bottom: 20px; }
        .footer { background: #072418; padding: 20px; text-align: center; color: #94a3b8; font-size: 11px; line-height: 1.6; }
        .footer a { color: #c6a15b; text-decoration: none; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Inter Cars Import</h1>
          <p>Nouvelle Demande de Devis</p>
        </div>
        
        <div class="content">
          <div class="section-header">Coordonnées du Client</div>
          <table>
            <tr>
              <th>Nom & Prénom</th>
              <td class="highlight">${clientName}</td>
            </tr>
            <tr>
              <th>Téléphone</th>
              <td><a href="tel:${leadData.phone}" style="color: #004d2e; font-weight: 700; text-decoration: none;">${leadData.phone || 'Non renseigné'}</a></td>
            </tr>
            <tr>
              <th>Adresse Email</th>
              <td><a href="mailto:${clientEmail}" style="color: #004d2e; text-decoration: none;">${clientEmail || 'Non renseignée'}</a></td>
            </tr>
            <tr>
              <th>Ville de Livraison</th>
              <td>${leadData.delivery_city || 'France'}</td>
            </tr>
          </table>

          <div class="section-header">Véhicule Recherché & Critères</div>
          <table>
            <tr>
              <th>Véhicule Recherché</th>
              <td class="highlight">${vehicleName}</td>
            </tr>
            <tr>
              <th>Catégorie</th>
              <td>${leadData.vehicle_type || 'Non spécifiée'}</td>
            </tr>
            <tr>
              <th>Motorisation</th>
              <td>${leadData.fuel_type || 'Indifférent'}</td>
            </tr>
            <tr>
              <th>Kilométrage Maximum</th>
              <td>${leadData.mileage_max || 'Non spécifié'}</td>
            </tr>
            <tr>
              <th>Délai Souhaité</th>
              <td>${leadData.preferred_timeline || 'Moins de 30 jours'}</td>
            </tr>
          </table>

          <div class="section-header">Critères & Remarques du Client</div>
          <div class="message-box">
            ${leadData.message ? leadData.message.replace(/\n/g, '<br>') : '<em>Aucune remarque particulière indiquée.</em>'}
          </div>

          <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 16px 0 0 0;">
            Demande enregistrée le ${dateFormatted} via le site officiel <a href="https://inter-cars-import.fr" style="color: #004d2e; font-weight: 600;">inter-cars-import.fr</a>
          </p>
        </div>

        <div class="footer">
          Inter Cars Import SAS — Vente de Véhicules d'Occasion & Partenaires Exclusifs en France<br>
          <a href="https://inter-cars-import.fr">www.inter-cars-import.fr</a> • <a href="mailto:contact@inter-cars-import.fr">contact@inter-cars-import.fr</a>
        </div>
      </div>
    </body>
    </html>
    `;

    // 1. Si SMTP configuré
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 465,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Email à l'administrateur
      await transporter.sendMail({
        from: `"Inter Cars Import" <${process.env.SMTP_USER}>`,
        to: recipientEmail,
        replyTo: clientEmail || recipientEmail,
        subject: subject,
        html: htmlContent,
      });

      // Accusé de réception automatique envoyé au client
      if (clientEmail) {
        await transporter.sendMail({
          from: `"Inter Cars Import" <${process.env.SMTP_USER}>`,
          to: clientEmail,
          replyTo: recipientEmail,
          subject: `Confirmation de votre demande de devis : ${vehicleName}`,
          text: leadData.clientConfirmationMessage || `Bonjour ${clientName},\n\nNous avons bien reçu votre demande de devis pour votre recherche de ${vehicleName}.\nUn conseiller commercial prendra contact avec vous sous 24 à 48 heures.\n\nCordialement,\nL'équipe Inter Cars Import\ncontact@inter-cars-import.fr`
        });
      }

      return res.status(200).json({ success: true, method: 'smtp' });
    }

    // 2. Fallback direct serveur sans emoji
    const fallbackResponse = await fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: subject,
        _template: 'box',
        _captcha: 'false',
        _replyto: clientEmail || recipientEmail,
        _autoresponse: leadData.clientConfirmationMessage || '',
        'email': clientEmail,
        'Nom et Prenom': clientName,
        'Telephone': leadData.phone || 'Non renseigne',
        'Email': clientEmail || 'Non renseignee',
        'Vehicule': vehicleName,
        'Categorie': leadData.vehicle_type || 'Non specifiee',
        'Motorisation': leadData.fuel_type || 'Indifferent',
        'Kilometrage Max': leadData.mileage_max || 'Non specifie',
        'Delai': leadData.preferred_timeline || 'Moins de 30 jours',
        'Ville': leadData.delivery_city || 'France',
        'Remarques': leadData.message || 'Aucune remarque',
        'Date': dateFormatted
      })
    });

    const fallbackJson = await fallbackResponse.json();
    return res.status(200).json({ success: true, method: 'server-dispatch', data: fallbackJson });

  } catch (error) {
    console.error('Erreur API /api/send-email:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
