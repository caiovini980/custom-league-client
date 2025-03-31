export interface LoadGameDataResponse {
  filePath: string;
  version: string;
  language: string;
  championData: LoadGameDataChampionDataResponse[];
}

export interface LoadGameDataChampionDataResponse {
  id: string;
  key: string;
}
