import { ServiceAbstract } from '@main/abstracts/service.abstract'
import { RepositoryAbstract } from '@main/abstracts/repository.abstract'

export abstract class ServiceRepoAbstract<
  R extends RepositoryAbstract<any>
> extends ServiceAbstract {
  protected repository!: R
}
