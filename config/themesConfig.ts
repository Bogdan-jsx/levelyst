import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

export enum ThemeNames {
    LIGHT = 'light',
    DARK = 'dark',
    PASTEL = 'pastel',
    DEEP_BLUE = 'deepBlue',
    FOREST = 'forest',
    SUNSET = 'sunset',
    MONO_DARK = 'monoDark',
    ICY_BLUE = 'icyBlue',
    PEACH_CREAM = 'peachCream',
    CYBERPUNK = 'cyberpunk'
}

export const NewLightTheme = {
    dark: false,
    name: ThemeNames.LIGHT,
    colors: {
        ...MD3LightTheme.colors,

        primary: '#333333',

        background: '#F2F2F2',
        onBackground: '#4F4F4F',

        surface: '#BDBDBD',
        onSurface: '#696969',

        secondary: '#D6D6D6',
        onSecondary: '#858585',

        primaryContainer: '#9E9E9E'
    }
}

export const NewDarkTheme = {
    dark: true,
    name: ThemeNames.DARK,
    colors: {
        ...MD3LightTheme.colors,

        primary: '#F2F2F2',

        background: '#333333',
        onBackground: '#D6D6D6',

        surface: '#696969',
        onSurface: '#BDBDBD',

        secondary: '#4F4F4F',
        onSecondary: '#9E9E9E',

        primaryContainer: '#858585'
    }
}

export const PastelTheme = {
    dark: false,
    name: ThemeNames.PASTEL,
    colors: {
      ...MD3LightTheme.colors,
  
      primary: '#A78BFA',         
      background: '#FAF5FF',       
      onBackground: '#5B5B5B',
  
      surface: '#E9D5FF',       
      onSurface: '#6B21A8',
  
      secondary: '#FBCFE8',      
      onSecondary: '#9D174D',
  
      primaryContainer: '#DDD6FE'
    }
  }

  export const DeepBlueTheme = {
    dark: true,
    name: ThemeNames.DEEP_BLUE,
    colors: {
      ...MD3DarkTheme.colors,
  
      primary: '#60A5FA',     
      background: '#0A0E1A',     
      onBackground: '#E0E7FF',
  
      surface: '#1E293B',
      onSurface: '#CBD5E1',
  
      secondary: '#475569',       
      onSecondary: '#F8FAFC',
  
      primaryContainer: '#1D4ED8'
    }
  }

  export const ForestTheme = {
    dark: false,
    name: ThemeNames.FOREST,
    colors: {
      ...MD3LightTheme.colors,
  
      primary: '#2F855A',       
      background: '#F0FFF4',    
      onBackground: '#2D3748',
  
      surface: '#C6F6D5',        
      onSurface: '#22543D',
  
      secondary: '#9AE6B4',
      onSecondary: '#276749',
  
      primaryContainer: '#68D391'
    }
  }

  export const SunsetTheme = {
    dark: false,
    name: ThemeNames.SUNSET,
    colors: {
      ...MD3LightTheme.colors,
  
      primary: '#FF6B6B',        
      background: '#FFF5E5',       
      onBackground: '#5C4033',
  
      surface: '#FFE3D3',        
      onSurface: '#B45151',
  
      secondary: '#FFB26B',        
      onSecondary: '#6B2C2C',
  
      primaryContainer: '#FFC1A1'
    }
  }

  export const MonoDarkTheme = {
    dark: true,
    name: ThemeNames.MONO_DARK,
    colors: {
      ...MD3DarkTheme.colors,
  
      primary: '#BDBDBD',     
      background: '#121212',   
      onBackground: '#E0E0E0',
  
      surface: '#1F1F1F',
      onSurface: '#CFCFCF',
  
      secondary: '#2F2F2F',      
      onSecondary: '#FAFAFA',
  
      primaryContainer: '#2E2E2E'
    }
  }

  export const IcyBlueTheme = {
    dark: false,
    name: ThemeNames.ICY_BLUE,
    colors: {
      ...MD3LightTheme.colors,
  
      primary: '#3B82F6', 
      background: '#F0F9FF',      
      onBackground: '#1E3A8A',
  
      surface: '#DBEAFE',
      onSurface: '#1E40AF',
  
      secondary: '#93C5FD',
      onSecondary: '#1D4ED8',
  
      primaryContainer: '#BFDBFE'
    }
  }

  export const PeachCreamTheme = {
    dark: false,
    name: ThemeNames.PEACH_CREAM,
    colors: {
      ...MD3LightTheme.colors,
  
      primary: '#FFA07A',         
      background: '#FFF9F5',
      onBackground: '#6B4F4F',
  
      surface: '#FFE5D9',
      onSurface: '#8B5E3C',
  
      secondary: '#FAD6BF',
      onSecondary: '#5C4033',
  
      primaryContainer: '#FFD1B3'
    }
  }

  export const CyberpunkTheme = {
    dark: true,
    name: ThemeNames.CYBERPUNK,
    colors: {
      ...MD3DarkTheme.colors,
  
      primary: '#F72585',       
      background: '#1B1B2F',     
      onBackground: '#E0E0E0',
  
      surface: '#3A0CA3',
      onSurface: '#F1FAEE',
  
      secondary: '#7209B7',       
      onSecondary: '#FFBE0B',
  
      primaryContainer: '#4361EE'
    }
  }

