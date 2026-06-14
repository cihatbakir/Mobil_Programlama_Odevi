// sehir detay ekrani - hava durumu, harita ve gezilecek yerler

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  useColorScheme,
  SafeAreaView,
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';

import { CITIES, City, Place } from '@/data/cities';
import { WeatherData, fetchWeather } from '@/services/weatherService';
import { WeatherCard } from '@/components/WeatherCard';

// react-native-maps sadece ios/android'de calisir, web'de desteklenmez
const isNative = Platform.OS !== 'web';

// Native platformda maps bileşenlerini yükle
let MapView: any = null;
let Marker: any = null;
let Callout: any = null;

if (isNative) {
  // Dinamik require ile web bundle'dan dışarıda bırakılır
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
  Callout = Maps.Callout;
}

// ─────────────────────────────────────────
// Bileşen
// ─────────────────────────────────────────

export default function CityDetailScreen() {
  // url'den gelen sehir id'si
  const { id } = useLocalSearchParams<{ id: string }>();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // sabit listeden sehri bul
  const city: City | undefined = CITIES.find((c) => c.id === id);

  // ── Hava Durumu State ─────────────────────
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  // hava durumu api cagrisi
  const loadWeather = useCallback(async () => {
    if (!city) return;

    setWeatherLoading(true);
    setWeatherError(null);

    try {
      // İngilizce şehir adını API'ye gönder (doğrudan Türkçe adla da çalışır)
      const data = await fetchWeather(city.name);
      setWeather(data);
    } catch (error: any) {
      // API anahtarı yoksa veya şehir bulunamazsa kullanıcı dostu mesaj
      setWeatherError(error.message ?? 'Hava durumu bilgisi alınamadı.');
    } finally {
      setWeatherLoading(false);
    }
  }, [city?.name]);

  // Ekran açıldığında hava durumunu çek
  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  // gunluge ekle butonuna basilinca gunluk sekmesine git
  const handleAddToJournal = () => {
    if (!city) return;
    router.push({
      pathname: '/gunluk' as any,
      params: {
        cityName: city.name,
        country: city.country,
      },
    });
  };

  // ── Şehir Bulunamadı ──────────────────────
  if (!city) {
    return (
      <SafeAreaView style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Sehir bulunamadi.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Geri Dön</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ─────────────────────────────────────────
  // Ana Render
  // ─────────────────────────────────────────
  return (
    <>
      {/* Stack header başlığını dinamik olarak güncelle */}
      <Stack.Screen
        options={{
          title: city.name,
          headerStyle: { backgroundColor: '#0891B2' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />

      <ScrollView
        style={[styles.scrollView, isDark && styles.darkScrollView]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Şehir Başlığı ─────────────────── */}
        <View style={[styles.cityHeader, isDark && styles.darkCityHeader]}>
          <Text style={styles.cityNameLarge}>{city.name}</Text>
          <Text style={styles.cityCountry}>{city.country}</Text>
          <Text style={[styles.cityDescription, isDark && styles.darkSubText]}>
            {city.description}
          </Text>
        </View>

        {/* ── Hava Durumu Kartı ─────────────── */}
        <SectionTitle title="Hava Durumu" isDark={isDark} />
        <View style={styles.sectionContent}>
          <WeatherCard
            weather={weather}
            loading={weatherLoading}
            error={weatherError}
          />
          {/* Hata durumunda yeniden dene butonu */}
          {weatherError && (
            <TouchableOpacity onPress={loadWeather} style={styles.retryBtn}>
              <Text style={styles.retryBtnText}>Yeniden Dene</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Harita ────────────────────────── */}
        <SectionTitle title="Konum" isDark={isDark} />
        <View style={styles.sectionContent}>
          {isNative && MapView ? (
            // Native: react-native-maps ile gerçek harita
            <MapView
              style={styles.map}
              // Başlangıç bölgesi: şehrin koordinatlarına odaklan
              initialRegion={{
                latitude: city.latitude,
                longitude: city.longitude,
                latitudeDelta: 0.15,   // Yakınlaştırma seviyesi (dikey)
                longitudeDelta: 0.15,  // Yakınlaştırma seviyesi (yatay)
              }}
              showsUserLocation={false}
              showsCompass={true}
            >
              {/* Şehir konumunu işaretleyen pin */}
              <Marker
                coordinate={{
                  latitude: city.latitude,
                  longitude: city.longitude,
                }}
                title={city.name}
                description={city.country}
              >
                {/* Marker'a basınca açıklama balonu */}
                <Callout tooltip={false}>
                  <View style={styles.callout}>
                    <Text style={styles.calloutTitle}>{city.name}</Text>
                    <Text style={styles.calloutSubtitle}>{city.country}</Text>
                  </View>
                </Callout>
              </Marker>
            </MapView>
          ) : (
            // Web: Harita desteklenmiyor, bilgi kartı göster
            <View style={[styles.mapPlaceholder, isDark && styles.darkMapPlaceholder]}>
              <Text style={[styles.mapPlaceholderText, isDark && styles.darkSubText]}>
                Harita sadece mobil uygulamada calisir.
              </Text>
              <Text style={styles.mapCoords}>
                {city.latitude.toFixed(4)}, {city.longitude.toFixed(4)}
              </Text>
            </View>
          )}
        </View>

        {/* ── Gezilecek Yerler ──────────────── */}
        <SectionTitle title="Gezilecek Yerler" isDark={isDark} />
        <View style={styles.sectionContent}>
          {city.places.map((place, index) => (
            <PlaceRow key={index} place={place} isDark={isDark} />
          ))}
        </View>

        {/* ── Günlüğe Ekle Butonu ───────────── */}
        <TouchableOpacity
          style={styles.journalBtn}
          onPress={handleAddToJournal}
          activeOpacity={0.85}
        >
          <Text style={styles.journalBtnText}>Gunluge Ekle</Text>
        </TouchableOpacity>

        {/* Alt boşluk */}
        <View style={{ height: 30 }} />
      </ScrollView>
    </>
  );
}

// ─────────────────────────────────────────
// Alt Bileşenler
// ─────────────────────────────────────────

/** Bölüm başlığı */
const SectionTitle = ({ title, isDark }: { title: string; isDark: boolean }) => (
  <Text style={[sectionStyles.title, isDark && { color: '#94A3B8' }]}>{title}</Text>
);

/** Tek bir gezilecek yer satırı */
const PlaceRow = ({ place, isDark }: { place: Place; isDark: boolean }) => (
  <View style={[placeStyles.row, isDark && placeStyles.darkRow]}>
    <Text style={placeStyles.icon}>{place.icon}</Text>
    <View style={placeStyles.textBlock}>
      <Text style={[placeStyles.name, isDark && { color: '#F1F5F9' }]}>
        {place.name}
      </Text>
      <Text style={[placeStyles.desc, isDark && { color: '#94A3B8' }]}>
        {place.description}
      </Text>
    </View>
  </View>
);

const sectionStyles = StyleSheet.create({
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#334155',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 4,
  },
});

const placeStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  darkRow: {
    backgroundColor: '#1E293B',
  },
  icon: {
    fontSize: 26,
    marginRight: 12,
    marginTop: 2,
  },
  textBlock: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 3,
  },
  desc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
});

// ─────────────────────────────────────────
// Ana Stiller
// ─────────────────────────────────────────

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  darkScrollView: {
    backgroundColor: '#0C1120',
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // ── Şehir Başlığı ──
  cityHeader: {
    backgroundColor: '#0891B2',      // Turkuaz — seyahat teması
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 28,
  },
  darkCityHeader: {
    backgroundColor: '#0E6E8C',
  },
  cityNameLarge: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cityCountry: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
    marginBottom: 10,
  },
  cityDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 20,
  },
  darkSubText: {
    color: '#94A3B8',
  },

  // ── Bölüm İçeriği ──
  sectionContent: {
    paddingHorizontal: 20,
    marginTop: 8,
  },

  // ── Harita ──
  map: {
    width: '100%',
    height: 220,
    borderRadius: 14,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    height: 140,
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderStyle: 'dashed',
  },
  darkMapPlaceholder: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  mapPlaceholderIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  mapPlaceholderText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 6,
  },
  mapCoords: {
    fontSize: 12,
    color: '#0891B2',
    fontWeight: '600',
  },

  // ── Harita Callout ──
  callout: {
    padding: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  calloutSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },

  // ── Yeniden Dene ──
  retryBtn: {
    marginTop: 8,
    alignItems: 'center',
  },
  retryBtnText: {
    fontSize: 14,
    color: '#0891B2',
    fontWeight: '600',
  },

  // ── Günlüğe Ekle Butonu ──
  journalBtn: {
    marginHorizontal: 20,
    marginTop: 28,
    backgroundColor: '#0891B2',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    // Gölge
    shadowColor: '#0891B2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  journalBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // ── Şehir Bulunamadı ──
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  notFoundIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  notFoundText: {
    fontSize: 18,
    color: '#334155',
    marginBottom: 20,
  },
  backBtn: {
    backgroundColor: '#0891B2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
