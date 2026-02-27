import { LightningElement, track } from 'lwc';
import { 
    sampleCollections, 
    collectionTypes,
    findCollectionById, 
    getCollectionPath,
    getCollectionType,
    calculateCompleteness,
    addRootCollection,
    buildNewCollectionFromTemplate,
    recommendContentForRequired
} from './sampleData';

/**
 * Main Collection Hierarchy component providing a split-view layout
 * with tree navigation on the left and detail panel on the right.
 */
export default class CollectionHierarchy extends LightningElement {
    @track selectedCollectionId = null;
    @track selectedCollectionIds = [];
    @track collectionsData = sampleCollections;
    @track expandedIds = new Set();
    
    @track showSearch = false;
    @track showFilter = false;
    @track searchTerm = '';
    @track showListViewsDropdown = false;
    @track showRailMenuDropdown = false;
    @track listViewSearchTerm = '';
    @track selectedListViewId = 'all';
    @track selectedTypeFilters = [];
    @track selectedStatusFilters = [];
    @track selectedContentTypes = [];
    @track contentTypeSearchTerm = '';
    @track showContentTypeDropdown = false;
    @track selectedOwnershipFilters = [];
    
    @track consoleTabs = [
        { id: 'main', label: 'Regulated Content Coll...', type: 'main', closable: false }
    ];
    @track activeTabId = 'main';
    @track showMainTabDropdown = false;
    @track showTemplatesList = false;
    @track templatesListSearchTerm = '';
    @track selectedTemplateIds = [];
    @track isRailExpanded = true;

    @track showCreateModal = false;
    @track createStep = 1;
    @track selectedTemplate = null;
    @track createSearchTerm = '';
    @track createForm = {
        name: '',
        status: 'Draft',
        region: 'Global',
        description: ''
    };

    renderedCallback() {
        const selectAll = this.template.querySelector('.list-view-checkbox[data-select="all"]');
        if (selectAll) {
            selectAll.indeterminate = this.isSomeTemplatesSelected;
        }
    }

    /**
     * Get root level collections for the tree
     * @returns {Array}
     */
    get rootCollections() {
        return this.collectionsData?.children || [];
    }

    /**
     * Get expanded IDs as an array for passing to child components
     * @returns {Array}
     */
    get expandedIdsArray() {
        return Array.from(this.expandedIds);
    }

    /**
     * Check if tree content should be shown (hidden when filter panel is open)
     * @returns {boolean}
     */
    get showTreeContent() {
        return !this.showFilter;
    }

    get treeRailWrapperClass() {
        return this.isRailExpanded ? 'tree-rail-wrapper' : 'tree-rail-wrapper tree-rail-wrapper_collapsed';
    }

    get treeRailClass() {
        return this.isRailExpanded ? 'tree-rail' : 'tree-rail tree-rail_collapsed';
    }

    get railCollapseIcon() {
        return this.isRailExpanded ? 'utility:chevronleft' : 'utility:chevronright';
    }

    get railCollapseAriaLabel() {
        return this.isRailExpanded ? 'Collapse left panel' : 'Expand left panel';
    }

    get railCollapseTitle() {
        return this.isRailExpanded ? 'Collapse left panel' : 'Expand left panel';
    }

    handleRailCollapseToggle() {
        this.isRailExpanded = !this.isRailExpanded;
    }

    /** Saved list views for the rail dropdown (Salesforce-style) */
    get railListViews() {
        return [
            { id: 'all', name: 'All Collections', pinned: false },
            { id: 'recent', name: 'Recently Viewed', pinned: true },
            { id: 'my', name: 'My Collections', pinned: false },
            { id: 'partner', name: 'All - Partner Collections', pinned: false },
            { id: 'active', name: 'All Active Collections', pinned: false },
            { id: 'inprogress', name: 'Status - In Progress', pinned: false }
        ];
    }

    get railFilteredListViews() {
        const term = (this.listViewSearchTerm || '').toLowerCase().trim();
        const list = this.railListViews || [];
        const filtered = !term ? list : list.filter(v => (v.name && v.name.toLowerCase().includes(term)));
        const selectedId = this.selectedListViewId;
        return filtered.map(v => ({ ...v, isSelected: v.id === selectedId }));
    }

    get currentListViewName() {
        const list = this.railListViews || [];
        const view = list.find(v => v.id === this.selectedListViewId);
        return view ? view.name : 'All Collections';
    }

