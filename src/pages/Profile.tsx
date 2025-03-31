
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserProfile, getProfileByUsername } from '@/services/linkService';
import { getTheme } from '@/services/themeService';
import LinkItem from '@/components/LinkItem';
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
  Link as LinkIcon
} from 'lucide-react';

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  }, [username]);

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

  // Split links into social icons and regular links
  const socialLinks = profile.showSocialIcons 
    ? profile.links.filter(link => link.displayType === 'icon')
    : [];
    
  const regularLinks = profile.showSocialIcons 
    ? profile.links.filter(link => link.displayType !== 'icon')
    : profile.links;

  return (
    <div 
      className={`min-h-screen flex flex-col items-center p-6`}
      style={profile.backgroundImage ? {
        backgroundImage: `url(${profile.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : undefined}
    >
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
        
        {/* Social icons row */}
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
                  backgroundColor: link.backgroundColor || '#f3f4f6',
                  color: link.textColor || '#000000'
                }}
                title={link.title}
              >
                {getSocialIcon(link.icon, 18)}
              </a>
            ))}
          </div>
        )}
        
        <div className="w-full space-y-3 mb-8">
          {regularLinks.map((link) => (
            <LinkItem
              key={link.id}
              link={link}
              className={link.displayType === 'button' ? theme.buttonStyle : ''}
            />
          ))}
          
          {regularLinks.length === 0 && (
            <div className={`text-center py-8 ${profile.fontColor ? '' : `${theme.textColor} opacity-80`}`}>
              <p style={textStyle}>No links available</p>
            </div>
          )}
        </div>
        
        <div className="mt-auto pt-8 text-center">
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

// Helper function to get social icons
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
