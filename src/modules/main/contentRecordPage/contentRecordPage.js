import { LightningElement, api, track } from 'lwc';

/** Vendored from @embedpdf/snippet/dist (copy-embedpdf-assets.mjs). Public URL, not an npm import — avoids LWR3009. */
const EMBED_PDF_ENTRY_PATH = '/public/assets/vendor/embedpdf-snippet/embedpdf.js';

/**
 * Native ESM import by absolute URL. Built so LWR prod-compat does not register @embedpdf as an AMD "module" bare specifier.
 * @param {string} absUrl
 * @returns {Promise<typeof import('@embedpdf/snippet')>}
 */
function _importEmbedPdfFromUrl(absUrl) {
    // eslint-disable-next-line no-new-func -- required to bypass LWR's transform of import()
    return new Function('u', 'return import(u)')(absUrl);
}

/** Must match collectionHierarchy.js */
const RCM_VIEW_COLLECTION = 'rcm-view-collection';
const RCM_TREE_SELECT_COLLECTION = 'rcm-tree-select-collection';

/** v2: resets everyone once (fixes narrow persisted widths); drag delta sign fixed in pointer move */
const STORAGE_KEY_SIDEBAR = 'rcm-content-record-annotation-sidebar-px-v2';
const STORAGE_KEY_SIDEBAR_LEGACY = 'rcm-content-record-annotation-sidebar-px';
const SIDEBAR_MIN_PX = 240;
const MAIN_MIN_PX = 240;
const SPLITTER_PX = 8;
const SIDEBAR_DEFAULT_PX = 400;

/** Salesforce Lightning brand blues for EmbedPDF theme (matches SLDS/Figma accents) */
const EMBED_PDF_SLDS_THEME = {
    preference: 'light',
    light: {
        background: {
            app: '#f3f3f3',
            surface: '#ffffff',
            surfaceAlt: '#f3f3f3',
            elevated: '#ffffff',
            overlay: 'rgba(0, 0, 0, 0.4)',
            input: '#ffffff'
        },
        foreground: {
            primary: '#181818',
            secondary: '#5c5c5c',
            muted: '#706e6b',
            disabled: '#b0adab',
            onAccent: '#ffffff'
        },
        border: {
            default: '#e5e5e5',
            subtle: '#e5e5e5',
            strong: '#c9c9c7'
        },
        accent: {
            primary: '#0176d3',
            primaryHover: '#014486',
            primaryActive: '#014486',
            primaryLight: 'rgba(1, 118, 211, 0.12)',
            primaryForeground: '#ffffff'
        },
        interactive: {
            hover: 'rgba(1, 118, 211, 0.08)',
            active: 'rgba(1, 118, 211, 0.12)',
            selected: 'rgba(1, 118, 211, 0.16)',
            focus: '#0176d3',
            focusRing: 'rgba(1, 118, 211, 0.2)'
        },
        state: {
            error: '#c23934',
            errorLight: 'rgba(194, 57, 52, 0.1)',
            warning: '#fe9339',
            warningLight: 'rgba(254, 147, 57, 0.1)',
            success: '#2e844a',
            successLight: 'rgba(46, 132, 74, 0.1)',
            info: '#0176d3',
            infoLight: 'rgba(1, 118, 211, 0.1)'
        }
    }
};

/** Demo annotation rows — shared by getter and expand/collapse behavior */
const ANNOTATION_DEMO_ITEMS = [
    {
        id: '001',
        createdBy: 'Brittany Smith',
        timeAgo: '2h ago',
        snippet:
            '...new outcome data showing how Immunexis is helping patients regain control faster....',
        statusLabel: 'Pending',
        isResolved: false,
        flagged: false,
        linkedClaims: [
            { code: 'RCS-0001', warn: false },
            { code: 'RCS-0002', warn: true },
            { code: 'RCS-0003', warn: false }
        ],
        comments: [
            {
                id: 'cm-1',
                author: 'Brittany Smith',
                timeAgo: '1h ago',
                body: 'Comment text would go here for the annotation. And it will vary in length.',
                tone: 'brand'
            },
            {
                id: 'cm-2',
                author: 'Ujjwal Dubey',
                timeAgo: '2h ago',
                body: 'Comment text would go here for the annotation. And it will vary in length.',
                tone: 'violet'
            }
        ]
    },
    {
        id: '002',
        createdBy: 'Brittany Smith',
        timeAgo: '1d ago',
        snippet: '',
        statusLabel: 'Resolved',
        isResolved: true,
        flagged: false,
        linkedClaims: [],
        comments: []
    },
    {
        id: '003',
        createdBy: 'Brittany Smith',
        timeAgo: '2d ago',
        snippet: '',
        statusLabel: 'Pending',
        isResolved: false,
        flagged: true,
        linkedClaims: [],
        comments: []
    }
];

