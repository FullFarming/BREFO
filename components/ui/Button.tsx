import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from "react-native";
import * as Haptics from "expo-haptics";
import { Colors } from "@/constants/colors";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  label, onPress, variant = "primary", loading, disabled, style,
}: ButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const variantStyle = {
    primary: { backgroundColor: Colors.action.primary },
    secondary: { backgroundColor: Colors.action.secondary },
    ghost: { backgroundColor: "transparent", borderWidth: 1, borderColor: Colors.border.default },
  }[variant];

  const textColor = variant === "ghost" ? Colors.text.primary : "#FFFFFF";

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      style={[styles.base, variantStyle, (disabled || loading) && styles.disabled, style]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  disabled: { opacity: 0.5 },
  label: { fontSize: 15, fontWeight: "600" },
});
