import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useEffect, useState } from 'react';

interface UseSpriteImageProps {
  src: string;
  width: number;
  height: number;
  spacing?: number;
}

export const useSpriteImage = ({
  src,
  width,
  height,
  spacing = 0,
}: UseSpriteImageProps) => {
  const { genericImg } = useLeagueImage();

  const [spriteImage, setSpriteImage] = useState<HTMLImageElement>();

  useEffect(() => {
    const img = new Image();
    img.src = genericImg(src);
    img.onload = () => {
      setSpriteImage(img);
    };
  }, [src]);

  const getSprite = (index: number) => {
    if (!spriteImage) return '';
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');

    const y = index * (height + spacing);

    if (!ctx) {
      return '';
    }

    ctx.drawImage(
      spriteImage, // imagem principal
      0,
      y, // origem da subimagem na imagem principal
      width,
      height, // tamanho da subimagem
      0,
      0, // destino no canvas
      width,
      height, // tamanho final no canvas
    );

    return canvas.toDataURL();
  };

  return {
    getSprite,
  };
};
