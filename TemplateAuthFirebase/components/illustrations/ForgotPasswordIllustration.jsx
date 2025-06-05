import React from "react";
import { View, StyleSheet } from "react-native";

const ForgotPasswordIllustration = ({ width = 280, height = 200, style }) => {
  return (
    <View style={[styles.container, style, { width, height }]}>
      <View style={styles.illustration}>
        <View style={styles.bgCircle} />
        <View style={styles.keyIcon}>
          <View style={styles.keyHead} />
          <View style={styles.keyBody} />
          <View style={styles.keyTeeth1} />
          <View style={styles.keyTeeth2} />
        </View>
        <View style={styles.questionMark} />
        <View style={styles.envelope} />
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
  bgCircle: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#F59E0B",
    opacity: 0.1,
  },
  keyIcon: {
    position: "relative",
  },
  keyHead: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 8,
    borderColor: "#007AFF",
    backgroundColor: "transparent",
  },
  keyBody: {
    width: 8,
    height: 50,
    backgroundColor: "#007AFF",
    marginLeft: 16,
    marginTop: -4,
  },
  keyTeeth1: {
    position: "absolute",
    width: 12,
    height: 6,
    backgroundColor: "#007AFF",
    bottom: 15,
    right: -4,
  },
  keyTeeth2: {
    position: "absolute",
    width: 8,
    height: 6,
    backgroundColor: "#007AFF",
    bottom: 8,
    right: -4,
  },
  questionMark: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#EF4444",
    top: 30,
    right: 50,
  },
  envelope: {
    position: "absolute",
    width: 30,
    height: 20,
    backgroundColor: "#10B981",
    borderRadius: 4,
    bottom: 40,
    left: 60,
  },
});

export default ForgotPasswordIllustration;
