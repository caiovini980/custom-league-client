import { Box } from '@mui/material';
import { CircularIcon } from '@render/components/CircularIcon';
import CustomTab, { CustomTabPanel } from '@render/components/CustomTab';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { Missions } from '@render/layouts/Home/ViewActions/Missions/Missions';
import { LolObjectivesV1Objectives_IdObjectivesCategory } from '@shared/typings/lol/response/lolObjectivesV1Objectives_Id';

interface ObjectivesCategoryProps {
  categories: LolObjectivesV1Objectives_IdObjectivesCategory[];
}

export const ObjectivesCategory = ({ categories }: ObjectivesCategoryProps) => {
  const { lolGameDataImg } = useLeagueImage();

  const getCategoriesFiltered = () => {
    return categories.reduce((prev, curr) => {
      const obs = curr.objectives.filter((o) => o.missions.length);
      if (obs.length) {
        prev.push({
          ...curr,
          objectives: obs,
        });
      }

      return prev;
    }, [] as LolObjectivesV1Objectives_IdObjectivesCategory[]);
  };

  return (
    <CustomTab tabsProps={{ orientation: 'vertical' }} mode={'overlay'}>
      {getCategoriesFiltered().map((c) => {
        return (
          <CustomTabPanel
            key={c.id}
            label={c.categoryName}
            name={c.id}
            icon={
              <Box mr={1}>
                <CircularIcon
                  src={lolGameDataImg(c.categorySectionImage)}
                  size={22}
                />
              </Box>
            }
            iconPosition={'start'}
          >
            <CustomTab>
              {c.objectives.map((o) => {
                return (
                  <CustomTabPanel
                    key={o.id}
                    label={o.localizedTitle[0]}
                    name={o.id}
                  >
                    <Missions missions={o.missions} />
                  </CustomTabPanel>
                );
              })}
            </CustomTab>
          </CustomTabPanel>
        );
      })}
    </CustomTab>
  );
};
