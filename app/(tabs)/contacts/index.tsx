import React, { useState, useMemo } from "react";
import {
  View, Text, TextInput, FlatList, StyleSheet,
} from "react-native";
import { useContacts } from "@/hooks/useContacts";
import { ContactListItem } from "@/components/contacts/ContactListItem";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";
import { Colors } from "@/constants/colors";

export default function ContactsScreen() {
  const [search, setSearch] = useState("");
  const { data: contacts, isLoading } = useContacts();

  const filtered = useMemo(() => {
    if (!contacts) return [];
    if (!search.trim()) return contacts;
    const q = search.toLowerCase();
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.company?.toLowerCase().includes(q) ||
        c.position?.toLowerCase().includes(q)
    );
  }, [contacts, search]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>연락처</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="이름, 회사, 직책 검색"
          placeholderTextColor={Colors.text.disabled}
          style={styles.search}
        />
      </View>

      {isLoading ? (
        <View style={styles.skeletons}>
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonLoader key={i} height={60} borderRadius={0} style={{ marginBottom: 1 }} />
          ))}
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ContactListItem contact={item} />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={() => (
            <Text style={styles.empty}>
              {search ? "검색 결과가 없습니다" : "연락처가 없습니다"}
            </Text>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg.default },
  header: { paddingTop: 60, paddingHorizontal: 16, paddingBottom: 12, backgroundColor: Colors.bg.default, gap: 12 },
  title: { fontSize: 24, fontWeight: "700", color: Colors.text.primary },
  search: {
    backgroundColor: Colors.bg.subtle, borderRadius: 12, paddingHorizontal: 14,
    paddingVertical: 10, fontSize: 15, color: Colors.text.primary,
    borderWidth: 1, borderColor: Colors.border.default,
  },
  skeletons: { paddingHorizontal: 16, paddingTop: 8 },
  separator: { height: 1, backgroundColor: Colors.border.default, marginLeft: 72 },
  empty: { textAlign: "center", marginTop: 60, fontSize: 15, color: Colors.text.secondary },
});
