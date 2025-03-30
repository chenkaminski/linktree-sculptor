
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
];

// Get a theme by ID
export const getTheme = (themeId: string): Theme => {
  return themes.find(theme => theme.id === themeId) || themes[0];
};
