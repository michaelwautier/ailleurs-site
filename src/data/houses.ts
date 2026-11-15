export type Theme = {
  bg: string;
  ink: string;
  muted: string;
  accent: string;
  onAccent: string;
  tone: string;
  tone2: string;
  card: string;
  line: string;
  halo: string;
  scheme: 'light' | 'dark';
  font: string;
};

export type Photo = {
  label: string;
  file: string;
};

export type House = {
  slug: string;
  index: string;
  tab: string;
  word: string;
  native: string;
  meaning: string;
  lang: string;
  dir: 'ltr' | 'rtl';
  nativeFont: string;
  glyphItalic: boolean;
  name: string;
  tagline: string;
  statement: string;
  description: string;
  photos: Photo[];
  amenities: string[];
  theme: Theme;
};

export const homeTheme = {
  bg: '#F2EFE9',
  ink: '#1A1917',
  muted: '#5C5850',
  accent: '#1A1917',
  line: 'rgba(26,25,23,0.16)',
  scheme: 'light',
  font: "'Cormorant Garamond', serif",
} as const;

// Placeholder facts: replace with the real values of each house.
export const facts = [
  { key: 'Voyageurs', value: '[N]' },
  { key: 'Chambres', value: '[N]' },
  { key: 'Lits', value: '[N]' },
  { key: 'Salles de bain', value: '[N]' },
  { key: 'Surface', value: '[N] m²' },
  { key: 'Arrivée / départ', value: '[HH] / [HH]' },
];

export const nearby = [
  { key: '[Plage ou site naturel]', value: '[X] min' },
  { key: '[Village, commerces]', value: '[X] min' },
  { key: '[Aéroport]', value: '[X] min' },
];

const shots = ['01-drone', '02-terrace', '03-chill', '04-signature', '05-bedroom', '06-bathroom', '07-garden'];

function photos(slug: string, labels: string[]): Photo[] {
  return labels.map((label, i) => ({ label, file: `/images/${slug}/${shots[i]}.jpg` }));
}

