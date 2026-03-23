import React, { useEffect, useRef } from "react";
import { Animated, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

interface ToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
}

export function Toast({ message, visible, onHide }: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.delay(2500),
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => onHide());
    }
  }, [visible]);

  if (!visible) return null;
  return (
    <Animated.View style={[styles.toast, { opacity }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute", bottom: 90, alignSelf: "center",
    backgroundColor: Colors.action.secondary, paddingVertical: 10,
    paddingHorizontal: 20, borderRadius: 24,
  },
  text: { color: "#fff", fontSize: 13, fontWeight: "500" },
});
