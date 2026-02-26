import { LightningElement, track } from 'lwc';

/** Template list for list view (matches collectionTypes in sampleData) */
const TEMPLATES_LIST = [
    { id: 'ct-001', name: 'FDA NDA/BLA Submission', description: 'FDA New Drug Application or Biologics License Application. Full CTD-style grouping for launching a new drug.', structureModifiable: false },
    { id: 'ct-002', name: 'FDA Labeling (PI & Medication Guide)', description: 'Prescribing Information, Highlights, Patient Package Insert, and FDA-required Medication Guide.', structureModifiable: false },
    { id: 'ct-003', name: 'Clinical Trial Documentation', description: 'Protocols, ICFs, CRFs, and clinical study documentation with approval workflows for trials.', structureModifiable: false },
    { id: 'ct-004', name: 'Safety & Risk (REMS / RMP)', description: 'US REMS and/or EU Risk Management Plan, safety management plans, and periodic safety reports.', structureModifiable: true },
    { id: 'ct-005', name: 'FDA ANDA (Generic Drug)', description: 'Abbreviated New Drug Application for generic drugs. Required content and structure for FDA generic submissions.', structureModifiable: false },
    { id: 'ct-006', name: 'EMA CTD Submission', description: 'EMA Common Technical Document structure for EU centralized and national procedures (Modules 1–5).', structureModifiable: false },
    { id: 'ct-007', name: 'Drug Launch Content Package', description: 'Master grouping of all content needed for a new drug launch: labeling, submissions, safety, and launch materials.', structureModifiable: true },
    { id: 'ct-008', name: 'Internal Guidelines & SOPs', description: 'Company guidelines, SOPs, and working templates. Structure can be edited to match your organization.', structureModifiable: true }
];

/**
 * Standard list view page for Regulated Collection Template object.
 * Displays templates in a table with search and list view selector.
 */
export default class CollectionTemplatesListPage extends LightningElement {
    @track showMainTabDropdown = false;
    listViewSearchTerm = '';
    selectedListViewId = 'all';

    get collectionTemplatesListUrl() {
        return '/lightning/o/Regulated_Collection_Template__c/list';
    }

    /**
     * Templates to display
     */
    get templates() {
        return TEMPLATES_LIST.map(t => ({
            ...t,
            structureModifiable: t.structureModifiable ? 'Yes' : 'No'
        }));
    }

    /**
     * Filtered templates based on search
     */
    get filteredTemplates() {
        const term = (this.listViewSearchTerm || '').toLowerCase().trim();
        if (!term) return this.templates;
        return this.templates.filter(
            t => (t.name && t.name.toLowerCase().includes(term)) ||
                 (t.description && t.description.toLowerCase().includes(term))
        );
    }

    get hasTemplates() {
        return this.filteredTemplates.length > 0;
    }

    get listViewOptions() {
        return [
            { value: 'all', label: 'All' },
            { value: 'recent', label: 'Recently Viewed' }
        ];
    }

    handleSearchInput(event) {
        this.listViewSearchTerm = event.target.value;
    }

    handleListViewChange(event) {
        this.selectedListViewId = event.target.value;
    }

    handleRowClick(event) {
        const id = event.currentTarget.dataset.id;
        if (id) console.log('Open template:', id);
    }

    handleLinkClick(event) {
        event.preventDefault();
        const id = event.currentTarget.dataset.id;
        if (id) console.log('Open template:', id);
    }

    handleNew() {
        window.location.href = '/';
    }

    handleCollectionsClick(event) {
        event.preventDefault();
        this.showMainTabDropdown = false;
        window.top.location.href = new URL('/', window.location.origin).href;
    }

    handleCollectionTemplatesClick(event) {
        event.preventDefault();
        this.showMainTabDropdown = false;
        window.top.location.href = new URL(this.collectionTemplatesListUrl, window.location.origin).href;
    }

    handleMainTabChevronClick(event) {
        event.stopPropagation();
        this.showMainTabDropdown = !this.showMainTabDropdown;
    }

    handleNavDropdownClose() {
        this.showMainTabDropdown = false;
    }

    handleNavTabClick() {
        window.top.location.href = new URL('/', window.location.origin).href;
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
            window.top.location.href = new URL('/', window.location.origin).href;
        }
    }
}
