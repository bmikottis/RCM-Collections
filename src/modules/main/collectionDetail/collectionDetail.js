import { LightningElement, api, track } from 'lwc';

/**
 * Helper function to get content type icon
 * @param {string} contentType - The content type identifier
 * @returns {string} SLDS icon name
 */
function getContentTypeIcon(contentType) {
    const iconMap = {
        pdf: 'doctype:pdf',
        word: 'doctype:word',
        excel: 'doctype:excel',
        ppt: 'doctype:ppt',
        image: 'doctype:image',
        video: 'doctype:video',
        html: 'doctype:html',
        zip: 'doctype:zip',
        unknown: 'doctype:unknown'
    };
    return iconMap[contentType] || 'doctype:unknown';
}

/**
 * Sample members data for prototype
 */
const SAMPLE_MEMBERS = [
    { id: 'm1', name: 'Sarah Johnson', role: 'Owner', avatar: null },
    { id: 'm2', name: 'Mike Chen', role: 'Editor', avatar: null },
    { id: 'm3', name: 'Emily Davis', role: 'Viewer', avatar: null }
];

/** Workflow path stages: key, label, and action label when this stage is active */
const WORKFLOW_STAGES = [
    { key: 'draft', label: 'Draft', actionLabel: 'Send for review' },
    { key: 'review', label: 'Review', actionLabel: 'Submit for approval' },
    { key: 'approve', label: 'Approve', actionLabel: 'Complete Approval' },
    { key: 'archive', label: 'Archive', actionLabel: 'Archive Collection' }
];

/**
 * Collection Detail component displays information about a selected collection
 * including its metadata, child collections, and content items.
 */
export default class CollectionDetail extends LightningElement {
    @api collection;
    @api collectionType;
    @api completenessData;
    
    @track activeRequirementsTab = 'content'; // 'content', 'tasks', or 'approvals'
    @track openContentMenuId = null;
    @track openAddedBadgeMenuId = null;
    @track showPreviewModal = false;
    @track previewContent = null;

    /**
     * Check if Content tab is active
     */
    get isContentTabActive() {
        return this.activeRequirementsTab === 'content';
    }

    /**
     * Check if Tasks tab is active
     */
    get isTasksTabActive() {
        return this.activeRequirementsTab === 'tasks';
    }

    /**
     * Check if Approvals tab is active
     */
    get isApprovalsTabActive() {
        return this.activeRequirementsTab === 'approvals';
    }

    /**
     * Get Content tab class
     */
    get contentTabClass() {
        return this.isContentTabActive ? 'requirements-tab is-active' : 'requirements-tab';
    }

    /**
     * Get Tasks tab class
     */
    get tasksTabClass() {
        return this.isTasksTabActive ? 'requirements-tab is-active' : 'requirements-tab';
    }

    /**
     * Get Approvals tab class
     */
    get approvalsTabClass() {
        return this.isApprovalsTabActive ? 'requirements-tab is-active' : 'requirements-tab';
    }

    /**
     * Check if collection is locked (100% complete and approved)
     */
    get isLocked() {
        return this.collection?.isLocked === true;
    }

    /**
     * True when this collection uses a template with a rigid, non-modifiable structure
     */
    get hasRigidStructure() {
        return this.collectionType?.structureModifiable === false;
    }

    /**
     * Handle Content tab click
     */
    handleContentTabClick() {
        this.activeRequirementsTab = 'content';
    }

    /**
     * Handle Tasks tab click
     */
    handleTasksTabClick() {
        this.activeRequirementsTab = 'tasks';
    }

    /**
     * Handle Approvals tab click
     */
    handleApprovalsTabClick() {
        this.activeRequirementsTab = 'approvals';
    }

    /**
     * Handle Find Required Content button click (Agentic action)
     */
    handleFindRequiredContent() {
        // Placeholder for agentic find content functionality
        console.log('Find Required Content clicked - Agentic action triggered');
    }

    /**
     * Get collection metadata
     * @returns {Object|null}
     */
    get metadata() {
        return this.collection?.metadata || null;
    }

    /**
     * Check if collection has metadata
     * @returns {boolean}
     */
    get hasMetadata() {
        return this.metadata !== null;
    }

    /**
     * Get the collection type/template name for the header label
     * @returns {string}
     */
    get collectionTypeName() {
        return this.collectionType?.name || 'Collection';
    }

    /**
     * Get the collection kind (Freeform vs From Template)
     * @returns {string}
     */
    get collectionKind() {
        // If collection has a typeId, it's from a template
        return this.collection?.typeId ? 'From Template' : 'Freeform';
    }

