import { ToolService } from './tool.service';
import { GuardrailService } from './guardrail.service';
import { MemoryService } from './memory.service';
import { OllamaService } from './ollama.service';
import { VectorService, RetrievalChunk } from './vector.service';
import { AgentOrchestrator, AgentResponse } from '../agents/agentOrchestrator';
import { pool } from '../config/database';

export interface RAGPipelineResult {
  response: string;
  intent: string;
  toolUsed: string;
  agentName: string;
  agentRole: string;
  sources: Array<{ title: string; url: string; category: string }>;
  responseTimeMs: number;
  isFallback: boolean;
}

export class RAGService {
  public static async processQuery(
    userId: string,
    sessionId: string,
    query: string
  ): Promise<RAGPipelineResult> {
    const startTime = Date.now();
    const currentQuery = query.trim();

    // 1. Strict Domain Verification
    if (!GuardrailService.isDomainAllowed(currentQuery)) {
      const responseTimeMs = Date.now() - startTime;
      const fallbackMsg = GuardrailService.getUnrelatedFallbackResponse();
      return {
        response: fallbackMsg,
        intent: 'Unsupported Query Guardrail',
        toolUsed: 'Guardrail Engine',
        agentName: 'Library मित्र Senior Librarian',
        agentRole: 'Senior Librarian & Research Consultant',
        sources: [],
        responseTimeMs,
        isFallback: true
      };
    }

    // 2. Multi-Agent Architecture Orchestration for Current Query
    const agentExecution: AgentResponse = await AgentOrchestrator.routeAndExecute(currentQuery);

    // 3. Vector Knowledge Search for Current Query
    agentExecution.chunks = await VectorService.searchKnowledge(currentQuery);

    // 4. Guardrail Relevance Validation
    const hasRelevantContext = GuardrailService.isContextRelevant(agentExecution.chunks, currentQuery);
    let finalResponse = '';
    let isFallback = false;

    if (!hasRelevantContext) {
      finalResponse = GuardrailService.getFallbackResponse();
      isFallback = true;
    } else {
      const contextText = agentExecution.chunks.length > 0 
        ? agentExecution.chunks.map(c => `Source: ${c.title} (${c.url})\nCategory: ${c.category}\nContent: ${c.content}`).join('\n\n')
        : agentExecution.response;

      const prompt = GuardrailService.buildStrictRAGPrompt(currentQuery, contextText);
      const rawLlmResponse = await OllamaService.generateResponse(prompt);

      if (rawLlmResponse && rawLlmResponse.trim().length > 0) {
        finalResponse = rawLlmResponse;
      } else {
        // Master Senior Librarian Response Synthesizer (5 Component Format)
        finalResponse = this.generateSeniorLibrarianResponse(currentQuery, agentExecution);
      }
    }

    const responseTimeMs = Date.now() - startTime;
    const sources = agentExecution.chunks.map(c => ({ title: c.title, url: c.url, category: c.category }));

    await MemoryService.saveSessionMessage(sessionId, currentQuery, finalResponse);
    await this.logAnalytics(currentQuery, responseTimeMs, agentExecution.agentName, isFallback ? 'fallback' : 'success', agentExecution.agentRole);
    await this.saveChatHistory(userId, sessionId, currentQuery, finalResponse, agentExecution.agentName, sources);

    return {
      response: finalResponse,
      intent: agentExecution.agentRole,
      toolUsed: agentExecution.agentName,
      agentName: 'Library मित्र Senior Librarian',
      agentRole: 'Senior Librarian & Research Consultant',
      sources,
      responseTimeMs,
      isFallback
    };
  }

