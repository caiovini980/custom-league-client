export interface LolGameFlowV1Availability {
  isAvailable: boolean;
  state:
    | 'Available'
    | 'EligibilityInfoMissing'
    | 'Configuration'
    | 'InGameFlow';
}
