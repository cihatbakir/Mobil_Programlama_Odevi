/**
 * (tabs)/_layout.tsx — Sekme Navigasyon Düzeni
 *
 * Uygulamanın iki ana sekmesini tanımlar:
 *   1. Keşfet (kesfet.tsx)  → Şehir arama ve listeleme
 *   2. Günlüğüm (gunluk.tsx) → Kişisel seyahat günlüğü
 *
 * Alt sekme çubuğu özelleştirilmiş renk ve ikon ile gösterilir.
 * Tema rengi: #0891B2 (Cyan-600 — deniz/seyahat teması)
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // ── Tema Renkleri ────────────────────────
  const ACTIVE_COLOR = '#0891B2';                         // Turkuaz — aktif sekme rengi
  const INACTIVE_COLOR = isDark ? '#6B7280' : '#9CA3AF';  // Gri — pasif sekme rengi
  const BG_COLOR = isDark ? '#111827' : '#FFFFFF';         // Tab bar arka planı

  return (
    <Tabs
      screenOptions={{
        // Aktif sekme için tema rengi
        tabBarActiveTintColor: ACTIVE_COLOR,
        // Pasif sekme için gri ton
        tabBarInactiveTintColor: INACTIVE_COLOR,
        // Alt sekme çubuğu stilleri
        tabBarStyle: {
          backgroundColor: BG_COLOR,
          borderTopColor: isDark ? '#1F2937' : '#E2E8F0',
          borderTopWidth: 1,
          height: 62,
          paddingBottom: 10,
          paddingTop: 6,
        },
        // Sekme etiketi yazı stili
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        // Her sekme ekranı kendi başlığını yönetir
        headerShown: false,
      }}
    >
      {/* ── Sekme 1: Keşfet ─────────────────── */}
      <Tabs.Screen
        name="kesfet"
        options={{
          title: 'Keşfet',
          tabBarIcon: ({ color, size }) => (
            // Büyüteç ikonu — arama/keşif teması
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />

      {/* ── Sekme 2: Günlüğüm ───────────────── */}
      <Tabs.Screen
        name="gunluk"
        options={{
          title: 'Günlüğüm',
          tabBarIcon: ({ color, size }) => (
            // Kitap ikonu — günlük/not defteri teması
            <Ionicons name="book" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
