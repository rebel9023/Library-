import { Request, Response } from 'express';
import { ComplianceService } from '../services/compliance.service';
import { DisasterRecoveryService } from '../services/disasterRecovery.service';

export class ComplianceController {
  public static async exportData(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.body.userId || req.query.userId || 'guest-user') as string;
      const exportData = await ComplianceService.generateDataPortabilityExport(userId);
      res.json(exportData);
    } catch (err) {
      res.status(500).json({ error: 'Failed to generate GDPR data export.' });
    }
  }

  public static async eraseData(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.body.userId || req.query.userId) as string;
      if (!userId) {
        res.status(400).json({ error: 'User ID is required for data erasure.' });
        return;
      }

      const success = await ComplianceService.executeRightToBeForgotten(userId, req.ip || 'unknown');
      res.json({
        message: 'GDPR Right to be Forgotten executed successfully.',
        userId,
        status: success ? 'erased' : 'completed'
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to process GDPR data erasure request.' });
    }
  }

  public static getOWASPStatus(req: Request, res: Response): void {
    const report = ComplianceService.getOWASPAuditReport();
    res.json(report);
  }

  public static async getSLAStatus(req: Request, res: Response): Promise<void> {
    const slaReport = await DisasterRecoveryService.getSLAStatus();
    res.json(slaReport);
  }
}
