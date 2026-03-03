import { createElement } from 'lwc';
import RcmCombobox from 'main/rcmCombobox';

describe('main/rcmCombobox', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders with default label and placeholder', () => {
        const el = createElement('main-rcm-combobox', { is: RcmCombobox });
        el.options = [{ label: 'One', value: '1' }];
        document.body.appendChild(el);
        expect(el.label).toBe('Choose an item');
        expect(el.placeholder).toBe('Select an option');
        const labelEl = el.shadowRoot.querySelector('.rcm-combobox__label');
        expect(labelEl).toBeTruthy();
        expect(labelEl.textContent).toBe('Choose an item');
    });

    it('renders required asterisk when required is true', () => {
        const el = createElement('main-rcm-combobox', { is: RcmCombobox });
        el.required = true;
        el.options = [];
        document.body.appendChild(el);
        const required = el.shadowRoot.querySelector('.rcm-combobox__required');
        expect(required).toBeTruthy();
        expect(required.textContent).toBe('*');
    });

    it('renders supporting text when provided', () => {
        const el = createElement('main-rcm-combobox', { is: RcmCombobox });
        el.options = [];
        el.supportingText = 'Pick one option';
        document.body.appendChild(el);
        const supporting = el.shadowRoot.querySelector('.rcm-combobox__supporting');
        expect(supporting).toBeTruthy();
        expect(supporting.textContent).toBe('Pick one option');
    });

    it('dispatches change event with value and name', () => {
        const el = createElement('main-rcm-combobox', { is: RcmCombobox });
        el.name = 'choice';
        el.options = [{ label: 'A', value: 'a' }];
        document.body.appendChild(el);
        const handler = jest.fn();
        el.addEventListener('change', handler);
        const combobox = el.shadowRoot.querySelector('lightning-combobox');
        combobox.dispatchEvent(
            new CustomEvent('change', { bubbles: true, composed: true, detail: { value: 'a' } })
        );
        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler.mock.calls[0][0].detail).toEqual({ value: 'a', name: 'choice' });
    });
});
