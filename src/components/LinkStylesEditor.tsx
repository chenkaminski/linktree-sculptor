import { useState } from 'react';
import { Link } from '@/services/linkService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface LinkStylesEditorProps {
  link: Link;
  onSubmit: (styles: Partial<Link>) => void;
  onCancel: () => void;
}

const LinkStylesEditor = ({ link, onSubmit, onCancel }: LinkStylesEditorProps) => {
  const [backgroundColor, setBackgroundColor] = useState(link.backgroundColor || '#f3f4f6');
  const [textColor, setTextColor] = useState(link.textColor || '#000000');
  const [borderRadius, setBorderRadius] = useState(link.borderRadius || '0.5rem');
  const [display_type, setDisplayType] = useState<'button' | 'icon' | 'video'>(link.display_type as 'button' | 'icon' | 'video' || 'button');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      backgroundColor,
      textColor,
      borderRadius,
      display_type
    });
  };

  const presetColors = [
    { name: 'Gray', bg: '#f3f4f6', text: '#000000' },
    { name: 'Blue', bg: '#dbeafe', text: '#1e40af' },
    { name: 'Green', bg: '#dcfce7', text: '#166534' },
    { name: 'Purple', bg: '#f3e8ff', text: '#6b21a8' },
    { name: 'Pink', bg: '#fce7f3', text: '#9d174d' },
    { name: 'Orange', bg: '#ffedd5', text: '#9a3412' },
    { name: 'Black', bg: '#000000', text: '#ffffff' },
    { name: 'White', bg: '#ffffff', text: '#000000' },
  ];

  const radiusOptions = [
    { value: '0', label: 'None' },
    { value: '0.25rem', label: 'Small' },
    { value: '0.5rem', label: 'Medium' },
    { value: '1rem', label: 'Large' },
    { value: '9999px', label: 'Full' },
  ];

  // This handler ensures type safety when changing display type
  const handleDisplayTypeChange = (value: string) => {
    if (value === 'button' || value === 'icon' || value === 'video') {
      setDisplayType(value);
    }
  };

  return (
    <Card className="border shadow-sm w-full mb-3">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          Style Link: {link.title}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onCancel}
            className="h-8 w-8"
          >
            <X size={16} />
          </Button>
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label className="mb-2 block">Display Type</Label>
            <RadioGroup 
              value={display_type} 
              onValueChange={handleDisplayTypeChange}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="button" id="display-button" />
                <Label htmlFor="display-button">Button</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="icon" id="display-icon" />
                <Label htmlFor="display-icon">Icon Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="video" id="display-video" />
                <Label htmlFor="display-video">Video</Label>
              </div>
            </RadioGroup>
            {display_type === 'video' && (
              <p className="text-xs text-gray-500 mt-2">
                Video mode will embed content from YouTube, Vimeo, TikTok, or Instagram
              </p>
            )}
          </div>
          
          {/* Only show color and style options for button and icon types */}
          {display_type !== 'video' && (
            <>
              <div>
                <Label className="mb-2 block">Color Presets</Label>
                <div className="grid grid-cols-4 gap-2">
                  {presetColors.map((color) => (
                    <div
                      key={color.name}
                      className="cursor-pointer border rounded p-2 text-center hover:border-purple-500 transition-colors"
                      style={{ backgroundColor: color.bg, color: color.text }}
                      onClick={() => {
                        setBackgroundColor(color.bg);
                        setTextColor(color.text);
                      }}
                    >
                      {color.name}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="background-color">Background Color</Label>
                  <div className="flex">
                    <Input
                      id="background-color"
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-12 p-1 h-10"
                    />
                    <Input
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="flex-1 ml-2"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="text-color">Text Color</Label>
                  <div className="flex">
                    <Input
                      id="text-color"
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-12 p-1 h-10"
                    />
                    <Input
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="flex-1 ml-2"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="border-radius">Border Radius</Label>
                <Select 
                  value={borderRadius} 
                  onValueChange={setBorderRadius}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select border radius" />
                  </SelectTrigger>
                  <SelectContent>
                    {radiusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-4 rounded-lg border mt-4">
                <p className="text-sm text-gray-500 mb-2">Preview:</p>
                <div 
                  className="p-3 flex items-center justify-center"
                  style={{ 
                    backgroundColor, 
                    color: textColor,
                    borderRadius
                  }}
                >
                  {link.title}
                </div>
              </div>
            </>
          )}
          
          {display_type === 'video' && (
            <div className="p-4 rounded-lg border mt-4">
              <p className="text-sm text-gray-500 mb-2">Video Preview:</p>
              <div className="flex items-center justify-center p-4 bg-gray-100 rounded">
                <p className="text-sm text-gray-600">Video will be embedded on your page</p>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full">
            <Save size={16} className="mr-2" />
            Save Style
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LinkStylesEditor;
