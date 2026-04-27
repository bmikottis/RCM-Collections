import { LightningElement, api, track } from 'lwc';

/** Must match collectionHierarchy.js */
const RCM_VIEW_COLLECTION = 'rcm-view-collection';

/** v2: resets everyone once (fixes narrow persisted widths); drag delta sign fixed in pointer move */
const STORAGE_KEY_SIDEBAR = 'rcm-content-record-annotation-sidebar-px-v2';
const STORAGE_KEY_SIDEBAR_LEGACY = 'rcm-content-record-annotation-sidebar-px';
const SIDEBAR_MIN_PX = 240;
const MAIN_MIN_PX = 240;
const SPLITTER_PX = 8;
const SIDEBAR_DEFAULT_PX = 400;

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

    @track activeTab = 'document';
    /** Right sidebar scoped tabs: annotations | contentWorkItems */
    @track scopedPanelTab = 'annotations';
    @track workflowStage = 'draft'; // draft | review | approve | archive
    @track expandedAnnotationIds = new Set(['001']);
    @track expandedLinkedClaimsIds = new Set(['001']);
    @track expandedCommentsIds = new Set(['001']);
    /** Which annotation card shows the full blue selection outline (Figma) */
    @track selectedAnnotationId = '001';
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
    }

    disconnectedCallback() {
        if (this._boundWindowResize) {
            window.removeEventListener('resize', this._boundWindowResize);
        }
        if (this._layoutResizeObserver) {
            this._layoutResizeObserver.disconnect();
            this._layoutResizeObserver = null;
        }
        this._removeGlobalResizeListeners();
        this._clearResizeCursor();
    }

    renderedCallback() {
        this._scheduleSidebarLayoutApply();
        const layout = this._getLayoutEl();
        if (layout && typeof ResizeObserver !== 'undefined' && !this._layoutResizeObserver) {
            this._layoutResizeObserver = new ResizeObserver(() => {
                this._boundLayoutResize();
            });
            this._layoutResizeObserver.observe(layout);
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

    get pathDraftClass() {
        return this._pathSegClass('draft');
    }

    get pathReviewClass() {
        return this._pathSegClass('review');
    }

    get pathApproveClass() {
        return this._pathSegClass('approve');
    }

    get pathArchiveClass() {
        return this._pathSegClass('archive');
    }

    /** Figma path: chevron segments (514:114938) — active = inverse surface, inactive = container-3 */
    _pathSegClass(stage) {
        const active = this.workflowStage === stage;
        return active ? 'content-path-seg content-path-seg_is-active' : 'content-path-seg';
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
                cardClass: [
                    'content-record-annotation-card',
                    expanded ? 'content-record-annotation-card_is-expanded' : '',
                    this.selectedAnnotationId === item.id
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

    handleAnnotationToggle(event) {
        const id = event.currentTarget.dataset.id;
        const next = new Set(this.expandedAnnotationIds);
        if (next.has(id)) {
            next.delete(id);
            const lk = new Set(this.expandedLinkedClaimsIds);
            lk.delete(id);
            this.expandedLinkedClaimsIds = lk;
            const cm = new Set(this.expandedCommentsIds);
            cm.delete(id);
            this.expandedCommentsIds = cm;
        } else {
            next.add(id);
            this.selectedAnnotationId = id;
            const seed = ANNOTATION_DEMO_ITEMS.find((row) => row.id === id);
            if (seed) {
                const nLinked = (seed.linkedClaims || []).length;
                const nComments = (seed.comments || []).length;
                if (nLinked > 0) {
                    const lk = new Set(this.expandedLinkedClaimsIds);
                    lk.add(id);
                    this.expandedLinkedClaimsIds = lk;
                }
                if (nComments > 0) {
                    const cm = new Set(this.expandedCommentsIds);
                    cm.add(id);
                    this.expandedCommentsIds = cm;
                }
            }
        }
        this.expandedAnnotationIds = next;
    }

    /**
     * Collapsed footer pills: expand card and open linked or comments section (Figma)
     * @param {Event} event
     */
    /**
     * Select annotation card for focus styling; ignores clicks from nested controls.
     * @param {MouseEvent} event
     */
    handleAnnotationCardActivate(event) {
        const path =
            typeof event.composedPath === 'function' ? event.composedPath() : [event.target];
        for (const node of path) {
            if (!node || !node.tagName) {
                continue;
            }
            const t = node.tagName.toLowerCase();
            if (t === 'button' || t === 'a' || t === 'textarea' || t === 'input') {
                return;
            }
            if (t.startsWith('lightning-')) {
                return;
            }
        }
        const id = event.currentTarget.dataset.id;
        if (id) {
            this.selectedAnnotationId = id;
        }
    }

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
     * Whether we can navigate back to the parent collection in the workspace
     * @returns {boolean}
     */
    get showBackToCollection() {
        return Boolean(this.parentCollectionId);
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

    handleBackToCollectionClick() {
        this.navigateToParentCollection();
    }

    handleParentCollectionClick(event) {
        event.preventDefault();
        this.navigateToParentCollection();
    }
}
