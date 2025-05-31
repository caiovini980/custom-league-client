import { RepositoryAbstract } from '@main/abstracts/repository.abstract';
import { ServiceAbstract } from '@main/abstracts/service.abstract';
import { ObjectLiteral } from 'typeorm';

export abstract class ServiceRepoAbstract<
  R extends RepositoryAbstract<ObjectLiteral>,
> extends ServiceAbstract {
  protected repository!: R;
}
