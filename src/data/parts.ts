export type RegionId = 'tete' | 'antenne' | 'mesosoma' | 'petiole' | 'gastre' | 'pattes';

export type PartId =
  | 'tete' | 'oeil' | 'lobe' | 'scrobe' | 'clypeus' | 'mandibule'
  | 'scape' | 'funicule'
  | 'pronotum' | 'mesonotum' | 'sillon' | 'propodeum'
  | 'pedoncule' | 'petiole' | 'processus' | 'postpetiole'
  | 'gastre' | 'pygidium' | 'aiguillon'
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
  { id: 'lobe', name: 'Lobe frontal', region: 'tete', definition: 'Expansion de la carène frontale qui recouvre l’insertion de l’antenne.', synonyms: ['lobe', 'lobes frontaux'] },
  { id: 'scrobe', name: 'Scrobe antennaire', region: 'tete', definition: 'Sillon de la tête dans lequel le scape peut se replier.', synonyms: ['scrobe'] },
  { id: 'clypeus', name: 'Clypéus', region: 'tete', definition: 'Plaque antérieure de la tête, juste au-dessus des mandibules.', synonyms: [] },
  { id: 'mandibule', name: 'Mandibule', region: 'tete', definition: 'Pièce buccale paire servant à saisir, couper et transporter.', synonyms: [] },
  { id: 'scape', name: 'Scape', region: 'antenne', definition: 'Premier article de l’antenne, long, articulé à la tête.', synonyms: [] },
  { id: 'funicule', name: 'Funicule', region: 'antenne', definition: 'Ensemble des articles situés après le scape, terminés ici en massue.', synonyms: ['funiculus', 'flagelle'] },
  { id: 'pronotum', name: 'Pronotum', region: 'mesosoma', definition: 'Plaque dorsale du premier segment thoracique.', synonyms: [] },
  { id: 'mesonotum', name: 'Mésonotum', region: 'mesosoma', definition: 'Plaque dorsale du deuxième segment thoracique.', synonyms: [] },
  { id: 'sillon', name: 'Sillon métanotal', region: 'mesosoma', definition: 'Dépression dorsale entre le mésonotum et le propodéum.', synonyms: ['sillon', 'metanotal groove'] },
  { id: 'propodeum', name: 'Propodéum', region: 'mesosoma', definition: 'Premier segment abdominal, soudé au thorax.', synonyms: ['épinotum'] },
  { id: 'pedoncule', name: 'Pédoncule', region: 'petiole', definition: 'Partie antérieure étroite du pétiole.', synonyms: ['pédoncule pétiolaire'] },
  { id: 'petiole', name: 'Nœud du pétiole', region: 'petiole', definition: 'Renflement dorsal du pétiole, entre le mésosoma et le gastre.', synonyms: ['pétiole', 'nœud', 'nœud pétiolaire'] },
  { id: 'processus', name: 'Processus subpétiolaire', region: 'petiole', definition: 'Saillie ventrale sous le pétiole.', synonyms: ['processus'] },
  { id: 'postpetiole', name: 'Postpétiole', region: 'petiole', definition: 'Second nœud après le pétiole, présent chez certaines sous-familles (Myrmicinae…).', synonyms: ['post-pétiole'] },
  { id: 'gastre', name: 'Gastre', region: 'gastre', definition: 'Partie renflée de l’abdomen, après le pétiole.', synonyms: [] },
  { id: 'pygidium', name: 'Pygidium', region: 'gastre', definition: 'Dernier tergite visible, à l’extrémité dorsale du gastre.', synonyms: [] },
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
