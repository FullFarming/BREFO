import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTodayMeetings } from "@/hooks/useMeetings";
import { NextMeetingCard } from "@/components/home/NextMeetingCard";
import { BriefStatusCard } from "@/components/home/BriefStatusCard";
import { BentoGrid, BentoCell } from "@/components/ui/BentoGrid";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";
import { Toast } from "@/components/ui/Toast";
import { Colors } from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";

export default function HomeScreen() {
  const router = useRouter();
  const { session } = useAuthStore();
  const { data: meetings, isLoading } = useTodayMeetings();
  const [toastVisible, setToastVisible] = useState(false);

  const nextMeeting = meetings?.[0] ?? null;
  const readyCount = meetings?.filter((m) => m.brief?.status === "ready").length ?? 0;

  const userName = session?.user?.user_metadata?.full_name?.split(" ")[0] ?? "사용자";

  const handleBriefPress = () => {
    // V1: 토스트 표시 (브리핑 화면은 V2)
    setToastVisible(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* 인사말 */}
        <View style={styles.header}>
          <Text style={styles.greeting}>안녕하세요,</Text>
          <Text style={styles.name}>{userName} 님</Text>
        </View>

        {/* 다음 미팅 카드 (full-width) */}
        {isLoading ? (
          <SkeletonLoader height={120} style={{ marginHorizontal: 16, borderRadius: 16 }} />
        ) : (
          <NextMeetingCard meeting={nextMeeting} onBriefPress={handleBriefPress} />
        )}

        {/* Bento Grid */}
        <BentoGrid style={styles.bento}>
          <BentoCell>
            {isLoading ? (
              <SkeletonLoader height={90} borderRadius={12} />
            ) : (
              <BriefStatusCard readyCount={readyCount} totalCount={meetings?.length ?? 0} />
            )}
          </BentoCell>
          <BentoCell>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/contacts")}
              style={styles.quickAction}
            >
              <Text style={styles.quickIcon}>👥</Text>
              <Text style={styles.quickLabel}>연락처</Text>
            </TouchableOpacity>
          </BentoCell>
        </BentoGrid>
      </ScrollView>

      {/* 미팅 생성 FAB */}
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/meetings/create")}
        style={styles.fab}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <Toast
        message="브리핑이 준비되었습니다. 다음 업데이트에서 전체 내용을 확인하실 수 있습니다."
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg.subtle },
  scroll: { paddingTop: 60, paddingBottom: 100, gap: 12 },
  header: { paddingHorizontal: 20, marginBottom: 4 },
  greeting: { fontSize: 14, color: Colors.text.secondary },
  name: { fontSize: 24, fontWeight: "700", color: Colors.text.primary },
  bento: { marginHorizontal: 16 },
  quickAction: {
    backgroundColor: Colors.bg.glass,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    height: 90,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  quickIcon: { fontSize: 24, marginBottom: 4 },
  quickLabel: { fontSize: 12, fontWeight: "600", color: Colors.text.secondary },
  fab: {
    position: "absolute", bottom: 90, right: 20,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.action.primary,
    alignItems: "center", justifyContent: "center",
    shadowColor: Colors.action.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 8,
  },
  fabIcon: { fontSize: 28, color: "#fff", fontWeight: "300", lineHeight: 32 },
});
