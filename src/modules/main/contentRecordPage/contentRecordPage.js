import { LightningElement, api, track } from 'lwc';

/**
 * Content Record Page – matches Figma: Regulated Content Version header,
 * workflow bar (Draft → Review → Approve → Archive), Document / Review & Approval /
 * Audit Trail / Related tabs, document viewer, and Annotations sidebar.
 */
export default class ContentRecordPage extends LightningElement {
    @api content;
    @api parentCollectionName;
    @api parentCollectionId;

    @track activeTab = 'document';
    @track workflowStage = 'draft'; // draft | review | approve | archive
    @track expandedAnnotationIds = new Set(['001']);
    @track expandedLinkedClaimsIds = new Set();
    @track expandedCommentsIds = new Set();
    @track openMenuAnnotationId = null;
    @track anchorCheckedIds = new Set();

    get contentName() {
        return this.content?.name || 'Content';
    }

    get contentId() {
        return this.content?.id || null;
    }

    get recordId() {
        const id = this.content?.id || 'cnt-00000';
        return id.replace(/^cnt-/, 'RCV-').toUpperCase();
    }

    get contentVersion() {
        return this.content?.version || '1.0';
    }

    get contentStatus() {
        return this.content?.status || 'Draft';
    }

    get effectiveDates() {
        return this.content?.effectiveDates || '01/01/2016 - 12/31/2036';
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

    get isDocumentTabActive() {
        return this.activeTab === 'document';
    }

    get isReviewTabActive() {
        return this.activeTab === 'review';
    }

    get isAuditTabActive() {
        return this.activeTab === 'audit';
    }

    get isRelatedTabActive() {
        return this.activeTab === 'related';
    }

    get documentTabClass() {
        return this.isDocumentTabActive ? 'content-record-tab is-active' : 'content-record-tab';
    }

    get reviewTabClass() {
        return this.isReviewTabActive ? 'content-record-tab is-active' : 'content-record-tab';
    }

    get auditTabClass() {
        return this.isAuditTabActive ? 'content-record-tab is-active' : 'content-record-tab';
    }

    get relatedTabClass() {
        return this.isRelatedTabActive ? 'content-record-tab is-active' : 'content-record-tab';
    }

    get draftStageClass() {
        return this.workflowStage === 'draft'
            ? 'content-record-workflow-stage is-current'
            : 'content-record-workflow-stage';
    }

    get reviewStageClass() {
        return this.workflowStage === 'review'
            ? 'content-record-workflow-stage is-current'
            : 'content-record-workflow-stage';
    }

    get approveStageClass() {
        return this.workflowStage === 'approve'
            ? 'content-record-workflow-stage is-current'
            : 'content-record-workflow-stage';
    }

    get archiveStageClass() {
        return this.workflowStage === 'archive'
            ? 'content-record-workflow-stage is-current'
            : 'content-record-workflow-stage';
    }

    get annotationItems() {
        const items = [
            {
                id: '001',
                createdBy: 'Brittany Smith',
                timeAgo: '2h ago',
                snippet: '...new outcome data showing how Immunexis is helping patients regain control faster....',
                linkedClaimsCount: 0,
                commentsCount: 0,
                statusLabel: 'Pending',
                isResolved: false
            },
            { id: '002', createdBy: 'Brittany Smith', timeAgo: '1d ago', snippet: '', linkedClaimsCount: 0, commentsCount: 0, statusLabel: 'Resolved', isResolved: true },
            { id: '003', createdBy: 'Brittany Smith', timeAgo: '2d ago', snippet: '', linkedClaimsCount: 0, commentsCount: 0, statusLabel: 'Pending', isResolved: false }
        ];
        return items.map((item) => ({
            ...item,
            expanded: this.expandedAnnotationIds.has(item.id),
            expandedIcon: this.expandedAnnotationIds.has(item.id) ? 'utility:chevrondown' : 'utility:chevronright',
            expandLabel: this.expandedAnnotationIds.has(item.id) ? 'Collapse annotation' : 'Expand annotation',
            linkedClaimsExpanded: this.expandedLinkedClaimsIds.has(item.id),
            commentsExpanded: this.expandedCommentsIds.has(item.id),
            linkedClaimsChevron: this.expandedLinkedClaimsIds.has(item.id) ? 'utility:chevrondown' : 'utility:chevronright',
            commentsChevron: this.expandedCommentsIds.has(item.id) ? 'utility:chevrondown' : 'utility:chevronright',
            menuOpen: this.openMenuAnnotationId === item.id,
            anchorChecked: this.anchorCheckedIds.has(item.id)
        }));
    }

    get annotationsCount() {
        return this.annotationItems.length;
    }

    get hasNoAnnotations() {
        return this.annotationItems.length === 0;
    }

    handleDocumentTabClick() {
        this.activeTab = 'document';
    }

    handleReviewTabClick() {
        this.activeTab = 'review';
    }

    handleAuditTabClick() {
        this.activeTab = 'audit';
    }

    handleRelatedTabClick() {
        this.activeTab = 'related';
    }

    handleAnnotationToggle(event) {
        const id = event.currentTarget.dataset.id;
        const next = new Set(this.expandedAnnotationIds);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        this.expandedAnnotationIds = next;
    }

    handleAuthorClick(event) {
        event.preventDefault();
        const author = event.currentTarget.dataset.author;
        // Filter annotations by author or navigate to user profile
        console.log('View profile/filter by author:', author);
    }

    handleStatusClick(event) {
        event.preventDefault();
        const id = event.currentTarget.dataset.id;
        // Open status dropdown or filter by status
        console.log('Change/view status for annotation:', id);
    }

    handleLinkedClaimsToggle(event) {
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

    handleCloseMoreMenu() {
        this.openMenuAnnotationId = null;
    }

    handleEdit() {
        // Placeholder
    }

    handleParentCollectionClick(event) {
        event.preventDefault();
        if (this.parentCollectionId) {
            this.dispatchEvent(
                new CustomEvent('viewcollection', {
                    detail: { collectionId: this.parentCollectionId },
                    bubbles: true,
                    composed: true
                })
            );
        }
    }
}
