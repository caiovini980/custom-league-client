export interface LolShutdownV1Notification {
  additionalInfo: string;
  countdown: number;
  reason: 'PlatformMaintenance';
}
