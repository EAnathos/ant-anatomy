import { LANG, type Lang } from '../i18n';
import { PARTS_EN, PLATES_EN, REGIONS_EN } from './parts.en';

export type PlateId = 'ouvriere' | 'aile';

export type RegionId =
  | 'tete' | 'antenne' | 'mesosoma' | 'petiole' | 'gastre' | 'pattes'
  | 'cellules' | 'nervures';

export type PartId =
  | 'tete' | 'ommatidies' | 'lobe' | 'clypeus' | 'mandibule'
  | 'scape' | 'funicule'
  | 'pronotum' | 'mesonotum' | 'mesopleure' | 'propodeum' | 'spiracle'
  | 'petiole'
  | 'tergite' | 'sternite' | 'pygidium' | 'aiguillon'
  | 'coxa' | 'femur' | 'tibia' | 'eperon' | 'tarse' | 'griffe'
  | 'pterostigma' | 'costale' | 'marginale'
  | 'submarginale-1' | 'submarginale-2' | 'submarginale-3'
  | 'discoidale' | 'subdiscoidale-1' | 'subdiscoidale-2'
  | 'basale' | 'subbasale'
  | 'costa' | 'sous-costale' | 'radius' | '2r-rs' | '3r-rs'
  | 'secteur-radial' | 'rs-plus-m' | 'rs-2-3' | 'rs-4-5' | 'rs-m'
  | 'media-1' | 'media-2' | 'media-3' | 'media-4' | 'm-plus-cu' | 'm-cu'
  | 'cubitus-1' | 'cubitus-2' | 'cubitus-3' | 'cu-a' | 'anale-1' | 'anale-2';

export interface Plate {
  id: PlateId;
  /** Caste et taxon affichés dans le sélecteur : « Ouvrière » + *Neoponera verenae*. */
  subject: string;
  taxon: string;
  /** Espèce non déterminée : « sp. » ajouté après le genre, hors italique. */
  sp?: boolean;
  /** Exemple de saisie en mode Nommer. */
  example: string;
}

export interface Region {
  id: RegionId;
  label: string;
  plate: PlateId;
}

export interface Part {
  id: PartId;
  name: string;
  region: RegionId;
  definition: string;
  synonyms: string[];
}

// Données de référence en français. La traduction anglaise est dans parts.en.ts.

const PLATES_FR: Plate[] = [
  { id: 'ouvriere', subject: 'Ouvrière', taxon: 'Neoponera verenae', example: 'mandibule' },
  { id: 'aile', subject: 'Aile de reine', taxon: 'Odontomachus', sp: true, example: 'cellule costale' },
];

const REGIONS_FR: Region[] = [
  { id: 'tete', label: 'Tête', plate: 'ouvriere' },
  { id: 'antenne', label: 'Antenne', plate: 'ouvriere' },
  { id: 'mesosoma', label: 'Mésosoma', plate: 'ouvriere' },
  { id: 'petiole', label: 'Pétiole', plate: 'ouvriere' },
  { id: 'gastre', label: 'Gastre', plate: 'ouvriere' },
  { id: 'pattes', label: 'Pattes', plate: 'ouvriere' },
  { id: 'cellules', label: 'Cellules', plate: 'aile' },
  { id: 'nervures', label: 'Nervures', plate: 'aile' },
];

