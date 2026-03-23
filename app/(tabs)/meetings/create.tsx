import React from "react";
import {
  View, Text, ScrollView, TextInput,
  TouchableOpacity, StyleSheet, Alert,
} from "react-native";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMeetingStore } from "@/store/meetingStore";
import { useContacts } from "@/hooks/useContacts";
import { useCreateMeeting } from "@/hooks/useMeetings";
import { apiClient } from "@/lib/api";
import { StepIndicator } from "@/components/meetings/StepIndicator";
import { AttendeeSelector } from "@/components/meetings/AttendeeSelector";
import { Button } from "@/components/ui/Button";
import { Colors } from "@/constants/colors";

const STEP_LABELS = ["참석자", "일시/장소", "메모", "확인"];

export default function CreateMeetingScreen() {
  const router = useRouter();
  const { draft, setStep, updateDraft, resetDraft } = useMeetingStore();
  const { data: contacts } = useContacts();
  const createMeeting = useCreateMeeting();

  const handleNext = () => {
    if (draft.step < 4) setStep((draft.step + 1) as any);
  };
  const handleBack = () => {
    if (draft.step > 1) setStep((draft.step - 1) as any);
    else router.back();
  };

  const handleCreate = async () => {
    if (draft.contactIds.length === 0) {
      Alert.alert("참석자를 선택해 주세요");
      return;
    }
    try {
      const meeting = await createMeeting.mutateAsync({
        meeting: {
          title: draft.title || null,
          scheduled_at: draft.scheduledAt,
          location: draft.location || null,
          notes: draft.notes || null,
          status: "upcoming",
        },
        contactIds: draft.contactIds,
      });

      // 브리핑 생성 트리거 (비동기, 결과 안 기다림)
      apiClient.post("/brief/generate", {
        meetingId: meeting.id,
        contactIds: draft.contactIds,
        language: "ko",
      }).catch(console.warn);

      resetDraft();
      router.replace("/(tabs)");
    } catch (e) {
      Alert.alert("미팅 생성 실패", "다시 시도해 주세요.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backText}>← {draft.step === 1 ? "취소" : "이전"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>미팅 생성</Text>
      </View>

      <StepIndicator current={draft.step} total={4} labels={STEP_LABELS} />

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Step 1: 참석자 선택 */}
        {draft.step === 1 && (
          <AttendeeSelector
            contacts={contacts ?? []}
            selectedIds={draft.contactIds}
            onToggle={(id) =>
              updateDraft({
                contactIds: draft.contactIds.includes(id)
                  ? draft.contactIds.filter((c) => c !== id)
                  : [...draft.contactIds, id],
              })
            }
          />
        )}

        {/* Step 2: 일시/장소 */}
        {draft.step === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.fieldLabel}>미팅 일시</Text>
            <DateTimePicker
              value={new Date(draft.scheduledAt)}
              mode="datetime"
              onChange={(_, date) => date && updateDraft({ scheduledAt: date.toISOString() })}
              style={{ marginBottom: 16 }}
            />
            <Text style={styles.fieldLabel}>장소</Text>
            <TextInput
              value={draft.location}
              onChangeText={(v) => updateDraft({ location: v })}
              placeholder="장소를 입력하세요"
              placeholderTextColor={Colors.text.disabled}
              style={styles.input}
            />
          </View>
        )}

        {/* Step 3: 제목/메모 */}
        {draft.step === 3 && (
          <View style={styles.stepContent}>
            <Text style={styles.fieldLabel}>미팅 제목 (선택)</Text>
            <TextInput
              value={draft.title}
              onChangeText={(v) => updateDraft({ title: v })}
              placeholder="예: Q1 사업 검토 미팅"
              placeholderTextColor={Colors.text.disabled}
              style={styles.input}
            />
            <Text style={styles.fieldLabel}>메모 (선택)</Text>
            <TextInput
              value={draft.notes}
              onChangeText={(v) => updateDraft({ notes: v })}
              placeholder="미팅 관련 메모..."
              placeholderTextColor={Colors.text.disabled}
              multiline
              style={[styles.input, { height: 100, textAlignVertical: "top" }]}
            />
          </View>
        )}

        {/* Step 4: 확인 */}
        {draft.step === 4 && (
          <View style={styles.stepContent}>
            <Text style={styles.confirmTitle}>미팅 확인</Text>
            <ConfirmRow label="참석자" value={`${draft.contactIds.length}명`} />
            <ConfirmRow
              label="일시"
              value={new Date(draft.scheduledAt).toLocaleString("ko-KR")}
            />
            {draft.location && <ConfirmRow label="장소" value={draft.location} />}
            {draft.title && <ConfirmRow label="제목" value={draft.title} />}
            <Text style={styles.briefNote}>
              ✦ 미팅 생성 후 AI 브리핑이 자동으로 생성됩니다.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.footer}>
        {draft.step < 4 ? (
          <Button label="다음" onPress={handleNext} />
        ) : (
          <Button
            label="미팅 생성"
            onPress={handleCreate}
            loading={createMeeting.isPending}
          />
        )}
      </View>
    </View>
  );
}

function ConfirmRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.confirmRow}>
      <Text style={styles.confirmLabel}>{label}</Text>
      <Text style={styles.confirmValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg.default },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 60, paddingHorizontal: 16, paddingBottom: 8 },
  backText: { fontSize: 15, color: Colors.action.primary },
  headerTitle: { fontSize: 17, fontWeight: "600", color: Colors.text.primary },
  body: { flex: 1 },
  stepContent: { padding: 20, gap: 8 },
  fieldLabel: { fontSize: 13, fontWeight: "600", color: Colors.text.secondary, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: Colors.border.default, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: Colors.text.primary, backgroundColor: Colors.bg.subtle },
  footer: { padding: 16, paddingBottom: 40 },
  confirmTitle: { fontSize: 18, fontWeight: "700", color: Colors.text.primary, marginBottom: 16 },
  confirmRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border.default },
  confirmLabel: { fontSize: 14, color: Colors.text.secondary },
  confirmValue: { fontSize: 14, fontWeight: "500", color: Colors.text.primary, flex: 1, textAlign: "right" },
  briefNote: { marginTop: 20, fontSize: 13, color: Colors.action.primary, fontStyle: "italic" },
});
