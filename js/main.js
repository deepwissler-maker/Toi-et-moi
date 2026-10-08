/* ============================================
   MAIN — Point d'entrée
   Initialise les modules au chargement de la page.
   ============================================ */

import { siteConfig } from './config.js';

const init = () => {
    console.info(`♥ ${siteConfig.nameWithHeart} — initialisé`);
    document.title = siteConfig.nameWithHeart;

    // Les modules des étapes suivantes seront branchés ici :
    // initParticles();
    // initFireworks();
    // initNavigation();
    // initTimeline();
    // initLetters();
    // initCounter();
    // initMusic();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
