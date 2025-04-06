export interface LolReplaysV1Metadata_Id {
  downloadProgress: number;
  gameId: number;
  state:
    | 'download'
    | 'incompatible'
    | 'downloading'
    | 'watch'
    | 'checking'
    | 'found'
    | 'missing_or_expired'
    | 'retry_download'
    | 'unsupported'
    | 'lost'
    | 'error';
}