/**
 * Regulated Content record — layout aligned with Figma (page header, workflow path,
 * document viewer + scoped annotation panel).
 */
export default class ContentRecordPage extends LightningElement {
    @api content;
    @api parentCollectionName;
    @api parentCollectionId;
    /** Path segments (id + name) from the collection tree — see Figma 457:75280 <lightning-breadcrumbs> */
    @api recordBreadcrumbItems;

    @track activeTab = 'document';
    /** Right sidebar scoped tabs: annotations | contentWorkItems */
    @track scopedPanelTab = 'annotations';
    @track workflowStage = 'draft'; // draft | review | approve | archive
    @track expandedAnnotationIds = new Set();
    @track expandedLinkedClaimsIds = new Set();
    @track expandedCommentsIds = new Set();
    /** Which annotation card shows the full blue selection outline (Figma); null = none */
    @track selectedAnnotationId = null;
    @track openMenuAnnotationId = null;
    @track anchorCheckedIds = new Set();
    /** Draft text per annotation id for comment composer */
    @track commentDrafts = {};
    @track zoomLevel = '125';
    @track currentPage = 1;

    /** Resizable annotation column width (px); persisted in localStorage */
    @track sidebarWidthPx = SIDEBAR_DEFAULT_PX;

    @track _splitterMaxForAria = 1200;

    _resizePointerId = null;

    _layoutResizeObserver = null;

    _boundResizeMove = (e) => this._handleResizePointerMove(e);

    _boundResizeEnd = (e) => this._handleResizePointerEnd(e);

    /** 'embed' = @embedpdf/snippet; 'iframe' = browser PDF UI fallback */
    @track pdfViewerMode = 'embed';

    _embedPdfInitGeneration = 0;

    _embedPdfMountUrl = null;

    _contentRecordKey = null;

    _teardownEmbedPdf() {
        const host = this.template && this.template.querySelector('.content-record-pdf-host');
        if (host) {
            while (host.firstChild) {
                host.removeChild(host.firstChild);
            }
        }
        this._embedPdfMountUrl = null;
    }

    _mountEmbedPdfIfNeeded() {
        if (!this.hasPdfPreview) {
            this._teardownEmbedPdf();
            return;
        }
        if (this.pdfViewerMode !== 'embed') {
            this._teardownEmbedPdf();
            return;
        }
        const url = this.previewDocumentUrl;
        if (!url) {
            this._teardownEmbedPdf();
            return;
        }
        const host = this.template.querySelector('.content-record-pdf-host');
        if (!host) {
            return;
        }
        if (this._embedPdfMountUrl === url && host.childElementCount > 0) {
            return;
        }
        this._teardownEmbedPdf();
        const generation = ++this._embedPdfInitGeneration;
        void (async () => {
            if (typeof window === 'undefined' || !window.location?.origin) {
                this.pdfViewerMode = 'iframe';
                return;
            }
            const entryUrl = new URL(EMBED_PDF_ENTRY_PATH, window.location.origin).href;
            try {
                const mod = await _importEmbedPdfFromUrl(entryUrl);
                const EmbedPDF = mod.default;
                const { ZoomMode } = mod;
                if (generation !== this._embedPdfInitGeneration || this.pdfViewerMode !== 'embed') {
                    return;
                }
                const hostNode = this.template.querySelector('.content-record-pdf-host');
                if (!hostNode) {
                    return;
                }
                EmbedPDF.init({
                    type: 'container',
                    target: hostNode,
                    src: url,
                    tabBar: 'never',
                    theme: EMBED_PDF_SLDS_THEME,
                    zoom: {
                        defaultZoomLevel: ZoomMode.FitWidth
                    }
                });
                if (generation !== this._embedPdfInitGeneration) {
                    this._teardownEmbedPdf();
                    return;
                }
                this._embedPdfMountUrl = url;
            } catch (e) {
                if (typeof console !== 'undefined' && console.error) {
                    console.error('contentRecordPage: EmbedPDF failed, using iframe', e);
                }
                this.pdfViewerMode = 'iframe';
                this._teardownEmbedPdf();
            }
        })();
    }

