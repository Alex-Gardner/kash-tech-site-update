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


// ----------------------------
const mainNavSummaryElements = document.querySelectorAll('.main-nav__list-item__title')
// Details content that is not in the "summary" element
const mainNavDetailsElements = document.querySelectorAll('.main-nav__list-item')
const mainNavDetailsContents = document.querySelectorAll('.nav-item__sub-links')

// when user hovers over the summary element, 
// add the open attribute to the details element

function closeAllDetails() {
    for (const detailsElement of mainNavDetailsElements) {
        if (detailsElement.open) {
            detailsElement.removeAttribute("open")
        }
    }
}

for (const summary of mainNavSummaryElements) {
    summary.addEventListener("mouseenter", event => {
        closeAllDetails();
        summary.parentElement.setAttribute("open", "open");
    });
    // any content  from details (except summary)
    mainNavDetailsContents.forEach(contentElement => {
        contentElement.addEventListener("mouseleave", function(event) {
            // summary.parentElement.removeAttribute("open")
            closeAllDetails();
        })
    })
}

// when the user moves the mouse away from the details element,
// perform the out-animation and delayed attribute-removal
// just like in the click handler
// details.addEventListener("mouseleave", event => {
// 	details.classList.add("summary-closing");
// 	setTimeout(function() {
// 		details.removeAttribute("open");
// 		details.classList.remove("summary-closing");
// 	}, 500);
// 	details.setAttribute("open", "open");
// });

// ----------------------------