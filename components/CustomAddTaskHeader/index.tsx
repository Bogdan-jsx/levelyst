import { useRouter } from "expo-router";
import { Platform } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ArrowIcon from "../../icons/down-arrow.svg";
import { RegularTextBold } from "../commonStyles";
import { HeaderButton, HeaderContainer, HeaderWrapper, HiddenHeaderButton } from "./CustomAddTaskHeader.styled";

export const CustomAddTaskHeader = () => {
    const theme = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    
    return (
        <HeaderWrapper marginTop={insets.top + 8}>
            <HeaderContainer bgColor={theme.colors.background} borderColor={theme.colors.secondary} borderWidth={Platform.OS === 'android' ? 2 : 0}>
                <HeaderButton onPress={router.back}>
                    <ArrowIcon width={12} height={12} color={theme.colors.primary} style={{transform: [{rotate: '90deg'}]}} />
                    <RegularTextBold color={theme.colors.primary}>Back</RegularTextBold>
                </HeaderButton>
                <RegularTextBold color={theme.colors.primary}>Add task</RegularTextBold>
                <HiddenHeaderButton>
                    <ArrowIcon width={12} height={12} color={theme.colors.primary} style={{transform: [{rotate: '90deg'}]}} />
                    <RegularTextBold color={theme.colors.primary}>Back</RegularTextBold>
                </HiddenHeaderButton>
            </HeaderContainer>
        </HeaderWrapper>
    )
}