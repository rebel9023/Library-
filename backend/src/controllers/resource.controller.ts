import { Request, Response } from 'express';
import { pool } from '../config/database';

const MOCK_KNOWLEDGE_RECORDS = [
  {
    id: 'kb-rec-1',
    title: 'Parul University Campus Libraries Count & Infrastructure',
    url: 'https://www.paruluniversity.ac.in/academics/pu-libraries/',
    category: 'Library Overview',
    type: 'html',
    summary: 'Integrates 10+ campus libraries including Gyanoday Bhavan Central Library serving 63,000+ students.',
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'kb-rec-2',
    title: 'Gyanoday Bhavan Central Library Collections & Seating',
    url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/home',
    category: 'Library Overview',
    type: 'html',
    summary: 'Comprises 150,000+ books, 450+ print journals, 10,000+ CDs/DVDs, 500+ seating capacity reading hall.',
    created_at: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'kb-rec-3',
    title: 'Gyanoday Bhavan Library Timings & Reading Hall',
    url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/home',
    category: 'Library Services',
    type: 'html',
    summary: 'Operating hours: Mon-Sat 8:00 AM to 8:00 PM. Reading Hall operates 24/7 during university exams.',
    created_at: new Date(Date.now() - 10800000).toISOString()
  },
  {
    id: 'kb-rec-4',
    title: 'NPTEL, SWAYAM & Video Lecture Portal',
    url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/video-library',
    category: 'Educational Resources',
    type: 'html',
    summary: 'Thousands of NPTEL, SWAYAM, and NDLI video lectures cached locally on campus network.',
    created_at: new Date(Date.now() - 14400000).toISOString()
  },
  {
    id: 'kb-rec-5',
    title: 'Knimbus Remote Access Portal & Mobile App',
    url: 'https://www.paruluniversity.ac.in/academics/pu-libraries/',
    category: 'Online Resources',
    type: 'html',
    summary: '24/7 off-campus login to all Parul University subscribed e-databases and mLibrary mobile app.',
    created_at: new Date(Date.now() - 18000000).toISOString()
  },
  {
    id: 'kb-rec-6',
    title: 'IEEE Xplore Digital Library Access',
    url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/online-resources',
    category: 'Online Resources',
    type: 'html',
    summary: 'Campus-wide IP and remote EZProxy access to 5+ million engineering research papers and standards.',
    created_at: new Date(Date.now() - 21600000).toISOString()
  },
  {
    id: 'kb-rec-7',
    title: 'SCOPUS & Web of Science Citation Databases',
    url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/online-resources',
    category: 'Online Resources',
    type: 'html',
    summary: 'Peer-reviewed citation databases, journal impact factors, and h-index metrics for researchers.',
    created_at: new Date(Date.now() - 25200000).toISOString()
  },
  {
    id: 'kb-rec-8',
    title: 'OPAC Online Public Access Catalog & Book Search',
    url: 'https://www.paruluniversity.ac.in/academics/pu-libraries/',
    category: 'Library Services',
    type: 'html',
    summary: 'Real-time book search catalog across 200,000+ volumes in 10+ Parul University campus libraries.',
    created_at: new Date(Date.now() - 28800000).toISOString()
  },
  {
    id: 'kb-rec-9',
    title: 'Turnitin Anti-Plagiarism Verification & Guidelines',
    url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/research-support',
    category: 'Research Support',
    type: 'html',
    summary: 'Similarity checks for Ph.D. dissertations & Master theses maintaining <10% UGC compliance.',
    created_at: new Date(Date.now() - 32400000).toISOString()
  },
  {
    id: 'kb-rec-10',
    title: 'Past Examination Question Paper Archive (2018-2025)',
    url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/institutional-repository',
    category: 'Repository',
    type: 'pdf',
    summary: 'Digital repository of mid-term and semester exam papers (2018–2025) for all faculties.',
    created_at: new Date(Date.now() - 36000000).toISOString()
  },
  {
    id: 'kb-rec-11',
    title: 'EBSCO, J-Gate, BMJ, Manupatra, Micromedex & DELNET',
    url: 'https://www.paruluniversity.ac.in/academics/pu-libraries/',
    category: 'Online Resources',
    type: 'html',
    summary: 'Specialized departmental databases for Management, Law, Pharmacy, and Inter-Library Loan.',
    created_at: new Date(Date.now() - 39600000).toISOString()
  },
  {
    id: 'kb-rec-12',
    title: 'Book Bank Scheme & Borrowing Services',
    url: 'https://www.paruluniversity.ac.in/academics/pu-libraries/',
    category: 'Library Services',
    type: 'html',
    summary: 'Full-semester textbook sets and borrowing limits (B.Tech 3 books, Masters 5 books, Faculty 10).',
    created_at: new Date(Date.now() - 43200000).toISOString()
  }
];

export class ResourceController {
  public static async getResources(req: Request, res: Response): Promise<void> {
    try {
      const category = req.query.category as string;
      const search = req.query.search as string;

      let sql = `SELECT id, title, url, category, type, summary, created_at FROM documents`;
      const params: any[] = [];

      if (category) {
        sql += ` WHERE category ILIKE $1`;
        params.push(`%${category}%`);
      }

      sql += ` ORDER BY created_at DESC LIMIT 50`;
      const dbRes = await pool.query(sql, params);

      if (dbRes && dbRes.rows && dbRes.rows.length > 0) {
        let results = dbRes.rows;
        if (search) {
          const sLower = search.toLowerCase();
          results = results.filter(r => r.title.toLowerCase().includes(sLower) || r.category.toLowerCase().includes(sLower));
        }
        res.json({ resources: results });
        return;
      }

      let mockResults = MOCK_KNOWLEDGE_RECORDS;
      if (category) {
        mockResults = mockResults.filter(r => r.category.toLowerCase().includes(category.toLowerCase()));
      }
      if (search) {
        const sLower = search.toLowerCase();
        mockResults = mockResults.filter(r => r.title.toLowerCase().includes(sLower) || r.category.toLowerCase().includes(sLower));
      }

      res.json({ resources: mockResults });
    } catch (err) {
      let mockResults = MOCK_KNOWLEDGE_RECORDS;
      const category = req.query.category as string;
      const search = req.query.search as string;
      if (category) {
        mockResults = mockResults.filter(r => r.category.toLowerCase().includes(category.toLowerCase()));
      }
      if (search) {
        const sLower = search.toLowerCase();
        mockResults = mockResults.filter(r => r.title.toLowerCase().includes(sLower) || r.category.toLowerCase().includes(sLower));
      }
      res.json({ resources: mockResults });
    }
  }
}
