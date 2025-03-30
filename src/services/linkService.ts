
import { toast } from '@/hooks/use-toast';

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
  links: Link[];
  theme: string;
}

// Mock data storage (in a real app, this would be in a database)
let mockProfiles: Record<string, UserProfile> = {
  'demo': {
    username: 'demo',
    displayName: 'Demo User',
    bio: 'This is a demo profile for our LinkTree clone',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
    links: [
      { id: '1', title: 'My Website', url: 'https://example.com', position: 0 },
      { id: '2', title: 'My GitHub', url: 'https://github.com', position: 1 },
      { id: '3', title: 'My Twitter', url: 'https://twitter.com', position: 2 },
      { id: '4', title: 'My LinkedIn', url: 'https://linkedin.com', position: 3 },
    ],
    theme: 'default',
  },
};

// Get or create a profile
export const getOrCreateProfile = async (userId: string, defaultUsername?: string): Promise<UserProfile> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!mockProfiles[userId]) {
    // Create a new profile
    mockProfiles[userId] = {
      username: defaultUsername || userId,
      displayName: defaultUsername || 'New User',
      bio: 'Welcome to my links page!',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
      links: [],
      theme: 'default',
    };
  }
  
  return mockProfiles[userId];
};

// Get profile by username
export const getProfileByUsername = async (username: string): Promise<UserProfile | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Find profile with matching username
  const profile = Object.values(mockProfiles).find(p => p.username.toLowerCase() === username.toLowerCase());
  return profile || null;
};

// Update profile
export const updateProfile = async (userId: string, data: Partial<UserProfile>): Promise<UserProfile> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!mockProfiles[userId]) {
    throw new Error('Profile not found');
  }
  
  // Update profile
  mockProfiles[userId] = {
    ...mockProfiles[userId],
    ...data,
  };
  
  toast({
    title: 'Profile updated',
    description: 'Your profile has been updated successfully',
  });
  
  return mockProfiles[userId];
};

// Add link
export const addLink = async (userId: string, linkData: Omit<Link, 'id' | 'position'>): Promise<Link> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!mockProfiles[userId]) {
    throw new Error('Profile not found');
  }
  
  const newLink: Link = {
    id: Math.random().toString(36).substring(2, 9),
    position: mockProfiles[userId].links.length,
    ...linkData,
  };
  
  mockProfiles[userId].links.push(newLink);
  
  toast({
    title: 'Link added',
    description: 'Your link has been added successfully',
  });
  
  return newLink;
};

// Update link
export const updateLink = async (userId: string, linkId: string, linkData: Partial<Link>): Promise<Link> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!mockProfiles[userId]) {
    throw new Error('Profile not found');
  }
  
  const linkIndex = mockProfiles[userId].links.findIndex(link => link.id === linkId);
  if (linkIndex === -1) {
    throw new Error('Link not found');
  }
  
  mockProfiles[userId].links[linkIndex] = {
    ...mockProfiles[userId].links[linkIndex],
    ...linkData,
  };
  
  toast({
    title: 'Link updated',
    description: 'Your link has been updated successfully',
  });
  
  return mockProfiles[userId].links[linkIndex];
};

// Delete link
export const deleteLink = async (userId: string, linkId: string): Promise<void> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!mockProfiles[userId]) {
    throw new Error('Profile not found');
  }
  
  const linkIndex = mockProfiles[userId].links.findIndex(link => link.id === linkId);
  if (linkIndex === -1) {
    throw new Error('Link not found');
  }
  
  mockProfiles[userId].links = mockProfiles[userId].links.filter(link => link.id !== linkId);
  
  // Update positions
  mockProfiles[userId].links.forEach((link, index) => {
    link.position = index;
  });
  
  toast({
    title: 'Link deleted',
    description: 'Your link has been deleted successfully',
  });
};

// Reorder links
export const reorderLinks = async (userId: string, links: Link[]): Promise<Link[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!mockProfiles[userId]) {
    throw new Error('Profile not found');
  }
  
  // Update positions
  mockProfiles[userId].links = links.map((link, index) => ({
    ...link,
    position: index,
  }));
  
  toast({
    title: 'Links reordered',
    description: 'Your links have been reordered successfully',
  });
  
  return mockProfiles[userId].links;
};
