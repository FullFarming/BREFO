import React from "react";
import { View, ViewStyle, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { Colors } from "@/constants/colors";

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  topBorderColor?: string; // Teal 또는 Amber 액센트
  intensity?: number;       // blur 강도 0~100, 기본 60
}

export function GlassCard({
  children,
  style,
  topBorderColor,
  intensity = 60,
}: GlassCardProps) {
  return (
    <View style={[styles.wrapper, topBorderColor && { borderTopColor: topBorderColor, borderTopWidth: 2 }, style]}>
      <BlurView intensity={intensity} style={StyleSheet.absoluteFill} tint="light" />
      <View style={styles.overlay}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border.glass,
    shadowColor: Colors.action.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  overlay: {
    backgroundColor: Colors.bg.glass,
    padding: 16,
  },
});
