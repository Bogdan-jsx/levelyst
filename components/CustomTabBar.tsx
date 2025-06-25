import { Text, View } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProfileIcon from "../icons/profile_icon.svg";
import QuestsIcon from "../icons/quests_icon.svg";
import ShopIcon from "../icons/shop_icon.svg";
import TasksIcon from "../icons/tasks_icon.svg";
import { HapticTab } from "./HapticTab";

const iconsConfig = {
    index: TasksIcon,
    quests: QuestsIcon,
    shop: ShopIcon,
    profile: ProfileIcon,
}

type Name = 'index' | 'quests' | 'shop' | 'profile';

export const CustomTabBar = (props: any) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    
    return (
        <View style={{backgroundColor: theme.colors.secondary, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 16, paddingBottom: insets.bottom, shadowColor: 'rgba(79, 79, 79, .2)', shadowOpacity: 1, shadowRadius: 4, shadowOffset: {width: 0, height: -5}}}>
            {props?.state && props?.state?.routes?.map((route: any, index: number) => {
                const { options } = props?.descriptors[route.key];
                const label =
                  options.tabBarLabel !== undefined
                    ? options.tabBarLabel
                    : options.title !== undefined
                      ? options.title
                      : route.name;
        
                const isFocused = props?.state.index === index;

                const Icon = iconsConfig[route?.name as Name]

                const onPress = () => {
                    const event = props?.navigation.emit({
                      type: 'tabPress',
                      target: route.key,
                      canPreventDefault: true,
                    });
          
                    if (!isFocused && !event.defaultPrevented) {
                      props?.navigation.navigate(route.name);
                    }
                  };

                return (
                    <HapticTab 
                        key={index} 
                        onPress={onPress} 
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                    >
                        <View style={{alignItems: 'center'}}>
                            <Icon width={24} height={24} color={isFocused ? theme.colors.primary : theme.colors.onSecondary} />
                            <Text key={index} style={{color: isFocused ? theme.colors.primary : theme.colors.onSurface, fontWeight: isFocused ? 600 : 400, fontSize: 14, fontFamily: 'Nunito Sans'}}>{label}</Text>
                        </View>
                    </HapticTab>
                )
            })}
        </View>
    )
}