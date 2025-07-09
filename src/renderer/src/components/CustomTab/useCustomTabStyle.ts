import { makeSx } from '@render/styles';
import { TabMode } from '.';

interface Props {
  orientation: 'horizontal' | 'vertical';
}

export const useCustomTabStyle = makeSx<string, Props>((theme, props) => {
  const { orientation } = props;

  return {
    container: {
      display: 'flex',
      flexDirection: orientation === 'vertical' ? 'row' : 'column',
      width: '100%',
      height: '100%',
      overflow: 'auto',
      position: 'relative',
    },
    tabContainer: {
      borderTop:
        orientation === 'horizontal'
          ? '1px solid var(--mui-palette-divider)'
          : undefined,
      borderLeft:
        orientation === 'vertical'
          ? '1px solid var(--mui-palette-divider)'
          : undefined,
      zIndex: 3,
    },
    tabs: (mode: TabMode) => {
      const indicator = {
        '& .MuiTabs-indicator': {
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: 'transparent',
          zIndex: 9,
        },
        '& .MuiTabs-indicatorSpan': {
          width: orientation === 'horizontal' ? '70%' : 3,
          height: orientation === 'horizontal' ? 3 : '100%',
          marginTop: orientation === 'horizontal' ? '-3px' : undefined,
          marginRight: orientation === 'vertical' ? '-2px' : undefined,
          backgroundColor: 'primary.main',
        },
      };
      if (mode === 'overlay') {
        return {
          minHeight: 24,
          flexShrink: 0,
          borderBottom: '1px solid var(--mui-palette-divider)',
          ...indicator,
        };
      }
      return {
        backgroundColor: 'background.default',
        ...indicator,
      };
    },
    tab: (mode: TabMode) => {
      if (mode === 'overlay') {
        return {
          p: 1.5,
          minHeight: 36,
          borderBottom:
            orientation === 'vertical'
              ? '1px solid var(--mui-palette-divider)'
              : undefined,
        };
      }
      return {
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        backgroundColor: 'background.default',
        zIndex: 1,
        '&.Mui-selected': {
          fontWeight: theme.typography.fontWeightMedium,
          boxShadow: theme.shadows[3],
          backgroundColor: 'background.paper',
          zIndex: 4,
        },
      };
    },
  };
});