  /**
   * Master Senior Librarian Synthesizer enforcing 5 Component Response Format
   */
  private static generateSeniorLibrarianResponse(query: string, agent: AgentResponse): string {
    const qLower = query.toLowerCase();

    // 1. Emotional Intelligence Triggers
    if (qLower.includes('confused')) {
      return "No problem at all. I am Library मित्र, let me explain it step by step.\n\nParul University Library Ecosystem integrates the central Gyanoday Bhavan Library and 10+ departmental libraries. You can search the OPAC catalog, access Knimbus remote login, or browse question paper archives. What specific resource would you like help with today?";
    }
    if (qLower.includes('thank')) {
      return "You're most welcome! I am always happy to assist as your Library मित्र across all Parul University library portals.";
    }

    // Component 1: Natural Introduction (Varied Greetings)
    const intros = [
      "Namaste! I am Library मित्र, delighted to help guide you.",
      "Welcome back! As your Library मित्र, it's a pleasure to assist you with our library ecosystem.",
      "Greetings! Let me assist you with our official library resources.",
      "I'd be happy to walk you through our database services today."
    ];
    const selectedIntro = intros[Math.floor(Math.random() * intros.length)];

    let text = `${selectedIntro}\n\n`;

    // Component 2: Direct Answer
    agent.chunks.forEach((chunk, index) => {
      text += `📍 **[${chunk.title}](${chunk.url})**  \n`;
      text += `${chunk.content}\n\n`;
    });

    // Component 3: Navigation Path
    text += `🗺️ **Navigation Path:**\n`;
    if (qLower.includes('ieee')) {
      text += `Parul University Libraries → Online Resources → IEEE Xplore\n\n`;
    } else if (qLower.includes('knimbus') || qLower.includes('remote access')) {
      text += `Parul University Libraries → Remote Access → Knimbus Portal\n\n`;
    } else if (qLower.includes('opac') || qLower.includes('book search')) {
      text += `Parul University Libraries → Services → OPAC Catalog Search\n\n`;
    } else if (qLower.includes('question paper')) {
      text += `Gyanoday Bhavan → Institutional Repository → Question Papers Archive\n\n`;
    } else if (qLower.includes('video') || qLower.includes('nptel')) {
      text += `Gyanoday Bhavan → Educational Resources → Video Library\n\n`;
    } else {
      text += `Parul University Libraries → Academic Services & Resources\n\n`;
    }

    // Component 4: Suggested Resources (Discipline-Matched)
    text += `💡 **Suggested Resources:**\n`;
    if (qLower.includes('b.tech') || qLower.includes('engineering') || qLower.includes('ieee')) {
      text += `- SCOPUS Research Database\n- Web of Science Citation Index\n- NPTEL Video Lectures & Courseware\n\n`;
    } else if (qLower.includes('mba') || qLower.includes('management') || qLower.includes('ebsco')) {
      text += `- EBSCO Business Source Ultimate\n- J-Gate Management Journals\n- Harvard Business Case Studies Archive\n\n`;
    } else if (qLower.includes('pharmacy') || qLower.includes('micromedex')) {
      text += `- Micromedex Drug Clinical Database\n- BMJ Journals & Clinical Evidence\n- Bentham Science Pharmaceutical Archive\n\n`;
    } else if (qLower.includes('law') || qLower.includes('manupatra')) {
      text += `- Manupatra Legal Research Portal\n- DELNET Inter-Library Document Delivery\n- Supreme Court & High Court Case Archives\n\n`;
    } else if (qLower.includes('medical') || qLower.includes('bmj')) {
      text += `- BMJ Journals & Clinical Evidence\n- Web of Science Medical Indexing\n- Thieme Medical eBooks & Reference Library\n\n`;
    } else {
      text += `- Knimbus 24/7 Remote Access App\n- OPAC Online Book Search Catalog\n- Past Semester Question Paper Repository\n\n`;
    }

    // Component 5: Follow-Up Question (Mandatory Closing Set)
    const followUps = [
      "Is there anything else I can help you find today?",
      "Would you like additional resources on this topic?",
      "I'm always here to support your academic journey.",
      "Please let me know if you'd like assistance with any other library services."
    ];
    const selectedFollowUp = followUps[Math.floor(Math.random() * followUps.length)];

    text += selectedFollowUp;

    return text;
  }

  private static async logAnalytics(question: string, responseTimeMs: number, moduleName: string, status: string, intent: string) {
    try {
      await pool.query(
        `INSERT INTO analytics (question, response_time_ms, module, status, intent) VALUES ($1, $2, $3, $4, $5)`,
        [question, responseTimeMs, moduleName, status, intent]
      );
    } catch {}
  }

  private static async saveChatHistory(userId: string, sessionId: string, message: string, response: string, intent: string, sources: any[]) {
    try {
      await pool.query(
        `INSERT INTO chat_history (session_id, message, response, intent, sources) VALUES ($1, $2, $3, $4, $5)`,
        [sessionId, message, response, intent, JSON.stringify(sources)]
      );
    } catch {}
  }
}
