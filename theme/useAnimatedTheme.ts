import { useEffect } from 'react';
import { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { ThemeNames, themes } from '../config/themesConfig';

const themeKeys = Object.keys(themes);

export const useAnimatedTheme = (currentThemeKey: ThemeNames) => {
  const themeIndex = themeKeys.indexOf(currentThemeKey);
  const progress = useSharedValue(themeIndex);

  useEffect(() => {
    progress.value = withTiming(themeIndex, { duration: 500 });
  }, [currentThemeKey, progress, themeIndex]);

  const animatedStyles = {
    backgroundBackgroundColor: useAnimatedStyle(() =>
      ({
        backgroundColor: interpolateColor(
          progress.value,
          themeKeys.map((_, i) => i),
          themeKeys.map((key) => themes[key as ThemeNames].colors.background)
        ),
      })
    ),
    primaryColor: useAnimatedStyle(() =>
      ({
        color: interpolateColor(
          progress.value,
          themeKeys.map((_, i) => i),
          themeKeys.map((key) => themes[key as ThemeNames].colors.primary)
        ),
      })
    ),
    onBackgroundColor: useAnimatedStyle(() =>
        ({
          color: interpolateColor(
            progress.value,
            themeKeys.map((_, i) => i),
            themeKeys.map((key) => themes[key as ThemeNames].colors.onBackground)
          ),
        })
      ),
      backgroundColorSecondary: useAnimatedStyle(() =>
        ({
          backgroundColor: interpolateColor(
            progress.value,
            themeKeys.map((_, i) => i),
            themeKeys.map((key) => themes[key as ThemeNames].colors.secondary)
          ),
        })
      ),
      primaryContainerColor: useAnimatedStyle(() =>
        ({
          color: interpolateColor(
            progress.value,
            themeKeys.map((_, i) => i),
            themeKeys.map((key) => themes[key as ThemeNames].colors.primaryContainer)
          ),
        })
      ),
  };

  return animatedStyles;
};
