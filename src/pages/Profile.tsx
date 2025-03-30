
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserProfile, getProfileByUsername } from '@/services/linkService';
import { getTheme } from '@/services/themeService';
import LinkItem from '@/components/LinkItem';

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

  return (
    <div className={`min-h-screen ${theme.background} flex flex-col items-center p-6`}>
      <div className="w-full max-w-md mx-auto flex flex-col items-center py-8">
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
