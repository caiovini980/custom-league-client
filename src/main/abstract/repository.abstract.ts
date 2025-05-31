import { ObjectLiteral, Repository } from 'typeorm';

export abstract class RepositoryAbstract<
  E extends ObjectLiteral,
> extends Repository<E> {}
