import { RepositoryAbstract } from '@main/abstracts/repository.abstract'
import { Service } from '@main/decorators/service.decorator'
import { ServiceRepoAbstract } from '@main/abstracts/service-repo.abstract'
import { ClassType } from '@main/typings/generic.typing'
import { addClassInConstructor, extendsConstructor } from '@main/utils/reflect.util'

type ServiceRepoClassDecorator<
  R extends RepositoryAbstract<any>,
  C extends ServiceRepoAbstract<R>
> = (constructor: ClassType<ServiceRepoAbstract<R>>) => ClassType<C>

const ServiceRepoDecorator = <R extends RepositoryAbstract<any>, C extends ServiceRepoAbstract<R>>(
  repository: ClassType<R>
): ServiceRepoClassDecorator<R, C> => {
  return (constructor) => {
    constructor = extendsConstructor(constructor, Service)
    addClassInConstructor(constructor, repository)

    return <ClassType<C>>class extends constructor {
      constructor(repository: R, ...args: any[]) {
        super(...args)
        this.repository = repository
      }
    }
  }
}

export const ServiceRepo = ServiceRepoDecorator
