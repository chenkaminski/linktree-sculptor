
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Upload, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ImageUploaderProps {
  type: 'avatar' | 'background';
  currentImage: string | null;
  userId: string;
  onImageUploaded: (url: string) => void;
}

const ImageUploader = ({ type, currentImage, userId, onImageUploaded }: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  
  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${type}-${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      onImageUploaded(data.publicUrl);
      
      toast({
        title: 'Image uploaded successfully!',
        description: `Your ${type} has been updated.`,
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };
  
  const removeImage = () => {
    onImageUploaded('');
    toast({
      title: 'Image removed',
      description: `Your ${type} has been removed.`,
    });
  };
  
  return (
    <div className="space-y-4">
      {type === 'avatar' ? (
        <div className="flex flex-col items-center gap-4">
          <Avatar className="w-24 h-24">
            {currentImage ? (
              <AvatarImage src={currentImage} alt="Avatar" />
            ) : (
              <AvatarFallback>?</AvatarFallback>
            )}
          </Avatar>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={uploading}
              asChild
            >
              <label className="cursor-pointer">
                <Upload size={16} className="mr-2" />
                {uploading ? 'Uploading...' : 'Upload'}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={uploadImage}
                  disabled={uploading}
                />
              </label>
            </Button>
            
            {currentImage && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={removeImage}
              >
                <X size={16} className="mr-2" />
                Remove
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {currentImage && (
            <div className="relative w-full h-32 rounded-md overflow-hidden">
              <img 
                src={currentImage} 
                alt="Background"
                className="w-full h-full object-cover"
              />
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2 bg-white/80"
                onClick={removeImage}
              >
                <X size={16} className="mr-2" />
                Remove
              </Button>
            </div>
          )}
          
          <Button 
            variant="outline" 
            disabled={uploading}
            asChild
            className="w-full"
          >
            <label className="cursor-pointer">
              <Upload size={16} className="mr-2" />
              {uploading ? 'Uploading...' : currentImage ? 'Change Background' : 'Upload Background'}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={uploadImage}
                disabled={uploading}
              />
            </label>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
