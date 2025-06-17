import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

export enum ThemeNames {
    LIGHT = 'light',
    DARK = 'dark',
    DARK_BLUE_GRAY = 'darkBlueGray',
    LIGHT_OLIVE = 'lightOlive',
    TERMINAL = 'terminal'
}

const LightMinimalisticTheme = {
    dark: false,
    colors: {
        ...MD3LightTheme.colors,
        
        primary: '#000000',
        onPrimary: '#FFFFFF',

        background: '#FFFFFF',
        onBackground: '#000000',

        surface: '#F5F5F5',
        onSurface: '#000000',

        outline: '#D0D0D0',

        secondary: '#808080',
        onSecondary: '#FFFFFF',

        error: '#FF0000',
        onError: '#FFFFFF',

        primaryContainer: '#000000',
        onPrimaryContainer: '#FFFFFF',

        secondaryContainer: '#808080',
        onSecondaryContainer: '#FFFFFF',

        surfaceVariant: '#E0E0E0',
        onSurfaceVariant: '#000000',
    },
};

const DarkMinimalisticTheme = {
    dark: true,
    colors: {
        ...MD3DarkTheme.colors,

        primary: '#FFFFFF',
        onPrimary: '#000000',

        background: '#000000',
        onBackground: '#FFFFFF',

        surface: '#121212',
        onSurface: '#FFFFFF',

        outline: '#404040',

        secondary: '#AAAAAA',
        onSecondary: '#000000',

        error: '#FF6B6B',
        onError: '#000000',

        primaryContainer: '#FFFFFF',
        onPrimaryContainer: '#000000',

        secondaryContainer: '#AAAAAA',
        onSecondaryContainer: '#000000',

        surfaceVariant: '#1E1E1E',
        onSurfaceVariant: '#FFFFFF',
    },
};

const DarkBlueGrayTheme = {
    dark: true,
    colors: {
        ...MD3DarkTheme.colors,

        primary: '#90CAF9',   
        onPrimary: '#000000',

        background: '#121212',
        onBackground: '#FFFFFF',

        surface: '#1E1E1E',
        onSurface: '#FFFFFF',

        outline: '#444444',

        secondary: '#B0BEC5',  
        onSecondary: '#000000',

        error: '#CF6679',
        onError: '#000000',

        primaryContainer: '#1565C0',
        onPrimaryContainer: '#FFFFFF',

        secondaryContainer: '#78909C',
        onSecondaryContainer: '#FFFFFF',

        surfaceVariant: '#2C2C2C',
        onSurfaceVariant: '#FFFFFF',
    },
};

const LightOliveTheme = {
    dark: false,
    colors: {
        ...MD3LightTheme.colors,

        primary: '#6B8E23',              
        onPrimary: '#FFFFFF',

        background: '#FAFAFA',
        onBackground: '#000000',

        surface: '#FFFFFF',
        onSurface: '#000000',

        outline: '#C0C0C0',

        secondary: '#B8860B',           
        onSecondary: '#FFFFFF',

        error: '#FF0000',
        onError: '#FFFFFF',

        primaryContainer: '#556B2F',
        onPrimaryContainer: '#FFFFFF',

        secondaryContainer: '#DAA520',
        onSecondaryContainer: '#000000',

        surfaceVariant: '#F0F0F0',
        onSurfaceVariant: '#000000',
    },
};

const TerminalBlackYellowTheme = {
    dark: true,
    colors: {
        ...MD3DarkTheme.colors,

        primary: '#FFD700',         
        onPrimary: '#000000',

        background: '#000000',
        onBackground: '#FFD700',

        surface: '#121212',
        onSurface: '#FFD700',

        outline: '#444444',

        secondary: '#FFA500',       
        onSecondary: '#000000',

        error: '#FF3030',
        onError: '#000000',

        primaryContainer: '#FFD700',
        onPrimaryContainer: '#000000',

        secondaryContainer: '#FFA500',
        onSecondaryContainer: '#000000',

        surfaceVariant: '#1C1C1C',
        onSurfaceVariant: '#FFD700',
    },
};




export const themes = {
    [ThemeNames.LIGHT]: LightMinimalisticTheme,
    [ThemeNames.DARK]: DarkMinimalisticTheme,
    [ThemeNames.DARK_BLUE_GRAY]: DarkBlueGrayTheme,
    [ThemeNames.LIGHT_OLIVE]: LightOliveTheme,
    [ThemeNames.TERMINAL]: TerminalBlackYellowTheme,
};

export const themesForDB = [
    {
        title: "Light",
        name: ThemeNames.LIGHT,
        main_color_to_display: '#FFFFFF',
        secondary_color_to_display: '#808080',
        last_color_to_display: "#000000",
        price: 0
    },
    {
        title: "Dark",
        name: ThemeNames.DARK,
        main_color_to_display: '#000000',
        secondary_color_to_display: '#AAAAAA',
        last_color_to_display: "#FFFFFF",
        price: 0
    },
    {
        title: "Dark Blue Gray",
        name: ThemeNames.DARK_BLUE_GRAY,
        main_color_to_display: '#121212',
        secondary_color_to_display: '#B0BEC5',
        last_color_to_display: "#FFFFFF",
        price: 30
    },
    {
        title: "Light Olive",
        name: ThemeNames.LIGHT_OLIVE,
        main_color_to_display: '#FAFAFA',
        secondary_color_to_display: '#B8860B',
        last_color_to_display: "#000000",
        price: 40
    },
    {
        title: "Terminal Black & Yellow",
        name: ThemeNames.TERMINAL,
        main_color_to_display: '#000000',
        secondary_color_to_display: '#FFA500',
        last_color_to_display: "#FFD700",
        price: 60
    }
]

