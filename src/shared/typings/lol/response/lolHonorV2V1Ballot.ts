export interface LolHonorV2V1Ballot {
  eligibleAllies: LolHonorV2V1BallotEligible[];
  eligibleOpponents: LolHonorV2V1BallotEligible[];
  gameId: number;
  honoredPlayers: LolHonorV2V1BallotHonoredPlayer[];
  votePool: LolHonorV2V1BallotVotePool;
}

export interface LolHonorV2V1BallotEligible {
  botPlayer: boolean;
  championName: string;
  puuid: string;
  role: string;
  skinSplashPath: string;
  summonerId: number;
  summonerName: string;
}

export interface LolHonorV2V1BallotHonoredPlayer {
  honorType: string;
  recipientPuuid: string;
}

export interface LolHonorV2V1BallotVotePool {
  fromGamePlayed: number;
  fromHighHonor: number;
  fromRecentHonors: number;
  fromRollover: number;
  votes: number;
}
