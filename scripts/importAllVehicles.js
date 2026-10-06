import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const supabaseUrl = 'https://tdbwbzotqsahnnmasjmb.supabase.co';
const supabaseKey = 'sb_publishable_j1KwauSScUFvfLCKuwOaeg_ELmkh3bY';
const supabase = createClient(supabaseUrl, supabaseKey);

const baseSourceDir = '/Users/user/Desktop/Mes projets web/Inter cars import/véhicules';
const targetPublicDir = '/Users/user/Desktop/Inter cars import/public/vehicles';

// Créer le dossier cible public s'il n'existe pas
if (!fs.existsSync(targetPublicDir)) {
  fs.mkdirSync(targetPublicDir, { recursive: true });
}

// Fonction de parsing robuste de carateristique.txt
function parseCarateristique(rawText, folderName) {
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
  
  let title = '';
  let brand = '';
  let model = '';
  let category = 'SUV Prestige';
  let year = new Date().getFullYear();
  let mileage = 0;
  let price = null;
  let discount_percent = 12;
  let power_hp = 150;
  let fiscal_power = 8;
  let engine = '2.0L';
  let fuel_type = 'Essence';
  let transmission = 'Automatique';
  let drivetrain = 'Traction avant';
  let color_ext = 'Gris';
  let color_int = 'Noir';
  let first_reg_date = '';
  let doors = '5 portes';
  let seats = 5;
  let equipments = [];

  // Déterminer le titre et la marque
  const folderLower = folderName.toLowerCase();
  if (folderLower.includes('tiguan')) {
    brand = 'Volkswagen';
    category = 'SUV Prestige';
  } else if (folderLower.includes('troc') || folderLower.includes('t-roc')) {
    brand = 'Volkswagen';
    category = 'SUV Prestige';
  } else if (folderLower.includes('chr') || folderLower.includes('c-hr')) {
    brand = 'Toyota';
    category = 'SUV Prestige';
  } else if (folderLower.includes('yaris cross')) {
    brand = 'Toyota';
    category = 'SUV Prestige';
  } else if (folderLower.includes('yaris')) {
    brand = 'Toyota';
    category = 'Sportive'; // Compacte & Citadine
  }

  // Trouver la première ligne de titre
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    if (line.toUpperCase().includes('VOLKSWAGEN') || line.toUpperCase().includes('TOYOTA') || line.toUpperCase().includes('AUDI') || line.toUpperCase().includes('PEUGEOT') || line.toUpperCase().includes('BMW')) {
      title = line;
      break;
    }
  }

  if (!title) {
    if (folderLower.includes('tiguan r-line gris') || folderLower.includes('tiguan gris')) {
      title = 'VOLKSWAGEN TIGUAN 1.5 eTSI 150ch DSG7 R-LINE';
    } else {
      title = lines[0] || folderName.toUpperCase();
    }
  }

  // Déduire la marque du titre si pas encore fait
  if (title.toUpperCase().includes('VOLKSWAGEN')) brand = 'Volkswagen';
  if (title.toUpperCase().includes('TOYOTA')) brand = 'Toyota';
  if (title.toUpperCase().includes('AUDI')) brand = 'Audi';
  if (title.toUpperCase().includes('BMW')) brand = 'BMW';
  if (title.toUpperCase().includes('PEUGEOT')) brand = 'Peugeot';

  // Déduire le modèle
  model = title.replace(new RegExp(`^${brand}\\s*`, 'i'), '').trim();

  // Extraction des champs ligne par ligne
  let inOptions = false;
  for (const line of lines) {
    const lower = line.toLowerCase();

    if (lower.includes('options') || lower.includes('équipements') || lower.includes('equipement')) {
      inOptions = true;
      continue;
    }

    if (inOptions) {
      if (line.startsWith('-') || line.startsWith('•') || line.startsWith('*') || line.startsWith('✓')) {
        const cleanOpt = line.replace(/^[-•*✓\s]+/, '').trim();
        if (cleanOpt.length > 2 && !cleanOpt.toUpperCase().includes('CARACTÉRISTIQUES') && !cleanOpt.toUpperCase().includes('ÉQUIPEMENTS')) {
          equipments.push(cleanOpt);
        }
      } else if (line.length > 3 && !line.includes(':') && !line.toUpperCase().includes('CARACTÉRISTIQUE')) {
        equipments.push(line.trim());
      }
      continue;
    }

    // Prix
    if (lower.includes('prix') || lower.includes('tarif')) {
      const match = line.match(/([\d\s]+)\s*€/);
      if (match) {
        price = parseInt(match[1].replace(/\s/g, ''), 10);
      }
    }

    // Kilométrage
    if (lower.includes('kilométrage') || lower.includes('kilometrage') || lower.includes('km')) {
      const match = line.match(/([\d\s]+)\s*km/i);
      if (match) {
        mileage = parseInt(match[1].replace(/\s/g, ''), 10);
      }
    }

    // Année / Mise en circulation
    if (lower.includes('année') || lower.includes('annee')) {
      const match = line.match(/\b(202[0-9])\b/);
      if (match) year = parseInt(match[1], 10);
    }

    if (lower.includes('mise en circulation')) {
      const match = line.match(/(\d{2}\/\d{2}\/\d{4})/);
      if (match) {
        first_reg_date = match[1];
        const yr = parseInt(first_reg_date.split('/')[2], 10);
        if (yr) year = yr;
      }
    }

    // Énergie / Moteur
    if (lower.includes('énergie') || lower.includes('energie') || lower.includes('carburant')) {
      if (lower.includes('diesel')) fuel_type = 'Diesel';
      else if (lower.includes('hybride') || lower.includes('hybrid')) fuel_type = 'Hybride';
      else if (lower.includes('essence')) fuel_type = 'Essence';
      else if (lower.includes('électrique') || lower.includes('electrique')) fuel_type = 'Électrique';
    }

    // Motorisation
    if (lower.includes('motorisation') || lower.includes('cylindrée') || lower.includes('cylindree')) {
      engine = line.split(':')[1]?.trim() || engine;
    }

    // Puissance
    if (lower.includes('puissance') && !lower.includes('fiscale')) {
      const match = line.match(/(\d+)\s*ch/i);
      if (match) power_hp = parseInt(match[1], 10);
    }

    // Puissance fiscale
    if (lower.includes('puissance fiscale') || lower.includes('cv')) {
      const match = line.match(/(\d+)\s*cv/i);
      if (match) fiscal_power = parseInt(match[1], 10);
    }

    // Boîte
    if (lower.includes('boîte') || lower.includes('boite') || lower.includes('transmission')) {
      if (lower.includes('dsg7') || lower.includes('dsg')) transmission = 'Automatique DSG7';
      else if (lower.includes('cvt')) transmission = 'Automatique CVT';
      else if (lower.includes('automatique') || lower.includes('auto')) transmission = 'Automatique';
      else if (lower.includes('manuelle')) transmission = 'Manuelle';
    }

    // Couleur extérieure
    if (lower.includes('couleur') && !lower.includes('intérieure') && !lower.includes('interieur')) {
      color_ext = line.split(':')[1]?.trim() || color_ext;
    }

    // Couleur intérieure
    if (lower.includes('intérieure') || lower.includes('interieur')) {
      color_int = line.split(':')[1]?.trim() || color_int;
    }

    // Places & Portes
    if (lower.includes('places') || lower.includes('place')) {
      const match = line.match(/(\d+)\s*places?/i);
      if (match) seats = parseInt(match[1], 10);
    }
    if (lower.includes('portes') || lower.includes('porte')) {
      const match = line.match(/(\d+)\s*portes?/i);
      if (match) doors = `${match[1]} portes`;
    }
  }

  // Si pas de prix explicite, on déduit une motorisation lisible
  if (!engine || engine === '2.0L') {
    if (title.includes('1.5 eTSI')) engine = '1.5 eTSI 150ch';
    else if (title.includes('1.5 TSI')) engine = '1.5 TSI 150ch';
    else if (title.includes('2.0 TDI')) engine = '2.0 TDI 150ch';
    else if (title.includes('2.0 HYBRIDE')) engine = '2.0 Hybride 200ch';
    else if (title.includes('1.8 HYBRIDE')) engine = '1.8 Hybride 140ch';
    else if (title.includes('116H')) engine = '1.5 Hybride 116ch';
    else if (title.includes('130H') || title.includes('130 GR')) engine = '1.5 Hybride 130ch';
  }

  return {
    title,
    brand,
    model,
    category,
    year,
    mileage,
    price,
    discount_percent,
    power_hp,
    fiscal_power,
    engine,
    fuel_type,
    transmission,
    drivetrain,
    color_ext,
    color_int,
    first_reg_date: first_reg_date || `${year}`,
    doors,
    seats,
    equipments: equipments.filter((e, idx, arr) => arr.indexOf(e) === idx) // dédupliquer
  };
}

