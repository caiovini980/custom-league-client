import * as util from 'node:util';
import { plainToInstance } from 'class-transformer';
import { EnumType } from 'ts-jenum';

export class EnumResponse {
  name!: string;
  description!: string;
}

// @ts-ignore
export abstract class EnumAbstract<T> extends EnumType() {
  constructor(private _description: string) {
    super();
  }

  get description() {
    return this._description;
  }

  static override values() {
    // @ts-ignore
    // biome-ignore lint/complexity/noThisInStatic: <explanation>
    return super.values() as T[];
  }

  static override valueByName(name: string) {
    // @ts-ignore
    // biome-ignore lint/complexity/noThisInStatic: <explanation>
    return super.valueByName(name) as T;
  }

  get name() {
    // @ts-ignore
    return this.enumName;
  }

  toJSON() {
    return this.name;
  }

  override toString() {
    return this.name;
  }

  [util.inspect.custom]() {
    return String(this.name);
  }

  static toDto(e: EnumAbstract<unknown>): EnumResponse {
    return plainToInstance(EnumResponse, {
      name: e.name,
      description: e.description,
    });
  }

  static toListDto(ens: EnumAbstract<unknown>[]): EnumResponse[] {
    return ens.map((e) =>
      plainToInstance(EnumResponse, {
        name: e.name,
        description: e.description,
      }),
    );
  }
}
