import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ProgressInfo } from 'electron-updater';
import { Undefined } from '@shared/typings/generic.typing';
import {
  useElectronHandle,
  useElectronListen,
} from '@render/utils/electronFunction.util';
import { VersionInfo } from '@shared/typings/ipc-function/handle/updater.typing';

export type UpdateStatus = 'checking' | 'downloading' | 'updated' | 'available';

interface VersionContextData {
  updateStatus: UpdateStatus;
  progress: ProgressInfo;
  isModalOpen: boolean;
  checkUpdate: () => void;
  quitAndInstallUpdate: () => void;
  closeModal: () => void;
  openModal: () => void;
  versionInfo: Undefined<VersionInfo>;
}

const context = createContext({} as VersionContextData);

export const useVersionContext = () => useContext(context);

export const VersionContext = ({ children }: PropsWithChildren) => {
  const { updater } = useElectronHandle();

  const [openModal, setOpenModal] = useState(false);
  const [versionInfo, setVersionInfo] = useState<VersionInfo>();
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>('updated');
  const [progressInfo, setProgressInfo] = useState<ProgressInfo>({
    percent: 0,
    bytesPerSecond: 0,
    delta: 0,
    total: 0,
    transferred: 0,
  });

  const checkUpdate = () => {
    setUpdateStatus('checking');
    updater.versionInfo().then((info) => {
      setVersionInfo(info);
    });
    updater.check().then((hasUpdate) => {
      setUpdateStatus(hasUpdate ? 'downloading' : 'updated');
    });
  };

  useElectronListen('onDownloadingUpdate', (data) => {
    setUpdateStatus('downloading');
    setProgressInfo(data);
  });

  useElectronListen('onUpdateComplete', () => {
    setUpdateStatus('available');
  });

  useEffect(() => {
    checkUpdate();
  }, []);

  return (
    <context.Provider
      value={{
        updateStatus,
        versionInfo,
        progress: {
          ...progressInfo,
          percent: Math.floor(progressInfo?.percent),
        },
        isModalOpen: openModal,
        closeModal: () => setOpenModal(false),
        openModal: () => setOpenModal(true),
        checkUpdate,
        quitAndInstallUpdate: () => updater.quitAndInstallUpdate(),
      }}
    >
      {children}
    </context.Provider>
  );
};
