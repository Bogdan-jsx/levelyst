import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProfileIcon from "../../icons/profile_icon.svg";
import QuestsIcon from "../../icons/quests_icon.svg";
import ShopIcon from "../../icons/shop_icon.svg";
import TasksIcon from "../../icons/tasks_icon.svg";
import { RegularTextToggle } from "../commonStyles";
import { HapticTab } from "../HapticTab";
import { TabBarContainer, TabIconPlaceholder, TabItem } from "./CustomTabBar.styled";

const iconsConfig = {
    index: TasksIcon,
    quests: QuestsIcon,
    shop: ShopIcon,
    profile: ProfileIcon,
}

type Name = 'index' | 'quests' | 'shop' | 'profile';

export const CustomTabBar = (props: BottomTabBarProps) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    
    return (
        <TabBarContainer bgColor={theme.colors.secondary} paddingBottom={insets.bottom}>
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
                        <TabItem>
                            {Icon ? (
                                <Icon width={24} height={24} color={isFocused ? theme.colors.primary : theme.colors.onSecondary} />
                            ) : (
                                <TabIconPlaceholder />
                            )}
                            <RegularTextToggle color={isFocused ? theme.colors.primary : theme.colors.onSurface} isBold={isFocused}>{label}</RegularTextToggle>
                        </TabItem>
                    </HapticTab>
                )
            })}
        </TabBarContainer>
    )
}