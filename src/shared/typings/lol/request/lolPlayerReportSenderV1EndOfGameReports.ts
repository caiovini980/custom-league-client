export interface LolPlayerReportSenderV1EndOfGameReports {
  offenderPuuid: string;
  obfuscatedOffenderPuuid: string;
  categories: string[];
  gameId: number;
  offenderSummonerId: number;
  comment: string;
}
