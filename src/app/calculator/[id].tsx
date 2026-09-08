import { Stack, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

import { calculatorRegistry } from "../../features/calculators/calculator-registry";

export default function CalculatorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const calculator = calculatorRegistry[id];

  if (!calculator) {
    return (
      <View>
        <Text>계산기를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  const CalculatorComponent = calculator.component;

  return (
    <>
      <Stack.Screen
        options={{
          title: calculator.title,
        }}
      />

      <CalculatorComponent />
    </>
  );
}
