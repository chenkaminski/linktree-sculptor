
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
  Spotify,
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
  
  // Get the icon component based on the icon name
  const getSocialIcon = (iconName: string | undefined) => {
    if (!iconName) return <LinkIcon size={16} />;
    
    const iconMap: Record<string, JSX.Element> = {
      'facebook': <Facebook size={16} />,
      'twitter/x': <Twitter size={16} />,
      'twitter': <Twitter size={16} />,
      'instagram': <Instagram size={16} />,
      'linkedin': <Linkedin size={16} />,
      'github': <Github size={16} />,
      'youtube': <Youtube size={16} />,
      'email': <Mail size={16} />,
      'website': <Globe size={16} />,
      'twitch': <Twitch size={16} />,
      'dribbble': <Dribbble size={16} />,
      'figma': <Figma size={16} />,
      'slack': <Slack size={16} />,
      'spotify': <Spotify size={16} />,
    };
    
    return iconMap[iconName.toLowerCase()] || <LinkIcon size={16} />;
  };

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
        
        <h1 className={`text-2xl font-bold mb-2 ${theme.textColor}`}>
          {profile.displayName}
        </h1>
        
        <p className={`text-center mb-6 max-w-xs ${theme.textColor} opacity-80`}>
          {profile.bio}
        </p>
        
        <div className="w-full space-y-3 mb-8">
          {profile.links.map((link) => (
            <LinkItem
              key={link.id}
              link={link}
              className={theme.buttonStyle}
              icon={getSocialIcon(link.icon)}
            />
          ))}
          
          {profile.links.length === 0 && (
            <div className={`text-center py-8 ${theme.textColor} opacity-80`}>
              <p>No links available</p>
            </div>
          )}
        </div>
        
        <div className="mt-auto pt-8 text-center">
          <a 
            href="/"
            className={`text-sm ${theme.textColor} opacity-70 hover:opacity-100 transition-opacity`}
          >
            Create your own LinkTree clone
          </a>
        </div>
      </div>
    </div>
  );
};

export default Profile;
