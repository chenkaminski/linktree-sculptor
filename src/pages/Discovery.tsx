
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from 'lucide-react';
import Navigation from '@/components/Navigation';

interface ProfilePreview {
  id: string;
  username: string;
  display_name: string;
  bio: string | null;
  avatar: string | null;
  category: string | null;
}

const categories = [
  'All',
  'Creator',
  'Artist',
  'Musician',
  'Designer',
  'Developer',
  'Business',
  'Personal',
  'Other'
];

const Discovery = () => {
  const [profiles, setProfiles] = useState<ProfilePreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('trending');

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('profiles')
          .select('id, username, display_name, bio, avatar, category')
          .eq('is_public', true);
        
        if (selectedCategory !== 'All') {
          query = query.eq('category', selectedCategory);
        }
        
        if (searchQuery) {
          query = query.or(`username.ilike.%${searchQuery}%,display_name.ilike.%${searchQuery}%`);
        }
        
        let order = '';
        switch (activeTab) {
          case 'trending':
            order = 'view_count.desc';
            break;
          case 'newest':
            order = 'created_at.desc';
            break;
          case 'featured':
            query = query.eq('is_featured', true);
            order = 'view_count.desc';
            break;
          default:
            order = 'view_count.desc';
        }
        
        const { data, error } = await query.order(order).limit(30);
        
        if (error) throw error;
        
        setProfiles(data as ProfilePreview[] || []);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfiles();
  }, [selectedCategory, searchQuery, activeTab]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <Navigation />
      
      <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
        Discover Profiles
      </h1>
      
      <div className="mb-8">
        <Tabs defaultValue="trending" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8 w-full max-w-md">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="newest">Newest</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative w-full md:w-2/3">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search profiles..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-1/3">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <TabsContent value="trending" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderProfileGrid(profiles, loading)}
            </div>
          </TabsContent>
          
          <TabsContent value="newest" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderProfileGrid(profiles, loading)}
            </div>
          </TabsContent>
          
          <TabsContent value="featured" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderProfileGrid(profiles, loading)}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Helper function to render profile grid
const renderProfileGrid = (profiles: ProfilePreview[], loading: boolean) => {
  if (loading) {
    return Array(6).fill(0).map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gray-200"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-100 rounded w-1/2"></div>
          </div>
        </div>
        <div className="mt-4 h-12 bg-gray-100 rounded"></div>
      </div>
    ));
  }
  
  if (profiles.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <h3 className="text-lg font-medium text-gray-600">No profiles found</h3>
        <p className="text-gray-500 mt-2">Try changing your search or filter criteria</p>
      </div>
    );
  }
  
  return profiles.map(profile => (
    <Link 
      to={`/u/${profile.username}`} 
      key={profile.id} 
      className="bg-white rounded-lg shadow-md p-4 transition-transform hover:scale-105 hover:shadow-lg"
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.display_name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center text-white font-bold">
              {profile.display_name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <h3 className="font-medium">{profile.display_name}</h3>
          <p className="text-sm text-gray-500">@{profile.username}</p>
        </div>
      </div>
      {profile.bio && (
        <p className="mt-3 text-sm text-gray-600 line-clamp-2">{profile.bio}</p>
      )}
      <div className="mt-4">
        <Button variant="secondary" size="sm" className="w-full">View Profile</Button>
      </div>
    </Link>
  ));
};

export default Discovery;
