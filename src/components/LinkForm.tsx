
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Video } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LinkFormProps {
  onSubmit: (data: { title: string; url: string; displayType?: 'button' | 'icon' | 'video' }) => void;
  onCancel?: () => void;
  defaultValues?: {
    title: string;
    url: string;
    displayType?: 'button' | 'icon' | 'video';
  };
  isEdit?: boolean;
}

const LinkForm = ({ onSubmit, onCancel, defaultValues, isEdit = false }: LinkFormProps) => {
  const [title, setTitle] = useState(defaultValues?.title || '');
  const [url, setUrl] = useState(defaultValues?.url || '');
  const [displayType, setDisplayType] = useState<'button' | 'icon' | 'video'>(defaultValues?.displayType || 'button');
  const [errors, setErrors] = useState<{ title?: string; url?: string }>({});

  const validate = (): boolean => {
    const newErrors: { title?: string; url?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!url.trim()) {
      newErrors.url = 'URL is required';
    } else if (!/^https?:\/\/.+/.test(url)) {
      newErrors.url = 'URL must start with http:// or https://';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit({ title, url, displayType });
    }
  };

  return (
    <Card className="border shadow-sm w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          {isEdit ? 'Edit Link' : 'Add New Link'}
          {onCancel && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onCancel}
              className="h-8 w-8"
            >
              <X size={16} />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Website"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
            />
            {errors.url && (
              <p className="text-sm text-red-500">{errors.url}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayType">Display Type</Label>
            <Select 
              value={displayType} 
              onValueChange={(value) => setDisplayType(value as 'button' | 'icon' | 'video')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select display type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="button">Button</SelectItem>
                <SelectItem value="icon">Icon</SelectItem>
                <SelectItem value="video">Embedded Video</SelectItem>
              </SelectContent>
            </Select>
            {displayType === 'video' && (
              <p className="text-xs text-gray-500">
                Enter a YouTube, Vimeo, TikTok, or Instagram video URL to embed
              </p>
            )}
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full">
            {displayType === 'video' ? (
              <Video size={16} className="mr-2" />
            ) : (
              <Plus size={16} className="mr-2" />
            )}
            {isEdit ? 'Save Changes' : 'Add Link'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LinkForm;
