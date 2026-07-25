import { GuardrailService, RetrievalChunk } from '../../services/guardrail.service';

describe('GuardrailService Unit Tests', () => {
  test('should pass relevancy check for valid library retrieval chunks', () => {
    const mockChunks: RetrievalChunk[] = [
      {
        id: '1',
        title: 'IEEE Xplore Digital Library Access',
        url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/online-resources',
        category: 'External Databases',
        content: 'Parul University provides campus-wide access to IEEE Xplore Digital Library containing engineering research papers.',
        score: 0.85
      }
    ];

    const isRelevant = GuardrailService.isContextRelevant(mockChunks, 'How do I access IEEE papers?');
    expect(isRelevant).toBe(true);
  });

  test('should trigger zero-hallucination fallback for out-of-scope queries', () => {
    const mockChunks: RetrievalChunk[] = [];
    const isRelevant = GuardrailService.isContextRelevant(mockChunks, 'What is the capital of Mars?');
    expect(isRelevant).toBe(false);

    const fallbackMsg = GuardrailService.getFallbackResponse();
    expect(fallbackMsg).toContain('Gyanoday Bhavan library knowledge base');
  });
});
