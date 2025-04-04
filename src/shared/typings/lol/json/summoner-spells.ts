export interface SummonerSpells {
  id: number;
  name: string;
  description: string;
  summonerLevel: number;
  cooldown: number;
  gameModes: string[];
  iconPath: string;
}
