import { CustomButton } from '@render/components/input';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';

interface ContinueButtonProps {
  onClickContinue: () => void;
}

export const ContinueButton = ({ onClickContinue }: ContinueButtonProps) => {
  const { rcpFeLolPostgame } = useLeagueTranslate();

  const { rcpFeLolPostgameTrans } = rcpFeLolPostgame;

  return (
    <CustomButton variant={'contained'} onClick={onClickContinue}>
      {rcpFeLolPostgameTrans('career_postgame_button_continue')}
    </CustomButton>
  );
};
