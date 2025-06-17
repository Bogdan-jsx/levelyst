import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { ThemeNames } from "./themesConfig";


const ThemeContext = createContext({themeName: 'light'} as any);

export const ThemeProvider = ({children}: {children: ReactNode}) => {
    const [themeName, setThemeName] = useState<ThemeNames>(ThemeNames.LIGHT);

    const changeThemeName = useCallback((newName: ThemeNames) => {
        setThemeName(newName);
        AsyncStorage.setItem('theme', newName);
    }, [])

    return (
        <ThemeContext.Provider value={{themeName, changeThemeName}}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useAppTheme = () => useContext(ThemeContext);