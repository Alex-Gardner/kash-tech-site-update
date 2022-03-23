/* eslint-env es6 */
/* eslint-disable no-console */

const footerHolder = document.querySelector("#footer-holder");

const footerContent = document.createElement("footer");
footerContent.classList.add("site-footer");

var yearString = new Date().getFullYear();

footerContent.innerHTML = `

            <div class="wide-screen-holder">
                <div class="footer-content-holder">

                    <div class="footer-category-holder">
                        <p class="footer-category-title">
                            Quick Contact
                        </p>
                        <ul>
                            <li>
                                <a href="tel:+14077100548">
                                    407-710-0548
                                </a>
                            </li>
                            <li>
                                <a href="mailto:hr@kashtechllc.com">
                                    hr@kashtechllc.com
                                </a>
                            </li>
                            <li>
                                <address>
                                    KASH Tech LLC<br>
                                    250 International Parkway, <br>Suite #114<br>
                                    Lake Mary, FL 32746
                                </address>
                            </li>
                        </ul>
                    </div>

                    <div class="footer-category-holder">
                        <p class="footer-category-title">
                            Social
                        </p>
                        <ul>
                            <li>
                                <a target="_blank" href="https://www.linkedin.com/company/kash-tech-llc/">
                                    LinkedIn
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div class="footer-category-holder">
                        <p class="footer-category-title">
                            Our Services
                        </p>
                        <ul>
                            <li>
                                <a href="/consulting-services.html">
                                    Consulting
                                </a>
                            </li>
                            <li>
                                <a href="/analytics-services.html">
                                    Analytics
                                </a>
                            </li>
                            <li>
                                <a href="/data-services.html">
                                    Data
                                </a>
                            </li>
                            <li>
                                <a href="/application-development-services.html">
                                    Application Development
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div class="footer-category-holder">
                        <p class="footer-category-title">
                            Useful Links
                        </p>
                        <ul>
                            <li>
                                <a target="_blank" href="https://calendly.com/kashtechllc/15min">
                                    Schedule A Call
                                </a>
                            </li>
                            <li>
                                <a href="/company_about-us.html">
                                    About Us
                                </a>
                            </li>
                        </ul>
                    </div>

                </div>
                <p class="kashtech-copyright-notice">
                    © ${new Date().getFullYear()} KASH Tech, LLC
                </p>
            </div>
        
`;

footerHolder.append(footerContent);