// Fonction de slugification sécurisée
function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  console.log('🚀 DÉMARRAGE DE L\'IMPORTATION COMPLÈTE DES VÉHICULES...');

  // 1. Purger les anciennes tables pour repartir sur une base 100% propre
  console.log('🧹 Nettoyage des anciennes entrées Supabase...');
  await supabase.from('vehicle_images').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('delivered_vehicles').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  const folders = fs.readdirSync(baseSourceDir).filter((f) => !f.startsWith('.'));
  console.log(`📁 ${folders.length} dossiers de véhicules détectés.`);

  let totalVehiclesImported = 0;
  let totalImagesImported = 0;

  for (let idx = 0; idx < folders.length; idx++) {
    const folder = folders[idx];
    const folderPath = path.join(baseSourceDir, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    const txtPath = path.join(folderPath, 'carateristique.txt');
    if (!fs.existsSync(txtPath)) {
      console.warn(`⚠️ carateristique.txt manquant dans ${folder}, ignoré.`);
      continue;
    }

    const rawText = fs.readFileSync(txtPath, 'utf8');
    const parsed = parseCarateristique(rawText, folder);

    const slug = slugify(`${parsed.brand}-${folder}`);
    const destFolder = path.join(targetPublicDir, slug);
    if (!fs.existsSync(destFolder)) {
      fs.mkdirSync(destFolder, { recursive: true });
    }

    // Récupérer et trier toutes les images
    const rawFiles = fs.readdirSync(folderPath).filter((f) => /\.(jpg|jpeg|png|webp|heic)$/i.test(f));

    // Trier les photos naturellement
    rawFiles.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

    console.log(`\n🚗 [${idx + 1}/${folders.length}] Traitement : ${parsed.title}`);
    console.log(`   📸 ${rawFiles.length} photos trouvées -> Optimisation web en cours...`);

    const webGalleryUrls = [];

    for (let imgIdx = 0; imgIdx < rawFiles.length; imgIdx++) {
      const srcImg = path.join(folderPath, rawFiles[imgIdx]);
      const photoName = `photo-${String(imgIdx + 1).padStart(2, '0')}.jpg`;
      const destImg = path.join(destFolder, photoName);
      const webUrl = `/vehicles/${slug}/${photoName}`;

      try {
        // Redimensionnement et compression JPEG 1200px qualité 75 avec sips
        execSync(`sips -s format jpeg -s formatOptions 75 -Z 1200 "${srcImg}" --out "${destImg}" 2>/dev/null`);
        webGalleryUrls.push(webUrl);
      } catch (err) {
        console.warn(`   ⚠️ Erreur sips sur ${rawFiles[imgIdx]}, copie simple...`, err.message);
        fs.copyFileSync(srcImg, destImg);
        webGalleryUrls.push(webUrl);
      }
    }

    const mainImageUrl = webGalleryUrls[0] || 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80';

    // Encodage étendu (options, prix, specs)
    const clientReviewData = {
      price: parsed.price,
      discount_percent: parsed.discount_percent,
      availability_status: 'ARRIVAGE',
      equipments: parsed.equipments,
      specs: {
        co2: 'Crit’Air 1 / 2',
        doors: parsed.doors,
        seats: `${parsed.seats} places`,
        boot_volume: '400 L à 1 350 L',
        consumption: '5.2 L / 100km mixte',
        drivetrain: parsed.drivetrain,
        first_reg_date: parsed.first_reg_date,
        color_int: parsed.color_int,
        fiscal_power: parsed.fiscal_power,
        engine_cylinders: parsed.engine
      },
      colors: [
        { name: parsed.color_ext, hex: '#7D848C', status: 'ARRIVAGE', isDefault: true },
        { name: 'Noir Intense', hex: '#1A1A1A', status: 'EN STOCK' },
        { name: 'Blanc Pur', hex: '#FFFFFF', status: 'DISPONIBLE' }
      ],
      fuel_type: parsed.fuel_type,
      fiscal_power: parsed.fiscal_power,
      color_ext: parsed.color_ext,
      color_int: parsed.color_int,
      doors: parsed.doors,
      seats: parsed.seats,
      customReview: ''
    };

    const dbVehiclePayload = {
      title: parsed.title,
      brand: parsed.brand,
      model: parsed.model,
      category: parsed.category,
      year: parsed.year,
      mileage: parsed.mileage,
      power_hp: parsed.power_hp,
      engine: parsed.engine,
      transmission: parsed.transmission,
      origin_country: 'Réseau Partenaire France',
      delivery_city: 'France entière',
      certification: 'Audit 150 Points Validé',
      warranty: 'Garantie Constructeur',
      image_url: mainImageUrl,
      gallery: webGalleryUrls,
      client_name: 'Client Inter Cars',
      client_city: 'France',
      client_review: `__INTERCARS_DATA__:${JSON.stringify(clientReviewData)}`,
      rating: 5,
      is_featured: idx < 6 // Les 6 premiers en vedette
    };

    // Insertion dans delivered_vehicles
    const { data: insertedVehicle, error: vehicleErr } = await supabase
      .from('delivered_vehicles')
      .insert([dbVehiclePayload])
      .select()
      .single();

    if (vehicleErr) {
      console.error(`❌ Erreur insertion véhicule ${parsed.title}:`, vehicleErr);
      continue;
    }

    const vehicleId = insertedVehicle.id;
    totalVehiclesImported++;

    // Insertion dans la table dédiée vehicle_images
    if (webGalleryUrls.length > 0) {
      const imageRecords = webGalleryUrls.map((url, pos) => ({
        vehicle_id: vehicleId,
        image_url: url,
        position: pos
      }));

      const { error: imgErr } = await supabase.from('vehicle_images').insert(imageRecords);
      if (imgErr) {
        console.warn(`   ⚠️ Erreur insertion vehicle_images:`, imgErr.message);
      } else {
        totalImagesImported += imageRecords.length;
      }
    }

    console.log(`   ✅ Enregistré avec succès dans Supabase (ID: ${vehicleId}) - ${parsed.equipments.length} options, ${webGalleryUrls.length} photos.`);
  }

  console.log('\n======================================================');
  console.log(`🎉 IMPORTATION TERMINÉE AVEC SUCCÈS !`);
  console.log(`📊 ${totalVehiclesImported} véhicules insérés dans delivered_vehicles.`);
  console.log(`🖼️  ${totalImagesImported} photos insérées dans vehicle_images.`);
  console.log('======================================================\n');
}

main().catch((err) => {
  console.error('CRITICAL IMPORT ERROR:', err);
  process.exit(1);
});
