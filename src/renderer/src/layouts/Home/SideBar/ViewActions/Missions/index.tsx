import { Paper, Stack } from '@mui/material';
import { CustomDialogCloseFloatingButton } from '@render/components/CustomDialog';
import CustomTab, { CustomTabPanel } from '@render/components/CustomTab';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { Event } from '@render/layouts/Home/SideBar/ViewActions/Missions/Event';
import { ObjectivesCategory } from '@render/layouts/Home/SideBar/ViewActions/Missions/ObjectivesCategory';
import { useViewActionButtonContext } from '@render/layouts/Home/SideBar/ViewActions/ViewActionButton';
import { LolEventHubV1Events } from '@shared/typings/lol/response/lolEventHubV1Events';
import { LolObjectivesV1Objectives_IdObjectivesCategory } from '@shared/typings/lol/response/lolObjectivesV1Objectives_Id';
import { useEffect, useState } from 'react';

export const Missions = () => {
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolL10n } = useLeagueTranslate();
  const { isActive, forceClose } = useViewActionButtonContext();

  const { rcpFeLolL10nTrans } = rcpFeLolL10n;

  const [lolObjectives, setLolObjectives] = useState<
    LolObjectivesV1Objectives_IdObjectivesCategory[]
  >([]);
  const [tftObjectives, setTftObjectives] = useState<
    LolObjectivesV1Objectives_IdObjectivesCategory[]
  >([]);
  const [events, setEvents] = useState<LolEventHubV1Events[]>([]);

  useEffect(() => {
    if (!isActive) return;
    makeRequest('GET', '/lol-objectives/v1/objectives/lol', undefined).then(
      (res) => {
        if (res.ok) {
          setLolObjectives(res.body[0].objectivesCategories);
        }
      },
    );
    makeRequest('GET', '/lol-objectives/v1/objectives/tft', undefined).then(
      (res) => {
        if (res.ok) {
          setTftObjectives(res.body[0].objectivesCategories);
        }
      },
    );
    makeRequest('GET', '/lol-event-hub/v1/events', undefined).then((res) => {
      if (res.ok) {
        setEvents(res.body);
      }
    });
  }, [isActive]);

  return (
    <Stack
      component={Paper}
      width={800}
      height={'80vh'}
      variant={'outlined'}
      position={'relative'}
    >
      <CustomDialogCloseFloatingButton handleClose={forceClose} />
      <CustomTab>
        <CustomTabPanel label={rcpFeLolL10nTrans('navbar_league')} name={'lol'}>
          <ObjectivesCategory categories={lolObjectives} />
        </CustomTabPanel>
        <CustomTabPanel label={rcpFeLolL10nTrans('navbar_tft')} name={'tft'}>
          <ObjectivesCategory categories={tftObjectives} />
        </CustomTabPanel>
        {events.map((e) => {
          return (
            <CustomTabPanel
              key={e.eventId}
              label={e.eventInfo.eventName}
              name={e.eventId}
            >
              <Event
                eventId={e.eventId}
                progressEndDate={e.eventInfo.progressEndDate}
              />
            </CustomTabPanel>
          );
        })}
      </CustomTab>
    </Stack>
  );
};
