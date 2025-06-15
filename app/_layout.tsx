import { initDB } from "@/db/initDB";
import { Stack } from "expo-router";
import { useEffect } from "react";
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
    <PaperProvider theme={theme}>
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="addTask" options={{title: "Add task" ,headerShown: true, headerBackTitle: "Back"}} />
      </Stack>
    </PaperProvider>
  );
}
