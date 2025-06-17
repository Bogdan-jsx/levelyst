import { getProfile } from "@/db/queries/profile";
import { buyTheme, getThemes } from "@/db/queries/themes";
import { useAppTheme } from "@/theme/ThemeContext";
import { ThemeNames } from "@/theme/themesConfig";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Platform, SafeAreaView, ScrollView, View } from "react-native";
import { Button, Card, Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ShopScreen() {
    const theme = useTheme();
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
            <ScrollView>
                <View style={{padding: 8, gap: 12}}>
                    <Text variant={'titleLarge'}>Coins: {profile?.coins}</Text>
                    <Text variant={'titleLarge'}>Themes: </Text>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12}}>
                        {themes && themes.map((item: any) => (
                            <Card mode={"contained"} style={{width: '48%'}} key={item.id}>
                                <View style={{padding: 8, gap: 4}}>
                                    <View style={{width: '100%', height: 50, marginBottom: 12, flexDirection: 'row'}}> 
                                        <View style={{width: '33.33%', height: "100%", backgroundColor: item.main_color_to_display}} />
                                        <View style={{width: '33.33%', height: "100%", backgroundColor: item.secondary_color_to_display}} />
                                        <View style={{width: '33.33%', height: "100%", backgroundColor: item.last_color_to_display}} />
                                    </View>
                                    <Text variant={'labelLarge'}>{item.title}</Text>
                                    <Text>Price: {item.price} coins</Text>
                                    <Button disabled={shouldDisableBtn(item)} onPress={() => {
                                        if (!item.is_owned) {
                                            if (profile.coins > item.price) {
                                                buyTheme(item.id, item.price);
                                                changeThemeName(item.name as ThemeNames);
                                                fetchData();
                                            }
                                        } else {
                                            changeThemeName(item.name as ThemeNames)
                                        }
                                    }}>{item.is_owned ? themeName === item.name ? "Selected" : "Select" : "Buy"}</Button>
                                </View>
                            </Card>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}