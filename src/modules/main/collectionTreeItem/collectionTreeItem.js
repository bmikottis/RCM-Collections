import { LightningElement, api, track } from 'lwc';

/**
 * Generic document icon for all content items
 */
const GENERIC_DOCUMENT_ICON = 'doctype:unknown';

/**
 * Recursive tree item component for displaying collection hierarchy.
 * Supports expand/collapse, selection, and keyboard navigation.
 * Shows both child collections and content items with appropriate icons.
 */
export default class CollectionTreeItem extends LightningElement {
    @api item;
    @api selectedId;
    
    @track isExpanded = false;

    _expandedIds = [];
    _previousExpandedIdsLength = 0;

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
     * Check if this item has child collections
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
     * Check if this collection is from a template
     * @returns {boolean}
     */
    get isFromTemplate() {
        return this.item?.isFromTemplate === true;
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
     * Handle toggle expand/collapse
     * @param {Event} event
     */
    handleToggle(event) {
        event.stopPropagation();
        this.isExpanded = !this.isExpanded;
    }

    /**
     * Handle item selection
     * @param {Event} event
     */
    handleSelect(event) {
        event.stopPropagation();
        
        this.dispatchEvent(new CustomEvent('select', {
            detail: { 
                id: this.item.id,
                item: this.item
            },
            bubbles: true,
            composed: true
        }));
    }

    /**
     * Handle keyboard navigation
     * @param {KeyboardEvent} event
     */
    handleKeyDown(event) {
        switch (event.key) {
            case 'Enter':
            case ' ':
                event.preventDefault();
                this.handleSelect(event);
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
        }
    }

    /**
     * Handle selection events from child items
     * @param {CustomEvent} event
     */
    handleChildSelect(event) {
        // Event bubbles up, no need to re-dispatch
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
}
