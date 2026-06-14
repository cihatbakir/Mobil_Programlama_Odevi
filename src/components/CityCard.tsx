// sehir karti - kesfet ekraninda yatay listede gosterilir

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { City } from '@/data/cities';

// ─────────────────────────────────────────
// Tip Tanımlamaları
// ─────────────────────────────────────────

interface CityCardProps {
  city: City;                    // Gösterilecek şehir verisi
  onPress: (city: City) => void; // Karta basınca tetiklenecek callback
}

// const sabitleri
const CARD_WIDTH = 180;
const CARD_HEIGHT = 260;

// ─────────────────────────────────────────
// Bileşen
// ─────────────────────────────────────────

export const CityCard = ({ city, onPress }: CityCardProps) => {
  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => onPress(city)}
      activeOpacity={0.85} // Basınca hafif soluklaşma efekti
    >
      {/* Şehir fotoğrafı arka plan olarak */}
      <ImageBackground
        source={{ uri: city.imageUrl }}
        style={styles.imageBackground}
        imageStyle={styles.image}
        // Görsel yüklenirken gösterilecek içerik
        loadingIndicatorSource={undefined}
      >
        {/* Karartma katmanı — görselin üzerine gradient efekti */}
        <View style={styles.overlay} />

        {/* Şehir bilgileri — kartın alt kısmında */}
        <View style={styles.infoContainer}>
          <Text style={styles.cityName} numberOfLines={1}>
            {city.name}
          </Text>
      <Text style={styles.countryName}>{city.country}</Text>
          <View style={styles.placesTag}>
            <Text style={styles.placesTagText}>
              {city.places.length} yer
            </Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

// ─────────────────────────────────────────
// Stiller
// ─────────────────────────────────────────

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: 14,         // Kartlar arası yatay boşluk
    borderRadius: 16,
    // Kart gölgesi (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // Kart gölgesi (Android)
    elevation: 8,
    overflow: 'hidden',      // Köşe yuvarlaması için
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end', // İçeriği alt kısma hizala
  },
  image: {
    borderRadius: 16,
  },
  // Yarı saydam siyah katman — metin okunabilirliği için
  overlay: {
    position: 'absolute', // Tüm alanı kapla
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // Alttan yukarıya doğru koyulaşan gradient efekti (React Native'de native gradient yok)
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 16,
  },
  infoContainer: {
    padding: 14,
  },
  cityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  countryName: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 3,
  },
  placesTag: {
    marginTop: 8,
    backgroundColor: 'rgba(8, 145, 178, 0.8)', // Turkuaz — ana tema rengi
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start', // İçeriği sarmala
  },
  placesTagText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
