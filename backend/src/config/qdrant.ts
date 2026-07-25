import { QdrantClient } from '@qdrant/js-client-rest';
import { env } from './env';

export const qdrant = new QdrantClient({
  url: env.QDRANT_URL
});

export const initQdrant = async () => {
  try {
    const collections = await qdrant.getCollections();
    const exists = collections.collections.some(c => c.name === env.QDRANT_COLLECTION);
    
    if (!exists) {
      console.log(`Creating Qdrant collection: ${env.QDRANT_COLLECTION}`);
      await qdrant.createCollection(env.QDRANT_COLLECTION, {
        vectors: {
          size: 384, // Standard dense vector size for all-MiniLM-L6-v2 embeddings
          distance: 'Cosine'
        }
      });
      console.log(`Qdrant collection '${env.QDRANT_COLLECTION}' created successfully.`);
    } else {
      console.log(`Qdrant collection '${env.QDRANT_COLLECTION}' is ready.`);
    }
  } catch (err) {
    console.warn('Qdrant initialization warning (Vector DB unavailable or starting up):', (err as Error).message);
  }
};