    get railCollectionCount() {
        const roots = this.rootCollections || [];
        return roots.length;
    }

    get railUpdatedText() {
        return 'Updated a few seconds ago';
    }

    /**
     * Get search button class based on active state
     * @returns {string}
     */
    get searchButtonClass() {
        return this.showSearch ? 'icon-button icon-button-active' : 'icon-button';
    }

    /**
     * Get filter button class based on active state
     * @returns {string}
     */
    get filterButtonClass() {
        return this.showFilter ? 'icon-button icon-button-active' : 'icon-button';
    }

    get railFilterButtonClass() {
        return this.showFilter ? 'rail-icon-action rail-icon-action-active' : 'rail-icon-action';
    }

    /**
     * Get collection type filter options
     * @returns {Array}
     */
    get collectionTypeOptions() {
        const templateOptions = collectionTypes.map(type => ({
            label: type.name,
            value: type.id
        }));
        return [
            { label: 'Freeform (No Template)', value: 'freeform' },
            ...templateOptions
        ];
    }

    /**
     * Get status filter options
     * @returns {Array}
     */
    get statusOptions() {
        return [
            { label: 'Active', value: 'active' },
            { label: 'Draft', value: 'draft' },
            { label: 'In Progress', value: 'in-progress' },
            { label: 'Under Review', value: 'under-review' },
            { label: 'Approved', value: 'approved' }
        ];
    }

    /**
     * Get ownership filter options
     * @returns {Array}
     */
    get ownershipOptions() {
        return [
            { label: 'Collections I Own', value: 'owned' },
            { label: 'Collections Shared with Me', value: 'shared' },
            { label: 'All Collections', value: 'all' }
        ];
    }

    /**
     * Get content type filter options
     * @returns {Array}
     */
    get contentTypeOptions() {
        return [
            { label: 'Prescribing Information', value: 'prescribing-info' },
            { label: 'Patient Information Leaflet', value: 'patient-leaflet' },
            { label: 'Clinical Study Report', value: 'clinical-study' },
            { label: 'Informed Consent Form', value: 'consent-form' },
            { label: 'Adverse Event Report', value: 'adverse-event' },
            { label: 'Risk Management Plan', value: 'risk-management' },
            { label: 'Safety Data Sheet', value: 'safety-data' },
            { label: 'Labeling Artwork', value: 'labeling-artwork' },
            { label: 'Regulatory Correspondence', value: 'regulatory-correspondence' },
            { label: 'Training Material', value: 'training-material' }
        ];
    }

    /**
     * Check if content types are selected
     * @returns {boolean}
     */
    get hasSelectedContentTypes() {
        return this.selectedContentTypes.length > 0;
    }

    /**
     * Get selected content types as pills (max 3 visible)
     * @returns {Array}
     */
    get selectedContentTypePills() {
        const maxVisible = 3;
        return this.selectedContentTypes.slice(0, maxVisible).map(value => {
            const option = this.contentTypeOptions.find(opt => opt.value === value);
            return {
                value: value,
                label: option ? option.label : value,
                removeLabel: `Remove ${option ? option.label : value}`
            };
        });
    }

    /**
     * Check if there are more content types than visible
     * @returns {boolean}
     */
    get hasMoreContentTypes() {
        return this.selectedContentTypes.length > 3;
    }

    /**
     * Get count of additional content types
     * @returns {number}
     */
    get moreContentTypesCount() {
        return this.selectedContentTypes.length - 3;
    }

    /**
     * Get filtered content type options based on search term
     * Excludes already selected options
     * @returns {Array}
     */
    get filteredContentTypeOptions() {
        const searchLower = this.contentTypeSearchTerm.toLowerCase();
        return this.contentTypeOptions.filter(option => {
            const matchesSearch = option.label.toLowerCase().includes(searchLower);
            const notSelected = !this.selectedContentTypes.includes(option.value);
            return matchesSearch && notSelected;
        });
    }

    /**
     * Check if there are filtered content types to show
     * @returns {boolean}
     */
    get hasFilteredContentTypes() {
        return this.filteredContentTypeOptions.length > 0;
    }

    /**
     * Get the currently selected collection object
     * @returns {Object|null}
     */
    get selectedCollection() {
        if (!this.selectedCollectionId) {
            return null;
        }
        return findCollectionById(this.collectionsData, this.selectedCollectionId);
    }

