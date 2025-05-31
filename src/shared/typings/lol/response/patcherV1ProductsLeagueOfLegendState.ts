import { Null } from '@shared/typings/generic.typing';

export interface PatcherV1ProductsLeagueOfLegendState {
  action: string;
  components: PatcherV1ProductsLeagueOfLegendStateComponent[];
  id: string;
  isCorrupted: boolean;
  isStopped: boolean;
  isUpToDate: boolean;
  isUpdateAvailable: boolean;
  percentPatched: number;
}

export interface PatcherV1ProductsLeagueOfLegendStateComponent {
  action: string;
  id: string;
  isCorrupted: boolean;
  isUpToDate: boolean;
  isUpdateAvailable: boolean;
  progress: Null<{
    currentItem: string;
    network: {
      bytesComplete: number;
      bytesPerSecond: number;
      bytesRequired: number;
    };
    primaryWork: string;
    total: {
      bytesComplete: number;
      bytesPerSecond: number;
      bytesRequired: number;
    };
  }>;
  timeOfLastUpToDateCheckISO8601: string;
}