    connectedCallback() {
        this._boundWindowResize = () => {
            this.sidebarWidthPx = this._clampSidebarWidth(this.sidebarWidthPx);
            this._applySidebarWidth();
        };
        this._boundLayoutResize = () => {
            this.sidebarWidthPx = this._clampSidebarWidth(this.sidebarWidthPx);
            this._applySidebarWidth();
        };
        window.addEventListener('resize', this._boundWindowResize);
        try {
            window.localStorage.removeItem(STORAGE_KEY_SIDEBAR_LEGACY);
            const raw = window.localStorage.getItem(STORAGE_KEY_SIDEBAR);
            if (raw != null) {
                const n = parseInt(raw, 10);
                if (!Number.isNaN(n) && n >= SIDEBAR_MIN_PX) {
                    this.sidebarWidthPx = n;
                }
            }
        } catch {
            /* ignore */
        }
        this._boundDocumentPointerDown = (e) => {
            this._handleDocumentPointerDownOutsideAnnotationCards(e);
        };
        if (typeof document !== 'undefined' && this._boundDocumentPointerDown) {
            document.addEventListener('pointerdown', this._boundDocumentPointerDown, true);
        }
    }

    disconnectedCallback() {
        this._embedPdfInitGeneration += 1;
        this._teardownEmbedPdf();
        if (this._boundWindowResize) {
            window.removeEventListener('resize', this._boundWindowResize);
        }
        if (this._layoutResizeObserver) {
            this._layoutResizeObserver.disconnect();
            this._layoutResizeObserver = null;
        }
        this._removeGlobalResizeListeners();
        this._clearResizeCursor();
        if (typeof document !== 'undefined' && this._boundDocumentPointerDown) {
            document.removeEventListener('pointerdown', this._boundDocumentPointerDown, true);
            this._boundDocumentPointerDown = null;
        }
    }

    renderedCallback() {
        this._syncPdfViewerForContent();
        this._scheduleSidebarLayoutApply();
        const layout = this._getLayoutEl();
        if (layout && typeof ResizeObserver !== 'undefined' && !this._layoutResizeObserver) {
            this._layoutResizeObserver = new ResizeObserver(() => {
                this._boundLayoutResize();
            });
            this._layoutResizeObserver.observe(layout);
        }
        this._queueEmbedPdfMount();
    }

    _resetAnnotationStateForContentChange() {
        this.expandedAnnotationIds = new Set();
        this.expandedLinkedClaimsIds = new Set();
        this.expandedCommentsIds = new Set();
        this.selectedAnnotationId = null;
        this.openMenuAnnotationId = null;
        this.commentDrafts = {};
        this.anchorCheckedIds = new Set();
    }

    _syncPdfViewerForContent() {
        const key = `${this.content?.id ?? ''}|${this.previewDocumentUrl || ''}`;
        if (key === this._contentRecordKey) {
            return;
        }
        this._contentRecordKey = key;
        this._resetAnnotationStateForContentChange();
        if (this.hasPdfPreview) {
            this.pdfViewerMode = 'embed';
            this._embedPdfInitGeneration += 1;
            this._teardownEmbedPdf();
        }
    }

    _queueEmbedPdfMount() {
        if (!this.hasPdfPreview) {
            this._teardownEmbedPdf();
            return;
        }
        if (typeof Promise === 'undefined') {
            return;
        }
        if (this.pdfViewerMode === 'embed') {
            void Promise.resolve().then(() => this._mountEmbedPdfIfNeeded());
        } else {
            this._teardownEmbedPdf();
        }
    }

    /** Apply width after layout (first paint often measures 0px wide until flex settles). */
    _scheduleSidebarLayoutApply() {
        this._applySidebarWidth();
        if (typeof requestAnimationFrame === 'undefined') {
            return;
        }
        requestAnimationFrame(() => {
            this._applySidebarWidth();
            requestAnimationFrame(() => this._applySidebarWidth());
        });
    }

    _isStackedLayout() {
        return typeof window !== 'undefined' && window.matchMedia('(max-width: 1024px)').matches;
    }

    _applySidebarWidth() {
        const aside = this.template.querySelector('.content-record-doc-sidebar');
        if (!aside) {
            return;
        }
        if (this._isStackedLayout()) {
            aside.style.width = '';
            return;
        }
        const clamped = this._clampSidebarWidth(this.sidebarWidthPx);
        if (clamped !== this.sidebarWidthPx) {
            this.sidebarWidthPx = clamped;
        }
        aside.style.width = `${this.sidebarWidthPx}px`;
    }

