import { LightningElement, track } from 'lwc';
import { 
    sampleCollections, 
    collectionTypes,
    findCollectionById, 
    getCollectionPath,
    getCollectionType,
    calculateCompleteness 
} from './sampleData';

/**
 * Main Collection Hierarchy component providing a split-view layout
 * with tree navigation on the left and detail panel on the right.
 */
export default class CollectionHierarchy extends LightningElement {
    @track selectedCollectionId = null;
    @track collectionsData = sampleCollections;
    @track expandedIds = new Set();
    
    @track showSearch = false;
    @track showFilter = false;
    @track searchTerm = '';
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

    /**
     * Toggle search input visibility
     */
    handleSearchToggle() {
        this.showSearch = !this.showSearch;
        if (this.showSearch) {
            this.showFilter = false;
        }
    }

    /**
     * Toggle filter panel visibility
     */
    handleFilterToggle() {
        this.showFilter = !this.showFilter;
        if (this.showFilter) {
            this.showSearch = false;
        }
    }

    /**
     * Handle search input change
     * @param {Event} event
     */
    handleSearchChange(event) {
        this.searchTerm = event.target.value;
        // TODO: Implement search filtering logic
        console.log('Search term:', this.searchTerm);
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

    /**
     * Handle New Collection button click
     */
    handleNewCollection() {
        console.log('New Collection clicked');
    }

    /**
     * Get console tabs with active state
     * @returns {Array}
     */
    get consoleTabsWithState() {
        return this.consoleTabs.map(tab => ({
            ...tab,
            isActive: tab.id === this.activeTabId,
            tabClass: tab.id === this.activeTabId ? 'console-tab is-active' : 'console-tab'
        }));
    }

    /**
     * Check if browser view should be shown (main tab active)
     * @returns {boolean}
     */
    get showBrowserView() {
        return this.activeTabId === 'main';
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
     * Handle console tab click
     * @param {Event} event
     */
    handleConsoleTabClick(event) {
        const tabId = event.currentTarget.dataset.tabId;
        this.activeTabId = tabId;
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
}
