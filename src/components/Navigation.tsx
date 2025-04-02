
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Navigation = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setUsername(data.username);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchUserProfile();
  }, [user]);
  
  return (
    <header className="flex justify-between items-center mb-16">
      <div className="flex items-center">
        <Link to="/">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
          myyway
          </h1>
        </Link>
      </div>
      
      <nav className="hidden md:flex items-center space-x-6">
        <Link to="/discover" className="text-gray-700 hover:text-purple-600 transition-colors">
          Discover
        </Link>
        <Link to="/pricing" className="text-gray-700 hover:text-purple-600 transition-colors">
          Pricing
        </Link>
      </nav>
      
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link to="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            {username && (
              <Link to={`/u/${username}`}>
                <Button variant="ghost">My Profile</Button>
              </Link>
            )}
          </>
        ) : (
          <>
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register">
              <Button variant="default">Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navigation;
