import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, LinkIcon, User, Settings, Share2, Palette, Image as ImageIcon, Facebook, Twitter, Instagram, Linkedin, Github, Youtube, Mail, Globe, Twitch, Dribbble, Figma, Slack } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import LinkForm from '@/components/LinkForm';
import DashboardLinkItem from '@/components/DashboardLinkItem';
import ProfileStylesEditor from '@/components/ProfileStylesEditor';
import { UserProfile, Link as LinkType, getOrCreateProfile, updateProfile, addLink, updateLink, deleteLink, reorderLinks, addImage, deleteImage, toggleInfiniteSlider, SliderImage, updateImageLayout } from '@/services/linkService';
import { themes } from '@/services/themeService';
import SocialIconPicker from '@/components/SocialIconPicker';
import ImageUploader from '@/components/ImageUploader';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import { Switch } from '@/components/ui/switch';
import ImageSlider from '@/components/ImageSlider';
import { InfiniteSlider } from '@/components/ui/infinite-slider';

const SortableLinkItem = ({ link, onEdit, onDelete, onStyleUpdate }) => {
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
        onStyleUpdate={onStyleUpdate}
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
};

const PreviewCard = ({ profile, profileForm, renderSocialIcons, themes }) => {
  return (
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
                alt={(profileForm?.displayName || profile?.displayName) || 'Avatar'} 
                className="w-full h-full object-cover" 
              />
            </div>
            <h3 
              className={`text-xl font-semibold mb-1 ${profile?.backgroundImage ? 'text-white' : themes.find(t => t.id === profile?.theme)?.textColor || 'text-white'}`}
              style={{ 
                fontFamily: profile?.fontFamily || 'Inter',
                color: profile?.fontColor || undefined
              }}
            >
              {(profileForm?.displayName || profile?.displayName) || 'Your Name'}
            </h3>
            <p 
              className={`text-sm mb-6 text-center ${profile?.backgroundImage ? 'text-white/80' : (themes.find(t => t.id === profile?.theme)?.textColor || 'text-white') + ' opacity-80'}`}
              style={{ 
                fontFamily: profile?.fontFamily || 'Inter',
                color: profile?.fontColor ? profile?.fontColor + '99' : undefined
              }}
            >
              {(profileForm?.bio || profile?.bio) || 'Your bio goes here'}
            </p>
            
            {profile?.showSocialIcons && renderSocialIcons()}
            
            <div className="w-full max-w-sm space-y-3">
              {profile?.links.filter(l => !profile.showSocialIcons || l.display_type !== 'icon').map((link) => (
                <div 
                  key={link.id}
                  className={`w-full py-3 px-5 rounded-lg flex items-center justify-center gap-2 font-medium ${profile?.backgroundImage ? 'bg-white/20 backdrop-blur-sm text-white' : themes.find(t => t.id === profile?.theme)?.buttonStyle || 'bg-white text-gray-800'}`}
                  style={{
                    backgroundColor: link.backgroundColor,
                    color: link.textColor,
                    borderRadius: link.borderRadius,
                    boxShadow: link.shadow,
                    fontFamily: profile?.fontFamily || 'Inter',
                  }}
                >
                  {link.title}
                </div>
              ))}
              
              {/* Display images preview */}
              {profile?.images && profile.images.length > 0 && (
                <div className="w-full mt-4 mb-6 overflow-hidden rounded-lg">
                  {profile.useInfiniteSlider ? (
                    <InfiniteSlider duration={30} gap={8} className="w-full">
                      {profile.images.map((image) => (
                        <div key={image.id} className="flex-shrink-0 w-32 h-24 rounded-lg overflow-hidden">
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
                      <div className="flex gap-2">
                        {profile.images.map((image) => (
                          <div key={image.id} className="flex-shrink-0 w-32 h-24 rounded-lg overflow-hidden">
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
                    <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
                      {profile.images.map((image) => (
                        <div key={image.id} className="w-full h-24 rounded-lg overflow-hidden">
                          <img 
                            src={image.url}
                            alt={image.alt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`grid gap-2 ${
                      profile.gridColumns === 2 ? 'grid-cols-2' :
                      profile.gridColumns === 3 ? 'grid-cols-3' :
                      profile.gridColumns === 4 ? 'grid-cols-4' : 'grid-cols-2'
                    }`}>
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
              
              {profile?.links.length === 0 && profile?.images?.length === 0 && (
                <div className={`text-center py-8 ${profile?.backgroundImage ? 'text-white/80' : (themes.find(t => t.id === profile?.theme)?.textColor || 'text-white') + ' opacity-80'}`}>
                  <p>Add some links or images to see them here</p>
                </div>
              )}
            </div>
            
            {/* Logo at the bottom */}
            {profile?.logo && (
              <div className="mt-auto pt-6 mb-4 flex justify-center">
                <img 
                  src={profile.logo}
                  alt={`${profile.displayName} logo`}
                  className="max-h-12 max-w-[180px] object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
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
  
  const handleAddSocialLink = async (data: { title: string; url: string; icon: string; display_type: 'button' | 'icon' }) => {
    if (!user) return;
    
    try {
      const newLink = await addLink(user.id, {
        ...data,
      });
      
      setProfile(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          links: [...prev.links, newLink],
        };
      });
      
      toast({
        title: 'Social link added',
        description: `${data.title} has been added to your profile`,
      });
    } catch (error) {
      console.error('Error adding social link:', error);
      toast({
        title: 'Error',
        description: 'Failed to add social link',
        variant: 'destructive',
      });
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
  
  const handleStyleUpdateLink = async (id: string, styles: Partial<LinkType>) => {
    if (!user) return;
    
    try {
      const updatedLink = await updateLink(user.id, id, styles);
      setProfile(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          links: prev.links.map(link => link.id === id ? updatedLink : link),
        };
      });
    } catch (error) {
      console.error('Error updating link style:', error);
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
    if (!user) return;
    
    setProfileForm((prev) => ({
      ...prev,
      avatar: url
    }));
    
    try {
      await updateProfile(user.id, { avatar: url });
      
      setProfile((prev) => {
        if (!prev) return prev;
        
        return {
          ...prev,
          avatar: url
        };
      });
      
      if (url) {
        toast({
          title: 'Avatar updated',
          description: 'Your profile picture has been updated successfully.',
        });
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast({
        title: 'Error',
        description: 'Failed to update avatar',
        variant: 'destructive'
      });
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

  const handleStyleUpdate = async (styleData: Partial<UserProfile>) => {
    if (!user || !profile) return;
    
    try {
      const updatedProfile = await updateProfile(user.id, styleData);
      setProfile(updatedProfile);
      toast({
        title: 'Styling updated',
        description: 'Your styling preferences have been updated',
      });
    } catch (error) {
      console.error('Error updating styling:', error);
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

  const toggleSocialIconsDisplay = async (enabled: boolean) => {
    if (!user || !profile) return;
    
    try {
      const updatedProfile = await updateProfile(user.id, {
        showSocialIcons: enabled
      });
      setProfile(updatedProfile);
      
      toast({
        title: `Social icons ${enabled ? 'enabled' : 'disabled'}`,
        description: `Social icons will ${enabled ? 'now' : 'no longer'} be displayed below your bio`
      });
    } catch (error) {
      console.error('Error updating social icons display:', error);
      toast({
        title: 'Error',
        description: 'Failed to update social icons settings',
        variant: 'destructive',
      });
    }
  };

  const renderSocialIcons = () => {
    if (!profile) return null;
    
    const socialLinks = profile.links.filter(link => link.display_type === 'icon');
      
    if (socialLinks.length === 0) return null;
    
    return (
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {socialLinks.map((link) => (
          <div 
            key={link.id}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
            style={{
              backgroundColor: link.backgroundColor || '#f3f4f6',
              color: link.textColor || '#000000'
            }}
            title={link.title}
          >
            {getSocialIcon(link.icon, 18)}
          </div>
        ))}
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

  const handleAddImage = async (image: { url: string; alt: string }) => {
    if (!user) return;
    
    try {
      const newImage = await addImage(user.id, image);
      
      setProfile(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          images: [...(prev.images || []), newImage]
        };
      });
    } catch (error) {
      console.error('Error adding image:', error);
      toast({
        title: 'Error',
        description: 'Failed to add image to slider',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!user) return;
    
    try {
      await deleteImage(user.id, imageId);
      
      setProfile(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          images: prev.images?.filter(img => img.id !== imageId) || []
        };
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete image from slider',
        variant: 'destructive'
      });
    }
  };

  const handleToggleInfiniteSlider = async (value: boolean) => {
    if (!user) return;
    
    try {
      await toggleInfiniteSlider(user.id, value);
      
      setProfile(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          useInfiniteSlider: value
        };
      });
    } catch (error) {
      console.error('Error toggling infinite slider:', error);
      toast({
        title: 'Error',
        description: 'Failed to update slider mode',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateImageLayout = async (layout: 'row' | 'column' | 'grid', columns?: 2 | 3 | 4) => {
    if (!user) return;
    
    try {
      await updateImageLayout(user.id, layout, columns);
      
      setProfile(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          imageLayout: layout,
          gridColumns: columns || 2
        };
      });
    } catch (error) {
      console.error('Error updating image layout:', error);
      toast({
        title: 'Error',
        description: 'Failed to update image layout',
        variant: 'destructive'
      });
    }
  };

  const handleLogoChange = async (url: string) => {
    if (!user || !profile) return;
    
    try {
      const updatedProfile = await updateProfile(user.id, {
        logo: url
      });
      
      setProfile(updatedProfile);
      
      toast({
        title: 'Logo updated',
        description: 'Your profile logo has been updated successfully',
      });
    } catch (error) {
      console.error('Error updating logo:', error);
      toast({
        title: 'Update failed',
        description: 'There was an error updating your logo',
        variant: 'destructive',
      });
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
            <TabsTrigger value="social">
              <Share2 size={16} className="mr-2" />
              Social Icons
            </TabsTrigger>
            <TabsTrigger value="images">
              <ImageIcon size={16} className="mr-2" />
              Images
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette size={16} className="mr-2" />
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
                          {/* {profile.links.map((link) => (
                            <SortableLinkItem
                              key={link.id}
                              link={link}
                              onEdit={handleEditLink}
                              onDelete={handleDeleteLink}
                              onStyleUpdate={handleStyleUpdateLink}
                            />
                          ))} */}

{profile.links
  .filter(link => link.display_type === 'button')
  .map((link) => (
    <SortableLinkItem
      key={link.id}
      link={link}
      onEdit={handleEditLink}
      onDelete={handleDeleteLink}
      onStyleUpdate={handleStyleUpdateLink}
    />
  ))
}
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
                  <PreviewCard 
                    profile={profile}
                    profileForm={profileForm}
                    renderSocialIcons={renderSocialIcons}
                    themes={themes}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="social" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Social Icons</CardTitle>
                    <CardDescription>
                      Add social media profiles to display as icons below your bio
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2 mb-6">
                      <Switch 
                        checked={profile?.showSocialIcons || false} 
                        onCheckedChange={toggleSocialIconsDisplay} 
                        id="show-social-icons"
                      />
                      <Label htmlFor="show-social-icons">
                        Show social icons below your bio
                      </Label>
                    </div>
                    
                    {profile?.links.filter(link => link.icon && link.display_type === 'icon').length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">You haven't added any social icons yet</p>
                        <SocialIconPicker onAddLink={handleAddSocialLink} />
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4 mb-6">
                          <h3 className="text-sm font-medium">Your social icons</h3>
                          <div className="grid grid-cols-1 gap-3">
                            <DndContext 
                              sensors={sensors}
                              collisionDetection={closestCenter}
                              onDragEnd={handleDragEnd}
                              modifiers={[restrictToVerticalAxis]}
                            >
                              <SortableContext 
                                items={profile?.links.filter(link => link.display_type === 'icon').map(link => link.id) || []}
                                strategy={verticalListSortingStrategy}
                              >
                                {profile?.links.filter(link => link.display_type === 'icon').map((link) => (
                                  <SortableLinkItem
                                    key={link.id}
                                    link={link}
                                    onEdit={handleEditLink}
                                    onDelete={handleDeleteLink}
                                    onStyleUpdate={handleStyleUpdateLink}
                                  />
                                ))}
                              </SortableContext>
                            </DndContext>
                          </div>
                        </div>
                        <SocialIconPicker onAddLink={handleAddSocialLink} />
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <div className="sticky top-8">
                  <PreviewCard 
                    profile={profile}
                    profileForm={profileForm}
                    renderSocialIcons={renderSocialIcons}
                    themes={themes}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="images" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Image Slider</CardTitle>
                    <CardDescription>
                      Add images to create a visual gallery on your profile
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ImageSlider 
                      images={profile?.images || []}
                      onAddImage={handleAddImage}
                      onDeleteImage={handleDeleteImage}
                      onToggleInfiniteSlider={handleToggleInfiniteSlider}
                      onUpdateImageLayout={handleUpdateImageLayout}
                      useInfiniteSlider={profile?.useInfiniteSlider || false}
                      imageLayout={profile?.imageLayout as 'row' | 'column' | 'grid' || 'row'}
                      gridColumns={profile?.gridColumns as 2 | 3 | 4 || 2}
                      userId={user?.id || ''}
                    />
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <PreviewCard 
                  profile={profile}
                  profileForm={profileForm}
                  renderSocialIcons={renderSocialIcons}
                  themes={themes}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="appearance">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Typography & Layout</CardTitle>
                    <CardDescription>
                      Customize how your text and links appear
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {profile && (
                      <ProfileStylesEditor
                        profile={profile}
                        onUpdate={handleStyleUpdate}
                      />
                    )}
                  </CardContent>
                </Card>
                
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
                  <PreviewCard 
                    profile={profile}
                    profileForm={profileForm}
                    renderSocialIcons={renderSocialIcons}
                    themes={themes}
                  />
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
                
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Profile Logo</CardTitle>
                    <CardDescription>
                      Upload a logo to be displayed at the bottom of your profile page
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user && profile && (
                      <ImageUploader
                        type="logo"
                        currentImage={profile.logo || null}
                        userId={user.id}
                        onImageUploaded={handleLogoChange}
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
                  <PreviewCard 
                    profile={profile}
                    profileForm={profileForm}
                    renderSocialIcons={renderSocialIcons}
                    themes={themes}
                  />
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
