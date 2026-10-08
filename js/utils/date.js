/* ============================================
   UTILS DATE — Calculs liés au temps
   ============================================ */

const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * Nombre de jours entiers écoulés depuis une date.
 * @param {string|Date} startDate
 * @returns {number}
 */
export const daysSince = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    return Math.floor((now - start) / MS_PER_DAY);
};

/**
 * Prochaine occurrence d'une date annuelle (mois/jour).
 * @param {string|Date} date
 * @returns {Date}
 */
export const nextAnniversary = (date) => {
    const original = new Date(date);
    const now = new Date();
    const next = new Date(now.getFullYear(), original.getMonth(), original.getDate());

    if (next < now) next.setFullYear(next.getFullYear() + 1);
    return next;
};

/**
 * Formate une date en français lisible.
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
    return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(new Date(date));
};
