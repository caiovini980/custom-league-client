import { EnumAbstract } from '@main/abstract/enum.abstract';
import { Null } from '@shared/typings/generic.typing';
import { Enum } from 'ts-jenum';

type Converter<V> = (value: Null<string>) => V;

@Enum()
export class AppConfigKeysEnum<
  V = unknown,
> extends EnumAbstract<AppConfigKeysEnum> {
  static RIOT_CLIENT_PATH = new AppConfigKeysEnum('Riot Client Path', (v) => {
    return v;
  });

  convertValue: Converter<V>;

  constructor(description: string, converter: Converter<V>) {
    super(description);
    this.convertValue = converter;
  }
}
