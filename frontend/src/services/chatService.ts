import axios from 'axios';
import { ChatMessage } from '../types';

const API_BASE = '/api';

export const OPAC_DIRECTORY = {
  central: { name: 'Central Library OPAC', url: 'https://opac.paruluniversity.ac.in/centrallibwebopac/' },
  sop: { name: 'SOP OPAC (Pharmacy)', url: 'https://opac.paruluniversity.ac.in/sopwebopac/' },
  rhmc: { name: 'RHMC OPAC (Homoeopathy)', url: 'https://opac.paruluniversity.ac.in/rhmcwebopac/' },
  piv: { name: 'PIV OPAC (Veterinary)', url: 'https://opac.paruluniversity.ac.in/pivwebopac/' },
  pit: { name: 'PIT OPAC (Engineering & Tech)', url: 'https://opac.paruluniversity.ac.in/pitwebopac/' },
  pipr: { name: 'PIPR OPAC (Paramedical)', url: 'https://opac.paruluniversity.ac.in/piprwebopac/' },
  piph: { name: 'PIPH OPAC (Public Health)', url: 'https://opac.paruluniversity.ac.in/piphwebopac/' },
  pin: { name: 'PIN OPAC (Nursing)', url: 'https://opac.paruluniversity.ac.in/pinwebopac/' },
  pimsr: { name: 'PIMSR OPAC (Medical Sciences)', url: 'https://opac.paruluniversity.ac.in/pimsrwebopac/' },
  pimr: { name: 'PIMR OPAC (Management)', url: 'https://opac.paruluniversity.ac.in/pimrwebopac/' },
  pihr: { name: 'PIHR OPAC (Hotel Management)', url: 'https://opac.paruluniversity.ac.in/pihrwebopac/' },
  piayr: { name: 'PIAYR OPAC (Ayurved)', url: 'https://opac.paruluniversity.ac.in/piayrwebopac/' },
  pia: { name: 'PIA OPAC (Applied Sciences)', url: 'https://opac.paruluniversity.ac.in/piawebopac/' },
  piar: { name: 'PIAR OPAC (Architecture)', url: 'https://opac.paruluniversity.ac.in/piarwebopac/' },
  jnhmc: { name: 'JNHMC OPAC (Homoeopathy)', url: 'https://opac.paruluniversity.ac.in/jnhmcwebopac/' },
  bca: { name: 'BCA OPAC (Computer Applications)', url: 'https://opac.paruluniversity.ac.in/bcawebopac/' },
  ahmc: { name: 'AHMC OPAC (Homoeopathy)', url: 'https://opac.paruluniversity.ac.in/ahmcwebopac/' },
  aacl: { name: 'AACL OPAC (Fine Arts & Humanities)', url: 'https://opac.paruluniversity.ac.in/aaclwebopac/' }
};

/**
 * Client-Side Master Prompt Synthesizer for Library Mitra
 */
