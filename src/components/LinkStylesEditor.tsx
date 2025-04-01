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
  const [shadow, setShadow] = useState(link.shadow || 'none');
  const [shadowColor, setShadowColor] = useState(link.shadowColor || 'rgba(0, 0, 0, 0.1)');
  const [display_type, setDisplayType] = useState<'button' | 'icon' | 'video'>(link.display_type as 'button' | 'icon' | 'video' || 'button');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      backgroundColor,
      textColor,
      borderRadius,
      shadow,
      shadowColor,
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

  // Generate shadow styles with the selected shadow color
  const getShadowValue = (shadowType: string) => {
    switch(shadowType) {
      case 'none':
        return 'none';
      case 'Subtle':
        return `0 1px 2px ${shadowColor}`;
      case 'Small':
        return `0 1px 3px ${shadowColor}, 0 1px 2px ${shadowColor}`;
      case 'Medium':
        return `0 4px 6px -1px ${shadowColor}, 0 2px 4px -1px ${shadowColor}`;
      case 'Large':
        return `0 10px 15px -3px ${shadowColor}, 0 4px 6px -2px ${shadowColor}`;
      case 'Extra Large':
        return `0 20px 25px -5px ${shadowColor}, 0 10px 10px -5px ${shadowColor}`;
      default:
        return shadowType; // If it's a custom value, return as is
    }
  };

  const shadowOptions = [
    { value: 'none', label: 'None' },
    { value: 'Subtle', label: 'Subtle' },
    { value: 'Small', label: 'Small' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Large', label: 'Large' },
    { value: 'Extra Large', label: 'Extra Large' },
  ];

  // This handler ensures type safety when changing display type
  const handleDisplayTypeChange = (value: string) => {
    if (value === 'button' || value === 'icon' || value === 'video') {
      setDisplayType(value);
    }
  };

  // Get the actual shadow value based on the selected option
  const actualShadow = getShadowValue(shadow);

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
              
              <div>
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
              
              <div>
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
              
              <div>
                <Label htmlFor="shadow">Shadow</Label>
                <Select
                  value={shadow}
                  onValueChange={setShadow}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select shadow style" />
                  </SelectTrigger>
                  <SelectContent>
                    {shadowOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {shadow !== 'none' && (
                <div className="space-y-2">
                  <Label htmlFor="shadow-color">Shadow Color</Label>
                  <div className="flex">
                    <Input
                      id="shadow-color"
                      type="color"
                      value={shadowColor.startsWith('rgba') ? '#000000' : shadowColor}
                      onChange={(e) => setShadowColor(e.target.value)}
                      className="w-12 p-1 h-10"
                    />
                    <Input
                      value={shadowColor}
                      onChange={(e) => setShadowColor(e.target.value)}
                      className="flex-1 ml-2"
                      placeholder="rgba(0, 0, 0, 0.1) or #000000"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Use rgba() format for transparent shadows, e.g. rgba(0, 0, 0, 0.1)
                  </p>
                </div>
              )}
              
              <div className="p-4 rounded-lg border mt-4">
                <p className="text-sm text-gray-500 mb-2">Preview:</p>
                <div 
                  className="p-3 flex items-center justify-center"
                  style={{ 
                    backgroundColor, 
                    color: textColor,
                    borderRadius,
                    boxShadow: actualShadow
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
