import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { calculateExpression } from "./calculator-expression";

const buttons = [
  ["⌫", "AC", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["±", "0", ".", "="],
];

const operators = ["+", "−", "×", "÷", "%"];

export default function BasicCalculator() {
  const insets = useSafeAreaInsets();

  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [isCalculated, setIsCalculated] = useState(false);

  const toggleSign = () => {
    if (!expression) {
      return;
    }

    const negativeMatch = expression.match(/\(-(\d+(?:\.\d+)?)\)$/);

    if (negativeMatch) {
      setExpression(
        `${expression.slice(0, negativeMatch.index)}${negativeMatch[1]}`,
      );
      return;
    }

    const numberMatch = expression.match(/(\d+(?:\.\d+)?)$/);

    if (!numberMatch) {
      return;
    }

    setExpression(
      `${expression.slice(0, numberMatch.index)}(-${numberMatch[1]})`,
    );
  };

  const handlePress = (value: string) => {
    if (!value) {
      return;
    }

    if (value === "AC") {
      setExpression("");
      setResult("");
      setIsCalculated(false);

      return;
    }

    if (value === "⌫") {
      if (isCalculated) {
        setExpression(result);
        setIsCalculated(false);
      }

      setExpression((current) => current.slice(0, -1));

      return;
    }

    const removeTrailingDecimal = (value: string) => {
      return value.endsWith(".") ? value.slice(0, -1) : value;
    };

    if (value === "=") {
      if (!expression || isCalculated) {
        return;
      }

      const normalizedExpression = removeTrailingDecimal(expression);

      const lastCharacter = normalizedExpression.at(-1);

      if (lastCharacter && operators.includes(lastCharacter)) {
        return;
      }

      const calculated = calculateExpression(normalizedExpression);

      if (calculated === null) {
        return;
      }

      setExpression(normalizedExpression);
      setResult(String(calculated));
      setIsCalculated(true);

      return;
    }

    if (operators.includes(value)) {
      if (isCalculated) {
        setExpression(`${result}${value}`);
        setResult("");
        setIsCalculated(false);

        return;
      }

      if (!expression) {
        return;
      }

      const normalizedExpression = removeTrailingDecimal(expression);

      const lastCharacter = normalizedExpression.at(-1);

      if (lastCharacter && operators.includes(lastCharacter)) {
        setExpression(`${normalizedExpression.slice(0, -1)}${value}`);

        return;
      }

      setExpression(`${normalizedExpression}${value}`);

      return;
    }

    const currentNumber = expression.split(/[+−×÷%]/).at(-1) ?? "";

    if (value === ".") {
      if (isCalculated) {
        setExpression("0.");
        setResult("");
        setIsCalculated(false);

        return;
      }

      if (currentNumber.includes(".")) {
        return;
      }

      if (!currentNumber) {
        setExpression((current) => `${current}0.`);

        return;
      }

      setExpression((current) => `${current}.`);

      return;
    }

    if (value === "±") {
      toggleSign();
      return;
    }

    if (isCalculated) {
      setExpression(value);
      setResult("");
      setIsCalculated(false);

      return;
    }

    const negativeMatch = expression.match(/\(-(\d+(?:\.\d+)?)\)$/);

    if (negativeMatch) {
      setExpression(
        `${expression.slice(0, negativeMatch.index)}(-${negativeMatch[1]}${value})`,
      );

      return;
    }

    if (currentNumber === "0" && value === "0") {
      return;
    }

    if (currentNumber === "0") {
      setExpression(`${expression.slice(0, -1)}${value}`);

      return;
    }

    setExpression((current) => `${current}${value}`);
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.display}>
        <Text style={styles.expression}>{isCalculated ? expression : ""}</Text>
        <Text numberOfLines={1} adjustsFontSizeToFit style={styles.result}>
          {isCalculated ? result : expression || "0"}
        </Text>
      </View>

      <View style={styles.keypad}>
        {buttons.flat().map((button, index) => {
          if (!button) {
            return (
              <View key={`empty-${index}`} style={styles.buttonContainer}>
                <View style={styles.button} />
              </View>
            );
          }

          const isOperator = operators.includes(button) || button === "=";

          return (
            <View key={`${button}-${index}`} style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, isOperator && styles.operatorButton]}
                onPress={() => handlePress(button)}
              >
                <Text style={styles.buttonText}>{button}</Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  display: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingBottom: 24,
    borderWidth: 1,
    borderColor: "red",
    // backgroundColor: "green",
  },

  expression: {
    minHeight: 28,
    marginBottom: 8,
    fontSize: 20,
    opacity: 0.5,
  },

  result: {
    width: "100%",
    textAlign: "right",
    fontSize: 48,
    fontWeight: "500",
  },

  keypad: {
    flexDirection: "row",
    alignItems: "flex-end",
    flexWrap: "wrap",
    // backgroundColor: "purple",
  },
  buttonContainer: {
    width: "25%",
    aspectRatio: 1,
    padding: 3,
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 9999,
  },
  operatorButton: {
    opacity: 0.7,
  },

  buttonText: {
    fontSize: 26,
    fontWeight: "500",
  },
});