    /**
     * Get the status value for display
     * @returns {string}
     */
    get statusValue() {
        if (this.isFromTemplate) {
            return this.completenessPercentage === 100 ? 'Approved' : 'In Progress';
        }
        return this.metadata?.status || '—';
    }

    /**
     * Get the status variant for display
     * @returns {string}
     */
    get statusVariantComputed() {
        if (this.isFromTemplate) {
            return this.completenessPercentage === 100 ? 'success' : 'warning';
        }
        return this.statusVariant;
    }

    /**
     * Current workflow stage (draft | review | approve | archive)
     * @returns {string}
     */
    get currentWorkflowStage() {
        const stage = this.collection?.workflowStage || this.collection?.metadata?.workflowStage || 'draft';
        const valid = WORKFLOW_STAGES.some(s => s.key === stage);
        return valid ? stage : 'draft';
    }

    /**
     * Index of current workflow stage (0=draft, 1=review, 2=approve, 3=archive)
     * @returns {number}
     */
    get _workflowStageIndex() {
        return WORKFLOW_STAGES.findIndex(s => s.key === this.currentWorkflowStage);
    }

    /** Step class for Draft (completed | active | default) */
    get workflowStepDraftClass() {
        const i = this._workflowStageIndex;
        const base = 'workflow-step';
        if (i > 0) return `${base} workflow-step-completed`;
        if (i === 0) return `${base} workflow-step-active`;
        return base;
    }

    /** Step class for Review */
    get workflowStepReviewClass() {
        const i = this._workflowStageIndex;
        const base = 'workflow-step';
        if (i > 1) return `${base} workflow-step-completed`;
        if (i === 1) return `${base} workflow-step-active`;
        return base;
    }

    /** Step class for Approve */
    get workflowStepApproveClass() {
        const i = this._workflowStageIndex;
        const base = 'workflow-step';
        if (i > 2) return `${base} workflow-step-completed`;
        if (i === 2) return `${base} workflow-step-active`;
        return base;
    }

    /** Step class for Archive */
    get workflowStepArchiveClass() {
        const i = this._workflowStageIndex;
        const base = 'workflow-step';
        if (i === 3) return `${base} workflow-step-active`;
        return base;
    }

    /** Show check icon for Draft (completed) */
    get isDraftStepCompleted() { return this._workflowStageIndex > 0; }
    /** Show check icon for Review (completed) */
    get isReviewStepCompleted() { return this._workflowStageIndex > 1; }
    /** Show check icon for Approve (completed) */
    get isApproveStepCompleted() { return this._workflowStageIndex > 2; }
    /** Archive never shows check (it's last or active) */
    get isArchiveStepCompleted() { return false; }

    /**
     * Label for the workflow action button (e.g. "Archive Collection" when stage is archive)
     * @returns {string}
     */
    get workflowActionLabel() {
        const stage = WORKFLOW_STAGES.find(s => s.key === this.currentWorkflowStage);
        return stage?.actionLabel || 'Send for review';
    }

    /**
     * Menu items for the workflow action dropdown
     * @returns {Array<{ value: string, label: string }>}
     */
    get workflowActionMenuItems() {
        const stage = this.currentWorkflowStage;
        if (stage === 'draft') {
            return [{ value: 'review', label: 'Send for review' }, { value: 'approve', label: 'Submit for approval' }];
        }
        if (stage === 'review') {
            return [{ value: 'approve', label: 'Submit for approval' }];
        }
        if (stage === 'approve') {
            return [{ value: 'complete', label: 'Complete Approval' }];
        }
        if (stage === 'archive') {
            return [{ value: 'archive', label: 'Archive Collection' }];
        }
        return [{ value: 'review', label: 'Send for review' }];
    }

    /**
     * Get the region value for display
     * @returns {string}
     */
    get regionValue() {
        return this.metadata?.region || '—';
    }

    /**
     * Get the template name for display
     * @returns {string}
     */
    get templateValue() {
        return this.collectionType?.name || '—';
    }

    /**
     * Check if collection has child collections
     * @returns {boolean}
     */
    get hasChildren() {
        return this.collection?.children && this.collection.children.length > 0;
    }

    /**
     * Get child collections with completeness data
     * @returns {Array}
     */
    get childCollections() {
        if (!this.collection?.children) {
            return [];
        }
        return this.collection.children.map(child => {
            const completeness = this.calculateChildCompleteness(child);
            return {
                ...child,
                hasCompleteness: completeness !== null,
                completenessPercentage: completeness?.percentage || 0,
                completenessLabel: completeness ? `${completeness.percentage}%` : null,
                progressStyle: completeness ? this.getProgressStyle(completeness.percentage) : ''
            };
        });
    }

