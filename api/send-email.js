import nodemailer from 'nodemailer';

// --- Utilitaires de Sécurité et de Validation ---

// Échappement HTML strict pour prévenir toute injection XSS / HTML dans les emails
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Nettoyage des retours à la ligne pour contrer l'injection d'en-têtes SMTP (CRLF Injection)
function sanitizeHeader(str, maxLength = 150) {
  if (typeof str !== 'string') return '';
  return str.replace(/[\r\n\t]/g, ' ').trim().slice(0, maxLength);
}

// Validation d'adresse email standard
function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length < 5 || trimmed.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed);
}

// Validation de numéro de téléphone
function isValidPhone(phone) {
  if (!phone) return true; // Optionnel
  if (typeof phone !== 'string') return false;
  const trimmed = phone.trim();
  if (trimmed.length > 30) return false;
  return /^[+0-9\s()./-]{4,30}$/.test(trimmed);
}

// Validation du nom d'hôte SMTP (prévention SSRF / Injection IP locale)
function isValidSmtpHost(host) {
  if (typeof host !== 'string') return false;
  const trimmed = host.trim().toLowerCase();
  if (trimmed.length < 3 || trimmed.length > 253) return false;
  // Bloquer les adresses locales/privées (SSRF)
  const forbiddenHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1', '169.254.169.254'];
  if (forbiddenHosts.includes(trimmed)) return false;
  if (/^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/.test(trimmed)) return false;
  // Format domaine ou IP publique
  return /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/.test(trimmed);
}

// Schéma de validation des entrées (Enforce Input Validation Schema)
function validateLeadInput(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { isValid: false, error: 'Format de requête invalide.' };
  }

  // Vérification de la taille globale du payload (Protection DoS)
  const payloadSize = JSON.stringify(data).length;
  if (payloadSize > 50000) {
    return { isValid: false, error: 'Taille de payload excessive.' };
  }

  // Validation Nom / Prénom
  const fullName = typeof data.full_name === 'string' ? sanitizeHeader(data.full_name, 100) : '';
  if (fullName.length > 100) {
    return { isValid: false, error: 'Le champ nom est trop long (maximum 100 caractères).' };
  }

  // Validation Email
  const email = typeof data.email === 'string' ? sanitizeHeader(data.email, 150) : '';
  if (email && !isValidEmail(email)) {
    return { isValid: false, error: 'Format d\'adresse email invalide.' };
  }

  // Validation Téléphone
  const phone = typeof data.phone === 'string' ? sanitizeHeader(data.phone, 30) : '';
  if (phone && !isValidPhone(phone)) {
    return { isValid: false, error: 'Format de numéro de téléphone invalide.' };
  }

  // Validation Recipient Email
  const recipientEmail = typeof data.recipientEmail === 'string' ? sanitizeHeader(data.recipientEmail, 150) : '';
  if (recipientEmail && !isValidEmail(recipientEmail)) {
    return { isValid: false, error: 'Adresse de destination invalide.' };
  }

  // Validation des champs textuels (limites de longueur & assainissement)
  const brandSought = typeof data.brand_sought === 'string' ? sanitizeHeader(data.brand_sought, 80) : '';
  const modelSought = typeof data.model_sought === 'string' ? sanitizeHeader(data.model_sought, 80) : '';
  const vehicleType = typeof data.vehicle_type === 'string' ? sanitizeHeader(data.vehicle_type, 60) : '';
  const fuelType = typeof data.fuel_type === 'string' ? sanitizeHeader(data.fuel_type, 40) : '';
  const mileageMax = typeof data.mileage_max === 'string' ? sanitizeHeader(data.mileage_max, 40) : '';
  const preferredTimeline = typeof data.preferred_timeline === 'string' ? sanitizeHeader(data.preferred_timeline, 60) : '';
  const deliveryCity = typeof data.delivery_city === 'string' ? sanitizeHeader(data.delivery_city, 80) : '';
  
  // Validation Message (maximum 3000 caractères)
  const rawMessage = typeof data.message === 'string' ? data.message.slice(0, 3000) : '';

  // Paramètres SMTP optionnels
  const smtpHost = typeof data.smtpHost === 'string' ? sanitizeHeader(data.smtpHost, 120) : '';
  if (smtpHost && !isValidSmtpHost(smtpHost)) {
    return { isValid: false, error: 'Hôte SMTP invalide ou non autorisé.' };
  }

  const smtpPort = Number(data.smtpPort);
  if (data.smtpPort && (isNaN(smtpPort) || smtpPort < 1 || smtpPort > 65535)) {
    return { isValid: false, error: 'Port SMTP invalide.' };
  }

  const smtpUser = typeof data.smtpUser === 'string' ? sanitizeHeader(data.smtpUser, 150) : '';
  const smtpPass = typeof data.smtpPass === 'string' ? data.smtpPass.slice(0, 200) : '';

  return {
    isValid: true,
    sanitized: {
      full_name: fullName,
      email,
      phone,
      recipientEmail,
      brand_sought: brandSought,
      model_sought: modelSought,
      vehicle_type: vehicleType,
      fuel_type: fuelType,
      mileage_max: mileageMax,
      preferred_timeline: preferredTimeline,
      delivery_city: deliveryCity,
      message: rawMessage,
      smtpHost,
      smtpPort: smtpPort || undefined,
      smtpUser,
      smtpPass,
      testOnly: Boolean(data.testOnly)
    }
  };
}