    /**
     * Check if a collection is selected
     * @returns {boolean}
     */
    get hasSelectedCollection() {
        return this.selectedCollection !== null;
    }

    /**
     * Get the collection type for the selected collection
     * @returns {Object|null}
     */
    get selectedCollectionType() {
        if (!this.selectedCollection?.typeId) {
            return null;
        }
        return getCollectionType(this.selectedCollection.typeId);
    }

    /**
     * Get completeness data for the selected collection (if template-based)
     * @returns {Object|null}
     */
    get selectedCollectionCompleteness() {
        if (!this.selectedCollection) {
            return null;
        }
        return calculateCompleteness(this.selectedCollection);
    }

    /**
     * Get breadcrumb trail for the selected collection
     * @returns {Array}
     */
    get breadcrumbs() {
        if (!this.selectedCollectionId) {
            return [];
        }
        
        const path = getCollectionPath(this.collectionsData, this.selectedCollectionId);
        if (!path) {
            return [];
        }
        
        return path.map((item, index) => ({
            id: item.id,
            name: item.name,
            isLast: index === path.length - 1,
            isRoot: item.isRoot
        })).filter(crumb => !crumb.isRoot);
    }

    /**
     * Check if there are breadcrumbs to display
     * @returns {boolean}
     */
    get hasBreadcrumbs() {
        return this.breadcrumbs.length > 0;
    }

    /**
     * Handle collection selection from tree
     * @param {CustomEvent} event
     */
    handleCollectionSelect(event) {
        const { id } = event.detail;
        this.selectedCollectionId = id;
    }

    handleCollectionCheck(event) {
        const { id, checked } = event.detail;
        const set = new Set(this.selectedCollectionIds || []);
        if (checked) set.add(id);
        else set.delete(id);
        this.selectedCollectionIds = Array.from(set);
    }

    /**
     * Handle breadcrumb navigation click
     * @param {Event} event
     */
    handleBreadcrumbClick(event) {
        event.preventDefault();
        const collectionId = event.currentTarget.dataset.id;
        this.selectedCollectionId = collectionId;
    }

    /**
     * Handle collection click from detail panel (for navigating to children)
     * Automatically expands the tree to show the selected collection
     * @param {CustomEvent} event
     */
    handleCollectionDetailClick(event) {
        const { id } = event.detail;
        this.expandPathToCollection(id);
        this.selectedCollectionId = id;
    }

    /**
     * Expand all parent collections in the path to a given collection
     * @param {string} collectionId - The target collection ID
     */
    expandPathToCollection(collectionId) {
        const path = getCollectionPath(this.collectionsData, collectionId);
        if (path) {
            const newExpandedIds = new Set(this.expandedIds);
            path.forEach(item => {
                if (!item.isRoot) {
                    newExpandedIds.add(item.id);
                }
            });
            this.expandedIds = newExpandedIds;
        }
    }

    /**
     * Expand all tree items by collecting all collection IDs
     */
    handleExpandAll() {
        const allIds = this.getAllCollectionIds(this.collectionsData);
        this.expandedIds = new Set(allIds);
    }

    /**
     * Collapse all tree items
     */
    handleCollapseAll() {
        this.expandedIds = new Set();
    }

    /**
     * Recursively get all collection IDs in the hierarchy
     * @param {Object} collection - The collection to process
     * @returns {Array} Array of collection IDs
     */
    getAllCollectionIds(collection) {
        let ids = [];
        if (!collection.isRoot) {
            ids.push(collection.id);
        }
        if (collection.children) {
            collection.children.forEach(child => {
                ids = ids.concat(this.getAllCollectionIds(child));
            });
        }
        return ids;
    }

    /**
     * Public method to select a collection programmatically
     * @param {string} collectionId
     */
    selectCollection(collectionId) {
        this.selectedCollectionId = collectionId;
    }

    /**
     * Public method to clear selection
     */
    clearSelection() {
        this.selectedCollectionId = null;
    }

    /** Open/close list view selector dropdown; close menu when opening */
    handleRailListViewToggle() {
        this.showListViewsDropdown = !this.showListViewsDropdown;
        if (this.showListViewsDropdown) {
            this.showRailMenuDropdown = false;
        }
    }

