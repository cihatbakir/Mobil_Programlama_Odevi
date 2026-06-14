// gunluk ekrani - kullanicinin gezi kayitlarini goruntuleme ve ekleme

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  useColorScheme,
} from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';

import {
  JournalEntry,
  loadJournal,
  saveEntry,
  deleteEntry,
  generateId,
} from '@/services/storageService';
import { JournalEntryCard } from '@/components/JournalEntryCard';
import { StarRating } from '@/components/StarRating';

// ─────────────────────────────────────────
// Bileşen
// ─────────────────────────────────────────

export default function GunlukScreen() {
  // citydetail ekranindan gelince bu parametreler dolu olur
  const params = useLocalSearchParams<{ cityName?: string; country?: string }>();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // gunluk listesi
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);

  // modal acik mi
  const [isModalVisible, setIsModalVisible] = useState(false);

  // form alanlari
  const [formCityName, setFormCityName] = useState('');
  const [formCountry, setFormCountry] = useState('');
  const [formDate, setFormDate] = useState('');   // YYYY-MM-DD formatı
  const [formNote, setFormNote] = useState('');
  const [formRating, setFormRating] = useState(3); // Varsayılan puan: 3
  const [isSaving, setIsSaving] = useState(false);

  // parametreler bir kez islensin diye ref kullandim
  const paramsHandledRef = useRef(false);

  // asyncstorage'dan kayitlari yukle
  const loadEntries = useCallback(async () => {
    setIsLoadingList(true);
    try {
      const data = await loadJournal();
      setEntries(data);
    } catch (error) {
      console.error('Günlük yüklenemedi:', error);
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  // sekme her acildiginda yenile
  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [loadEntries])
  );

  // citydetail'den gelen sehir bilgisini forma doldur
  useEffect(() => {
    if (params.cityName && !paramsHandledRef.current) {
      paramsHandledRef.current = true;
      // Formu şehir bilgisiyle doldur
      setFormCityName(params.cityName);
      setFormCountry(params.country ?? '');
      // Bugünün tarihi otomatik doldurulsun
      setFormDate(getTodayDate());
      setFormRating(3);
      setFormNote('');
      // Modalı aç
      setIsModalVisible(true);
    }
  }, [params.cityName, params.country]);

  // formu sifirla ve modali ac
  const openModal = () => {
    setFormCityName('');
    setFormCountry('');
    setFormDate(getTodayDate()); // Bugünün tarihi varsayılan
    setFormNote('');
    setFormRating(3);
    setIsModalVisible(true);
  };

  // kaydet butonuna basilinca calisir
  const handleSave = async () => {
    // Şehir adı zorunlu alan doğrulaması
    if (!formCityName.trim()) {
      Alert.alert('Eksik Bilgi', 'Lütfen en az şehir adını girin.');
      return;
    }

    setIsSaving(true);
    try {
      // Yeni günlük kaydı oluştur
      const newEntry: JournalEntry = {
        id: generateId(),                     // Benzersiz kimlik üret
        cityName: formCityName.trim(),
        country: formCountry.trim(),
        visitDate: formDate.trim(),
        note: formNote.trim(),
        rating: formRating,
        createdAt: new Date().toISOString(),  // Şu anki zaman (ISO 8601)
      };

      await saveEntry(newEntry);

      // Listeyi anında güncelle (AsyncStorage'ı yeniden okumak yerine)
      setEntries((prev) => [newEntry, ...prev]);
      setIsModalVisible(false);
    } catch (error) {
      Alert.alert('Kayıt Hatası', 'Günlük kaydedilemedi. Lütfen tekrar deneyin.');
    } finally {
      setIsSaving(false);
    }
  };

  // uzun basinca silme islemi
  const handleDelete = (id: string) => {
    Alert.alert(
      'Kaydı Sil',
      'Bu seyahat anısını silmek istediğinden emin misin?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive', // iOS'ta kırmızı gösterilir
          onPress: async () => {
            try {
              await deleteEntry(id);
              // Silinen kaydı listeden kaldır
              setEntries((prev) => prev.filter((e) => e.id !== id));
            } catch (error) {
              Alert.alert('Hata', 'Kayıt silinemedi.');
            }
          },
        },
      ]
    );
  };


  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>

      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.darkText]}>Gunlugum</Text>
        <Text style={[styles.subtitle, isDark && styles.darkSubText]}>
          {entries.length} seyahat anısı
        </Text>
      </View>


      {isLoadingList ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0891B2" />
        </View>
      ) : entries.length === 0 ? (

        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyTitle, isDark && styles.darkText]}>
            Henuz gezi kaydin yok
          </Text>
          <Text style={[styles.emptySubText, isDark && styles.darkSubText]}>
            Şehirleri keşfet ve anılarını{'\n'}buraya kaydet!
          </Text>
        </View>
      ) : (

        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <JournalEntryCard entry={item} onLongPress={handleDelete} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* sag alt kosedeki + butonu */}
      <TouchableOpacity
        style={styles.fab}
        onPress={openModal}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* yeni kayit ekleme modali */}
      <Modal
        visible={isModalVisible}
        animationType="slide"           // Alttan yukarı kayma animasyonu
        presentationStyle="pageSheet"   // iOS'ta sayfa olarak sunar
        onRequestClose={() => setIsModalVisible(false)} // Android geri tuşu
      >
        {/* Klavye açıldığında içerik yukarı kayar */}
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={[styles.modalScroll, isDark && styles.darkModalScroll]}
            contentContainerStyle={styles.modalContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Modal Başlığı */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDark && styles.darkText]}>
                Yeni Gezi Kaydi
              </Text>
              {/* Kapatma butonu */}
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* ── Form Alanları ──────────────── */}

            {/* Şehir Adı (Zorunlu) */}
            <FormField label="Şehir Adı *" isDark={isDark}>
              <TextInput
                style={[styles.input, isDark && styles.darkInput]}
                placeholder="ör. İstanbul"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                value={formCityName}
                onChangeText={setFormCityName}
                autoCapitalize="words"
              />
            </FormField>

            {/* Ülke */}
            <FormField label="Ülke" isDark={isDark}>
              <TextInput
                style={[styles.input, isDark && styles.darkInput]}
                placeholder="ör. Türkiye"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                value={formCountry}
                onChangeText={setFormCountry}
                autoCapitalize="words"
              />
            </FormField>

            {/* Ziyaret Tarihi */}
            <FormField label="Ziyaret Tarihi (YYYY-AA-GG)" isDark={isDark}>
              <TextInput
                style={[styles.input, isDark && styles.darkInput]}
                placeholder="ör. 2025-06-15"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                value={formDate}
                onChangeText={setFormDate}
                keyboardType="numbers-and-punctuation"
                maxLength={10}  // YYYY-MM-DD = 10 karakter
              />
            </FormField>

            {/* Gezi Notu */}
            <FormField label="Gezi Notu" isDark={isDark}>
              <TextInput
                style={[styles.input, styles.textArea, isDark && styles.darkInput]}
                placeholder="Bu gezi nasıldı? Ne gördün, neler hissettin?"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                value={formNote}
                onChangeText={setFormNote}
                multiline              // Çok satırlı giriş
                numberOfLines={4}
                textAlignVertical="top" // Android için metnin üstten başlaması
              />
            </FormField>

            {/* Puan */}
            <FormField label="Puanın" isDark={isDark}>
              <StarRating
                rating={formRating}
                onRatingChange={setFormRating}
                size={32}             // Form için daha büyük yıldızlar
              />
            </FormField>

            {/* Kaydet Butonu */}
            <TouchableOpacity
              style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={isSaving}
              activeOpacity={0.85}
            >
              {isSaving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveBtnText}>Kaydet</Text>
              )}
            </TouchableOpacity>

            {/* İptal Butonu */}
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={[styles.cancelBtnText, isDark && { color: '#94A3B8' }]}>
                İptal
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────
// Yardımcı Fonksiyonlar
// ─────────────────────────────────────────

