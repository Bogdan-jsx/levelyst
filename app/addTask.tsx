import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native";
import { Text } from "react-native-paper";

export default function AddTask() {
    const {type} = useLocalSearchParams()

    return (
        <SafeAreaView>
            <Text  variant={'labelLarge'}>Hello world, its adding {type} task</Text>
        </SafeAreaView>
    )
}