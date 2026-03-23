import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/colors";

type BadgeStatus = "ready" | "pending" | "failed";

interface BadgeProps {
  status: BadgeStatus;
  label?: string;
  onPress?: () => void;
}

const STATUS_CONFIG: Record<BadgeStatus, { bg: string; color: string; defaultLabel: string }> = {
  ready:   { bg: "rgba(16,185,129,0.1)",  color: Colors.status.success, defaultLabel: "브리핑 준비됨" },
  pending: { bg: "rgba(14,165,196,0.1)",  color: Colors.action.primary, defaultLabel: "브리핑 생성 중" },
  failed:  { bg: "rgba(239,68,68,0.1)",   color: Colors.status.error,   defaultLabel: "생성 실패" },
};

export function Badge({ status, label, onPress }: BadgeProps) {
  const config = STATUS_CONFIG[status];
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper onPress={onPress} style={[styles.badge, { backgroundColor: config.bg }]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.label, { color: config.color }]}>
        {label ?? config.defaultLabel}
      </Text>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: "row", alignItems: "center", gap: 5, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20, alignSelf: "flex-start" },
  dot: { width: 6, height: 6, borderRadius: 3 },
  label: { fontSize: 12, fontWeight: "600" },
});
