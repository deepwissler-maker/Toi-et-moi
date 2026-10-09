/* ============================================
   HERO
   Gère le bouton "Entrer" :
   - déclenche les feux d'artifice
   - scrolle doucement vers la section suivante
   ============================================ */

import { $, on } from '../utils/dom.js';
import { launchFireworks } from '../components/fireworks.js';

export const initHero = () => {
    const enterBtn = $('#enterBtn');
    if (!enterBtn) return;

    let hasEntered = false;

    on(enterBtn, 'click', () => {
        // Feux d'artifice (moyens : 3 fusées)
        launchFireworks({ intensity: 'medium' });

        // On ne scrolle qu'une fois, et après un léger délai
        // pour laisser le temps d'admirer les feux.
        if (!hasEntered) {
            hasEntered = true;

            setTimeout(() => {
                const nextSection = $('#timeline');
                if (nextSection) {
                    nextSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 2200);
        }
    });
};
