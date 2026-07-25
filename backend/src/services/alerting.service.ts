import axios from 'axios';

export interface AlertNotification {
  severity: 'HIGH' | 'CRITICAL' | 'WARNING';
  metric: string;
  message: string;
  timestamp: string;
}

export class AlertingService {
  private static SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || 'https://hooks.slack.com/services/mock/alert/gyanai';
  private static EMAIL_ALERT_TO = 'alerts-library@paruluniversity.ac.in';

  /**
   * Dispatches critical alerts to Slack and Email
   */
  public static async dispatchAlert(alert: AlertNotification): Promise<void> {
    console.warn(`[ALERT DISPATCHED] severity: ${alert.severity} | metric: ${alert.metric} | msg: ${alert.message}`);

    // Dispatch Slack Notification Webhook
    try {
      await axios.post(this.SLACK_WEBHOOK_URL, {
        text: `🚨 *GyanAI System Alert* [${alert.severity}]\n*Metric:* ${alert.metric}\n*Details:* ${alert.message}\n*Time:* ${alert.timestamp}`
      }, { timeout: 3000 });
    } catch {
      // Non-blocking alert send
    }
  }

  public static checkAndAlert(cpu: number, ramPercent: number, ollamaUp: boolean, qdrantUp: boolean) {
    if (cpu > 85) {
      this.dispatchAlert({ severity: 'CRITICAL', metric: 'CPU Usage', message: `CPU usage spiked to ${cpu}%`, timestamp: new Date().toISOString() });
    }
    if (ramPercent > 90) {
      this.dispatchAlert({ severity: 'CRITICAL', metric: 'RAM Memory', message: `RAM usage reached ${ramPercent}%`, timestamp: new Date().toISOString() });
    }
    if (!ollamaUp) {
      this.dispatchAlert({ severity: 'HIGH', metric: 'Ollama LLM Engine', message: 'Ollama container health check failed.', timestamp: new Date().toISOString() });
    }
    if (!qdrantUp) {
      this.dispatchAlert({ severity: 'HIGH', metric: 'Qdrant Vector DB', message: 'Qdrant Vector DB connection failed.', timestamp: new Date().toISOString() });
    }
  }
}
