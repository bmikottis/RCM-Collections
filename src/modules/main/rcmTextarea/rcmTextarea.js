import { LightningElement, api } from 'lwc';

/**
 * RCM Textarea – matches Figma design (node 1614:170773): field label, textarea, optional supporting text.
 * Supports Default, Error, and Disabled states. Uses SLDS design tokens.
 */
export default class RcmTextarea extends LightningElement {
    @api label = 'Field Label';
    @api required = false;
    @api placeholder = 'Placeholder Text';
    @api value = '';
    @api supportingText = '';
    @api name = '';
    @api disabled = false;
    @api rows = 3;
    @api maxLength;
    /** Error message when value is missing (required validation). */
    @api messageWhenValueMissing = '';

    /** When true, applies error state styling (border/background). */
    @api get hasError() {
        return this._hasError;
    }
    set hasError(val) {
        this._hasError = Boolean(val);
    }
    _hasError = false;

    get textareaId() {
        if (!this._textareaId) {
            this._textareaId = 'rcm-textarea-' + Math.random().toString(36).slice(2, 11);
        }
        return this._textareaId;
    }

    get supportingTextId() {
        return this.textareaId + '-supporting';
    }

    get hasSupportingText() {
        return typeof this.supportingText === 'string' && this.supportingText.length > 0;
    }

    get textareaClass() {
        const base = 'rcm-textarea__field';
        return this._hasError ? `${base} rcm-textarea__field_error` : base;
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
