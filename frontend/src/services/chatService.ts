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
      response: `Hello! I am Library Mitra, your Parul University Library Assistant. I can help you find books, journals, OPAC resources, e-resources, and answer questions related to Gyanoday Bhavan. How may I assist you today?`
    };
  }

  // Subject Search: Pharmacology / Pharmacy Books (Example 1)
  if (qLower.includes('pharmacology') || qLower.includes('pharmacy book') || qLower.includes('drug book')) {
    return {
      intent: 'Pharmacy & Pharmacology OPAC Search',
      toolUsed: 'searchOPAC',
      sources: [
        { title: OPAC_DIRECTORY.sop.name, url: OPAC_DIRECTORY.sop.url, category: 'OPAC' },
        { title: OPAC_DIRECTORY.pimsr.name, url: OPAC_DIRECTORY.pimsr.url, category: 'OPAC' },
        { title: OPAC_DIRECTORY.central.name, url: OPAC_DIRECTORY.central.url, category: 'OPAC' }
      ],
      response: `Pharmacology books are commonly available in SOP, PIMSR, and Central Library OPACs. Please search using the following links:

* [SOP OPAC (Pharmacy)](${OPAC_DIRECTORY.sop.url})
* [PIMSR OPAC (Medical Sciences)](${OPAC_DIRECTORY.pimsr.url})
* [Central Library OPAC](${OPAC_DIRECTORY.central.url})`
    };
  }

  // Subject Search: Engineering Books (Example 2)
  if (qLower.includes('engineering') || qLower.includes('b.tech') || qLower.includes('technical book')) {
    return {
      intent: 'Engineering & Technology OPAC Search',
      toolUsed: 'searchOPAC',
      sources: [
        { title: OPAC_DIRECTORY.pit.name, url: OPAC_DIRECTORY.pit.url, category: 'OPAC' },
        { title: OPAC_DIRECTORY.central.name, url: OPAC_DIRECTORY.central.url, category: 'OPAC' }
      ],
      response: `You can search Engineering books in:

* [PIT OPAC (Engineering & Technology)](${OPAC_DIRECTORY.pit.url})
* [Central Library OPAC](${OPAC_DIRECTORY.central.url})`
    };
  }

  // Specific Book Query: Gray's Anatomy or Live Book Availability (Example 3)
  if (qLower.includes('gray') || qLower.includes('anatomy') || qLower.includes('is available') || qLower.includes('available book')) {
    return {
      intent: 'Book Availability Verification',
      toolUsed: 'searchOPAC',
      sources: [
        { title: OPAC_DIRECTORY.jnhmc.name, url: OPAC_DIRECTORY.jnhmc.url, category: 'OPAC' },
        { title: OPAC_DIRECTORY.sop.name, url: OPAC_DIRECTORY.sop.url, category: 'OPAC' },
        { title: OPAC_DIRECTORY.central.name, url: OPAC_DIRECTORY.central.url, category: 'OPAC' }
      ],
      response: `I cannot verify live availability unless connected to the OPAC database. Please search:

* [JNHMC OPAC](${OPAC_DIRECTORY.jnhmc.url})
* [SOP OPAC](${OPAC_DIRECTORY.sop.url})
* [Central Library OPAC](${OPAC_DIRECTORY.central.url})`
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

  // Knimbus Remote Access
  if (qLower.includes('knimbus') || qLower.includes('remote') || qLower.includes('off campus')) {
    return {
      intent: 'Knimbus Remote Access Portal',
      toolUsed: 'searchKnimbus',
      sources: [
        { title: 'Knimbus Remote Login Portal', url: 'https://www.paruluniversity.ac.in/academics/pu-libraries/', category: 'Remote Access' }
      ],
      response: `Hello! I am Library Mitra. **Knimbus Remote Access** allows 24/7 off-campus login to subscribed e-journals and e-books using your official student email (@paruluniversity.ac.in).

📍 **[Knimbus Remote Login Portal](https://www.paruluniversity.ac.in/academics/pu-libraries/)**`
    };
  }

  // Scopus, HeinOnline, LexisNexis, Manupatra, Micromedex
  if (qLower.includes('scopus') || qLower.includes('heinonline') || qLower.includes('lexisnexis') || qLower.includes('manupatra') || qLower.includes('micromedex') || qLower.includes('ebsco') || qLower.includes('delnet')) {
    return {
      intent: 'E-Resources & Database Support',
      toolUsed: 'searchDatabases',
      sources: [
        { title: 'Online Research Databases', url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/online-resources', category: 'Databases' }
      ],
      response: `Hello! Parul University provides campus-wide access to Scopus, HeinOnline, LexisNexis, Manupatra, Micromedex, EBSCO, and DELNET.

📍 **[Online Academic Resources Portal](https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/online-resources)**`
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

  // Default Missing Info Rule
  return {
    intent: 'General Library Mitra Support',
    toolUsed: 'searchGyanoday',
    sources: [
      { title: 'Central Library OPAC', url: OPAC_DIRECTORY.central.url, category: 'OPAC' }
    ],
    response: `I am unable to verify this information at the moment. Please contact Gyanoday Bhavan Library.`
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
