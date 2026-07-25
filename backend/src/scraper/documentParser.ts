import cheerio from 'cheerio';
import pdfParse from 'pdf-parse';

export class DocumentParser {
  /**
   * Parse HTML content from web page
   */
  public static parseHTML(html: string, url: string): { title: string; text: string; links: string[] } {
    const $ = cheerio.load(html);
    
    // Remove script, style, nav elements to clean up text
    $('script, style, nav, footer, iframe').remove();

    const title = $('title').text().trim() || $('h1').first().text().trim() || 'Gyanoday Bhavan Library Resource';
    const text = $('body').text().replace(/\s+/g, ' ').trim();

    const links: string[] = [];
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
        links.push(href);
      }
    });

    return { title, text, links };
  }

  /**
   * Parse PDF Document Buffer
   */
  public static async parsePDF(buffer: Buffer): Promise<{ text: string; numPages: number }> {
    try {
      const data = await pdfParse(buffer);
      return {
        text: data.text.replace(/\s+/g, ' ').trim(),
        numPages: data.numpages
      };
    } catch (err) {
      console.warn('PDF parsing error:', (err as Error).message);
      return { text: '', numPages: 0 };
    }
  }

  /**
   * Chunk text into overlapping passages for high quality RAG retrieval
   */
  public static chunkText(text: string, chunkSize: number = 500, overlap: number = 100): string[] {
    const words = text.split(' ');
    const chunks: string[] = [];

    for (let i = 0; i < words.length; i += (chunkSize - overlap)) {
      const chunk = words.slice(i, i + chunkSize).join(' ');
      if (chunk.trim().length > 30) {
        chunks.push(chunk);
      }
    }

    return chunks.length > 0 ? chunks : [text];
  }
}
