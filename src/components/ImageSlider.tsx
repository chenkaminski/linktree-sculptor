import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X, Image as ImageIcon, Trash2, Upload, LayoutGrid, Rows, Columns } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ImageLayoutSelector from './ImageLayoutSelector';

export interface SliderImage {
  id: string;
  url: string;
  alt: string;
}

interface ImageSliderProps {
  images: SliderImage[];
  onAddImage: (image: { url: string; alt: string }) => void;
  onDeleteImage: (id: string) => void;
  onToggleInfiniteSlider: (value: boolean) => void;
  onUpdateImageLayout: (layout: 'row' | 'column' | 'grid', columns?: 2 | 3 | 4) => void;
  useInfiniteSlider: boolean;
  imageLayout: 'row' | 'column' | 'grid';
  gridColumns: 2 | 3 | 4;
  userId: string;
}

const MAX_IMAGES = 10;

const ImageSlider = ({ 
  images, 
  onAddImage, 
  onDeleteImage, 
  onToggleInfiniteSlider,
  onUpdateImageLayout,
  useInfiniteSlider,
  imageLayout,
  gridColumns,
  userId 
}: ImageSliderProps) => {
  const [alt, setAlt] = useState('');
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<{ alt?: string }>({});

  const validate = (): boolean => {
    const newErrors: { alt?: string } = {};
    
    // if (!alt.trim()) {
    //   newErrors.alt = 'Alt text is required for accessibility';
    // }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!validate()) return;

    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      if (images.length >= MAX_IMAGES) {
        throw new Error(`You can only upload a maximum of ${MAX_IMAGES} images.`);
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/slider-${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      onAddImage({ url: data.publicUrl, alt });
      setAlt('');
      
      toast({
        title: 'Image uploaded successfully!',
        description: 'Your image has been added to the slider.',
      });
    } catch (error: unknown) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'There was an error uploading your image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      // Reset file input
      const fileInput = document.getElementById('slider-image-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Add Image to Slider ({images.length}/{MAX_IMAGES})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image-alt">Image Description (Alt Text)</Label>
            <Input
              id="image-alt"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Description of image for accessibility"
            />
            {errors.alt && (
              <p className="text-sm text-red-500">{errors.alt}</p>
            )}
          </div>
          
          <Button 
            variant="outline" 
            disabled={uploading || images.length >= MAX_IMAGES}
            asChild
            className="w-full"
          >
            <label className="cursor-pointer">
              <Upload size={16} className="mr-2" />
              {uploading ? 'Uploading...' : 'Upload Image'}
              <input
                id="slider-image-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={uploadImage}
                disabled={uploading || images.length >= MAX_IMAGES}
              />
            </label>
          </Button>
          
          {images.length >= MAX_IMAGES && (
            <p className="text-sm text-amber-500">
              You've reached the maximum limit of {MAX_IMAGES} images. Delete some images to add more.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Switch 
              checked={useInfiniteSlider}
              onCheckedChange={onToggleInfiniteSlider}
              id="infinite-slider-toggle"
            />
            <Label htmlFor="infinite-slider-toggle">
              Use infinite slider (automatic scrolling)
            </Label>
          </div>
          
          {!useInfiniteSlider && (
            <ImageLayoutSelector 
              userId={userId}
              currentLayout={imageLayout}
              currentColumns={gridColumns}
              onLayoutChange={onUpdateImageLayout}
            />
          )}
        </div>
      </div>

      {images.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium mb-2">Current Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <AspectRatio ratio={16/9}>
                  <img 
                    src={image.url} 
                    alt={image.alt}
                    className="w-full h-full object-cover rounded-md"
                  />
                </AspectRatio>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => onDeleteImage(image.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </Button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-1 text-xs truncate">
                  {image.alt}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {images.length > 0 ? (
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-4">Preview</h3>
          {useInfiniteSlider ? (
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
          ) : (
            imageLayout === 'row' ? (
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
            ) : imageLayout === 'column' ? (
              <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto">
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
            ) : (
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
            )
          )}
        </div>
      ) : (
        <div className="text-center py-8 border rounded-lg">
          <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Add some images to create a slider</p>
        </div>
      )}
    </div>
  );
};

export default ImageSlider; 