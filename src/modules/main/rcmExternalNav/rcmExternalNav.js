/**
 * Palette URL for the Content AI Studio iframe / embed.
 * Set {@link CONTENT_AI_STUDIO_PALETTE_PROJECT_PATH} to match Palette’s address bar when your target project is open
 * (everything after the host/port, starting with `/projects/`).
 * Empty EXTERNAL_URL = documentation-only mode (no iframe); Collections nav still opens the shell page.
 */
export const CONTENT_AI_STUDIO_PALETTE_ORIGIN = 'http://localhost:3001';

/** E.g. `/projects/proj-pharma-email` — open the canvas in Palette and copy this segment from the URL. */
export const CONTENT_AI_STUDIO_PALETTE_PROJECT_PATH = '/projects/proj-pharma-email';

export const CONTENT_AI_STUDIO_EXTERNAL_URL =
    `${CONTENT_AI_STUDIO_PALETTE_ORIGIN}${CONTENT_AI_STUDIO_PALETTE_PROJECT_PATH}`;

/** LWR route for the studio shell (header, console nav, iframe + Save and exit). */
export const CONTENT_AI_STUDIO_SHELL_PATH = '/lightning/o/Content_AI_Studio__c/home';

/**
 * Absolute Collections home URL for return links from Palette (query param below).
 * Leave empty to use `window.location.origin + '/'` when navigating.
 */
export const COLLECTIONS_HOME_URL = '';

/** Query parameter Palette (or another shell) can read to offer a back link to Collections. */
export const RCM_RETURN_QUERY_PARAM = 'rcm_return';

/**
 * postMessage envelope when Palette is embedded in RCM — verified against the studio iframe window.
 * @see contentAiStudioPage — message listener
 */
export const RCM_PALETTE_POST_SOURCE = 'rcm-palette-bridge';

/** Ask RCM shell to leave Content AI Studio and open Collections. */
export const RCM_PALETTE_POST_SAVE_AND_EXIT = 'saveAndExit';

/**
 * @returns {string} Collections home URL (configured or current origin).
 */
export function getCollectionsHomeUrl() {
    const configured = (COLLECTIONS_HOME_URL || '').trim();
    if (configured) {
        return configured;
    }
    if (typeof window !== 'undefined' && window.location && window.location.origin) {
        return new URL('/', window.location.origin).href;
    }
    return '/';
}

/**
 * Appends `rcm_return` so external Palette can link back to Collections when desired.
 * @param {string} targetUrl
 * @returns {string}
 */
export function appendCollectionsReturnParam(targetUrl) {
    const ret = getCollectionsHomeUrl();
    try {
        const u = new URL(targetUrl);
        u.searchParams.set(RCM_RETURN_QUERY_PARAM, ret);
        return u.href;
    } catch {
        return targetUrl;
    }
}

/**
 * @returns {string} In-app path — always the RCM shell so chrome (Save and exit) stays visible.
 */
export function getContentAiStudioNavUrl() {
    return CONTENT_AI_STUDIO_SHELL_PATH;
}

/**
 * Full URL for embedding Palette (includes return hint for Palette UI).
 * @returns {string}
 */
export function getContentAiStudioEmbedUrl() {
    const base = (CONTENT_AI_STUDIO_EXTERNAL_URL || '').trim();
    if (!base || !/^https?:\/\//i.test(base)) {
        return base;
    }
    return appendCollectionsReturnParam(base);
}

/**
 * Navigate to Regulated Content Collections home (same tab, top window).
 */
export function navigateToCollectionsHome() {
    window.top.location.href = getCollectionsHomeUrl();
}

/**
 * Open Content AI Studio in the RCM shell (same browser tab; iframe loads Palette when EXTERNAL_URL is set).
 */
export function navigateToContentAiStudio() {
    const path = getContentAiStudioNavUrl();
    window.top.location.href = new URL(path, window.location.origin).href;
}
