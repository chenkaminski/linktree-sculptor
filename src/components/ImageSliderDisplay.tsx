import { SliderImage } from './ImageSlider';
import { InfiniteSlider } from '@/components/ui/infinite-slider';

interface ImageSliderDisplayProps {
  images: SliderImage[];
  useInfiniteSlider: boolean;
  imageLayout: 'row' | 'column' | 'grid';
  gridColumns: 2 | 3 | 4;
  className?: string;
}

const ImageSliderDisplay = ({ 
  images, 
  useInfiniteSlider, 
  imageLayout = 'row',
  gridColumns = 2,
  className = '' 
}: ImageSliderDisplayProps) => {
  if (images.length === 0) return null;

  // For infinite slider, we always use row layout
  if (useInfiniteSlider) {
    return (
      <div className={`mb-6 ${className}`}>
        <InfiniteSlider duration={30} gap={8} className="w-full overflow-hidden rounded-lg">
          {images.map((image) => (
            <div key={image.id} className="flex-shrink-0 w-64 h-40 rounded-lg overflow-hidden">
              <img 
                src={image.url} 
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </InfiniteSlider>
      </div>
    );
  }

  // For non-infinite sliders, handle different layouts
  return (
    <div className={`mb-6 ${className}`}>
      {imageLayout === 'row' && (
        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-4">
            {images.map((image) => (
              <div key={image.id} className="flex-shrink-0 w-64 h-40 rounded-lg overflow-hidden">
                <img 
                  src={image.url} 
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {imageLayout === 'column' && (
        <div className="flex flex-col gap-4">
          {images.map((image) => (
            <div key={image.id} className="w-full h-40 rounded-lg overflow-hidden">
              <img 
                src={image.url} 
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {imageLayout === 'grid' && (
        <div className={`grid grid-cols-1 sm:grid-cols-${gridColumns} gap-4`}>
          {images.map((image) => (
            <div key={image.id} className="aspect-video rounded-lg overflow-hidden">
              <img 
                src={image.url} 
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSliderDisplay; 