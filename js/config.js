/* ============================================
   CONFIG — Paramètres généraux du site
   Modifie ces valeurs sans toucher au reste.
   ============================================ */

export const siteConfig = {
    name: 'Toi & Moi',
    nameWithHeart: 'Toi & Moi ♥',
    tagline: 'Un endroit créé juste pour toi.',

    // Musique — activée par défaut ? (sera branché à l'étape 8)
    music: {
        enabledByDefault: false,
        volume: 0.4,
        track: 'assets/audio/theme.mp3'
    },

    // Particules & feux d'artifice (étapes 3 & 4)
    effects: {
        particlesEnabled: true,
        fireworksEnabled: true
    }
};