const PARTS_FR: Part[] = [
  { id: 'tete', name: 'Tête', region: 'tete', definition: 'Capsule céphalique portant les yeux, les antennes et les pièces buccales.', synonyms: ['capsule céphalique'] },
  { id: 'ommatidies', name: 'Ommatidies', region: 'tete', definition: 'Unités optiques en forme de facettes hexagonales qui, réunies, forment l’œil composé.', synonyms: ['ommatidie', 'ommatidium', 'ommatidia', 'facettes'] },
  { id: 'lobe', name: 'Lobe frontal', region: 'tete', definition: 'Lame de la capsule céphalique, prolongée par la carène frontale, qui borde et protège l’insertion de l’antenne (torulus).', synonyms: ['lobe', 'lobes frontaux', 'carène frontale', 'torulus'] },
  { id: 'clypeus', name: 'Clypéus', region: 'tete', definition: 'Plaque antérieure de la tête, juste au-dessus des mandibules.', synonyms: [] },
  { id: 'mandibule', name: 'Mandibules', region: 'tete', definition: 'Pièces buccales paires servant à saisir, couper et transporter.', synonyms: [] },
  { id: 'scape', name: 'Scapes', region: 'antenne', definition: 'Premier article de l’antenne, long, articulé à la tête.', synonyms: [] },
  { id: 'funicule', name: 'Funicules', region: 'antenne', definition: 'Ensemble des articles de l’antenne situés après le scape.', synonyms: ['funiculus', 'funiculi', 'flagelle'] },
  { id: 'pronotum', name: 'Pronotum', region: 'mesosoma', definition: 'Plaque dorsale du premier segment thoracique.', synonyms: [] },
  { id: 'mesonotum', name: 'Mésonotum', region: 'mesosoma', definition: 'Plaque dorsale du deuxième segment thoracique.', synonyms: [] },
  { id: 'mesopleure', name: 'Mésopleure', region: 'mesosoma', definition: 'Plaque latérale du deuxième segment thoracique, au-dessus de la coxa médiane.', synonyms: ['mésopleuron', 'pleure'] },
  { id: 'propodeum', name: 'Propodéum', region: 'mesosoma', definition: 'Premier segment abdominal, soudé au thorax.', synonyms: ['épinotum'] },
  { id: 'spiracle', name: 'Spiracle propodéal', region: 'mesosoma', definition: 'Orifice respiratoire situé sur le côté du propodéum.', synonyms: ['spiracle', 'stigmate', 'stigmate propodéal'] },
  { id: 'petiole', name: 'Pétiole', region: 'petiole', definition: 'Segment étroit, en forme de nœud, qui relie le mésosoma au gastre.', synonyms: ['nœud du pétiole', 'nœud', 'nœud pétiolaire'] },
  { id: 'tergite', name: 'Tergites', region: 'gastre', definition: 'Plaques dorsales des segments du gastre.', synonyms: [] },
  { id: 'sternite', name: 'Sternites', region: 'gastre', definition: 'Plaques ventrales des segments du gastre.', synonyms: [] },
  { id: 'pygidium', name: 'Pygidium', region: 'gastre', definition: 'Dernier tergite visible, à l’extrémité du gastre.', synonyms: [] },
  { id: 'aiguillon', name: 'Aiguillon', region: 'gastre', definition: 'Dard venimeux à l’extrémité du gastre.', synonyms: ['dard'] },
  { id: 'coxa', name: 'Coxas', region: 'pattes', definition: 'Premier article de la patte, articulé au mésosoma.', synonyms: ['coxae', 'hanche', 'hanches'] },
  { id: 'femur', name: 'Fémurs', region: 'pattes', definition: 'Article le plus robuste de la patte.', synonyms: [] },
  { id: 'tibia', name: 'Tibias', region: 'pattes', definition: 'Long article entre le fémur et le tarse.', synonyms: [] },
  { id: 'eperon', name: 'Éperons tibiaux', region: 'pattes', definition: 'Épine articulée à l’extrémité du tibia.', synonyms: ['éperon tibial', 'éperon', 'calcar', 'calcars'] },
  { id: 'tarse', name: 'Tarses', region: 'pattes', definition: 'Extrémité de la patte, formée de cinq articles.', synonyms: [] },
  { id: 'griffe', name: 'Griffes', region: 'pattes', definition: 'Crochet au bout du dernier article du tarse.', synonyms: ['ongle', 'ongles', 'griffe tarsale', 'griffes tarsales'] },

  { id: 'pterostigma', name: 'Ptérostigma', region: 'cellules', definition: 'Épaississement sclérifié et pigmenté du bord antérieur de l’aile antérieure, au bout de la cellule costale.', synonyms: ['stigma', 'ptérostigme'] },
  { id: 'costale', name: 'Cellule costale', region: 'cellules', definition: 'Cellule étroite qui longe le bord antérieur de l’aile, de la base jusqu’au ptérostigma.', synonyms: ['costale'] },
  { id: 'marginale', name: 'Cellule marginale', region: 'cellules', definition: 'Cellule allongée qui longe le bord antérieur au-delà du ptérostigma, vers l’apex. On l’appelle aussi cellule radiale.', synonyms: ['marginale', 'cellule radiale', 'radiale'] },
  { id: 'submarginale-1', name: 'Cellule submarginale 1', region: 'cellules', definition: 'Cellule submarginale la plus proche de la base, sous le ptérostigma. Le nombre de cellules submarginales varie selon les genres et sert à l’identification.', synonyms: ['submarginale 1', 'première cellule submarginale', 'première submarginale', '1re cellule submarginale', '1re submarginale'] },
  { id: 'submarginale-2', name: 'Cellule submarginale 2', region: 'cellules', definition: 'Deuxième cellule submarginale, sous la cellule marginale.', synonyms: ['submarginale 2', 'deuxième cellule submarginale', 'deuxième submarginale', '2e cellule submarginale', '2e submarginale'] },
  { id: 'submarginale-3', name: 'Cellule submarginale 3', region: 'cellules', definition: 'Cellule submarginale la plus proche de l’apex, sous la nervure radiale.', synonyms: ['submarginale 3', 'troisième cellule submarginale', 'troisième submarginale', '3e cellule submarginale', '3e submarginale'] },
  { id: 'discoidale', name: 'Cellule discoïdale', region: 'cellules', definition: 'Cellule fermée au centre de l’aile, sous la première cellule submarginale.', synonyms: ['discoïdale', 'cellule discale'] },
  { id: 'subdiscoidale-1', name: 'Cellule subdiscoïdale 1', region: 'cellules', definition: 'Cellule située sous la cellule discoïdale, vers le bord postérieur de l’aile.', synonyms: ['subdiscoïdale 1', 'première cellule subdiscoïdale', 'première subdiscoïdale', '1re cellule subdiscoïdale', '1re subdiscoïdale'] },
  { id: 'subdiscoidale-2', name: 'Cellule subdiscoïdale 2', region: 'cellules', definition: 'Grande cellule ouverte entre la nervure médiane et le bord postérieur, du côté de l’apex.', synonyms: ['subdiscoïdale 2', 'deuxième cellule subdiscoïdale', 'deuxième subdiscoïdale', '2e cellule subdiscoïdale', '2e subdiscoïdale'] },
  { id: 'basale', name: 'Cellule basale', region: 'cellules', definition: 'Cellule de la base de l’aile, sous la cellule costale.', synonyms: ['basale'] },
  { id: 'subbasale', name: 'Cellule subbasale', region: 'cellules', definition: 'Cellule étroite de la base de l’aile, sous la cellule basale.', synonyms: ['subbasale', 'sub-basale', 'cellule sub-basale'] },

  { id: 'costa', name: 'Costa', region: 'nervures', definition: 'Nervure qui forme le bord antérieur de l’aile, de la base jusqu’au ptérostigma.', synonyms: ['nervure costale'] },
  { id: 'sous-costale', name: 'Sous-costale', region: 'nervures', definition: 'Nervure longitudinale qui part de la base sous la costa. Chez les fourmis, elle est fusionnée au radius (Sc+R).', synonyms: ['subcosta', 'subcostale', 'nervure sous-costale', 'sc', 'sc+r'] },
  { id: 'radius', name: 'Radius', region: 'nervures', definition: 'Nervure qui rejoint le ptérostigma puis longe le bord antérieur en bordant la cellule marginale.', synonyms: ['nervure radiale', 'r1'] },
  { id: '2r-rs', name: 'Transverse 2r-rs', region: 'nervures', definition: 'Nervure transverse qui relie le ptérostigma au secteur radial et ferme la cellule marginale du côté de la base.', synonyms: ['2r-rs', 'nervure 2r-rs', '2 radius radial sector'] },
  { id: '3r-rs', name: 'Transverse 3r-rs', region: 'nervures', definition: 'Nervure transverse à l’apex de la cellule marginale, qui la referme contre le bord antérieur.', synonyms: ['3r-rs', 'nervure 3r-rs', '3 radius radial sector'] },
  { id: 'secteur-radial', name: 'Secteur radial', region: 'nervures', definition: 'Branche postérieure du radius : ce court segment descend jusqu’à la média et fusionne avec elle.', synonyms: ['rs', 'radial sector'] },
  { id: 'rs-plus-m', name: 'Secteur radial + média', region: 'nervures', definition: 'Segment où secteur radial et média sont fusionnés, au bord supérieur de la cellule discoïdale.', synonyms: ['rs+m', 'rs + m', 'radial sector+media', 'radial sector + media', 'secteur radial+média'] },
  { id: 'rs-2-3', name: 'Secteur radial 2+3', region: 'nervures', definition: 'Branche du secteur radial qui remonte vers le ptérostigma, entre les cellules submarginales 1 et 2.', synonyms: ['rs2+3', 'rs 2+3', 'radial sector 2+3', 'secteur radial 2 3'] },
  { id: 'rs-4-5', name: 'Secteur radial 4+5', region: 'nervures', definition: 'Branche du secteur radial qui borde la cellule marginale par-dessous, jusqu’à l’apex.', synonyms: ['rs4+5', 'rs 4+5', 'radial sector 4+5', 'radial sector 4 5', 'secteur radial 4 5'] },
  { id: 'rs-m', name: 'Transverse rs-m', region: 'nervures', definition: 'Nervure transverse qui relie le secteur radial à la média, entre les cellules submarginales 2 et 3.', synonyms: ['rs-m', 'nervure rs-m', 'radial sector media'] },
  { id: 'media-1', name: 'Média 1', region: 'nervures', definition: 'Premier segment de la média : il quitte la tige commune avec le cubitus et remonte jusqu’au secteur radial en bordant la cellule discoïdale.', synonyms: ['media 1', 'm1', 'médiane 1'] },
  { id: 'media-2', name: 'Média 2', region: 'nervures', definition: 'Segment de la média qui longe la cellule discoïdale, entre le secteur radial et la transverse m-cu.', synonyms: ['media 2', 'm2', 'médiane 2'] },
  { id: 'media-3', name: 'Média 3', region: 'nervures', definition: 'Segment de la média entre la transverse m-cu et la transverse rs-m, sous la cellule submarginale 2.', synonyms: ['media 3', 'm3', 'médiane 3'] },
  { id: 'media-4', name: 'Média 4', region: 'nervures', definition: 'Dernier segment de la média, de la transverse rs-m vers l’apex de l’aile.', synonyms: ['media 4', 'm4', 'médiane 4'] },
  { id: 'm-plus-cu', name: 'Média + cubitus', region: 'nervures', definition: 'Tige commune de la média et du cubitus, depuis la base de l’aile jusqu’à leur séparation.', synonyms: ['m+cu', 'm + cu', 'media+cubitus', 'media + cubitus'] },
  { id: 'm-cu', name: 'Transverse m-cu', region: 'nervures', definition: 'Nervure transverse qui relie la média au cubitus, sur le côté de la cellule discoïdale.', synonyms: ['m-cu', 'nervure m-cu', 'media cubitus'] },
  { id: 'cubitus-1', name: 'Cubitus 1', region: 'nervures', definition: 'Premier segment du cubitus, qui borde la cellule discoïdale par-dessous.', synonyms: ['cu1', 'cu 1'] },
  { id: 'cubitus-2', name: 'Cubitus 2', region: 'nervures', definition: 'Segment du cubitus qui descend en oblique vers le bord postérieur, après la transverse m-cu.', synonyms: ['cu2', 'cu 2'] },
  { id: 'cubitus-3', name: 'Cubitus 3', region: 'nervures', definition: 'Dernier segment du cubitus, qui file vers l’apex près du bord postérieur.', synonyms: ['cu3', 'cu 3'] },
  { id: 'cu-a', name: 'Transverse cu-a', region: 'nervures', definition: 'Nervure transverse qui relie la tige média + cubitus à la nervure anale, près de la base.', synonyms: ['cu-a', 'nervure cu-a', 'cubitus anal'] },
  { id: 'anale-1', name: 'Anale 1', region: 'nervures', definition: 'Nervure anale, près du bord postérieur, de la base jusqu’à la transverse cu-a.', synonyms: ['a1', 'anal', 'anal 1', 'nervure anale', 'nervure anale 1'] },
  { id: 'anale-2', name: 'Anale 2', region: 'nervures', definition: 'Prolongement de la nervure anale au-delà de la transverse cu-a, vers l’apex.', synonyms: ['a2', 'anal 2', 'nervure anale 2'] },
];

