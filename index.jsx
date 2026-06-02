import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/App';
import {
    CHRISTMAS_DAILY_GIFT_ID,
    CHRISTMAS_MISSION_IDS,
    CHRISTMAS_TOURNAMENT_ID,
} from './src/config/christmas.js';

const root = ReactDOM.createRoot(document.getElementById('root'));

const SMARTICO_SCRIPT_URL = 'https://libs.smartico.ai/smartico.js';

const env = import.meta.env ?? {};
const smarticoProjectKey = String(env.VITE_SMARTICO_PROJECT_KEY ?? '').trim();
const smarticoBrandKey = String(env.VITE_SMARTICO_BRAND_KEY ?? '').trim();
const smarticoPublicUserId = String(env.VITE_SMARTICO_PUBLIC_USER_ID ?? 'public-demo').trim();
const smarticoPublicUserHash = String(env.VITE_SMARTICO_PUBLIC_USER_HASH ?? '').trim();
const smarticoConfigured = Boolean(smarticoProjectKey && smarticoBrandKey);

const setDeepLinks = () => {
    const set = (id, href) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.setAttribute('href', href);
    };

    const tournamentsId = Number(CHRISTMAS_TOURNAMENT_ID) || 0;
    const mission1 = Number(CHRISTMAS_MISSION_IDS?.[0]) || 0;
    const mission2 = Number(CHRISTMAS_MISSION_IDS?.[1]) || 0;
    const dailyGiftId = Number(CHRISTMAS_DAILY_GIFT_ID) || 0;

    set('dl-tournaments', `dp:gf_tournaments&id=${tournamentsId}`);
    set('dl-missions', `dp:gf_missions&id=${mission1}`);
    set('dl-missions-2', `dp:gf_missions&id=${mission2}`);
    set('dl-daily-gift', `dp:gf_section&id=${dailyGiftId}`);
};

const loadSmarticoScript = () =>
    new Promise((resolve, reject) => {
        if (window._smartico) {
            resolve();
            return;
        }

        const existing = document.querySelector(`script[src="${SMARTICO_SCRIPT_URL}"]`);
        if (existing) {
            existing.addEventListener('load', () => resolve(), { once: true });
            existing.addEventListener('error', () => reject(new Error('Smartico script failed to load')), {
                once: true,
            });
            return;
        }

        const script = document.createElement('script');
        script.async = true;
        script.src = SMARTICO_SCRIPT_URL;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Smartico script failed to load'));
        document.head.appendChild(script);
    });

const initSmarticoIfConfigured = async () => {
    if (!smarticoConfigured) return;

    if (window.location.hostname === 'localhost') {
        window._smartico_allow_localhost = true;
    }

    if (smarticoPublicUserId) {
        window._smartico_user_id = smarticoPublicUserId;
    }
    if (smarticoPublicUserHash) {
        window._smartico_user_hash = smarticoPublicUserHash;
    }

    await loadSmarticoScript();
    if (typeof window._smartico?.init === 'function') {
        window._smartico.init(smarticoProjectKey, { brand_key: smarticoBrandKey });
    }
};

setDeepLinks();
root.render(<App smarticoConfigured={smarticoConfigured} />);

initSmarticoIfConfigured().catch(() => {});
