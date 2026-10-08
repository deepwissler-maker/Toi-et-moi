/* ============================================
   NAVIGATION
   Affiche / masque la barre selon le scroll.
   ============================================ */

import { $, on } from '../utils/dom.js';

const SCROLL_THRESHOLD = 100; // px avant d'afficher la nav

export const initNavigation = () => {
    const nav = $('#nav');
    if (!nav) return;

    const updateNavVisibility = () => {
        const shouldShow = window.scrollY > SCROLL_THRESHOLD;
        nav.classList.toggle('is-visible', shouldShow);
    };

    on(window, 'scroll', updateNavVisibility, { passive: true });
    updateNavVisibility(); // état initial
};
