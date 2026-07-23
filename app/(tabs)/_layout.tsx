import { useEffect, useRef, useState } from "react";
import { Animated, PanResponder, Platform, Pressable, Text, View, type LayoutChangeEvent } from "react-native";
import { BlurView } from "expo-blur";
import { Tabs, usePathname, useRouter } from "expo-router";
import { useTheme } from "@/theme";
import { useI18n } from "@/i18n";

const tabs = [
  { route: "/(tabs)", symbol: "\u2302", key: "dashboard" },
  { route: "/(tabs)/users", symbol: "\u2315", key: "users" },
  { route: "/(tabs)/settings", symbol: "\u2699", key: "settings" },
] as const;

function LiquidTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { tokens } = useTheme();
  const { t } = useI18n();
  const activeIndex = pathname.includes("/users") ? 1 : pathname.includes("/settings") ? 2 : 0;
  const position = useRef(new Animated.Value(activeIndex)).current;
  const activeIndexRef = useRef(activeIndex);
  const tabWidthRef = useRef(0);
  const [contentWidth, setContentWidth] = useState(0);
  const tabWidth = contentWidth / tabs.length;

  useEffect(() => { activeIndexRef.current = activeIndex; }, [activeIndex]);
  useEffect(() => {
    if (!tabWidth) return;
    Animated.spring(position, { toValue: activeIndex, useNativeDriver: true, stiffness: 240, damping: 24, mass: 0.72 }).start();
  }, [activeIndex, position, tabWidth]);

  const switchTo = (index: number) => {
    const nextIndex = Math.max(0, Math.min(tabs.length - 1, index));
    if (nextIndex === activeIndexRef.current) return;
    router.replace(tabs[nextIndex].route);
  };

  const panResponder = useRef(PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 6 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
    onPanResponderGrant: () => position.stopAnimation(),
    onPanResponderMove: (_, gesture) => {
      if (!tabWidthRef.current) return;
      const next = Math.max(0, Math.min(tabs.length - 1, activeIndexRef.current + gesture.dx / tabWidthRef.current));
      position.setValue(next);
    },
    onPanResponderRelease: (_, gesture) => {
      if (!tabWidthRef.current) return;
      const distance = gesture.dx / tabWidthRef.current;
      const velocity = gesture.vx;
      const offset = Math.abs(velocity) > 0.45 ? (velocity > 0 ? 1 : -1) : Math.round(distance);
      switchTo(activeIndexRef.current + offset);
    },
    onPanResponderTerminate: () => {
      Animated.spring(position, { toValue: activeIndexRef.current, useNativeDriver: true, stiffness: 240, damping: 24, mass: 0.72 }).start();
    },
  })).current;

  const onContentLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    tabWidthRef.current = width / tabs.length;
    setContentWidth(width);
  };

  const translateX = position.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [4, tabWidth + 4, tabWidth * 2 + 4],
  });

  return (
    <View pointerEvents="box-none" style={{ position: "absolute", bottom: 12, left: 16, right: 16, height: 72, zIndex: 50 }}>
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: tokens.isLight ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.42)",
          borderRadius: 36,
          shadowColor: "#182848",
          shadowOpacity: 0.18,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 10 },
          elevation: 12,
          overflow: "hidden",
        }}
      >
        {Platform.OS === "ios" ? (
          <BlurView intensity={72} tint={tokens.isLight ? "light" : "dark"} style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "transparent" }} />
        ) : null}
        <View pointerEvents="none" style={{ position: "absolute", left: 20, right: 20, top: 0, height: 1, backgroundColor: tokens.isLight ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.42)" }} />
      </View>

      <View pointerEvents="box-none" style={{ position: "absolute", bottom: 6, left: 6, right: 6, top: 6 }} onLayout={onContentLayout} {...panResponder.panHandlers}>
        {tabWidth ? (
          <Animated.View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 4,
              bottom: 4,
              width: tabWidth - 8,
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: tokens.isLight ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.45)",
              borderRadius: 999,
              shadowColor: tokens.isLight ? "#94a3b8" : "#93c5fd",
              shadowOpacity: 0.28,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 2 },
              elevation: 0,
              overflow: "hidden",
              transform: [{ translateX }],
            }}
          >
            {Platform.OS === "ios" ? (
              <BlurView intensity={88} tint={tokens.isLight ? "light" : "dark"} style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "transparent" }} />
            ) : null}
            <View pointerEvents="none" style={{ position: "absolute", left: 12, right: 12, top: 0, height: 1, backgroundColor: "rgba(255,255,255,0.96)" }} />
          </Animated.View>
        ) : null}

        <View pointerEvents="box-none" style={{ flex: 1, flexDirection: "row" }}>
          {tabs.map((tab, index) => {
            const active = index === activeIndex;
            const focus = position.interpolate({ inputRange: [index - 1, index, index + 1], outputRange: [0, 1, 0], extrapolate: "clamp" });
            const scale = focus.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1.08] });
            const opacity = focus.interpolate({ inputRange: [0, 1], outputRange: [0.52, 1] });
            return (
              <Pressable key={tab.key} style={{ flex: 1, alignItems: "center", justifyContent: "center" }} onPress={() => switchTo(index)}>
                <Animated.View style={{ alignItems: "center", justifyContent: "center", height: 56, opacity, transform: [{ scale }] }}>
                  <Text style={{ color: active ? tokens.text : tokens.mutedText, fontSize: 21, fontWeight: "800" }}>{tab.symbol}</Text>
                  <Text style={{ color: active ? tokens.text : tokens.mutedText, fontSize: 10, fontWeight: "800", marginTop: 2 }}>{t(tab.key)}</Text>
                </Animated.View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

export default function TabsLayout() {
  const { tokens } = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" },
          sceneStyle: { backgroundColor: tokens.background },
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="users" />
        <Tabs.Screen name="settings" />
      </Tabs>
      <LiquidTabBar />
    </View>
  );
}