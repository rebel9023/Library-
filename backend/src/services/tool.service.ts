import { VectorService, RetrievalChunk } from './vector.service';

export interface ToolResult {
  toolName: string;
  query: string;
  chunks: RetrievalChunk[];
  formattedSummary: string;
}

export class ToolService {
  private static async getChunks(query: string, category?: string): Promise<RetrievalChunk[]> {
    let chunks = await VectorService.searchKnowledge(query, category);
    if (!chunks || chunks.length === 0) {
      chunks = await VectorService.searchKnowledge(query);
    }
    return chunks;
  }

  public static async searchPULibraries(query: string): Promise<ToolResult> {
    const chunks = await this.getChunks(query, 'Library Overview');
    return { toolName: 'searchPULibraries', query, chunks, formattedSummary: chunks.map(c => `[${c.title}](${c.url}): ${c.content}`).join('\n') };
  }

  public static async searchGyanoday(query: string): Promise<ToolResult> {
    const chunks = await this.getChunks(query, 'Library Services');
    return { toolName: 'searchGyanoday', query, chunks, formattedSummary: chunks.map(c => `[${c.title}](${c.url}): ${c.content}`).join('\n') };
  }

  public static async searchIEEE(query: string): Promise<ToolResult> {
    const chunks = await this.getChunks('IEEE Xplore', 'Online Resources');
    return { toolName: 'searchIEEE', query, chunks, formattedSummary: chunks.map(c => `[${c.title}](${c.url}): ${c.content}`).join('\n') };
  }

  public static async searchEBSCO(query: string): Promise<ToolResult> {
    const chunks = await this.getChunks('EBSCO', 'Online Resources');
    return { toolName: 'searchEBSCO', query, chunks, formattedSummary: chunks.map(c => `[${c.title}](${c.url}): ${c.content}`).join('\n') };
  }

  public static async searchDELNET(query: string): Promise<ToolResult> {
    const chunks = await this.getChunks('DELNET', 'Online Resources');
    return { toolName: 'searchDELNET', query, chunks, formattedSummary: chunks.map(c => `[${c.title}](${c.url}): ${c.content}`).join('\n') };
  }

  public static async searchBentham(query: string): Promise<ToolResult> {
    const chunks = await this.getChunks('Bentham Science', 'Online Resources');
    return { toolName: 'searchBentham', query, chunks, formattedSummary: chunks.map(c => `[${c.title}](${c.url}): ${c.content}`).join('\n') };
  }

  public static async searchManupatra(query: string): Promise<ToolResult> {
    const chunks = await this.getChunks('Manupatra', 'Online Resources');
    return { toolName: 'searchManupatra', query, chunks, formattedSummary: chunks.map(c => `[${c.title}](${c.url}): ${c.content}`).join('\n') };
  }

  public static async searchMicromedex(query: string): Promise<ToolResult> {
    const chunks = await this.getChunks('Micromedex', 'Online Resources');
    return { toolName: 'searchMicromedex', query, chunks, formattedSummary: chunks.map(c => `[${c.title}](${c.url}): ${c.content}`).join('\n') };
  }

  public static async searchKnimbus(query: string): Promise<ToolResult> {
    const chunks = await this.getChunks('Knimbus Remote Access', 'Online Resources');
    return { toolName: 'searchKnimbus', query, chunks, formattedSummary: chunks.map(c => `[${c.title}](${c.url}): ${c.content}`).join('\n') };
  }

  public static async searchJGate(query: string): Promise<ToolResult> {
    const chunks = await this.getChunks('J-Gate', 'Online Resources');
    return { toolName: 'searchJGate', query, chunks, formattedSummary: chunks.map(c => `[${c.title}](${c.url}): ${c.content}`).join('\n') };
  }

  public static async searchBMJ(query: string): Promise<ToolResult> {
    const chunks = await this.getChunks('BMJ', 'Online Resources');
    return { toolName: 'searchBMJ', query, chunks, formattedSummary: chunks.map(c => `[${c.title}](${c.url}): ${c.content}`).join('\n') };
  }

  public static async searchScopus(query: string): Promise<ToolResult> {
    const chunks = await this.getChunks('SCOPUS', 'Online Resources');
    return { toolName: 'searchScopus', query, chunks, formattedSummary: chunks.map(c => `[${c.title}](${c.url}): ${c.content}`).join('\n') };
  }

  public static async searchWebOfScience(query: string): Promise<ToolResult> {
    const chunks = await this.getChunks('Web of Science', 'Online Resources');
    return { toolName: 'searchWebOfScience', query, chunks, formattedSummary: chunks.map(c => `[${c.title}](${c.url}): ${c.content}`).join('\n') };
  }

  public static async searchOPAC(query: string): Promise<ToolResult> {
    const chunks = await this.getChunks('OPAC', 'Library Services');
    return { toolName: 'searchOPAC', query, chunks, formattedSummary: chunks.map(c => `[${c.title}](${c.url}): ${c.content}`).join('\n') };
  }

  public static async searchRepository(query: string): Promise<ToolResult> {
    const chunks = await this.getChunks(query, 'Repository');
    return { toolName: 'searchRepository', query, chunks, formattedSummary: chunks.map(c => `[${c.title}](${c.url}): ${c.content}`).join('\n') };
  }

  public static async searchQuestionPapers(query: string): Promise<ToolResult> {
    const chunks = await this.getChunks('Question Papers', 'Repository');
    return { toolName: 'searchQuestionPapers', query, chunks, formattedSummary: chunks.map(c => `[${c.title}](${c.url}): ${c.content}`).join('\n') };
  }

  public static async searchVideos(query: string): Promise<ToolResult> {
    const chunks = await this.getChunks('NPTEL', 'Educational Resources');
    return { toolName: 'searchVideos', query, chunks, formattedSummary: chunks.map(c => `[${c.title}](${c.url}): ${c.content}`).join('\n') };
  }

  public static async searchResearchSupport(query: string): Promise<ToolResult> {
    const chunks = await this.getChunks(query, 'Research Support');
    return { toolName: 'searchResearchSupport', query, chunks, formattedSummary: chunks.map(c => `[${c.title}](${c.url}): ${c.content}`).join('\n') };
  }
}
