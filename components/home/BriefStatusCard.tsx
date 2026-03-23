import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { GlassCard } from "@/components/ui/GlassCard";
import { Colors } from "@/constants/colors";

interface Props {
  readyCount: number;
  totalCount: number;
}

export function BriefStatusCard({ readyCount, totalCount }: Props) {
  return (
    <GlassCard style={styles.card}>
      <Text style={styles.label}>브리핑 현황</Text>
      <Text style={styles.value}>{readyCount}<Text style={styles.total}>/{totalCount}</Text></Text>
      <Text style={styles.sub}>준비 완료</Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {},
  label: { fontSize: 11, fontWeight: "700", color: Colors.text.disabled, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4 },
  value: { fontSize: 28, fontWeight: "700", color: Colors.text.primary },
  total: { fontSize: 18, color: Colors.text.secondary },
  sub: { fontSize: 12, color: Colors.text.secondary, marginTop: 2 },
});