/** Structures dans la langue demandée (les tests vérifient les deux langues). */
export function partsFor(lang: Lang): Part[] {
  return lang === 'fr' ? PARTS_FR : PARTS_FR.map((p) => ({ ...p, ...PARTS_EN[p.id] }));
}

export const PLATES: Plate[] = LANG === 'fr' ? PLATES_FR : PLATES_FR.map((p) => ({ ...p, ...PLATES_EN[p.id] }));

export const REGIONS: Region[] = LANG === 'fr' ? REGIONS_FR : REGIONS_FR.map((r) => ({ ...r, label: REGIONS_EN[r.id] }));

export const PARTS: Part[] = partsFor(LANG);

export const PART_BY_ID = Object.fromEntries(PARTS.map((p) => [p.id, p])) as Record<PartId, Part>;

export const PLATE_BY_ID = Object.fromEntries(PLATES.map((p) => [p.id, p])) as Record<PlateId, Plate>;

export const REGION_BY_ID = Object.fromEntries(REGIONS.map((r) => [r.id, r])) as Record<RegionId, Region>;

export function partsInRegions(regions: readonly RegionId[]): Part[] {
  return PARTS.filter((p) => regions.includes(p.region));
}

export function regionsOf(plate: PlateId): Region[] {
  return REGIONS.filter((r) => r.plate === plate);
}

export function partsOf(plate: PlateId): Part[] {
  return PARTS.filter((p) => REGION_BY_ID[p.region].plate === plate);
}
