import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { useAuthStore } from "@/store/auth";
import { useTheme } from "@/theme";
import { useI18n } from "@/i18n";
import { getStats } from "@/services/api";

interface Stats {
  total_users: number;
  active_users: number;
  banned_users: number;
  admin_users: number;
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  const { tokens } = useTheme();
  return (
    <View
      style={{
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: tokens.surfaceBorder,
        borderRadius: 22,
        padding: 20,
        flex: 1,
        overflow: "hidden",
        shadowColor: "#24364f",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 0,
      }}
    >
      {Platform.OS === "ios" ? (
        <BlurView pointerEvents="none" intensity={36} tint={tokens.isLight ? "light" : "dark"} style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "transparent" }} />
      ) : null}
      <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, top: 0, height: 1, backgroundColor: tokens.isLight ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.42)" }} />
      <Text style={{ color: tokens.mutedText, fontSize: 12, fontWeight: "600" }}>{title}</Text>
      <Text style={{ color, fontSize: 36, fontWeight: "800", marginTop: 8 }}>{value}</Text>
    </View>
  );
}

export default function DashboardScreen() {
  const { token, backendUrl } = useAuthStore();
  const { tokens } = useTheme();
  const { t } = useI18n();
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: tokens.background }}>
        <ActivityIndicator size="large" color={tokens.accent} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: tokens.background }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 56 }}>
        <Text style={{ color: tokens.text, fontSize: 28, fontWeight: "800" }}>
          {t("dashboard")}
        </Text>
        <Text style={{ color: tokens.mutedText, fontSize: 14, marginTop: 4 }}>
          {t("serverOverview")}
        </Text>

        <View style={{ marginTop: 24, flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          <StatCard title={t("totalUsers")} value={stats?.total_users ?? 0} color={tokens.accent} />
          <StatCard title={t("activeUsers")} value={stats?.active_users ?? 0} color="#22C55E" />
          <StatCard title={t("bannedUsers")} value={stats?.banned_users ?? 0} color="#EF4444" />
          <StatCard title={t("adminUsers")} value={stats?.admin_users ?? 0} color="#F97316" />
        </View>

        <View
          style={{
            marginTop: 28,
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: tokens.surfaceBorder,
            borderRadius: tokens.cardRadius,
            padding: 20,
            overflow: "hidden",
          }}
        >
          {Platform.OS === "ios" ? (
            <BlurView pointerEvents="none" intensity={36} tint={tokens.isLight ? "light" : "dark"} style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "transparent" }} />
          ) : null}
          <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, top: 0, height: 1, backgroundColor: tokens.isLight ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.42)" }} />
          <Text style={{ color: tokens.text, fontSize: 18, fontWeight: "700" }}>{t("serverStatus")}</Text>
          <Text style={{ color: tokens.mutedText, fontSize: 12, marginTop: 12 }}>{t("backendUrl")}</Text>
          <Text style={{ color: tokens.text, fontSize: 14, marginTop: 4 }} selectable>{backendUrl}</Text>
        </View>
      </ScrollView>
    </View>
  );
}
