/**
 * WeatherCard.tsx — Hava Durumu Kartı Bileşeni
 *
 * Şehir detay ekranında OpenWeatherMap'ten gelen hava durumu verisini gösterir.
 * Üç farklı durumu destekler: yükleniyor, hata, veri hazır.
 *
 * Kullanım:
 *   <WeatherCard weather={data} loading={isLoading} error={errorMsg} />
 */

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

import { WeatherData, getWeatherEmoji } from '@/services/weatherService';

// ─────────────────────────────────────────
// Tip Tanımlamaları
// ─────────────────────────────────────────

interface WeatherCardProps {
  weather: WeatherData | null; // Hava durumu verisi (null: henüz çekilmedi)
  loading: boolean;            // true: API isteği devam ediyor
  error: string | null;        // null değilse hata mesajı gösterilir
}

// ─────────────────────────────────────────
// Bileşen
// ─────────────────────────────────────────

export const WeatherCard = ({ weather, loading, error }: WeatherCardProps) => {
  // ── Durum 1: Yükleniyor ──────────────────
  if (loading) {
    return (
      <View style={[styles.card, styles.centered]}>
        {/* Mavi dönen yükleme göstergesi */}
        <ActivityIndicator size="large" color="#0891B2" />
        <Text style={styles.loadingText}>Hava durumu yükleniyor…</Text>
      </View>
    );
  }

  // ── Durum 2: Hata ────────────────────────
  if (error) {
    return (
      <View style={[styles.card, styles.errorCard]}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Hava Durumu Alınamadı</Text>
        <Text style={styles.errorMessage}>{error}</Text>
      </View>
    );
  }

  // ── Durum 3: Veri yok (henüz istek atılmadı) ──
  if (!weather) return null;

  // ── Durum 4: Veri hazır ──────────────────
  // İkon kodundan emoji belirle (ör. "01d" → "☀️")
  const emoji = getWeatherEmoji(weather.iconCode);

  return (
    <View style={styles.card}>
      {/* Kart başlığı */}
      <Text style={styles.cardTitle}>🌤️ Hava Durumu</Text>

      {/* Ana bilgi: büyük emoji + sıcaklık */}
      <View style={styles.mainRow}>
        <Text style={styles.weatherEmoji}>{emoji}</Text>
        <View style={styles.tempContainer}>
          <Text style={styles.temperature}>{weather.temperature}°C</Text>
          {/* İlk harf büyük hale getirilen açıklama */}
          <Text style={styles.description}>
            {weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}
          </Text>
        </View>
      </View>

      {/* Detay bilgiler: nem, rüzgar, hissedilen */}
      <View style={styles.detailsRow}>
        <DetailItem icon="💧" label="Nem" value={`${weather.humidity}%`} />
        <DetailItem icon="💨" label="Rüzgar" value={`${weather.windSpeed} m/s`} />
        <DetailItem icon="🌡️" label="Hissedilen" value={`${weather.feelsLike}°C`} />
      </View>
    </View>
  );
};

// ─────────────────────────────────────────
// Alt Bileşen: Tek Detay Öğesi
// ─────────────────────────────────────────

/** Nem / Rüzgar / Hissedilen gibi tek bir ölçüm değerini gösterir */
const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailIcon}>{icon}</Text>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

// ─────────────────────────────────────────
// Stiller
// ─────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#EFF6FF',       // Açık mavi arka plan
    borderRadius: 16,
    padding: 18,
    marginVertical: 8,
    // Hafif gölge
    shadowColor: '#0891B2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0891B2',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // ── Yükleniyor ──
  loadingText: {
    marginTop: 10,
    color: '#64748B',
    fontSize: 14,
  },
  // ── Hata ──
  errorCard: {
    backgroundColor: '#FEF2F2',       // Açık kırmızı arka plan
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 4,
  },
  errorMessage: {
    fontSize: 13,
    color: '#7F1D1D',
    textAlign: 'center',
  },
  // ── Ana satır ──
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  weatherEmoji: {
    fontSize: 52,
    marginRight: 16,
  },
  tempContainer: {
    flex: 1,
  },
  temperature: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  description: {
    fontSize: 15,
    color: '#334155',
    marginTop: 2,
  },
  // ── Detay satırı ──
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#DBEAFE',
    paddingTop: 14,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
});
