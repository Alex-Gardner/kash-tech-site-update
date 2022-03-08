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

// h/t for hover interactions for details elements: https://www.codewall.co.uk/create-a-dropdown-navigation-menu-with-details-summary/

const mainNavSummaryElements = document.querySelectorAll('.main-nav__list-item__title')
const mainNavDetailsElements = document.querySelectorAll('.main-nav__list-item')
// Details content that is not in the "summary" element
const mainNavDetailsContents = document.querySelectorAll('.nav-item__sub-links')
var desktopResolution = window.matchMedia("(min-width: 900px)")


// https://css-tricks.com/working-with-javascript-media-queries/

function handleScreenSizeChange(e) {

    function closeAllDetails() {
        for (const detailsElement of mainNavDetailsElements) {
            if (detailsElement.open) {
                detailsElement.removeAttribute("open")
            }
        }
    }

  for (const summary of mainNavSummaryElements) {
    //   console.log('made event listeners')
    function handleSummaryMouseEnter(event) {
        closeAllDetails();
        summary.parentElement.setAttribute("open", "open");
    }
    function handleDetailsMouseLeave(event) {
        closeAllDetails();
    }
    summary.addEventListener("mouseenter", handleSummaryMouseEnter);
    // event => {
    //     closeAllDetails();
    //     summary.parentElement.setAttribute("open", "open");
    // }
    // when mouse leaves any content from details (except summary), close all open details
    mainNavDetailsContents.forEach(contentElement => {
            contentElement.addEventListener("mouseleave", handleDetailsMouseLeave);
            // function(event) {
            //     closeAllDetails();
            // }
        })

    if(!e.matches) {
        mainNavSummaryElements.forEach(summary => {
            summary.removeEventListener('mouseenter', handleSummaryMouseEnter);
            // console.log('removed summary event listeners')
        }) 
        
        mainNavDetailsContents.forEach(navContent => {
            navContent.removeEventListener('mouseleave', handleDetailsMouseLeave)
            // console.log('removed details event listeners')
        })
    }
        
    }
  
    // remove relevant event listeners
    //   mainNavSummaryElements.forEach(summary => {
    //       summary.removeEventListener('mouseenter', handleSummaryMouseEnter);
    //   }) 
      
    //   mainNavDetailsContents.forEach(navContent => {
    //       navContent.removeEventListener('mouseleave', handleDetailsMouseLeave)
    //   })
      
}
// Register event listener
window.addEventListener('resize', handleScreenSizeChange)

// Initial check
handleScreenSizeChange(desktopResolution)

// --------

// if (desktopResolution.matches) {
//     function closeAllDetails() {
//         for (const detailsElement of mainNavDetailsElements) {
//             if (detailsElement.open) {
//                 detailsElement.removeAttribute("open")
//             }
//         }
//     }
    
//     // when user hovers over the summary element, close all other open details and add the open attribute to the current details element
    
//     for (const summary of mainNavSummaryElements) {
//         summary.addEventListener("mouseenter", event => {
//             closeAllDetails();
//             summary.parentElement.setAttribute("open", "open");
//         });
//         // when mouse leaves any content from details (except summary), close all open details
//         mainNavDetailsContents.forEach(contentElement => {
//             contentElement.addEventListener("mouseleave", function(event) {
//                 closeAllDetails();
//             })
//         })
//     }
// }




