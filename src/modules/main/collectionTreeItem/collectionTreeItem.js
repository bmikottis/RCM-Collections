import { LightningElement, api, track } from 'lwc';

/** Must match collectionHierarchy.js — bypasses LWR synthetic shadow */
const RCM_TREE_SELECT_COLLECTION = 'rcm-tree-select-collection';
const RCM_TREE_OPEN_CONTENT_RECORD = 'rcm-tree-open-content-record';

/**
 * Generic document icon for all content items
 */
const GENERIC_DOCUMENT_ICON = 'doctype:unknown';

/**
 * Recursive tree item component for displaying collection hierarchy.
 * Supports expand/collapse, selection, and keyboard navigation.
 * Shows both subcollections and content items with appropriate icons.
 */
export default class CollectionTreeItem extends LightningElement {
    @api item;
    @api selectedId;

    _selectedCollectionIds = [];

    @track isExpanded = false;
    @track showAddMenu = false;

    _expandedIds = [];
    _previousExpandedIdsLength = 0;

    @api
    get selectedCollectionIds() {
        return this._selectedCollectionIds;
    }
    set selectedCollectionIds(value) {
        this._selectedCollectionIds = Array.isArray(value) ? value : [];
    }

    /**
     * Setter for expanded IDs - expands this item if its ID is in the list
     * Collapses all items if the list becomes empty (collapse all)
     */
    @api
    get expandedIds() {
        return this._expandedIds;
    }
    set expandedIds(value) {
        const prevLength = this._previousExpandedIdsLength;
        this._expandedIds = value || [];
        this._previousExpandedIdsLength = this._expandedIds.length;
        
        if (this._expandedIds.includes(this.item?.id)) {
            this.isExpanded = true;
        } else if (prevLength > 0 && this._expandedIds.length === 0) {
            this.isExpanded = false;
        }
    }

    /**
     * Check if this item has subcollections
     * @returns {boolean}
     */
    get hasChildren() {
        return this.item?.children && this.item.children.length > 0;
    }

    /**
     * Check if this item has content items
     * @returns {boolean}
     */
    get hasContent() {
        return this.item?.content && this.item.content.length > 0;
    }

    /**
     * Check if this item can be expanded (has children or content)
     * @returns {boolean}
     */
    get canExpand() {
        return this.hasChildren || this.hasContent;
    }

    /**
     * Inverse of canExpand for template conditionals
     * @returns {boolean}
     */
    get cannotExpand() {
        return !this.canExpand;
    }

    /**
     * Check if expanded content should be displayed
     * @returns {boolean}
     */
    get showExpanded() {
        return this.isExpanded && this.canExpand;
    }

    /**
     * Get content items with generic document icon
     * @returns {Array}
     */
    get contentItems() {
        if (!this.item?.content) {
            return [];
        }
        return this.item.content.map(content => ({
            ...content,
            icon: GENERIC_DOCUMENT_ICON
        }));
    }

    /**
     * Get the appropriate expand/collapse icon
     * @returns {string}
     */
    get expandIcon() {
        return this.isExpanded ? 'utility:chevrondown' : 'utility:chevronright';
    }

    /**
     * Get aria label for toggle button
     * @returns {string}
     */
    get toggleAriaLabel() {
        return this.isExpanded ? `Collapse ${this.item.name}` : `Expand ${this.item.name}`;
    }

    /**
     * Get the icon for this item (folder for collections - no circle background)
     * @returns {string}
     */
    get itemIcon() {
        return 'utility:open_folder';
    }

    /**
     * Check if this item is currently selected
     * @returns {boolean}
     */
    get isSelected() {
        return this.selectedId === this.item?.id;
    }

    /**
     * Check if this collection is checked (for multi-select)
     * @returns {boolean}
     */
    get itemChecked() {
        return this._selectedCollectionIds.includes(this.item?.id);
    }

    /**
     * Check if this collection is from a template
     * @returns {boolean}
     */
    get isFromTemplate() {
        return this.item?.isFromTemplate === true;
    }

    /**
     * Check if this item is a collection (not content)
     * @returns {boolean}
     */
    get isCollection() {
        return this.item?.id?.startsWith('col-') || this.item?.id?.startsWith('sub-');
    }

    /**
     * Check if this collection is locked (100% complete)
     * @returns {boolean}
     */
    get isLocked() {
        return this.item?.isLocked === true;
    }

    /**
     * Check if we should show the add button
     * @returns {boolean}
     */
    get showAddButton() {
        return this.isCollection && !this.isLocked;
    }

