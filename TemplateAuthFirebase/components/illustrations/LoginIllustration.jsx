import React from "react";
import { View, StyleSheet } from "react-native";

const LoginIllustration = ({ width = 280, height = 200, style }) => {
  return (
    <View style={[styles.container, style, { width, height }]}>
      <View style={styles.illustration}>
        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <View style={styles.rectangle} />
        <View style={styles.loginIcon}>
          <View style={styles.user} />
          <View style={styles.body} />
        </View>
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
  circle1: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#007AFF",
    opacity: 0.1,
    top: 20,
    left: 20,
  },
  circle2: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#5856D6",
    opacity: 0.15,
    bottom: 30,
    right: 30,
  },
  rectangle: {
    position: "absolute",
    width: 180,
    height: 120,
    borderRadius: 12,
    backgroundColor: "#F8F9FA",
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  loginIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  user: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    marginBottom: 8,
  },
  body: {
    width: 60,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#007AFF",
  },
});

export default LoginIllustration;
