import { LightningElement, api } from 'lwc';

/** RCM Lookup: label, search input with icon, listbox. Figma node 1614:171604. */
export default class RcmLookup extends LightningElement {
    @api label = 'Field Label';
    @api required = false;
    @api placeholder = 'Placeholder text...';
    /** Options: [{ label, value, iconName? }, ...] */
    @api options = [];
    @api value = '';
    @api supportingText = '';
    @api name = '';
    @api disabled = false;
    @api hasError = false;

    _inputValue = '';
    _isOpen = false;
    _highlightedIndex = -1;

    get inputId() {
        if (!this._inputId) this._inputId = 'rcm-lookup-' + Math.random().toString(36).slice(2, 11);
        return this._inputId;
    }
    get listboxId() { return this.inputId + '-listbox'; }
    get supportingTextId() { return this.inputId + '-supporting'; }

    get inputValue() {
        if (this.value) {
            const selected = this._optionByValue(this.value);
            if (selected) return selected.label;
        }
        return this._inputValue !== undefined ? this._inputValue : '';
    }
    set inputValue(v) { this._inputValue = v; }

    get isOpen() { return this._isOpen; }
    get isOpenAndHasOptions() { return this._isOpen && this.filteredOptions.length > 0; }
    get hasSupportingText() { return typeof this.supportingText === 'string' && this.supportingText.length > 0; }

    get supportingClass() {
        const base = 'rcm-lookup__supporting';
        return this.hasError ? base + ' rcm-lookup__supporting_error' : base;
    }

    get activeDescendantId() {
        if (!this._isOpen || this._highlightedIndex < 0) return '';
        const opts = this._normalizedOptions();
        const opt = opts[this._highlightedIndex];
        return opt ? this.listboxId + '-opt-' + this._highlightedIndex : '';
    }

    _optionByValue(val) {
        const opts = this._normalizedOptions();
        return opts.find(o => o.value === val) || null;
    }

    _normalizedOptions() {
        const raw = Array.isArray(this.options) ? this.options : [];
        return raw.map(o => (typeof o === 'object' && o !== null && 'label' in o && 'value' in o)
            ? { label: String(o.label), value: String(o.value), iconName: o.iconName || '' }
            : null).filter(Boolean);
    }

    get filteredOptions() {
        const opts = this._normalizedOptions();
        const q = (this._inputValue === undefined ? '' : String(this._inputValue)).trim().toLowerCase();
        const filtered = q ? opts.filter(o => o.label.toLowerCase().includes(q)) : opts;
        return filtered.map((o, i) => {
            const base = 'rcm-lookup__option';
            const highlighted = i === this._highlightedIndex ? ' rcm-lookup__option_highlighted' : '';
            return {
                ...o,
                selected: o.value === this.value,
                optionId: this.listboxId + '-opt-' + i,
                optionClass: base + highlighted
            };
        });
    }

    connectedCallback() {
        const selected = this._optionByValue(this.value);
        this._inputValue = selected ? selected.label : '';
    }

    handleInputWrapClick() {
        if (this.disabled) return;
        this._isOpen = true;
        this._highlightedIndex = 0;
    }

    handleInput(event) {
        this._inputValue = event.target.value;
        this._isOpen = true;
        this._highlightedIndex = 0;
    }

    handleFocus() {
        if (this.disabled) return;
        this._isOpen = true;
        this._highlightedIndex = 0;
    }

    handleBlur() {
        setTimeout(() => {
            this._isOpen = false;
            this._highlightedIndex = -1;
        }, 150);
    }

    handleOptionSelect(event) {
        event.preventDefault();
        const val = event.currentTarget.dataset.value;
        const opts = this._normalizedOptions();
        const opt = opts.find(o => String(o.value) === val);
        if (opt) {
            this._inputValue = opt.label;
            this._isOpen = false;
            this._dispatchChange(opt.value);
        }
    }

    handleKeyDown(event) {
        const opts = this.filteredOptions;
        const n = opts.length;
        if (n === 0) return;
        const key = event.key;
        if (key === 'ArrowDown') {
            event.preventDefault();
            this._highlightedIndex = (this._highlightedIndex + 1) % n;
        } else if (key === 'ArrowUp') {
            event.preventDefault();
            this._highlightedIndex = this._highlightedIndex <= 0 ? n - 1 : this._highlightedIndex - 1;
        } else if (key === 'Enter' && this._highlightedIndex >= 0 && opts[this._highlightedIndex]) {
            event.preventDefault();
            this._inputValue = opts[this._highlightedIndex].label;
            this._isOpen = false;
            this._dispatchChange(opts[this._highlightedIndex].value);
        } else if (key === 'Escape') {
            this._isOpen = false;
            this._highlightedIndex = -1;
        }
    }

    _dispatchChange(value) {
        this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true, detail: { value, name: this.name } }));
    }
}
