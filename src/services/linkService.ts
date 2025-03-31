import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/schema';

export interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
  position: number;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  display_type?: 'button' | 'icon' | 'video' | string;
}

export interface SliderImage {
  id: string;
  url: string;
  alt: string;
}

export interface UserProfile {
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  backgroundImage: string;
  links: Link[];
  theme: string;
  fontFamily?: string;
  fontColor?: string;
  showSocialIcons?: boolean;
  images?: SliderImage[];
  useInfiniteSlider?: boolean;
  imageLayout?: 'row' | 'column' | 'grid';
  gridColumns?: 2 | 3 | 4;
}

// Get or create a profile for the current user
export const getOrCreateProfile = async (userId: string, defaultUsername?: string): Promise<UserProfile> => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }

    const { data: links, error: linksError } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', userId)
      .order('position');

    if (linksError) {
      console.error('Error fetching links:', linksError);
      throw linksError;
    }

    const { data: images, error: imagesError } = await supabase
      .from('images')
      .select('*')
      .eq('user_id', userId)
      .order('position');
console.log("images",images)
console.log("imagesError",imagesError)
    if (imagesError) {
      console.error('Error fetching images:', imagesError);
      // Don't throw, just log - we'll return an empty array
    }

    return {
      username: profile.username,
      displayName: profile.display_name || profile.username,
      bio: profile.bio || 'Welcome to my links page!',
      avatar: profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`,
      backgroundImage: profile.background_image || '',
      links: links?.map(link => ({
        id: link.id,
        title: link.title,
        url: link.url,
        icon: link.icon,
        position: link.position,
        backgroundColor: link.background_color,
        textColor: link.text_color,
        borderRadius: link.border_radius,
        display_type: link.display_type
      })) || [],
      theme: profile.theme || 'default',
      fontFamily: profile.font_family || 'Inter',
      fontColor: profile.font_color || '',
      showSocialIcons: profile.show_social_icons || false,
      images: images?.map(img => ({
        id: img.id,
        url: img.url,
        alt: img.alt
      })) || [],
      useInfiniteSlider: profile.use_infinite_slider || false,
      imageLayout: (profile.image_layout as 'row' | 'column' | 'grid') || 'row',
      gridColumns: (profile.grid_columns as 2 | 3 | 4) || 2,
    };
  } catch (error) {
    console.error('Error in getOrCreateProfile:', error);
    throw error;
  }
};

// Get profile by username
export const getProfileByUsername = async (username: string): Promise<UserProfile | null> => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username.toLowerCase())
      .single();

    if (error) {
      console.error('Error fetching profile by username:', error);
      return null;
    }

    const { data: links, error: linksError } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', profile.id)
      .order('position');

    if (linksError) {
      console.error('Error fetching links for profile:', linksError);
      throw linksError;
    }

    const { data: images, error: imagesError } = await supabase
      .from('images')
      .select('*')
      .eq('user_id', profile.id)
      .order('position');

    if (imagesError) {
      console.error('Error fetching images for profile:', imagesError);
      // Don't throw, just log - we'll return an empty array
    }

    return {
      username: profile.username,
      displayName: profile.display_name || profile.username,
      bio: profile.bio || '',
      avatar: profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`,
      backgroundImage: profile.background_image || '',
      links: links?.map(link => ({
        id: link.id,
        title: link.title,
        url: link.url,
        icon: link.icon,
        position: link.position,
        backgroundColor: link.background_color,
        textColor: link.text_color,
        borderRadius: link.border_radius,
        display_type: link.display_type
      })) || [],
      theme: profile.theme || 'default',
      fontFamily: profile.font_family || 'Inter',
      fontColor: profile.font_color || '',
      showSocialIcons: profile.show_social_icons || false,
      images: images?.map(img => ({
        id: img.id,
        url: img.url,
        alt: img.alt
      })) || [],
      useInfiniteSlider: profile.use_infinite_slider || false,
      imageLayout: (profile.image_layout as 'row' | 'column' | 'grid') || 'row',
      gridColumns: (profile.grid_columns as 2 | 3 | 4) || 2,
    };
  } catch (error) {
    console.error('Error in getProfileByUsername:', error);
    return null;
  }
};

// Update profile
export const updateProfile = async (userId: string, data: Partial<UserProfile>): Promise<UserProfile> => {
  try {
    const updateData: Record<string, unknown> = {};
    
    if (data.username) updateData.username = data.username.toLowerCase();
    if (data.displayName !== undefined) updateData.display_name = data.displayName;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.avatar !== undefined) updateData.avatar = data.avatar;
    if (data.backgroundImage !== undefined) updateData.background_image = data.backgroundImage;
    if (data.theme) updateData.theme = data.theme;
    if (data.fontFamily) updateData.font_family = data.fontFamily;
    if (data.fontColor !== undefined) updateData.font_color = data.fontColor;
    if (data.showSocialIcons !== undefined) updateData.show_social_icons = data.showSocialIcons;
    if (data.imageLayout !== undefined) updateData.image_layout = data.imageLayout;
    if (data.gridColumns !== undefined) updateData.grid_columns = data.gridColumns;
    
    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  
  toast({
    title: 'Profile updated',
    description: 'Your profile has been updated successfully',
  });
  
    return await getOrCreateProfile(userId);
  } catch (error) {
    console.error('Error in updateProfile:', error);
    throw error;
  }
};

