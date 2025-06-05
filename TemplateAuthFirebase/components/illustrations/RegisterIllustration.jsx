import React from "react";
import { View, StyleSheet } from "react-native";

const RegisterIllustration = ({ width = 280, height = 200, style }) => {
  return (
    <View style={[styles.container, style, { width, height }]}>
      <View style={styles.illustration}>
        <View style={styles.bgShape1} />
        <View style={styles.bgShape2} />
        <View style={styles.formCard} />
        <View style={styles.userGroup}>
          <View style={styles.user1} />
          <View style={styles.user2} />
          <View style={styles.user3} />
        </View>
        <View style={styles.plusIcon} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  illustration: {
    width: "100%",
    height: "100%",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  bgShape1: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#10B981",
    opacity: 0.1,
    top: 10,
    right: 20,
  },
  bgShape2: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F59E0B",
    opacity: 0.15,
    bottom: 20,
    left: 25,
  },
  formCard: {
    position: "absolute",
    width: 160,
    height: 100,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  user1: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: "#007AFF",
  },
  user2: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: "#5856D6",
  },
  user3: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: "#10B981",
  },
  plusIcon: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#10B981",
    bottom: 60,
    right: 50,
  },
});

export default RegisterIllustration;
