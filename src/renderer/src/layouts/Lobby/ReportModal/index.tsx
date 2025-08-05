import { Stack, Typography } from '@mui/material';
import { CircularIcon } from '@render/components/CircularIcon';
import CustomDialog from '@render/components/CustomDialog';
import { CustomCheckBox, CustomTextField } from '@render/components/input';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useSnackNotification } from '@render/hooks/useSnackNotification';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

export interface ReportModalRef {
  open: (puuid: string, gameId: number) => void;
}

interface ReportModalProps {
  type: 'champ-select-reports' | 'end-of-game-reports';
}

export const ReportModal = forwardRef<ReportModalRef, ReportModalProps>(
  (props, ref) => {
    const { makeRequest } = useLeagueClientRequest();
    const { profileIcon } = useLeagueImage();
    const { rcpFeLolSharedComponents } = useLeagueTranslate();
    const { snackSuccess } = useSnackNotification();

    const { rcpFeLolSharedComponentsTransReportModal } =
      rcpFeLolSharedComponents;

    const [comment, setComment] = useState('');
    const [reportCategories, setReportCategories] = useState<string[]>([]);

    const [modalData, setModalData] = useState({
      open: false,
      loading: false,
      puuid: '',
      name: '',
      profileIconId: 0,
      gameId: 0,
    });

    const reportKey: string[] = [
      'assisting_enemy_team',
      'hate_speech',
      'inappropriate_name',
      'leaving_afk',
      'negative_attitude',
      'third_party_tools',
      'verbal_abuse',
      'rank_manipulation',
    ];

    const onChangeCheckBox = (reportKey: string, value: boolean) => {
      if (value) {
        setReportCategories((prev) => [...prev, reportKey]);
      } else {
        setReportCategories((prev) => prev.filter((p) => p !== reportKey));
      }
    };

    const handleClose = () => {
      setModalData((prev) => ({
        ...prev,
        open: false,
      }));
      setComment('');
    };

    const handleSendReport = () => {
      makeRequest('POST', `/lol-player-report-sender/v1/${props.type}` as any, {
        gameId: modalData.gameId,
        offenderPuuid: modalData.puuid,
        offenderSummonerId: 0,
        obfuscatedOffenderPuuid: '',
        comment,
        categories: reportCategories,
      }).then((res) => {
        if (res.ok) {
          handleClose();
          snackSuccess(
            rcpFeLolSharedComponentsTransReportModal('player_report_sent'),
          );
        }
      });
    };

    useImperativeHandle(ref, () => {
      return {
        open: (puuid, gameId) =>
          setModalData({
            open: true,
            puuid,
            gameId,
            loading: true,
            name: '',
            profileIconId: 0,
          }),
      };
    }, []);

    useEffect(() => {
      if (!modalData.puuid) return;
      makeRequest(
        'GET',
        buildEventUrl(
          '/lol-summoner/v2/summoners/puuid/{uuid}',
          modalData.puuid,
        ),
        undefined,
      ).then((res) => {
        if (res.ok) {
          setModalData((prev) => ({
            ...prev,
            loading: false,
            name: `${res.body.gameName} #${res.body.tagLine}`,
            profileIconId: res.body.profileIconId,
          }));
        }
      });
    }, [modalData.puuid]);

    return (
      <CustomDialog
        open={modalData.open}
        loading={modalData.loading}
        labelBtnConfirm={rcpFeLolSharedComponentsTransReportModal(
          'report_modal_accept_button',
        )}
        labelBtnCancel={rcpFeLolSharedComponentsTransReportModal(
          'report_modal_decline_button',
        )}
        handleConfirm={handleSendReport}
        handleClose={handleClose}
      >
        <Stack direction={'column'} rowGap={1}>
          <Stack direction={'row'} columnGap={2} alignItems={'center'}>
            <CircularIcon
              src={profileIcon(modalData.profileIconId)}
              size={60}
            />
            <Stack direction={'column'} rowGap={1}>
              <Typography>
                {rcpFeLolSharedComponentsTransReportModal(
                  'report_modal_header_title',
                )}
              </Typography>
              <Typography>{modalData.name}</Typography>
            </Stack>
          </Stack>
          <Typography fontSize={'0.8rem'}>
            {rcpFeLolSharedComponentsTransReportModal(
              'report_modal_description',
            )}
          </Typography>
          {reportKey.map((key) => (
            <Stack key={key} direction={'row'} alignItems={'center'}>
              <CustomCheckBox
                checked={reportCategories.includes(key)}
                onChange={(v) => onChangeCheckBox(key, v)}
              />
              <Stack direction={'column'}>
                <Typography>
                  {rcpFeLolSharedComponentsTransReportModal(
                    `report_modal_key_title_${key}`,
                  )}
                </Typography>
                <Typography fontSize={'0.8rem'} color={'textSecondary'}>
                  {rcpFeLolSharedComponentsTransReportModal(
                    `report_modal_key_description_${key}`,
                  )}
                </Typography>
              </Stack>
            </Stack>
          ))}
          <CustomTextField
            value={comment}
            onChangeText={setComment}
            multiline
            minRows={3}
            placeholder={rcpFeLolSharedComponentsTransReportModal(
              'report_modal_textarea_placeholder',
            )}
          />
        </Stack>
      </CustomDialog>
    );
  },
);
