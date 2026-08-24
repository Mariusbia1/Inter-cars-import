import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Configurer les en-têtes CORS
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

    // Modèle HTML soigné et professionnel
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; color: #1e293b; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .header { background: #004d2e; padding: 30px; text-align: center; color: #ffffff; border-bottom: 3px solid #c6a15b; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px; color: #ffffff; }
        .header p { margin: 6px 0 0 0; color: #c6a15b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
        .content { padding: 30px; }
        .section-title { font-size: 14px; font-weight: 700; color: #004d2e; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; border-bottom: 2px solid #f1f5f9; padding-bottom: 6px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px; }
        th, td { padding: 10px 12px; text-align: left; vertical-align: top; }
        th { width: 38%; color: #64748b; font-weight: 600; background: #f8fafc; border-radius: 6px 0 0 6px; }
        td { color: #0f172a; font-weight: 500; background: #f8fafc; border-radius: 0 6px 6px 0; }
        tr { border-bottom: 4px solid #ffffff; }
        .highlight { color: #004d2e; font-weight: 700; font-size: 14px; }
        .message-box { background: #f1f5f9; border-left: 4px solid #c6a15b; padding: 14px; border-radius: 0 8px 8px 0; font-size: 13px; color: #334155; line-height: 1.5; margin-bottom: 24px; }
        .footer { background: #0b1f17; padding: 20px; text-align: center; color: #94a3b8; font-size: 11px; }
        .footer a { color: #c6a15b; text-decoration: none; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>INTER CARS IMPORT</h1>
          <p>Nouvelle Demande de Devis Entrante</p>
        </div>
        
        <div class="content">
          <div class="section-title">👤 Coordonnées du Prospect</div>
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
              <td><a href="mailto:${leadData.email}" style="color: #004d2e; text-decoration: none;">${leadData.email || 'Non renseignée'}</a></td>
            </tr>
            <tr>
              <th>Ville de Livraison</th>
              <td>${leadData.delivery_city || 'France'}</td>
            </tr>
          </table>

          <div class="section-title">🚘 Véhicule & Critères Souhaités</div>
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

          <div class="section-title">📝 Message & Remarques du Client</div>
          <div class="message-box">
            ${leadData.message ? leadData.message.replace(/\n/g, '<br>') : '<em>Aucune remarque supplémentaire indiquée.</em>'}
          </div>

          <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">
            Reçu le ${dateFormatted} via le formulaire en ligne de <a href="https://inter-cars-import.fr" style="color: #004d2e; font-weight: 600;">inter-cars-import.fr</a>
          </p>
        </div>

        <div class="footer">
          © 2026 Inter Cars Import — Vente de Véhicules d'Occasion & Partenaires en France
        </div>
      </div>
    </body>
    </html>
    `;

    // 1. Si SMTP configuré dans les variables d'environnement Vercel
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

      await transporter.sendMail({
        from: `"Inter Cars Import" <${process.env.SMTP_USER}>`,
        to: recipientEmail,
        replyTo: leadData.email || recipientEmail,
        subject: subject,
        html: htmlContent,
      });

      return res.status(200).json({ success: true, method: 'smtp' });
    }

    // 2. Si Resend API configuré
    if (process.env.RESEND_API_KEY) {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Inter Cars Import <devis@inter-cars-import.fr>',
          to: [recipientEmail],
          reply_to: leadData.email,
          subject: subject,
          html: htmlContent
        })
      });

      if (resendResponse.ok) {
        return res.status(200).json({ success: true, method: 'resend' });
      }
    }

    // 3. Fallback direct serveur sans popup
    const fallbackResponse = await fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: subject,
        _template: 'table',
        _captcha: 'false',
        _replyto: leadData.email || recipientEmail,
        'Nom et Prénom': clientName,
        'Téléphone': leadData.phone || 'Non renseigné',
        'Email Client': leadData.email || 'Non renseignée',
        'Véhicule Recherché': vehicleName,
        'Catégorie': leadData.vehicle_type || 'Non spécifiée',
        'Motorisation': leadData.fuel_type || 'Indifférent',
        'Kilométrage Maximum': leadData.mileage_max || 'Non spécifié',
        'Délai Souhaité': leadData.preferred_timeline || 'Moins de 30 jours',
        'Ville de Livraison': leadData.delivery_city || 'France',
        'Message Client': leadData.message || 'Aucun message particulier',
        'Date de Réception': dateFormatted
      })
    });

    const fallbackJson = await fallbackResponse.json();
    return res.status(200).json({ success: true, method: 'server-dispatch', data: fallbackJson });

  } catch (error) {
    console.error('Erreur API /api/send-email:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
