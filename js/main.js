/* ============================================
   MAIN — Point d'entrée
   ============================================ */

import { siteConfig } from './config.js';
import { initNavigation } from './components/navigation.js';
import { initHero } from './sections/hero.js';

const init = () => {
    document.title = siteConfig.nameWithHeart;

    initNavigation();
    initHero();

    // Année dans le footer
    const yearEl = document.getElementById('footerYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    console.info(`♥ ${siteConfig.nameWithHeart} — initialisé`);
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
