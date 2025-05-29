import { useStore } from '@render/zustand/store';
import { KebabToCamelCase } from '@shared/typings/generic.typing';
import { kebabToCamelCase } from '@shared/utils/string.util';
import { translateJsonMap } from '@shared/utils/translate.util';

type Translate = typeof translateJsonMap;
type TranslatePath = keyof Translate;

type TransReturn<F> = {
  [K in TranslatePath as KebabToCamelCase<K>]: (
    path: Translate[K][number],
  ) => F;
};

export const useLeagueTranslate = () => {
  const translateData = useStore().gameData.translate();

  const translate = (path: TranslatePath, source: string) => {
    const data = translateData[path][source];
    return (key: string, ...args: unknown[]) => {
      if (!data[key]) {
        console.warn(
          `Translate key [ ${key} ] not found in path: ${path} -> ${source}`,
        );
        return '';
      }
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

  return Object.keys(translateJsonMap).reduce(
    (prev, curr) => {
      return Object.assign(prev, {
        [kebabToCamelCase(curr)]: translateMapper(curr as TranslatePath),
      });
    },
    {} as TransReturn<ReturnType<typeof translate>>,
  );
};
