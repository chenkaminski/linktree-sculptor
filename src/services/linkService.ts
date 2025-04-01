
import { supabase } from '@/integrations/supabase/client';

export interface Link {
  id: string;
  user_id: string;
  position: number;
  title: string;
  url: string;
  display_type: string;
  background_color: string;
  text_color: string;
  border_radius: string;
  icon?: string;
  shadow?: string;
  shadow_color?: string;
  created_at: string;
  updated_at: string;
}

export interface Image {
  id: string;
  url: string;
  alt: string;
  position: number;
}

// Define SliderImage interface (used in Dashboard.tsx)
export interface SliderImage extends Image {}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  theme: string;
  fontFamily: string;
  fontColor: string;
  backgroundImage: string;
  showSocialIcons: boolean;
  useInfiniteSlider: boolean;
  imageLayout: string;
  gridColumns: number;
  logo?: string;
  links: Link[];
  images?: Image[];
}

// Function to get or create a profile
export const getOrCreateProfile = async (userId: string): Promise<UserProfile> => {
  try {
    // First try to get the existing profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // If profile exists, return it with links
    if (profileData && !profileError) {
      // Get user links
      const { data: linksData, error: linksError } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', userId)
        .order('position', { ascending: true });

      if (linksError) throw linksError;

      // Get images if any
      const { data: imagesData, error: imagesError } = await supabase
        .from('images')
        .select('*')
        .eq('user_id', userId)
        .order('position', { ascending: true });

      // We don't throw on image error since it's not critical
      const images = imagesError ? [] : imagesData || [];

      // Map links to add any missing properties with defaults
      const links = (linksData || []).map((link: any) => ({
        ...link,
        background_color: link.background_color || '#f3f4f6',
        text_color: link.text_color || '#000000',
        border_radius: link.border_radius || '0.5rem',
        shadow: link.shadow || undefined,
        shadow_color: link.shadow_color || undefined,
      }));

      return {
        id: profileData.id,
        username: profileData.username,
        displayName: profileData.display_name || profileData.username,
        bio: profileData.bio || '',
        avatar: profileData.avatar || 'https://via.placeholder.com/150',
        theme: profileData.theme || 'default',
        fontFamily: profileData.font_family || 'Inter',
        fontColor: profileData.font_color || '',
        backgroundImage: profileData.background_image || '',
        showSocialIcons: profileData.show_social_icons || false,
        useInfiniteSlider: profileData.use_infinite_slider || false,
        imageLayout: profileData.image_layout || 'row',
        gridColumns: profileData.grid_columns || 2,
        logo: profileData.logo || undefined,
        links,
        images,
      };
    }

    // Profile doesn't exist, create one
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        username: `user_${userId.substring(0, 8)}`,
        display_name: `User ${userId.substring(0, 8)}`,
      })
      .select()
      .single();

    if (createError) throw createError;

    // Return the newly created profile with empty links
    return {
      id: newProfile.id,
      username: newProfile.username,
      displayName: newProfile.display_name || newProfile.username,
      bio: '',
      avatar: 'https://via.placeholder.com/150',
      theme: 'default',
      fontFamily: 'Inter',
      fontColor: '',
      backgroundImage: '',
      showSocialIcons: false,
      useInfiniteSlider: false,
      imageLayout: 'row',
      gridColumns: 2,
      links: [],
      images: [],
    };
  } catch (error) {
    console.error('Error in getOrCreateProfile:', error);
    throw error;
  }
};

