import { SafeAreaView, Text, View } from "react-native";
import { useTheme } from "react-native-paper";
import ArrowIcon from "../icons/down-arrow.svg";

export const CustomAddTaskHeader = () => {
    const theme = useTheme();
    
    return (
        <SafeAreaView>
            <View style={{padding: 16, backgroundColor: theme.colors.background, shadowOpacity: .15, shadowOffset: {width: 0, height: 3}, shadowRadius: 2, shadowColor: 'black', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                    <ArrowIcon width={12} height={12} color={theme.colors.primary} style={{transform: [{rotate: '90deg'}]}} />
                    <Text style={{fontSize: 14, fontFamily: "Nunito Sans", fontWeight: 600, color: theme.colors.primary}}>Back</Text>
                </View>
                <Text style={{fontSize: 14, fontFamily: "Nunito Sans", fontWeight: 600, color: theme.colors.primary}}>Add task</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 4, opacity: 0}}>
                    <ArrowIcon width={12} height={12} color={theme.colors.primary} style={{transform: [{rotate: '90deg'}]}} />
                    <Text style={{fontSize: 14, fontFamily: "Nunito Sans", fontWeight: 600, color: theme.colors.primary}}>Back</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}