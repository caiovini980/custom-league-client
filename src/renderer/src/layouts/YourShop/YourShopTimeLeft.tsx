import { Countdown } from '@render/components/Countdown';

interface YourShopTimeLeftProps {
  endDate: string | undefined;
}

export const YourShopTimeLeft = ({ endDate }: YourShopTimeLeftProps) => {
  return <Countdown endDate={endDate} fontSize={'2rem'} />;
};
