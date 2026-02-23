import { LightningElement, api, track } from 'lwc';

export default class CollectionRecordPage extends LightningElement {
    @api collection;
    @api collectionType;
    
    @track activeTab = 'related';

    get collectionName() {
        return this.collection?.name || 'Collection';
    }

    get objectLabel() {
        return this.collection?.isFromTemplate ? 'Template Collection' : 'Collection';
    }

    get highlightFields() {
        const metadata = this.collection?.metadata || {};
        return [
            { label: 'Owner', value: metadata.owner || '—' },
            { label: 'Region', value: metadata.region || '—' },
            { label: 'Status', value: metadata.status || '—' },
            { label: 'Template', value: this.collectionType?.name || 'Freeform' }
        ];
    }

    get isRelatedTabActive() {
        return this.activeTab === 'related';
    }

    get isDetailsTabActive() {
        return this.activeTab === 'details';
    }

    get relatedTabClass() {
        return this.isRelatedTabActive ? 'record-tab is-active' : 'record-tab';
    }

    get detailsTabClass() {
        return this.isDetailsTabActive ? 'record-tab is-active' : 'record-tab';
    }

    get informationFields() {
        const metadata = this.collection?.metadata || {};
        return [
            { label: 'Collection Name', value: this.collection?.name || '—' },
            { label: 'Owner', value: metadata.owner || '—' },
            { label: 'Region', value: metadata.region || '—' },
            { label: 'Status', value: metadata.status || '—' },
            { label: 'Template', value: this.collectionType?.name || 'Freeform' },
            { label: 'Parent Collection', value: this.collection?.parentId === 'root' ? '—' : this.collection?.parentId }
        ];
    }

    get systemFields() {
        return [
            { label: 'Created By', value: 'System Administrator' },
            { label: 'Created Date', value: 'January 15, 2026' },
            { label: 'Last Modified By', value: 'System Administrator' },
            { label: 'Last Modified Date', value: 'February 18, 2026' }
        ];
    }

    get childCollections() {
        return this.collection?.children || [];
    }

    get hasChildCollections() {
        return this.childCollections.length > 0;
    }

    get childCollectionsCount() {
        return `(${this.childCollections.length})`;
    }

    get contentItems() {
        return (this.collection?.content || []).map(item => ({
            ...item,
            icon: 'doctype:unknown'
        }));
    }

    get hasContentItems() {
        return this.contentItems.length > 0;
    }

    get contentItemsCount() {
        return `(${this.contentItems.length})`;
    }

    handleRelatedTabClick() {
        this.activeTab = 'related';
    }

    handleDetailsTabClick() {
        this.activeTab = 'details';
    }

    handleEdit() {
        console.log('Edit clicked');
    }

    handleDelete() {
        console.log('Delete clicked');
    }

    handleChildClick(event) {
        const collectionId = event.currentTarget.dataset.id;
        this.dispatchEvent(new CustomEvent('viewcollection', {
            detail: { collectionId },
            bubbles: true,
            composed: true
        }));
    }

    handleContentClick(event) {
        const contentId = event.currentTarget.dataset.id;
        console.log('Content clicked:', contentId);
    }
}
