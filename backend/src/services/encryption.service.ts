import crypto from 'crypto';
import { env } from '../config/env';

const ALGORITHM = 'aes-256-gcm';
// Derives 32-byte key from JWT secret for AES-256
const ENCRYPTION_KEY = crypto.scryptSync(env.JWT_SECRET || 'parul_university_secret', 'gyanai_salt', 32);

export class EncryptionService {
  /**
   * AES-256-GCM Data Encryption at Rest
   */
  public static encrypt(text: string): { encryptedData: string; iv: string; tag: string } {
    const iv = crypto.randomBytes(12); // 96-bit IV for GCM
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag().toString('hex');

    return {
      encryptedData: encrypted,
      iv: iv.toString('hex'),
      tag
    };
  }

  /**
   * AES-256-GCM Data Decryption
   */
  public static decrypt(encryptedData: string, iv: string, tag: string): string {
    try {
      const decipher = crypto.createDecipheriv(
        ALGORITHM,
        ENCRYPTION_KEY,
        Buffer.from(iv, 'hex')
      );
      decipher.setAuthTag(Buffer.from(tag, 'hex'));

      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (err) {
      console.warn('Decryption failed, returning raw text fallback:', (err as Error).message);
      return encryptedData;
    }
  }

  /**
   * One-way SHA-256 Hash generator for API keys & tokens
   */
  public static hashSHA256(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}
