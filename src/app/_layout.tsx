/**
 * _layout.tsx — Kök Navigasyon Düzeni
 *
 * Expo Router'ın Stack navigatörü burada tanımlanır.
 * Uygulama iki tür ekrandan oluşur:
 *   1. Tab ekranları → (tabs) grubu içinde (Keşfet, Günlük)
 *   2. Stack ekranları → (tabs) üzerine yığılır (Şehir Detayı)
 *
 * Navigasyon hiyerarşisi:
 *   Stack
 *   ├── index       ← /kesfet'e yönlendirir (redirect)
 *   ├── explore     ← /gunluk'a yönlendirir (redirect)
 *   ├── (tabs)      ← Tab navigatör: kesfet + gunluk sekmeleri
 *   └── city/[id]   ← Şehir detay ekranı (stack push)
 */

import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    // Tema sağlayıcısı: karanlık/aydınlık modda React Navigation temalarını uygular
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Kök index → /kesfet'e yönlendirme (header gerekmez) */}
        <Stack.Screen name="index" options={{ headerShown: false }} />

        {/* Eski /explore yolu → /gunluk'a yönlendirme */}
        <Stack.Screen name="explore" options={{ headerShown: false }} />

        {/* Tab navigasyon grubu — kendi başlığını yönetir */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Şehir detay ekranı — turkuaz başlıklı stack ekranı */}
        <Stack.Screen
          name="city/[id]"
          options={{
            // Başlık CityDetailScreen içinde dinamik olarak güncellenir
            title: 'Şehir Detayı',
            headerStyle: { backgroundColor: '#0891B2' },
            headerTintColor: '#FFFFFF',          // Geri butonu ve başlık rengi
            headerTitleStyle: { fontWeight: 'bold' },
            headerBackTitle: 'Geri',             // iOS geri butonu etiketi
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}

