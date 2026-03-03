import { LightningElement, api } from 'lwc';

/**
 * RCM Input – matches Figma design (node 1614:170488): field label, text input, optional supporting text.
 * Uses SLDS design tokens for spacing, border, and typography.
 */
export default class RcmInput extends LightningElement {
    @api label = 'Field Label';
    @api required = false;
    @api placeholder = 'Placeholder text...';
    @api value = '';
    @api supportingText = '';
    @api type = 'text';
    @api name = '';
    @api disabled = false;

    get inputId() {
        if (!this._inputId) {
            this._inputId = 'rcm-input-' + Math.random().toString(36).slice(2, 11);
        }
        return this._inputId;
    }

    get supportingTextId() {
        return this.inputId + '-supporting';
    }

    get hasSupportingText() {
        return typeof this.supportingText === 'string' && this.supportingText.length > 0;
    }

    handleInputChange(event) {
        this.dispatchEvent(
            new CustomEvent('change', {
                bubbles: true,
                composed: true,
                detail: { value: event.target.value, name: this.name }
            })
        );
    }
}
