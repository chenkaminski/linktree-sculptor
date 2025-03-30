
export interface Theme {
  id: string;
  name: string;
  background: string;
  buttonStyle: string;
  textColor: string;
}

// Mock themes
export const themes: Theme[] = [
  {
    id: 'default',
    name: 'Default',
    background: 'bg-gradient-to-br from-purple-50 to-indigo-100',
    buttonStyle: 'bg-white text-gray-800',
    textColor: 'text-gray-800',
  },
  {
    id: 'purple',
    name: 'Purple',
    background: 'bg-gradient-to-br from-purple-500 to-indigo-600',
    buttonStyle: 'bg-white text-purple-600',
    textColor: 'text-white',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    background: 'bg-gradient-to-br from-blue-400 to-cyan-500',
    buttonStyle: 'bg-white text-blue-600',
    textColor: 'text-white',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    background: 'bg-gradient-to-br from-orange-400 to-pink-500',
    buttonStyle: 'bg-white text-orange-600',
    textColor: 'text-white',
  },
  {
    id: 'forest',
    name: 'Forest',
    background: 'bg-gradient-to-br from-green-400 to-teal-500',
    buttonStyle: 'bg-white text-green-600',
    textColor: 'text-white',
  },
  // New themes
  {
    id: 'midnight',
    name: 'Midnight',
    background: 'bg-gradient-to-br from-gray-900 to-blue-900',
    buttonStyle: 'bg-blue-200 text-blue-900',
    textColor: 'text-white',
  },
  {
    id: 'pastel',
    name: 'Pastel',
    background: 'bg-gradient-to-br from-pink-200 to-blue-200',
    buttonStyle: 'bg-white text-pink-600 border border-pink-300',
    textColor: 'text-gray-800',
  },
  {
    id: 'neon',
    name: 'Neon',
    background: 'bg-black',
    buttonStyle: 'bg-pink-500 text-white hover:bg-pink-600',
    textColor: 'text-pink-400',
  },
  {
    id: 'autumn',
    name: 'Autumn',
    background: 'bg-gradient-to-br from-yellow-500 to-red-500',
    buttonStyle: 'bg-amber-100 text-amber-900',
    textColor: 'text-white',
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    background: 'bg-gray-100',
    buttonStyle: 'bg-gray-800 text-white hover:bg-gray-700',
    textColor: 'text-gray-800',
  },
  {
    id: 'galaxy',
    name: 'Galaxy',
    background: 'bg-gradient-to-br from-purple-900 to-indigo-900',
    buttonStyle: 'bg-purple-200 text-purple-900 border border-purple-300',
    textColor: 'text-white',
  },
];

// Get a theme by ID
export const getTheme = (themeId: string): Theme => {
  return themes.find(theme => theme.id === themeId) || themes[0];
};

// Save user theme preference
export const saveUserThemePreference = async (userId: string, themeId: string) => {
  // This function is now handled in the linkService.ts updateProfile function
  // It's kept here for reference and potential future use
  return themeId;
};
