import { LitElement, html } from 'lit';
import { map } from 'lit/directives/map.js';
import styles from './ilw-grid.styles';
import './ilw-grid.css';

class Grid extends LitElement {
    static shadowRootOptions = {...LitElement.shadowRootOptions, slotAssignment: "manual"};
    static get properties() {
        return {
            theme: { type: String, attribute: true },
            innerwidth: { type: String, attribute: true },
            width: { type: String, attribute: true },
            padding: { type: String, attribute: true }
        };
    }

    static get styles() {
        return styles;
    }

    constructor() {
        super();
        this.theme = '';
        this.innerwidth = '250px';
        this.width = '';
        this.padding = '';
    }

    get _items() {
        return Array.from(this.children);
    } 

    refresh() {
        let items = this._items;
        let slots = Array.from(this.shadowRoot.querySelectorAll('slot'));
        if (items.length > slots.length) {
            let ul = this.shadowRoot.querySelector('ul.grid');
            for (let i = slots.length; i < items.length; i++) {
                let div = document.createElement('div');
                div.appendChild(document.createElement('slot'));
                let li = document.createElement('li');
                li.appendChild(div);
                ul.appendChild(li);
            }
        }
        this._refreshInternal();
    }

    _refreshInternal() {
        let items = this._items;
        let slots = Array.from(this.shadowRoot.querySelectorAll('slot'));
        for (let slot of slots) {
          if (items.length > 0) {
            slot.assign(items.shift());
          }
        }
    }

    updated(changed) {
        this._refreshInternal();
    }

    get paddingStyle() {
        return this.padding == '' ? '' : 'padding: ' + this.padding + ';';
    }

    get templateColumnStyle() {
        return `grid-template-columns: repeat(auto-fit, minmax(${this.innerwidth}, 1fr));`;
    }

    get outerWidth() {
      return this.width == 'full' || this.width == 'auto' ? 'fixed' : '';
    }
  
    get gridWidth() {
      return this.width == 'auto' ? 'fixed' : '';
    }

    render() {
      return html`
      <div class="grid-outer ${this.theme} ${this.outerWidth}">
          <ul class="grid ${this.gridWidth} ${this.align}" style="${this.templateColumnStyle} ${this.paddingStyle}">
            ${map(this._items, () => html`<li><div><slot></slot></div></li>`)}
          </ul>
      </div>
      `;
    }
}

customElements.define('ilw-grid', Grid);