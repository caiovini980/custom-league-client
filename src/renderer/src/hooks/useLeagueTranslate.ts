import { useStore } from '@render/zustand/store';
import { LoadGameDataComplete } from '@shared/typings/ipc-function/to-renderer/load-game-data.typing';
import { translateJsonMap } from '@shared/utils/translate.util';

type Translate = LoadGameDataComplete['info']['translate'];
type TranslatePath = keyof Translate;

export const useLeagueTranslate = () => {
  const translateData = useStore().gameData.translate();

  const translate = (path: TranslatePath, source: string) => {
    const data = translateData[path][source];
    return (key: string, ...args: unknown[]) => {
      return args.reduce<string>((prev, curr) => {
        return prev.replace(/{{.+}}/, String(curr));
      }, data[key]);
    };
  };

  const translateMapper = <K extends TranslatePath>(path: K) => {
    const sources = translateJsonMap[path];
    const f = sources.reduce(
      (prev, curr) => {
        return Object.assign(prev, {
          [curr]: translate(path, curr),
        });
      },
      {} as Record<
        (typeof translateJsonMap)[K][number],
        ReturnType<typeof translate>
      >,
    );

    return (key: (typeof translateJsonMap)[K][number]) => f[key];
  };

  return {
    rcpFeLolSharedComponents: translateMapper('rcp-fe-lol-shared-components'),
  };
};