export const houses: House[] = [
  {
    slug: 'kumo',
    index: '01',
    tab: 'Japon',
    word: 'Kumo',
    native: '雲',
    meaning: 'nuage',
    lang: 'ja',
    dir: 'ltr',
    nativeFont: "'Shippori Mincho', serif",
    glyphItalic: false,
    name: 'Maison Kumo',
    tagline: 'Un ryokan miniature sous les tropiques.',
    statement: 'Petite maison, grand calme : bois clair, papier, eau.',
    description:
      'Une pièce sur tatamis, un coin thé et un bain profond. Dehors, une terrasse en bois et son petit bassin, bordés de bambous et de fougères.',
    photos: photos('kumo', [
      'Vue drone de la maison',
      'Terrasse en bois et bassin',
      'Coin détente sous la pergola',
      'Coin thé',
      'Chambre sur tatamis',
      'Salle de bain et bain ofuro',
      'Jardin sec',
    ]),
    amenities: ['Piscine privée', 'Terrasse en bois', 'Bain ofuro', 'Futons sur tatamis', 'Coin thé', 'Wi-Fi'],
    theme: {
      bg: '#1A1917', ink: '#EFEAE0', muted: '#A8A194', accent: '#D4553F', onAccent: '#14110F',
      tone: '#272522', tone2: '#312E2A', card: '#211F1C', line: 'rgba(239,234,224,0.18)',
      halo: 'rgba(212,85,63,0.22)', scheme: 'dark', font: "'Shippori Mincho', serif",
    },
  },
  {
    slug: 'vetiver',
    index: '02',
    tab: 'Réunion',
    word: 'Lakaz',
    native: 'kréol',
    meaning: 'la maison',
    lang: 'rcf',
    dir: 'ltr',
    nativeFont: "'Fraunces', serif",
    glyphItalic: true,
    name: 'Case Vétiver',
    tagline: 'Une petite case créole, sa varangue et son bassin.',
    statement: "On y vit dehors autant que dedans, à l'ombre des letchis.",
    description:
      'Boiseries ajourées, lambrequins et jardin créole : bananiers, frangipaniers, letchis. La varangue prolonge la case jusqu’à la petite piscine.',
    photos: photos('vetiver', [
      'Vue drone de la case',
      'Varangue et piscine',
      'Hamac sous les letchis',
      'Pièce de vie en bois',
      'Chambre créole',
      'Salle de bain bois et pierre',
      'Façade et lambrequins',
    ]),
    amenities: ['Piscine privée', 'Varangue meublée', 'Jardin créole', 'Hamac', 'Cuisine équipée', 'Wi-Fi'],
    theme: {
      bg: '#E3EAE1', ink: '#13251D', muted: '#475A50', accent: '#1C6553', onAccent: '#F4F7F2',
      tone: '#CCD7C9', tone2: '#BACAB7', card: '#EDF2EB', line: 'rgba(19,37,29,0.18)',
      halo: 'rgba(28,101,83,0.18)', scheme: 'light', font: "'Fraunces', serif",
    },
  },
  {
    slug: 'zellij',
    index: '03',
    tab: 'Maroc',
    word: 'Dar',
    native: 'دار',
    meaning: 'la maison',
    lang: 'ar',
    dir: 'rtl',
    nativeFont: "'Noto Naskh Arabic', serif",
    glyphItalic: false,
    name: 'Riad Zellij',
    tagline: 'Un mini-riad, son patio et son bassin.',
    statement: 'Zelliges, tadelakt et lumière filtrée autour d’un petit patio.',
    description:
      'Arches, tadelakt et zelliges autour d’un bassin. Sur la terrasse, coussins bas, lanternes et bougainvilliers pour les fins de journée.',
    photos: photos('zellij', [
      'Vue drone du toit-terrasse',
      'Patio et bassin en zelliges',
      'Salon extérieur et lanternes',
      'Salon marocain',
      'Chambre voûtée',
      'Salle de bain en tadelakt',
      'Terrasse et bougainvilliers',
    ]),
    amenities: ['Bassin en zelliges', 'Terrasse sur le toit', 'Salon marocain', 'Douche en tadelakt', 'Climatisation', 'Wi-Fi'],
    theme: {
      bg: '#EEDBC8', ink: '#2B1A11', muted: '#664636', accent: '#8E3A1F', onAccent: '#FBF1E7',
      tone: '#E2C6AC', tone2: '#D5B194', card: '#F5E7DA', line: 'rgba(43,26,17,0.18)',
      halo: 'rgba(142,58,31,0.18)', scheme: 'light', font: "'Marcellus', serif",
    },
  },
  {
    slug: 'sawah',
    index: '04',
    tab: 'Bali',
    word: 'Sawah',
    // TODO: have a Balinese reader validate this spelling before going live.
    native: 'ᬲᬯᬄ',
    meaning: 'la rizière',
    lang: 'ban',
    dir: 'ltr',
    nativeFont: "'Noto Sans Balinese', sans-serif",
    glyphItalic: false,
    name: 'Villa Sawah',
    tagline: 'Une villa ouverte, entre canopée et bassin.',
    statement: 'Bois, pierre volcanique et eau : tout est ouvert, tout invite à ralentir.',
    description:
      'Basalte de l’île, teck et palmiers : un petit bassin à débordement, une douche sous le ciel et un bale de repos noyé dans la végétation.',
    photos: photos('sawah', [
      'Vue drone de la villa',
      'Bassin à débordement en basalte',
      'Bale de repos',
      'Pièce de vie ouverte',
      'Chambre et moustiquaire',
      'Douche extérieure',
      'Jardin tropical',
    ]),
    amenities: ['Piscine à débordement', 'Bale de repos', 'Douche extérieure', 'Cuisine ouverte', 'Linge de maison', 'Wi-Fi'],
    theme: {
      bg: '#E9E5D6', ink: '#1E2116', muted: '#525742', accent: '#4E5A24', onAccent: '#F6F4EA',
      tone: '#D7D2BD', tone2: '#C7C1A7', card: '#F1EEE3', line: 'rgba(30,33,22,0.18)',
      halo: 'rgba(78,90,36,0.18)', scheme: 'light', font: "'Cormorant Garamond', serif",
    },
  },
];

export function nextHouse(slug: string): House {
  const i = houses.findIndex((h) => h.slug === slug);
  return houses[(i + 1) % houses.length];
}

export function themeStyle(t: Record<string, string>): string {
  const map: Record<string, string> = {
    bg: '--bg', ink: '--ink', muted: '--muted', accent: '--accent', onAccent: '--on-accent',
    tone: '--tone', tone2: '--tone-2', card: '--card', line: '--line', halo: '--halo', font: '--font-display',
  };
  return Object.entries(t)
    .filter(([k]) => map[k])
    .map(([k, v]) => `${map[k]}:${v}`)
    .join(';');
}
