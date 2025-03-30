import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, LinkIcon, User, Settings, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import LinkForm from '@/components/LinkForm';
import DashboardLinkItem from '@/components/DashboardLinkItem';
import { UserProfile, Link as LinkType, getOrCreateProfile, updateProfile, addLink, updateLink, deleteLink, reorderLinks } from '@/services/linkService';
import { themes } from '@/services/themeService';
import SocialIconPicker from '@/components/SocialIconPicker';
import ImageUploader from '@/components/ImageUploader';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';

const SortableLinkItem = ({ link, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style}>
      <DashboardLinkItem 
        link={link} 
        onEdit={onEdit} 
        onDelete={onDelete} 
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
};

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({
    displayName: '',
    bio: '',
    username: '',
  });
  
  const [addingLink, setAddingLink] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const profile = await getOrCreateProfile(user.id);
          setProfile(profile);
          setProfileForm({
            displayName: profile.displayName,
            bio: profile.bio,
            username: profile.username,
          });
        } catch (error) {
          console.error('Error fetching profile:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchProfile();
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    
    try {
      const updatedProfile = await updateProfile(user.id, {
        displayName: profileForm.displayName,
        bio: profileForm.bio,
        username: profileForm.username,
      });
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleAddLink = async (data: { title: string; url: string }) => {
    if (!user) return;
    
    try {
      const newLink = await addLink(user.id, data);
      setProfile(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          links: [...prev.links, newLink],
        };
      });
      setAddingLink(false);
    } catch (error) {
      console.error('Error adding link:', error);
    }
  };
  
  const handleAddSocialLink = async (data: { title: string; url: string; icon: string }) => {
    if (!user) return;
    
    try {
      const newLink = await addLink(user.id, data);
      setProfile(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          links: [...prev.links, newLink],
        };
      });
    } catch (error) {
      console.error('Error adding social link:', error);
    }
  };

  const handleEditLink = async (id: string, data: { title: string; url: string }) => {
    if (!user) return;
    
    try {
      const updatedLink = await updateLink(user.id, id, data);
      setProfile(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          links: prev.links.map(link => link.id === id ? updatedLink : link),
        };
      });
    } catch (error) {
      console.error('Error updating link:', error);
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!user) return;
    
    try {
      await deleteLink(user.id, id);
      setProfile(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          links: prev.links.filter(link => link.id !== id),
        };
      });
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  const handleThemeChange = async (themeId: string) => {
    if (!user || !profile) return;
    
    try {
      const updatedProfile = await updateProfile(user.id, {
        theme: themeId,
      });
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  };
  
  const handleAvatarChange = async (url: string) => {
    if (!user || !profile) return;
    
    try {
      const updatedProfile = await updateProfile(user.id, {
        avatar: url,
      });
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };
  
  const handleBackgroundChange = async (url: string) => {
    if (!user || !profile) return;
    
    try {
      const updatedProfile = await updateProfile(user.id, {
        backgroundImage: url,
      });
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating background:', error);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over.id && profile && user) {
      const oldLinks = [...profile.links];
      const oldIndex = oldLinks.findIndex(link => link.id === active.id);
      const newIndex = oldLinks.findIndex(link => link.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newLinks = [...oldLinks];
        const [movedItem] = newLinks.splice(oldIndex, 1);
        newLinks.splice(newIndex, 0, movedItem);
        
        setProfile(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            links: newLinks,
          };
        });
        
        try {
          const updatedLinks = await reorderLinks(user.id, newLinks);
          setProfile(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              links: updatedLinks,
            };
          });
        } catch (error) {
          console.error('Error reordering links:', error);
          setProfile(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              links: oldLinks,
            };
          });
        }
      }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            LinkTree Clone
          </Link>
          
          <div className="flex items-center gap-6">
            {profile && (
              <Link 
                to={`/u/${profile.username}`} 
                className="text-sm text-gray-600 hover:text-purple-600 flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkIcon size={16} />
                View my page
              </Link>
            )}
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut size={16} className="mr-2" />
              Log out
            </Button>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="links">
          <TabsList className="mb-8">
            <TabsTrigger value="links">
              <LinkIcon size={16} className="mr-2" />
              Links
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Settings size={16} className="mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User size={16} className="mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="links" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Manage Links</CardTitle>
                    <CardDescription>
                      Add, edit, or remove links from your page. Drag to reorder.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {profile?.links.length === 0 && !addingLink && (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">You don't have any links yet</p>
                        <Button onClick={() => setAddingLink(true)}>
                          Add your first link
                        </Button>
                      </div>
                    )}
                    
                    {profile?.links.length > 0 && (
                      <DndContext 
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        modifiers={[restrictToVerticalAxis]}
                      >
                        <SortableContext 
                          items={profile.links.map(link => link.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          {profile.links.map((link) => (
                            <SortableLinkItem
                              key={link.id}
                              link={link}
                              onEdit={handleEditLink}
                              onDelete={handleDeleteLink}
                            />
                          ))}
                        </SortableContext>
                      </DndContext>
                    )}
                    
                    {addingLink ? (
                      <div className="mt-4">
                        <LinkForm
                          onSubmit={handleAddLink}
                          onCancel={() => setAddingLink(false)}
                        />
                      </div>
                    ) : profile?.links.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Button 
                          onClick={() => setAddingLink(true)} 
                          className="flex-1"
                        >
                          Add another link
                        </Button>
                        <SocialIconPicker onAddLink={handleAddSocialLink} />
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <div className="sticky top-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Preview</CardTitle>
                      <CardDescription>
                        See how your page looks
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border border-gray-200 rounded-lg h-[500px] overflow-hidden">
                        <div 
                          className="h-full w-full p-8 flex flex-col items-center overflow-y-auto"
                          style={profile?.backgroundImage ? {
                            backgroundImage: `url(${profile.backgroundImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          } : {
                            background: themes.find(t => t.id === profile?.theme)?.background || themes[0].background
                          }}
                        >
                          <div className="w-20 h-20 rounded-full overflow-hidden mb-4 bg-white/20">
                            <img 
                              src={profile?.avatar} 
                              alt={profile?.displayName || 'Avatar'} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <h3 className={`text-xl font-semibold mb-1 ${profile?.backgroundImage ? 'text-white' : themes.find(t => t.id === profile?.theme)?.textColor || 'text-white'}`}>
                            {profile?.displayName || 'Your Name'}
                          </h3>
                          <p className={`text-sm mb-6 text-center ${profile?.backgroundImage ? 'text-white/80' : (themes.find(t => t.id === profile?.theme)?.textColor || 'text-white') + ' opacity-80'}`}>
                            {profile?.bio || 'Your bio goes here'}
                          </p>
                          
                          <div className="w-full max-w-sm space-y-3">
                            {profile?.links.map((link) => (
                              <div 
                                key={link.id}
                                className={`w-full py-3 px-5 rounded-lg flex items-center justify-center gap-2 font-medium ${profile?.backgroundImage ? 'bg-white/20 backdrop-blur-sm text-white' : themes.find(t => t.id === profile?.theme)?.buttonStyle || 'bg-white text-gray-800'}`}
                              >
                                {link.title}
                              </div>
                            ))}
                            
                            {profile?.links.length === 0 && (
                              <div className={`text-center py-8 ${profile?.backgroundImage ? 'text-white/80' : (themes.find(t => t.id === profile?.theme)?.textColor || 'text-white') + ' opacity-80'}`}>
                                <p>Add some links to see them here</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="appearance">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Background Image</CardTitle>
                    <CardDescription>
                      Upload a custom background image for your page
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user && profile && (
                      <ImageUploader
                        type="background"
                        currentImage={profile.backgroundImage}
                        userId={user.id}
                        onImageUploaded={handleBackgroundChange}
                      />
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Theme</CardTitle>
                    <CardDescription>
                      Choose a theme for your page
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Choose a theme</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                          {themes.map((theme) => (
                            <div 
                              key={theme.id}
                              className={`
                                cursor-pointer rounded-lg border-2 overflow-hidden h-32
                                ${profile?.theme === theme.id ? 'border-purple-500' : 'border-transparent'}
                              `}
                              onClick={() => handleThemeChange(theme.id)}
                            >
                              <div className={`h-full ${theme.background} p-4 flex flex-col items-center justify-center`}>
                                <div className={`w-16 h-6 ${theme.buttonStyle} rounded-md mb-2`}></div>
                                <div className={`w-12 h-2 ${theme.buttonStyle} rounded-md opacity-70`}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <div className="sticky top-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Preview</CardTitle>
                      <CardDescription>
                        See how your page looks
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border border-gray-200 rounded-lg h-[500px] overflow-hidden">
                        <div 
                          className="h-full w-full p-8 flex flex-col items-center overflow-y-auto"
                          style={profile?.backgroundImage ? {
                            backgroundImage: `url(${profile.backgroundImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          } : {
                            background: themes.find(t => t.id === profile?.theme)?.background || themes[0].background
                          }}
                        >
                          <div className="w-20 h-20 rounded-full overflow-hidden mb-4 bg-white/20">
                            <img 
                              src={profile?.avatar} 
                              alt={profile?.displayName || 'Avatar'} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <h3 className={`text-xl font-semibold mb-1 ${profile?.backgroundImage ? 'text-white' : themes.find(t => t.id === profile?.theme)?.textColor || 'text-white'}`}>
                            {profile?.displayName || 'Your Name'}
                          </h3>
                          <p className={`text-sm mb-6 text-center ${profile?.backgroundImage ? 'text-white/80' : (themes.find(t => t.id === profile?.theme)?.textColor || 'text-white') + ' opacity-80'}`}>
                            {profile?.bio || 'Your bio goes here'}
                          </p>
                          
                          <div className="w-full max-w-sm space-y-3">
                            {profile?.links.map((link) => (
                              <div 
                                key={link.id}
                                className={`w-full py-3 px-5 rounded-lg flex items-center justify-center gap-2 font-medium ${profile?.backgroundImage ? 'bg-white/20 backdrop-blur-sm text-white' : themes.find(t => t.id === profile?.theme)?.buttonStyle || 'bg-white text-gray-800'}`}
                              >
                                {link.title}
                              </div>
                            ))}
                            
                            {profile?.links.length === 0 && (
                              <div className={`text-center py-8 ${profile?.backgroundImage ? 'text-white/80' : (themes.find(t => t.id === profile?.theme)?.textColor || 'text-white') + ' opacity-80'}`}>
                                <p>Add some links to see them here</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Profile Avatar</CardTitle>
                    <CardDescription>
                      Upload a profile picture
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user && profile && (
                      <ImageUploader
                        type="avatar"
                        currentImage={profile.avatar}
                        userId={user.id}
                        onImageUploaded={handleAvatarChange}
                      />
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>
                      Update your profile information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            linktree.com/u/
                          </span>
                          <Input
                            id="username"
                            value={profileForm.username}
                            onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                          id="displayName"
                          value={profileForm.displayName}
                          onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={profileForm.bio}
                          onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                          rows={4}
                        />
                      </div>
                      
                      <Button type="submit">
                        Save Profile
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <div className="sticky top-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Preview</CardTitle>
                      <CardDescription>
                        See how your profile looks
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border border-gray-200 rounded-lg h-[500px] overflow-hidden">
                        <div 
                          className="h-full w-full p-8 flex flex-col items-center overflow-y-auto"
                          style={profile?.backgroundImage ? {
                            backgroundImage: `url(${profile.backgroundImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          } : {
                            background: themes.find(t => t.id === profile?.theme)?.background || themes[0].background
                          }}
                        >
                          <div className="w-20 h-20 rounded-full overflow-hidden mb-4 bg-white/20">
                            <img 
                              src={profile?.avatar} 
                              alt={profileForm.displayName || 'Avatar'} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <h3 className={`text-xl font-semibold mb-1 ${profile?.backgroundImage ? 'text-white' : themes.find(t => t.id === profile?.theme)?.textColor || 'text-white'}`}>
                            {profileForm.displayName || 'Your Name'}
                          </h3>
                          <p className={`text-sm mb-6 text-center ${profile?.backgroundImage ? 'text-white/80' : (themes.find(t => t.id === profile?.theme)?.textColor || 'text-white') + ' opacity-80'}`}>
                            {profileForm.bio || 'Your bio goes here'}
                          </p>
                          
                          <div className="w-full max-w-sm space-y-3">
                            {profile?.links.map((link) => (
                              <div 
                                key={link.id}
                                className={`w-full py-3 px-5 rounded-lg flex items-center justify-center gap-2 font-medium ${profile?.backgroundImage ? 'bg-white/20 backdrop-blur-sm text-white' : themes.find(t => t.id === profile?.theme)?.buttonStyle || 'bg-white text-gray-800'}`}
                              >
                                {link.title}
                              </div>
                            ))}
                            
                            {profile?.links.length === 0 && (
                              <div className={`text-center py-8 ${profile?.backgroundImage ? 'text-white/80' : (themes.find(t => t.id === profile?.theme)?.textColor || 'text-white') + ' opacity-80'}`}>
                                <p>Add some links to see them here</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
