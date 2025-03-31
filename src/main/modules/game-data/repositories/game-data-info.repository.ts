import { RepositoryAbstract } from '@main/abstract/repository.abstract';
import { Repository } from '@main/decorators/repository.decorator';
import { GameDataInfoEntity } from '@main/modules/game-data/entities/game-data-info.entity';

@Repository(GameDataInfoEntity)
export class GameDataInfoRepository extends RepositoryAbstract<GameDataInfoEntity> {}
