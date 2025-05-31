import { RepositoryAbstract } from '@main/abstracts/repository.abstract';
import { ClassType } from '@main/typings/generic.typing';
import { addClassInConstructor } from '@main/utils/reflect.util';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

type RepositoryClassDecorator<
  E extends object,
  R extends RepositoryAbstract<E>,
> = (constructor: ClassType<RepositoryAbstract<E>>) => ClassType<R>;

const RepositoryDecorator = <E extends object, R extends RepositoryAbstract<E>>(
  //@ts-ignore
  entity: ClassType<E>,
): RepositoryClassDecorator<E, R> => {
  return (constructor) => {
    Injectable()(constructor);
    addClassInConstructor(constructor, DataSource);

    return <ClassType<R>>class extends constructor {
      constructor(dataSource: DataSource) {
        super(entity, dataSource.createEntityManager());
      }
    };
  };
};

export const Repository = RepositoryDecorator;
