import { SquareIcon } from '@render/components/SquareIcon';

interface SpellIconProps {
  src: string;
}

export const SpellIcon = ({ src }: SpellIconProps) => {
  return <SquareIcon src={src} size={20} />;
};
