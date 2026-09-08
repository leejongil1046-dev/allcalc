import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>다셈</Text>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/calculator/basic")}
      >
        <Text style={styles.buttonText}>기본 계산기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },

  title: {
    marginBottom: 24,
    fontSize: 28,
    fontWeight: "700",
  },

  button: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#eeeeee",
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "600",
  },
});
