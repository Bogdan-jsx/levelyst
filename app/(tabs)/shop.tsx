import { getProfile } from "@/db/queries/profile";
import { buyTheme, getThemes } from "@/db/queries/themes";
import { useAppTheme } from "@/theme/ThemeContext";
import { ThemeNames } from "@/theme/themesConfig";
import { useAnimatedTheme } from "@/theme/useAnimatedTheme";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { LayoutAnimation, Platform, SafeAreaView, ScrollView, TouchableOpacity, View } from "react-native";
import { MD3Theme, useTheme } from "react-native-paper";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ShopScreen() {
    const theme = useTheme();
    const styles = useAnimatedTheme((theme as MD3Theme & {name: ThemeNames}).name)
    const insets = useSafeAreaInsets();
    const {themeName, changeThemeName} = useAppTheme();

    const [themes, setThemes] = useState<any[]>([]);
    const [profile, setProfile] = useState<any>();

    const fetchData = useCallback(async () => {
        const result: any = await getThemes();
        setThemes(result)
        const resultProfile: any = await getProfile()
        setProfile(resultProfile);
    }, [])

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData])
    )

    const shouldDisableBtn = useCallback((item: any) => {
        if (item.is_owned && item.name === themeName) return true;
        if (!item.is_owned && profile?.coins < item.price) return true;
        return false;
    }, [profile?.coins, themeName])

    return (
        <SafeAreaView style={{backgroundColor: theme.colors.background, flex: 1, paddingTop: Platform.OS === 'android' ? insets.top + 12 : 0}}>
            <Animated.View style={[{flex: 1}, styles.backgroundBackgroundColor]}>
                <ScrollView>
                    <View style={{paddingVertical: 32}}>
                        <View style={{paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Animated.Text style={[{fontFamily: "Nunito Sans", fontSize: 14}, styles.onBackgroundColor]}>Themes</Animated.Text>
                            <Animated.Text style={[{fontFamily: "Nunito Sans", fontSize: 14, fontWeight: 600, marginLeft: 16}, styles.primaryColor]}>{profile?.coins} coins</Animated.Text>
                        </View>
                        <Animated.View style={[{width: '100%', height: 2, marginTop: 8}, styles.backgroundColorSecondary]} />
                        {themes && themes.map((item) => (
                            <Animated.View key={item.id} style={[{marginTop: 24, width: '100%', paddingHorizontal: 16, gap: 16, flexDirection: 'row'}, styles.backgroundColorSecondary]}>
                                <View style={{flexDirection: 'row'}}>
                                    <View style={{width: 32, height: "100%", backgroundColor: item.primary_color}} />
                                    <View style={{width: 32, height: "100%", backgroundColor: item.surface_color}} />
                                    <View style={{width: 32, height: "100%", backgroundColor: item.secondary_color}} />
                                    <View style={{width: 32, height: "100%", backgroundColor: item.background_color}} />
                                    <View style={{width: 32, height: "100%", backgroundColor: item.on_surface_color}} />
                                </View>
                                <View style={{paddingVertical: 16}}>
                                    <Animated.Text style={[{fontFamily: "Nunito Sans", fontSize: 14}, styles.primaryColor]}>{item.title}</Animated.Text>
                                    <Animated.Text style={[{fontFamily: "Nunito Sans", fontSize: 12, fontWeight: 600, marginTop: 4}, styles.onBackgroundColor]}>{item.price} coins</Animated.Text>
                                    <TouchableOpacity 
                                        style={{marginTop: 16}}
                                        disabled={shouldDisableBtn(item)} 
                                        onPress={() => {
                                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                            if (!item.is_owned) {
                                                if (profile.coins > item.price) {
                                                    buyTheme(item.id, item.price);
                                                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                                    changeThemeName(item.name as ThemeNames);
                                                    fetchData();
                                                }
                                            } else {
                                                changeThemeName(item.name as ThemeNames)
                                            }
                                        }}>
                                        <Animated.Text style={[{fontFamily: "Nunito Sans", fontSize: 12, fontWeight: shouldDisableBtn(item) ? 400 : 600}, shouldDisableBtn(item) ? styles.primaryContainerColor : styles.primaryColor]}>{item.is_owned ? themeName === item.name ? "Selected" : "Select" : "Buy"}</Animated.Text>
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
                        ))}
                    </View>
                </ScrollView>
            </Animated.View>
        </SafeAreaView>
    )
}