    _getLayoutEl() {
        return this.template.querySelector('.content-record-doc-layout');
    }

    _clampSidebarWidth(widthPx) {
        const layout = this._getLayoutEl();
        if (!layout) {
            return Math.max(SIDEBAR_MIN_PX, widthPx);
        }
        const total = layout.getBoundingClientRect().width;
        const maxSidebar = Math.max(SIDEBAR_MIN_PX, total - MAIN_MIN_PX - SPLITTER_PX);
        return Math.min(maxSidebar, Math.max(SIDEBAR_MIN_PX, widthPx));
    }

    get sidebarWidthMin() {
        return SIDEBAR_MIN_PX;
    }

    get sidebarWidthMaxAria() {
        return this._splitterMaxForAria;
    }

    handleSplitterPointerDown(event) {
        if (event.button !== 0) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        const layout = this._getLayoutEl();
        if (layout) {
            const total = layout.getBoundingClientRect().width;
            this._splitterMaxForAria = Math.max(
                SIDEBAR_MIN_PX,
                Math.floor(total - MAIN_MIN_PX - SPLITTER_PX)
            );
        }
        this._resizePointerId = event.pointerId;
        this._resizeStartX = event.clientX;
        this._resizeStartWidth = this.sidebarWidthPx;
        try {
            event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
            /* ignore */
        }
        document.addEventListener('pointermove', this._boundResizeMove);
        document.addEventListener('pointerup', this._boundResizeEnd);
        document.addEventListener('pointercancel', this._boundResizeEnd);
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    }

    _handleResizePointerMove(event) {
        if (event.pointerId !== this._resizePointerId) {
            return;
        }
        /* Splitter is left of sidebar: moving the handle left (smaller clientX) widens the right panel */
        const delta = this._resizeStartX - event.clientX;
        const next = this._clampSidebarWidth(this._resizeStartWidth + delta);
        this.sidebarWidthPx = next;
        this._applySidebarWidth();
    }

    _handleResizePointerEnd(event) {
        if (this._resizePointerId == null) {
            return;
        }
        if (event && event.pointerId != null && event.pointerId !== this._resizePointerId) {
            return;
        }
        this._removeGlobalResizeListeners();
        this._clearResizeCursor();
        this._resizePointerId = null;
        try {
            window.localStorage.setItem(STORAGE_KEY_SIDEBAR, String(this.sidebarWidthPx));
        } catch {
            /* ignore */
        }
    }

    _removeGlobalResizeListeners() {
        document.removeEventListener('pointermove', this._boundResizeMove);
        document.removeEventListener('pointerup', this._boundResizeEnd);
        document.removeEventListener('pointercancel', this._boundResizeEnd);
    }

    _clearResizeCursor() {
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    }