    /** Open/close rail menu dropdown (New, Printable View, etc.); close list views when opening */
    handleRailMenuToggle() {
        this.showRailMenuDropdown = !this.showRailMenuDropdown;
        if (this.showRailMenuDropdown) {
            this.showListViewsDropdown = false;
        }
    }

    /** Select a list view from the dropdown */
    handleSelectListView(event) {
        const id = event.currentTarget.dataset.id;
        if (id) {
            this.selectedListViewId = id;
            this.showListViewsDropdown = false;
        }
    }

    /** Filter list views in dropdown by search */
    handleListViewsSearchInput(event) {
        this.listViewSearchTerm = event.target.value;
    }

    /** Close list views dropdown when clicking backdrop */
    handleRailListViewsBackdrop() {
        this.showListViewsDropdown = false;
    }

    /** Close rail menu when clicking backdrop */
    handleRailMenuBackdrop() {
        this.showRailMenuDropdown = false;
    }

    /** Refresh rail list (placeholder) */
    handleRailRefresh() {
        // TODO: reload collections if needed
    }

    /** Pin list view (placeholder – UI only for now) */
    handleRailPin() {
        // TODO: toggle pin state for current list view
    }

    handleRailMenuNew(event) {
        event.preventDefault();
        this.showRailMenuDropdown = false;
        this.handleNewCollection();
    }

    handleRailMenuPrintable(event) {
        event.preventDefault();
        this.showRailMenuDropdown = false;
        // TODO: printable view
    }

    handleRailMenuAssignLabel(event) {
        event.preventDefault();
        this.showRailMenuDropdown = false;
        // TODO: assign label
    }

    /**
     * Toggle filter panel visibility
     */
    handleFilterToggle() {
        this.showFilter = !this.showFilter;
    }

    /**
     * Handle search input change (rail "Search this list..." field)
     * @param {Event} event
     */
    handleSearchChange(event) {
        this.searchTerm = event.target.value;
    }

    /**
     * Handle collection type filter change
     * @param {Event} event
     */
    handleTypeFilterChange(event) {
        this.selectedTypeFilters = event.detail.value;
    }

    /**
     * Handle status filter change
     * @param {Event} event
     */
    handleStatusFilterChange(event) {
        this.selectedStatusFilters = event.detail.value;
    }

    /**
     * Handle ownership filter change
     * @param {Event} event
     */
    handleOwnershipFilterChange(event) {
        this.selectedOwnershipFilters = event.detail.value;
    }

    /**
     * Handle content type search input focus
     */
    handleContentTypeSearchFocus() {
        this.showContentTypeDropdown = true;
    }

    /**
     * Handle content type search input blur
     */
    handleContentTypeSearchBlur() {
        // Delay to allow click on dropdown option
        setTimeout(() => {
            this.showContentTypeDropdown = false;
        }, 200);
    }

    /**
     * Handle content type search input change
     * @param {Event} event
     */
    handleContentTypeSearchInput(event) {
        this.contentTypeSearchTerm = event.target.value;
        this.showContentTypeDropdown = true;
    }

    /**
     * Handle content type option click from dropdown
     * @param {Event} event
     */
    handleContentTypeOptionClick(event) {
        const selectedValue = event.currentTarget.dataset.value;
        if (selectedValue && !this.selectedContentTypes.includes(selectedValue)) {
            this.selectedContentTypes = [...this.selectedContentTypes, selectedValue];
        }
        this.contentTypeSearchTerm = '';
        this.showContentTypeDropdown = false;
    }

    /**
     * Handle removal of content type pill
     * @param {Event} event
     */
    handleRemoveContentType(event) {
        const valueToRemove = event.currentTarget.dataset.value;
        this.selectedContentTypes = this.selectedContentTypes.filter(
            value => value !== valueToRemove
        );
    }

    /**
     * Clear all filters
     */
    handleClearFilters() {
        this.selectedTypeFilters = [];
        this.selectedStatusFilters = [];
        this.selectedOwnershipFilters = [];
        this.selectedContentTypes = [];
        this.contentTypeSearchTerm = '';
    }

    /**
     * Apply filters and close filter panel
     */
    handleApplyFilters() {
        // TODO: Implement filter logic to filter the tree
        console.log('Applying filters:', {
            types: this.selectedTypeFilters,
            statuses: this.selectedStatusFilters
        });
        this.showFilter = false;
    }

    get createStepOne() {
        return this.createStep === 1;
    }