    /**
     * Check if we should show the locked icon
     * @returns {boolean}
     */
    get showLockedIcon() {
        return this.isCollection && this.isLocked;
    }

    /**
     * Get container class based on selection state
     * @returns {string}
     */
    get itemContainerClass() {
        return 'slds-tree__item-container';
    }

    /**
     * Get row class based on selection state
     * @returns {string}
     */
    get itemRowClass() {
        let baseClass = 'slds-tree__item tree-item-row';
        if (this.isSelected) {
            baseClass += ' slds-is-selected';
        }
        return baseClass;
    }

    /**
     * Prevent row select when clicking checkbox
     * @param {Event} event
     */
    handleCheckboxClick(event) {
        event.stopPropagation();
    }

    /**
     * Handle checkbox change – dispatch so parent can track selected collection ids
     * @param {Event} event
     */
    handleCheckboxChange(event) {
        event.stopPropagation();
        this.dispatchEvent(new CustomEvent('collectioncheck', {
            detail: { id: this.item.id, checked: event.target.checked },
            bubbles: true,
            composed: true
        }));
    }

    /**
     * Handle toggle expand/collapse
     * @param {Event} event
     */
    handleToggle(event) {
        event.stopPropagation();
        this.isExpanded = !this.isExpanded;
    }

    /**
     * Notify hierarchy to show collection workspace (folder row). Uses window — reliable under synthetic shadow.
     */
    dispatchSelectCollectionWindow() {
        if (typeof document === 'undefined') {
            return;
        }
        document.dispatchEvent(
            new CustomEvent(RCM_TREE_SELECT_COLLECTION, {
                bubbles: true,
                composed: true,
                detail: { id: this.item.id }
            })
        );
    }

    /**
     * Click folder row (not toggle/checkbox — those stopPropagation).
     * @param {Event} event
     */
    handleFolderRowClick(event) {
        event.stopPropagation();
        this.dispatchSelectCollectionWindow();
    }

    /**
     * Keyboard: Enter/Space selects folder; arrows expand/collapse.
     * @param {KeyboardEvent} event
     */
    handleKeyDown(event) {
        switch (event.key) {
            case 'Enter':
            case ' ':
                event.preventDefault();
                this.dispatchSelectCollectionWindow();
                break;
            case 'ArrowRight':
                if (this.hasChildren && !this.isExpanded) {
                    event.preventDefault();
                    this.isExpanded = true;
                }
                break;
            case 'ArrowLeft':
                if (this.isExpanded) {
                    event.preventDefault();
                    this.isExpanded = false;
                }
                break;
            default:
                break;
        }
    }

    /**
     * Public method to expand this item
     */
    @api
    expand() {
        this.isExpanded = true;
    }

    /**
     * Public method to collapse this item
     */
    @api
    collapse() {
        this.isExpanded = false;
    }

    /**
     * Handle add button click
     * @param {Event} event
     */
    handleAddButtonClick(event) {
        event.stopPropagation();
        this.showAddMenu = !this.showAddMenu;
    }

    /**
     * Handle add subcollection
     * @param {Event} event
     */
    handleAddChildCollection(event) {
        event.stopPropagation();
        this.showAddMenu = false;
        this.dispatchEvent(new CustomEvent('addchildcollection', {
            detail: { 
                parentId: this.item.id,
                parentName: this.item.name
            },
            bubbles: true,
            composed: true
        }));
    }

    /**
     * Handle add content
     * @param {Event} event
     */
    handleAddContent(event) {
        event.stopPropagation();
        this.showAddMenu = false;
        this.dispatchEvent(new CustomEvent('addcontent', {
            detail: { 
                collectionId: this.item.id,
                collectionName: this.item.name
            },
            bubbles: true,
            composed: true
        }));
    }

    /**
     * Open the Regulated Content record for a content item (left nav)
     * @param {Event} event
     */
    handleContentClick(event) {
        event.stopPropagation();
        const el = event.currentTarget;
        const contentId = el.dataset?.id || el.getAttribute('data-id');
        const content = (this.item?.content || []).find((c) => c.id === contentId);
        if (!content) {
            return;
        }
        const detail = {
            content: { ...content },
            parentCollectionId: this.item.id,
            parentCollectionName: this.item.name || ''
        };
        if (typeof document !== 'undefined') {
            document.dispatchEvent(
                new CustomEvent(RCM_TREE_OPEN_CONTENT_RECORD, {
                    bubbles: true,
                    composed: true,
                    detail
                })
            );
        }
    }

    /**
     * @param {KeyboardEvent} event
     */
    handleContentKeyDown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.stopPropagation();
            this.handleContentClick(event);
        }
    }
}
