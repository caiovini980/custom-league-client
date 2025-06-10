export const translateJsonMap = {
  'rcp-fe-lol-shared-components': [
    'trans-account-verification',
    'trans-challenges',
    'trans-champion-mastery',
    'trans-currency-container',
    'trans-digital-goods-disclaimer',
    'trans-eternals',
    'trans-league-tier-names',
    'trans-regalia',
    'trans-replays',
    'trans-report-modal',
    'trans-shoppefront',
    'trans',
  ],
  'rcp-fe-lol-match-history': ['trans'],
  'rcp-fe-lol-champ-select': ['trans'],
  'rcp-fe-lol-collections': ['trans', 'trans-perks'],
  'rcp-fe-lol-navigation': ['trans'],
  'rcp-fe-lol-social': ['trans', 'trans-player-behavior'],
  'rcp-fe-lol-parties': ['trans'],
  'rcp-fe-lol-l10n': ['trans'],
  'rcp-fe-lol-honor': ['trans'],
  'rcp-fe-lol-postgame': ['trans'],
  'rcp-fe-lol-yourshop': ['trans'],
} as const;

export type TranslatePathKeys = keyof typeof translateJsonMap;
