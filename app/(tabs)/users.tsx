import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, Text, TextInput, View, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { useAuthStore } from "@/store/auth";
import { useTheme } from "@/theme";
import { useI18n } from "@/i18n";
import { banUser, deleteUser, getUsers, promoteUser, unbanUser } from "@/services/api";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  banned: boolean;
  ban_reason: string;
  created_at: string;
}

export default function UsersScreen() {
  const { token, backendUrl } = useAuthStore();
  const { tokens } = useTheme();
  const { t } = useI18n();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchUsers = async (resetOffset = 0) => {
    if (!token || !backendUrl) return;
    try {
      const data = await getUsers(backendUrl, token, resetOffset, 50);
      const newUsers = data.users || [];
      if (resetOffset === 0) {
        setUsers(newUsers);
      } else {
        setUsers((prev) => [...prev, ...newUsers]);
      }
      setHasMore(newUsers.length >= 50);
      setOffset(resetOffset + newUsers.length);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchUsers(0);
  }, [token, backendUrl]);

  const handleBan = async (userId: number, banned: boolean) => {
    Alert.alert(
      banned ? t("unbanUser") : t("banUser"),
      banned ? t("unbanConfirm") : t("banConfirm"),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: banned ? t("unban") : t("ban"),
          style: banned ? "default" : "destructive",
          onPress: async () => {
            try {
              if (banned) {
                await unbanUser(backendUrl!, token!, userId);
              } else {
                await banUser(backendUrl!, token!, userId, t("bannedByAdmin"));
              }
              fetchUsers(0);
            } catch (err) {
              Alert.alert(t("operationFailed"), t("operationFailed"));
            }
          },
        },
      ]
    );
  };

  const handleDelete = (userId: number, username: string) => {
    Alert.alert(t("deleteUser"), `${t("deleteConfirm")} ${username}${t("cannotUndo")}`, [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("deleteUser"),
        style: "destructive",
        onPress: async () => {
          try {
            await deleteUser(backendUrl!, token!, userId);
            fetchUsers(0);
          } catch (err) {
            Alert.alert(t("deleteFailed"), t("deleteFailed"));
          }
        },
      },
    ]);
  };

  const handlePromote = (userId: number, username: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    const action = currentRole === "admin" ? t("demote") : t("promote");
    Alert.alert(t("changeRole"), `${action} ${username} ${t("toRole")} ${newRole}?`, [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("confirm"),
        onPress: async () => {
          try {
            await promoteUser(backendUrl!, token!, userId, newRole);
            fetchUsers(0);
          } catch (err) {
            Alert.alert(t("operationFailed"), t("operationFailed"));
          }
        },
      },
    ]);
  };

  const filteredUsers = search.trim()
    ? users.filter(
        (u) =>
          u.username.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: tokens.background }}>
        <ActivityIndicator size="large" color={tokens.accent} />
      </View>
    );
  }

  const renderUser = ({ item }: { item: User }) => (
    <View
      style={{
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: tokens.surfaceBorder,
        borderRadius: 22,
        padding: 16,
        marginBottom: 10,
        overflow: "hidden",
        opacity: item.banned ? 0.6 : 1,
        shadowColor: "#24364f",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 0,
      }}
    >
      {Platform.OS === "ios" ? (
        <BlurView pointerEvents="none" intensity={32} tint={tokens.isLight ? "light" : "dark"} style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "transparent" }} />
      ) : null}
      <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, top: 0, height: 1, backgroundColor: tokens.isLight ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.42)" }} />

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text style={{ color: tokens.text, fontSize: 16, fontWeight: "700" }}>{item.username}</Text>
            {item.role === "admin" ? (
              <View style={{ backgroundColor: `${tokens.accent}30`, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                <Text style={{ color: tokens.accent, fontSize: 10, fontWeight: "800" }}>admin</Text>
              </View>
            ) : null}
            {item.banned ? (
              <View style={{ backgroundColor: "#EF444430", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                <Text style={{ color: "#EF4444", fontSize: 10, fontWeight: "800" }}>{t("banned")}</Text>
              </View>
            ) : null}
          </View>
          <Text style={{ color: tokens.mutedText, fontSize: 12, marginTop: 4 }}>{item.email}</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
        <Pressable
          onPress={() => handleBan(item.id, item.banned)}
          style={{
            backgroundColor: item.banned ? "#22C55E20" : "#EF444420",
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: item.banned ? "#22C55E40" : "#EF444440",
          }}
        >
          <Text style={{ color: item.banned ? "#22C55E" : "#EF4444", fontSize: 12, fontWeight: "700" }}>
            {item.banned ? t("unban") : t("ban")}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => handlePromote(item.id, item.username, item.role)}
          style={{
            backgroundColor: item.role === "admin" ? "#88888820" : `${tokens.accent}20`,
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: item.role === "admin" ? "#88888840" : `${tokens.accent}40`,
          }}
        >
          <Text style={{ color: item.role === "admin" ? "#888" : tokens.accent, fontSize: 12, fontWeight: "700" }}>
            {item.role === "admin" ? t("demote") : t("promote")}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => handleDelete(item.id, item.username)}
          style={{
            backgroundColor: "#EF444410",
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: "#EF444430",
          }}
        >
          <Text style={{ color: "#EF4444", fontSize: 12, fontWeight: "700" }}>{t("deleteUser")}</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: tokens.background }}>
      <View style={{ paddingTop: 56, paddingHorizontal: 20 }}>
        <Text style={{ color: tokens.text, fontSize: 28, fontWeight: "800" }}>
          {t("users")}
        </Text>
        <Text style={{ color: tokens.mutedText, fontSize: 14, marginTop: 4, marginBottom: 16 }}>
          {filteredUsers.length} {t("registeredUsers")}
        </Text>

        <View
          style={{
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: tokens.surfaceBorder,
            borderRadius: 14,
            overflow: "hidden",
            marginBottom: 12,
          }}
        >
          {Platform.OS === "ios" ? (
            <BlurView pointerEvents="none" intensity={24} tint={tokens.isLight ? "light" : "dark"} style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "transparent" }} />
          ) : null}
          <TextInput
            placeholder={t("searchUsers")}
            placeholderTextColor={tokens.mutedText}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            style={{ padding: 14, color: tokens.text, fontSize: 15, backgroundColor: "transparent" }}
          />
        </View>
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          fetchUsers(0);
        }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        renderItem={renderUser}
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <Text style={{ color: tokens.mutedText, fontSize: 14 }}>{t("noUsers")}</Text>
          </View>
        }
        onEndReached={() => {
          if (hasMore && !loadingMore) {
            setLoadingMore(true);
            fetchUsers(offset);
          }
        }}
        onEndReachedThreshold={0.3}
      />
    </View>
  );
}
