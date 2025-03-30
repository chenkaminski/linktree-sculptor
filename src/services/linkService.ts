
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/schema';

export interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
  position: number;
}

export interface UserProfile {
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  backgroundImage: string;
  links: Link[];
  theme: string;
}

// Get or create a profile for the current user
export const getOrCreateProfile = async (userId: string, defaultUsername?: string): Promise<UserProfile> => {
  try {
    let { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }

    let { data: links, error: linksError } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', userId)
      .order('position');

    if (linksError) {
      console.error('Error fetching links:', linksError);
      throw linksError;
    }

    return {
      username: profile.username,
      displayName: profile.display_name || profile.username,
      bio: profile.bio || 'Welcome to my links page!',
      avatar: profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`,
      backgroundImage: profile.background_image || '',
      links: links || [],
      theme: profile.theme || 'default',
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

    return {
      username: profile.username,
      displayName: profile.display_name || profile.username,
      bio: profile.bio || '',
      avatar: profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`,
      backgroundImage: profile.background_image || '',
      links: links || [],
      theme: profile.theme || 'default',
    };
  } catch (error) {
    console.error('Error in getProfileByUsername:', error);
    return null;
  }
};

// Update profile
export const updateProfile = async (userId: string, data: Partial<UserProfile>): Promise<UserProfile> => {
  try {
    const updateData: any = {};
    
    if (data.username) updateData.username = data.username.toLowerCase();
    if (data.displayName !== undefined) updateData.display_name = data.displayName;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.avatar !== undefined) updateData.avatar = data.avatar;
    if (data.backgroundImage !== undefined) updateData.background_image = data.backgroundImage;
    if (data.theme) updateData.theme = data.theme;
    
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

    const { data, error } = await supabase
      .from('links')
      .insert([
        {
          user_id: userId,
          title: linkData.title,
          url: linkData.url,
          icon: linkData.icon,
          position: position
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

    return data;
  } catch (error) {
    console.error('Error in addLink:', error);
    throw error;
  }
};

// Update link
export const updateLink = async (userId: string, linkId: string, linkData: Partial<Link>): Promise<Link> => {
  try {
    const { data, error } = await supabase
      .from('links')
      .update({
        title: linkData.title,
        url: linkData.url,
        icon: linkData.icon,
        position: linkData.position
      })
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

    return data;
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

    return data;
  } catch (error) {
    console.error('Error in reorderLinks:', error);
    throw error;
  }
};
