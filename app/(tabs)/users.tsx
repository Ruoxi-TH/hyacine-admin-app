import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, Text, View } from "react-native";
import { useAuthStore } from "@/store/auth";
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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async () => {
    if (!token || !backendUrl) return;
    try {
      const data = await getUsers(backendUrl, token);
      setUsers(data.users || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token, backendUrl]);

  const handleBan = async (userId: number, banned: boolean) => {
    Alert.alert(
      banned ? "Unban User" : "Ban User",
      banned ? "Allow this user to login again?" : "Prevent this user from logging in?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: banned ? "Unban" : "Ban",
          style: banned ? "default" : "destructive",
          onPress: async () => {
            try {
              if (banned) {
                await unbanUser(backendUrl!, token!, userId);
              } else {
                await banUser(backendUrl!, token!, userId, "Banned by admin");
              }
              fetchUsers();
            } catch (err) {
              Alert.alert("Error", "Operation failed");
            }
          },
        },
      ]
    );
  };

  const handleDelete = (userId: number, username: string) => {
    Alert.alert("Delete User", `Permanently delete ${username}? This cannot be undone.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteUser(backendUrl!, token!, userId);
            fetchUsers();
          } catch (err) {
            Alert.alert("Error", "Delete failed");
          }
        },
      },
    ]);
  };

  const handlePromote = (userId: number, username: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    Alert.alert(
      "Change Role",
      `${currentRole === "admin" ? "Demote" : "Promote"} ${username} to ${newRole}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              await promoteUser(backendUrl!, token!, userId, newRole);
              fetchUsers();
            } catch (err) {
              Alert.alert("Error", "Operation failed");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0f0f1a" }}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id.toString()}
      refreshing={refreshing}
      onRefresh={() => {
        setRefreshing(true);
        fetchUsers();
      }}
      contentContainerStyle={{ padding: 16 }}
      style={{ flex: 1, backgroundColor: "#0f0f1a" }}
      ListHeaderComponent={
        <>
          <Text style={{ color: "#fff", fontSize: 24, fontWeight: "800", marginTop: 40 }}>
            Users
          </Text>
          <Text style={{ color: "#888", fontSize: 14, marginTop: 4, marginBottom: 16 }}>
            {users.length} registered users
          </Text>
        </>
      }
      renderItem={({ item }) => (
        <View
          style={{
            backgroundColor: "#1a1a2e",
            borderRadius: 12,
            padding: 16,
            marginBottom: 8,
            opacity: item.banned ? 0.6 : 1,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                {item.username}
                {item.role === "admin" && (
                  <Text style={{ color: "#F97316", fontSize: 12 }}> admin</Text>
                )}
              </Text>
              <Text style={{ color: "#888", fontSize: 12, marginTop: 2 }}>{item.email}</Text>
              {item.banned && (
                <Text style={{ color: "#EF4444", fontSize: 12, marginTop: 2 }}>Banned</Text>
              )}
            </View>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Pressable
                onPress={() => handleBan(item.id, item.banned)}
                style={{
                  backgroundColor: item.banned ? "#22C55E" : "#EF4444",
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>
                  {item.banned ? "Unban" : "Ban"}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => handlePromote(item.id, item.username, item.role)}
                style={{
                  backgroundColor: item.role === "admin" ? "#888" : "#7C3AED",
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>
                  {item.role === "admin" ? "Demote" : "Promote"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    />
  );
}