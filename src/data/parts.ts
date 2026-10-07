export type RegionId = 'tete' | 'antenne' | 'mesosoma' | 'petiole' | 'gastre' | 'pattes';

export type PartId =
  | 'tete' | 'oeil' | 'torulus' | 'carene' | 'clypeus' | 'mandibule'
  | 'scape' | 'funicule'
  | 'pronotum' | 'mesonotum' | 'mesopleure' | 'propodeum' | 'stigmate'
  | 'petiole'
  | 'tergite' | 'sternite' | 'pygidium' | 'aiguillon'
  | 'coxa' | 'trochanter' | 'femur' | 'tibia' | 'eperon' | 'tarse' | 'griffe';

export interface Region {
  id: RegionId;
  label: string;
}

export interface Part {
  id: PartId;
  name: string;
  region: RegionId;
  definition: string;
  synonyms: string[];
}

export const REGIONS: Region[] = [
  { id: 'tete', label: 'Tête' },
  { id: 'antenne', label: 'Antenne' },
  { id: 'mesosoma', label: 'Mésosoma' },
  { id: 'petiole', label: 'Pétiole' },
  { id: 'gastre', label: 'Gastre' },
  { id: 'pattes', label: 'Pattes' },
];

export const PARTS: Part[] = [
  { id: 'tete', name: 'Tête', region: 'tete', definition: 'Capsule céphalique portant les yeux, les antennes et les pièces buccales.', synonyms: ['capsule céphalique'] },
  { id: 'oeil', name: 'Œil composé', region: 'tete', definition: 'Œil formé de nombreuses ommatidies, sur le côté de la tête.', synonyms: ['œil', 'oeuil', 'oeuil composé', 'yeux', 'yeux composés'] },
  { id: 'torulus', name: 'Torulus', region: 'tete', definition: 'Alvéole de la tête dans laquelle s’articule la base de l’antenne.', synonyms: ['toruli', 'alvéole antennaire', 'cavité antennaire'] },
  { id: 'carene', name: 'Carène frontale', region: 'tete', definition: 'Crête de la capsule céphalique qui borde l’insertion de l’antenne.', synonyms: ['carène', 'carènes frontales', 'lobe frontal'] },
  { id: 'clypeus', name: 'Clypéus', region: 'tete', definition: 'Plaque antérieure de la tête, juste au-dessus des mandibules.', synonyms: [] },
  { id: 'mandibule', name: 'Mandibule', region: 'tete', definition: 'Pièce buccale paire servant à saisir, couper et transporter.', synonyms: [] },
  { id: 'scape', name: 'Scape', region: 'antenne', definition: 'Premier article de l’antenne, long, articulé à la tête.', synonyms: [] },
  { id: 'funicule', name: 'Funicule', region: 'antenne', definition: 'Ensemble des articles de l’antenne situés après le scape.', synonyms: ['funiculus', 'flagelle'] },
  { id: 'pronotum', name: 'Pronotum', region: 'mesosoma', definition: 'Plaque dorsale du premier segment thoracique.', synonyms: [] },
  { id: 'mesonotum', name: 'Mésonotum', region: 'mesosoma', definition: 'Plaque dorsale du deuxième segment thoracique.', synonyms: [] },
  { id: 'mesopleure', name: 'Mésopleure', region: 'mesosoma', definition: 'Plaque latérale du deuxième segment thoracique, au-dessus de la coxa médiane.', synonyms: ['mésopleuron', 'pleure'] },
  { id: 'propodeum', name: 'Propodéum', region: 'mesosoma', definition: 'Premier segment abdominal, soudé au thorax.', synonyms: ['épinotum'] },
  { id: 'stigmate', name: 'Stigmate propodéal', region: 'mesosoma', definition: 'Orifice respiratoire situé sur le côté du propodéum.', synonyms: ['stigmate', 'spiracle', 'spiracle propodéal'] },
  { id: 'petiole', name: 'Pétiole', region: 'petiole', definition: 'Segment étroit, en forme de nœud, qui relie le mésosoma au gastre.', synonyms: ['nœud du pétiole', 'nœud', 'nœud pétiolaire'] },
  { id: 'tergite', name: 'Tergite', region: 'gastre', definition: 'Plaque dorsale d’un segment du gastre.', synonyms: [] },
  { id: 'sternite', name: 'Sternite', region: 'gastre', definition: 'Plaque ventrale d’un segment du gastre.', synonyms: [] },
  { id: 'pygidium', name: 'Pygidium', region: 'gastre', definition: 'Dernier tergite visible, à l’extrémité du gastre.', synonyms: [] },
  { id: 'aiguillon', name: 'Aiguillon', region: 'gastre', definition: 'Dard venimeux à l’extrémité du gastre.', synonyms: ['dard'] },
  { id: 'coxa', name: 'Coxa', region: 'pattes', definition: 'Premier article de la patte, articulé au mésosoma.', synonyms: ['hanche', 'coxae'] },
  { id: 'trochanter', name: 'Trochanter', region: 'pattes', definition: 'Petit article entre la coxa et le fémur.', synonyms: [] },
  { id: 'femur', name: 'Fémur', region: 'pattes', definition: 'Article le plus robuste de la patte.', synonyms: [] },
  { id: 'tibia', name: 'Tibia', region: 'pattes', definition: 'Long article entre le fémur et le tarse.', synonyms: [] },
  { id: 'eperon', name: 'Éperon tibial', region: 'pattes', definition: 'Épine articulée à l’extrémité du tibia.', synonyms: ['éperon', 'calcar'] },
  { id: 'tarse', name: 'Tarse', region: 'pattes', definition: 'Extrémité de la patte, formée de cinq articles.', synonyms: [] },
  { id: 'griffe', name: 'Griffe', region: 'pattes', definition: 'Crochet au bout du dernier article du tarse.', synonyms: ['ongle', 'griffe tarsale'] },
];

export const PART_BY_ID = Object.fromEntries(PARTS.map((p) => [p.id, p])) as Record<PartId, Part>;

export const REGION_BY_ID = Object.fromEntries(REGIONS.map((r) => [r.id, r])) as Record<RegionId, Region>;

export function partsInRegions(regions: readonly RegionId[]): Part[] {
  return PARTS.filter((p) => regions.includes(p.region));
}
