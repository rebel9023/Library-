import { qdrant } from '../config/qdrant';
import { pool } from '../config/database';
import { env } from '../config/env';

export interface RetrievalChunk {
  id: string;
  title: string;
  url: string;
  category: string;
  content: string;
  score?: number;
}

const INITIAL_KNOWLEDGE_BASE: RetrievalChunk[] = [
  // 1. Campus Libraries Count & List
  {
    id: 'pu-library-count',
    title: 'Parul University Campus Libraries Count & Infrastructure',
    url: 'https://www.paruluniversity.ac.in/academics/pu-libraries/',
    category: 'Library Overview',
    content: 'Parul University campus features **10+ specialized institutional libraries** anchored by the central **Gyanoday Bhavan Library**, serving over 63,000 students and faculty. The campus library system includes: 1. Gyanoday Bhavan Central Library, 2. Faculty of Engineering & Technology Library, 3. Faculty of Management Studies Library, 4. Faculty of Pharmacy Library, 5. Parul Institute of Medical Sciences & Research Library, 6. Parul Institute of Law Library, 7. Parul Institute of Architecture & Planning Library, 8. Parul Institute of Nursing Library, 9. Parul Institute of Ayurved Library, 10. Parul Institute of Fine Arts Library. Together they hold over 200,000 print books, 24,000+ e-journals, and 100+ research databases.',
    score: 0.99
  },
  // 2. Gyanoday Bhavan Central Library Overview & Metrics
  {
    id: 'kb-gyanoday-overview',
    title: 'Gyanoday Bhavan Central Library Collections & Seating',
    url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/home',
    category: 'Library Overview',
    content: 'Gyanoday Bhavan is the main central library of Parul University. It comprises over **150,000+ books**, 450+ print journals & magazines, 10,000+ CDs/DVDs, 500+ seating capacity reading halls, 24/7 air-conditioned exam reading rooms, digital reference section, IEEE terminal lab, DSpace institutional repository, and quiet study zones.',
    score: 0.99
  },
  // 3. Timings & Hours
  {
    id: 'kb-timings',
    title: 'Gyanoday Bhavan Library Timings & Reading Hall',
    url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/home',
    category: 'Library Services',
    content: 'Operating hours: Central Library is open Monday to Saturday from 8:00 AM to 8:00 PM. The Reading Hall operates **24/7 (round-the-clock)** during Parul University mid-semester and end-semester examinations. Book circulation counter operates Monday to Saturday 9:00 AM to 6:00 PM.',
    score: 0.98
  },
  // 4. Video Lectures & Tutorials
  {
    id: 'kb-video',
    title: 'NPTEL, SWAYAM & Video Lecture Portal',
    url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/video-library',
    category: 'Educational Resources',
    content: 'Parul University e-library provides access to thousands of NPTEL, SWAYAM, and National Digital Library of India (NDLI) video lectures, online tutorials, and e-courses across engineering, management, basic sciences, pharmacy, law, and humanities cached locally on campus.',
    score: 0.98
  },
  // 5. Knimbus Remote Access
  {
    id: 'pu-knimbus',
    title: 'Knimbus Remote Access Portal & Mobile App',
    url: 'https://www.paruluniversity.ac.in/academics/pu-libraries/',
    category: 'Online Resources',
    content: 'Knimbus remote access portal provides 24/7 off-campus access to all Parul University subscribed e-resources, e-journals, and e-books. Login with your official student/faculty email credentials or download the Knimbus mLibrary mobile app on Android & iOS.',
    score: 0.98
  },
  // 6. IEEE Xplore
  {
    id: 'kb-ieee',
    title: 'IEEE Xplore Digital Library Access',
    url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/online-resources',
    category: 'Online Resources',
    content: 'Parul University provides campus-wide IP-based access and remote EZProxy/Knimbus access to IEEE Xplore Digital Library containing over 5 million engineering and computer science research papers, IEEE standards, and conference proceedings.',
    score: 0.98
  },
  // 7. SCOPUS & Web of Science
  {
    id: 'kb-scopus',
    title: 'SCOPUS & Web of Science Citation Databases',
    url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/online-resources',
    category: 'Online Resources',
    content: 'SCOPUS and Web of Science abstract and citation database access is enabled for all faculty members, Ph.D. scholars, B.Tech, MBA, and Master students at Parul University. Search peer-reviewed journals, h-index metrics, and citations.',
    score: 0.98
  },
  // 8. OPAC Catalog
  {
    id: 'pu-opac',
    title: 'OPAC Online Public Access Catalog & Book Search',
    url: 'https://www.paruluniversity.ac.in/academics/pu-libraries/',
    category: 'Library Services',
    content: 'OPAC enables real-time search across 200,000+ print books, reference volumes, journals, and dissertations in all Parul University campus libraries. Check book availability, location stack, and reservation status online.',
    score: 0.98
  },
  // 9. Turnitin Plagiarism
  {
    id: 'kb-turnitin',
    title: 'Turnitin Anti-Plagiarism Verification & Guidelines',
    url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/research-support',
    category: 'Research Support',
    content: 'Turnitin Originality Check is available for all Ph.D. dissertations, Master theses, and research papers. Submissions must maintain similarity scores below 10% as per UGC guidelines. Email your document to turnitin@paruluniversity.ac.in.',
    score: 0.98
  },
  // 10. Question Papers
  {
    id: 'kb-question',
    title: 'Past Examination Question Paper Archive (2018-2025)',
    url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/institutional-repository',
    category: 'Repository',
    content: 'Comprehensive digital archive of mid-term and end-semester examination question papers from 2018 to 2025 across B.Tech, MBA, Pharmacy, Medical, Law, and Applied Sciences. Searchable by course code and semester.',
    score: 0.98
  },
  // 11. Specialized Databases (EBSCO, J-Gate, BMJ, Manupatra, Micromedex, DELNET, Thieme)
  {
    id: 'pu-databases',
    title: 'EBSCO, J-Gate, BMJ, Manupatra, Micromedex & DELNET',
    url: 'https://www.paruluniversity.ac.in/academics/pu-libraries/',
    category: 'Online Resources',
    content: 'Specialized departmental research databases: EBSCO Business Source Ultimate for Management, Manupatra & Legal Databases for Law, BMJ Journals & Micromedex for Medical/Pharmacy, DELNET for Inter-Library Document Delivery, and Thieme eBooks.',
    score: 0.98
  },
  // 12. Book Bank Scheme & Circulation Rules
  {
    id: 'pu-bookbank',
    title: 'Book Bank Scheme & Borrowing Services',
    url: 'https://www.paruluniversity.ac.in/academics/pu-libraries/',
    category: 'Library Services',
    content: 'Book Bank Scheme provides full-semester textbook sets to undergraduate and postgraduate students. Standard borrowing limits: B.Tech/Diploma 3 books (14 days), Masters/Ph.D. 5 books (30 days), Faculty 10 books. Renewals available online via OPAC.',
    score: 0.98
  },
  // 13. Contact & Location Information
  {
    id: 'kb-contact',
    title: 'Central Library Helpdesk, Location & Contact Details',
    url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/contact-us',
    category: 'Contact Info',
    content: 'Gyanoday Bhavan Central Library | Email: library@paruluniversity.ac.in | Plagiarism Checks: turnitin@paruluniversity.ac.in | Toll-Free Admission Info: 1800-123-1104 | Address: Parul University, PO Limda, Waghodia, Vadodara, Gujarat 391760, India.',
    score: 0.98
  }
];