    get createStepTwo() {
        return this.createStep === 2;
    }

    get filteredTemplates() {
        const term = (this.createSearchTerm || '').toLowerCase().trim();
        const mapType = (t) => ({
            ...t,
            descriptionShort: (t.description || '').substring(0, 80),
            isRigidStructure: t.structureModifiable === false
        });
        if (!term) {
            return collectionTypes.map(mapType);
        }
        return collectionTypes
            .filter(t =>
                (t.name || '').toLowerCase().includes(term) ||
                (t.description || '').toLowerCase().includes(term)
            )
            .map(mapType);
    }

    get createFromScratchMatchesSearch() {
        const term = (this.createSearchTerm || '').toLowerCase().trim();
        if (!term) return true;
        return 'create from scratch'.includes(term) || 'free standing'.includes(term) || 'no template'.includes(term);
    }

    get selectedTemplateName() {
        return this.selectedTemplate ? this.selectedTemplate.name : 'None';
    }

    /** Placeholder for Collection Name when creating from template (e.g. naming example). */
    get createNamePlaceholder() {
        return (this.selectedTemplate && this.selectedTemplate.namingExample) || 'Enter collection name';
    }

    /** Help text for required naming structure when template defines it. Shown below Collection Name. */
    get createNameHelpText() {
        return (this.selectedTemplate && this.selectedTemplate.namingStructure) || null;
    }

    get statusOptionsForCreate() {
        return [
            { label: 'Draft', value: 'Draft' },
            { label: 'Active', value: 'Active' },
            { label: 'In Progress', value: 'In Progress' },
            { label: 'Under Review', value: 'Under Review' },
            { label: 'Approved', value: 'Approved' }
        ];
    }

    get regionOptionsForCreate() {
        return [
            { label: 'Global', value: 'Global' },
            { label: 'US', value: 'US' },
            { label: 'EU', value: 'EU' },
            { label: 'APAC', value: 'APAC' }
        ];
    }

    get createFormNameEmpty() {
        return !(this.createForm.name || '').trim();
    }

    /**
     * Handle New Collection button click
     */
    handleNewCollection() {
        this.showCreateModal = true;
        this.createStep = 1;
        this.selectedTemplate = null;
        this.createSearchTerm = '';
        this.createForm = { name: '', status: 'Draft', region: 'Global', description: '' };
    }

    handleCloseCreateModal() {
        this.showCreateModal = false;
        this.createStep = 1;
        this.selectedTemplate = null;
    }

    handleCreateBackdropClick(event) {
        if (event.target.classList.contains('create-modal-backdrop')) {
            this.handleCloseCreateModal();
        }
    }

    handleCreateModalClick(event) {
        event.stopPropagation();
    }

    handleCreateSearchChange(event) {
        this.createSearchTerm = event.target.value;
    }

    handleSelectFromScratch() {
        this.selectedTemplate = null;
        this.createStep = 2;
    }

    handleSelectTemplate(event) {
        const typeId = event.currentTarget.dataset.typeId;
        const template = collectionTypes.find(t => t.id === typeId);
        if (template) {
            this.selectedTemplate = template;
            this.createStep = 2;
        }
    }

    handleCreateBack() {
        this.createStep = 1;
    }

    handleCreateFormChange(event) {
        const field = event.target.dataset.field;
        const value = event.detail !== undefined ? event.detail.value : event.target.value;
        if (field !== undefined) {
            this.createForm = { ...this.createForm, [field]: value };
        }
    }

    handleCreateSave() {
        const name = (this.createForm.name || '').trim();
        if (!name) {
            return;
        }
        const newId = `col-new-${Date.now()}`;
        const metadata = {
            region: this.createForm.region || 'Global',
            status: this.createForm.status || 'Draft',
            description: this.createForm.description || ''
        };
        const newCollection = this.selectedTemplate
            ? buildNewCollectionFromTemplate(this.selectedTemplate, newId, name, metadata)
            : {
                id: newId,
                name,
                typeId: null,
                parentId: 'root',
                level: 1,
                isFromTemplate: false,
                metadata,
                content: [],
                children: [],
                members: []
            };
        this.collectionsData = addRootCollection(this.collectionsData, newCollection);
        this.expandedIds = new Set([...this.expandedIds, newId]);
        this.selectedCollectionId = newId;
        this.showCreateModal = false;
        this.createStep = 1;
        this.selectedTemplate = null;
        this.createForm = { name: '', status: 'Draft', region: 'Global', description: '' };
    }

