
import { useState } from 'react';
import { UserProfile } from '@/services/linkService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProfileStylesEditorProps {
  profile: UserProfile;
  onUpdate: (data: Partial<UserProfile>) => Promise<void>;
}

const ProfileStylesEditor = ({ profile, onUpdate }: ProfileStylesEditorProps) => {
  const [fontFamily, setFontFamily] = useState(profile.fontFamily || 'Inter');
  const [fontColor, setFontColor] = useState(profile.fontColor || '#000000');
  const [showSocialIcons, setShowSocialIcons] = useState(profile.showSocialIcons || false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fontOptions = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Poppins', label: 'Poppins' },
    { value: 'Montserrat', label: 'Montserrat' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Playfair Display', label: 'Playfair Display' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onUpdate({
        fontFamily,
        fontColor,
        showSocialIcons,
      });
    } catch (error) {
      console.error('Error updating profile styles:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Typography & Layout</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="font-family">Font Family</Label>
            <Select value={fontFamily} onValueChange={setFontFamily}>
              <SelectTrigger>
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((font) => (
                  <SelectItem 
                    key={font.value} 
                    value={font.value}
                    style={{ fontFamily: font.value }}
                  >
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="font-color">Font Color</Label>
            <div className="flex">
              <Input
                id="font-color"
                type="color"
                value={fontColor}
                onChange={(e) => setFontColor(e.target.value)}
                className="w-12 p-1 h-10"
              />
              <Input
                value={fontColor}
                onChange={(e) => setFontColor(e.target.value)}
                className="flex-1 ml-2"
                placeholder="#000000"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="show-social-icons" className="block">Show Social Icons</Label>
              <p className="text-sm text-gray-500">Display social icons below your bio</p>
            </div>
            <Switch
              id="show-social-icons"
              checked={showSocialIcons}
              onCheckedChange={setShowSocialIcons}
            />
          </div>
          
          <div className="p-4 rounded-lg border mt-6">
            <p className="text-sm text-gray-500 mb-2">Preview:</p>
            <div className="p-4 flex flex-col items-center">
              <h3 className="font-semibold mb-2" style={{ fontFamily, color: fontColor }}>
                Display Name
              </h3>
              <p className="text-center" style={{ fontFamily, color: fontColor }}>
                This is a preview of your text with the selected font and color.
              </p>
            </div>
          </div>
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Typography Settings'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileStylesEditor;
