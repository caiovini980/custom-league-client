export interface LoadGameDataResponse {
  version: string;
  language: string;
  championData: LoadGameDataChampionDataResponse[];
}

export interface LoadGameDataChampionDataResponse {
  id: string;
  key: string;
}
