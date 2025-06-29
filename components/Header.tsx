import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Platform, StatusBar, StyleSheet, Text } from "react-native";

export default function Header() {
  return (
    <LinearGradient
      style={styles.headerContainer}
      colors={["#8B5CF6", "#6B46C1"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.headerText}>Forms</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop:
      Platform.OS === "ios"
        ? 50
        : StatusBar.currentHeight
        ? StatusBar.currentHeight + 20
        : 44,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "flex-end",
    shadowColor: "#6B46C1",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    letterSpacing: 1,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
