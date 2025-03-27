import { ClassType } from '@main/typings/generic.typing';
import { Null } from '@shared/typings/generic.typing';
import { ClassConstructor } from 'class-transformer';
import { IStaticEnum } from 'ts-jenum';
import { IsNull, Like, Not, ValueTransformer } from 'typeorm';

export class TypeOrmUtil {
  static relation<T>(entity: ClassConstructor<T>, data: Partial<T>) {
    // @ts-ignore
    return Object.assign(new entity(), data) as T;
  }

  static transformDate(): ValueTransformer {
    return {
      from(value: Date): Date {
        return new Date(value);
      },
      to(value: Date): Date {
        return value;
      },
    };
  }

  static transformNumber(): ValueTransformer {
    return {
      from(value: string) {
        return Number(value);
      },
      to(value: number) {
        return value;
      },
    };
  }

  static transformArrayString(): ValueTransformer {
    return {
      from(value: string) {
        return value.split(',').filter(Boolean);
      },
      to(value: string[]) {
        return value.filter(Boolean).join(',');
      },
    };
  }

  static whereLike(value: Null<string> | undefined) {
    if (!value) return;

    return Like(`%${value}%`);
  }

  static whereLikeOrNotNull(value: Null<string> | undefined) {
    if (!value) return Not(IsNull());

    return Like(`%${value}%`);
  }

  static transformArrayEnum(e: ClassType<unknown>): ValueTransformer {
    return {
      from(value: string) {
        if (!value) return [];
        return value
          .split(',')
          .filter(Boolean)
          .map((eString) => (e as IStaticEnum<unknown>).valueByName(eString));
      },
      to(value: InstanceType<IStaticEnum<unknown>>[]) {
        if (!value) return '';
        return value
          .filter(Boolean)
          .map((e) => e.enumName)
          .join(',');
      },
    };
  }
}
