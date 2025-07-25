import { EnumAbstract } from '@main/abstract/enum.abstract';
import { Null } from '@shared/typings/generic.typing';
import { Enum, EnumConstNames } from 'ts-jenum';

type Converter<V> = (value: Null<string>) => V;

@Enum()
export class AppConfigEnum<V = unknown> extends EnumAbstract<AppConfigEnum> {
  static RIOT_CLIENT_PATH = new AppConfigEnum('Riot Client Path', (v) => {
    return v;
  });
  static THEME_MODE = new AppConfigEnum('Theme Mode', (v) => {
    return v;
  });
  static VOLUME = new AppConfigEnum('Volume', (v) => {
    return Number(v);
  });

  convertValue: Converter<V>;

  constructor(description: string, converter: Converter<V>) {
    super(description);
    this.convertValue = converter;
  }
}

export type AppConfigKeys = EnumConstNames<typeof AppConfigEnum>;
