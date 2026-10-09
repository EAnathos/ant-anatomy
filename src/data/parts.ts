import { LANG, type Lang } from '../i18n';
import { PLATES_EN, REGIONS_EN, TERMS_EN } from './parts.en';

export type PlateId = 'ouvriere' | 'aile';

export type RegionId =
  | 'tete' | 'antenne' | 'mesosoma' | 'petiole' | 'gastre' | 'pattes'
  | 'cellules' | 'nervures';

/** Terme du glossaire. */
export type TermId =
  | 'tete' | 'ommatidies' | 'lobe' | 'clypeus' | 'mandibule'
  | 'scape' | 'funicule'
  | 'pronotum' | 'mesonotum' | 'mesopleure' | 'propodeum' | 'spiracle'
  | 'petiole'
  | 'tergite' | 'sternite' | 'pygidium' | 'hypopygium' | 'aiguillon'
  | 'coxa' | 'trochanter' | 'femur' | 'tibia' | 'eperon' | 'tarse' | 'griffe'
  | 'pterostigma' | 'costale' | 'marginale'
  | 'submarginale-1' | 'submarginale-2' | 'submarginale-3'
  | 'discoidale' | 'subdiscoidale-1' | 'subdiscoidale-2'
  | 'basale' | 'subbasale'
  | 'costa' | 'sous-costale' | 'radius' | '2r-rs' | '3r-rs'
  | 'secteur-radial' | 'rs-plus-m' | 'rs-2-3' | 'rs-4-5' | 'rs-m'
  | 'media-1' | 'media-2' | 'media-3' | 'media-4' | 'm-plus-cu' | 'm-cu'
  | 'cubitus-1' | 'cubitus-2' | 'cubitus-3' | 'cu-a' | 'anale-1' | 'anale-2'
  // Termes du glossaire de Bolton (1994) qui ne figurent sur aucune planche pour l'instant.
  | 'oeil' | 'gena' | 'bord-occipital' | 'coins-occipitaux' | 'carene-frontale' | 'triangle-frontal'
  | 'suture-fronto-clypeale' | 'clypeus-median' | 'clypeus-lateral' | 'torulus' | 'fossette-antennaire' | 'scrobe'
  | 'fossette-tentoriale' | 'carene-nucale' | 'labre' | 'palpes-maxillaires' | 'palpes-labiaux' | 'hypostome'
  | 'bulbe-condylaire' | 'massue' | 'bord-masticateur' | 'bord-basal' | 'bord-externe' | 'angle-basal'
  | 'dent-apicale' | 'dent-basale' | 'dent-preapicale' | 'dent-prebasale' | 'denticule' | 'diasteme'
  | 'lamelle-basale' | 'trulleum' | 'mesosoma' | 'thorax' | 'promesonotum' | 'suture-promesonotale'
  | 'sillon-metanotal' | 'propleure' | 'metapleure' | 'anepisterne' | 'katepisterne' | 'orifice-metapleural'
  | 'bulle-metapleurale' | 'lobe-propodeal' | 'declivite-propodeale' | 'epines-propodeales'
  | 'processus-metasternal' | 'fossette-endophragmale' | 'angles-humeraux' | 'abdomen' | 'metasoma' | 'gastre'
  | 'taille' | 'postpetiole' | 'helcium' | 'pedoncule' | 'processus-subpetiolaire' | 'presclerite'
  | 'acidopore' | 'constriction' | 'appareil-stridulatoire' | 'basitarse' | 'pretarse' | 'strigile' | 'soie'
  | 'pubescence' | 'psammophore' | 'lobe-torulaire' | 'sillon-paraoculo-clypeal' | 'ocelles' | 'arolium' | 'suture'
  | 'sulcus';

/** Structure d'une planche : identifiée par son terme (`data-part` du SVG), unique au sein d'une planche. */
export type PartId = TermId;

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

/** Entrée du dictionnaire : la même sur toutes les planches où le terme figure. */
export interface Term {
  id: TermId;
  name: string;
  definition: string;
  /** Vrais synonymes, affichés dans le glossaire et acceptés comme réponse. */
  synonyms: string[];
  /** Autres formes acceptées comme réponse sans être affichées : singulier ou pluriel, numérotation, notation de
   * nervation, forme latine ou anglaise. */
  variants?: string[];
}

