import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Platform, StatusBar, StyleSheet, Text } from "react-native";

export default function Header() {
  return (
    <LinearGradient
      style={styles.headerContainer}
      colors={["#EAE7F0", "#FFFFFF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <Text style={styles.headerText}>Registration Form</Text>
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
    shadowColor: "#B8B5C9",
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
    color: "#6B46C1",
    textAlign: "center",
    letterSpacing: 1,
    textShadowColor: "rgba(107, 70, 193, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
