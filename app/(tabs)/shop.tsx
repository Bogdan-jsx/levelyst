import { ThemeNames } from "@/config/themesConfig";
import { getProfile } from "@/db/queries/profile";
import { buyTheme, getThemes } from "@/db/queries/themes";
import { useAppTheme } from "@/theme/ThemeContext";
import { useAnimatedTheme } from "@/theme/useAnimatedTheme";
import { Profile } from "@/types/profile";
import { ThemeItem } from "@/types/themes";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { LayoutAnimation, Platform, ScrollView, StyleSheet } from "react-native";
import { MD3Theme, useTheme } from "react-native-paper";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ShopContainer, ShopHeaderContainer, ThemeButton, ThemeDescriptionContainer, ThemePreviewItem, ThemePreviewWrapper, Wrapper } from "../tabsStyles/shop.styled";

export default function ShopScreen() {
    const theme = useTheme();
    const animatedStyles = useAnimatedTheme((theme as MD3Theme & {name: ThemeNames}).name)
    const insets = useSafeAreaInsets();
    const {themeName, changeThemeName} = useAppTheme();

    const [themes, setThemes] = useState<ThemeItem[]>([]);
    const [profile, setProfile] = useState<Profile | null>();

    const fetchData = useCallback(async () => {
        const result: ThemeItem[] = await getThemes();
        setThemes(result)
        const resultProfile: Profile | null = await getProfile()
        setProfile(resultProfile);
    }, [])

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData])
    )

    const shouldDisableBtn = useCallback((item: ThemeItem) => {
        if (item.is_owned && item.name === themeName) return true;
        if (!item.is_owned && (profile?.coins || 0) < item.price) return true;
        return false;
    }, [profile?.coins, themeName])

    return (
        <Wrapper bgColor={theme.colors.background} paddingTop={Platform.OS === 'android' ? insets.top + 12 : 0}>
            <Animated.View style={[styles.flex, animatedStyles.backgroundBackgroundColor]}>
                <ScrollView>
                    <ShopContainer>
                        <ShopHeaderContainer>
                            <Animated.Text style={[styles.themesText, animatedStyles.onBackgroundColor]}>Themes</Animated.Text>
                            <Animated.Text style={[styles.coinsText, animatedStyles.primaryColor]}>{profile?.coins} coins</Animated.Text>
                        </ShopHeaderContainer>
                        <Animated.View style={[styles.divider, animatedStyles.backgroundColorSecondary]} />
                        {themes && themes.map((item) => (
                            <Animated.View key={item.id} style={[styles.themesContainer, animatedStyles.backgroundColorSecondary]}>
                                <ThemePreviewWrapper>
                                    <ThemePreviewItem bgColor={item.primary_color} />
                                    <ThemePreviewItem bgColor={item.surface_color} />
                                    <ThemePreviewItem bgColor={item.secondary_color} />
                                    <ThemePreviewItem bgColor={item.background_color} />
                                    <ThemePreviewItem bgColor={item.on_surface_color} />
                                </ThemePreviewWrapper>
                                <ThemeDescriptionContainer>
                                    <Animated.Text style={[styles.themesText, animatedStyles.primaryColor]}>{item.title}</Animated.Text>
                                    <Animated.Text style={[styles.priceText, animatedStyles.onBackgroundColor]}>{item.price} coins</Animated.Text>
                                    <ThemeButton 
                                        disabled={shouldDisableBtn(item)} 
                                        onPress={() => {
                                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                            if (!item.is_owned) {
                                                if ((profile?.coins || 0) > item.price) {
                                                    buyTheme(item.id, item.price);
                                                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                                    changeThemeName(item.name as ThemeNames);
                                                    fetchData();
                                                }
                                            } else {
                                                changeThemeName(item.name as ThemeNames)
                                            }
                                        }}>
                                        <Animated.Text style={[{fontFamily: shouldDisableBtn(item) ? "Nunito Sans" : "Nunito Sans Semibold"}, styles.btnText, shouldDisableBtn(item) ? animatedStyles.primaryContainerColor : animatedStyles.primaryColor]}>{item.is_owned ? themeName === item.name ? "Selected" : "Select" : "Buy"}</Animated.Text>
                                    </ThemeButton>
                                </ThemeDescriptionContainer>
                            </Animated.View>
                        ))}
                    </ShopContainer>
                </ScrollView>
            </Animated.View>
        </Wrapper>
    )
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    themesText: {
        fontFamily: "Nunito Sans",
        fontSize: 14,
    },
    coinsText: {
        fontFamily: "Nunito Sans Semibold",
        fontSize: 14,
        marginLeft: 16
    },
    divider: {
        width: "100%",
        height: 2,
        marginTop: 8,
    },
    themesContainer: {
        marginTop: 24,
        width: "100%",
        paddingHorizontal: 16,
        gap: 16,
        flexDirection: 'row',
    },
    priceText: {
        fontFamily: "Nunito Sans", 
        fontSize: 12, 
        fontWeight: 600, 
        marginTop: 4
    },
    btnText: {
        fontSize: 12
    }
})