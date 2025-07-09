import { Box, ButtonBase, Paper, Stack } from '@mui/material';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { Null } from '@shared/typings/generic.typing';
import {
  LolChampSelectV1SkinCarouselSkins,
  LolChampSelectV1SkinCarouselSkinsChildSkins,
} from '@shared/typings/lol/response/lolChampSelectV1SkinCarouselSkins';
import { useState } from 'react';

interface ChromaSelectorProps {
  skin: LolChampSelectV1SkinCarouselSkins;
  onChangeSkinId: (skinId: number) => void;
}

export const ChromaSelector = ({
  skin,
  onChangeSkinId,
}: ChromaSelectorProps) => {
  const { lolGameDataImg, genericImg } = useLeagueImage();

  const [parentSkinPath, setParentSkinPath] = useState<Null<string>>(null);

  const ColorIcon = (props: {
    color1: string;
    color2: string;
    onClick: () => void;
    disabled?: boolean;
    isClear?: boolean;
  }) => {
    const size = 20;
    const borderWidth = 1;
    const borderColor = props.isClear ? '#ff4747' : '#c4c4c4';

    return (
      <Box
        component={ButtonBase}
        onClick={() => props.onClick()}
        height={size}
        width={size}
        borderRadius={'100%'}
        position={'relative'}
        disabled={props.disabled}
        sx={{
          border: `${borderWidth}px solid ${borderColor}`,
          background: `linear-gradient(to right, ${props.color1} 50%, ${props.color2} 50%)`,
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: `${borderWidth}px`,
            height: '100%',
            backgroundColor: borderColor,
            zIndex: 2,
          },
        }}
      />
    );
  };

  const onChangeChroma = (
    chroma: LolChampSelectV1SkinCarouselSkinsChildSkins,
  ) => {
    onChangeSkinId(chroma.id);
    setParentSkinPath(chroma.chromaPreviewPath);
  };

  const resetChroma = () => {
    onChangeSkinId(skin.id);
    setParentSkinPath(null);
  };

  if (!skin.unlocked) return '';
  if (!skin.childSkins.length) return '';

  return (
    <Stack
      direction={'column'}
      alignItems={'center'}
      rowGap={1}
      minWidth={200}
      p={1}
      component={Paper}
      sx={{
        background: `url(${genericImg('plugins/rcp-fe-lol-navigation/global/default/chroma_bg.png')})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <img
        src={lolGameDataImg(parentSkinPath ?? skin.chromaPreviewPath)}
        height={'300px'}
        alt={skin.name}
      />
      <Stack direction={'row'} columnGap={1} justifyContent={'center'}>
        <ColorIcon
          color1={'white'}
          color2={'white'}
          onClick={() => resetChroma()}
          isClear
        />
        {skin.childSkins.map((cs) => {
          return (
            <ColorIcon
              key={cs.id}
              color1={cs.colors[0]}
              color2={cs.colors[1]}
              disabled={!cs.unlocked}
              onClick={() => onChangeChroma(cs)}
            />
          );
        })}
      </Stack>
    </Stack>
  );
};
