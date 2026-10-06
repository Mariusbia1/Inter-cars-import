// Utilitaire d'analyse et de découpage intelligent de fiches véhicules en texte brut
import { sampleGalleries } from '../data/vehiclesData';

export const parseVehicleText = (rawText) => {
  if (!rawText || typeof rawText !== 'string') return {};

  const lines = rawText
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const result = {
    title: '',
    brand: '',
    model: '',
    category: '',
    year: new Date().getFullYear(),
    first_reg_date: '',
    mileage: 25000,
    power_hp: 150,
    fiscal_power: 8,
    engine: '',
    fuel_type: 'Diesel',
    transmission: 'Automatique',
    drivetrain: 'Traction avant',
    color_ext: 'Gris',
    color_int: 'Noir',
    seats: 5,
    doors: '5 portes',
    price: '',
    discount_percent: 12,
    warranty: 'Garantie Constructeur 12 à 24 Mois',
    certification: 'Audit 150 Points Validé',
    origin_country: 'Réseau Partenaire France',
    delivery_city: 'France entière',
    availability_status: 'ARRIVAGE',
    image_url: '',
    gallery_urls: '',
    equipments: [],
    raw_equipments_text: '',
  };

  // 1. Détection du Titre (Première ligne pertinente)
  if (lines.length > 0) {
    const firstLine = lines[0].replace(/^titre\s*[:=]\s*/i, '').trim();
    if (!firstLine.includes(' : ') && firstLine.length > 3) {
      result.title = firstLine;
    }
  }

  // 2. Détection de la Marque & Modèle
  const brandsList = [
    { name: 'Volkswagen', aliases: ['volkswagen', 'vw'] },
    { name: 'Audi', aliases: ['audi'] },
    { name: 'Porsche', aliases: ['porsche'] },
    { name: 'Peugeot', aliases: ['peugeot'] },
    { name: 'BMW', aliases: ['bmw'] },
    { name: 'Mercedes-Benz', aliases: ['mercedes-benz', 'mercedes', 'mb'] },
    { name: 'Mini', aliases: ['mini'] },
    { name: 'Renault', aliases: ['renault'] },
    { name: 'Cupra', aliases: ['cupra'] },
    { name: 'Alpine', aliases: ['alpine'] },
    { name: 'Ferrari', aliases: ['ferrari'] },
    { name: 'Aston Martin', aliases: ['aston martin'] },
    { name: 'Lamborghini', aliases: ['lamborghini'] },
    { name: 'Maserati', aliases: ['maserati'] },
    { name: 'Land Rover', aliases: ['land rover', 'range rover'] },
    { name: 'Volvo', aliases: ['volvo'] },
    { name: 'Toyota', aliases: ['toyota'] },
    { name: 'Ford', aliases: ['ford'] },
    { name: 'Tesla', aliases: ['tesla'] },
    { name: 'Alfa Romeo', aliases: ['alfa romeo'] }
  ];

  const fullTextLower = rawText.toLowerCase();
  for (const b of brandsList) {
    if (b.aliases.some((a) => fullTextLower.includes(a))) {
      result.brand = b.name;
      break;
    }
  }

  // Si pas de titre mais marque détectée
  if (!result.title && lines.length > 0) {
    result.title = lines[0];
  }

  // Extraction du Modèle à partir du Titre
  if (result.title) {
    let cleanModel = result.title;
    if (result.brand) {
      const brandRegex = new RegExp(`^${result.brand}\\s*`, 'i');
      cleanModel = cleanModel.replace(brandRegex, '').trim();
      if (result.brand === 'Volkswagen') {
        cleanModel = cleanModel.replace(/^vw\s*/i, '').trim();
      }
    }
    result.model = cleanModel;
  }

  // 3. Détection de la Catégorie
  if (
    fullTextLower.includes('tiguan') ||
    fullTextLower.includes('suv') ||
    fullTextLower.includes('3008') ||
    fullTextLower.includes('5008') ||
    fullTextLower.includes('macan') ||
    fullTextLower.includes('cayenne') ||
    fullTextLower.includes('q3') ||
    fullTextLower.includes('q5') ||
    fullTextLower.includes('q7') ||
    fullTextLower.includes('q8') ||
    fullTextLower.includes('x1') ||
    fullTextLower.includes('x3') ||
    fullTextLower.includes('x5') ||
    fullTextLower.includes('glc') ||
    fullTextLower.includes('gle') ||
    fullTextLower.includes('gla') ||
    fullTextLower.includes('velar') ||
    fullTextLower.includes('4x4')
  ) {
    result.category = 'SUV & 4x4';
  } else if (
    fullTextLower.includes('golf') ||
    fullTextLower.includes('a3') ||
    fullTextLower.includes('mini') ||
    fullTextLower.includes('clio') ||
    fullTextLower.includes('208') ||
    fullTextLower.includes('polo') ||
    fullTextLower.includes('yaris') ||
    fullTextLower.includes('citadine') ||
    fullTextLower.includes('compacte')
  ) {
    result.category = 'Compacte & Citadine';
  } else if (
    fullTextLower.includes('911') ||
    fullTextLower.includes('gt3') ||
    fullTextLower.includes('m4') ||
    fullTextLower.includes('m3') ||
    fullTextLower.includes('m2') ||
    fullTextLower.includes('amg gt') ||
    fullTextLower.includes('vantage') ||
    fullTextLower.includes('ferrari') ||
    fullTextLower.includes('alpine') ||
    fullTextLower.includes('sportive')
  ) {
    result.category = 'Citadine';
  } else {
    result.category = 'Berline & Break';
  }

  // 4. Extraction ligne par ligne
  let isInsideOptionsSection = false;
  const optionsFound = [];
  const imageUrlsFound = [];

  for (const line of lines) {
    // Détection d'URLs d'images
    if (line.match(/^https?:\/\/.*\.(?:jpg|jpeg|png|webp|avif)(?:\?.*)?$/i) || line.includes('unsplash.com')) {
      imageUrlsFound.push(line.trim());
      continue;
    }

    // Détection de la section équipements / options
    if (
      line.toUpperCase().includes('ÉQUIPEMENTS') ||
      line.toUpperCase().includes('EQUIPEMENTS') ||
      line.toUpperCase().includes('OPTIONS')
    ) {
      isInsideOptionsSection = true;
      continue;
    }

    // Kilométrage
    const kmMatch = line.match(/(?:kilom[eé]trage|km)\s*[:=]\s*([\d\s\.\,]+)/i);
    if (kmMatch) {
      const cleanKm = parseInt(kmMatch[1].replace(/[^\d]/g, ''), 10);
      if (!isNaN(cleanKm)) result.mileage = cleanKm;
      continue;
    }

    // Mise en circulation
    const dateMatch = line.match(/(?:mise en circulation|immatriculation|date)\s*[:=]\s*([\d\/\.\-]+)/i);
    if (dateMatch) {
      result.first_reg_date = dateMatch[1].trim();
      const yearMatch = dateMatch[1].match(/\b(19\d\d|20\d\d)\b/);
      if (yearMatch) {
        result.year = parseInt(yearMatch[1], 10);
      }
      continue;
    }

    // Année directe si isolée
    const yearDirectMatch = line.match(/^ann[eé]e\s*[:=]\s*(\d{4})/i);
    if (yearDirectMatch) {
      result.year = parseInt(yearDirectMatch[1], 10);
      continue;
    }

    // Énergie / Carburant
    const fuelMatch = line.match(/(?:[eé]nergie|carburant)\s*[:=]\s*(.+)/i);
    if (fuelMatch) {
      result.fuel_type = fuelMatch[1].trim();
      continue;
    }

    // Puissance DIN
    const powerMatch = line.match(/(?:puissance|puissance din)\s*[:=]\s*(\d+)\s*(?:ch|cv|hp)?/i);
    if (powerMatch) {
      const p = parseInt(powerMatch[1], 10);
      if (!isNaN(p) && p < 1500) result.power_hp = p;
      continue;
    }

    // Puissance fiscale
    const fiscalMatch = line.match(/(?:puissance fiscale|fiscale)\s*[:=]\s*(\d+)\s*(?:cv|ch)?/i);
    if (fiscalMatch) {
      const f = parseInt(fiscalMatch[1], 10);
      if (!isNaN(f) && f < 100) result.fiscal_power = f;
      continue;
    }

    // Cylindrée / Motorisation
    const cylMatch = line.match(/(?:cylindr[eé]e|moteur|motorisation)\s*[:=]\s*(.+)/i);
    if (cylMatch) {
      result.engine = cylMatch[1].trim();
      continue;
    }

    // Boîte de vitesses
    const gearboxMatch = line.match(/(?:bo[iî]te de vitesses?|bo[iî]te|bva|bvm)\s*[:=]\s*(.+)/i);
    if (gearboxMatch) {
      result.transmission = gearboxMatch[1].trim();
      continue;
    }

    // Transmission / Motricité
    const transMatch = line.match(/(?:transmission|motricit[eé]|roues motrices)\s*[:=]\s*(.+)/i);
    if (transMatch) {
      result.drivetrain = transMatch[1].trim();
      continue;
    }

    // Couleur extérieure
    const colorExtMatch = line.match(/(?:couleur ext[eé]rieure|couleur ext|teinte)\s*[:=]\s*(.+)/i);
    if (colorExtMatch) {
      result.color_ext = colorExtMatch[1].trim();
      continue;
    }

    // Couleur intérieure
    const colorIntMatch = line.match(/(?:couleur int[eé]rieure|couleur int|sellerie|int[eé]rieur)\s*[:=]\s*(.+)/i);
    if (colorIntMatch) {
      result.color_int = colorIntMatch[1].trim();
      continue;
    }

    // Nombre de places
    const placesMatch = line.match(/(?:nombre de places?|places?)\s*[:=]\s*(\d+)/i);
    if (placesMatch) {
      const pl = parseInt(placesMatch[1], 10);
      if (!isNaN(pl)) result.seats = pl;
      continue;
    }

    // Nombre de portes
    const portesMatch = line.match(/(?:nombre de portes?|portes?)\s*[:=]\s*(\d+)/i);
    if (portesMatch) {
      result.doors = `${portesMatch[1]} portes`;
      continue;
    }

    // Prix
    const priceMatch = line.match(/(?:prix|tarif|montant|valeur)\s*[:=]?\s*([\d\s\.\,]+)\s*€?/i);
    if (priceMatch && !result.price) {
      const parsedPrice = parseInt(priceMatch[1].replace(/[^\d]/g, ''), 10);
      if (!isNaN(parsedPrice) && parsedPrice > 1000) {
        result.price = parsedPrice;
      }
      continue;
    }

    // Statut
    const statusMatch = line.match(/(?:statut|disponibilit[eé])\s*[:=]\s*(.+)/i);
    if (statusMatch) {
      result.availability_status = statusMatch[1].trim().toUpperCase();
      continue;
    }

    // Détection des options (lignes avec puces ou tout élément après la section options)
    if (
      isInsideOptionsSection ||
      line.startsWith('-') ||
      line.startsWith('•') ||
      line.startsWith('*') ||
      line.startsWith('✓')
    ) {
      const cleanOption = line.replace(/^[-•*✓\s]+/, '').trim();
      if (
        cleanOption.length > 2 &&
        !cleanOption.toUpperCase().includes('EQUIPEMENT') &&
        !cleanOption.toUpperCase().includes('OPTION') &&
        !cleanOption.includes(' : ')
      ) {
        optionsFound.push(cleanOption);
      }
    }
  }

  result.equipments = optionsFound;
  result.raw_equipments_text = optionsFound.map((opt) => `- ${opt}`).join('\n');

  // Si pas d'engine renseigné, synthétiser avec cylindrée/puissance/carburant
  if (!result.engine) {
    result.engine = `${result.fuel_type} ${result.power_hp} ch`;
  }

  // Si des images ont été explicitement trouvées dans le texte
  if (imageUrlsFound.length > 0) {
    result.image_url = imageUrlsFound[0];
    result.gallery_urls = imageUrlsFound.join('\n');
  } else {
    // Pas de photos automatiques : c'est l'utilisateur qui ajoute ses propres photos
    result.image_url = '';
    result.gallery_urls = '';
  }

  return result;
};

