import React, { useState, useRef } from "react";
import {
  View, Text, FlatList, Dimensions, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert,
} from "react-native";
import { signInWithGoogle } from "@/lib/auth";
import { Colors } from "@/constants/colors";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    title: "미팅 전 5분,\n완벽한 준비",
    desc: "상대방의 최신 뉴스와 취향을\nAI가 자동으로 정리해 드립니다.",
  },
  {
    id: "2",
    title: "관계의 맥락을\n기억합니다",
    desc: "이전 미팅, 식사, 나눈 대화를\n모두 기록하고 연결합니다.",
  },
  {
    id: "3",
    title: "시작할 준비가\n되셨나요?",
    desc: "Google 계정으로 로그인하면\n바로 사용할 수 있습니다.",
    isCTA: true,
  },
];

export default function Onboarding() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      Alert.alert("로그인 실패", "다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
            {item.isCTA && (
              <TouchableOpacity
                onPress={handleGoogleLogin}
                disabled={loading}
                style={styles.googleBtn}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.googleLabel}>Google로 시작하기</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      {/* 페이지 인디케이터 */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, { backgroundColor: i === activeIndex ? Colors.action.primary : Colors.border.default }]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg.default },
  slide: { flex: 1, justifyContent: "center", paddingHorizontal: 32, gap: 16 },
  title: { fontSize: 28, fontWeight: "700", color: Colors.text.primary, lineHeight: 38 },
  desc: { fontSize: 15, color: Colors.text.secondary, lineHeight: 24 },
  googleBtn: { marginTop: 24, backgroundColor: Colors.action.primary, paddingVertical: 16, borderRadius: 14, alignItems: "center" },
  googleLabel: { color: "#fff", fontSize: 16, fontWeight: "700" },
  dots: { flexDirection: "row", justifyContent: "center", gap: 6, paddingBottom: 48 },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
