// Kesfet ekrani - sehirleri listeler ve arama yapilabilir

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Platform,
  useColorScheme,
} from 'react-native';
import { router } from 'expo-router';

import { CITIES, City } from '@/data/cities';
import { CityCard } from '@/components/CityCard';

export default function KesfetScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // arama sorgusuna gore sehirleri filtrele
  const filteredCities = CITIES.filter((city) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      city.name.toLowerCase().includes(query) ||
      city.country.toLowerCase().includes(query)
    );
  });

  // sehir kartina basilinca detay sayfasina git
  const handleCityPress = useCallback((city: City) => {
    router.push(`/city/${city.id}` as any);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#0C1120' : '#F0F9FF'}
      />

      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.darkText]}>Kesfet</Text>
        <Text style={[styles.subtitle, isDark && styles.darkSubText]}>
          Nereyi kesfetmek istiyorsun?
        </Text>
      </View>

      {/* arama cubugu */}
      <View style={[styles.searchWrapper, isDark && styles.darkSearchWrapper]}>
        <TextInput
          style={[styles.searchInput, isDark && styles.darkSearchInput]}
          placeholder="Sehir veya ulke ara..."
          placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {Platform.OS === 'android' && searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch} style={styles.clearBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.clearBtnText}>x</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={[styles.sectionTitle, isDark && styles.darkSubText]}>
        {searchQuery.trim() ? `"${searchQuery.trim()}" icin sonuclar` : 'Populer Sehirler'}
      </Text>

      {/* sehir listesi ya da bos durum */}
      {filteredCities.length > 0 ? (
        <FlatList
          data={filteredCities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CityCard city={item} onPress={handleCityPress} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          removeClippedSubviews={Platform.OS !== 'web'}
          maxToRenderPerBatch={5}
          initialNumToRender={4}
          windowSize={5}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyTitle, isDark && styles.darkText]}>
            Sehir bulunamadi
          </Text>
          <Text style={[styles.emptySubText, isDark && styles.darkSubText]}>
            "{searchQuery}" icin eslesme yok.{'\n'}Farkli bir arama deneyin.
          </Text>
        </View>
      )}

      <Text style={[styles.footerText, isDark && styles.darkSubText]}>
        {filteredCities.length} sehir gosteriliyor
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  darkContainer: {
    backgroundColor: '#0C1120',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  darkText: {
    color: '#F1F5F9',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 4,
  },
  darkSubText: {
    color: '#94A3B8',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    shadowColor: '#0891B2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  darkSearchWrapper: {
    backgroundColor: '#1E293B',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    height: '100%',
  },
  darkSearchInput: {
    color: '#F1F5F9',
  },
  clearBtn: {
    padding: 4,
  },
  clearBtnText: {
    fontSize: 16,
    color: '#94A3B8',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#475569',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
  footerText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    paddingVertical: 12,
  },
});
