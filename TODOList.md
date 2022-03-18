Get a title for the main site ++
Add link to KASHTech icon file ++

Refactor company success to use quote elements ++

SVG Background Icons in services section
Partner Program button interactions
Services Section ++
Align button-links to the bottom of the container ++
Have at least 1.5rem of space between list of services & button-link ++

Nav button & open-close effects icon ++
Consulting Services Link Styled Correctly
watermark quote to right side in tablet and desktop sizes ++
Archivo Ampersand not great (Application development Services -- last item)
Fully integrate contact form

Links:
Home

- Who We Are
- Services
- Partner Program
- Leadership Team
- Customer Success
- Contact Us

Services

- Consulting Services
- Analytics Services
- Data Services
- Cloud Migration Services
- Application Development Services

Company

- \*\* No firm content
- (Customer Stories)
- Company Information?

Resources

-

Technology

- Languages and Frameworks
- Cloud Platforms
- Databases
- BI Technologies
- Data Management
- Technology Platforms
- Other Technologies

\*\*\*\* Z-index:
Mobile Nav UNDER header
Nav menu should disappear after clicking a link
Should offset "X" distance from the top
Close button on nav overlay?
Need a writeup on databricks service
Partner buttons change display state on hover
"Hover" (mouseenter) Effects on partner program removed. Seemingly creates bad UX
Give the buttons active state based on selected company

image srcset to provide fallback for non-webp formats

## Technology Page

Page title for technology page ++

TODO 03/08

- Desktop Navigation
- Contact us layout (desktop)
- consulting services link update
- content on technology page

\*\*\* 208: took of abs position \***\*\*\*\*** Any transform value on a parent (other than revert) causes the absolutely positioned element to select that as a new "positioned" parent

Nav items summary color change ++

Simple Details/summary elements working on desktop resolution ++

Change partner program to just "partners" ++

Add event listener for clicks outside the details element to close the active details element

Media query in JS for mouseenter and mouseleave events ++

Visible:
focus-within
hover(mouseenter)

Not visible:
mouseleave
blur

1. on mouseenter, clear all open detail elements -- then make the current one visible
1. on mouseleave, clear all open detail elements

## 03-08: Nav essentially works for each viewport size, but does not work well when transferring between them

Current page should have its nav link text in blue

## Max width on content in dropdown nav

[Nice to have: Learn with Jason Blend Effects](https://codepen.io/jlengstorf/pen/BambbKa)

Smooth scrolling behavior: works as intended on firefox (scrolls to links within a page are smooth. Links outside of pages are instant)

If we had a redo--
people, process, technology: images in HTML (aspect ratio 1, border-radius 50% -- or clip-path, idk)
"Process" gets pulled in as an embed svg

Hash links (/#...) scroll the top of the screen to the top of the link in question - the header appears /over/ the link content we wish to see.

Non-sequitur text for application development page

Add images to application development page (per reqs listed on Figma) ++

Consulting and Solutions (03-10) ++

hidden link (on mobile sizes) on top of top level nav links to the top of the pages ++

Design and Code:

    Solutions:
    Worker's Comp Insurance ++
    Sigma API Suite

    Consulting Services Page
        - sustainment section typo?

!!! Since there are no cloud migrations services, we lose the structure in the services section (3 items instead of 4)

SVG arrow in see more on customer reports
Hover effects on interactives

Dropdown media
Resources
Company
Services
Home

Proper focus states for interactable items
Active states for partner buttons
In-active states for partner buttons

Hero section media image (if necessary)
Need a databricks write-up of partner program
some visual break:

services list: 2 columns and shrunk
take out cloud services. center application dev seviecs

move the "process" venn circle to the top of the venn

"Junior" box in services section needs to have height updated
hover states on main page "Button-links"

Consulting services: pull list content into 2 columns

---

Notes on Sigma API Services
-Platform-neutal tool to facilitate data transfer between two different databases
-Easy to configure/operate WebService wrapper to help perform CRUD (Create, Read, Update, Delete) operations

- Wiring between services done by a time-based scheduler (part of the suite) (\*between what services?)
- API Service supports flexible mapping between the fields belonging to source and destination
- Unlimited # of configurations can be created and managed at both ends to support full blown data transfer between systems like:
  ERP VS CRM
  ERP VS Retail Sales
  Vendor Management Systems Vs Reporting Software
  Consolidation of data for Analytics
  Operable on any RDBMS/ NoSQL/ Oracle Exadata data source

-- Page 2 data flow diagram - highlight manual vs automated data merge?

Real-life use case: Data Synchonization between Retail Outlets
Have the particular care study featured on site?
Instant Notification - changes done in centralized system propagate back to subsystems (Point of Sale) locations

- Exadata Integration with Amazon S3
- GUI interface for simplicty of use

Advantages:

- Ability to scale horizontally. Leads to efficient peak-load handling
- Controllable data packet size (via configuration)
- Centralized monitoring, live tracking of data transfer via admin GUI on scheduled ETL operations
- Flexibility in config of data transfer components

---

KASH Tech in Database Management with Sigma API services

- Achieve efficient database integration and transfer accross a variety of platforms

Managed and Automated Data Synchronization!

KASH Tech operates a seamless system for the integration of database records from varied data source. With Sigma API, we provide the ability to both manually and automatically synchronize data stores across platform operations. The key features of this system are:

- Agnostic to platform
- Ability to scale horizontally for efficient load-handling
- Live tracking and centralized monitoring of scheduled data transfers via admin GUI
- Flexibility in config of data transfer operations
- Broadcast changes in the central data store at will with Instant Notification

&@ Get in Touch @& to upgrade your data reporting systems

---

03/16

- Sigma API Graphic design

* Integrate Denodo silver partner badge (1 img in JPEG, 1 in PDF -- same image)

Inventory:
inclusion statement
denodo partner banner

e-book (DV for dummies)
brochure (DV in integrated landscape)
denodo press release
healthcare LOB white paper
orlando/denodo press release
10 things you need to know brochure

USN & PW for UE
USN & PW for webfocus

Google information on databricks

Databricks data "lakehouse" platform allows for the analytical queries of data without the need for a traditional database schema. Simplify your architecture for myriad use cases, such as machine learning, data engineering, and BI.

Sigma API Service Suite comes with an API Service wrapper than can operate on any RDBMS/NoSQL data store. It acts as a WebService wrapper for any given tables/views/documents in the data store, based on configuration. Supports CRUD operations on a given hierarchy of tables and much such configuration. Data sets can be deployed on Sigma instace wrapping a given Data Store.

It also ships with a time-based scheduler service where the administrator can configure the source and destination tables/documents where the data has to be read or written - all based on configuration.

home page -- bottom margin on section title
Border distinguishing sections (gradient lines?)

integrate recognition badges (jpg/png) onto about us page
Diversity statement in about us page (Company top-level link)

search terms for stock images
research
library
papers
(look at the Shopify announcement for new themes for inspiration)

KASH Tech is also gratified to have been recognized with the following:

Application development image (change from PNC Bank to shoreline)
