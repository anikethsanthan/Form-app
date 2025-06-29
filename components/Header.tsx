import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Platform, StatusBar, StyleSheet, Text, View } from "react-native";

export default function Header() {
  return (
    <View style={styles.headerWrapper}>
      <LinearGradient
        style={styles.headerContainer}
        colors={["#FFFFFF", "#F8FAFC"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <View style={styles.iconCircle}>
              <LinearGradient
                colors={["#667eea", "#764ba2"]}
                style={styles.iconGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.iconText}>📝</Text>
              </LinearGradient>
            </View>
            <Text style={styles.headerText}>Registration Form</Text>
          </View>
        </View>
      </LinearGradient>
      <View style={styles.bottomBorder} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    paddingTop:
      Platform.OS === "ios"
        ? 50
        : StatusBar.currentHeight
        ? StatusBar.currentHeight + 20
        : 44,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    marginRight: 12,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#667eea",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  iconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 18,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Quicksand_Medium",
    color: "#2D3748",
    letterSpacing: 0.5,
  },
  bottomBorder: {
    height: 3,
    backgroundColor: "#667eea",
    shadowColor: "#667eea",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});
