import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserProfile, getProfileByUsername } from '@/services/linkService';
import { getTheme } from '@/services/themeService';
import LinkItem from '@/components/LinkItem';
import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Github, 
  Youtube, 
  Mail,
  Globe,
  Twitch,
  Dribbble,
  Figma,
  Slack,
  Link as LinkIcon,
  Share2
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { toast } from "@/components/ui/use-toast";

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState('');
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return;
      
      try {
        const profileData = await getProfileByUsername(username);
        if (profileData) {
          setProfile(profileData);
        } else {
          setError("Profile not found");
        }
      } catch (err) {
        setError("Failed to load profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
    setShareUrl(window.location.href);
  }, [username]);

  const handleShare = (platform: string) => {
    let shareLink = '';
    const text = profile ? `Check out ${profile.displayName}'s profile!` : 'Check out this profile!';
    
    switch(platform) {
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'instagram':
        toast({
          title: "Instagram Sharing",
          description: "Copy the link and share it in your Instagram bio or story.",
        });
        navigator.clipboard.writeText(shareUrl);
        return;
      case 'copy':
        navigator.clipboard.writeText(shareUrl).then(() => {
          toast({
            title: "Link copied to clipboard!",
            description: "You can now paste it anywhere.",
          });
        });
        return;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">404</h1>
          <p className="text-gray-600">{error || "Profile not found"}</p>
        </div>
      </div>
    );
  }

  const theme = getTheme(profile.theme);
  
  const textStyle = {
    fontFamily: profile.fontFamily || undefined,
    color: profile.fontColor || undefined,
  };

  const socialLinks = profile.showSocialIcons 
    ? profile.links.filter(link => link.display_type === 'icon')
    : [];
    
  const videoLinks = profile.links.filter(link => link.display_type === 'video');
  const regularLinks = profile.links.filter(link => link.display_type === 'button');

  return (
    <div 
      className={`min-h-screen flex flex-col items-center p-6 relative`}
      style={profile.backgroundImage ? {
        backgroundImage: `url(${profile.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : undefined}
    >
      <div className="absolute top-4 left-4 z-10">
        <Popover open={isShareOpen} onOpenChange={setIsShareOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white/90">
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share Profile</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-3">
            <div className="space-y-2">
              <h4 className="font-medium text-sm mb-2">Share Profile</h4>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex gap-2 items-center w-full" 
                  onClick={() => handleShare('whatsapp')}
                >
                  <span className="text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                    </svg>
                  </span>
                  WhatsApp
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex gap-2 items-center w-full" 
                  onClick={() => handleShare('instagram')}
                >
                  <Instagram className="h-4 w-4 text-pink-600" />
                  Instagram
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex gap-2 items-center w-full" 
                  onClick={() => handleShare('facebook')}
                >
                  <Facebook className="h-4 w-4 text-blue-600" />
                  Facebook
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex gap-2 items-center w-full" 
                  onClick={() => handleShare('twitter')}
                >
                  <Twitter className="h-4 w-4 text-blue-400" />
                  Twitter/X
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex gap-2 items-center w-full" 
                  onClick={() => handleShare('linkedin')}
                >
                  <Linkedin className="h-4 w-4 text-blue-700" />
                  LinkedIn
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex gap-2 items-center w-full" 
                  onClick={() => handleShare('copy')}
                >
                  <LinkIcon className="h-4 w-4" />
                  Copy Link
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className={`w-full max-w-md mx-auto flex flex-col items-center py-8 ${
        profile.backgroundImage ? 'bg-white/80 backdrop-blur-sm rounded-lg p-6' : theme.background
      }`}>
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-white/20 backdrop-blur-sm">
          <img
            src={profile.avatar}
            alt={profile.displayName}
            className="w-full h-full object-cover"
          />
        </div>
        
        <h1 
          className={`text-2xl font-bold mb-2 ${profile.fontColor ? '' : theme.textColor}`}
          style={textStyle}
        >
          {profile.displayName}
        </h1>
        
        <p 
          className={`text-center mb-4 max-w-xs ${profile.fontColor ? 'opacity-80' : `${theme.textColor} opacity-80`}`}
          style={textStyle}
        >
          {profile.bio}
        </p>
        
        {profile.showSocialIcons && socialLinks.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {socialLinks.map((link) => (
              <a 
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                style={{
                  backgroundColor: link.background_color || '#f3f4f6',
                  color: link.text_color || '#000000'
                }}
                title={link.title}
              >
                {getSocialIcon(link.icon, 18)}
              </a>
            ))}
          </div>
        )}
        
        <div className="w-[80%] space-y-3 mb-8">
          {regularLinks.map((link) => (
            <LinkItem
              key={link.id}
              link={link}
              className={theme.buttonStyle}
            />
          ))}
          
          {videoLinks.length > 0 && (
            <div className="space-y-6 my-6">
              {videoLinks.map((link) => (
                <LinkItem
                  key={link.id}
                  link={link}
                  className=""
                />
              ))}
            </div>
          )}
          
          {regularLinks.length === 0 && videoLinks.length === 0 && (
            <div className={`text-center py-8 ${profile.fontColor ? '' : `${theme.textColor} opacity-80`}`}>
              <p style={textStyle}>No links available</p>
            </div>
          )}
        </div>
        
        {profile.images && profile.images.length > 0 && (
          <div className="w-full mb-6 overflow-hidden rounded-lg">
            {profile.useInfiniteSlider ? (
              <InfiniteSlider duration={30} gap={8} className="w-full">
                {profile.images.map((image) => (
                  <div key={image.id} className="flex-shrink-0 w-64 h-40 rounded-lg overflow-hidden">
                    <img 
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </InfiniteSlider>
            ) : profile.imageLayout === 'row' ? (
              <div className="overflow-x-auto py-2">
                <div className="flex gap-4 pb-4">
                  {profile.images.map((image) => (
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
            ) : profile.imageLayout === 'column' ? (
              <div className="flex flex-col gap-4">
                {profile.images.map((image) => (
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
              <div className={`grid grid-cols-1 sm:grid-cols-${profile.gridColumns || 2} gap-4`}>
                {profile.images.map((image) => (
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
        )}
        
        <div className="mt-auto pt-8 text-center">
          {profile.logo && (
            <div className="mb-4 flex justify-center">
              <img 
                src={profile.logo}
                alt={`${profile.displayName} logo`}
                className="max-h-12 max-w-[180px] object-contain"
              />
            </div>
          )}
          <a 
            href="/"
            className={`text-sm ${profile.fontColor ? 'opacity-70' : `${theme.textColor} opacity-70`} hover:opacity-100 transition-opacity`}
            style={textStyle}
          >
            Create your own LinkTree clone
          </a>
        </div>
      </div>
    </div>
  );
};

const getSocialIcon = (iconName: string | undefined, size = 16) => {
  if (!iconName) return <LinkIcon size={size} />;
  
  switch (iconName.toLowerCase()) {
    case 'facebook':
      return <Facebook size={size} />;
    case 'twitter':
    case 'twitter/x':
      return <Twitter size={size} />;
    case 'instagram':
      return <Instagram size={size} />;
    case 'linkedin':
      return <Linkedin size={size} />;
    case 'github':
      return <Github size={size} />;
    case 'youtube':
      return <Youtube size={size} />;
    case 'email':
      return <Mail size={size} />;
    case 'website':
      return <Globe size={size} />;
    case 'twitch':
      return <Twitch size={size} />;
    case 'dribbble':
      return <Dribbble size={size} />;
    case 'figma':
      return <Figma size={size} />;
    case 'slack':
      return <Slack size={size} />;
    default:
      return <LinkIcon size={size} />;
  }
};

export default Profile;
