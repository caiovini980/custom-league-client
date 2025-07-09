import { leagueClientStore } from '@render/zustand/stores/leagueClientStore';
import defaultLocale from '../locales/default';
import ptBrLocale from '../locales/pt_BR';

export const useLocalTranslate = () => {
  const locale = leagueClientStore.locale.use();

  return {
    localTranslate: (key: keyof typeof defaultLocale) => {
      const localeMap: Record<string, Record<string, string>> = {
        pt_BR: ptBrLocale,
      };
      if (localeMap[locale]) {
        return localeMap[locale][key] ?? '';
      }
      return defaultLocale[key];
    },
  };
};
