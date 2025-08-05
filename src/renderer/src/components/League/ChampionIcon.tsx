import { CircularIcon } from '@render/components/CircularIcon';
import { useLeagueImage } from '@render/hooks/useLeagueImage';

interface ChampionIconProps {
  championId: number;
  iconSize?: number;
}

export const ChampionIcon = ({
  championId,
  iconSize = 30,
}: ChampionIconProps) => {
  const { championIcon } = useLeagueImage();
  return <CircularIcon src={championIcon(championId)} size={iconSize} />;
};