// Function to update profile
export const updateProfile = async (userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> => {
  try {
    // Map profile data to database format
    const dbProfile = {
      username: profileData.username,
      display_name: profileData.displayName,
      bio: profileData.bio,
      avatar: profileData.avatar,
      theme: profileData.theme,
      font_family: profileData.fontFamily,
      font_color: profileData.fontColor,
      background_image: profileData.backgroundImage,
      show_social_icons: profileData.showSocialIcons,
      use_infinite_slider: profileData.useInfiniteSlider,
      image_layout: profileData.imageLayout,
      grid_columns: profileData.gridColumns,
      logo: profileData.logo,
    };

    // Remove undefined values
    Object.keys(dbProfile).forEach(key => {
      if (dbProfile[key] === undefined) delete dbProfile[key];
    });

    const { error } = await supabase
      .from('profiles')
      .update(dbProfile)
      .eq('id', userId);

    if (error) throw error;

    // Return the updated profile
    return await getOrCreateProfile(userId);
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Function to get profile by username
export const getProfileByUsername = async (username: string): Promise<UserProfile | null> => {
  try {
    // Get user profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (profileError) throw profileError;
    if (!profileData) return null;

    // Get user links
    const { data: linksData, error: linksError } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', profileData.id)
      .order('position', { ascending: true });

    if (linksError) throw linksError;

    // Get images if any
    const { data: imagesData, error: imagesError } = await supabase
      .from('images')
      .select('*')
      .eq('user_id', profileData.id)
      .order('position', { ascending: true });

    // We don't throw on image error since it's not critical
    const images = imagesError ? [] : imagesData || [];

    // Map links to add any missing properties with defaults
    const links = (linksData || []).map((link: any) => ({
      ...link,
      background_color: link.background_color || '#f3f4f6',
      text_color: link.text_color || '#000000',
      border_radius: link.border_radius || '0.5rem',
      shadow: link.shadow || undefined,
      shadow_color: link.shadow_color || undefined,
    }));

    // Transform to UserProfile format
    return {
      id: profileData.id,
      username: profileData.username,
      displayName: profileData.display_name || profileData.username,
      bio: profileData.bio || '',
      avatar: profileData.avatar || 'https://via.placeholder.com/150',
      theme: profileData.theme || 'default',
      fontFamily: profileData.font_family || 'Inter',
      fontColor: profileData.font_color || '',
      backgroundImage: profileData.background_image || '',
      showSocialIcons: profileData.show_social_icons || false,
      useInfiniteSlider: profileData.use_infinite_slider || false,
      imageLayout: profileData.image_layout || 'row',
      gridColumns: profileData.grid_columns || 2,
      logo: profileData.logo || undefined,
      links,
      images,
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

// Function to save profile
export const saveProfile = async (profile: Partial<UserProfile>): Promise<void> => {
  try {
    if (!profile.id) {
      throw new Error('Profile ID is required');
    }

    // Map profile to database format
    const dbProfile = {
      username: profile.username,
      display_name: profile.displayName,
      bio: profile.bio,
      avatar: profile.avatar,
      theme: profile.theme,
      font_family: profile.fontFamily,
      font_color: profile.fontColor,
      background_image: profile.backgroundImage,
      show_social_icons: profile.showSocialIcons,
      use_infinite_slider: profile.useInfiniteSlider,
      image_layout: profile.imageLayout,
      grid_columns: profile.gridColumns,
      logo: profile.logo,
    };

    // Save profile
    const { error } = await supabase
      .from('profiles')
      .update(dbProfile)
      .eq('id', profile.id);

    if (error) throw error;

    // Update links if provided
    if (profile.links && profile.links.length > 0) {
      for (const link of profile.links) {
        await saveLink({
          ...link,
          user_id: profile.id,
        });
      }
    }
  } catch (error) {
    console.error('Error saving profile:', error);
    throw error;
  }
};

// Function to get links by user ID
export const getLinksByUserId = async (userId: string): Promise<Link[]> => {
  try {
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', userId)
      .order('position', { ascending: true });

    if (error) throw error;

    // Map links to add any missing properties with defaults
    return (data || []).map((link: any) => ({
      ...link,
      background_color: link.background_color || '#f3f4f6',
      text_color: link.text_color || '#000000',
      border_radius: link.border_radius || '0.5rem',
      shadow: link.shadow || undefined,
      shadow_color: link.shadow_color || undefined,
    }));
  } catch (error) {
    console.error('Error fetching links:', error);
    throw error;
  }
};

// Function to add a new link
export const addLink = async (userId: string, linkData: { title: string; url: string; icon?: string; display_type?: string }): Promise<Link> => {
  try {
    // Get current max position
    const { data: existingLinks } = await supabase
      .from('links')
      .select('position')
      .eq('user_id', userId)
      .order('position', { ascending: false })
      .limit(1);
      
    const nextPosition = existingLinks && existingLinks.length > 0 ? existingLinks[0].position + 1 : 0;
    
    // Insert the new link
    const { data, error } = await supabase
      .from('links')
      .insert({
        user_id: userId,
        title: linkData.title,
        url: linkData.url,
        position: nextPosition,
        icon: linkData.icon,
        display_type: linkData.display_type || 'button'
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return {
      ...data,
      background_color: data.background_color || '#f3f4f6',
      text_color: data.text_color || '#000000',
      border_radius: data.border_radius || '0.5rem',
      shadow: data.shadow || undefined,
      shadow_color: data.shadow_color || undefined,
    };
  } catch (error) {
    console.error('Error adding link:', error);
    throw error;
  }
};

// Function to update an existing link
export const updateLink = async (userId: string, linkId: string, updateData: Partial<Link>): Promise<Link> => {
  try {
    // Update the link
    const { data, error } = await supabase
      .from('links')
      .update({
        ...updateData,
        user_id: userId // ensure we don't change the user ID
      })
      .eq('id', linkId)
      .eq('user_id', userId) // additional security check
      .select()
      .single();
      
    if (error) throw error;
    
    return {
      ...data,
      background_color: data.background_color || '#f3f4f6',
      text_color: data.text_color || '#000000',
      border_radius: data.border_radius || '0.5rem',
      shadow: data.shadow || undefined,
      shadow_color: data.shadow_color || undefined,
    };
  } catch (error) {
    console.error('Error updating link:', error);
    throw error;
  }
};

// Function to save a link
export const saveLink = async (link: Partial<Link>): Promise<Link> => {
  try {
    if (!link.user_id) {
      throw new Error('User ID is required');
    }

    // If it's a new link, get the next position
    if (!link.id) {
      const { data } = await supabase
        .from('links')
        .select('position')
        .eq('user_id', link.user_id)
        .order('position', { ascending: false })
        .limit(1);

      const nextPosition = data && data.length > 0 ? data[0].position + 1 : 0;
      link.position = nextPosition;
    }

    let result;
    
    if (link.id) {
      // Update existing link
      const { data, error } = await supabase
        .from('links')
        .update({
          ...link,
          position: link.position || 0 // Ensure position is always defined
        })
        .eq('id', link.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Insert new link
      const { data, error } = await supabase
        .from('links')
        .insert({
          ...link,
          position: link.position || 0 // Ensure position is always defined
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return {
      ...result,
      background_color: result.background_color || '#f3f4f6',
      text_color: result.text_color || '#000000',
      border_radius: result.border_radius || '0.5rem',
      shadow: result.shadow || undefined,
      shadow_color: result.shadow_color || undefined,
    };
  } catch (error) {
    console.error('Error saving link:', error);
    throw error;
  }
};

// Function to delete a link
export const deleteLink = async (userId: string, linkId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('links')
      .delete()
      .eq('id', linkId)
      .eq('user_id', userId); // Security check to ensure user can only delete their own links

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting link:', error);
    throw error;
  }
};

// Function to update link positions
export const updateLinkPositions = async (links: { id: string; position: number }[]): Promise<void> => {
  try {
    for (const link of links) {
      const { error } = await supabase
        .from('links')
        .update({ position: link.position })
        .eq('id', link.id);

      if (error) throw error;
    }
  } catch (error) {
    console.error('Error updating link positions:', error);
    throw error;
  }
};

// Function to reorder links
export const reorderLinks = async (userId: string, links: Link[]): Promise<Link[]> => {
  try {
    const updates = links.map((link, index) => ({
      id: link.id,
      position: index
    }));
    
    await updateLinkPositions(updates);
    
    // Return the reordered links
    return getLinksByUserId(userId);
  } catch (error) {
    console.error('Error reordering links:', error);
    throw error;
  }
};

// Function to get images by user ID
export const getImagesByUserId = async (userId: string): Promise<Image[]> => {
  try {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .eq('user_id', userId)
      .order('position', { ascending: true });

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};

// Function to add a new image
export const addImage = async (userId: string, image: { url: string; alt: string }): Promise<Image> => {
  try {
    // Get current max position
    const { data: existingImages } = await supabase
      .from('images')
      .select('position')
      .eq('user_id', userId)
      .order('position', { ascending: false })
      .limit(1);
      
    const nextPosition = existingImages && existingImages.length > 0 ? existingImages[0].position + 1 : 0;
    
    // Insert the new image
    const { data, error } = await supabase
      .from('images')
      .insert({
        user_id: userId,
        url: image.url,
        alt: image.alt || '',
        position: nextPosition
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error adding image:', error);
    throw error;
  }
};

// Function to save an image
export const saveImage = async (image: Partial<Image>, userId: string): Promise<Image> => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    // If it's a new image, get the next position
    if (!image.id) {
      const { data } = await supabase
        .from('images')
        .select('position')
        .eq('user_id', userId)
        .order('position', { ascending: false })
        .limit(1);

      const nextPosition = data && data.length > 0 ? data[0].position + 1 : 0;
      
      const { data: newImage, error } = await supabase
        .from('images')
        .insert({
          url: image.url,
          alt: image.alt || '',
          position: nextPosition,
          user_id: userId
        })
        .select()
        .single();

      if (error) throw error;
      return newImage;
    } else {
      // Update existing image
      const { data, error } = await supabase
        .from('images')
        .update({
          url: image.url,
          alt: image.alt
        })
        .eq('id', image.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error saving image:', error);
    throw error;
  }
};

// Function to delete an image
export const deleteImage = async (userId: string, imageId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('images')
      .delete()
      .eq('id', imageId)
      .eq('user_id', userId); // Security check

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

// Function to update image positions
export const updateImagePositions = async (images: { id: string; position: number }[]): Promise<void> => {
  try {
    for (const image of images) {
      const { error } = await supabase
        .from('images')
        .update({ position: image.position })
        .eq('id', image.id);

      if (error) throw error;
    }
  } catch (error) {
    console.error('Error updating image positions:', error);
    throw error;
  }
};

// Function to toggle infinite slider
export const toggleInfiniteSlider = async (userId: string, enabled: boolean): Promise<void> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ use_infinite_slider: enabled })
      .eq('id', userId);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error toggling infinite slider:', error);
    throw error;
  }
};

// Function to update image layout
export const updateImageLayout = async (userId: string, layout: 'row' | 'column' | 'grid', columns?: 2 | 3 | 4): Promise<void> => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    const updateData: { image_layout: string; grid_columns?: number } = {
      image_layout: layout,
    };
    
    if (layout === 'grid' && columns) {
      updateData.grid_columns = columns;
    }
    
    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error updating image layout:', error);
    throw error;
  }
};
