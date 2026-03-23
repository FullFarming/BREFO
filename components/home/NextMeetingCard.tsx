import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Meeting } from "@/types";
import { Colors } from "@/constants/colors";

interface Props {
  meeting: Meeting | null;
  onBriefPress: () => void;
}

export function NextMeetingCard({ meeting, onBriefPress }: Props) {
  if (!meeting) {
    return (
      <GlassCard style={styles.card}>
        <Text style={styles.label}>다음 미팅</Text>
        <Text style={styles.empty}>오늘 예정된 미팅이 없습니다</Text>
      </GlassCard>
    );
  }

  const time = new Date(meeting.scheduled_at).toLocaleTimeString("ko-KR", {
    hour: "2-digit", minute: "2-digit",
  });
  const briefStatus = meeting.brief?.status ?? "pending";

  return (
    <GlassCard style={styles.card} topBorderColor={Colors.action.primary}>
      <Text style={styles.label}>다음 미팅</Text>
      <Text style={styles.title}>{meeting.title ?? "미팅"}</Text>
      <Text style={styles.meta}>{time} · {meeting.location ?? "장소 미정"}</Text>
      <Badge
        status={briefStatus as "ready" | "pending" | "failed"}
        onPress={briefStatus === "ready" ? onBriefPress : undefined}
      />
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 16 },
  label: { fontSize: 11, fontWeight: "700", color: Colors.text.disabled, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6 },
  title: { fontSize: 17, fontWeight: "600", color: Colors.text.primary, marginBottom: 4 },
  meta: { fontSize: 13, color: Colors.text.secondary, marginBottom: 10 },
  empty: { fontSize: 15, color: Colors.text.secondary, marginTop: 4 },
});