    /**
     * Calculate completeness for a child collection (simplified inline version)
     * @param {Object} child - The child collection
     * @returns {Object|null}
     */
    calculateChildCompleteness(child) {
        if (!child?.isFromTemplate || !child?.typeId) {
            return null;
        }
        
        // Simple calculation based on content fulfillment
        const content = child.content || [];
        const completedTasks = child.completedTasks || [];
        const fulfilledCount = content.filter(c => c.fulfillsRequirement).length;
        
        // Estimate based on typical template requirements (simplified)
        const estimatedContentReq = 4;
        const estimatedTaskReq = 2;
        const totalRequired = estimatedContentReq + estimatedTaskReq;
        const totalCompleted = fulfilledCount + completedTasks.length;
        const percentage = Math.min(100, Math.round((totalCompleted / totalRequired) * 100));
        
        return { percentage };
    }

    /**
     * Get progress bar style for a given percentage
     * @param {number} percentage
     * @returns {string}
     */
    getProgressStyle(percentage) {
        return `width: ${percentage}%;`;
    }

    /**
     * Check if collection has content items
     * @returns {boolean}
     */
    get hasContent() {
        return this.collection?.content && this.collection.content.length > 0;
    }

    /**
     * Check if collection is empty (no children and no content)
     * @returns {boolean}
     */
    get isEmpty() {
        return !this.hasChildren && !this.hasContent;
    }

    /**
     * Get content count label
     * @returns {string}
     */
    get contentCountLabel() {
        const count = this.collection?.content?.length || 0;
        return `${count} item${count !== 1 ? 's' : ''}`;
    }

    /**
     * Get child collections count label
     * @returns {string}
     */
    get childCollectionsCount() {
        const count = this.collection?.children?.length || 0;
        return `${count}`;
    }

    /**
     * Get members list (sample data for prototype; or collection.members when available)
     * @returns {Array}
     */
    get members() {
        return this.collection?.members ?? SAMPLE_MEMBERS;
    }

    /**
     * Whether the collection has any members (for in-card empty state)
     * @returns {boolean}
     */
    get hasMembers() {
        return this.members && this.members.length > 0;
    }

    /**
     * Get members count label
     * @returns {string}
     */
    get membersCount() {
        return `${(this.members || []).length}`;
    }

    /**
     * Get content items with icons
     * @returns {Array}
     */
    get contentItems() {
        if (!this.collection?.content) {
            return [];
        }
        return this.collection.content.map(item => ({
            ...item,
            icon: 'doctype:unknown'
        }));
    }

    /**
     * Check if collection is from a template
     * @returns {boolean}
     */
    get isFromTemplate() {
        return this.collection?.isFromTemplate === true;
    }

    /**
     * Show dedicated empty state for template-based collection (no children, no content)
     * @returns {boolean}
     */
    get showTemplateEmptyState() {
        return this.isFromTemplate && this.isEmpty;
    }

    /**
     * Show template cards layout when collection has content or children
     * @returns {boolean}
     */
    get showTemplateCards() {
        return this.isFromTemplate && !this.isEmpty;
    }

    /**
     * Template name for empty state message
     * @returns {string}
     */
    get templateName() {
        return this.collectionType?.name || 'selected';
    }

    /**
     * Get completeness data for template-based collections
     * @returns {Object|null}
     */
    get completeness() {
        return this.completenessData || null;
    }

    /**
     * Get completeness percentage
     * @returns {number}
     */
    get completenessPercentage() {
        return this.completeness?.percentage || 0;
    }

    /**
     * Get completeness label
     * @returns {string}
     */
    get completenessLabel() {
        const data = this.completeness;
        if (!data) return '';
        const completed = data.totalCompleted || 0;
        const required = data.totalRequired || 0;
        return `${completed} of ${required} items complete`;
    }

    /**
     * Get progress ring style (stroke-dashoffset for SVG)
     * @returns {string}
     */
    get progressRingStyle() {
        const percentage = this.completenessPercentage;
        const circumference = 2 * Math.PI * 40; // radius = 40
        const offset = circumference - (percentage / 100) * circumference;
        return `stroke-dasharray: ${circumference}; stroke-dashoffset: ${offset};`;
    }

