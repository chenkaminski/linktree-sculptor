import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Point, Area } from 'react-easy-crop/types';

interface AvatarCropperProps {
  image: string;
  onCropComplete: (croppedImage: Blob) => void;
  onCancel: () => void;
  open: boolean;
}

const AvatarCropper = ({ image, onCropComplete, onCancel, open }: AvatarCropperProps) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropChange = (cropValue: Point) => {
    setCrop(cropValue);
  };

  const onZoomChange = (zoomValue: number) => {
    setZoom(zoomValue);
  };

  const onCropCompleteCallback = useCallback((_: Area, croppedAreaPixelsData: Area) => {
    setCroppedAreaPixels(croppedAreaPixelsData);
  }, []);

  const createCroppedImage = async () => {
    try {
      if (croppedAreaPixels) {
        const croppedImage = await getCroppedImg(image, croppedAreaPixels);
        if (croppedImage) {
          onCropComplete(croppedImage);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crop Your Avatar</DialogTitle>
        </DialogHeader>
        <div className="relative w-full h-72">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteCallback}
            onZoomChange={onZoomChange}
          />
        </div>
        <div className="space-y-2 py-4">
          <Label htmlFor="zoom">Zoom</Label>
          <Slider
            id="zoom"
            min={1}
            max={3}
            step={0.1}
            value={[zoom]}
            onValueChange={(value) => setZoom(value[0])}
            aria-label="Zoom"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={createCroppedImage}>
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Helper function to create a cropped image
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });

const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<Blob | null> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  // Set canvas size to the cropped size
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Draw the cropped image onto the canvas
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Convert canvas to blob
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/jpeg');
  });
};

export default AvatarCropper; 