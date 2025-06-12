import { AppConfig20250326223652 } from '@main/integrations/typeorm/migrations/20250326223652-app-config';
import { AddThemeMode20250530101639 } from '@main/integrations/typeorm/migrations/20250530101639-add-theme-mode';
import { AddVolume20250611083037 } from '@main/integrations/typeorm/migrations/20250611083037-add-volume';

export const migration = [
  // Dont remove
  AppConfig20250326223652,
  AddThemeMode20250530101639,
  AddVolume20250611083037,
];