    /**
     * Get console tabs with active state
     * @returns {Array}
     */
    get consoleTabsWithState() {
        return this.consoleTabs.map(tab => {
            const isMain = tab.id === 'main';
            const label = isMain && this.showTemplatesList ? 'Collection Templates' : tab.label;
            return {
                ...tab,
                label,
                isActive: tab.id === this.activeTabId,
                tabClass: tab.id === this.activeTabId ? 'console-tab is-active' : 'console-tab'
            };
        });
    }

    /**
     * Check if browser view should be shown (main tab active, not templates list)
     * @returns {boolean}
     */
    get showBrowserView() {
        return this.activeTabId === 'main' && !this.showTemplatesList;
    }

    /**
     * Check if templates list view should be shown in container
     * @returns {boolean}
     */
    get showTemplatesListView() {
        return this.activeTabId === 'main' && this.showTemplatesList;
    }

    /**
     * Templates for list view (from collection types)
     */
    get templatesForList() {
        return (collectionTypes || []).map(t => ({
            id: t.id,
            name: t.name,
            description: t.description || '—',
            structureModifiable: t.structureModifiable ? 'Yes' : 'No'
        }));
    }

    get filteredTemplatesForList() {
        const term = (this.templatesListSearchTerm || '').toLowerCase().trim();
        const list = !term ? this.templatesForList : this.templatesForList.filter(
            t => (t.name && t.name.toLowerCase().includes(term)) ||
                 (t.description && t.description.toLowerCase().includes(term))
        );
        const selectedSet = new Set(this.selectedTemplateIds || []);
        return list.map(t => ({ ...t, checked: selectedSet.has(t.id) }));
    }

    get hasTemplatesForList() {
        return this.filteredTemplatesForList.length > 0;
    }

    get templatesListMetadata() {
        const n = this.filteredTemplatesForList.length;
        const total = (this.templatesForList || []).length;
        const sorted = 'Sorted by Template Name';
        const filtered = total === n ? 'All' : 'Filtered';
        return `${n} item${n !== 1 ? 's' : ''} · ${sorted} · ${filtered} · Updated just now`;
    }

    get isAllTemplatesSelected() {
        const list = this.filteredTemplatesForList;
        if (!list.length) return false;
        const selected = new Set(this.selectedTemplateIds || []);
        return list.every(row => selected.has(row.id));
    }

    get isSomeTemplatesSelected() {
        const list = this.filteredTemplatesForList;
        if (!list.length) return false;
        const selected = new Set(this.selectedTemplateIds || []);
        const count = list.filter(row => selected.has(row.id)).length;
        return count > 0 && count < list.length;
    }

    /**
     * Check if record page view should be shown
     * @returns {boolean}
     */
    get showRecordPage() {
        const activeTab = this.consoleTabs.find(tab => tab.id === this.activeTabId);
        return activeTab?.type === 'record';
    }

    /**
     * Check if content record page view should be shown
     * @returns {boolean}
     */
    get showContentRecordPage() {
        const activeTab = this.consoleTabs.find(tab => tab.id === this.activeTabId);
        return activeTab?.type === 'content-record';
    }

    /**
     * Get content record data for the active content tab
     * @returns {Object|null}
     */
    get activeContentRecordData() {
        const activeTab = this.consoleTabs.find(tab => tab.id === this.activeTabId);
        if (activeTab?.type === 'content-record' && activeTab.content) {
            return activeTab.content;
        }
        return null;
    }

    /**
     * Get parent collection name for active content record tab
     * @returns {string}
     */
    get activeContentRecordParentName() {
        const activeTab = this.consoleTabs.find(tab => tab.id === this.activeTabId);
        return activeTab?.parentCollectionName || '';
    }

    /**
     * Get parent collection id for active content record tab
     * @returns {string|null}
     */
    get activeContentRecordParentId() {
        const activeTab = this.consoleTabs.find(tab => tab.id === this.activeTabId);
        return activeTab?.parentCollectionId || null;
    }

    /**
     * Get the collection for the active record page
     * @returns {Object|null}
     */
    get activeRecordCollection() {
        const activeTab = this.consoleTabs.find(tab => tab.id === this.activeTabId);
        if (activeTab?.type === 'record' && activeTab.collectionId) {
            return findCollectionById(this.collectionsData, activeTab.collectionId);
        }
        return null;
    }

