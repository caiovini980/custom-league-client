export interface VersionInfo {
  version: string;
  releases: VersionInfoChangeLog[];
}

export interface VersionInfoChangeLog {
  id: number;
  html_url: string;
  tag_name: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  body: string;
}
