import type { PartId, PlateId, RegionId } from './parts';

interface PartText {
  name: string;
  definition: string;
  synonyms: string[];
}

// Traduction anglaise de parts.ts. Les Record imposent une entrée par id : le typecheck échoue s'il en manque une.

export const PLATES_EN: Record<PlateId, { subject: string; example: string }> = {
  ouvriere: { subject: 'Worker', example: 'mandible' },
  aile: { subject: 'Queen wing', example: 'costal cell' },
};

export const REGIONS_EN: Record<RegionId, string> = {
  tete: 'Head',
  antenne: 'Antenna',
  mesosoma: 'Mesosoma',
  petiole: 'Petiole',
  gastre: 'Gaster',
  pattes: 'Legs',
  cellules: 'Cells',
  nervures: 'Veins',
};

export const PARTS_EN: Record<PartId, PartText> = {
  tete: { name: 'Head', definition: 'Head capsule bearing the eyes, the antennae and the mouthparts.', synonyms: ['head capsule', 'cephalic capsule'] },
  ommatidies: { name: 'Ommatidia', definition: 'Optical units shaped like hexagonal facets which, together, make up the compound eye.', synonyms: ['ommatidium', 'facets', 'facet'] },
  lobe: { name: 'Frontal lobe', definition: 'Plate of the head capsule, extended by the frontal carina, that borders and shields the antennal socket (torulus).', synonyms: ['frontal lobes', 'frontal carina', 'frontal carinae', 'torulus'] },
  clypeus: { name: 'Clypeus', definition: 'Front plate of the head, just above the mandibles.', synonyms: [] },
  mandibule: { name: 'Mandibles', definition: 'Paired mouthparts used to grasp, cut and carry.', synonyms: ['mandible', 'jaws', 'jaw'] },
  scape: { name: 'Scapes', definition: 'First segment of the antenna, long, jointed to the head.', synonyms: [] },
  funicule: { name: 'Funiculi', definition: 'All the antennal segments beyond the scape.', synonyms: ['funiculus', 'funicle', 'funicles', 'flagellum'] },
  pronotum: { name: 'Pronotum', definition: 'Dorsal plate of the first thoracic segment.', synonyms: [] },
  mesonotum: { name: 'Mesonotum', definition: 'Dorsal plate of the second thoracic segment.', synonyms: [] },
  mesopleure: { name: 'Mesopleuron', definition: 'Side plate of the second thoracic segment, above the middle coxa.', synonyms: ['mesopleura', 'pleuron'] },
  propodeum: { name: 'Propodeum', definition: 'First abdominal segment, fused to the thorax.', synonyms: ['epinotum'] },
  spiracle: { name: 'Propodeal spiracle', definition: 'Breathing opening on the side of the propodeum.', synonyms: ['spiracle', 'stigma'] },
  petiole: { name: 'Petiole', definition: 'Narrow, node-shaped segment linking the mesosoma to the gaster.', synonyms: ['petiolar node', 'node'] },
  tergite: { name: 'Tergites', definition: 'Dorsal plates of the gastral segments.', synonyms: ['tergum', 'terga'] },
  sternite: { name: 'Sternites', definition: 'Ventral plates of the gastral segments.', synonyms: ['sternum', 'sterna'] },
  pygidium: { name: 'Pygidium', definition: 'Last visible tergite, at the tip of the gaster.', synonyms: [] },
  aiguillon: { name: 'Sting', definition: 'Venomous stinger at the tip of the gaster.', synonyms: ['stinger', 'aculeus'] },
  coxa: { name: 'Coxae', definition: 'First segment of the leg, jointed to the mesosoma.', synonyms: ['coxa', 'coxas'] },
  femur: { name: 'Femora', definition: 'The stoutest segment of the leg.', synonyms: ['femur', 'femurs'] },
  tibia: { name: 'Tibiae', definition: 'Long segment between the femur and the tarsus.', synonyms: ['tibia', 'tibias'] },
  eperon: { name: 'Tibial spurs', definition: 'Articulated spine at the tip of the tibia.', synonyms: ['tibial spur', 'spur', 'spurs', 'calcar', 'calcars'] },
  tarse: { name: 'Tarsi', definition: 'End of the leg, made of five segments.', synonyms: ['tarsus', 'tarsomeres', 'tarsomere'] },
  griffe: { name: 'Tarsal claws', definition: 'Hook at the end of the last tarsal segment.', synonyms: ['tarsal claw', 'claw', 'claws', 'pretarsal claws'] },

  pterostigma: { name: 'Pterostigma', definition: 'Sclerotized, pigmented thickening of the leading edge of the forewing, at the end of the costal cell.', synonyms: ['stigma'] },
  costale: { name: 'Costal cell', definition: 'Narrow cell running along the leading edge of the wing, from the base to the pterostigma.', synonyms: ['costal'] },
  marginale: { name: 'Marginal cell', definition: 'Elongate cell running along the leading edge beyond the pterostigma, towards the apex. Also called the radial cell.', synonyms: ['marginal', 'radial cell', 'radial'] },
  'submarginale-1': { name: 'Submarginal cell 1', definition: 'Submarginal cell closest to the base, below the pterostigma. The number of submarginal cells varies between genera and is used for identification.', synonyms: ['submarginal 1', 'first submarginal cell', 'first submarginal', '1st submarginal cell', '1st submarginal'] },
  'submarginale-2': { name: 'Submarginal cell 2', definition: 'Second submarginal cell, below the marginal cell.', synonyms: ['submarginal 2', 'second submarginal cell', 'second submarginal', '2nd submarginal cell', '2nd submarginal'] },
  'submarginale-3': { name: 'Submarginal cell 3', definition: 'Submarginal cell closest to the apex, below the radial vein.', synonyms: ['submarginal 3', 'third submarginal cell', 'third submarginal', '3rd submarginal cell', '3rd submarginal'] },
  discoidale: { name: 'Discoidal cell', definition: 'Closed cell in the middle of the wing, below the first submarginal cell.', synonyms: ['discoidal', 'discal cell'] },
  'subdiscoidale-1': { name: 'Subdiscoidal cell 1', definition: 'Cell below the discoidal cell, towards the trailing edge of the wing.', synonyms: ['subdiscoidal 1', 'first subdiscoidal cell', 'first subdiscoidal', '1st subdiscoidal cell', '1st subdiscoidal'] },
  'subdiscoidale-2': { name: 'Subdiscoidal cell 2', definition: 'Large open cell between the media and the trailing edge, on the apex side.', synonyms: ['subdiscoidal 2', 'second subdiscoidal cell', 'second subdiscoidal', '2nd subdiscoidal cell', '2nd subdiscoidal'] },
  basale: { name: 'Basal cell', definition: 'Cell at the base of the wing, below the costal cell.', synonyms: ['basal'] },
  subbasale: { name: 'Subbasal cell', definition: 'Narrow cell at the base of the wing, below the basal cell.', synonyms: ['subbasal', 'sub-basal cell', 'sub-basal'] },

  costa: { name: 'Costa', definition: 'Vein forming the leading edge of the wing, from the base to the pterostigma.', synonyms: ['costal vein'] },
  'sous-costale': { name: 'Subcosta', definition: 'Longitudinal vein starting at the base below the costa. In ants it is fused with the radius (Sc+R).', synonyms: ['subcostal vein', 'sc', 'sc+r'] },
  radius: { name: 'Radius', definition: 'Vein that reaches the pterostigma, then runs along the leading edge, bordering the marginal cell.', synonyms: ['radial vein', 'r1'] },
  '2r-rs': { name: 'Cross-vein 2r-rs', definition: 'Cross-vein linking the pterostigma to the radial sector and closing the marginal cell on the base side.', synonyms: ['2r-rs', '2r-rs cross-vein', 'crossvein 2r-rs', '2 radius-radial sector'] },
  '3r-rs': { name: 'Cross-vein 3r-rs', definition: 'Cross-vein at the apex of the marginal cell, closing it against the leading edge.', synonyms: ['3r-rs', '3r-rs cross-vein', 'crossvein 3r-rs', '3 radius-radial sector'] },
  'secteur-radial': { name: 'Radial sector', definition: 'Posterior branch of the radius: this short segment runs down to the media and fuses with it.', synonyms: ['rs'] },
  'rs-plus-m': { name: 'Radial sector + media', definition: 'Segment where the radial sector and the media are fused, along the upper edge of the discoidal cell.', synonyms: ['rs+m', 'rs + m', 'radial sector+media'] },
  'rs-2-3': { name: 'Radial sector 2+3', definition: 'Branch of the radial sector rising towards the pterostigma, between submarginal cells 1 and 2.', synonyms: ['rs2+3', 'rs 2+3', 'radial sector 2 3'] },
  'rs-4-5': { name: 'Radial sector 4+5', definition: 'Branch of the radial sector bordering the marginal cell from below, up to the apex.', synonyms: ['rs4+5', 'rs 4+5', 'radial sector 4-5', 'radial sector 4 5'] },
  'rs-m': { name: 'Cross-vein rs-m', definition: 'Cross-vein linking the radial sector to the media, between submarginal cells 2 and 3.', synonyms: ['rs-m', 'rs-m cross-vein', 'crossvein rs-m', 'radial sector-media'] },
  'media-1': { name: 'Media 1', definition: 'First segment of the media: it leaves the stem shared with the cubitus and rises to the radial sector, bordering the discoidal cell.', synonyms: ['m1', 'm 1'] },
  'media-2': { name: 'Media 2', definition: 'Segment of the media running along the discoidal cell, between the radial sector and cross-vein m-cu.', synonyms: ['m2', 'm 2'] },
  'media-3': { name: 'Media 3', definition: 'Segment of the media between cross-veins m-cu and rs-m, below submarginal cell 2.', synonyms: ['m3', 'm 3'] },
  'media-4': { name: 'Media 4', definition: 'Last segment of the media, from cross-vein rs-m towards the wing apex.', synonyms: ['m4', 'm 4'] },
  'm-plus-cu': { name: 'Media + cubitus', definition: 'Shared stem of the media and the cubitus, from the wing base to where they part.', synonyms: ['m+cu', 'm + cu', 'media+cubitus'] },
  'm-cu': { name: 'Cross-vein m-cu', definition: 'Cross-vein linking the media to the cubitus, on the side of the discoidal cell.', synonyms: ['m-cu', 'm-cu cross-vein', 'crossvein m-cu', 'media-cubitus'] },
  'cubitus-1': { name: 'Cubitus 1', definition: 'First segment of the cubitus, bordering the discoidal cell from below.', synonyms: ['cu1', 'cu 1'] },
  'cubitus-2': { name: 'Cubitus 2', definition: 'Segment of the cubitus running obliquely towards the trailing edge, beyond cross-vein m-cu.', synonyms: ['cu2', 'cu 2'] },
  'cubitus-3': { name: 'Cubitus 3', definition: 'Last segment of the cubitus, heading for the apex near the trailing edge.', synonyms: ['cu3', 'cu 3'] },
  'cu-a': { name: 'Cross-vein cu-a', definition: 'Cross-vein linking the media + cubitus stem to the anal vein, near the base.', synonyms: ['cu-a', 'cu-a cross-vein', 'crossvein cu-a', 'cubitus-anal'] },
  'anale-1': { name: 'Anal 1', definition: 'Anal vein, near the trailing edge, from the base to cross-vein cu-a.', synonyms: ['a1', 'anal', 'anal vein', 'anal vein 1'] },
  'anale-2': { name: 'Anal 2', definition: 'Continuation of the anal vein beyond cross-vein cu-a, towards the apex.', synonyms: ['a2', 'anal vein 2'] },
};
