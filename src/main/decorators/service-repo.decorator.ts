import { RepositoryAbstract } from '@main/abstracts/repository.abstract';
import { ServiceRepoAbstract } from '@main/abstracts/service-repo.abstract';
import { Service } from '@main/decorators/service.decorator';
import { ClassType } from '@main/typings/generic.typing';
import {
  addClassInConstructor,
  extendsConstructor,
} from '@main/utils/reflect.util';
import { ObjectLiteral } from 'typeorm';

type ServiceRepoClassDecorator<
  R extends RepositoryAbstract<ObjectLiteral>,
  C extends ServiceRepoAbstract<R>,
> = (constructor: ClassType<ServiceRepoAbstract<R>>) => ClassType<C>;

const ServiceRepoDecorator = <
  R extends RepositoryAbstract<ObjectLiteral>,
  C extends ServiceRepoAbstract<R>,
>(
  repository: ClassType<R>,
): ServiceRepoClassDecorator<R, C> => {
  return (constructor) => {
    constructor = extendsConstructor(constructor, Service);
    addClassInConstructor(constructor, repository);

    const ServiceRepoClass = <ClassType<C>>class extends constructor {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      constructor(repository: R, ...args: any[]) {
        super(...args);
        this.repository = repository;
      }
    };

    Object.defineProperty(ServiceRepoClass, 'name', {
      value: constructor.name,
      writable: false,
    });

    return ServiceRepoClass;
  };
};

export const ServiceRepo = ServiceRepoDecorator;
