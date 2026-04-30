import { LightningElement } from 'lwc';
import {
    CONTENT_AI_STUDIO_EXTERNAL_URL,
    RCM_PALETTE_POST_SAVE_AND_EXIT,
    RCM_PALETTE_POST_SOURCE,
    getContentAiStudioEmbedUrl,
    getContentAiStudioNavUrl,
    navigateToCollectionsHome,
    navigateToContentAiStudio
} from 'main/rcmExternalNav';

/** Iframe src when viewing this shell page — Palette URL plus optional `rcm_return` when external. */
const PALETTE_EMBED_URL = CONTENT_AI_STUDIO_EXTERNAL_URL || '';

export default class ContentAiStudioPage extends LightningElement {
    showMainTabDropdown = false;

    _boundPaletteMessage;

    /** Read-only display strings (avoid custom monospace that can render poorly in some browsers). */
    studioEmbedConstantName = 'CONTENT_AI_STUDIO_EXTERNAL_URL';
    studioEmbedSourceFile = 'src/modules/main/rcmExternalNav/rcmExternalNav.js';
    studioRouteLightning = '/lightning/o/Content_AI_Studio__c/home/';
    studioPaletteMapFile = 'src/modules/main/contentAiStudio/PALETTE_SOURCE_MAP.txt';

    get collectionTemplatesListUrl() {
        return '/lightning/o/Regulated_Collection_Template__c/list';
    }

    get contentAiStudioUrl() {
        return getContentAiStudioNavUrl();
    }

    get studioRoutePrimary() {
        return getContentAiStudioNavUrl();
    }

    get showPaletteEmbed() {
        return typeof PALETTE_EMBED_URL === 'string' && PALETTE_EMBED_URL.length > 0;
    }

    get paletteEmbedUrl() {
        if (!PALETTE_EMBED_URL) {
            return '';
        }
        return getContentAiStudioEmbedUrl();
    }

    connectedCallback() {
        this._boundPaletteMessage = this.handlePalettePostMessage.bind(this);
        window.addEventListener('message', this._boundPaletteMessage);
    }

    disconnectedCallback() {
        if (this._boundPaletteMessage) {
            window.removeEventListener('message', this._boundPaletteMessage);
        }
    }

    /**
     * Palette (embedded) requests exit — source must be the studio iframe for security.
     * @param {MessageEvent} event
     */
    handlePalettePostMessage(event) {
        if (!this.showPaletteEmbed) {
            return;
        }
        const iframe = this.template.querySelector('iframe.studio-embed');
        if (!iframe || event.source !== iframe.contentWindow) {
            return;
        }
        const data = event.data;
        if (
            !data ||
            data.source !== RCM_PALETTE_POST_SOURCE ||
            data.action !== RCM_PALETTE_POST_SAVE_AND_EXIT
        ) {
            return;
        }
        navigateToCollectionsHome();
    }

    handleCollectionsClick(event) {
        event.preventDefault();
        this.showMainTabDropdown = false;
        navigateToCollectionsHome();
    }

    handleCollectionTemplatesClick(event) {
        event.preventDefault();
        this.showMainTabDropdown = false;
        window.top.location.href = new URL(this.collectionTemplatesListUrl, window.location.origin).href;
    }

    handleContentAiStudioClick(event) {
        event.preventDefault();
        this.showMainTabDropdown = false;
        navigateToContentAiStudio();
    }

    handleMainTabChevronClick(event) {
        event.stopPropagation();
        this.showMainTabDropdown = !this.showMainTabDropdown;
    }

    handleNavDropdownClose() {
        this.showMainTabDropdown = false;
    }

    handleNavTabClick() {
        navigateToCollectionsHome();
    }

    handleNavChevronKeyDown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.stopPropagation();
            this.showMainTabDropdown = !this.showMainTabDropdown;
        }
    }

    handleNavTabKeyDown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            navigateToCollectionsHome();
        }
    }
}
