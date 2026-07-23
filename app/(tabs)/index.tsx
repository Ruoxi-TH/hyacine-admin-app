import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useAuthStore } from "@/store/auth";
import { getStats } from "@/services/api";

interface Stats {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  adminUsers: number;
}

export default function DashboardScreen() {
  const { token, backendUrl } = useAuthStore();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token || !backendUrl) return;
      try {
        const data = await getStats(backendUrl, token);
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token, backendUrl]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0f0f1a" }}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0f0f1a", padding: 16 }}>
      <Text style={{ color: "#fff", fontSize: 24, fontWeight: "800", marginTop: 40 }}>
        Dashboard
      </Text>
      <Text style={{ color: "#888", fontSize: 14, marginTop: 4 }}>
        Server overview
      </Text>

      <View style={{ marginTop: 24, flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        <StatCard title="Total Users" value={stats?.totalUsers ?? 0} color="#7C3AED" />
        <StatCard title="Active" value={stats?.activeUsers ?? 0} color="#22C55E" />
        <StatCard title="Banned" value={stats?.bannedUsers ?? 0} color="#EF4444" />
        <StatCard title="Admins" value={stats?.adminUsers ?? 0} color="#F97316" />
      </View>

      <View style={{ marginTop: 32 }}>
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>Server Status</Text>
        <View style={{ backgroundColor: "#1a1a2e", borderRadius: 12, padding: 16, marginTop: 12 }}>
          <Text style={{ color: "#888", fontSize: 12 }}>Backend URL</Text>
          <Text style={{ color: "#fff", fontSize: 14, marginTop: 4 }}>{backendUrl}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <View style={{ backgroundColor: "#1a1a2e", borderRadius: 12, padding: 16, minWidth: "45%", flex: 1 }}>
      <Text style={{ color: "#888", fontSize: 12 }}>{title}</Text>
      <Text style={{ color, fontSize: 32, fontWeight: "800", marginTop: 8 }}>{value}</Text>
    </View>
  );
}