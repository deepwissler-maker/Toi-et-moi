/* ============================================
   MAIN — Point d'entrée
   ============================================ */

import { siteConfig } from './config.js';
import { initNavigation } from './components/navigation.js';
import { initParticles } from './components/particles.js';
import { initFireworks } from './components/fireworks.js';
import { initHero } from './sections/hero.js';

const init = () => {
    document.title = siteConfig.nameWithHeart;

    initNavigation();
    initParticles();
    initFireworks();
    initHero();

    // Bouton ✨ du footer : relance un feu d'artifice
    const sparkleBtn = document.getElementById('sparkleBtn');
    if (sparkleBtn) {
        sparkleBtn.addEventListener('click', async () => {
            const { launchFireworks } = await import('./components/fireworks.js');
            launchFireworks({ intensity: 'high' });
        });
    }

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
