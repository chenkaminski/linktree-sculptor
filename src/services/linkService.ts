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
        .update(link)
        .eq('id', link.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Insert new link
      const { data, error } = await supabase
        .from('links')
        .insert(link)
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
export const deleteLink = async (linkId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('links')
      .delete()
      .eq('id', linkId);

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
export const deleteImage = async (imageId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('images')
      .delete()
      .eq('id', imageId);

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