export default async function handler(req, res) {
  // En-têtes de sécurité renforcés (Protection contre l'exposition de données & XSS/Clickjacking)
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', "default-src 'none'");
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Méthode non autorisée.' });
  }

  try {
    // 1. Validation stricte du schéma d'entrée
    const validation = validateLeadInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ success: false, error: validation.error });
    }

    const clean = validation.sanitized;
    const defaultHost = process.env.SMTP_HOST || '149-202-177-181.cprapid.com';
    const smtpHost = clean.smtpHost || defaultHost;
    const smtpPort = clean.smtpPort || Number(process.env.SMTP_PORT) || 465;
    const smtpUser = clean.smtpUser || process.env.SMTP_USER || 'contact@inter-cars-import.fr';
    const smtpPass = clean.smtpPass || process.env.SMTP_PASS;

    // Mode Test de connexion SMTP
    if (clean.testOnly) {
      if (!smtpPass) {
        return res.status(400).json({ success: false, error: 'Veuillez renseigner le mot de passe de la boîte mail.' });
      }

      const testTransporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        tls: {
          rejectUnauthorized: true,
          minVersion: 'TLSv1.2'
        },
        auth: { user: smtpUser, pass: smtpPass }
      });

      try {
        await testTransporter.verify();
        await testTransporter.sendMail({
          from: `"Inter Cars Import" <${smtpUser}>`,
          to: clean.email || smtpUser,
          subject: 'Test de Connexion Réussi — Inter Cars Import',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #004d2e;">
              <h2 style="color: #004d2e; border-bottom: 2px solid #c6a15b; padding-bottom: 8px;">Inter Cars Import</h2>
              <p>Votre serveur de messagerie SMTP est <strong>correctement configuré</strong> et opérationnel !</p>
              <p>Désormais, chaque demande de devis enverra :</p>
              <ul>
                <li>Une notification dans votre boîte <strong>${escapeHtml(smtpUser)}</strong></li>
                <li>Un accusé de réception automatique directement au prospect.</li>
              </ul>
            </div>
          `
        });
        return res.status(200).json({ success: true, message: 'Connexion SMTP validée avec succès ! Email de test transmis.' });
      } catch (err) {
        console.error('Erreur test SMTP:', err.message);
        return res.status(400).json({ success: false, error: 'Échec d\'authentification SMTP. Veuillez vérifier les identifiants.' });
      }
    }

    const recipientEmail = clean.recipientEmail || process.env.NOTIFICATION_EMAIL || smtpUser;
    const vehicleName = `${clean.brand_sought || 'Véhicule'} ${clean.model_sought || ''}`.trim();
    const clientName = clean.full_name || 'Client';
    const clientEmail = clean.email || '';
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

    // Modèle HTML Administrateur (Entièrement échappé et sécurisé contre XSS)
    const adminHtmlContent = `
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
          <p>Nouvelle Demande de Devis Entrante</p>
        </div>
        
        <div class="content">
          <div class="section-header">Coordonnées du Client</div>
          <table>
            <tr>
              <th>Nom & Prénom</th>
              <td class="highlight">${escapeHtml(clientName)}</td>
            </tr>
            <tr>
              <th>Téléphone</th>
              <td>${clean.phone ? `<a href="tel:${escapeHtml(clean.phone)}" style="color: #004d2e; font-weight: 700; text-decoration: none;">${escapeHtml(clean.phone)}</a>` : 'Non renseigné'}</td>
            </tr>
            <tr>
              <th>Adresse Email</th>
              <td>${clientEmail ? `<a href="mailto:${escapeHtml(clientEmail)}" style="color: #004d2e; text-decoration: none;">${escapeHtml(clientEmail)}</a>` : 'Non renseignée'}</td>
            </tr>
            <tr>
              <th>Ville de Livraison</th>
              <td>${escapeHtml(clean.delivery_city || 'France')}</td>
            </tr>
          </table>

          <div class="section-header">Véhicule Recherché & Critères</div>
          <table>
            <tr>
              <th>Véhicule Recherché</th>
              <td class="highlight">${escapeHtml(vehicleName)}</td>
            </tr>
            <tr>
              <th>Catégorie</th>
              <td>${escapeHtml(clean.vehicle_type || 'Non spécifiée')}</td>
            </tr>
            <tr>
              <th>Motorisation</th>
              <td>${escapeHtml(clean.fuel_type || 'Indifférent')}</td>
            </tr>
            <tr>
              <th>Kilométrage Maximum</th>
              <td>${escapeHtml(clean.mileage_max || 'Non spécifié')}</td>
            </tr>
            <tr>
              <th>Délai Souhaité</th>
              <td>${escapeHtml(clean.preferred_timeline || 'En 21 jours')}</td>
            </tr>
          </table>

          <div class="section-header">Critères & Remarques du Client</div>
          <div class="message-box">
            ${clean.message ? escapeHtml(clean.message).replace(/\n/g, '<br>') : '<em>Aucune remarque particulière indiquée.</em>'}
          </div>

          <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 16px 0 0 0;">
            Demande enregistrée le ${escapeHtml(dateFormatted)} via <a href="https://inter-cars-import.fr" style="color: #004d2e; font-weight: 600;">inter-cars-import.fr</a>
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

    // Modèle HTML Accusé de réception envoyé au CLIENT
    const clientHtmlContent = `
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
        .greeting { font-size: 15px; font-weight: 600; color: #0f172a; margin-bottom: 12px; }
        .text { font-size: 13px; color: #334155; line-height: 1.7; margin-bottom: 16px; }
        .summary-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0; }
        .summary-title { font-size: 12px; font-weight: 700; color: #004d2e; text-transform: uppercase; margin-bottom: 8px; }
        .summary-item { font-size: 13px; color: #475569; margin: 4px 0; }
        .footer { background: #072418; padding: 20px; text-align: center; color: #94a3b8; font-size: 11px; line-height: 1.6; }
        .footer a { color: #c6a15b; text-decoration: none; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Inter Cars Import</h1>
          <p>Confirmation de Votre Demande de Devis</p>
        </div>
        
        <div class="content">
          <div class="greeting">Bonjour ${escapeHtml(clientName)},</div>
          <div class="text">
            Nous avons bien enregistré votre demande concernant votre recherche pour le véhicule <strong>${escapeHtml(vehicleName)}</strong>.
          </div>
          <div class="text">
            Notre équipe étudie actuellement vos critères auprès de notre réseau de concessions partenaires officielles en France. Un conseiller dédié prendra contact avec vous au <strong>${escapeHtml(clean.phone || 'téléphone')}</strong> sous 24 heures ouvrées afin de vous présenter les opportunités conformes à vos exigences.
          </div>

          <div class="summary-box">
            <div class="summary-title">Récapitulatif de votre sélection :</div>
            <div class="summary-item">• Véhicule : <strong>${escapeHtml(vehicleName)}</strong></div>
            <div class="summary-item">• Catégorie : ${escapeHtml(clean.vehicle_type || 'Non spécifiée')}</div>
            <div class="summary-item">• Motorisation : ${escapeHtml(clean.fuel_type || 'Indifférent')}</div>
            <div class="summary-item">• Ville de livraison : ${escapeHtml(clean.delivery_city || 'France')}</div>
          </div>

          <div class="text">
            Nous restons à votre entière disposition pour toute question.
          </div>
          <div class="text" style="font-weight: 600; color: #004d2e;">
            Bien cordialement,<br>
            L'équipe Commerciale — Inter Cars Import
          </div>
        </div>

        <div class="footer">
          Inter Cars Import SAS — Bureau Commercial, Axe Cannes — Monaco<br>
          <a href="https://inter-cars-import.fr">www.inter-cars-import.fr</a> • <a href="mailto:contact@inter-cars-import.fr">contact@inter-cars-import.fr</a>
        </div>
      </div>
    </body>
    </html>
    `;

    // 1. Envoi prioritaire par SMTP direct
    if (smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        tls: {
          rejectUnauthorized: true,
          minVersion: 'TLSv1.2'
        },
        auth: { user: smtpUser, pass: smtpPass }
      });

      // A. Email à l'administrateur
      await transporter.sendMail({
        from: `"Inter Cars Import" <${smtpUser}>`,
        to: recipientEmail,
        replyTo: clientEmail || recipientEmail,
        subject: subject,
        html: adminHtmlContent
      });

      // B. Email au prospect (Client)
      if (clientEmail && isValidEmail(clientEmail)) {
        try {
          await transporter.sendMail({
            from: `"Inter Cars Import" <${smtpUser}>`,
            to: clientEmail,
            replyTo: recipientEmail,
            subject: `Confirmation de votre demande : ${vehicleName} — Inter Cars Import`,
            html: clientHtmlContent
          });
        } catch (clientMailErr) {
          console.warn('Erreur envoi email client:', clientMailErr.message);
        }
      }

      return res.status(200).json({ success: true, method: 'smtp-dual' });
    }

    // 2. Fallback direct FormSubmit si SMTP non configuré
    const fallbackResponse = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipientEmail)}`, {
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
        'email': clientEmail,
        'Nom et Prenom': clientName,
        'Telephone': clean.phone || 'Non renseigne',
        'Email': clientEmail || 'Non renseignee',
        'Vehicule': vehicleName,
        'Categorie': clean.vehicle_type || 'Non specifiee',
        'Motorisation': clean.fuel_type || 'Indifferent',
        'Kilometrage Max': clean.mileage_max || 'Non specifie',
        'Delai': clean.preferred_timeline || 'En 21 jours',
        'Ville': clean.delivery_city || 'France',
        'Remarques': clean.message || 'Aucune remarque',
        'Date': dateFormatted
      })
    });

    const fallbackJson = await fallbackResponse.json();
    return res.status(200).json({ success: true, method: 'server-dispatch', data: fallbackJson });

  } catch (error) {
    // Ne jamais divulguer la stack trace ou les détails internes de configuration
    console.error('Erreur API /api/send-email:', error);
    return res.status(500).json({ success: false, error: 'Une erreur interne est survenue lors de l\'envoi.' });
  }
}
