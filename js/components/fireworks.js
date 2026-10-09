/* ============================================
   FIREWORKS — Feux d'artifice romantiques
   Canvas dédié, palette du site, léger et fluide.
   ============================================ */

import { prefersReducedMotion } from '../utils/dom.js';

/* ---------- Palette (alignée sur le site) ---------- */
const PALETTE = [
    { r: 232, g: 180, b: 160 },  // rose poudré (--color-accent)
    { r: 244, g: 228, b: 193 },  // ivoire doré (--color-gold)
    { r: 180, g: 200, b: 235 },  // bleu très clair
    { r: 245, g: 200, b: 210 }   // rose plus doux
];

/* ---------- Réglages ---------- */
const SETTINGS = {
    gravity: 0.045,
    friction: 0.985,
    rocketSpeedMin: 9,
    rocketSpeedMax: 13,
    rocketTrailLength: 4,
    sparkCountMin: 40,
    sparkCountMax: 70,
    sparkSpeedMin: 1.5,
    sparkSpeedMax: 5.5,
    sparkLifeMin: 40,
    sparkLifeMax: 90,
    sparkFade: 0.985,
    explosionDelayMin: 400,
    explosionDelayMax: 900
};

/* ---------- Intensités ---------- */
const INTENSITIES = {
    medium: { count: 3, spreadMs: 900 },
    high:   { count: 5, spreadMs: 1400 }
};

/* ---------- Helpers ---------- */
const rand = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/* ---------- État interne ---------- */
let canvas = null;
let ctx = null;
let animationId = null;
let rockets = [];
let sparks = [];

/* ---------- Fabrication d'une fusée ---------- */
const createRocket = (targetX, targetY) => {
    const startX = targetX + rand(-40, 40);
    const startY = canvas.clientHeight + 10;
    const dx = targetX - startX;
    const dy = targetY - startY;
    const distance = Math.hypot(dx, dy);
    const speed = rand(SETTINGS.rocketSpeedMin, SETTINGS.rocketSpeedMax);
    const steps = distance / speed;

    return {
        x: startX,
        y: startY,
        vx: dx / steps,
        vy: dy / steps,
        targetY,
        trail: [],
        color: pick(PALETTE),
        exploded: false
    };
};

/* ---------- Explosion d'une fusée ---------- */
const explode = (rocket) => {
    const count = randInt(SETTINGS.sparkCountMin, SETTINGS.sparkCountMax);
    const baseHue = rocket.color;

    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + rand(-0.15, 0.15);
        const speed = rand(SETTINGS.sparkSpeedMin, SETTINGS.sparkSpeedMax);
        const life = randInt(SETTINGS.sparkLifeMin, SETTINGS.sparkLifeMax);

        // Variation légère de la couleur autour de la teinte de base
        const variation = randInt(-15, 15);

        sparks.push({
            x: rocket.x,
            y: rocket.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life,
            maxLife: life,
            color: {
                r: Math.max(0, Math.min(255, baseHue.r + variation)),
                g: Math.max(0, Math.min(255, baseHue.g + variation)),
                b: Math.max(0, Math.min(255, baseHue.b + variation))
            }
        });
    }
};

/* ---------- Dimensionnement du canvas ---------- */
const resize = () => {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
};

/* ---------- Dessin d'une fusée ---------- */
const drawRocket = (rocket) => {
    // Traînée
    ctx.beginPath();
    for (let i = 0; i < rocket.trail.length; i++) {
        const point = rocket.trail[i];
        const alpha = (i / rocket.trail.length) * 0.8;
        ctx.fillStyle = `rgba(${rocket.color.r}, ${rocket.color.g}, ${rocket.color.b}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
    }

    // Tête
    ctx.beginPath();
    ctx.arc(rocket.x, rocket.y, 2.2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${rocket.color.r}, ${rocket.color.g}, ${rocket.color.b}, 1)`;
    ctx.fill();
};

/* ---------- Dessin d'une étincelle ---------- */
const drawSpark = (spark) => {
    const alpha = spark.life / spark.maxLife;
    ctx.beginPath();
    ctx.arc(spark.x, spark.y, 1.8 * alpha + 0.4, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${spark.color.r}, ${spark.color.g}, ${spark.color.b}, ${alpha})`;
    ctx.fill();
};

/* ---------- Boucle d'animation ---------- */
const frame = () => {
    const { width, height } = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, width, height);

    /* --- Fusées --- */
    for (let i = rockets.length - 1; i >= 0; i--) {
        const rocket = rockets[i];

        rocket.trail.push({ x: rocket.x, y: rocket.y });
        if (rocket.trail.length > SETTINGS.rocketTrailLength) {
            rocket.trail.shift();
        }

        rocket.x += rocket.vx;
        rocket.y += rocket.vy;
        rocket.vy += SETTINGS.gravity * 0.4;

        drawRocket(rocket);

        // Explosion quand la fusée atteint sa cible
        if (!rocket.exploded && rocket.y <= rocket.targetY) {
            rocket.exploded = true;
            explode(rocket);
            rockets.splice(i, 1);
        }
    }

    /* --- Étincelles --- */
    for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i];

        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.vx *= SETTINGS.friction;
        spark.vy *= SETTINGS.friction;
        spark.vy += SETTINGS.gravity;
        spark.life -= 1;

        drawSpark(spark);

        if (spark.life <= 0) {
            sparks.splice(i, 1);
        }
    }

    // Si plus rien à afficher, on arrête la boucle (économie CPU)
    if (rockets.length === 0 && sparks.length === 0) {
        animationId = null;
        ctx.clearRect(0, 0, width, height);
        return;
    }

    animationId = requestAnimationFrame(frame);
};

/* ---------- Start ---------- */
const start = () => {
    if (animationId !== null) return;
    animationId = requestAnimationFrame(frame);
};

/* ---------- Lancer un feu d'artifice ---------- */
export const launchFireworks = ({ intensity = 'medium' } = {}) => {
    if (!canvas) return;

    const { width, height } = canvas.getBoundingClientRect();
    const config = INTENSITIES[intensity] || INTENSITIES.medium;

    for (let i = 0; i < config.count; i++) {
        const delay = rand(0, config.spreadMs);
        const targetX = rand(width * 0.15, width * 0.85);
        const targetY = rand(height * 0.15, height * 0.45);

        setTimeout(() => {
            rockets.push(createRocket(targetX, targetY));
            start();
        }, delay);
    }
};

/* ---------- Init ---------- */
export const initFireworks = () => {
    canvas = document.getElementById('fireworksCanvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d');
    resize();

    let resizeTimeout = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resize, 150);
    });

    // Si l'utilisateur préfère réduire les animations,
    // on remplace par un flash doux sur le hero.
    if (prefersReducedMotion()) {
        const hero = document.getElementById('hero');
        if (hero) {
            hero.addEventListener('click', (e) => {
                if (e.target.id !== 'enterBtn') return;
                hero.animate(
                    [
                        { filter: 'brightness(1)' },
                        { filter: 'brightness(1.15)' },
                        { filter: 'brightness(1)' }
                    ],
                    { duration: 800, easing: 'ease-out' }
                );
            });
        }
    }
};
