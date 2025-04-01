
import React from 'react';
import QRCode from 'qrcode.react';

interface QRCodeCanvasProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  level?: string;
  includeMargin?: boolean;
}

const QRCodeCanvas: React.FC<QRCodeCanvasProps> = ({
  value,
  size = 128,
  bgColor = "#ffffff",
  fgColor = "#000000",
  level = "L",
  includeMargin = false,
}) => {
  return (
    <QRCode
      value={value}
      size={size}
      bgColor={bgColor}
      fgColor={fgColor}
      level={level as "L" | "M" | "Q" | "H"}
      includeMargin={includeMargin}
      renderAs="canvas"
    />
  );
};

export default QRCodeCanvas;
