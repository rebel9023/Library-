import { RAGService } from '../../services/rag.service';

describe('Chat API Integration Tests', () => {
  test('should process query through Multi-Agent pipeline and return verified sources', async () => {
    const result = await RAGService.processQuery(
      'user-integration-test',
      'session-integration-test',
      'Where can I find past question papers for B.Tech?',
      'B.Tech'
    );

    expect(result.isFallback).toBe(false);
    expect(result.response).toContain('Gyanoday Bhavan');
    expect(result.sources.length).toBeGreaterThan(0);
    expect(result.responseTimeMs).toBeLessThan(3000); // Enforce SLA < 3.0s
  });
});