export class VectorService {
  public static async generateEmbedding(text: string): Promise<number[]> {
    return new Array(384).fill(0.1);
  }

  public static async searchKnowledge(
    query: string,
    category?: string,
    limit: number = 3
  ): Promise<RetrievalChunk[]> {
    const qLower = query.toLowerCase();

    // 1. How many libraries / library count / campus libraries
    if (qLower.includes('how many library') || qLower.includes('how many libraries') || qLower.includes('list of libraries') || qLower.includes('number of libraries') || qLower.includes('campus library') || qLower.includes('campus libraries')) {
      return [INITIAL_KNOWLEDGE_BASE[0]];
    }

    // 2. Collection metrics / book count / volumes / CDs
    if (qLower.includes('how many books') || qLower.includes('collection') || qLower.includes('volumes') || qLower.includes('journals count')) {
      return [INITIAL_KNOWLEDGE_BASE[1]];
    }

    // 3. Video Lectures / Online Tutorials / NPTEL / SWAYAM
    if (qLower.includes('video') || qLower.includes('lecture') || qLower.includes('tutorial') || qLower.includes('nptel') || qLower.includes('swayam') || qLower.includes('ndli')) {
      return [INITIAL_KNOWLEDGE_BASE[3]];
    }

    // 4. Knimbus / Remote Access / Off-Campus
    if (qLower.includes('knimbus') || qLower.includes('remote') || qLower.includes('off campus')) {
      return [INITIAL_KNOWLEDGE_BASE[4]];
    }

    // 5. IEEE Xplore
    if (qLower.includes('ieee')) {
      return [INITIAL_KNOWLEDGE_BASE[5]];
    }

    // 6. SCOPUS / Web of Science
    if (qLower.includes('scopus') || qLower.includes('web of science')) {
      return [INITIAL_KNOWLEDGE_BASE[6]];
    }

    // 7. Library Timings / Operating Hours / Open / Close
    if (qLower.includes('timing') || qLower.includes('hour') || qLower.includes('open') || qLower.includes('close') || qLower.includes('reading hall')) {
      return [INITIAL_KNOWLEDGE_BASE[2]];
    }

    // 8. OPAC Catalog / Book Search / Library Catalog
    if (qLower.includes('opac') || qLower.includes('book search') || qLower.includes('catalog') || qLower.includes('borrow')) {
      return [INITIAL_KNOWLEDGE_BASE[7]];
    }

    // 9. Turnitin / Plagiarism / Similarity
    if (qLower.includes('turnitin') || qLower.includes('plagiarism') || qLower.includes('similarity')) {
      return [INITIAL_KNOWLEDGE_BASE[8]];
    }

    // 10. Question Papers / Previous Year Exams
    if (qLower.includes('question paper') || qLower.includes('exam paper') || qLower.includes('previous year')) {
      return [INITIAL_KNOWLEDGE_BASE[9]];
    }

    // 11. EBSCO / J-Gate / BMJ / Manupatra / Micromedex / DELNET
    if (qLower.includes('ebsco') || qLower.includes('j-gate') || qLower.includes('bmj') || qLower.includes('manupatra') || qLower.includes('micromedex') || qLower.includes('delnet') || qLower.includes('thieme')) {
      return [INITIAL_KNOWLEDGE_BASE[10]];
    }

    // 12. Book Bank / Borrowing / Membership
    if (qLower.includes('book bank') || qLower.includes('membership') || qLower.includes('borrowing limit') || qLower.includes('issue book')) {
      return [INITIAL_KNOWLEDGE_BASE[11]];
    }

    // 13. Contact / Email / Location / Address / Toll Free
    if (qLower.includes('contact') || qLower.includes('email') || qLower.includes('phone') || qLower.includes('address') || qLower.includes('location') || qLower.includes('toll free')) {
      return [INITIAL_KNOWLEDGE_BASE[12]];
    }

    // General Guide / Overview / PU Lib / Library Guide Queries
    if (qLower.includes('pu lib') || qLower.includes('pu library') || qLower.includes('guide') || qLower.includes('overview') || qLower.includes('about the lib') || qLower.includes('tell me about')) {
      return [INITIAL_KNOWLEDGE_BASE[0], INITIAL_KNOWLEDGE_BASE[1]];
    }

    return [INITIAL_KNOWLEDGE_BASE[0]];
  }
}
