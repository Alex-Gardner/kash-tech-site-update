// Header template to be appended

// const template = document.createElement('template');

// template.innerHTML = `
//     <header class="component-site-header">
//         <div class="logo-icon-holder"></div>
//         <div class="nav-and-contact-holder">
//             <nav></nav>
//         </div>
//     </header>
// `
// document.body.appendChild(template.content);

const navHamburgerButton = document.querySelector('#nav-hamburger-button');
const navAndContactHolder = document.querySelector('#nav-and-contat-holder');

function toggleNavigation() {
    navAndContactHolder.classList.toggle('nav-open');
    navHamburgerButton.classList.toggle('nav-open');
}