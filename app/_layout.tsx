import { CustomAddTaskHeader } from "@/components/CustomAddTaskHeader";
import { initDB } from "@/db/initDB";
import { ThemeProvider, useAppTheme } from "@/theme/ThemeContext";
import { ThemeNames, themes } from "@/theme/themesConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
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
  const [fontsLoaded, setFontsLoaded] = useState(false);

  async function loadFonts() {
    await Font.loadAsync({
      'Nunito Sans': require('../assets/fonts/NunitoSans.ttf'),
    });
  }

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);
  
  const {themeName, changeThemeName} = useAppTheme();

  const theme = themes[themeName as ThemeNames];

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

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <PaperProvider theme={theme}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} backgroundColor={theme.colors.background} />
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="(tabs)" />
        {/* <Stack.Screen name="addTask" options={{headerShown: true, sty}} /> */}
        <Stack.Screen name="addTask" options={{header: () => (<CustomAddTaskHeader />), headerShown: true}} />
      </Stack>
    </PaperProvider>
  )
}