/** Un terme placé sur une planche, dans une région. */
export interface Part extends Term {
  region: RegionId;
  plate: PlateId;
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

const TERMS_FR: Term[] = [
  { id: 'tete', name: 'Tête', definition: 'Capsule céphalique portant les yeux, les antennes et les pièces buccales.', synonyms: ['capsule céphalique'] },
  { id: 'ommatidies', name: 'Ommatidies', definition: 'Unités optiques en forme de facettes hexagonales qui, réunies, forment l’œil composé.', synonyms: ['facettes'], variants: ['ommatidie', 'ommatidium', 'ommatidia'] },
  { id: 'lobe', name: 'Lobe frontal', definition: 'Expansion dorsolatérale de l’avant de la carène frontale, qui recouvre en partie ou en totalité l’insertion de l’antenne (torulus et fossette antennaire). Keller (2011) réserve ce nom à cette seule structure : chez beaucoup de Ponerinae, le grand lobe ainsi nommé est en réalité un lobe torulaire.', synonyms: [], variants: ['lobe', 'lobes frontaux'] },
  { id: 'clypeus', name: 'Clypéus', definition: 'Sclérite antérieur de la face dorsale de la tête, limité en arrière par la suture fronto-clypéale. Son bord antérieur forme en général le bord antérieur de la tête, au-dessus des mandibules. Il se compose d’une partie médiane et de deux parties latérales.', synonyms: [] },
  { id: 'mandibule', name: 'Mandibules', definition: 'Pièces buccales paires avec lesquelles la fourmi saisit, coupe et transporte. Leur forme et leur denture, très variables, comptent beaucoup en taxonomie.', synonyms: [] },
  { id: 'scape', name: 'Scapes', definition: 'Premier article de l’antenne, allongé, articulé à la tête dans la fossette antennaire par un bulbe condylaire.', synonyms: [] },
  { id: 'funicule', name: 'Funicules', definition: 'Ensemble des articles de l’antenne situés après le scape : de 3 à 11 selon les genres, qui portent l’antenne à 4 à 12 articles. Les derniers peuvent former une massue.', synonyms: ['funiculus', 'flagelle'], variants: ['funiculi'] },
  { id: 'pronotum', name: 'Pronotum', definition: 'Tergite du prothorax (premier segment thoracique). Il couvre le dessus du segment et descend sur ses côtés, en cachant presque entièrement le propleure.', synonyms: [] },
  { id: 'mesonotum', name: 'Mésonotum', definition: 'Tergite du mésothorax (deuxième segment thoracique). Une suture promésonotale le sépare du pronotum, ou bien les deux sont soudés en un promésonotum.', synonyms: [] },
  { id: 'mesopleure', name: 'Mésopleure', definition: 'Pleurite du mésothorax, sur le côté du mésosoma au-dessus de la coxa médiane. C’est le plus grand pleurite ; un sillon le divise parfois en anépisterne (en haut) et katépisterne (en bas). Keller (2011) l’appelle mésépisterne.', synonyms: ['mésopleuron', 'mésépisterne'] },
  { id: 'propodeum', name: 'Propodéum', definition: 'Tergite du premier segment abdominal, dont le sternite a disparu. Soudé au thorax, il forme l’arrière du mésosoma. Épinotum est un terme ancien, à éviter.', synonyms: ['épinotum'] },
  { id: 'spiracle', name: 'Spiracle propodéal', definition: 'Orifice respiratoire sur le côté du propodéum : morphologiquement le spiracle du premier segment abdominal, en général le plus grand du corps.', synonyms: ['stigmate propodéal'], variants: ['spiracle', 'stigmate'] },
  { id: 'petiole', name: 'Pétiole', definition: 'Deuxième segment abdominal, réduit et isolé entre le mésosoma et le gastre (ou le postpétiole quand il existe). Il prend le plus souvent la forme d’un nœud ou d’une écaille, et porte le deuxième spiracle abdominal.', synonyms: [], variants: ['nœud du pétiole', 'nœud', 'nœud pétiolaire'] },
  { id: 'tergite', name: 'Tergites', definition: 'Sclérites dorsaux des segments du gastre.', synonyms: [] },
  { id: 'sternite', name: 'Sternites', definition: 'Sclérites ventraux des segments du gastre.', synonyms: [] },
  { id: 'pygidium', name: 'Pygidium', definition: 'Tergite du septième segment abdominal : le dernier tergite visible, à l’extrémité du gastre.', synonyms: [] },
  { id: 'hypopygium', name: 'Hypopygium', definition: 'Sternite du septième segment abdominal : le dernier sternite visible du gastre.', synonyms: [] },
  { id: 'aiguillon', name: 'Aiguillon', definition: 'Dard venimeux à l’extrémité du gastre.', synonyms: ['dard'] },
  { id: 'coxa', name: 'Coxas', definition: 'Premier article de la patte, le plus basal, articulé au mésosoma.', synonyms: ['hanche'], variants: ['coxa', 'coxae', 'hanches'] },
  { id: 'trochanter', name: 'Trochanters', definition: 'Deuxième article de la patte, petit, entre la coxa et le fémur.', synonyms: [], variants: ['trochanter'] },
  { id: 'femur', name: 'Fémurs', definition: 'Troisième article de la patte, en général le plus long et robuste, séparé de la coxa par le seul trochanter.', synonyms: [] },
  { id: 'tibia', name: 'Tibias', definition: 'Quatrième article de la patte, long, entre le fémur et le tarse.', synonyms: [] },
  { id: 'eperon', name: 'Éperons tibiaux', definition: 'Épine articulée à l’apex du tibia. Celui de la patte antérieure, pectiné, appelé calcar, forme avec l’encoche du basitarse le strigile qui nettoie l’antenne ; les tibias médians et postérieurs en portent deux, un ou aucun.', synonyms: [], variants: ['éperon tibial', 'éperon'] },
  { id: 'tarse', name: 'Tarses', definition: 'Extrémité de la patte, formée de cinq petits articles : le premier, articulé au tibia, est le basitarse, le dernier, le prétarse, porte les griffes.', synonyms: [] },
  { id: 'griffe', name: 'Griffes', definition: 'Paire de crochets portée par le prétarse, dernier article du tarse, de part et d’autre de l’arolium. Simples le plus souvent, elles peuvent porter une dent préapicale, être pectinées ou armées d’épines à la base.', synonyms: ['griffes tarsales', 'griffes prétarsales'], variants: ['griffe tarsale', 'griffe prétarsale'] },

  { id: 'pterostigma', name: 'Ptérostigma', definition: 'Épaississement sclérifié et pigmenté du bord antérieur de l’aile antérieure, au bout de la cellule costale.', synonyms: ['stigma', 'ptérostigme'] },
  { id: 'costale', name: 'Cellule costale', definition: 'Cellule étroite qui longe le bord antérieur de l’aile, de la base jusqu’au ptérostigma.', synonyms: [], variants: ['costale'] },
  { id: 'marginale', name: 'Cellule marginale', definition: 'Cellule allongée qui longe le bord antérieur au-delà du ptérostigma, vers l’apex. On l’appelle aussi cellule radiale.', synonyms: ['cellule radiale'], variants: ['marginale', 'radiale'] },
  { id: 'submarginale-1', name: 'Cellule submarginale 1', definition: 'Cellule submarginale la plus proche de la base, sous le ptérostigma. Le nombre de cellules submarginales varie selon les genres et sert à l’identification.', synonyms: [], variants: ['submarginale 1', 'première cellule submarginale', 'première submarginale', '1re cellule submarginale', '1re submarginale'] },
  { id: 'submarginale-2', name: 'Cellule submarginale 2', definition: 'Deuxième cellule submarginale, sous la cellule marginale.', synonyms: [], variants: ['submarginale 2', 'deuxième cellule submarginale', 'deuxième submarginale', '2e cellule submarginale', '2e submarginale'] },
  { id: 'submarginale-3', name: 'Cellule submarginale 3', definition: 'Cellule submarginale la plus proche de l’apex, sous la nervure radiale.', synonyms: [], variants: ['submarginale 3', 'troisième cellule submarginale', 'troisième submarginale', '3e cellule submarginale', '3e submarginale'] },
  { id: 'discoidale', name: 'Cellule discoïdale', definition: 'Cellule fermée au centre de l’aile, sous la première cellule submarginale.', synonyms: ['cellule discale'], variants: ['discoïdale'] },
  { id: 'subdiscoidale-1', name: 'Cellule subdiscoïdale 1', definition: 'Cellule située sous la cellule discoïdale, vers le bord postérieur de l’aile.', synonyms: [], variants: ['subdiscoïdale 1', 'première cellule subdiscoïdale', 'première subdiscoïdale', '1re cellule subdiscoïdale', '1re subdiscoïdale'] },
  { id: 'subdiscoidale-2', name: 'Cellule subdiscoïdale 2', definition: 'Grande cellule ouverte entre la nervure médiane et le bord postérieur, du côté de l’apex.', synonyms: [], variants: ['subdiscoïdale 2', 'deuxième cellule subdiscoïdale', 'deuxième subdiscoïdale', '2e cellule subdiscoïdale', '2e subdiscoïdale'] },
  { id: 'basale', name: 'Cellule basale', definition: 'Cellule de la base de l’aile, sous la cellule costale.', synonyms: [], variants: ['basale'] },
  { id: 'subbasale', name: 'Cellule subbasale', definition: 'Cellule étroite de la base de l’aile, sous la cellule basale.', synonyms: [], variants: ['subbasale', 'sub-basale', 'cellule sub-basale'] },

  { id: 'costa', name: 'Costa', definition: 'Nervure qui forme le bord antérieur de l’aile, de la base jusqu’au ptérostigma.', synonyms: ['nervure costale'] },
  { id: 'sous-costale', name: 'Sous-costale', definition: 'Nervure longitudinale qui part de la base sous la costa. Chez les fourmis, elle est fusionnée au radius (Sc+R).', synonyms: ['subcosta'], variants: ['subcostale', 'nervure sous-costale', 'sc', 'sc+r'] },
  { id: 'radius', name: 'Radius', definition: 'Nervure qui rejoint le ptérostigma puis longe le bord antérieur en bordant la cellule marginale.', synonyms: ['nervure radiale'], variants: ['r1'] },
  { id: '2r-rs', name: 'Transverse 2r-rs', definition: 'Nervure transverse qui relie le ptérostigma au secteur radial et ferme la cellule marginale du côté de la base.', synonyms: [], variants: ['2r-rs', 'nervure 2r-rs'] },
  { id: '3r-rs', name: 'Transverse 3r-rs', definition: 'Nervure transverse à l’apex de la cellule marginale, qui la referme contre le bord antérieur.', synonyms: [], variants: ['3r-rs', 'nervure 3r-rs'] },
  { id: 'secteur-radial', name: 'Secteur radial', definition: 'Branche postérieure du radius : ce court segment descend jusqu’à la média et fusionne avec elle.', synonyms: [], variants: ['rs', 'radial sector'] },
  { id: 'rs-plus-m', name: 'Secteur radial + média', definition: 'Segment où secteur radial et média sont fusionnés, au bord supérieur de la cellule discoïdale.', synonyms: [], variants: ['rs+m', 'rs + m', 'radial sector+media', 'radial sector + media', 'secteur radial+média'] },
  { id: 'rs-2-3', name: 'Secteur radial 2+3', definition: 'Branche du secteur radial qui remonte vers le ptérostigma, entre les cellules submarginales 1 et 2.', synonyms: [], variants: ['rs2+3', 'rs 2+3', 'radial sector 2+3', 'secteur radial 2 3'] },
  { id: 'rs-4-5', name: 'Secteur radial 4+5', definition: 'Branche du secteur radial qui borde la cellule marginale par-dessous, jusqu’à l’apex.', synonyms: [], variants: ['rs4+5', 'rs 4+5', 'radial sector 4+5', 'radial sector 4 5', 'secteur radial 4 5'] },
  { id: 'rs-m', name: 'Transverse rs-m', definition: 'Nervure transverse qui relie le secteur radial à la média, entre les cellules submarginales 2 et 3.', synonyms: [], variants: ['rs-m', 'nervure rs-m'] },
  { id: 'media-1', name: 'Média 1', definition: 'Premier segment de la média : il quitte la tige commune avec le cubitus et remonte jusqu’au secteur radial en bordant la cellule discoïdale.', synonyms: ['médiane 1'], variants: ['media 1', 'm1'] },
  { id: 'media-2', name: 'Média 2', definition: 'Segment de la média qui longe la cellule discoïdale, entre le secteur radial et la transverse m-cu.', synonyms: ['médiane 2'], variants: ['media 2', 'm2'] },
  { id: 'media-3', name: 'Média 3', definition: 'Segment de la média entre la transverse m-cu et la transverse rs-m, sous la cellule submarginale 2.', synonyms: ['médiane 3'], variants: ['media 3', 'm3'] },
  { id: 'media-4', name: 'Média 4', definition: 'Dernier segment de la média, de la transverse rs-m vers l’apex de l’aile.', synonyms: ['médiane 4'], variants: ['media 4', 'm4'] },
  { id: 'm-plus-cu', name: 'Média + cubitus', definition: 'Tige commune de la média et du cubitus, depuis la base de l’aile jusqu’à leur séparation.', synonyms: [], variants: ['m+cu', 'm + cu', 'media+cubitus', 'media + cubitus'] },
  { id: 'm-cu', name: 'Transverse m-cu', definition: 'Nervure transverse qui relie la média au cubitus, sur le côté de la cellule discoïdale.', synonyms: [], variants: ['m-cu', 'nervure m-cu', 'media cubitus'] },
  { id: 'cubitus-1', name: 'Cubitus 1', definition: 'Premier segment du cubitus, qui borde la cellule discoïdale par-dessous.', synonyms: [], variants: ['cu1', 'cu 1'] },
  { id: 'cubitus-2', name: 'Cubitus 2', definition: 'Segment du cubitus qui descend en oblique vers le bord postérieur, après la transverse m-cu.', synonyms: [], variants: ['cu2', 'cu 2'] },
  { id: 'cubitus-3', name: 'Cubitus 3', definition: 'Dernier segment du cubitus, qui file vers l’apex près du bord postérieur.', synonyms: [], variants: ['cu3', 'cu 3'] },
  { id: 'cu-a', name: 'Transverse cu-a', definition: 'Nervure transverse qui relie la tige média + cubitus à la nervure anale, près de la base.', synonyms: [], variants: ['cu-a', 'nervure cu-a'] },
  { id: 'anale-1', name: 'Anale 1', definition: 'Nervure anale, près du bord postérieur, de la base jusqu’à la transverse cu-a.', synonyms: [], variants: ['a1', 'anal', 'anal 1', 'nervure anale', 'nervure anale 1'] },
  { id: 'anale-2', name: 'Anale 2', definition: 'Prolongement de la nervure anale au-delà de la transverse cu-a, vers l’apex.', synonyms: [], variants: ['a2', 'anal 2', 'nervure anale 2'] },

  // Termes du glossaire de Bolton (1994) qui ne figurent sur aucune planche pour l'instant (glossaire seulement).
  { id: 'oeil', name: 'Œil composé', definition: 'Organe de la vue, sur le côté de la tête, formé de quelques centaines d’ommatidies à quelques-unes seulement. Il manque chez les ouvrières de certains genres ; chez d’autres (*Eciton*, *Simopelta*), les facettes sont fondues en une seule cornée convexe.', synonyms: [], variants: ['œil', 'yeux', 'yeux composés'] },
  { id: 'gena', name: 'Gena', definition: 'Zone de la face de la tête limitée en avant par le bord postérieur du clypéus, en arrière par le bord antérieur de l’œil et vers le milieu par la fossette antennaire. Elle couvre une partie du dessus et du côté de la tête, entre l’œil et le clypéus.', synonyms: ['joue'], variants: ['genae', 'joues'] },
  { id: 'bord-occipital', name: 'Bord occipital', definition: 'Bord postérieur transverse de la tête en vue de face. Le terme est impropre, l’occiput commençant en général plus en arrière, mais reste d’usage courant.', synonyms: ['marge occipitale', 'bord postérieur de la tête'] },
  { id: 'coins-occipitaux', name: 'Coins occipitaux', definition: 'Angles postérolatéraux de la tête en vue de face, arrondis à aigus, là où les côtés rejoignent le bord occipital.', synonyms: ['angles occipitaux'], variants: ['coin occipital'] },
  { id: 'carene-frontale', name: 'Carène frontale', definition: 'Chacune des deux crêtes longitudinales de la tête, en arrière du clypéus et entre les insertions antennaires. Très variables : courtes, ou prolongées jusqu’au bord occipital, parfois en bordure d’un scrobe, parfois vestigiales. Elles s’élargissent souvent vers l’avant en lobes frontaux.', synonyms: [], variants: ['carènes frontales'] },
  { id: 'triangle-frontal', name: 'Triangle frontal', definition: 'Aire impaire bien délimitée juste en arrière de la partie médiane du clypéus, entre les carènes frontales. Elle n’est triangulaire que si les insertions antennaires sont écartées : Keller (2011) l’appelle donc aire supraclypéale et la dit présente chez presque toutes les fourmis, là où Bolton (1994) la jugeait souvent peu visible.', synonyms: ['aire supraclypéale'] },
  { id: 'suture-fronto-clypeale', name: 'Suture fronto-clypéale', definition: 'Ligne qui forme le bord postérieur du clypéus. Keller (2011) parle de sillon fronto-clypéal : c’est la partie médiane du sillon épistomal, entre les deux fossettes tentoriales antérieures, un sillon externe doublé d’une crête interne plutôt qu’une vraie suture.', synonyms: ['sillon fronto-clypéal', 'bord postérieur du clypéus'], variants: ['suture frontoclypéale'] },
  { id: 'clypeus-median', name: 'Partie médiane du clypéus', definition: 'Bouclier central du clypéus, entre ses deux parties latérales. Il peut porter des carènes longitudinales, et s’arrête devant les insertions antennaires ou s’avance entre elles.', synonyms: ['aire médiane du clypéus'] },
  { id: 'clypeus-lateral', name: 'Partie latérale du clypéus', definition: 'Chacune des deux bandes étroites du clypéus, de part et d’autre de sa partie médiane.', synonyms: ['aire latérale du clypéus'], variants: ['parties latérales du clypéus'] },
  { id: 'torulus', name: 'Torulus', definition: 'Petit sclérite en anneau qui entoure la fossette antennaire. Keller (2011) y distingue un arc médian, côté milieu de la tête, et un arc latéral ; l’arc médian peut s’étendre en lobe torulaire, recouvert ou non par le lobe frontal.', synonyms: ['sclérite antennaire', 'sclérite torulaire'], variants: ['toruli'] },
  { id: 'fossette-antennaire', name: 'Fossette antennaire', definition: 'Orifice en arrière du clypéus dans lequel s’articule le scape. Keller (2011) y distingue l’acétabulum, cuvette où se loge le bulbe du scape, et le foramen qui s’ouvre au fond vers l’intérieur de la tête. Le torulus l’entoure et le lobe frontal peut la surplomber et la cacher.', synonyms: ['insertion antennaire'] },
  { id: 'scrobe', name: 'Scrobe antennaire', definition: 'Sillon, dépression ou excavation sur le côté de la tête, au-dessus ou au-dessous de l’œil, qui loge le scape et parfois toute l’antenne repliée. Absent chez la plupart des genres.', synonyms: [], variants: ['scrobe', 'scrobes'] },
  { id: 'fossette-tentoriale', name: 'Fossette tentoriale antérieure', definition: 'Chacune des deux petites fossettes à l’avant de la face dorsale de la tête, sur le bord postérieur du clypéus ou tout près. Elles marquent l’attache des bras antérieurs du tentorium, le squelette interne de la tête.', synonyms: [], variants: ['fossettes tentoriales', 'fossette tentoriale'] },
  { id: 'carene-nucale', name: 'Carène nucale', definition: 'Crête à l’arrière de la tête qui sépare ses faces dorsale et latérales de la face occipitale.', synonyms: [] },
  { id: 'labre', name: 'Labre', definition: 'Pièce buccale articulée au bord antérieur du clypéus, repliée vers le bas sur les maxilles et le labium au repos. Bilobé et caché en vue dorsale chez la plupart des fourmis, il dépasse du clypéus chez quelques-unes.', synonyms: [] },
  { id: 'palpes-maxillaires', name: 'Palpes maxillaires', definition: 'Palpes sensoriels articulés portés par les maxilles, de six articles au plus, souvent moins selon les groupes. Leur nombre d’articles est noté en premier dans la formule palpaire.', synonyms: [], variants: ['palpe maxillaire'] },
  { id: 'palpes-labiaux', name: 'Palpes labiaux', definition: 'Paire de palpes sensoriels portés par le labium, de quatre articles au plus.', synonyms: [], variants: ['palpe labial'] },
  { id: 'hypostome', name: 'Hypostome', definition: 'Région antéroventrale de la tête, juste en arrière de la cavité buccale dont elle forme le bord postérieur. Son bord antérieur peut porter des dents hypostomales.', synonyms: ['hypostoma'] },
  { id: 'bulbe-condylaire', name: 'Bulbe condylaire', definition: 'Renflement en boule à la base du scape, relié à lui par un court col : c’est lui qui s’articule dans la fossette antennaire. Keller (2011) l’appelle bulbus.', synonyms: ['bulbe articulaire', 'bulbus'] },
  { id: 'massue', name: 'Massue antennaire', definition: 'Derniers articles du funicule, de un à quatre, nettement élargis.', synonyms: [], variants: ['massue'] },
  { id: 'bord-masticateur', name: 'Bord masticateur', definition: 'Bord interne de la mandibule, le plus proche de l’axe de la tête quand les mandibules sont fermées. Il porte en général les dents.', synonyms: ['bord apical'] },
  { id: 'bord-basal', name: 'Bord basal', definition: 'Bord de la mandibule entre l’angle basal et la base, transverse ou oblique, le plus souvent sans dents. Il rejoint le bord masticateur par l’angle basal ou par une courbe.', synonyms: [], variants: ['bord basal de la mandibule'] },
  { id: 'bord-externe', name: 'Bord externe', definition: 'Bord extérieur de la mandibule en vue de face, droit, sinueux ou convexe.', synonyms: ['bord latéral de la mandibule'], variants: ['bord externe de la mandibule'] },
  { id: 'angle-basal', name: 'Angle basal', definition: 'Angle où le bord masticateur rejoint le bord basal, près du bord antérieur du clypéus. Il disparaît chez les mandibules linéaires.', synonyms: [] },
  { id: 'dent-apicale', name: 'Dent apicale', definition: 'Première dent du bord masticateur, la plus distale, en général la plus grande.', synonyms: [] },
  { id: 'dent-basale', name: 'Dent basale', definition: 'Dent située à l’angle basal de la mandibule, ou la plus proche de lui.', synonyms: [] },
  { id: 'dent-preapicale', name: 'Dent préapicale', definition: 'Dent qui suit immédiatement la dent apicale. Le terme désigne parfois plusieurs dents entre l’apex et le milieu du bord masticateur.', synonyms: ['dent subapicale'], variants: ['dents préapicales'] },
  { id: 'dent-prebasale', name: 'Dent prébasale', definition: 'Dent qui précède immédiatement la dent basale.', synonyms: ['dent subbasale'] },
  { id: 'denticule', name: 'Denticule', definition: 'Dent courte ou très réduite du bord masticateur. Une mandibule qui ne porte que des denticules est dite denticulée.', synonyms: [], variants: ['denticules'] },
  { id: 'diasteme', name: 'Diastème', definition: 'Espace naturel dans la rangée de dents du bord masticateur, à ne pas confondre avec une dent cassée ou usée.', synonyms: [], variants: ['diastèmes'] },
  { id: 'lamelle-basale', name: 'Lamelle basale', definition: 'Fine lame de cuticule sur le bord masticateur, en arrière des dents, chez de nombreuses Myrmicinae de la tribu des Dacetini.', synonyms: [] },
  { id: 'trulleum', name: 'Trulleum', definition: 'Dépression en cuvette près de la base de la mandibule, sur sa face dorsale, limitée du côté distal par le bord basal.', synonyms: [] },
  { id: 'mesosoma', name: 'Mésosoma', definition: 'Deuxième tagme visible, après la tête : les trois segments du thorax (pro-, méso- et métathorax) et le propodéum qui leur est soudé. Bolton (1994) l’appelait alitrunk ; mésosoma, employé dans tous les Hyménoptères apocrites, est aujourd’hui le terme admis (Keller 2011).', synonyms: ['alitrunk'] },
  { id: 'thorax', name: 'Thorax', definition: 'Les trois segments thoraciques au sens strict. Chez les fourmis, ils sont soudés au propodéum, et l’ensemble s’appelle mésosoma : parler de thorax pour ce tagme est impropre.', synonyms: [] },
  { id: 'promesonotum', name: 'Promésonotum', definition: 'Sclérite unique issu de la fusion du pronotum et du mésonotum, quand la suture promésonotale a disparu.', synonyms: [] },
  { id: 'suture-promesonotale', name: 'Suture promésonotale', definition: 'Jonction transverse sur le dessus du mésosoma, entre le pronotum et le mésonotum. Mobile chez certains groupes (une articulation, au sens strict), elle est souvent soudée en suture, réduite à une ligne, voire effacée.', synonyms: ['jonction promésonotale'] },
  { id: 'sillon-metanotal', name: 'Sillon métanotal', definition: 'Sillon transverse entre le mésonotum et le propodéum. Chez l’ouvrière, le métanotum (tergite du métathorax) reste parfois une petite bande distincte ; le plus souvent il n’en subsiste que ce sillon, ou plus rien.', synonyms: ['suture métanotale'] },
  { id: 'propleure', name: 'Propleure', definition: 'Pleurite du prothorax, petit, presque entièrement caché par le pronotum de profil mais bien visible en vue ventrale.', synonyms: ['propleuron'] },
  { id: 'metapleure', name: 'Métapleure', definition: 'Pleurite du métathorax, à l’arrière du côté du mésosoma, sous le niveau du propodéum. Il porte la glande métapleurale chez la plupart des fourmis.', synonyms: ['métapleuron'] },
  { id: 'anepisterne', name: 'Anépisterne', definition: 'Partie supérieure de la mésopleure, quand un sillon transverse la divise.', synonyms: ['anépisternum'] },
  { id: 'katepisterne', name: 'Katépisterne', definition: 'Partie inférieure de la mésopleure, quand un sillon transverse la divise.', synonyms: ['katépisternum'] },
  { id: 'orifice-metapleural', name: 'Orifice de la glande métapleurale', definition: 'Ouverture de la glande métapleurale, une glande exocrine, à l’angle postéroventral du côté du mésosoma, au-dessus de la métacoxa et sous le spiracle propodéal. Simple pore, ou protégé par des expansions de cuticule ou des soies.', synonyms: [], variants: ['orifice métapleural'] },
  { id: 'bulle-metapleurale', name: 'Bulle de la glande métapleurale', definition: 'Renflement du métapleure qui contient la glande métapleurale, souvent plus visible que son orifice, en forme de cloque.', synonyms: [], variants: ['bulle métapleurale'] },
  { id: 'lobe-propodeal', name: 'Lobe propodéal', definition: 'Chacun des deux lobes à la base de la déclivité propodéale, de part et d’autre de l’articulation avec le pétiole. Ils appartiennent au propodéum et non au métapleure : le nom de lobe métapleural est à éviter.', synonyms: ['lobe métapleural', 'lame propodéale inférieure'], variants: ['lobes propodéaux'] },
  { id: 'declivite-propodeale', name: 'Déclivité propodéale', definition: 'Face postérieure en pente du propodéum, au-dessus de l’articulation avec le pétiole.', synonyms: ['face déclive'], variants: ['déclivité'] },
  { id: 'epines-propodeales', name: 'Épines propodéales', definition: 'Paire de dents ou d’épines qui termine souvent le dessus du propodéum vers l’arrière.', synonyms: [], variants: ['épine propodéale', 'dents propodéales'] },
  { id: 'processus-metasternal', name: 'Processus métasternal', definition: 'Projection paire de cuticule sous l’arrière du mésosoma, de part et d’autre de la ligne médiane, devant la cavité où s’articule le pétiole.', synonyms: [] },
  { id: 'fossette-endophragmale', name: 'Fossette endophragmale', definition: 'Fossette de la paroi latérale du mésosoma qui marque l’attache d’une partie du squelette interne.', synonyms: [] },
  { id: 'angles-humeraux', name: 'Angles huméraux', definition: 'Angles antérolatéraux du dessus du pronotum.', synonyms: [], variants: ['angle huméral'] },
  { id: 'abdomen', name: 'Abdomen', definition: 'Troisième tagme de l’insecte. Chez l’ouvrière, il compte sept segments visibles portant chacun un spiracle ; le premier, le propodéum, est soudé au thorax, les suivants forment la taille et le gastre.', synonyms: [] },
  { id: 'metasoma', name: 'Métasoma', definition: 'Segments abdominaux situés en arrière du mésosoma (II à VII) : la taille et le gastre. Bolton (1994) le jugeait peu utile chez les fourmis ; Keller (2011) l’adopte comme dans le reste des Hyménoptères et numérote les segments plutôt que de parler de gastre.', synonyms: [] },
  { id: 'gastre', name: 'Gastre', definition: 'Tagme terminal, élargi : segments abdominaux 3 à 7 quand la taille ne compte que le pétiole, 4 à 7 avec un postpétiole. On dit gastral plutôt que gastrique, réservé à l’intestin.', synonyms: [] },
  { id: 'taille', name: 'Taille', definition: 'Un ou deux segments abdominaux isolés entre le mésosoma et le gastre : le pétiole seul, ou le pétiole et le postpétiole. Pédicelle est un terme ancien à éviter, qui désigne un article de l’antenne chez les autres Hyménoptères.', synonyms: ['pédicelle'] },
  { id: 'postpetiole', name: 'Postpétiole', definition: 'Troisième segment abdominal, quand il est réduit et séparé à la fois du pétiole et du segment suivant, par exemple chez les Myrmicinae.', synonyms: [] },
  { id: 'helcium', name: 'Helcium', definition: 'Présclérites très réduits et spécialisés du troisième segment abdominal, qui forment une articulation complexe dans l’orifice postérieur du pétiole. Il est en général caché, en partie ou en totalité.', synonyms: [] },
  { id: 'pedoncule', name: 'Pédoncule', definition: 'Partie antérieure étroite du pétiole, entre l’articulation avec le propodéum et le nœud ou l’écaille. Un pétiole sans pédoncule est dit sessile.', synonyms: [], variants: ['pédoncule du pétiole'] },
  { id: 'processus-subpetiolaire', name: 'Processus subpétiolaire', definition: 'Projection antéroventrale du pétiole ou de son pédoncule, de forme très variable, parfois absente.', synonyms: [] },
  { id: 'presclerite', name: 'Présclérite', definition: 'Partie antérieure d’un sclérite abdominal, tergite ou sternite, recouverte par le segment précédent. Elle se reconnaît à sa sculpture fine et lisse, sans pilosité, parfois aussi à une crête ou un étranglement. On parle de prétergite et de présternite.', synonyms: [] },
  { id: 'acidopore', name: 'Acidopore', definition: 'Orifice par lequel les Formicinae projettent l’acide formique, propre à cette sous-famille. Formé par l’apex de l’hypopygium, il prend souvent la forme d’une courte buse bordée de soies.', synonyms: [] },
  { id: 'constriction', name: 'Étranglement annulaire', definition: 'Rétrécissement brusque qui fait le tour d’un segment abdominal, à la jonction entre présclérite et postsclérite. Par commodité, les clés le placent entre deux segments.', synonyms: ['constriction annulaire'] },
  { id: 'appareil-stridulatoire', name: 'Appareil stridulatoire', definition: 'Organe sonore : une râpe (plectre), sur le bord postérieur du troisième segment abdominal, frotte sur une aire finement striée (stridulitrum) à l’avant du quatrième.', synonyms: [] },
  { id: 'basitarse', name: 'Basitarse', definition: 'Premier article du tarse, articulé au tibia.', synonyms: [], variants: ['basitarses'] },
  { id: 'pretarse', name: 'Prétarse', definition: 'Dernier article du tarse, qui porte la paire de griffes.', synonyms: [] },
  { id: 'strigile', name: 'Strigile', definition: 'Appareil de nettoyage de l’antenne, sur la patte antérieure : l’éperon pectiné du tibia (calcar) et l’encoche garnie d’un peigne à la base du basitarse, entre lesquels passe l’antenne. Bolton (1994) donne ce nom à l’éperon seul.', synonyms: [] },
  { id: 'soie', name: 'Soie', definition: 'Poil épais inséré dans une alvéole à sa base. Soie et poil sont interchangeables, mais il faut les distinguer de la pubescence. Les clés citent souvent la présence ou la forme des soies sur une partie précise.', synonyms: ['poil', 'seta'], variants: ['soies', 'poils', 'setae'] },
  { id: 'pubescence', name: 'Pubescence', definition: 'Duvet de poils très fins et courts, distinct des soies. Bolton (1994) la définit comme des projections non insérées dans une alvéole.', synonyms: [] },
  { id: 'psammophore', name: 'Psammophore', definition: 'Corbeille de longues soies, souvent épaisses et courbées, sous la tête et les mandibules, qui sert à transporter le sable chez des fourmis des déserts.', synonyms: [] },
  { id: 'lobe-torulaire', name: 'Lobe torulaire', definition: 'Expansion en lobe de l’arc médian du torulus, qui peut couvrir l’acétabulum antennaire. Chez beaucoup de Ponerinae il est très développé, et souvent pris à tort pour le lobe frontal (Keller 2011).', synonyms: [], variants: ['lobes torulaires'] },
  { id: 'sillon-paraoculo-clypeal', name: 'Sillon paraoculo-clypéal', definition: 'Partie latérale du sillon épistomal, de chaque côté, de la fossette tentoriale antérieure jusqu’à l’articulation dorsale de la mandibule. Elle sépare la partie latérale du clypéus de la gena.', synonyms: [] },
  { id: 'ocelles', name: 'Ocelles', definition: 'Petits yeux simples sur le dessus de la tête, au nombre de trois. Toujours présents chez les mâles et les reines, ils manquent chez la plupart des ouvrières mais existent dans certains groupes, surtout chez les Formicinae.', synonyms: [], variants: ['ocelle'] },
  { id: 'arolium', name: 'Arolium', definition: 'Petite pelote adhésive membraneuse du prétarse, entre les griffes. Bien développée chez certaines fourmis, notamment arboricoles, elle est vestigiale ou absente chez d’autres.', synonyms: [], variants: ['arolia'] },
  { id: 'suture', name: 'Suture', definition: 'Ligne de jonction entre deux sclérites. Au sens strict (Keller 2011), sillon né de la soudure de deux sclérites autrefois distincts, par opposition à une articulation, qui reste mobile.', synonyms: [], variants: ['sutures'] },
  { id: 'sulcus', name: 'Sillon', definition: 'Rainure externe de la cuticule qui correspond à une crête interne. On le distingue d’une suture, qui sépare deux sclérites soudés, et d’une ligne, simple marque sans repli interne (Keller 2011).', synonyms: ['sulcus'], variants: ['sulci'] },
];

// Placement des termes sur les planches : régions dans l'ordre de REGIONS_FR, termes dans l'ordre de la légende.
// Un même terme peut figurer sur plusieurs planches (une fois par planche).
const LAYOUT: Record<RegionId, TermId[]> = {
  tete: ['tete', 'ommatidies', 'lobe', 'clypeus', 'mandibule'],
  antenne: ['scape', 'funicule'],
  mesosoma: ['pronotum', 'mesonotum', 'mesopleure', 'propodeum', 'spiracle'],
  petiole: ['petiole'],
  gastre: ['tergite', 'sternite', 'pygidium', 'hypopygium', 'aiguillon'],
  pattes: ['coxa', 'trochanter', 'femur', 'tibia', 'eperon', 'tarse', 'griffe'],
  cellules: [
    'pterostigma', 'costale', 'marginale', 'submarginale-1', 'submarginale-2', 'submarginale-3',
    'discoidale', 'subdiscoidale-1', 'subdiscoidale-2', 'basale', 'subbasale',
  ],
  nervures: [
    'costa', 'sous-costale', 'radius', '2r-rs', '3r-rs', 'secteur-radial', 'rs-plus-m', 'rs-2-3', 'rs-4-5', 'rs-m',
    'media-1', 'media-2', 'media-3', 'media-4', 'm-plus-cu', 'm-cu', 'cubitus-1', 'cubitus-2', 'cubitus-3', 'cu-a',
    'anale-1', 'anale-2',
  ],
};

/** Dictionnaire dans la langue demandée (les tests vérifient les deux langues). */
export function termsFor(lang: Lang): Term[] {
  return lang === 'fr' ? TERMS_FR : TERMS_FR.map((t) => ({ ...t, variants: undefined, ...TERMS_EN[t.id] }));
}

const plateOf = (region: RegionId) => REGIONS_FR.find((r) => r.id === region)!.plate;

/** Structures de toutes les planches dans la langue demandée, dans l'ordre des planches et de leurs légendes. */
export function partsFor(lang: Lang): Part[] {
  const byId = Object.fromEntries(termsFor(lang).map((t) => [t.id, t])) as Record<TermId, Term>;
  return REGIONS_FR.flatMap((r) => LAYOUT[r.id].map((id) => ({ ...byId[id], region: r.id, plate: plateOf(r.id) })));
}

export const PLATES: Plate[] = LANG === 'fr' ? PLATES_FR : PLATES_FR.map((p) => ({ ...p, ...PLATES_EN[p.id] }));

export const REGIONS: Region[] = LANG === 'fr' ? REGIONS_FR : REGIONS_FR.map((r) => ({ ...r, label: REGIONS_EN[r.id] }));

export const TERMS: Term[] = termsFor(LANG);

export const TERM_BY_ID = Object.fromEntries(TERMS.map((t) => [t.id, t])) as Record<TermId, Term>;

/** Une entrée par terme et par planche où il figure. */
export const PARTS: Part[] = partsFor(LANG);

export const PLATE_BY_ID = Object.fromEntries(PLATES.map((p) => [p.id, p])) as Record<PlateId, Plate>;

export const REGION_BY_ID = Object.fromEntries(REGIONS.map((r) => [r.id, r])) as Record<RegionId, Region>;

const PART_BY_PLATE = Object.fromEntries(
  PLATES.map((pl) => [pl.id, Object.fromEntries(PARTS.filter((p) => p.plate === pl.id).map((p) => [p.id, p]))]),
) as Record<PlateId, Record<PartId, Part>>;

/** Structure `id` de la planche `plate`. */
export function partIn(plate: PlateId, id: PartId): Part {
  return PART_BY_PLATE[plate][id];
}

export function partsInRegions(regions: readonly RegionId[]): Part[] {
  return PARTS.filter((p) => regions.includes(p.region));
}

export function regionsOf(plate: PlateId): Region[] {
  return REGIONS.filter((r) => r.plate === plate);
}

export function partsOf(plate: PlateId): Part[] {
  return PARTS.filter((p) => p.plate === plate);
}

/** Placements d'un terme : une structure par planche où il figure. */
export function placementsOf(id: TermId): Part[] {
  return PARTS.filter((p) => p.id === id);
}
