export const MATH_CONTENT = {
  // Contenu pour le primaire
  cp: {
    maths: [
      { id: 'cp-nombres', title: 'Compter jusqu\'à 20', lesson: 'Apprendre à compter et reconnaître les nombres de 0 à 20.',
        quiz: [
          { id: 'q1', question: 'Combien y a-t-il de pommes ? 🍎🍎🍎', options: ['2', '3', '4'], correctIndex: 1 },
          { id: 'q2', question: 'Quel est le nombre qui vient après 5 ?', options: ['4', '6', '7'], correctIndex: 1 }
        ]
      }
    ]
  },
  ce1: {
    maths: [
      { id: 'ce1-additions', title: 'Additions simples', lesson: 'Maîtriser les additions à un et deux chiffres.' }
    ]
  },
  ce2: {
    maths: [
      { id: 'ce2-multiplication', title: 'Tables de multiplication', lesson: 'Apprendre les tables de 2, 5 et 10.' }
    ]
  },
  cm1: {
    maths: [
      { 
        id: 'cm1-fractions', 
        title: 'Introduction aux fractions', 
        lesson: 'Comprendre ce qu\'est une fraction avec des exemples visuels.',
        hasGame: true,
        quiz: [
          { id: 'q1', question: 'Quelle fraction représente la moitié ?', options: ['1/2', '1/3', '1/4'], correctIndex: 0 },
          { id: 'q2', question: 'Combien de quarts dans un entier ?', options: ['2', '3', '4'], correctIndex: 2 }
        ]
      }
    ]
  },
  cm2: {
    maths: [
      { id: 'cm2-decimaux', title: 'Nombres décimaux', lesson: 'Découvrir et manipuler les nombres à virgule.' }
    ]
  },
  // Contenu pour le collège
  '6eme': {
    maths: [
      { 
        id: '6eme-entiers', 
        title: 'Nombres entiers et décimaux', 
        lesson: 'Révision et approfondissement des nombres entiers et décimaux.',
        quiz: [
          { id: 'q1', question: 'Quel est le nombre décimal 3,25 écrit en fraction ?', options: ['325/10', '325/100', '3/25'], correctIndex: 1 },
          { id: 'q2', question: 'Combien vaut 2,5 × 4 ?', options: ['10', '8,5', '6'], correctIndex: 0 }
        ]
      }
    ]
  },
  '5eme': {
    maths: [
      { id: '5eme-fractions', title: 'Fractions et opérations', lesson: 'Introduction aux fractions et premières opérations.' }
    ]
  },
  '4eme': {
    maths: [
      { id: '4eme-equations', title: 'Équations du premier degré', lesson: 'Résolution d\'équations simples à une inconnue.' }
    ]
  },
  '3eme': {
    maths: [
      // === GÉOMÉTRIE ===
      { 
        id: '3eme-pythagore', 
        title: '🔺 Théorème de Pythagore',
        lesson: 'Dans un triangle rectangle, le carré de l\'hypoténuse est égal à la somme des carrés des deux autres côtés. Formule : a² + b² = c² où c est l\'hypoténuse.',
        quiz: [
          { id: 'q1', question: 'Dans un triangle rectangle ABC, rectangle en C, si AB = 5 cm et AC = 3 cm, combien mesure BC ?', options: ['4 cm', '8 cm', '2 cm'], correctIndex: 0 },
          { id: 'q2', question: 'Le théorème de Pythagore s\'applique à quel type de triangle ?', options: ['Équilatéral', 'Rectangle', 'Isocèle'], correctIndex: 1 }
        ]
      },
      { 
        id: '3eme-thales', 
        title: '📏 Théorème de Thalès',
        lesson: 'Si deux droites sont parallèles, alors elles définissent sur deux sécantes des segments proportionnels. Les rapports de longueurs sont égaux.',
        quiz: [
          { id: 'q1', question: 'Si (MN) // (BC) dans le triangle ABC, alors...', options: ['AM/AB = AN/AC', 'AM = AN', 'MN = BC'], correctIndex: 0 },
          { id: 'q2', question: 'Le théorème de Thalès permet de calculer...', options: ['Des aires', 'Des longueurs', 'Des angles'], correctIndex: 1 }
        ]
      },
      { 
        id: '3eme-trigonometrie', 
        title: '📐 Trigonométrie',
        lesson: 'Relations trigonométriques dans le triangle rectangle : cos(angle) = adjacent/hypoténuse, sin(angle) = opposé/hypoténuse, tan(angle) = opposé/adjacent.',
        quiz: [
          { id: 'q1', question: 'Dans un triangle rectangle, cos(A) = ?', options: ['opposé/hypoténuse', 'adjacent/hypoténuse', 'opposé/adjacent'], correctIndex: 1 },
          { id: 'q2', question: 'sin(30°) = ?', options: ['1/2', '√3/2', '√2/2'], correctIndex: 0 }
        ]
      },
      { 
        id: '3eme-triangles-semblables', 
        title: '🔄 Triangles semblables',
        lesson: 'Deux triangles sont semblables si leurs angles sont égaux deux à deux. Les côtés homologues sont alors proportionnels.'
      },
      { 
        id: '3eme-homotheties', 
        title: '🔍 Homothéties',
        lesson: 'Une homothétie est une transformation qui agrandit ou réduit une figure en gardant les mêmes proportions. Le rapport d\'homothétie détermine la taille.'
      },
      
      // === ALGÈBRE ===
      { 
        id: '3eme-fractions', 
        title: '➗ Fractions',
        lesson: 'Opérations sur les fractions : addition (même dénominateur), soustraction, multiplication (numérateur × numérateur), division (multiplier par l\'inverse).',
        quiz: [
          { id: 'q1', question: '2/3 + 1/6 = ?', options: ['3/9', '5/6', '3/6'], correctIndex: 1 },
          { id: 'q2', question: '3/4 × 2/5 = ?', options: ['6/20', '5/9', '6/9'], correctIndex: 0 }
        ]
      },
      { 
        id: '3eme-puissances', 
        title: '⚡ Puissances',
        lesson: 'Notation scientifique, puissances de 10 et règles de calcul : a^m × a^n = a^(m+n), (a^m)^n = a^(m×n), a^m ÷ a^n = a^(m-n).',
        quiz: [
          { id: 'q1', question: '10³ × 10² = ?', options: ['10⁵', '10⁶', '10¹'], correctIndex: 0 },
          { id: 'q2', question: 'Comment écrit-on 0,0035 en notation scientifique ?', options: ['3,5 × 10⁻³', '35 × 10⁻⁴', '3,5 × 10⁻⁴'], correctIndex: 0 }
        ]
      },
      { 
        id: '3eme-developpement-factorisation', 
        title: '🧮 Développement et Factorisation',
        lesson: 'Développer : transformer un produit en somme. Factoriser : transformer une somme en produit. Identités remarquables : (a+b)² = a² + 2ab + b².',
        quiz: [
          { id: 'q1', question: 'Développer (x + 3)² = ?', options: ['x² + 9', 'x² + 6x + 9', 'x² + 3x + 9'], correctIndex: 1 },
          { id: 'q2', question: 'Factoriser x² - 9 = ?', options: ['(x - 3)²', '(x + 3)(x - 3)', '(x + 9)(x - 1)'], correctIndex: 1 }
        ]
      },
      { 
        id: '3eme-equations-inequations', 
        title: '⚖️ Équations et inéquations',
        lesson: 'Résolution d\'équations du premier degré (isoler x) et d\'inéquations (attention au sens lors de la division par un nombre négatif).',
        quiz: [
          { id: 'q1', question: 'La solution de 2x + 5 = 11 est...', options: ['x = 3', 'x = 8', 'x = 16'], correctIndex: 0 },
          { id: 'q2', question: 'Si 3x < 12, alors x...', options: ['x > 4', 'x < 4', 'x = 4'], correctIndex: 1 }
        ]
      },
      { 
        id: '3eme-fonctions', 
        title: '📈 Fonctions linéaires et affines',
        lesson: 'Fonction linéaire : f(x) = ax (droite passant par l\'origine). Fonction affine : f(x) = ax + b (a = coefficient directeur, b = ordonnée à l\'origine).',
        quiz: [
          { id: 'q1', question: 'Une fonction linéaire a pour forme...', options: ['f(x) = ax + b', 'f(x) = ax', 'f(x) = x²'], correctIndex: 1 },
          { id: 'q2', question: 'Si f(x) = 2x + 3, combien vaut f(1) ?', options: ['5', '3', '2'], correctIndex: 0 }
        ]
      },
      
      // === STATISTIQUES ET PROBABILITÉS ===
      { 
        id: '3eme-statistiques', 
        title: '📊 Statistiques',
        lesson: 'Moyenne = somme des valeurs ÷ effectif total. Médiane = valeur centrale. Quartiles = valeurs qui divisent en 4 parts égales.',
        quiz: [
          { id: 'q1', question: 'La médiane d\'une série de données est...', options: ['La valeur la plus fréquente', 'La valeur centrale', 'La somme divisée par l\'effectif'], correctIndex: 1 },
          { id: 'q2', question: 'Pour calculer la moyenne, on fait...', options: ['Somme ÷ effectif', 'Plus grande valeur ÷ 2', 'Valeur centrale'], correctIndex: 0 }
        ]
      },
      { 
        id: '3eme-probabilites', 
        title: '🎲 Probabilités',
        lesson: 'Probabilité = nombre de cas favorables ÷ nombre de cas possibles. La probabilité est toujours comprise entre 0 et 1.',
        quiz: [
          { id: 'q1', question: 'La probabilité d\'un événement certain est...', options: ['0', '1', '0,5'], correctIndex: 1 },
          { id: 'q2', question: 'En lançant un dé, quelle est la probabilité d\'obtenir un 6 ?', options: ['1/6', '1/2', '1/3'], correctIndex: 0 }
        ]
      },
      
      // === APPLICATIONS NUMÉRIQUES ===
      { 
        id: '3eme-ratios', 
        title: '⚖️ Ratios',
        lesson: 'Un ratio exprime le rapport entre deux grandeurs. Il se note a:b et se lit "a pour b". Les ratios permettent de comparer des proportions.'
      },
      { 
        id: '3eme-pourcentages', 
        title: '💯 Pourcentages',
        lesson: 'Pourcentage = (partie/tout) × 100. Augmentation de t% : multiplier par (1 + t/100). Diminution de t% : multiplier par (1 - t/100).',
        quiz: [
          { id: 'q1', question: '25% de 80 = ?', options: ['20', '25', '30'], correctIndex: 0 },
          { id: 'q2', question: 'Une augmentation de 20% correspond à multiplier par...', options: ['0,2', '1,2', '2'], correctIndex: 1 }
        ]
      },
      { 
        id: '3eme-vitesse', 
        title: '🏃 Vitesse (v = d/t)',
        lesson: 'Relation fondamentale : vitesse = distance ÷ temps. Donc distance = vitesse × temps et temps = distance ÷ vitesse. Attention aux unités !',
        quiz: [
          { id: 'q1', question: 'Si une voiture parcourt 150 km en 2 h, sa vitesse moyenne est...', options: ['75 km/h', '300 km/h', '152 km/h'], correctIndex: 0 },
          { id: 'q2', question: 'Pour calculer la distance, on utilise...', options: ['d = v × t', 'd = v ÷ t', 'd = t ÷ v'], correctIndex: 0 }
        ]
      }
    ]
  },
  // Contenu pour le lycée
  '2nde': {
    maths: [
      { id: '2nde-fonctions', title: 'Fonctions de référence', lesson: 'Étude des fonctions polynômes, racine carrée et valeur absolue.' },
      { 
        id: '2nde-vecteurs', 
        title: '🎯 Vecteurs',
        lesson: 'Les vecteurs représentent une direction et une intensité. Ils ont des propriétés d\'addition et de multiplication par un scalaire.',
        hasGame: true, // Nouveau: indique qu'il y a un jeu disponible
        quiz: [
          { id: 'q1', question: 'Un vecteur est caractérisé par...', options: ['Sa direction seulement', 'Sa direction et sa norme', 'Sa position seulement'], correctIndex: 1 },
          { id: 'q2', question: 'Comment additionne-t-on deux vecteurs ?', options: ['Bout à bout', 'En parallèle', 'En les croisant'], correctIndex: 0 }
        ]
      }
    ]
  },
  '1ere': {
    maths: [
      { 
        id: '1ere-derivation', 
        title: 'Dérivation', 
        lesson: 'Nombre dérivé, fonction dérivée et applications.',
        quiz: [
          { id: 'q1', question: 'La dérivée de 3x² est...', options: ['6x', '3x', 'x²'], correctIndex: 0 },
          { id: 'q2', question: 'La dérivée de e^x est...', options: ['x.e^x', 'e^x', '1'], correctIndex: 1 }
        ]
      }
    ]
  },
  'terminale': {
    maths: [
      { 
        id: 'terminale-limites', 
        title: 'Limites et continuité', 
        lesson: 'Calcul de limites et étude de la continuité.',
        quiz: [
          { id: 'q1', question: 'La limite de 1/x quand x tend vers +∞ est...', options: ['0', '+∞', '1'], correctIndex: 0 },
          { id: 'q2', question: 'Une fonction continue sur [a,b] vérifie...', options: ['Le théorème des valeurs intermédiaires', 'f(a) = f(b)', 'f\'(x) existe'], correctIndex: 0 }
        ]
      }
    ]
  }
};