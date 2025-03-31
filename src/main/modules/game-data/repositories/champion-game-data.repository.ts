import { RepositoryAbstract } from '@main/abstract/repository.abstract';
import { Repository } from '@main/decorators/repository.decorator';
import { ChampionGameDataEntity } from '@main/modules/game-data/entities/champion-game-data.entity';

@Repository(ChampionGameDataEntity)
export class ChampionGameDataRepository extends RepositoryAbstract<ChampionGameDataEntity> {}
