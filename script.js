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
const navAndContactHolder = document.querySelector('#nav-and-contact-holder');
const partnerProgramButtons = document.querySelectorAll('.partner-button')
const partnerDetails = document.querySelectorAll('.partner-details-holder')

function toggleNavigation() {
    navAndContactHolder.classList.toggle('nav-open');
    navHamburgerButton.classList.toggle('nav-open');
}

// <element>.dataset.company
function updateActivePartner(companyInfo) {
    companyInfo.classList.add('active-company')
}
function changeActiveCompanyState(e) {
    for (const partnerInfo of partnerDetails) {
        if (e.currentTarget.dataset.company === partnerInfo.dataset.company) {
            partnerDetails.forEach(partnerCompany => {
                partnerCompany.classList.remove('active-company')
            })
            updateActivePartner(partnerInfo)
        }
    }
}
for (const partnerButton of partnerProgramButtons) {
    partnerButton.addEventListener('click', changeActiveCompanyState)
    // partnerButton.addEventListener('mouseenter', changeActiveCompanyState)
}

