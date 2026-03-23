import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

interface Props {
  current: number;
  total: number;
  labels: string[];
}

export function StepIndicator({ current, total, labels }: Props) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }, (_, i) => (
        <React.Fragment key={i}>
          <View style={styles.step}>
            <View style={[styles.dot, i + 1 <= current && styles.dotActive]}>
              <Text style={[styles.dotLabel, i + 1 <= current && styles.dotLabelActive]}>
                {i + 1}
              </Text>
            </View>
            <Text style={[styles.label, i + 1 === current && styles.labelActive]}>
              {labels[i]}
            </Text>
          </View>
          {i < total - 1 && (
            <View style={[styles.line, i + 1 < current && styles.lineActive]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 16 },
  step: { alignItems: "center", gap: 4 },
  dot: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.border.default, alignItems: "center", justifyContent: "center" },
  dotActive: { backgroundColor: Colors.action.primary },
  dotLabel: { fontSize: 12, fontWeight: "700", color: Colors.text.disabled },
  dotLabelActive: { color: "#fff" },
  label: { fontSize: 10, color: Colors.text.disabled, fontWeight: "500" },
  labelActive: { color: Colors.action.primary },
  line: { flex: 1, height: 2, backgroundColor: Colors.border.default, marginBottom: 14 },
  lineActive: { backgroundColor: Colors.action.primary },
});