// bugunun tarihini YYYY-MM-DD formatinda dondurur
const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

// form alani - label + input
const FormField = ({
  label,
  children,
  isDark,
}: {
  label: string;
  children: React.ReactNode;
  isDark: boolean;
}) => (
  <View style={styles.fieldContainer}>
    <Text style={[styles.fieldLabel, isDark && { color: '#94A3B8' }]}>{label}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  darkContainer: {
    backgroundColor: '#0C1120',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Başlık ──
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
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
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  darkSubText: {
    color: '#94A3B8',
  },

  // ── Boş Durum ──
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 72,
    marginBottom: 16,
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

  // ── Liste ──
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100, // FAB ile üst üste gelmesin
  },

  // ── FAB (Floating Action Button) ──
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#0891B2',
    alignItems: 'center',
    justifyContent: 'center',
    // Gölge
    shadowColor: '#0891B2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  fabIcon: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '400',
    lineHeight: 32,
  },

  // ── Modal ──
  modalContainer: {
    flex: 1,
  },
  modalScroll: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  darkModalScroll: {
    backgroundColor: '#111827',
  },
  modalContent: {
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  closeBtn: {
    fontSize: 20,
    color: '#94A3B8',
    fontWeight: '600',
  },

  // ── Form Alanları ──
  fieldContainer: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
  },
  darkInput: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    color: '#F1F5F9',
  },
  textArea: {
    minHeight: 100,      // Çok satırlı not için minimum yükseklik
    paddingTop: 12,
  },

  // ── Kaydet / İptal Butonları ──
  saveBtn: {
    backgroundColor: '#0891B2',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  saveBtnDisabled: {
    backgroundColor: '#7EC8DC',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  cancelBtnText: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500',
  },
});
