import React from "react";
import { View, ViewStyle } from "react-native";

interface BentoGridProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface BentoCellProps {
  children: React.ReactNode;
  full?: boolean; // full-width 셀
  style?: ViewStyle;
}

export function BentoGrid({ children, style }: BentoGridProps) {
  return (
    <View style={[{ flexDirection: "row", flexWrap: "wrap", gap: 8 }, style]}>
      {children}
    </View>
  );
}

export function BentoCell({ children, full, style }: BentoCellProps) {
  return (
    <View style={[{ width: full ? "100%" : "48.5%" }, style]}>
      {children}
    </View>
  );
}