// Add link
export const addLink = async (userId: string, linkData: Omit<Link, 'id' | 'position'>): Promise<Link> => {
  try {
    // Get the count of existing links to determine the position
    const { count, error: countError } = await supabase
      .from('links')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (countError) {
      console.error('Error counting links:', countError);
      throw countError;
    }

    const position = count || 0;
    console.log("linkData.display_type",linkData)
    const { data, error } = await supabase
      .from('links')
      .insert([
        {
          user_id: userId,
          title: linkData.title,
          url: linkData.url,
          icon: linkData.icon,
          position: position,
          background_color: linkData.backgroundColor,
          text_color: linkData.textColor,
          border_radius: linkData.borderRadius,
          display_type: linkData.display_type
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding link:', error);
      throw error;
    }
  
  toast({
    title: 'Link added',
    description: 'Your link has been added successfully',
  });
  
    return {
      id: data.id,
      title: data.title,
      url: data.url,
      icon: data.icon,
      position: data.position,
      backgroundColor: data.background_color,
      textColor: data.text_color,
      borderRadius: data.border_radius,
      display_type: data.display_type as 'button' | 'icon' | 'video',
    };
  } catch (error) {
    console.error('Error in addLink:', error);
    throw error;
  }
};

// Update link
export const updateLink = async (userId: string, linkId: string, linkData: Partial<Link>): Promise<Link> => {
  try {
    const updateData: Record<string, unknown> = {};
    
    if (linkData.title !== undefined) updateData.title = linkData.title;
    if (linkData.url !== undefined) updateData.url = linkData.url;
    if (linkData.icon !== undefined) updateData.icon = linkData.icon;
    if (linkData.position !== undefined) updateData.position = linkData.position;
    if (linkData.backgroundColor !== undefined) updateData.background_color = linkData.backgroundColor;
    if (linkData.textColor !== undefined) updateData.text_color = linkData.textColor;
    if (linkData.borderRadius !== undefined) updateData.border_radius = linkData.borderRadius;
    if (linkData.display_type !== undefined) updateData.display_type = linkData.display_type;

    const { data, error } = await supabase
      .from('links')
      .update(updateData)
      .eq('id', linkId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating link:', error);
      throw error;
    }
  
  toast({
    title: 'Link updated',
    description: 'Your link has been updated successfully',
  });
  
    return {
      id: data.id,
      title: data.title,
      url: data.url,
      icon: data.icon,
      position: data.position,
      backgroundColor: data.background_color,
      textColor: data.text_color,
      borderRadius: data.border_radius,
      display_type: data.display_type as 'button' | 'icon' | 'video',
    };
  } catch (error) {
    console.error('Error in updateLink:', error);
    throw error;
  }
};

// Delete link
export const deleteLink = async (userId: string, linkId: string): Promise<void> => {
  try {
    // Get the position of the link to be deleted
    const { data: linkToDelete, error: fetchError } = await supabase
      .from('links')
      .select('position')
      .eq('id', linkId)
      .eq('user_id', userId)
      .single();

    if (fetchError) {
      console.error('Error fetching link to delete:', fetchError);
      throw fetchError;
    }

    // Delete the link
    const { error: deleteError } = await supabase
      .from('links')
      .delete()
      .eq('id', linkId)
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Error deleting link:', deleteError);
      throw deleteError;
    }

    // Update positions of remaining links
    const { data: remainingLinks, error: fetchRemainingError } = await supabase
      .from('links')
      .select('id, position')
      .eq('user_id', userId)
      .gt('position', linkToDelete.position)
      .order('position');

    if (fetchRemainingError) {
      console.error('Error fetching remaining links:', fetchRemainingError);
      throw fetchRemainingError;
    }

    // Update positions of remaining links
    for (const link of remainingLinks || []) {
      const { error: updateError } = await supabase
        .from('links')
        .update({ position: link.position - 1 })
        .eq('id', link.id)
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error updating link position:', updateError);
        throw updateError;
      }
    }
  
  toast({
    title: 'Link deleted',
    description: 'Your link has been deleted successfully',
  });
  } catch (error) {
    console.error('Error in deleteLink:', error);
    throw error;
  }
};

