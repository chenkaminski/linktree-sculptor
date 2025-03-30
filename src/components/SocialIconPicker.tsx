
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Github, 
  Youtube, 
  Mail, 
  Link as LinkIcon,
  Globe,
  Twitch,
  Dribbble,
  Figma,
  Slack,
  PlusCircle
} from 'lucide-react';

const socialIcons = [
  { name: 'Facebook', icon: <Facebook size={24} />, prefix: 'https://facebook.com/' },
  { name: 'Twitter/X', icon: <Twitter size={24} />, prefix: 'https://twitter.com/' },
  { name: 'Instagram', icon: <Instagram size={24} />, prefix: 'https://instagram.com/' },
  { name: 'LinkedIn', icon: <Linkedin size={24} />, prefix: 'https://linkedin.com/in/' },
  { name: 'GitHub', icon: <Github size={24} />, prefix: 'https://github.com/' },
  { name: 'YouTube', icon: <Youtube size={24} />, prefix: 'https://youtube.com/' },
  { name: 'Email', icon: <Mail size={24} />, prefix: 'mailto:' },
  { name: 'Website', icon: <Globe size={24} />, prefix: 'https://' },
  { name: 'Twitch', icon: <Twitch size={24} />, prefix: 'https://twitch.tv/' },
  { name: 'Dribbble', icon: <Dribbble size={24} />, prefix: 'https://dribbble.com/' },
  { name: 'Figma', icon: <Figma size={24} />, prefix: 'https://figma.com/@' },
  { name: 'Slack', icon: <Slack size={24} />, prefix: 'https://slack.com/' },
  { name: 'Other', icon: <LinkIcon size={24} />, prefix: 'https://' },
];

interface SocialIconPickerProps {
  onAddLink: (link: { title: string; url: string; icon: string }) => void;
}

const SocialIconPicker = ({ onAddLink }: SocialIconPickerProps) => {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (!selectedIcon) return;
    
    const icon = socialIcons.find(icon => icon.name === selectedIcon);
    if (!icon) return;
    
    const title = customTitle || icon.name;
    let url = '';
    
    if (selectedIcon === 'Other') {
      url = customUrl;
    } else if (selectedIcon === 'Email') {
      url = `mailto:${username}`;
    } else {
      url = `${icon.prefix}${username}`;
    }
    
    onAddLink({
      title,
      url,
      icon: selectedIcon.toLowerCase(),
    });
    
    // Reset form
    setSelectedIcon(null);
    setUsername('');
    setCustomTitle('');
    setCustomUrl('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <PlusCircle size={16} />
          Add Social Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Social Link</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {socialIcons.map((icon) => (
              <div
                key={icon.name}
                className={`cursor-pointer p-3 rounded-md flex flex-col items-center justify-center gap-1 border ${
                  selectedIcon === icon.name 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedIcon(icon.name)}
              >
                {icon.icon}
                <span className="text-xs mt-1">{icon.name}</span>
              </div>
            ))}
          </div>
          
          {selectedIcon && (
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="title">Link Title</Label>
                <Input
                  id="title"
                  value={customTitle || selectedIcon}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder={selectedIcon}
                />
              </div>
              
              {selectedIcon === 'Other' ? (
                <div>
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="username">
                    {selectedIcon === 'Email' ? 'Email Address' : 'Username or ID'}
                  </Label>
                  <div className="flex items-center">
                    {selectedIcon !== 'Email' && (
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        {socialIcons.find(icon => icon.name === selectedIcon)?.prefix}
                      </span>
                    )}
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={selectedIcon !== 'Email' ? "rounded-l-none" : ""}
                      placeholder={selectedIcon === 'Email' ? "yourname@example.com" : "username"}
                    />
                  </div>
                </div>
              )}
              
              <Button 
                onClick={handleSubmit}
                disabled={
                  (selectedIcon === 'Other' && !customUrl) || 
                  (selectedIcon !== 'Other' && !username)
                }
              >
                Add Link
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SocialIconPicker;
