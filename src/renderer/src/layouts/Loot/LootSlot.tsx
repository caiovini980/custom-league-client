import {
  ButtonBase,
  Collapse,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { CustomButton, CustomIconButton } from '@render/components/input';
import { SquareIcon } from '@render/components/SquareIcon';
import { useLootContext } from '@render/layouts/Loot/LootContext';
import { MdClose } from 'react-icons/md';

export const LootSlot = () => {
  const {
    isSlot,
    isAction,
    lootInSlots,
    removeLootInSlot,
    clearSlots,
    finishSlot,
    buttonLabel,
    buttonEnabled,
    description,
  } = useLootContext();

  return (
    <Collapse
      in={isSlot}
      orientation={'horizontal'}
      sx={{
        '& .MuiCollapse-wrapperInner': {
          width: 430,
        },
      }}
    >
      <Stack
        direction={'column'}
        rowGap={4}
        alignItems={'center'}
        justifyContent={'center'}
        height={'100%'}
        width={'100%'}
        p={1}
        overflow={'hidden'}
        borderLeft={'1px solid var(--mui-palette-divider)'}
      >
        <Typography>{description}</Typography>
        <Stack
          direction={'row'}
          justifyContent={'space-evenly'}
          alignItems={'center'}
          width={'100%'}
          border={'1px solid var(--mui-palette-divider)'}
          borderRadius={'4px'}
          p={1}
        >
          {lootInSlots.map((l) => {
            return (
              <Tooltip key={l.lootId} title={l.name} placement={'top'}>
                <Stack
                  direction={'column'}
                  rowGap={1}
                  component={ButtonBase}
                  onClick={() => removeLootInSlot(l.lootId)}
                >
                  <SquareIcon src={l.img} size={70} />
                  <Typography
                    fontSize={'0.8rem'}
                    textAlign={'center'}
                    color={
                      l.amount < l.amountRequired ? 'error' : 'textPrimary'
                    }
                  >
                    {l.amount} / {l.amountRequired}
                  </Typography>
                </Stack>
              </Tooltip>
            );
          })}
        </Stack>
        <Stack direction={'row'} columnGap={1}>
          <CustomButton
            variant={'outlined'}
            disabled={!buttonEnabled}
            onClick={finishSlot}
            loading={isAction}
          >
            {buttonLabel}
          </CustomButton>
          <CustomIconButton onClick={clearSlots} disabled={isAction}>
            <MdClose size={18} />
          </CustomIconButton>
        </Stack>
      </Stack>
    </Collapse>
  );
};
