import { LolLootV1PlayerLoot } from '@shared/typings/lol/response/lolLootV1PlayerLoot';

export interface LolLootV1CraftMass {
  added: LolLootV1CraftMassDetail[];
  redeemed: LolLootV1CraftMassDetail[];
  removed: LolLootV1CraftMassDetail[];
}

export interface LolLootV1CraftMassDetail {
  deltaCount: number;
  playerLoot: LolLootV1PlayerLoot;
}
