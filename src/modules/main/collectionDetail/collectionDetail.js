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

/**
 * Collection Detail component displays information about a selected collection
 * including its metadata, child collections, and content items.
 */
export default class CollectionDetail extends LightningElement {
    @api collection;
    @api collectionType;
    @api completenessData;
    
    @track activeRequirementsTab = 'content'; // 'content' or 'tasks'

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
        return this.metadata?.status || '—';
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
     * Get members list (sample data for prototype)
     * @returns {Array}
     */
    get members() {
        return SAMPLE_MEMBERS;
    }

    /**
     * Get members count label
     * @returns {string}
     */
    get membersCount() {
        return `${SAMPLE_MEMBERS.length}`;
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
        return `${data.totalCompleted} of ${data.totalRequired} items complete`;
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
            addedFileName: item.fulfilledBy?.name || null
        }));
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
        return `${data.contentCompleted}/${data.contentTotal} required`;
    }

    /**
     * Get task summary for template collections
     * @returns {string}
     */
    get taskSummary() {
        const data = this.completeness;
        if (!data) return '';
        return `${data.tasksCompleted}/${data.tasksTotal} complete`;
    }

    /**
     * Get child collections summary for template collections
     * @returns {string}
     */
    get childrenSummary() {
        const data = this.completeness;
        if (!data || data.childrenTotal === 0) return '';
        return `${data.childrenCompleted}/${data.childrenTotal} complete`;
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
        // Placeholder - would navigate to full record page
        console.log('Open record:', this.collection?.id, this.collection?.name);
        this.dispatchEvent(new CustomEvent('openrecord', {
            detail: { id: this.collection?.id },
            bubbles: true,
            composed: true
        }));
    }
}
