import { Box } from '@mui/material';
import { CustomIconButton } from '@render/components/input';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { centerHubStore } from '@render/zustand/stores/centerHubStore';
import { leagueClientStore } from '@render/zustand/stores/leagueClientStore';
import { minigameStore } from '@render/zustand/stores/minigameStore';
import { useEffect, useRef } from 'react';
import { MdClose } from 'react-icons/md';

interface IFrameEventData {
  // biome-ignore lint/suspicious/noExplicitAny: none
  data: any;
  messageType: string;
  type: 'RClientWindowMessenger';
}

interface SendMessageData {
  messageType: string;
  data: unknown;
}

export const Minigame = () => {
  const { makeRequest } = useLeagueClientRequest();

  const iFrameRef = useRef<HTMLIFrameElement>(null);

  const news = centerHubStore.news.use();
  const open = minigameStore.open.use();
  const language = leagueClientStore.language.use();
  const link = minigameStore.data.use();

  const closeMinigame = () => {
    minigameStore.open.set(false);
  };

  const sendMessageIFrame = (data: SendMessageData) => {
    if (!link?.action.payload.url) return;
    const origin = new URL(link.action.payload.url).origin;
    iFrameRef.current?.contentWindow?.postMessage(
      {
        type: 'RClientWindowMessenger',
        ...data,
      },
      origin,
    );
  };

  const handleMessage = (ev: MessageEvent<IFrameEventData>) => {
    const { data } = ev;
    if (data.type !== 'RClientWindowMessenger') return;

    switch (data.messageType) {
      case 'rcp-fe-lol-home-data-request': {
        makeRequest(
          'GET',
          '/lol-publishing-content/v1/listeners/client-data',
          undefined,
        ).then((res) => {
          if (res.ok) {
            sendMessageIFrame({
              messageType: 'rcp-fe-lol-home-data-response',
              data: res.body,
            });
          }
        });
        break;
      }
      case 'rcp-fe-lol-home-inventory-observe': {
        makeRequest(
          'GET',
          buildEventUrl(
            '/lol-inventory/v2/inventory/{string}',
            data.data.inventoryType,
          ),
          undefined,
        ).then((res) => {
          if (res.ok) {
            sendMessageIFrame({
              messageType: 'rcp-fe-lol-home-inventory-response',
              data: {
                inventoryType: data.data.inventoryType,
                inventory: res.body,
              },
            });
          }
        });
        break;
      }

      case 'rcp-fe-lol-home-progression-group-config-observe': {
        makeRequest(
          'GET',
          buildEventUrl(
            '/lol-progression/v1/groups/{uuid}/instanceData',
            data.data.groupId,
          ),
          undefined,
        ).then((res) => {
          if (res.ok) {
            sendMessageIFrame({
              messageType: 'rcp-fe-lol-home-progression-group-data-changed',
              data: res.body,
            });
          }
        });
        makeRequest(
          'GET',
          buildEventUrl(
            '/lol-progression/v1/groups/{uuid}/configuration',
            data.data.groupId,
          ),
          undefined,
        ).then((res) => {
          if (res.ok) {
            sendMessageIFrame({
              messageType: 'rcp-fe-lol-home-progression-group-config-changed',
              data: res.body,
            });
          }
        });
        break;
      }

      case 'rcp-fe-lol-home-observe-missions': {
        makeRequest('GET', '/lol-missions/v1/missions', undefined).then(
          (res) => {
            if (res.ok) {
              sendMessageIFrame({
                messageType: 'rcp-fe-lol-home-missions-changed',
                data: res.body,
              });
            }
          },
        );
        break;
      }

      case 'rcp-fe-lol-home-selectable-rewards-grants-observe': {
        makeRequest('GET', '/lol-rewards/v1/grants', undefined).then((res) => {
          if (res.ok) {
            sendMessageIFrame({
              messageType: 'rcp-fe-lol-home-selectable-rewards-grants-changed',
              data: res.body,
            });
          }
        });
        break;
      }

      case 'rcp-fe-lol-home-hub-settings-observe': {
        makeRequest(
          'GET',
          buildEventUrl(
            '/lol-settings/v2/account/{string}/{id}',
            'LCUPreferences',
            'lol-home-hubs',
          ),
          undefined,
        ).then((res) => {
          if (res.ok) {
            sendMessageIFrame({
              messageType: 'rcp-fe-lol-home-hub-settings-observe-response',
              data: res.body.data[data.data.hubId],
            });
          }
        });
        break;
      }

      case 'rcp-fe-lol-home-hub-settings-set': {
        makeRequest(
          'PATCH',
          buildEventUrl(
            '/lol-settings/v2/account/{string}/{id}',
            'LCUPreferences',
            'lol-home-hubs',
          ),
          {
            data: {
              [data.data.hubId]: data.data.hubData,
            },
            schemaVersion: 1,
          },
        );
        break;
      }
    }
  };

  useEffect(() => {
    if (!news) return;
    const promises = news.blades[0].items
      .flatMap((it) => it.header.links)
      .filter((l) => l.displayType === 'button')
      .map((l) => l.action.payload?.tabId)
      .filter(Boolean)
      .map((tabId) =>
        makeRequest(
          'GET',
          buildEventUrl('/lol-activity-center/v1/content/{id}', tabId ?? ''),
          undefined,
        ).then((res) => {
          return {
            tabId: tabId ?? '',
            res,
          };
        }),
      );

    Promise.all(promises).then((data) => {
      data
        .filter((d) => d.res.ok)
        .forEach((d) => {
          const link = d.res.body.blades
            .filter((b) => !!b.header)
            .flatMap((b) => b.header?.links)
            .find((l) => l?.action.type === 'lc_open_metagame');
          if (link) {
            minigameStore.data.set(link);
            minigameStore.showButtonInTabId.set(d.tabId);
          }
        });
    });

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [news]);

  useEffect(() => {
    sendMessageIFrame({
      messageType: `rcp-fe-lol-persistent-iframe-${open ? 'show' : 'hide'}`,
      data: undefined,
    });
  }, [open]);

  if (!link) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--mui-palette-common-black)',
        top: 0,
        left: 0,
        width: open ? '100%' : 0,
        height: '100%',
        zIndex: 99,
        overflow: 'hidden',
        transition: (t) => t.transitions.create('width'),
      }}
    >
      <CustomIconButton
        onClick={closeMinigame}
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
        }}
      >
        <MdClose />
      </CustomIconButton>
      <Box overflow={'hidden'}>
        <Box
          ref={iFrameRef}
          component={'iframe'}
          onLoad={() => console.log('lllll')}
          src={link.action.payload.url?.replace('{locale}', language)}
          sx={{
            p: 0,
            border: 0,
            width: 1055,
            height: 718,
            mt: '-82px',
          }}
        />
      </Box>
    </Box>
  );
};
