import { CustomIconButtonTooltip } from '@render/components/input';
import { withClientConnected } from '@render/hoc/withClientConnected';
import { useLocalTranslate } from '@render/hooks/useLocalTranslate';
import { useElectronHandle } from '@render/utils/electronFunction.util';
import { leagueClientStore } from '@render/zustand/stores/leagueClientStore';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';

export const ShowClient = withClientConnected(() => {
  const { localTranslate } = useLocalTranslate();
  const { client } = useElectronHandle();
  const isClientOpen = leagueClientStore.isClientOpen.use();

  const onClickToggleClient = () => {
    leagueClientStore.isClientOpen.set(!isClientOpen);
    client.changeShowClient(!isClientOpen);
  };

  return (
    <CustomIconButtonTooltip
      title={localTranslate('toggle_show_client')}
      onClick={onClickToggleClient}
    >
      {isClientOpen ? <FaEye /> : <FaEyeSlash />}
    </CustomIconButtonTooltip>
  );
});