export const themes = {
    [ThemeNames.LIGHT]: NewLightTheme,
    [ThemeNames.DARK]: NewDarkTheme,
    [ThemeNames.PASTEL]: PastelTheme,
    [ThemeNames.DEEP_BLUE]: DeepBlueTheme,
    [ThemeNames.FOREST]: ForestTheme,
    [ThemeNames.SUNSET]: SunsetTheme,
    [ThemeNames.MONO_DARK]: MonoDarkTheme,
    [ThemeNames.ICY_BLUE]: IcyBlueTheme,
    [ThemeNames.PEACH_CREAM]: PeachCreamTheme,
    [ThemeNames.CYBERPUNK]: CyberpunkTheme,
};

export const themesForDB = [
    {
        title: "Light",
        name: ThemeNames.LIGHT,
        primary: '#333333',
        secondary: '#D6D6D6',
        surface: "#BDBDBD",
        onSurface: "#696969",
        background: "#F2F2F2",
        price: 0
    },
    {
        title: "Dark",
        name: ThemeNames.DARK,
        primary: '#F2F2F2',
        secondary: '#4F4F4F',
        surface: "#696969",
        onSurface: "#BDBDBD",
        background: "#333333",
        price: 0
    },
    {
        title: "Soft Pastel",
        name: ThemeNames.PASTEL,
        primary: '#A78BFA',
        secondary: '#FBCFE8',
        surface: "#E9D5FF",
        onSurface: "#6B21A8",
        background: "#FAF5FF",
        price: 30
    },
    {
        title: "Midnight Ocean",
        name: ThemeNames.DEEP_BLUE,
        primary: '#60A5FA',
        secondary: '#475569',
        surface: "#1E293B",
        onSurface: "#CBD5E1",
        background: "#0A0E1A",
        price: 30
    },
    {
        title: "Forest Mist",
        name: ThemeNames.FOREST,
        primary: '#2F855A',
        secondary: '#9AE6B4',
        surface: "#C6F6D5",
        onSurface: "#22543D",
        background: "#F0FFF4",
        price: 30
    },
    {
        title: "Sunset Glow",
        name: ThemeNames.SUNSET,
        primary: '#FF6B6B',
        secondary: '#FFB26B',
        surface: "#FFE3D3",
        onSurface: "#B45151",
        background: "#FFF5E5",
        price: 45
    },
    {
        title: "Mono Chrome",
        name: ThemeNames.MONO_DARK,
        primary: '#BDBDBD',
        secondary: '#2F2F2F',
        surface: "#1F1F1F",
        onSurface: "#CFCFCF",
        background: "#121212",
        price: 20
    },
    {
        title: "Frost Blue",
        name: ThemeNames.ICY_BLUE,
        primary: '#3B82F6',
        secondary: '#93C5FD',
        surface: "#DBEAFE",
        onSurface: "#1E40AF",
        background: "#F0F9FF",
        price: 35
    },
    {
        title: "Peach Cream",
        name: ThemeNames.PEACH_CREAM,
        primary: '#FFA07A',
        secondary: '#FAD6BF',
        surface: "#FFE5D9",
        onSurface: "#8B5E3C",
        background: "#FFF9F5",
        price: 40
    },
    {
        title: "Cyber Neon",
        name: ThemeNames.CYBERPUNK,
        primary: '#F72585',
        secondary: '#7209B7',
        surface: "#3A0CA3",
        onSurface: "#F1FAEE",
        background: "#1B1B2F",
        price: 35
    },
]

