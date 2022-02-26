const template = document.createElement('template');

template.innerHTML = `
    <header class="component-site-header">
        <div class="logo-icon-holder"></div>
        <div class="nav-and-contact-holder">
            <nav></nav>
        </div>
    </header>
`
document.body.appendChild(template.content);