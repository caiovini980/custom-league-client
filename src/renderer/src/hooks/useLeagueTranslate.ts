import { gameDataStore } from '@render/zustand/stores/gameDataStore';
import { KebabToCamelCase } from '@shared/typings/generic.typing';
import { kebabToCamelCase } from '@shared/utils/string.util';
import { translateJsonMap } from '@shared/utils/translate.util';
import { useMemo } from 'react';

type Translate = typeof translateJsonMap;
type TranslatePath = keyof Translate;

type TransReturn = {
  [K in TranslatePath as KebabToCamelCase<K>]: Record<
    KebabToCamelCase<`${K}-${Translate[K][number]}`>,
    (key: string, ...args: unknown[]) => string
  >;
};

export const useLeagueTranslate = () => {
  const translateData = gameDataStore.translate.use();

  const translate = (path: TranslatePath, source: string) => {
    const data = translateData[path]?.[source] ?? {};
    return (key: string, ...args: unknown[]) => {
      if (!data[key]) {
        console.warn(
          `Translate key [ ${key} ] not found in path: ${path} -> ${source}`,
        );
        return '';
      }
      return args.reduce<string>((prev, curr) => {
        return prev.replace(/{{\w+}}/, String(curr));
      }, data[key]);
    };
  };

  const translateMapper = <K extends TranslatePath>(path: K) => {
    const sources = translateJsonMap[path];
    if (!sources) {
      return (_key: (typeof translateJsonMap)[K][number]) => () => '';
    }
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

    return translateJsonMap[path].reduce((prev, curr) => {
      return Object.assign(prev, {
        [kebabToCamelCase(`${path}-${curr}`)]: f[curr],
      });
    }, {});
  };

  return useMemo(
    () =>
      Object.keys(translateJsonMap).reduce((prev, curr) => {
        return Object.assign(prev, {
          [kebabToCamelCase(curr)]: translateMapper(curr as TranslatePath),
        });
      }, {} as TransReturn),
    [translateData],
  );
};
