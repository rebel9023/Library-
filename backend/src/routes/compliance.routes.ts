import { Router } from 'express';
import { ComplianceController } from '../controllers/compliance.controller';

const router = Router();

router.post('/gdpr/export', ComplianceController.exportData);
router.delete('/gdpr/erasure', ComplianceController.eraseData);
router.get('/owasp/report', ComplianceController.getOWASPStatus);
router.get('/sla', ComplianceController.getSLAStatus);

export default router;
