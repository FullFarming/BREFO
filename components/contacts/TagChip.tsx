import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

interface TagChipProps {
  tag: string;
  selected?: boolean;
  onPress?: () => void;
}

export function TagChip({ tag, selected, onPress }: TagChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, selected && styles.selected]}
    >
      <Text style={[styles.label, selected && styles.selectedLabel]}>{tag}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20,
    backgroundColor: Colors.bg.subtle, borderWidth: 1, borderColor: Colors.border.default,
  },
  selected: { backgroundColor: Colors.action.primary, borderColor: Colors.action.primary },
  label: { fontSize: 12, fontWeight: "500", color: Colors.text.secondary },
  selectedLabel: { color: "#fff" },
});
