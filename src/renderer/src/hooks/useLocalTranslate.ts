import { useStore } from '@render/zustand/store';
import defaultLocale from '../locales/default';
import ptBrLocale from '../locales/pt_BR';

export const useLocalTranslate = () => {
  const locale = useStore().leagueClient.locale();

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
