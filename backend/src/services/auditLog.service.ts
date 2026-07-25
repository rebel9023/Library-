import { pool } from '../config/database';

export interface SecurityAuditEvent {
  userId?: string;
  action: string;
  ipAddress: string;
  userAgent?: string;
  status: 'SUCCESS' | 'DENIED' | 'FAILURE';
  details?: Record<string, any>;
}

export class AuditLogService {
  /**
   * Records structured security audit events to PostgreSQL and console log
   */
  public static async logEvent(event: SecurityAuditEvent): Promise<void> {
    console.log(`[AUDIT LOG] ${event.status} | Action: ${event.action} | IP: ${event.ipAddress} | User: ${event.userId || 'Guest'}`);

    try {
      await pool.query(
        `INSERT INTO audit_logs (user_id, action, ip_address, user_agent, status, details, timestamp)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [
          event.userId || 'guest',
          event.action,
          event.ipAddress,
          event.userAgent || 'unknown',
          event.status,
          JSON.stringify(event.details || {})
        ]
      );
    } catch (err) {
      // Non-blocking log write failure
    }
  }
}
