import { SquareIcon } from '@render/components/SquareIcon';

interface ItemIconProps {
  src: string;
}

export const ItemIcon = ({ src }: ItemIconProps) => {
  return <SquareIcon src={src} size={38} />;
};
