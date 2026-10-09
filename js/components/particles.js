/* ============================================
   PARTICLES — Ciel étoilé + poussières lumineuses
   Canvas unique, léger, respecte prefers-reduced-motion.
   ============================================ */

import { prefersReducedMotion } from '../utils/dom.js';

/* ---------- Réglages ---------- */
const CONFIG = {
    starCount: 90,
    dustCount: 25,
    starMinRadius: 0.4,
    starMaxRadius: 1.4,
    dustMinRadius: 0.6,
    dustMaxRadius: 1.8,
    dustSpeedMin: 0.08,
    dustSpeedMax: 0.25,
    starTwinkleSpeed: 0.015
};

const STAR_COLOR = '244, 228, 193';
const DUST_COLOR = '232, 180, 160';

const rand = (min, max) => Math.random() * (max - min) + min;

const createStar = (width, height) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: rand(CONFIG.starMinRadius, CONFIG.starMaxRadius),
    baseAlpha: rand(0.3, 0.9),
    alpha: 0,
    twinklePhase: Math.random() * Math.PI * 2
});

const createDust = (width, height) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: rand(CONFIG.dustMinRadius, CONFIG.dustMaxRadius),
    speed: rand(CONFIG.dustSpeedMin, CONFIG.dustSpeedMax),
    alpha: rand(0.15, 0.5),
    drift: rand(-0.08, 0.08)
});

export const initParticles = () => {
    const canvas = document.getElementById('skyCanvas');
    if (!canvas) return;

    const reducedMotion = prefersReducedMotion();
    const ctx = canvas.getContext('2d');
    let stars = [];
    let dust = [];
    let animationId = null;

    const resize = () => {
        const dpr = window.devicePixelRatio || 1;
        const { width, height } = canvas.getBoundingClientRect();

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        stars = Array.from({ length: CONFIG.starCount }, () =>
            createStar(width, height)
        );
        dust = Array.from({ length: CONFIG.dustCount }, () =>
            createDust(width, height)
        );
    };

    const drawStar = (star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${STAR_COLOR}, ${star.alpha})`;
        ctx.fill();
    };

    const drawDust = (particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${DUST_COLOR}, ${particle.alpha})`;
        ctx.fill();
    };

    const frame = () => {
        const { width, height } = canvas.getBoundingClientRect();
        ctx.clearRect(0, 0, width, height);

        for (const star of stars) {
            star.twinklePhase += CONFIG.starTwinkleSpeed;
            star.alpha = star.baseAlpha * (0.6 + 0.4 * Math.sin(star.twinklePhase));
            drawStar(star);
        }

        for (const particle of dust) {
            particle.y -= particle.speed;
            particle.x += particle.drift;

            if (particle.y < -10) {
                particle.y = height + 10;
                particle.x = Math.random() * width;
            }
            if (particle.x < -10) particle.x = width + 10;
            if (particle.x > width + 10) particle.x = -10;

            drawDust(particle);
        }

        animationId = requestAnimationFrame(frame);
    };

    const start = () => {
        if (animationId !== null) return;
        animationId = requestAnimationFrame(frame);
    };

    const stop = () => {
        if (animationId === null) return;
        cancelAnimationFrame(animationId);
        animationId = null;
    };

    resize();

    if (reducedMotion) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const star of stars) {
            star.alpha = star.baseAlpha;
            drawStar(star);
        }
    } else {
        start();

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) stop();
            else start();
        });
    }

    let resizeTimeout = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            stop();
            resize();
            if (!reducedMotion) start();
            else {
                for (const star of stars) {
                    star.alpha = star.baseAlpha;
                    drawStar(star);
                }
            }
        }, 150);
    });
};
