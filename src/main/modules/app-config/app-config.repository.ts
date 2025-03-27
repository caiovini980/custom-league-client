import { RepositoryAbstract } from '@main/abstracts/repository.abstract';
import { Repository } from '@main/decorators/repository.decorator';
import { AppConfigEntity } from '@main/modules/app-config/app-config.entity';

@Repository(AppConfigEntity)
export class AppConfigRepository extends RepositoryAbstract<AppConfigEntity> {}
