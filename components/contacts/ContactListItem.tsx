import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Contact } from "@/types";
import { Colors } from "@/constants/colors";

interface Props {
  contact: Contact;
}

export function ContactListItem({ contact }: Props) {
  const router = useRouter();
  const initials = contact.name.slice(0, 1);

  return (
    <TouchableOpacity
      onPress={() => router.push(`/(tabs)/contacts/${contact.id}`)}
      style={styles.item}
      activeOpacity={0.7}
    >
      <View style={styles.avatar}>
        <Text style={styles.initials}>{initials}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{contact.name}</Text>
        {(contact.company || contact.position) && (
          <Text style={styles.sub}>
            {[contact.position, contact.company].filter(Boolean).join(" · ")}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 16, gap: 12, backgroundColor: Colors.bg.default },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.action.secondary, alignItems: "center", justifyContent: "center" },
  initials: { fontSize: 17, fontWeight: "700", color: "#fff" },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: "600", color: Colors.text.primary },
  sub: { fontSize: 13, color: Colors.text.secondary, marginTop: 2 },
});
