import { RetrievalChunk } from './vector.service';

export class GuardrailService {
  private static ALLOWED_TOPICS = [
    // Core Identity & Acronyms
    'library mitra', 'library मित्र', 'mitra', 'gyanoday bhavan', 'parul university', 'pu libraries', 'pu library', 'pu lib', 'pu', 'lib', 'library', 'gyanai', 'gyan',
    
    // OPAC & Library Departments
    'opac', 'centrallibwebopac', 'sop', 'rhmc', 'piv', 'pit', 'pipr', 'piph', 'pin', 'pimsr', 'pimr', 'pihr', 'piayr', 'pia', 'piar', 'jnhmc', 'bca', 'ahmc', 'aacl',
    
    // Online Databases & Services
    'ieee', 'scopus', 'web of science', 'ebsco', 'j-gate', 'bmj', 'bentham science', 'manupatra', 'micromedex', 'delnet', 'thieme', 'heinonline', 'lexisnexis',
    'nptel', 'swayam', 'ndli', 'question paper', 'exam paper', 'knimbus', 'remote access',
    'video', 'lecture', 'tutorial', 'course', 'e-book', 'e-journal', 'institutional repository',
    'turnitin', 'plagiarism', 'similarity', 'timing', 'hour', 'open', 'close', 'notice',
    'research methodology', 'citation', 'apa', 'mla', 'chicago', 'thesis', 'dissertation',
    'faculty publication', 'document delivery', 'inter library loan', 'book bank', 'reading hall', 'membership', 'reading competition', 'library event',
    
    // Subject Terms
    'pharmacology', 'pharmacy', 'engineering', 'anatomy', 'medicine', 'nursing', 'homoeopathy', 'ayurved', 'architecture', 'management', 'computer', 'bca', 'agriculture',
    
    // Conversational Intent & Question Patterns
    'where can i find', 'which library has', 'is this book available', 'search opac', 'find journal', 'library timings', 'library membership',
    'where is', 'how to', 'find', 'search', 'access', 'what', 'show', 'guide', 'about', 'overview',
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
    return "Hello! I am Library Mitra, your Parul University Library Assistant. I specialize in Parul University Library services and academic resources. Is there anything I can help you find within Gyanoday Bhavan today?";
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
- Provide concise, accurate, and friendly responses. Support English and Hindi.
- Always guide users to the appropriate library resource. Always provide clickable markdown links.
- If a user asks for a book, suggest the relevant OPAC portal links from the OPAC Directory.

GENERAL RULES:
1. Never provide false information.
2. If the answer is unknown or live availability cannot be verified, respond EXACTLY:
   "I am unable to verify this information at the moment. Please contact Gyanoday Bhavan Library."
3. Always list all relevant OPAC links if multiple OPACs contain the resource.

OPAC DIRECTORY LINKS:
- Central Library OPAC: https://opac.paruluniversity.ac.in/centrallibwebopac/
- SOP OPAC (Pharmacy): https://opac.paruluniversity.ac.in/sopwebopac/
- RHMC OPAC (Homoeopathy): https://opac.paruluniversity.ac.in/rhmcwebopac/
- PIV OPAC (Veterinary): https://opac.paruluniversity.ac.in/pivwebopac/
- PIT OPAC (Technology/Engineering): https://opac.paruluniversity.ac.in/pitwebopac/
- PIPR OPAC (Paramedical): https://opac.paruluniversity.ac.in/piprwebopac/
- PIPH OPAC (Public Health): https://opac.paruluniversity.ac.in/piphwebopac/
- PIN OPAC (Nursing): https://opac.paruluniversity.ac.in/pinwebopac/
- PIMSR OPAC (Medical Sciences): https://opac.paruluniversity.ac.in/pimsrwebopac/
- PIMR OPAC (Management): https://opac.paruluniversity.ac.in/pimrwebopac/
- PIHR OPAC (Hotel Management): https://opac.paruluniversity.ac.in/pihrwebopac/
- PIAYR OPAC (Ayurved): https://opac.paruluniversity.ac.in/piayrwebopac/
- PIA OPAC (Applied Sciences): https://opac.paruluniversity.ac.in/piawebopac/
- PIAR OPAC (Architecture): https://opac.paruluniversity.ac.in/piarwebopac/
- JNHMC OPAC (Homoeopathy): https://opac.paruluniversity.ac.in/jnhmcwebopac/
- BCA OPAC (Computer Applications): https://opac.paruluniversity.ac.in/bcawebopac/
- AHMC OPAC (Homoeopathy): https://opac.paruluniversity.ac.in/ahmcwebopac/
- AACL OPAC (Arts & Fine Arts): https://opac.paruluniversity.ac.in/aaclwebopac/

CONTEXT FROM OFFICIAL PARUL UNIVERSITY LIBRARY KNOWLEDGE BASE:
${contextText}

USER QUESTION:
${query}

LIBRARY MITRA RESPONSE:`;
  }
}