// Reorder links
export const reorderLinks = async (userId: string, links: Link[]): Promise<Link[]> => {
  try {
    // Update positions for all links
    for (let i = 0; i < links.length; i++) {
      const { error } = await supabase
        .from('links')
        .update({ position: i })
        .eq('id', links[i].id)
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating link position:', error);
        throw error;
      }
    }
  
  toast({
    title: 'Links reordered',
    description: 'Your links have been reordered successfully',
  });
  
    // Return the updated links
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', userId)
      .order('position');

    if (error) {
      console.error('Error fetching reordered links:', error);
      throw error;
    }

    return data.map(link => ({
      id: link.id,
      title: link.title,
      url: link.url,
      icon: link.icon,
      position: link.position,
      backgroundColor: link.background_color,
      textColor: link.text_color,
      borderRadius: link.border_radius,
      display_type: link.display_type as 'button' | 'icon' | 'video',
    }));
  } catch (error) {
    console.error('Error in reorderLinks:', error);
    throw error;
  }
};

// Add image to slider
export const addImage = async (userId: string, imageData: { url: string; alt: string }): Promise<SliderImage> => {
  try {
    // Get the count of existing images to determine the position
    const { count, error: countError } = await supabase
      .from('images')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (countError) {
      console.error('Error counting images:', countError);
      throw countError;
    }

    const position = count || 0;
    console.log("imageData",imageData,userId,position)
    const { data, error } = await supabase
      .from('images')
      .insert([
        {
          user_id: userId,
          url: imageData.url,
          alt: imageData.alt,
          position: position
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding image:', error);
      throw error;
    }

    toast({
      title: 'Image added',
      description: 'Your image has been added to the slider',
    });

    return {
      id: data.id,
      url: data.url,
      alt: data.alt
    };
  } catch (error) {
    console.error('Error in addImage:', error);
    throw error;
  }
};

// Delete image from slider
export const deleteImage = async (userId: string, imageId: string): Promise<void> => {
  try {
    // Get the image URL to delete from storage
    const { data: imageToDelete, error: fetchError } = await supabase
      .from('images')
      .select('url, position')
      .eq('id', imageId)
      .eq('user_id', userId)
      .single();

    if (fetchError) {
      console.error('Error fetching image to delete:', fetchError);
      throw fetchError;
    }

    // Extract the file path from the URL
    // The URL format is https://[domain]/storage/v1/object/public/avatars/[file_path]
    const urlParts = imageToDelete.url.split('/');
    const filePath = urlParts.slice(urlParts.indexOf('avatars') + 1).join('/');

    // Delete the image from storage
    if (filePath) {
      const { error: storageError } = await supabase.storage
        .from('avatars')
        .remove([filePath]);

      if (storageError) {
        console.error('Error deleting image from storage:', storageError);
        // Continue with database deletion even if storage delete fails
      }
    }

    // Delete the image record
    const { error: deleteError } = await supabase
      .from('images')
      .delete()
      .eq('id', imageId)
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Error deleting image:', deleteError);
      throw deleteError;
    }

    // Update positions of remaining images
    const { data: remainingImages, error: fetchRemainingError } = await supabase
      .from('images')
      .select('id, position')
      .eq('user_id', userId)
      .gt('position', imageToDelete.position)
      .order('position');

    if (fetchRemainingError) {
      console.error('Error fetching remaining images:', fetchRemainingError);
      throw fetchRemainingError;
    }

    // Update positions of remaining images
    for (const image of remainingImages || []) {
      const { error: updateError } = await supabase
        .from('images')
        .update({ position: image.position - 1 })
        .eq('id', image.id)
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error updating image position:', updateError);
        throw updateError;
      }
    }

    toast({
      title: 'Image deleted',
      description: 'Your image has been removed from the slider',
    });
  } catch (error) {
    console.error('Error in deleteImage:', error);
    throw error;
  }
};

// Toggle infinite slider mode
export const toggleInfiniteSlider = async (userId: string, useInfiniteSlider: boolean): Promise<void> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        use_infinite_slider: useInfiniteSlider
      })
      .eq('id', userId);

    if (error) {
      console.error('Error updating infinite slider mode:', error);
      throw error;
    }

    toast({
      title: 'Slider mode updated',
      description: useInfiniteSlider ? 'Infinite slider mode enabled' : 'Standard carousel mode enabled',
    });
  } catch (error) {
    console.error('Error in toggleInfiniteSlider:', error);
    throw error;
  }
};

// Update image layout settings
export const updateImageLayout = async (
  userId: string, 
  layout: 'row' | 'column' | 'grid',
  gridColumns?: 2 | 3 | 4
): Promise<void> => {
  try {
    const updateData: Record<string, unknown> = {
      image_layout: layout
    };
    
    if (layout === 'grid' && gridColumns) {
      updateData.grid_columns = gridColumns;
    }
    
    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      console.error('Error updating image layout:', error);
      throw error;
    }

    toast({
      title: 'Image layout updated',
      description: `Image layout changed to ${layout}${layout === 'grid' ? ` with ${gridColumns} columns` : ''}`,
    });
  } catch (error) {
    console.error('Error in updateImageLayout:', error);
    throw error;
  }
};