    /**
     * Get the collection type for the active record page
     * @returns {Object|null}
     */
    get activeRecordCollectionType() {
        const collection = this.activeRecordCollection;
        if (collection?.typeId) {
            return getCollectionType(collection.typeId);
        }
        return null;
    }

    /**
     * Salesforce list view path for Regulated Collection Template object
     */
    get collectionTemplatesListUrl() {
        return '/lightning/o/Regulated_Collection_Template__c/list';
    }

    /**
     * Handle console tab click
     * @param {Event} event
     */
    handleConsoleTabClick(event) {
        const tabId = event.currentTarget.dataset.tabId;
        this.activeTabId = tabId;
        this.showMainTabDropdown = false;
    }

    /**
     * Handle main tab chevron click - toggle nav dropdown
     * @param {Event} event
     */
    /**
     * Main tab area (label + chevron) click – activate main tab and toggle dropdown
     */
    handleMainTabAreaClick(event) {
        this.activeTabId = 'main';
        this.showMainTabDropdown = !this.showMainTabDropdown;
    }

    /**
     * Main tab area keyboard – Enter/Space toggles dropdown
     */
    handleMainTabAreaKeyDown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.stopPropagation();
            this.activeTabId = 'main';
            this.showMainTabDropdown = !this.showMainTabDropdown;
        }
    }

    /**
     * Close main tab dropdown (e.g. when clicking outside)
     */
    handleNavDropdownClose() {
        this.showMainTabDropdown = false;
    }

    /**
     * Handle Regulated Content Collections menu click - show collections view in same container.
     */
    handleCollectionsClick(event) {
        event.preventDefault();
        this.showMainTabDropdown = false;
        this.showTemplatesList = false;
    }

    /**
     * Handle Collection Templates menu click - show list view in same container below nav.
     */
    handleCollectionTemplatesClick(event) {
        event.preventDefault();
        this.showMainTabDropdown = false;
        this.showTemplatesList = true;
    }

    handleTemplatesListSearchInput(event) {
        this.templatesListSearchTerm = event.target.value;
    }

    handleTemplatesSelectAll(event) {
        const checked = event.target.checked;
        const list = this.filteredTemplatesForList;
        const ids = list.map(r => r.id);
        const current = new Set(this.selectedTemplateIds || []);
        if (checked) {
            ids.forEach(id => current.add(id));
        } else {
            ids.forEach(id => current.delete(id));
        }
        this.selectedTemplateIds = Array.from(current);
    }

    handleTemplatesRowSelect(event) {
        event.stopPropagation();
        const id = event.target.dataset.id;
        const checked = event.target.checked;
        const current = new Set(this.selectedTemplateIds || []);
        if (checked) current.add(id);
        else current.delete(id);
        this.selectedTemplateIds = Array.from(current);
    }

    handleTemplatesRowCheckboxClick(event) {
        event.stopPropagation();
    }

    handleTemplatesListRowClick(event) {
        if (event.target.closest('.list-view-td-checkbox')) return;
        const id = event.currentTarget.dataset.id;
        if (id) console.log('Open template:', id);
    }

    handleTemplatesListLinkClick(event) {
        event.preventDefault();
        event.stopPropagation();
        const id = event.currentTarget.dataset.id;
        if (id) console.log('Open template:', id);
    }

    /**
     * Handle close tab click
     * @param {Event} event
     */
    handleCloseTab(event) {
        event.stopPropagation();
        const tabId = event.currentTarget.dataset.tabId;
        const tabIndex = this.consoleTabs.findIndex(tab => tab.id === tabId);
        
        if (tabIndex > -1) {
            this.consoleTabs = this.consoleTabs.filter(tab => tab.id !== tabId);
            
            if (this.activeTabId === tabId) {
                this.activeTabId = 'main';
            }
        }
    }

    /**
     * Handle view details from collection detail panel
     * @param {CustomEvent} event
     */
    handleViewDetails(event) {
        const { collectionId } = event.detail;
        const collection = findCollectionById(this.collectionsData, collectionId);
        
        if (collection) {
            const existingTab = this.consoleTabs.find(tab => tab.collectionId === collectionId);
            
            if (existingTab) {
                this.activeTabId = existingTab.id;
            } else {
                const newTabId = `record-${collectionId}`;
                const newTab = {
                    id: newTabId,
                    label: collection.name.length > 20 ? collection.name.substring(0, 20) + '...' : collection.name,
                    type: 'record',
                    collectionId: collectionId,
                    closable: true
                };
                this.consoleTabs = [...this.consoleTabs, newTab];
                this.activeTabId = newTabId;
            }
        }
    }

    /**
     * Handle view collection from record page (to navigate to another collection)
     * @param {CustomEvent} event
     */
    handleViewCollection(event) {
        const { collectionId } = event.detail;
        const collection = findCollectionById(this.collectionsData, collectionId);

        if (collection) {
            const existingTab = this.consoleTabs.find(tab => tab.collectionId === collectionId);

            if (existingTab) {
                this.activeTabId = existingTab.id;
            } else {
                const newTabId = `record-${collectionId}`;
                const newTab = {
                    id: newTabId,
                    label: collection.name.length > 20 ? collection.name.substring(0, 20) + '...' : collection.name,
                    type: 'record',
                    collectionId: collectionId,
                    closable: true
                };
                this.consoleTabs = [...this.consoleTabs, newTab];
                this.activeTabId = newTabId;
            }
        }
    }

    /**
     * Handle Find Required Content from collection detail – run AI recommendations and pass results back to detail modal
     * @param {CustomEvent} event - detail: { pendingRequiredItems, excludeContentIds }; target is the collection-detail component
     */
    handleFindRequiredContent(event) {
        const { pendingRequiredItems, excludeContentIds } = event.detail || {};
        const detail = event.target && typeof event.target.setFindRequiredSuggestionsAndOpen === 'function'
            ? event.target
            : this.template.querySelector('main-collection-detail');
        if (!detail) return;
        if (!pendingRequiredItems || pendingRequiredItems.length === 0) {
            detail.setFindRequiredSuggestionsAndOpen([]);
            return;
        }
        detail.setFindRequiredLoading();
        const excludeIds = new Set(excludeContentIds || []);
        const results = recommendContentForRequired(pendingRequiredItems, this.collectionsData, excludeIds);
        detail.setFindRequiredSuggestionsAndOpen(results);
    }

    /**
     * Handle "Try again" for a rejected suggestion: re-run recommendation for that one required item.
     * @param {CustomEvent} event - detail: { requiredItem, index }; target is the collection-detail component
     */
    handleFindRequiredContentTryAgain(event) {
        const { requiredItem, index, excludeContentId } = event.detail || {};
        const detail = event.target && typeof event.target.setFindRequiredSuggestionAtIndex === 'function'
            ? event.target
            : this.template.querySelector('main-collection-detail');
        if (!detail || !requiredItem || index == null) return;
        const excludeContentIds = (this.selectedCollection?.content || []).map(c => c.id);
        const excludeIds = new Set(excludeContentIds || []);
        if (excludeContentId) excludeIds.add(excludeContentId);
        const results = recommendContentForRequired([requiredItem], this.collectionsData, excludeIds);
        const newRow = results && results[0] && results[0].suggestedContent ? results[0] : null;
        detail.setFindRequiredSuggestionAtIndex(index, newRow);
    }

    /**
     * Handle open content record (from Collection Content card link or "Go to Record" in preview modal)
     * Adds a content-record tab and switches to it.
     * @param {CustomEvent} event - detail: { content, parentCollectionId, parentCollectionName }
     */
    handleOpenContentRecord(event) {
        const { content, parentCollectionId, parentCollectionName } = event.detail || {};
        if (!content?.id) return;

        const contentId = content.id;
        const existingTab = this.consoleTabs.find(
            tab => tab.type === 'content-record' && tab.content?.id === contentId
        );

        if (existingTab) {
            this.activeTabId = existingTab.id;
        } else {
            const tabId = `content-${contentId}`;
            const label = content.name && content.name.length > 20
                ? content.name.substring(0, 20) + '...'
                : (content.name || 'Content');
            const newTab = {
                id: tabId,
                label,
                type: 'content-record',
                content: { ...content },
                parentCollectionId: parentCollectionId || null,
                parentCollectionName: parentCollectionName || '',
                closable: true
            };
            this.consoleTabs = [...this.consoleTabs, newTab];
            this.activeTabId = tabId;
        }
    }
}
