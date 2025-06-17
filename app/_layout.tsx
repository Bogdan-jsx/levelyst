import { initDB } from "@/db/initDB";
import { ThemeProvider, useAppTheme } from "@/theme/ThemeContext";
import { themes } from "@/theme/themesConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect } from "react";
import { MD3LightTheme, PaperProvider } from "react-native-paper";

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: 'black',     // цвет активной кнопки
    secondary: '#03dac6',   // доп. акцент
    background: '#f6f6f6',  // фон
    surface: '#ffffff',
    onSurface: '#000000',
    surfaceVariant: '#e3e3e3'
  },
};

export default function RootLayout() {
  useEffect(() => {
    initDB();
  }, [])

  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

const MainApp = () => {
  const {themeName, changeThemeName} = useAppTheme();

  const theme = themes[themeName as 'light' | 'dark'];

  const fetchTheme = useCallback(async () => {
    const storedThemeName = await AsyncStorage.getItem('theme');
    if (!storedThemeName) {
      await AsyncStorage.setItem("theme", 'light');
    } else {
      changeThemeName(storedThemeName);
    }
  }, [changeThemeName])

  useEffect(() => {
    fetchTheme();
  }, [fetchTheme])

  return (
    <PaperProvider theme={theme}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} backgroundColor={theme.colors.background} />
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="addTask" options={{title: "Add task" ,headerShown: true, headerBackTitle: "Back", headerTintColor: theme.colors.onBackground, headerStyle: {backgroundColor: theme.colors.background},}} />
      </Stack>
    </PaperProvider>
  )
}
