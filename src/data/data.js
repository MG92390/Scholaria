import { MATH_CONTENT } from './mathData.js';
import { PHYSICS_CONTENT } from './physicsData.js';
import { FRENCH_CONTENT } from './frenchData.js';

export const LEVELS = [
  { id: 'primaire', label: 'Primaire' },
  { id: 'college', label: 'Collège' },
  { id: 'lycee', label: 'Lycée' }
];

export const PRIMAIRE_SUBLEVELS = [
  { id: 'cp', label: 'CP' },
  { id: 'ce1', label: 'CE1' },
  { id: 'ce2', label: 'CE2' },
  { id: 'cm1', label: 'CM1' },
  { id: 'cm2', label: 'CM2' }
];

export const COLLEGE_SUBLEVELS = [
  { id: '6eme', label: '6ème' },
  { id: '5eme', label: '5ème' },
  { id: '4eme', label: '4ème' },
  { id: '3eme', label: '3ème' }
];

export const LYCEE_SUBLEVELS = [
  { id: '2nde', label: '2nde' },
  { id: '1ere', label: '1ère' },
  { id: 'terminale', label: 'Terminale' }
];

export const SUBJECTS_BY_LEVEL = {
  // Matières pour chaque niveau du primaire
  cp: [
    { id: 'francais', label: 'Français' },
    { id: 'maths', label: 'Mathématiques' },
    { id: 'eveil', label: 'Éveil' }
  ],
  ce1: [
    { id: 'francais', label: 'Français' },
    { id: 'maths', label: 'Mathématiques' },
    { id: 'sciences', label: 'Sciences' },
    { id: 'histoire', label: 'Histoire' }
  ],
  ce2: [
    { id: 'francais', label: 'Français' },
    { id: 'maths', label: 'Mathématiques' },
    { id: 'sciences', label: 'Sciences' },
    { id: 'histoire', label: 'Histoire' },
    { id: 'geographie', label: 'Géographie' }
  ],
  cm1: [
    { id: 'francais', label: 'Français' },
    { id: 'maths', label: 'Mathématiques' },
    { id: 'sciences', label: 'Sciences' },
    { id: 'histoire', label: 'Histoire' },
    { id: 'geographie', label: 'Géographie' }
  ],
  cm2: [
    { id: 'francais', label: 'Français' },
    { id: 'maths', label: 'Mathématiques' },
    { id: 'sciences', label: 'Sciences' },
    { id: 'histoire', label: 'Histoire' },
    { id: 'geographie', label: 'Géographie' }
  ],
  // Matières pour chaque niveau du collège
  '6eme': [
    { id: 'francais', label: 'Français' },
    { id: 'maths', label: 'Mathématiques' },
    { id: 'anglais', label: 'Anglais' },
    { id: 'svt', label: 'SVT' },
    { id: 'histoiregeo', label: 'Histoire-Géo' },
    { id: 'arts', label: 'Arts plastiques' }
  ],
  '5eme': [
    { id: 'francais', label: 'Français' },
    { id: 'maths', label: 'Mathématiques' },
    { id: 'anglais', label: 'Anglais' },
    { id: 'svt', label: 'SVT' },
    { id: 'physique', label: 'Physique-Chimie' },
    { id: 'histoiregeo', label: 'Histoire-Géo' },
    { id: 'technologie', label: 'Technologie' }
  ],
  '4eme': [
    { id: 'francais', label: 'Français' },
    { id: 'maths', label: 'Mathématiques' },
    { id: 'anglais', label: 'Anglais' },
    { id: 'svt', label: 'SVT' },
    { id: 'physique', label: 'Physique-Chimie' },
    { id: 'histoiregeo', label: 'Histoire-Géo' },
    { id: 'technologie', label: 'Technologie' }
  ],
  '3eme': [
    { id: 'francais', label: 'Français' },
    { id: 'maths', label: 'Mathématiques' },
    { id: 'anglais', label: 'Anglais' },
    { id: 'svt', label: 'SVT' },
    { id: 'physique', label: 'Physique-Chimie' },
    { id: 'histoiregeo', label: 'Histoire-Géo' },
    { id: 'technologie', label: 'Technologie' }
  ],
  // Matières pour chaque niveau du lycée
  '2nde': [
    { id: 'francais', label: 'Français' },
    { id: 'maths', label: 'Mathématiques' },
    { id: 'physique', label: 'Physique-Chimie' },
    { id: 'svt', label: 'SVT' },
    { id: 'histoiregeo', label: 'Histoire-Géo' },
    { id: 'anglais', label: 'Anglais' },
    { id: 'ses', label: 'SES' }
  ],
  '1ere': [
    { id: 'francais', label: 'Français' },
    { id: 'maths', label: 'Mathématiques' },
    { id: 'physique', label: 'Physique-Chimie' },
    { id: 'svt', label: 'SVT' },
    { id: 'histoiregeo', label: 'Histoire-Géo' },
    { id: 'anglais', label: 'Anglais' },
    { id: 'ses', label: 'SES' },
    { id: 'philosophie', label: 'Philosophie' }
  ],
  'terminale': [
    { id: 'maths', label: 'Mathématiques' },
    { id: 'physique', label: 'Physique-Chimie' },
    { id: 'svt', label: 'SVT' },
    { id: 'histoiregeo', label: 'Histoire-Géo' },
    { id: 'anglais', label: 'Anglais' },
    { id: 'ses', label: 'SES' },
    { id: 'philosophie', label: 'Philosophie' }
  ]
};

// Fonction pour combiner tous les contenus
function combineContent() {
  const combined = {};
  
  // Fusionner le contenu de mathématiques
  Object.keys(MATH_CONTENT).forEach(level => {
    if (!combined[level]) combined[level] = {};
    Object.keys(MATH_CONTENT[level]).forEach(subject => {
      combined[level][subject] = MATH_CONTENT[level][subject];
    });
  });
  
  // Fusionner le contenu de physique
  Object.keys(PHYSICS_CONTENT).forEach(level => {
    if (!combined[level]) combined[level] = {};
    Object.keys(PHYSICS_CONTENT[level]).forEach(subject => {
      combined[level][subject] = PHYSICS_CONTENT[level][subject];
    });
  });
  
  // Fusionner le contenu de français
  Object.keys(FRENCH_CONTENT).forEach(level => {
    if (!combined[level]) combined[level] = {};
    Object.keys(FRENCH_CONTENT[level]).forEach(subject => {
      combined[level][subject] = FRENCH_CONTENT[level][subject];
    });
  });
  
  return combined;
}

export const CONTENT = combineContent();