    handleSplitterKeyDown(event) {
        const step = event.shiftKey ? 32 : 8;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            /* Align with mouse: left widens annotations column, right narrows */
            const dir = event.key === 'ArrowLeft' ? 1 : -1;
            this.sidebarWidthPx = this._clampSidebarWidth(this.sidebarWidthPx + dir * step);
            this._applySidebarWidth();
            try {
                window.localStorage.setItem(STORAGE_KEY_SIDEBAR, String(this.sidebarWidthPx));
            } catch {
                /* ignore */
            }
        }
    }

    get contentName() {
        return this.content?.name || 'Content';
    }

    /** Primary page title (Figma: marketing / document title) */
    get recordTitle() {
        return this.content?.title || this.content?.name || 'Regulated Content';
    }

    /** Breadcrumb data from parent (collection path); Figma: lightning-breadcrumbs above eyebrow */
    get recordBreadcrumbsList() {
        return Array.isArray(this.recordBreadcrumbItems) ? this.recordBreadcrumbItems : [];
    }

    get hasRecordBreadcrumbs() {
        return this.recordBreadcrumbsList.length > 0;
    }

    /** Figma: 13px on-surface-1, line 18px — e.g. "Regulated Content Version" */
    get recordEyebrowLabel() {
        if (this.content?.recordTypeLabel) {
            return this.content.recordTypeLabel;
        }
        return 'Regulated Content Version';
    }

    /** File name shown in the viewer toolbar */
    get displayFileName() {
        return this.contentName;
    }

    get contentVersion() {
        return this.content?.version != null ? String(this.content.version) : '0.1';
    }

    get contentStatus() {
        return this.content?.status || 'Draft';
    }

    get effectiveDates() {
        return this.content?.effectiveDates || '01/01/2016 - 12/31/2036';
    }

    /** Highlight field — human-readable type label */
    get contentTypeDisplay() {
        if (this.content?.contentTypeLabel) {
            return this.content.contentTypeLabel;
        }
        const t = (this.content?.contentType || '').toLowerCase();
        if (t === 'pdf') {
            return 'PDF';
        }
        if (t === 'word' || t === 'docx') {
            return 'Word Document';
        }
        return t ? t.charAt(0).toUpperCase() + t.slice(1) : '—';
    }

    get contentIcon() {
        const type = (this.content?.contentType || '').toLowerCase();
        const iconMap = {
            pdf: 'doctype:pdf',
            word: 'doctype:word',
            docx: 'doctype:word',
            excel: 'doctype:excel',
            ppt: 'doctype:ppt',
            image: 'doctype:image',
            video: 'doctype:video',
            html: 'doctype:html',
            zip: 'doctype:zip'
        };
        return iconMap[type] || 'doctype:unknown';
    }

    /**
     * When `content.previewUrl` is set (static demo assets), show PDF in the viewer via iframe.
     * @returns {boolean}
     */
    get hasPdfPreview() {
        return (
            (this.content?.contentType || '').toLowerCase() === 'pdf' &&
            typeof this.content?.previewUrl === 'string' &&
            this.content.previewUrl.length > 0
        );
    }

    /**
     * Absolute URL for PDF iframe (encodes spaces and special path segments).
     * @returns {string}
     */
    get previewDocumentUrl() {
        const raw = this.content?.previewUrl;
        if (!raw || typeof raw !== 'string') {
            return '';
        }
        if (/^https?:\/\//i.test(raw)) {
            return raw;
        }
        const path = raw.startsWith('/') ? raw : `/${raw}`;
        if (typeof window !== 'undefined' && window.location && window.location.origin) {
            return `${window.location.origin}${encodeURI(path)}`;
        }
        return encodeURI(path);
    }

    /** SLDS-branded EmbedPDF host vs browser iframe fallback */
    get usePdfEmbedHost() {
        return this.hasPdfPreview && this.pdfViewerMode === 'embed';
    }

    /** Hide duplicate paging/zoom row when EmbedPDF provides its own chrome */
    get showLwcDocumentToolbarPagingRow() {
        return !this.hasPdfPreview || this.pdfViewerMode === 'iframe';
    }

    get totalPages() {
        return this.content?.pageCount != null ? Number(this.content.pageCount) : 14;
    }

    get zoomOptions() {
        return [
            { label: '50%', value: '50' },
            { label: '75%', value: '75' },
            { label: '100%', value: '100' },
            { label: '125%', value: '125' },
            { label: '150%', value: '150' },
            { label: '200%', value: '200' }
        ];
    }

    handleZoomChange(event) {
        this.zoomLevel = event.detail.value;
    }

    handleMainTabActive(event) {
        const v = event.target && event.target.value;
        if (v) {
            this.activeTab = v;
        }
    }

    handleScopedTabActive(event) {
        const v = event.target && event.target.value;
        if (v) {
            this.scopedPanelTab = v;
        }
    }

    /**
     * Path steps: first = pill-left + right cap; middle/last = stage + right cap only
     * (no left notches; previous step’s right cap overlays the next body).
     * @returns {Array<{key: string, label: string, segClass: string, showRightCap: boolean, ariaCurrent: string|null, wrapStyle: string}>}
     */
    get pathStepItems() {
        const order = [
            { stage: 'draft', label: 'Draft' },
            { stage: 'review', label: 'Review' },
            { stage: 'approve', label: 'Approve' },
            { stage: 'archive', label: 'Archive' }
        ];
        return order.map((s, i) => {
            const isFirst = i === 0;
            const isLast = i === order.length - 1;
            const active = this.workflowStage === s.stage;
            const mod = isFirst ? 'content-path-seg_first' : isLast ? 'content-path-seg_last' : 'content-path-seg_middle';
            return {
                key: s.stage,
                label: s.label,
                showRightCap: !isLast,
                segClass: [
                    'content-path-seg',
                    mod,
                    active ? 'content-path-seg_is-active' : ''
                ]
                    .filter(Boolean)
                    .join(' '),
                ariaCurrent: active ? 'step' : null,
                // Later steps sit under earlier ones so each step's right cap paints on top of the next body.
                wrapStyle: `z-index: ${order.length - i};`
            };
        });
    }

    get annotationItems() {
        return ANNOTATION_DEMO_ITEMS.map((item) => {
            const expanded = this.expandedAnnotationIds.has(item.id);
            const linkedClaims = (item.linkedClaims || []).map((lc, i) => ({
                ...lc,
                rowClass:
                    i === 0
                        ? 'content-record-annotation-linked-row'
                        : 'content-record-annotation-linked-row content-record-annotation-linked-row_is-stacked'
            }));
            const comments = item.comments || [];
            const linkedClaimsCount = linkedClaims.length;
            const commentsCount = comments.length;
            const commentsWithUi = comments.map((c) => ({
                ...c,
                avatarClass:
                    c.tone === 'violet'
                        ? 'content-record-annotation-comment-avatar content-record-annotation-comment-avatar_violet'
                        : 'content-record-annotation-comment-avatar content-record-annotation-comment-avatar_brand'
            }));
            return {
                ...item,
                linkedClaims,
                comments: commentsWithUi,
                linkedClaimsCount,
                commentsCount,
                displayAnnId: `ANN-${item.id}`,
                commentDraftValue: this.commentDrafts[item.id] ?? '',
                showAnchorIcon: this.anchorCheckedIds.has(item.id),
                expanded,
                isCollapsed: !expanded,
                metaClass: [
                    'content-record-annotation-meta',
                    !expanded ? 'content-record-annotation-meta_collapsed' : ''
                ]
                    .filter(Boolean)
                    .join(' '),
                linkedClaimsBadgeLabel: `Linked claims (${linkedClaims.length})`,
                commentsBadgeLabel: `Comments (${comments.length})`,
                cardClass: [
                    'content-record-annotation-card',
                    expanded ? 'content-record-annotation-card_is-expanded' : '',
                    this.selectedAnnotationId != null && this.selectedAnnotationId === item.id
                        ? 'content-record-annotation-card_is-selected'
                        : ''
                ]
                    .filter(Boolean)
                    .join(' '),
                linkedClaimsPanelId: `annotation-linked-panel-${item.id}`,
                linkedClaimsToggleId: `annotation-linked-toggle-${item.id}`,
                commentsPanelId: `annotation-comments-panel-${item.id}`,
                commentsToggleId: `annotation-comments-toggle-${item.id}`,
                linkedClaimsSectionClass: [
                    'content-record-annotation-section-shell',
                    this.expandedLinkedClaimsIds.has(item.id)
                        ? 'content-record-annotation-section-shell_open'
                        : ''
                ]
                    .filter(Boolean)
                    .join(' '),
                commentsSectionClass: [
                    'content-record-annotation-section-shell',
                    this.expandedCommentsIds.has(item.id)
                        ? 'content-record-annotation-section-shell_open'
                        : ''
                ]
                    .filter(Boolean)
                    .join(' '),
                expandedIcon: expanded ? 'utility:chevrondown' : 'utility:chevronright',
                expandLabel: expanded ? 'Collapse annotation' : 'Expand annotation',
                linkedClaimsExpanded: this.expandedLinkedClaimsIds.has(item.id),
                commentsExpanded: this.expandedCommentsIds.has(item.id),
                hasLinkedClaims: linkedClaims.length > 0,
                hasComments: comments.length > 0,
                linkedClaimsChevron: this.expandedLinkedClaimsIds.has(item.id)
                    ? 'utility:chevrondown'
                    : 'utility:chevronright',
                commentsChevron: this.expandedCommentsIds.has(item.id)
                    ? 'utility:chevrondown'
                    : 'utility:chevronright',
                menuOpen: this.openMenuAnnotationId === item.id,
                anchorChecked: this.anchorCheckedIds.has(item.id),
                headerMenuIconSize: 'xx-small'
            };
        });
    }

    get annotationsCount() {
        return this.annotationItems.length;
    }

    get annotationsTabLabel() {
        return `Annotations (${this.annotationsCount})`;
    }

    get contentWorkItemsTabLabel() {
        return `Content Work items (${this.contentWorkItemsCount})`;
    }

    /** Placeholder work items for Content Work items scoped tab (Figma 514:115046) */
    get contentWorkItems() {
        return [
            { id: 'cwi-001', name: 'Verify PI against approved claims', status: 'In Progress', due: 'Apr 20, 2026' },
            { id: 'cwi-002', name: 'Medical–Legal review sign-off', status: 'Not Started', due: 'Apr 28, 2026' },
            { id: 'cwi-003', name: 'Archive prior version in RCM', status: 'Completed', due: '—' }
        ];
    }

    get contentWorkItemsCount() {
        return this.contentWorkItems.length;
    }

    get hasNoAnnotations() {
        return this.annotationItems.length === 0;
    }

    /**
     * Collapse one annotation and its linked-claims / comments sub-panels.
     * @param {string} id
     */
    _collapseAnnotationById(id) {
        if (!id || !this.expandedAnnotationIds.has(id)) {
            return;
        }
        const next = new Set(this.expandedAnnotationIds);
        next.delete(id);
        this.expandedAnnotationIds = next;
        const lk = new Set(this.expandedLinkedClaimsIds);
        lk.delete(id);
        this.expandedLinkedClaimsIds = lk;
        const cm = new Set(this.expandedCommentsIds);
        cm.delete(id);
        this.expandedCommentsIds = cm;
    }

    /**
     * Collapse all expanded annotation cards (e.g. click outside the cards).
     */
    _collapseAllExpandedAnnotations() {
        if (this.expandedAnnotationIds.size === 0) {
            return;
        }
        this.expandedAnnotationIds = new Set();
        this.expandedLinkedClaimsIds = new Set();
        this.expandedCommentsIds = new Set();
        this.selectedAnnotationId = null;
        this.openMenuAnnotationId = null;
    }

    /**
     * Pointer is outside any annotation card — collapse expanded cards.
     * @param {PointerEvent} event
     */
    _handleDocumentPointerDownOutsideAnnotationCards(event) {
        const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
        for (const node of path) {
            if (
                node &&
                node.classList &&
                node.classList.contains('content-record-annotation-card')
            ) {
                return;
            }
        }
        this._collapseAllExpandedAnnotations();
    }

    handleAnnotationToggle(event) {
        event.stopPropagation();
        const id = event.currentTarget.dataset.id;
        if (!id) {
            return;
        }
        if (this.expandedAnnotationIds.has(id)) {
            this._collapseAnnotationById(id);
        } else {
            const next = new Set(this.expandedAnnotationIds);
            next.add(id);
            this.expandedAnnotationIds = next;
            this.selectedAnnotationId = id;
        }
    }

    /**
     * Card surface: select + expand when collapsed, or collapse when already expanded.
     * Skips buttons, links, form controls, and the info icon.
     * @param {MouseEvent} event
     */
    handleAnnotationCardActivate(event) {
        const path =
            typeof event.composedPath === 'function' ? event.composedPath() : [event.target];
        for (const node of path) {
            if (!node || !node.tagName) {
                continue;
            }
            if (node.classList && node.classList.contains('content-record-annotation-info-icon')) {
                return;
            }
            const t = node.tagName.toLowerCase();
            if (t === 'button' || t === 'a' || t === 'input' || t === 'textarea' || t === 'select' || t === 'label') {
                return;
            }
            if (
                t === 'lightning-input' ||
                t === 'lightning-textarea' ||
                t === 'lightning-button' ||
                t === 'lightning-button-icon' ||
                t === 'lightning-combobox'
            ) {
                return;
            }
        }
        const id = event.currentTarget.dataset.id;
        if (!id) {
            return;
        }
        if (this.expandedAnnotationIds.has(id)) {
            this._collapseAnnotationById(id);
            return;
        }
        this.selectedAnnotationId = id;
        const next = new Set(this.expandedAnnotationIds);
        next.add(id);
        this.expandedAnnotationIds = next;
    }

    /**
     * Collapsed badge row: expand the card and open linked claims or comments (Figma 276:19820).
     * @param {MouseEvent} event
     */
    handleCollapsedSummaryClick(event) {
        event.stopPropagation();
        const id = event.currentTarget.dataset.id;
        const jump = event.currentTarget.dataset.jump;
        if (id) {
            this.selectedAnnotationId = id;
        }
        const nextAnn = new Set(this.expandedAnnotationIds);
        nextAnn.add(id);
        this.expandedAnnotationIds = nextAnn;
        if (jump === 'linked') {
            const n = new Set(this.expandedLinkedClaimsIds);
            n.add(id);
            this.expandedLinkedClaimsIds = n;
        } else if (jump === 'comments') {
            const n = new Set(this.expandedCommentsIds);
            n.add(id);
            this.expandedCommentsIds = n;
        }
    }

    handleSaveCommentClick(event) {
        const id = event.currentTarget.dataset.id;
        console.log('Save comment for annotation:', id);
    }

    handleLinkedClaimMenuClick(event) {
        event.stopPropagation();
        const code = event.currentTarget.dataset.code;
        console.log('Linked claim menu:', code);
    }

    handleCommentMenuClick(event) {
        event.stopPropagation();
        const commentId = event.currentTarget.dataset.commentId;
        console.log('Comment menu:', commentId);
    }

    handleCommentDraftChange(event) {
        const id = event.target?.dataset?.id;
        if (!id) {
            return;
        }
        this.commentDrafts = { ...this.commentDrafts, [id]: event.detail.value };
    }

    handleAuthorClick(event) {
        event.preventDefault();
        const author = event.currentTarget.dataset.author;
        console.log('View profile/filter by author:', author);
    }

    handleStatusClick(event) {
        event.preventDefault();
        const id = event.currentTarget.dataset.id;
        console.log('Change/view status for annotation:', id);
    }

    handleLinkedClaimsToggle(event) {
        event.stopPropagation();
        const id = event.currentTarget.dataset.id;
        const next = new Set(this.expandedLinkedClaimsIds);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        this.expandedLinkedClaimsIds = next;
    }

    handleLinkClaimClick(event) {
        event.preventDefault();
        const id = event.currentTarget.dataset.id;
        console.log('Link claim for annotation:', id);
    }

    handleCommentsToggle(event) {
        event.stopPropagation();
        const id = event.currentTarget.dataset.id;
        const next = new Set(this.expandedCommentsIds);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        this.expandedCommentsIds = next;
    }

    handleAddCommentClick(event) {
        event.preventDefault();
        const id = event.currentTarget.dataset.id;
        console.log('Add comment for annotation:', id);
    }

    handleAnchorChange(event) {
        const id = event.target.dataset.id;
        const checked = event.detail.checked;
        const next = new Set(this.anchorCheckedIds);
        if (checked) {
            next.add(id);
        } else {
            next.delete(id);
        }
        this.anchorCheckedIds = next;
    }

    handleMoreClick(event) {
        const id = event.currentTarget.dataset.id;
        event.stopPropagation();
        this.openMenuAnnotationId = this.openMenuAnnotationId === id ? null : id;
    }

    handleMoreOptionSelect(event) {
        const action = event.currentTarget.dataset.action;
        const id = event.currentTarget.dataset.id;
        this.openMenuAnnotationId = null;
        if (action === 'copy-link') {
            console.log('Copy link for annotation:', id);
        } else if (action === 'edit') {
            console.log('Edit annotation:', id);
        } else if (action === 'delete') {
            console.log('Delete annotation:', id);
        } else if (action === 'resolve') {
            console.log('Resolve annotation:', id);
        } else if (action === 'unresolve') {
            console.log('Unresolve annotation:', id);
        } else if (action === 'assign') {
            console.log('Assign annotation:', id);
        } else if (action === 'add-to-library') {
            console.log('Add to library:', id);
        }
    }

    handleEdit() {
        // Placeholder
    }

    /**
     * Return to main workspace with the parent collection selected (tree + detail)
     */
    navigateToParentCollection() {
        if (!this.parentCollectionId) {
            return;
        }
        if (typeof document !== 'undefined') {
            document.dispatchEvent(
                new CustomEvent(RCM_VIEW_COLLECTION, {
                    bubbles: true,
                    composed: true,
                    detail: {
                        collectionId: this.parentCollectionId,
                        focusWorkspace: true
                    }
                })
            );
        }
    }

    /**
     * Breadcrumb: select a collection in the path (same behavior as main workspace bar).
     * @param {CustomEvent} event
     */
    handleRecordBreadcrumbClick(event) {
        if (event?.cancelable) {
            event.preventDefault();
        }
        const id = event?.currentTarget?.name;
        if (!id || typeof document === 'undefined') {
            return;
        }
        document.dispatchEvent(
            new CustomEvent(RCM_TREE_SELECT_COLLECTION, {
                bubbles: true,
                composed: true,
                detail: { id }
            })
        );
    }

    handleParentCollectionClick(event) {
        event.preventDefault();
        this.navigateToParentCollection();
    }
}
