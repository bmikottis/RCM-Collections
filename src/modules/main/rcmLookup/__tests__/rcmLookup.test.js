import { createElement } from 'lwc';
import RcmLookup from 'main/rcmLookup';

describe('main/rcmLookup', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders with default label and placeholder', () => {
        const el = createElement('main-rcm-lookup', { is: RcmLookup });
        el.options = [{ label: 'One', value: '1' }];
        document.body.appendChild(el);
        expect(el.label).toBe('Field Label');
        expect(el.placeholder).toBe('Placeholder text...');
        const labelEl = el.shadowRoot.querySelector('.rcm-lookup__label');
        expect(labelEl).toBeTruthy();
        expect(labelEl.textContent).toBe('Field Label');
    });

    it('renders required asterisk when required is true', () => {
        const el = createElement('main-rcm-lookup', { is: RcmLookup });
        el.required = true;
        el.options = [];
        document.body.appendChild(el);
        const required = el.shadowRoot.querySelector('.rcm-lookup__required');
        expect(required).toBeTruthy();
        expect(required.textContent).toBe('*');
    });

    it('renders supporting text when provided', () => {
        const el = createElement('main-rcm-lookup', { is: RcmLookup });
        el.options = [];
        el.supportingText = 'Search for an item';
        document.body.appendChild(el);
        const supporting = el.shadowRoot.querySelector('.rcm-lookup__supporting');
        expect(supporting).toBeTruthy();
        expect(supporting.textContent).toBe('Search for an item');
    });

    it('dispatches change event with value and name on option select', () => {
        const el = createElement('main-rcm-lookup', { is: RcmLookup });
        el.name = 'lookup';
        el.options = [{ label: 'Account A', value: 'a1' }];
        document.body.appendChild(el);
        const handler = jest.fn();
        el.addEventListener('change', handler);
        el.shadowRoot.querySelector('.rcm-lookup__input-wrap').click();
        const listbox = el.shadowRoot.querySelector('.rcm-lookup__listbox');
        expect(listbox).toBeTruthy();
        const option = el.shadowRoot.querySelector('.rcm-lookup__option');
        option.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler.mock.calls[0][0].detail).toEqual({ value: 'a1', name: 'lookup' });
    });

    it('shows search icon in input', () => {
        const el = createElement('main-rcm-lookup', { is: RcmLookup });
        el.options = [];
        document.body.appendChild(el);
        const icon = el.shadowRoot.querySelector('lightning-icon');
        expect(icon).toBeTruthy();
        expect(icon.iconName).toBe('utility:search');
    });
});
