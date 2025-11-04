import { Countdown } from '@render/components/Countdown';

interface EventTimeProps {
  progressEndDate: string;
}

export const EventTime = ({ progressEndDate }: EventTimeProps) => {
  return <Countdown endDate={progressEndDate} />;
};
