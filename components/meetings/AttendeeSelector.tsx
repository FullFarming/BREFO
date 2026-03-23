import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Contact } from "@/types";
import { Colors } from "@/constants/colors";

interface Props {
  contacts: Contact[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export function AttendeeSelector({ contacts, selectedIds, onToggle }: Props) {
  return (
    <FlatList
      data={contacts}
      keyExtractor={(c) => c.id}
      renderItem={({ item }) => {
        const selected = selectedIds.includes(item.id);
        return (
          <TouchableOpacity
            onPress={() => onToggle(item.id)}
            style={[styles.item, selected && styles.itemSelected]}
          >
            <View style={[styles.check, selected && styles.checkSelected]}>
              {selected && <Text style={styles.checkMark}>✓</Text>}
            </View>
            <View>
              <Text style={styles.name}>{item.name}</Text>
              {item.company && <Text style={styles.company}>{item.company}</Text>}
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, paddingHorizontal: 16 },
  itemSelected: { backgroundColor: "rgba(14,165,196,0.05)" },
  check: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.border.default, alignItems: "center", justifyContent: "center" },
  checkSelected: { borderColor: Colors.action.primary, backgroundColor: Colors.action.primary },
  checkMark: { color: "#fff", fontSize: 12, fontWeight: "700" },
  name: { fontSize: 15, fontWeight: "600", color: Colors.text.primary },
  company: { fontSize: 12, color: Colors.text.secondary },
});
