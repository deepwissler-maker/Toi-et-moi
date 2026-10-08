/* ============================================
   UTILS DOM — Helpers réutilisables
   ============================================ */

export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

export const on = (element, event, handler, options = {}) => {
    element.addEventListener(event, handler, options);
    return () => element.removeEventListener(event, handler, options);
};

export const create = (tag, attributes = {}, children = []) => {
    const el = document.createElement(tag);

    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'class') el.className = value;
        else if (key === 'text') el.textContent = value;
        else if (key === 'html') el.innerHTML = value;
        else el.setAttribute(key, value);
    });

    children.forEach(child => {
        if (typeof child === 'string') el.appendChild(document.createTextNode(child));
        else if (child) el.appendChild(child);
    });

    return el;
};

export const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
