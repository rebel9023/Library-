import { RetrievalChunk } from './vector.service';

export class GuardrailService {
  private static ALLOWED_TOPICS = [
    // Core Institutional & Acronyms
    'library mitra', 'library मित्र', 'mitra', 'gyanoday bhavan', 'parul university', 'pu libraries', 'pu library', 'pu lib', 'pu', 'lib', 'library', 'gyanai', 'gyan',
    
    // OPAC Acronyms & Directory
    'centrallibwebopac', 'sopwebopac', 'rhmcwebopac', 'pivwebopac', 'pitwebopac', 'piprwebopac', 'piphwebopac', 'pinwebopac',
    'pimsrwebopac', 'pimrwebopac', 'pihrwebopac', 'piayrwebopac', 'piawebopac', 'piarwebopac', 'jnhmcwebopac', 'bcawebopac', 'ahmcwebopac', 'aaclwebopac',
    
    // Online Databases & Services
    'opac', 'ieee', 'scopus', 'web of science', 'ebsco', 'j-gate', 'bmj', 'bentham science', 'manupatra', 'micromedex', 'delnet', 'heinonline', 'lexisnexis', 'thieme',
    'nptel', 'swayam', 'ndli', 'question paper', 'exam paper', 'knimbus', 'remote access',
    'video', 'lecture', 'tutorial', 'course', 'e-book', 'e-journal', 'institutional repository',
    'turnitin', 'plagiarism', 'similarity', 'timing', 'hour', 'open', 'close', 'notice',
    'research methodology', 'citation', 'apa', 'mla', 'chicago', 'thesis', 'dissertation',
    'faculty publication', 'document delivery', 'inter library loan', 'book bank', 'reading room', 'reading hall',
    
    // Conversational Intent & Question Patterns
    'where can i find', 'which library has', 'is available', 'where is', 'how to', 'find', 'search', 'access', 'what', 'show', 'guide', 'about', 'overview',
    'info', 'details', 'tell me', 'explain', 'help', 'resource', 'service', 'book', 'journal', 'paper'
  ];

  /**
   * Validates if a user's question falls within the Parul University library domain
   */
  public static isDomainAllowed(query: string): boolean {
    const q = query.toLowerCase();
    
    // Check greetings / conversational phrases / emotional intelligence triggers
    if (q.includes('hi') || q.includes('hello') || q.includes('namaste') || q.includes('help') || q.includes('thank') || q.includes('confused') || q.includes('exam')) {
      return true;
    }

    return this.ALLOWED_TOPICS.some(topic => q.includes(topic));
  }

  /**
   * Standard fallback response for unrelated / unsupported questions
   */
  public static getUnrelatedFallbackResponse(): string {
    return "Hello! I am Library Mitra, your Parul University Library Assistant. I specialize in Parul University Library services, OPAC catalogs, and academic e-resources. For general non-library questions, I recommend using a general-purpose assistant. How may I assist you with Gyanoday Bhavan today?";
  }

  /**
   * Standard fallback response when information is missing from the knowledge base (Exact Master Prompt Wording)
   */
  public static getFallbackResponse(): string {
    return "I am unable to verify this information at the moment. Please contact Gyanoday Bhavan Library.";
  }

  /**
   * Relevancy check for retrieved chunks
   */
  public static isContextRelevant(chunks: RetrievalChunk[], query: string): boolean {
    if (!this.isDomainAllowed(query)) {
      return false;
    }
    return chunks.length > 0;
  }

  /**
   * Builds strict system prompt enforcing Library Mitra Master Prompt
   */
  public static buildStrictRAGPrompt(query: string, contextText: string): string {
    return `You are "Library Mitra", the official AI Assistant of Gyanoday Bhavan, Parul University Libraries.

ROLE & IDENTITY:
- Assist students, faculty, researchers, and staff in finding books, journals, OPAC resources, e-resources, library services, and library information.
- Provide concise, accurate, and friendly responses. Always guide users to the appropriate library resource.
- If a user asks for a book or subject, suggest all relevant OPAC URLs from the directory.
- Support both English and Hindi. Always identify yourself as "Library Mitra".

GREETING:
"Hello! I am Library Mitra, your Parul University Library Assistant. I can help you find books, journals, OPAC resources, e-resources, and answer questions related to Gyanoday Bhavan. How may I assist you today?"

OPAC DIRECTORY LINKS (ALWAYS PROVIDE CLICKABLE LINKS):
- Central Library OPAC: https://opac.paruluniversity.ac.in/centrallibwebopac/
- SOP OPAC (Pharmacy): https://opac.paruluniversity.ac.in/sopwebopac/
- RHMC OPAC (Homoeopathy): https://opac.paruluniversity.ac.in/rhmcwebopac/
- PIV OPAC (Law): https://opac.paruluniversity.ac.in/pivwebopac/
- PIT OPAC (Engineering): https://opac.paruluniversity.ac.in/pitwebopac/
- PIPR OPAC: https://opac.paruluniversity.ac.in/piprwebopac/
- PIPH OPAC: https://opac.paruluniversity.ac.in/piphwebopac/
- PIN OPAC (Nursing): https://opac.paruluniversity.ac.in/pinwebopac/
- PIMSR OPAC (Medical): https://opac.paruluniversity.ac.in/pimsrwebopac/
- PIMR OPAC (Management): https://opac.paruluniversity.ac.in/pimrwebopac/
- PIHR OPAC: https://opac.paruluniversity.ac.in/pihrwebopac/
- PIAYR OPAC (Ayurveda): https://opac.paruluniversity.ac.in/piayrwebopac/
- PIA OPAC (Architecture): https://opac.paruluniversity.ac.in/piawebopac/
- PIAR OPAC: https://opac.paruluniversity.ac.in/piarwebopac/
- JNHMC OPAC (Medical/Homoeopathy): https://opac.paruluniversity.ac.in/jnhmcwebopac/
- BCA OPAC (Computer Science): https://opac.paruluniversity.ac.in/bcawebopac/
- AHMC OPAC: https://opac.paruluniversity.ac.in/ahmcwebopac/
- AACL OPAC: https://opac.paruluniversity.ac.in/aaclwebopac/

MISSING INFO RULE:
If the answer is unknown or live availability cannot be verified, reply EXACTLY:
"I am unable to verify this information at the moment. Please contact Gyanoday Bhavan Library."

CONTEXT FROM OFFICIAL KNOWLEDGE BASE:
${contextText}

USER QUESTION:
${query}

LIBRARY MITRA ASSISTANT RESPONSE:`;
  }
}
