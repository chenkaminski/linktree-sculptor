import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LinkIcon, 
  LogOut,
  CreditCard
} from 'lucide-react';
import { getProfileByUsername } from '@/services/linkService';
import { useEffect, useState } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsername = async () => {
      if (user) {
        try {
          const profile = await getProfileByUsername(user.id);
          if (profile) {
            setUsername(profile.username);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };

    fetchUsername();
  }, [user]);

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            LinkTree Clone
          </Link>
          
          <div className="flex items-center gap-6">
            {username && (
              <Link 
                to={`/u/${username}`} 
                className="text-sm text-gray-600 hover:text-purple-600 flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkIcon size={16} />
                View my page
              </Link>
            )}
            {location.pathname !== '/billing' && (
              <Link to="/billing" className="text-sm text-gray-600 hover:text-purple-600 flex items-center gap-1">
                <CreditCard size={16} className="mr-1" />
                Billing
              </Link>
            )}
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut size={16} className="mr-2" />
              Log out
            </Button>
          </div>
        </div>
      </header>
      
      <main>{children}</main>
    </div>
  );
};

export default DashboardLayout; 