    /**
     * Get content checklist items (required content with completion status)
     * @returns {Array}
     */
    get contentChecklist() {
        const data = this.completeness;
        if (!data) return [];
        return data.contentChecklist.map(item => ({
            ...item,
            icon: item.isCompleted ? 'utility:check' : 'utility:steps',
            iconVariant: item.isCompleted ? 'success' : '',
            statusClass: item.isCompleted ? 'checklist-item is-complete' : 'checklist-item is-pending',
            statusLabel: item.isCompleted ? 'Added' : 'Required',
            addedFileName: item.fulfilledBy?.name || null,
            showMenu: this.openAddedBadgeMenuId === item.id
        }));
    }

    /**
     * Get approvals checklist items
     * @returns {Array}
     */
    get approvalsChecklist() {
        const data = this.completeness;
        if (!data) return [];
        return data.approvalsChecklist || [];
    }

    /**
     * Check if there are approvals
     * @returns {boolean}
     */
    get hasApprovals() {
        return this.approvalsChecklist.length > 0;
    }

    /**
     * Get approvals summary
     * @returns {string}
     */
    get approvalsSummary() {
        const data = this.completeness;
        if (!data) return '';
        const completed = data.approvalsCompleted || 0;
        const total = data.approvalsTotal || 0;
        return `${completed}/${total} complete`;
    }

    /**
     * Get collection content items (all content added to collection)
     * @returns {Array}
     */
    get collectionContent() {
        if (!this.collection?.content) {
            return [];
        }
        return this.collection.content.map(item => ({
            ...item,
            icon: 'doctype:unknown',
            showMenu: this.openContentMenuId === item.id
        }));
    }

    /**
     * Check if collection has content
     * @returns {boolean}
     */
    get hasCollectionContent() {
        return this.collectionContent.length > 0;
    }

    /**
     * Get collection content count
     * @returns {string}
     */
    get collectionContentCount() {
        const count = this.collectionContent.length;
        return `(${count})`;
    }

    /**
     * Get task checklist items
     * @returns {Array}
     */
    get taskChecklist() {
        const data = this.completeness;
        if (!data) return [];
        return data.taskChecklist.map(item => ({
            ...item,
            icon: item.isCompleted ? 'utility:check' : 'utility:clock',
            iconVariant: item.isCompleted ? 'success' : '',
            statusClass: item.isCompleted ? 'checklist-item is-complete' : 'checklist-item is-pending',
            statusLabel: item.isCompleted ? 'Complete' : 'Pending'
        }));
    }

    /**
     * Get additional content (not fulfilling any requirement)
     * @returns {Array}
     */
    get additionalContent() {
        const data = this.completeness;
        if (!data) return [];
        return data.additionalContent.map(item => ({
            ...item,
            icon: 'doctype:unknown'
        }));
    }

    /**
     * Check if there's additional content
     * @returns {boolean}
     */
    get hasAdditionalContent() {
        return this.additionalContent.length > 0;
    }

    /**
     * Get content summary for template collections
     * @returns {string}
     */
    get contentSummary() {
        const data = this.completeness;
        if (!data) return '';
        const completed = data.contentCompleted || 0;
        const total = data.contentTotal || 0;
        return `${completed}/${total} required`;
    }

    /**
     * Get task summary for template collections
     * @returns {string}
     */
    get taskSummary() {
        const data = this.completeness;
        if (!data) return '';
        const completed = data.tasksCompleted || 0;
        const total = data.tasksTotal || 0;
        return `${completed}/${total} complete`;
    }

    /**
     * Get child collections summary for template collections
     * @returns {string}
     */
    get childrenSummary() {
        const data = this.completeness;
        const total = data?.childrenTotal || 0;
        if (!data || total === 0) return '';
        const completed = data.childrenCompleted || 0;
        return `${completed}/${total} complete`;
    }

    /**
     * Check if collection has template-based children
     * @returns {boolean}
     */
    get hasTemplateChildren() {
        const data = this.completeness;
        return data && data.childrenTotal > 0;
    }

    /**
     * Check if there are any pending tasks
     * @returns {boolean}
     */
    get hasTasks() {
        return this.taskChecklist.length > 0;
    }

    /**
     * Get badge variant based on status
     * @returns {string}
     */
    get statusVariant() {
        const status = this.metadata?.status?.toLowerCase();
        switch (status) {
            case 'active':
            case 'approved':
                return 'success';
            case 'in progress':
            case 'under review':
                return 'warning';
            case 'required':
            case 'mandatory':
                return 'error';
            default:
                return 'neutral';
        }
    }