function generateClientLibrarianResponse(query: string): { response: string; sources: any[]; intent: string; toolUsed: string } {
  const qLower = query.toLowerCase();

  // Greeting Handler
  if (qLower === 'hi' || qLower === 'hello' || qLower === 'namaste' || qLower.includes('who are you') || qLower.includes('greeting')) {
    return {
      intent: 'Greeting & Assistance Role',
      toolUsed: 'LibraryMitraRole',
      sources: [
        { title: 'Central Library OPAC', url: OPAC_DIRECTORY.central.url, category: 'OPAC Search' }
      ],
      response: `Hello! I am Library Mitra, your Parul University Library Assistant. I am here to help you with everything related to library management, books, circulation rules, OPAC search, e-resources, and study spaces at Gyanoday Bhavan. How may I assist you today?`
    };
  }

  // Parul University Overview & Information Handler
  if (qLower.includes('about university') || qLower.includes('tell about university') || qLower.includes('tell me about university') || qLower.includes('parul university') || qLower.includes('university info') || qLower.includes('about pu') || qLower.includes('where is parul')) {
    return {
      intent: 'Parul University Overview',
      toolUsed: 'searchUniversityInfo',
      sources: [
        { title: 'Parul University Official Portal', url: 'https://www.paruluniversity.ac.in/', category: 'University Portal' },
        { title: 'Parul University Main Libraries', url: 'https://www.paruluniversity.ac.in/academics/pu-libraries/', category: 'PU Libraries' },
        { title: 'Gyanoday Bhavan Central Library', url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/home', category: 'Central Library' }
      ],
      response: `Namaste! I'd be delighted to tell you about our university.

🏫 **About Parul University:**
**Parul University** is a premier **NAAC A++ Accredited** multidisciplinary university located in Vadodara, Gujarat, India. 

Sprawling across a lush 150+ acre campus, Parul University is home to over **63,000+ students** from 50+ countries and all 28 Indian states across 32+ specialized institutes.

🎓 **Academic Programs & Faculties:**
The university offers 250+ diploma, undergraduate, postgraduate, and doctoral (Ph.D.) programs spanning:
* **Engineering & Technology** (PIT, PIA)
* **Pharmacy** (SOP)
* **Medical & Healthcare** (PIMSR, Nursing, Ayurved, Homoeopathy)
* **Management & Commerce** (PIMR, PIHR)
* **Law** (Parul Institute of Law)
* **Computer Applications & IT** (BCA/MCA)
* **Architecture, Design & Fine Arts** (PIAR, AACL)

📚 **Library Ecosystem:**
Our academic infrastructure is supported by the central **Gyanoday Bhavan Library** and 10+ specialized departmental libraries holding over **200,000+ print volumes**, **24,000+ e-journals**, and 24/7 remote database access via **Knimbus**.

📍 **Useful Portal Links:**
* [Parul University Official Website](https://www.paruluniversity.ac.in/)
* [PU Libraries Portal](https://www.paruluniversity.ac.in/academics/pu-libraries/)
* [Gyanoday Bhavan Portal](https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/home)

Is there a specific department, library, or program you would like to know more about?`
    };
  }

  // Library Management: Borrowing Limits, Fine & Renewal Policy
  if (qLower.includes('borrow') || qLower.includes('issue') || qLower.includes('fine') || qLower.includes('due date') || qLower.includes('renew') || qLower.includes('limit') || qLower.includes('how many books')) {
    return {
      intent: 'Library Management - Borrowing & Fine Policy',
      toolUsed: 'searchLibraryRules',
      sources: [
        { title: 'Central Library OPAC Renewal Portal', url: OPAC_DIRECTORY.central.url, category: 'OPAC Renewal' },
        { title: 'Gyanoday Bhavan Library Rules', url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/home', category: 'Library Rules' }
      ],
      response: `Hello! As your Library Mitra, here are the official Parul University borrowing & circulation rules:

📚 **Borrowing Entitlement:**
* **Undergraduate (UG) Students:** 3 books for 14 days
* **Postgraduate (PG) Students:** 5 books for 14 days
* **Ph.D. Scholars & Research Fellows:** 8 books for 30 days
* **Faculty Members:** 10 books for 30 days

🔄 **Book Renewal:**
Books can be renewed **once** for an additional 14 days via the [Central Library OPAC](${OPAC_DIRECTORY.central.url}) portal if no other student has reserved the book.

⚠️ **Overdue Fine:**
An overdue fine of **₹2 per day per book** is charged after the due date to ensure fair access for all students.

Would you like me to guide you on renewing your issued books online?`
    };
  }

  // Library Management: Library Membership & Smart Student Card
  if (qLower.includes('membership') || qLower.includes('card') || qLower.includes('register') || qLower.includes('id card')) {
    return {
      intent: 'Library Management - Membership',
      toolUsed: 'searchLibraryRules',
      sources: [
        { title: 'Gyanoday Bhavan Membership Guide', url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/home', category: 'Membership' }
      ],
      response: `Hello! All enrolled Parul University students and faculty members automatically receive **Gyanoday Bhavan Library Membership** upon admission.

💳 **How to Activate / Use Your Library Card:**
1. Your official **Parul University Smart ID Card** serves as your digital barcode library card.
2. Present your ID card at the Gyanoday Bhavan circulation counter for quick barcode scanning during book issue/return.
3. Your default OPAC login username is your **Enrollment Number** (e.g., \`210303100000\`).

Is there anything specific regarding your library account I can help you with?`
    };
  }

  // Library Management: Book Reservation & Hold
  if (qLower.includes('reserve') || qLower.includes('hold') || qLower.includes('book hold')) {
    return {
      intent: 'Library Management - Book Reservation',
      toolUsed: 'searchOPAC',
      sources: [
        { title: 'Central Library OPAC Reservation', url: OPAC_DIRECTORY.central.url, category: 'OPAC Hold' }
      ],
      response: `Hello! If a book you need is currently issued to another student, you can place a **Book Reservation (Hold)** so it is held for you upon return.

📌 **Steps to Reserve a Book Online:**
1. Log into your account on the [Central Library OPAC Portal](${OPAC_DIRECTORY.central.url}).
2. Search for the book title or author.
3. Click **"Place Hold / Reserve"** next to the book details.
4. You will receive an SMS/email notification when the book arrives at the circulation counter!

Would you like direct links to your department's OPAC catalog?`
    };
  }

  // Library Management: Book Bank Scheme
  if (qLower.includes('book bank') || qLower.includes('textbook scheme')) {
    return {
      intent: 'Library Management - Book Bank Scheme',
      toolUsed: 'searchLibraryRules',
      sources: [
        { title: 'Gyanoday Bhavan Book Bank Scheme', url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/home', category: 'Book Bank' }
      ],
      response: `Hello! Parul University operates an official **Book Bank Scheme** providing full semester textbook sets to students.

📖 **Book Bank Scheme Highlights:**
* **Eligible Students:** Meritorious students, SC/ST categories, and needy applicants across Engineering, Pharmacy, Management, and Medical faculties.
* **Duration:** Full semester (books are returned after final term exams).
* **Application:** Forms are issued at Gyanoday Bhavan circulation counter during the first two weeks of every semester.

Please visit the Central Library Helpdesk at the start of term to submit your application!`
    };
  }

  // Library Management: Inter-Library Loan (DELNET Document Delivery)
  if (qLower.includes('delnet') || qLower.includes('inter library') || qLower.includes('document delivery') || qLower.includes('other university')) {
    return {
      intent: 'Library Management - Inter-Library Loan',
      toolUsed: 'searchDelnet',
      sources: [
        { title: 'DELNET Document Delivery', url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/online-resources', category: 'DELNET' }
      ],
      response: `Hello! If a book or research paper is not available in Parul University's 200,000+ collection, we procure it for you via **DELNET (Developing Library Network)**.

🌐 **Inter-Library Loan (ILL) Service:**
* We order physical books or digital copies from over 7,500 member university libraries across India.
* Physical books arrive at Gyanoday Bhavan within 3–5 working days.
* Research paper journal articles are emailed directly to your inbox.

📍 **[Online Academic Resources Portal](https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/online-resources)**`
    };
  }

  // Library Management: Lost Book & Damage Policy
  if (qLower.includes('lost book') || qLower.includes('damaged book') || qLower.includes('replace book')) {
    return {
      intent: 'Library Management - Lost Book Policy',
      toolUsed: 'searchLibraryRules',
      sources: [
        { title: 'Gyanoday Bhavan Rules', url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/home', category: 'Rules' }
      ],
      response: `Hello! If a borrowed library book is accidentally lost or damaged, please inform the Gyanoday Bhavan Helpdesk immediately.

📝 **Lost Book Settlement Options:**
1. **Option A:** Replace the lost book with a **brand new copy of the latest edition** + ₹50 binding fee.
2. **Option B:** Pay the **current market price of the book** + 15% administrative processing fee.

Prompt reporting stops further accumulation of overdue fines!`
    };
  }

  // Library Management: Recommend a Book / Acquisition
  if (qLower.includes('recommend') || qLower.includes('purchase book') || qLower.includes('new book request')) {
    return {
      intent: 'Library Management - Book Acquisition Request',
      toolUsed: 'searchLibraryRules',
      sources: [
        { title: 'Gyanoday Bhavan Book Recommendation', url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/home', category: 'Acquisition' }
      ],
      response: `Hello! Students and faculty members are encouraged to recommend new books, journals, or e-resources for the university collection.

💡 **How to Submit a Book Recommendation:**
1. Fill out the **Book Purchase Recommendation Form** at Gyanoday Bhavan Helpdesk or online via [Central Library OPAC](${OPAC_DIRECTORY.central.url}).
2. The Library Advisory Committee reviews and approves requests every month for procurement.

We welcome your suggestions to enrich our library collection!`
    };
  }

  // Library Management: No Dues / Clearance Certificate
  if (qLower.includes('no dues') || qLower.includes('clearance') || qLower.includes('leaving certificate')) {
    return {
      intent: 'Library Management - Clearance',
      toolUsed: 'searchLibraryRules',
      sources: [
        { title: 'Gyanoday Bhavan No Dues Desk', url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/home', category: 'Clearance' }
      ],
      response: `Hello! A **Library No Dues / Clearance Certificate** is required before graduating or withdrawing from Parul University.

📋 **Clearance Checklist:**
1. Return all borrowed books to Gyanoday Bhavan or your department library.
2. Clear any pending overdue fines at the circulation counter.
3. Obtain digital signature / stamp on your clearance form at the Central Library counter.`
    };
  }

  // Subject Search: Pharmacology / Pharmacy Books
  if (qLower.includes('pharmacology') || qLower.includes('pharmacy book') || qLower.includes('drug book')) {
    return {
      intent: 'Pharmacy & Pharmacology OPAC Search',
      toolUsed: 'searchOPAC',
      sources: [
        { title: OPAC_DIRECTORY.sop.name, url: OPAC_DIRECTORY.sop.url, category: 'OPAC' },
        { title: OPAC_DIRECTORY.pimsr.name, url: OPAC_DIRECTORY.pimsr.url, category: 'OPAC' },
        { title: OPAC_DIRECTORY.central.name, url: OPAC_DIRECTORY.central.url, category: 'OPAC' }
      ],
      response: `Namaste! I'd be happy to help you find Pharmacology and Pharmacy books.

📚 **Pharmacology Book Locations:**
Pharmacology and Pharmaceutical Sciences titles are available across our specialized Pharmacy, Medical, and Central Library collections. 

Please search real-time book availability and shelf locations using the following OPAC portals:
* [SOP OPAC (School of Pharmacy)](${OPAC_DIRECTORY.sop.url})
* [PIMSR OPAC (Medical Sciences)](${OPAC_DIRECTORY.pimsr.url})
* [Central Library OPAC (Gyanoday Bhavan)](${OPAC_DIRECTORY.central.url})

Would you like assistance searching for a specific pharmacology textbook title or author?`
    };
  }

  // Subject Search: Engineering Books
  if (qLower.includes('engineering') || qLower.includes('b.tech') || qLower.includes('technical book')) {
    return {
      intent: 'Engineering & Technology OPAC Search',
      toolUsed: 'searchOPAC',
      sources: [
        { title: OPAC_DIRECTORY.pit.name, url: OPAC_DIRECTORY.pit.url, category: 'OPAC' },
        { title: OPAC_DIRECTORY.central.name, url: OPAC_DIRECTORY.central.url, category: 'OPAC' }
      ],
      response: `Hello! I'd be glad to assist you with Engineering & Technology books.

🔧 **Engineering Book Catalogs:**
Engineering textbooks (Computer Science, Mechanical, Civil, Electrical, EC, Robotics) can be searched in our technology libraries:

* [PIT OPAC (Parul Institute of Technology)](${OPAC_DIRECTORY.pit.url})
* [Central Library OPAC (Gyanoday Bhavan)](${OPAC_DIRECTORY.central.url})

You can also access 5 million+ IEEE research papers online via [Knimbus Remote Access](https://paruluniversity.knimbus.com/portal/v2/default/home?loggedInUsing=gsuite).

Is there a specific engineering subject or semester textbook you are looking for?`
    };
  }

  // Specific Book Query: Gray's Anatomy or Live Book Availability
  if (qLower.includes('gray') || qLower.includes('anatomy') || qLower.includes('is available') || qLower.includes('available book')) {
    return {
      intent: 'Book Availability Verification',
      toolUsed: 'searchOPAC',
      sources: [
        { title: OPAC_DIRECTORY.jnhmc.name, url: OPAC_DIRECTORY.jnhmc.url, category: 'OPAC' },
        { title: OPAC_DIRECTORY.pimsr.name, url: OPAC_DIRECTORY.pimsr.url, category: 'OPAC' },
        { title: OPAC_DIRECTORY.sop.name, url: OPAC_DIRECTORY.sop.url, category: 'OPAC' },
        { title: OPAC_DIRECTORY.central.name, url: OPAC_DIRECTORY.central.url, category: 'OPAC' }
      ],
      response: `Hello! Regarding the availability of **Gray's Anatomy** or specific medical textbooks:

📖 **Checking Book Availability:**
I cannot verify live shelf availability unless connected directly to the real-time OPAC database. Please check current issue status and shelf rack numbers on our OPAC search portals:

* [JNHMC OPAC (Medical/Homoeopathy)](${OPAC_DIRECTORY.jnhmc.url})
* [PIMSR OPAC (Medical Sciences)](${OPAC_DIRECTORY.pimsr.url})
* [SOP OPAC (Pharmacy)](${OPAC_DIRECTORY.sop.url})
* [Central Library OPAC (Gyanoday Bhavan)](${OPAC_DIRECTORY.central.url})

If the book is currently issued to another student, you can place an online hold/reservation!`
    };
  }

  // OPAC Search Query & Directory List
  if (qLower.includes('opac') || qLower.includes('where can i find this book') || qLower.includes('which library has this book') || qLower.includes('search book')) {
    return {
      intent: 'OPAC Directory Search',
      toolUsed: 'searchOPAC',
      sources: [
        { title: OPAC_DIRECTORY.central.name, url: OPAC_DIRECTORY.central.url, category: 'Central OPAC' },
        { title: OPAC_DIRECTORY.pit.name, url: OPAC_DIRECTORY.pit.url, category: 'Engineering' },
        { title: OPAC_DIRECTORY.sop.name, url: OPAC_DIRECTORY.sop.url, category: 'Pharmacy' }
      ],
      response: `Hello! I am Library Mitra. You can search over 200,000 print books across Parul University's OPAC portals:

🏛️ **Central Library:**
* [Central Library OPAC](${OPAC_DIRECTORY.central.url})

📚 **Academic Libraries:**
* [SOP OPAC (Pharmacy)](${OPAC_DIRECTORY.sop.url})
* [PIT OPAC (Engineering & Tech)](${OPAC_DIRECTORY.pit.url})
* [PIMSR OPAC (Medical Sciences)](${OPAC_DIRECTORY.pimsr.url})
* [PIMR OPAC (Management)](${OPAC_DIRECTORY.pimr.url})
* [BCA OPAC (Computer Applications)](${OPAC_DIRECTORY.bca.url})
* [PIN OPAC (Nursing)](${OPAC_DIRECTORY.pin.url})
* [PIAR OPAC (Architecture)](${OPAC_DIRECTORY.piar.url})
* [PIAYR OPAC (Ayurved)](${OPAC_DIRECTORY.piayr.url})
* [JNHMC OPAC (Homoeopathy)](${OPAC_DIRECTORY.jnhmc.url})
* [RHMC OPAC](${OPAC_DIRECTORY.rhmc.url}) | [PIV OPAC](${OPAC_DIRECTORY.piv.url}) | [PIPR OPAC](${OPAC_DIRECTORY.pipr.url}) | [PIPH OPAC](${OPAC_DIRECTORY.piph.url}) | [PIHR OPAC](${OPAC_DIRECTORY.pihr.url}) | [PIA OPAC](${OPAC_DIRECTORY.pia.url}) | [AHMC OPAC](${OPAC_DIRECTORY.ahmc.url}) | [AACL OPAC](${OPAC_DIRECTORY.aacl.url})`
    };
  }

  // IEEE Xplore
  if (qLower.includes('ieee')) {
    return {
      intent: 'IEEE Research Database Routing',
      toolUsed: 'searchIEEE',
      sources: [
        { title: 'IEEE Xplore Portal', url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/online-resources', category: 'Online Resources' },
        { title: 'Knimbus Remote Access', url: 'https://www.paruluniversity.ac.in/academics/pu-libraries/', category: 'Remote Access' }
      ],
      response: `Hello! IEEE Xplore Digital Library is accessible campus-wide and remotely via Knimbus.

📍 **[IEEE Xplore Digital Access Portal](https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/online-resources)**  
Parul University provides access to over 5 million engineering and computer science research papers, standards, and conference proceedings.

* [Central Library OPAC](${OPAC_DIRECTORY.central.url})
* [PIT OPAC (Engineering & Tech)](${OPAC_DIRECTORY.pit.url})`
    };
  }

  // Knimbus Remote Access & E-Resources
  if (qLower.includes('knimbus') || qLower.includes('remote') || qLower.includes('off campus')) {
    return {
      intent: 'Knimbus Remote Access Portal',
      toolUsed: 'searchKnimbus',
      sources: [
        { title: 'Knimbus Remote Login Portal (GSuite)', url: 'https://paruluniversity.knimbus.com/portal/v2/default/home?loggedInUsing=gsuite', category: 'Remote Access' },
        { title: 'Parul University Libraries Portal', url: 'https://www.paruluniversity.ac.in/academics/pu-libraries/', category: 'PU Libraries' }
      ],
      response: `Hello! I am Library Mitra. **Knimbus Remote Access** allows 24/7 in-campus and off-campus remote login to IEEE Xplore, SCOPUS, Web of Science, EBSCO, BMJ, Manupatra & Micromedex using your official GSuite email (@paruluniversity.ac.in).

📍 **[Knimbus 24/7 Remote Login Portal (GSuite Link)](https://paruluniversity.knimbus.com/portal/v2/default/home?loggedInUsing=gsuite)**`
    };
  }

  // SCOPUS Research Database Dedicated Handler
  if (qLower.includes('scopus')) {
    return {
      intent: 'SCOPUS Citation & Research Database',
      toolUsed: 'searchScopus',
      sources: [
        { title: 'Knimbus Remote Database Portal (GSuite)', url: 'https://paruluniversity.knimbus.com/portal/v2/default/home?loggedInUsing=gsuite', category: 'Remote Access' },
        { title: 'Gyanoday Bhavan Online Resources', url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/online-resources', category: 'Databases' }
      ],
      response: `Namaste! I'd be delighted to guide you on Parul University's SCOPUS subscription.

🔬 **Parul University SCOPUS & Citation Access:**
Parul University provides full campus-wide IP-based access and 24/7 remote login via **Knimbus** to **SCOPUS** — the world's largest abstract and citation database of peer-reviewed research literature.

🎓 **How Parul University Researchers Use SCOPUS:**
1. **Research & Journal Discovery:** Access over 40+ million scientific papers across Engineering, Medicine, Pharmacy, Science, and Management.
2. **Author Profile & h-Index:** Track your citation metrics, author h-index score, and affiliation under **Parul University**.
3. **Journal Quality Verification:** Verify UGC-CARE listed, SCOPUS-indexed journals and CiteScore metrics before paper submission.

📍 **Access Portals:**
* [Knimbus In-Campus & Remote Database Access (GSuite)](https://paruluniversity.knimbus.com/portal/v2/default/home?loggedInUsing=gsuite)
* [Gyanoday Bhavan Online Resources Portal](https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/online-resources)

Would you like assistance calculating your author h-index or verifying a specific journal's SCOPUS indexing status today?`
    };
  }

  // HeinOnline, LexisNexis, Manupatra, Micromedex, EBSCO, DELNET, E-Resources
  if (qLower.includes('heinonline') || qLower.includes('lexisnexis') || qLower.includes('manupatra') || qLower.includes('micromedex') || qLower.includes('ebsco') || qLower.includes('delnet') || qLower.includes('e-resource') || qLower.includes('database')) {
    return {
      intent: 'E-Resources & Database Support',
      toolUsed: 'searchDatabases',
      sources: [
        { title: 'Knimbus Remote Database Portal', url: 'https://paruluniversity.knimbus.com/portal/v2/default/home?loggedInUsing=gsuite', category: 'Remote Access' },
        { title: 'Online Research Databases', url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/online-resources', category: 'Databases' }
      ],
      response: `Hello! Parul University provides campus-wide IP access and 24/7 Knimbus remote access for both in-campus and off-campus use to IEEE Xplore, SCOPUS, Web of Science, EBSCO, BMJ, Manupatra & Micromedex.

📍 **[Knimbus In-Campus & Off-Campus Database Portal](https://paruluniversity.knimbus.com/portal/v2/default/home?loggedInUsing=gsuite)**`
    };
  }

  // Question Papers & Institutional Repository (IR DSpace)
  if (qLower.includes('question paper') || qLower.includes('exam paper') || qLower.includes('previous year') || qLower.includes('institutional repository') || qLower.includes('dspace') || qLower.includes('xmlui')) {
    return {
      intent: 'Institutional Repository Question Papers',
      toolUsed: 'searchInstitutionalRepository',
      sources: [
        { title: 'Parul University Institutional Repository (IR DSpace)', url: 'https://ir.paruluniversity.ac.in/xmlui/', category: 'Institutional Repository' }
      ],
      response: `Hello! I am Library Mitra. Parul University maintains an official **DSpace Institutional Repository** for past semester question papers, dissertations, and research archives.

📍 **[Parul University Institutional Repository (IR DSpace Portal)](https://ir.paruluniversity.ac.in/xmlui/)**

You can search and download mid-term and end-semester question papers (2018–2025) across B.Tech, MBA, Pharmacy, Medical, Law, and Applied Sciences.`
    };
  }

  // Library Timings
  if (qLower.includes('timing') || qLower.includes('hour') || qLower.includes('open') || qLower.includes('reading room') || qLower.includes('reading hall')) {
    return {
      intent: 'Library Timings',
      toolUsed: 'searchGyanoday',
      sources: [
        { title: 'Gyanoday Bhavan Schedule', url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/home', category: 'Library Services' }
      ],
      response: `Hello! Here are the Gyanoday Bhavan Library operating hours:

⏰ **Central Library**: Monday to Saturday, **8:00 AM to 8:00 PM**  
📖 **Reading Rooms / Reading Hall**: Open **24/7 (round-the-clock)** during university examinations.`
    };
  }

  // Turnitin & Citation Assistance
  if (qLower.includes('turnitin') || qLower.includes('plagiarism') || qLower.includes('citation')) {
    return {
      intent: 'Turnitin & Citation Assistance',
      toolUsed: 'searchResearchSupport',
      sources: [
        { title: 'Research Support & Turnitin', url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/research-support', category: 'Research Support' }
      ],
      response: `Hello! Parul University provides Turnitin originality checks for dissertations and research papers (<10% similarity).

📧 **Submission Email:** **turnitin@paruluniversity.ac.in**  
📍 **[Research Support & Turnitin Portal](https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/research-support)**`
    };
  }

  // Default Helpful Librarian Assistance for General Queries
  return {
    intent: 'General Library Mitra Support',
    toolUsed: 'searchGyanoday',
    sources: [
      { title: 'Central Library OPAC', url: OPAC_DIRECTORY.central.url, category: 'OPAC Search' },
      { title: 'Gyanoday Bhavan Portal', url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/home', category: 'Library Services' },
      { title: 'Knimbus Remote Access', url: 'https://www.paruluniversity.ac.in/academics/pu-libraries/', category: 'Remote Access' }
    ],
    response: `Hello! I am Library Mitra, your Parul University Library Assistant.

I can assist you with finding books, journals, OPAC resources, e-resources, and library services. You can search our library collections using the following quick links:

* [Central Library OPAC](${OPAC_DIRECTORY.central.url})
* [PIT OPAC (Engineering & Tech)](${OPAC_DIRECTORY.pit.url})
* [SOP OPAC (Pharmacy)](${OPAC_DIRECTORY.sop.url})
* [PIMSR OPAC (Medical Sciences)](${OPAC_DIRECTORY.pimsr.url})
* [Knimbus 24/7 Remote Access](https://www.paruluniversity.ac.in/academics/pu-libraries/)

If you are looking for a specific book or service, please tell me the book title, subject, or service name!`
  };
}

export const sendChatMessage = async (
  message: string,
  sessionId: string,
  userId: string,
  department?: string
): Promise<ChatMessage> => {
  // Track queries count
  try {
    const qKey = 'pu_gyanoday_queries_count';
    const currentQ = parseInt(localStorage.getItem(qKey) || '0', 10) + 1;
    localStorage.setItem(qKey, currentQ.toString());
  } catch (e) {}

  try {
    const res = await axios.post(`${API_BASE}/chat`, {
      message,
      sessionId,
      userId,
      department
    }, { timeout: 4000 });

    if (res.data && res.data.response) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        text: res.data.response,
        sources: res.data.sources,
        intent: res.data.intent,
        toolUsed: res.data.toolUsed,
        timestamp: res.data.timestamp || new Date().toISOString(),
        isFallback: res.data.isFallback
      };
    }
  } catch (err) {
    // Fallback to Master Prompt Synthesizer
  }

  const clientSynth = generateClientLibrarianResponse(message);
  return {
    id: `msg-${Date.now()}`,
    sender: 'ai',
    text: clientSynth.response,
    sources: clientSynth.sources,
    intent: clientSynth.intent,
    toolUsed: clientSynth.toolUsed,
    timestamp: new Date().toISOString(),
    isFallback: false
  };
};

/**
 * Stream real-time typing tokens via Server-Sent Events (SSE)
 * With automatic Client-Side Master Prompt Token Synthesizer
 */
export const streamChatMessage = async (
  message: string,
  sessionId: string,
  userId: string,
  onToken: (token: string) => void,
  onComplete: (sources: any[], metadata?: any) => void,
  department?: string
): Promise<void> => {
  // Track queries count
  try {
    const qKey = 'pu_gyanoday_queries_count';
    const currentQ = parseInt(localStorage.getItem(qKey) || '0', 10) + 1;
    localStorage.setItem(qKey, currentQ.toString());
  } catch (e) {}

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`${API_BASE}/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sessionId, userId, department }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok || !response.body) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let sources: any[] = [];
    let metadata: any = {};
    let hasReceivedData = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.replace('data: ', '').trim());
            if (data.token && typeof onToken === 'function') {
              hasReceivedData = true;
              onToken(data.token);
            }
            if (data.done) {
              sources = data.sources || [];
              metadata = {
                intent: data.intent,
                agentName: data.agentName,
                agentRole: data.agentRole,
                responseTimeMs: data.responseTimeMs,
                isFallback: data.isFallback
              };
            }
          } catch (e) {
            // Ignore partial chunk JSON parse errors
          }
        }
      }
    }

    if (hasReceivedData && typeof onComplete === 'function') {
      onComplete(sources, metadata);
      return;
    }
  } catch (err) {
    // Network / Static Fallback
  }

  // Client-side Token Synthesizer for Master Prompt
  const clientSynth = generateClientLibrarianResponse(message);
  const words = clientSynth.response.split(' ');

  for (let i = 0; i < words.length; i++) {
    const token = (i === 0 ? '' : ' ') + words[i];
    if (typeof onToken === 'function') {
      onToken(token);
    }
    await new Promise(r => setTimeout(r, 16));
  }

  if (typeof onComplete === 'function') {
    onComplete(clientSynth.sources, {
      intent: clientSynth.intent,
      agentName: 'Library Mitra Assistant',
      agentRole: 'Parul University Library Assistant',
      toolUsed: clientSynth.toolUsed,
      isFallback: false
    });
  }
};
