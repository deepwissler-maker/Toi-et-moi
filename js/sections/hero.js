/* ============================================
   HERO
   Gère le bouton "Entrer" (pour l'instant : scroll doux).
   Les feux d'artifice viendront à l'étape 4.
   ============================================ */

import { $, on } from '../utils/dom.js';

export const initHero = () => {
    const enterBtn = $('#enterBtn');
    if (!enterBtn) return;

    on(enterBtn, 'click', () => {
        // Étape 4 : déclenchera les feux d'artifice ici.
        // Pour l'instant : scroll doux vers la section suivante.
        const nextSection = $('#timeline');
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
};
