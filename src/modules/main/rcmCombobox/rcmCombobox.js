import { LightningElement, api } from 'lwc';

/** RCM Combobox: label, picklist combobox, optional supporting text. Figma node 1614:171138. */
export default class RcmCombobox extends LightningElement {
    @api label = 'Choose an item';
    @api required = false;
    @api placeholder = 'Select an option';
    @api options = [];
    @api value = '';
    @api supportingText = '';
    @api name = '';
    @api disabled = false;

    get comboboxId() {
        if (!this._comboboxId) {
            this._comboboxId = 'rcm-combobox-' + Math.random().toString(36).slice(2, 11);
        }
        return this._comboboxId;
    }

    get supportingTextId() {
        return this.comboboxId + '-supporting';
    }

    get hasSupportingText() {
        return typeof this.supportingText === 'string' && this.supportingText.length > 0;
    }

    handleChange(event) {
        const value = event.detail?.value ?? event.target?.value ?? '';
        this.dispatchEvent(
            new CustomEvent('change', {
                bubbles: true,
                composed: true,
                detail: { value, name: this.name }
            })
        );
    }
}
