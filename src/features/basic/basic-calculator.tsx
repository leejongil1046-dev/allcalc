import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { calculateExpression } from "../../features/basic/calculator-expression";

const buttons = [
  ["AC", "⌫", "", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "+"],
  ["0", ".", "", "="],
];

const operators = ["+", "-", "×", "÷"];

export default function BasicCalculator() {
  const [expression, setExpression] = useState("");
  const [previousExpression, setPreviousExpression] = useState("");

  const result = useMemo(() => {
    if (!expression) {
      return 0;
    }

    const lastCharacter = expression.at(-1);

    if (lastCharacter && operators.includes(lastCharacter)) {
      return null;
    }

    return calculateExpression(expression);
  }, [expression]);

  const handlePress = (value: string) => {
    if (!value) {
      return;
    }

    if (value === "AC") {
      setExpression("");
      setPreviousExpression("");
      return;
    }

    if (value === "⌫") {
      setExpression((current) => current.slice(0, -1));
      return;
    }

    if (value === "=") {
      const calculated = calculateExpression(expression);

      if (calculated === null) {
        return;
      }

      setPreviousExpression(expression);
      setExpression(String(calculated));

      return;
    }

    if (operators.includes(value)) {
      setExpression((current) => {
        if (!current) {
          return current;
        }

        const lastCharacter = current.at(-1);

        if (lastCharacter && operators.includes(lastCharacter)) {
          return `${current.slice(0, -1)}${value}`;
        }

        return `${current}${value}`;
      });

      return;
    }

    if (value === ".") {
      setExpression((current) => {
        const currentNumber = current.split(/[+\-×÷]/).at(-1) ?? "";

        if (currentNumber.includes(".")) {
          return current;
        }

        if (!currentNumber) {
          return `${current}0.`;
        }

        return `${current}.`;
      });

      return;
    }

    setExpression((current) => `${current}${value}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.display}>
        <Text style={styles.expression}>
          {previousExpression || expression}
        </Text>

        <Text numberOfLines={1} adjustsFontSizeToFit style={styles.result}>
          {(result ?? expression) || "0"}
        </Text>
      </View>

      <View style={styles.keypad}>
        {buttons.flat().map((button, index) => {
          if (!button) {
            return <View key={index} style={styles.button} />;
          }

          const isOperator = operators.includes(button) || button === "=";

          return (
            <Pressable
              key={`${button}-${index}`}
              style={[styles.button, isOperator && styles.operatorButton]}
              onPress={() => handlePress(button)}
            >
              <Text style={styles.buttonText}>{button}</Text>
            </Pressable>
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
  },

  expression: {
    fontSize: 20,
    opacity: 0.5,
    marginBottom: 8,
  },

  result: {
    width: "100%",
    textAlign: "right",
    fontSize: 48,
    fontWeight: "500",
  },

  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  button: {
    width: "25%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  operatorButton: {
    opacity: 0.7,
  },

  buttonText: {
    fontSize: 26,
    fontWeight: "500",
  },
});
