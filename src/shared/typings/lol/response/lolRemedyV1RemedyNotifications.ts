export interface LolRemedyV1RemedyNotifications {
  mailId: string;
  state: 'NEW';
  message: string;
  createdAt: number;
}

export interface LolRemedyV1RemedyNotificationsTransgression {
  remedyRewards: unknown[];
  offenderPuuid: string;
  transgressionType: 'AWAY_FROM_KEYBOARD';
  transgressionId: string;
  didReportOffender: boolean;
}
