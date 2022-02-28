// Web Components attempt
class Header extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallbak() {

        this.innerHTML = `

        `
    }
}


const linkElem = document.createElement('link');
linkElem.setAttribute('rel', 'stylesheet');
linkElem.setAttribute('href', 'style.css');

shadow.appendChild(linkElem);

customElements.define('header-component', Header);