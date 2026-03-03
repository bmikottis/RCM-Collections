import { createElement } from 'lwc';
import RcmTextarea from 'main/rcmTextarea';

describe('main/rcmTextarea', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders with default label and placeholder', () => {
        const el = createElement('main-rcm-textarea', { is: RcmTextarea });
        document.body.appendChild(el);
        expect(el.label).toBe('Field Label');
        expect(el.placeholder).toBe('Placeholder Text');
        const label = el.shadowRoot.querySelector('.rcm-textarea__label');
        expect(label).toBeTruthy();
        expect(label.textContent).toBe('Field Label');
    });

    it('renders required asterisk when required is true', () => {
        const el = createElement('main-rcm-textarea', { is: RcmTextarea });
        el.required = true;
        document.body.appendChild(el);
        const required = el.shadowRoot.querySelector('.rcm-textarea__required');
        expect(required).toBeTruthy();
        expect(required.textContent).toBe('*');
    });

    it('renders supporting text when provided', () => {
        const el = createElement('main-rcm-textarea', { is: RcmTextarea });
        el.supportingText = 'Helper text here';
        document.body.appendChild(el);
        const supporting = el.shadowRoot.querySelector('.rcm-textarea__supporting');
        expect(supporting).toBeTruthy();
        expect(supporting.textContent).toBe('Helper text here');
    });

    it('dispatches change event with value and name', () => {
        const el = createElement('main-rcm-textarea', { is: RcmTextarea });
        el.name = 'comments';
        document.body.appendChild(el);
        const handler = jest.fn();
        el.addEventListener('change', handler);
        const textarea = el.shadowRoot.querySelector('lightning-textarea');
        textarea.dispatchEvent(
            new CustomEvent('change', { bubbles: true, composed: true, detail: { value: 'new value' } })
        );
        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler.mock.calls[0][0].detail).toEqual({ value: 'new value', name: 'comments' });
    });

    it('applies error class when hasError is true', () => {
        const el = createElement('main-rcm-textarea', { is: RcmTextarea });
        el.hasError = true;
        document.body.appendChild(el);
        const field = el.shadowRoot.querySelector('lightning-textarea');
        expect(field.className).toContain('rcm-textarea__field_error');
    });
});
