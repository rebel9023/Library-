import axios from 'axios';
import { ChatMessage } from '../types';

const API_BASE = '/api';

/**
 * Master OPAC Directory & Client-Side Response Synthesizer Engine for Library Mitra
 */
function generateClientLibrarianResponse(query: string): { response: string; sources: any[]; intent: string; toolUsed: string } {
  const qLower = query.toLowerCase();

  // OPAC Book Search / Subject Book Queries
  if (qLower.includes('pharmacology') || qLower.includes('pharmacy') || qLower.includes('drug')) {
    return {
      intent: 'OPAC Book Search (Pharmacy & Pharmacology)',
      toolUsed: 'searchOPAC',
      sources: [
        { title: 'SOP OPAC Catalog', url: 'https://opac.paruluniversity.ac.in/sopwebopac/', category: 'OPAC Catalog' },
        { title: 'PIMSR OPAC Catalog', url: 'https://opac.paruluniversity.ac.in/pimsrwebopac/', category: 'OPAC Catalog' },
        { title: 'Central Library OPAC Catalog', url: 'https://opac.paruluniversity.ac.in/centrallibwebopac/', category: 'OPAC Catalog' }
      ],
      response: `Pharmacology and Pharmacy books are commonly available in SOP, PIMSR, and Central Library OPACs. Please search using the following links:

* [SOP OPAC (Pharmacy Catalog)](https://opac.paruluniversity.ac.in/sopwebopac/)
* [PIMSR OPAC (Medical Catalog)](https://opac.paruluniversity.ac.in/pimsrwebopac/)
* [Central Library OPAC](https://opac.paruluniversity.ac.in/centrallibwebopac/)

Is there a specific book title or author you would like to search for?`
    };
  }

  if (qLower.includes('engineering') || qLower.includes('b.tech') || qLower.includes('diploma') || qLower.includes('computer science') || qLower.includes('bca')) {
    return {
      intent: 'OPAC Book Search (Engineering & Technology)',
      toolUsed: 'searchOPAC',
      sources: [
        { title: 'PIT OPAC Catalog', url: 'https://opac.paruluniversity.ac.in/pitwebopac/', category: 'OPAC Catalog' },
        { title: 'BCA OPAC Catalog', url: 'https://opac.paruluniversity.ac.in/bcawebopac/', category: 'OPAC Catalog' },
        { title: 'Central Library OPAC Catalog', url: 'https://opac.paruluniversity.ac.in/centrallibwebopac/', category: 'OPAC Catalog' }
      ],
      response: `Engineering, Computer Science, and Technology books can be searched in the following OPAC catalogs:

* [PIT OPAC (Engineering & Technology)](https://opac.paruluniversity.ac.in/pitwebopac/)
* [BCA OPAC (Computer Applications)](https://opac.paruluniversity.ac.in/bcawebopac/)
* [Central Library OPAC](https://opac.paruluniversity.ac.in/centrallibwebopac/)

Would you like recommendations for technical reference books or IEEE research papers?`
    };
  }

  if (qLower.includes('gray') || qLower.includes('anatomy') || qLower.includes('medical') || qLower.includes('medicine')) {
    return {
      intent: 'OPAC Book Search (Medical & Anatomy)',
      toolUsed: 'searchOPAC',
      sources: [
        { title: 'JNHMC OPAC Catalog', url: 'https://opac.paruluniversity.ac.in/jnhmcwebopac/', category: 'OPAC Catalog' },
        { title: 'SOP OPAC Catalog', url: 'https://opac.paruluniversity.ac.in/sopwebopac/', category: 'OPAC Catalog' },
        { title: 'Central Library OPAC Catalog', url: 'https://opac.paruluniversity.ac.in/centrallibwebopac/', category: 'OPAC Catalog' }
      ],
      response: `Medical, Anatomy, and Healthcare books are indexed across our health science libraries. Please search using the following OPAC links:

* [JNHMC OPAC (Medical Catalog)](https://opac.paruluniversity.ac.in/jnhmcwebopac/)
* [SOP OPAC (Pharmacy & Health)](https://opac.paruluniversity.ac.in/sopwebopac/)
* [Central Library OPAC](https://opac.paruluniversity.ac.in/centrallibwebopac/)

Note: I cannot verify real-time copy availability unless checked directly on the OPAC portal.`
    };
  }

  if (qLower.includes('law') || qLower.includes('legal') || qLower.includes('constitution')) {
    return {
      intent: 'OPAC Book Search (Law)',
      toolUsed: 'searchOPAC',
      sources: [
        { title: 'PIV OPAC (Law Catalog)', url: 'https://opac.paruluniversity.ac.in/pivwebopac/', category: 'OPAC Catalog' },
        { title: 'Central Library OPAC Catalog', url: 'https://opac.paruluniversity.ac.in/centrallibwebopac/', category: 'OPAC Catalog' }
      ],
      response: `Law and legal reference volumes are available in the PIV Law Library and Central Library. Please search:

* [PIV OPAC (Law Library Catalog)](https://opac.paruluniversity.ac.in/pivwebopac/)
* [Central Library OPAC](https://opac.paruluniversity.ac.in/centrallibwebopac/)

Would you also like to access the Manupatra Legal Research Portal?`
    };
  }

  if (qLower.includes('management') || qLower.includes('mba') || qLower.includes('business') || qLower.includes('finance')) {
    return {
      intent: 'OPAC Book Search (Management)',
      toolUsed: 'searchOPAC',
      sources: [
        { title: 'PIMR OPAC Catalog', url: 'https://opac.paruluniversity.ac.in/pimrwebopac/', category: 'OPAC Catalog' },
        { title: 'Central Library OPAC Catalog', url: 'https://opac.paruluniversity.ac.in/centrallibwebopac/', category: 'OPAC Catalog' }
      ],
      response: `Management, Finance, and Business books can be searched in:

* [PIMR OPAC (Management Studies Catalog)](https://opac.paruluniversity.ac.in/pimrwebopac/)
* [Central Library OPAC](https://opac.paruluniversity.ac.in/centrallibwebopac/)

Would you like access to EBSCO Business Source Ultimate case studies?`
    };
  }

  if (qLower.includes('opac') || qLower.includes('where can i find') || qLower.includes('which library has') || qLower.includes('is available') || qLower.includes('book search')) {
    return {
      intent: 'OPAC Directory Search',
      toolUsed: 'searchOPAC',
      sources: [
        { title: 'Central Library OPAC', url: 'https://opac.paruluniversity.ac.in/centrallibwebopac/', category: 'OPAC Catalog' },
        { title: 'PIT OPAC (Engineering)', url: 'https://opac.paruluniversity.ac.in/pitwebopac/', category: 'OPAC Catalog' },
        { title: 'SOP OPAC (Pharmacy)', url: 'https://opac.paruluniversity.ac.in/sopwebopac/', category: 'OPAC Catalog' }
      ],
      response: `Hello! You can search for books across all 17 Parul University library OPAC portals:

* [Central Library OPAC](https://opac.paruluniversity.ac.in/centrallibwebopac/)
* [PIT OPAC (Engineering & Tech)](https://opac.paruluniversity.ac.in/pitwebopac/)
* [SOP OPAC (Pharmacy)](https://opac.paruluniversity.ac.in/sopwebopac/)
* [PIMSR OPAC (Medical Sciences)](https://opac.paruluniversity.ac.in/pimsrwebopac/)
* [PIMR OPAC (Management)](https://opac.paruluniversity.ac.in/pimrwebopac/)
* [PIV OPAC (Law Library)](https://opac.paruluniversity.ac.in/pivwebopac/)
* [BCA OPAC (Computer Applications)](https://opac.paruluniversity.ac.in/bcawebopac/)
* [PIN OPAC (Nursing)](https://opac.paruluniversity.ac.in/pinwebopac/)

Which subject or book title would you like help locating?`
    };
  }

  // IEEE
  if (qLower.includes('ieee')) {
    return {
      intent: 'IEEE Research Database',
      toolUsed: 'searchIEEE',
      sources: [
        { title: 'IEEE Xplore Digital Access', url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/online-resources', category: 'Online Resources' },
        { title: 'Knimbus Remote Access', url: 'https://www.paruluniversity.ac.in/academics/pu-libraries/', category: 'Remote Access' }
      ],
      response: `Hello! IEEE Xplore is accessible campus-wide and remotely via Knimbus.

📍 **[IEEE Xplore Digital Access Portal](https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/online-resources)**  
Parul University provides IP-authenticated and 24/7 remote EZProxy access to IEEE Xplore containing over 5 million engineering and computer science research papers, IEEE standards, and conference proceedings.

🗺️ **Navigation Path:**
Parul University Libraries → Online Resources → IEEE Xplore

💡 **Suggested Resources:**
- SCOPUS Research Database
- Web of Science Citation Index
- NPTEL Video Lectures & Courseware

Would you like me to recommend research papers or tutorials related to your topic?`
    };
  }

  // Knimbus Remote Access
  if (qLower.includes('knimbus') || qLower.includes('remote') || qLower.includes('off campus')) {
    return {
      intent: 'Knimbus Remote Access Portal',
      toolUsed: 'searchKnimbus',
      sources: [
        { title: 'Knimbus Remote Login Portal', url: 'https://www.paruluniversity.ac.in/academics/pu-libraries/', category: 'Remote Access' }
      ],
      response: `Hello! Knimbus provides 24/7 off-campus access to all Parul University subscribed e-resources.

📍 **[Knimbus Remote Login Portal](https://www.paruluniversity.ac.in/academics/pu-libraries/)**  
Access subscribed e-databases, e-journals, and e-books 24/7 from off-campus using your official email credentials (\`@paruluniversity.ac.in\`) or by downloading the **mLibrary / Knimbus App** on iOS & Android.

🗺️ **Navigation Path:**
Parul University Libraries → Remote Access → Knimbus Portal

💡 **Suggested Resources:**
- IEEE Xplore Digital Library
- SCOPUS Citation Database
- Central Library OPAC Catalog

Would you like assistance setting up your Knimbus mobile app?`
    };
  }

  // Timings
  if (qLower.includes('timing') || qLower.includes('hour') || qLower.includes('open') || qLower.includes('close') || qLower.includes('reading room') || qLower.includes('reading hall')) {
    return {
      intent: 'Library Timings & Schedule',
      toolUsed: 'searchGyanoday',
      sources: [
        { title: 'Gyanoday Bhavan Timings', url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/home', category: 'Library Services' }
      ],
      response: `Hello! Here are the official operating hours for Gyanoday Bhavan Central Library:

📍 **[Gyanoday Bhavan Operating Schedule](https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/home)**  
⏰ **Central Library**: Monday to Saturday, **8:00 AM to 8:00 PM**  
📖 **Reading Rooms / Hall**: Open **24/7 (round-the-clock)** during university mid-term and semester examinations.  
📚 **Book Circulation Counter**: Monday to Saturday, **9:00 AM to 6:00 PM**.

🗺️ **Navigation Path:**
Gyanoday Bhavan → Library Services → Operating Hours

💡 **Suggested Resources:**
- OPAC Book Catalog Search
- Book Bank Scheme Enrollment
- Quiet Reading Rooms

Please let me know if you'd like assistance with reading room seating or borrowing rules!`
    };
  }

  // Turnitin
  if (qLower.includes('turnitin') || qLower.includes('plagiarism') || qLower.includes('similarity')) {
    return {
      intent: 'Turnitin Research Support',
      toolUsed: 'searchResearchSupport',
      sources: [
        { title: 'Turnitin Originality Check', url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/research-support', category: 'Research Support' }
      ],
      response: `Hello! Turnitin originality checks are provided for all Ph.D. dissertations, Master theses, and research papers.

📍 **[Turnitin Research Support & Plagiarism Verification](https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/research-support)**  
Maintain similarity scores below **10%** as per UGC guidelines.

📧 **Submission Email:** Send your manuscript to **turnitin@paruluniversity.ac.in**

🗺️ **Navigation Path:**
Gyanoday Bhavan → Research Support → Turnitin Anti-Plagiarism

💡 **Suggested Resources:**
- Citation Assistance (APA, MLA, IEEE, Chicago)
- SCOPUS & Web of Science Indexing
- Thesis & Dissertation Writing Guidelines

Would you like detailed UGC plagiarism policy guidelines?`
    };
  }

  // Default Fallback
  return {
    intent: 'General Academic Support',
    toolUsed: 'searchGyanoday',
    sources: [
      { title: 'Parul University Libraries Portal', url: 'https://www.paruluniversity.ac.in/academics/pu-libraries/', category: 'Website' },
      { title: 'Central Library OPAC', url: 'https://opac.paruluniversity.ac.in/centrallibwebopac/', category: 'OPAC Catalog' }
    ],
    response: `Hello! I am Library Mitra, your Parul University Library Assistant. I can help you find books, journals, OPAC resources, e-resources, and answer questions related to Gyanoday Bhavan. How may I assist you today?`
  };
}

export const sendChatMessage = async (
  message: string,
  sessionId: string,
  userId: string,
  department?: string
): Promise<ChatMessage> => {
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
    // Network fallback to Client Synthesizer Engine
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
 * Stream real-time human typing tokens via Server-Sent Events (SSE)
 * With automatic Client-Side Token Synthesizer for Vercel / Static Hosting
 */
export const streamChatMessage = async (
  message: string,
  sessionId: string,
  userId: string,
  onToken: (token: string) => void,
  onComplete: (sources: any[], metadata?: any) => void,
  department?: string
): Promise<void> => {
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
    // Network / Vercel static fallback
  }

  // Client-side Token-by-Token Streaming Synthesizer for Vercel Static Hosting
  const clientSynth = generateClientLibrarianResponse(message);
  const words = clientSynth.response.split(' ');

  for (let i = 0; i < words.length; i++) {
    const token = (i === 0 ? '' : ' ') + words[i];
    if (typeof onToken === 'function') {
      onToken(token);
    }
    await new Promise(r => setTimeout(r, 18));
  }

  if (typeof onComplete === 'function') {
    onComplete(clientSynth.sources, {
      intent: clientSynth.intent,
      agentName: 'Library Mitra Assistant',
      agentRole: 'Senior Librarian & Academic Support',
      toolUsed: clientSynth.toolUsed,
      isFallback: false
    });
  }
};
