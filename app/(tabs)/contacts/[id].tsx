import React, { useState } from "react";
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContact } from "@/hooks/useContacts";
import { supabase } from "@/lib/supabase";
import { GlassCard } from "@/components/ui/GlassCard";
import { TagChip } from "@/components/contacts/TagChip";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";
import { Colors } from "@/constants/colors";
import { useQueryClient } from "@tanstack/react-query";

export default function ContactDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();
  const { data: contact, isLoading } = useContact(id);
  const [memo, setMemo] = useState("");
  const [saving, setSaving] = useState(false);

  // 메모 초기값 설정
  React.useEffect(() => {
    if (contact?.memo) setMemo(contact.memo);
  }, [contact?.memo]);

  const saveMemo = async () => {
    if (!contact) return;
    setSaving(true);
    const { error } = await supabase
      .from("contacts")
      .update({ memo })
      .eq("id", contact.id);
    setSaving(false);
    if (error) Alert.alert("저장 실패");
    else qc.invalidateQueries({ queryKey: ["contacts", id] });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <SkeletonLoader height={24} width={160} style={{ margin: 20 }} />
        <SkeletonLoader height={120} style={{ margin: 16, borderRadius: 16 }} />
      </View>
    );
  }

  if (!contact) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← 뒤로</Text>
        </TouchableOpacity>
        <View style={styles.avatar}>
          <Text style={styles.initials}>{contact.name.slice(0, 1)}</Text>
        </View>
        <Text style={styles.name}>{contact.name}</Text>
        {(contact.position || contact.company) && (
          <Text style={styles.subtitle}>
            {[contact.position, contact.company].filter(Boolean).join(" · ")}
          </Text>
        )}
      </View>

      {/* 기본 정보 */}
      <GlassCard style={styles.card}>
        <Text style={styles.sectionLabel}>기본 정보</Text>
        {contact.phone && <InfoRow label="전화" value={contact.phone} />}
        {contact.email && <InfoRow label="이메일" value={contact.email} />}
      </GlassCard>

      {/* 태그 */}
      {contact.tags && contact.tags.length > 0 && (
        <GlassCard style={styles.card}>
          <Text style={styles.sectionLabel}>태그</Text>
          <View style={styles.tags}>
            {contact.tags.map((t) => (
              <TagChip key={t.id} tag={t.tag} />
            ))}
          </View>
        </GlassCard>
      )}

      {/* 메모 */}
      <GlassCard style={styles.card} topBorderColor={Colors.action.primary}>
        <Text style={styles.sectionLabel}>메모</Text>
        <TextInput
          value={memo}
          onChangeText={setMemo}
          placeholder="관계 메모를 입력하세요..."
          placeholderTextColor={Colors.text.disabled}
          multiline
          style={styles.memoInput}
        />
        <TouchableOpacity
          onPress={saveMemo}
          disabled={saving}
          style={styles.saveBtn}
        >
          <Text style={styles.saveBtnText}>{saving ? "저장 중..." : "저장"}</Text>
        </TouchableOpacity>
      </GlassCard>
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg.subtle },
  scroll: { paddingBottom: 40 },
  header: { alignItems: "center", paddingTop: 60, paddingBottom: 20, backgroundColor: Colors.bg.default },
  back: { position: "absolute", top: 60, left: 16 },
  backText: { fontSize: 15, color: Colors.action.primary },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.action.secondary, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  initials: { fontSize: 28, fontWeight: "700", color: "#fff" },
  name: { fontSize: 22, fontWeight: "700", color: Colors.text.primary },
  subtitle: { fontSize: 14, color: Colors.text.secondary, marginTop: 4 },
  card: { marginHorizontal: 16, marginTop: 12 },
  sectionLabel: { fontSize: 11, fontWeight: "700", color: Colors.text.disabled, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  memoInput: { fontSize: 15, color: Colors.text.primary, minHeight: 80, textAlignVertical: "top", lineHeight: 22 },
  saveBtn: { marginTop: 12, backgroundColor: Colors.action.primary, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  saveBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: Colors.border.default },
  infoLabel: { fontSize: 13, color: Colors.text.secondary },
  infoValue: { fontSize: 13, color: Colors.text.primary, fontWeight: "500" },
});