    /**
     * Handle click on child collection
     * @param {Event} event
     */
    handleChildClick(event) {
        const collectionId = event.currentTarget.dataset.id;
        this.dispatchEvent(new CustomEvent('collectionclick', {
            detail: { id: collectionId },
            bubbles: true,
            composed: true
        }));
    }

    /**
     * Handle keyboard navigation on child collection
     * @param {KeyboardEvent} event
     */
    handleChildKeyDown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.handleChildClick(event);
        }
    }

    /**
     * Handle click on template link
     * @param {Event} event
     */
    handleTemplateClick(event) {
        event.preventDefault();
        // Placeholder - would navigate to template details
        console.log('Template clicked:', this.collectionType?.name);
    }

    /**
     * Handle click on Open button to navigate to full record page
     * @param {Event} event
     */
    handleOpenRecord(event) {
        console.log('Open record:', this.collection?.id, this.collection?.name);
        this.dispatchEvent(new CustomEvent('viewdetails', {
            detail: { collectionId: this.collection?.id },
            bubbles: true,
            composed: true
        }));
    }

    /**
     * Handle content menu toggle
     * @param {Event} event
     */
    handleContentMenuToggle(event) {
        const contentId = event.currentTarget.dataset.id;
        if (this.openContentMenuId === contentId) {
            this.openContentMenuId = null;
        } else {
            this.openContentMenuId = contentId;
            this.openAddedBadgeMenuId = null;
        }
    }

    /**
     * Handle remove content from collection
     * @param {Event} event
     */
    handleRemoveContent(event) {
        const contentId = event.currentTarget.dataset.id;
        console.log('Remove content:', contentId);
        this.openContentMenuId = null;
    }

    /**
     * Handle added badge click
     * @param {Event} event
     */
    handleAddedBadgeClick(event) {
        const itemId = event.currentTarget.dataset.id;
        if (this.openAddedBadgeMenuId === itemId) {
            this.openAddedBadgeMenuId = null;
        } else {
            this.openAddedBadgeMenuId = itemId;
            this.openContentMenuId = null;
        }
    }

    /**
     * Handle view content from badge menu
     * @param {Event} event
     */
    handleViewContent(event) {
        const itemId = event.currentTarget.dataset.id;
        console.log('View content:', itemId);
        this.openAddedBadgeMenuId = null;
    }

    /**
     * Handle replace content from badge menu
     * @param {Event} event
     */
    handleReplaceContent(event) {
        const itemId = event.currentTarget.dataset.id;
        console.log('Replace content:', itemId);
        this.openAddedBadgeMenuId = null;
    }

    /**
     * Handle remove required content from badge menu
     * @param {Event} event
     */
    handleRemoveRequiredContent(event) {
        const itemId = event.currentTarget.dataset.id;
        console.log('Remove required content:', itemId);
        this.openAddedBadgeMenuId = null;
    }

    /**
     * Handle click on content link – open content record in a new console tab
     * @param {Event} event
     */
    handleContentLinkClick(event) {
        event.preventDefault();
        const contentId = event.currentTarget.dataset.id;
        const content = this.collectionContent.find(c => c.id === contentId);
        if (content) {
            this.dispatchOpenContentRecord(content);
        }
    }

    /**
     * Dispatch opencontentrecord event for hierarchy to add a content-record tab
     * @param {Object} content - content item { id, name, contentType, ... }
     */
    dispatchOpenContentRecord(content) {
        this.dispatchEvent(new CustomEvent('opencontentrecord', {
            detail: {
                content: { ...content },
                parentCollectionId: this.collection?.id || null,
                parentCollectionName: this.collection?.name || ''
            },
            bubbles: true,
            composed: true
        }));
    }

    /**
     * Handle preview content
     * @param {Event} event
     */
    handlePreviewContent(event) {
        const contentId = event.currentTarget.dataset.id;
        const content = this.collectionContent.find(c => c.id === contentId);
        if (content) {
            this.previewContent = content;
            this.showPreviewModal = true;
        }
    }

    /**
     * Handle close preview modal
     */
    handleClosePreview() {
        this.showPreviewModal = false;
        this.previewContent = null;
    }

    /**
     * Handle modal backdrop click
     * @param {Event} event
     */
    handleModalClick(event) {
        if (event.target.classList.contains('preview-modal-backdrop')) {
            this.handleClosePreview();
        }
    }

    /**
     * Handle go to record from preview – open content record in a new console tab and close modal
     */
    handleGoToRecord() {
        if (this.previewContent) {
            this.dispatchOpenContentRecord(this.previewContent);
        }
        this.handleClosePreview();
    }
}
