import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { EncryptionService } from '../services/encryption.service';
import { pool } from '../config/database';
import { AuditLogService } from '../services/auditLog.service';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    department?: string;
  };
  apiKey?: {
    name: string;
    role: string;
  };
}

/**
 * JWT Access Token Verification Middleware
 */
export const verifyJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access Denied: Missing Authorization Token.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (err) {
    AuditLogService.logEvent({
      action: 'JWT_VERIFICATION_FAILED',
      ipAddress: req.ip || 'unknown',
      userAgent: req.headers['user-agent'],
      status: 'DENIED',
      details: { error: (err as Error).message }
    });
    res.status(403).json({ error: 'Forbidden: Invalid or expired JWT token.' });
  }
};

/**
 * API Key Verification Middleware (X-API-Key Header)
 */
export const verifyApiKey = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const apiKeyHeader = req.headers['x-api-key'] as string;

  if (!apiKeyHeader) {
    res.status(401).json({ error: 'Access Denied: Missing X-API-Key Header.' });
    return;
  }

  const keyHash = EncryptionService.hashSHA256(apiKeyHeader);

  try {
    const result = await pool.query(
      `SELECT name, role, expires_at, is_active FROM api_keys WHERE key_hash = $1`,
      [keyHash]
    );

    if (result.rows.length === 0 || !result.rows[0].is_active) {
      AuditLogService.logEvent({
        action: 'API_KEY_INVALID',
        ipAddress: req.ip || 'unknown',
        status: 'DENIED'
      });
      res.status(403).json({ error: 'Forbidden: Invalid or deactivated API Key.' });
      return;
    }

    req.apiKey = {
      name: result.rows[0].name,
      role: result.rows[0].role
    };
    next();
  } catch (err) {
    res.status(500).json({ error: 'Failed to authenticate API Key.' });
  }
};

/**
 * Role-Based Access Control (RBAC) Guard Middleware
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const userRole = req.user?.role || req.apiKey?.role || 'guest';

    if (!allowedRoles.includes(userRole)) {
      AuditLogService.logEvent({
        userId: req.user?.id || 'guest',
        action: 'RBAC_ACCESS_DENIED',
        ipAddress: req.ip || 'unknown',
        userAgent: req.headers['user-agent'],
        status: 'DENIED',
        details: { requiredRoles: allowedRoles, currentRole: userRole }
      });

      res.status(403).json({
        error: `Forbidden: Insufficient privileges. Required role: [${allowedRoles.join(', ')}]. Current role: ${userRole}.`
      });
      return;
    }

    next();
  };
};
