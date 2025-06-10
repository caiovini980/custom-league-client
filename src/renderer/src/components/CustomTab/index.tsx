import { Box, Tab, TabProps, Tabs, TabsProps } from '@mui/material';
import {
  Children,
  PropsWithChildren,
  ReactNode,
  createElement,
  isValidElement,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { LoadingScreen } from '../LoadingScreen';
import { useCustomTabStyle } from './useCustomTabStyle';

export interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

export type TabInfo = Omit<TabData, 'children'>;
export type TabMode = 'default' | 'overlay';

export interface CustomTabProps {
  onChange?: (tab: TabInfo) => void;
  index?: number;
  loading?: boolean;
  tabsProps?: TabsProps;
  mode?: TabMode;
}

export interface CustomTabPanelProps {
  label: string;
  name: string;
  disabled?: boolean;
  hidden?: boolean;
  customTab?: (props: TabProps) => ReactNode;
}

export interface TabData extends CustomTabPanelProps {
  index: number;
  children: ReactNode;
}

const CustomTab = ({
  index,
  onChange,
  loading = false,
  children,
  tabsProps,
  mode = 'default',
}: PropsWithChildren<CustomTabProps>) => {
  const classes = useCustomTabStyle();

  const [value, setValue] = useState(0);
  const tabFiltered = useMemo<TabData[]>(() => {
    const tabDataTemp: TabData[] = [];
    Children.forEach(children, (el, i) => {
      if (
        !isValidElement(el) ||
        typeof el.type !== 'function' ||
        // @ts-ignore
        el.type.displayName !== 'CustomTabPanel'
      ) {
        throw new Error('Is not a CustomTabPanel component');
      }
      tabDataTemp.push({
        index: i,
        ...el.props,
      });
    });

    return tabDataTemp.filter((t) => !t.hidden);
  }, [children]);

  const handleChange = (newValue: number) => {
    setValue(newValue);
    const data = tabFiltered.find((t) => t.index === newValue);
    if (data) {
      onChange?.({
        index: data.index,
        label: data.label,
        name: data.name,
      });
    }
  };

  useEffect(() => {
    if (index === undefined) return;
    setValue(index);
  }, [index]);

  return (
    <Box sx={classes('container', tabsProps?.orientation ?? 'horizontal')}>
      <LoadingScreen loading={loading} backdrop />
      <Tabs
        variant="scrollable"
        allowScrollButtonsMobile
        scrollButtons={'auto'}
        {...tabsProps}
        sx={classes('tabs', mode)}
        value={value}
        onChange={(_, value) => handleChange(value)}
        slots={{
          indicator: () => <span className="MuiTabs-indicatorSpan" />,
        }}
      >
        {tabFiltered.map((l, i) => {
          if (l.customTab) {
            return createElement(l.customTab, {
              key: l.name,
              label: l.label,
              ...a11yProps(i),
            });
          }
          return (
            <Tab
              key={l.name}
              label={l.label}
              disabled={l.disabled}
              {...a11yProps(i)}
              sx={classes('tab', mode)}
            />
          );
        })}
      </Tabs>
      <Box
        display={'flex'}
        height={'inherit'}
        width={'100%'}
        overflow={'auto'}
        sx={classes('tabContainer')}
      >
        {tabFiltered.map((el, i) => {
          return (
            <TabPanel key={el.name} value={value} index={i}>
              {el.children}
            </TabPanel>
          );
        })}
      </Box>
    </Box>
  );
};

export function CustomTabPanel({
  children,
}: PropsWithChildren<CustomTabPanelProps>) {
  return <>{children}</>;
}

CustomTabPanel.displayName = 'CustomTabPanel';

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;

  return (
    <Box
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      role="tabpanel"
      height={'100%'}
      width={'100%'}
      overflow={'auto'}
      hidden={value !== index}
    >
      {value === index && children}
    </Box>
  );
}

export default CustomTab;
