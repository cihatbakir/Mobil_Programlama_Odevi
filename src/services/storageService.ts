/**
 * storageService.ts — AsyncStorage CRUD Servisi
 *
 * Seyahat günlüğü verilerini AsyncStorage'da saklar, okur ve siler.
 * Tüm işlemler async/await ile yönetilir; hata durumları yakalanır.
 *
 * Depolama anahtarı: 'travel_journal'
 * Veri formatı: JSON.stringify ile serileştirilmiş JournalEntry dizisi
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ─────────────────────────────────────────
// Sabitler
// ─────────────────────────────────────────

/** AsyncStorage'daki veri anahtarı — tüm günlük kayıtları bu key altında tutulur */
const STORAGE_KEY = 'travel_journal';

// ─────────────────────────────────────────
// Tip Tanımlamaları
// ─────────────────────────────────────────

/** Tek bir seyahat günlüğü kaydının veri modeli */
export interface JournalEntry {
  id: string;        // Benzersiz kimlik (generateId() tarafından üretilir)
  cityName: string;  // Ziyaret edilen şehir adı
  country: string;   // Ülke adı
  visitDate: string; // Ziyaret tarihi — "YYYY-MM-DD" formatında saklanır
  note: string;      // Kullanıcının gezi notu (serbest metin)
  rating: number;    // Kullanıcı puanı — 1'den 5'e kadar tam sayı
  createdAt: string; // Kaydın oluşturulma zamanı — ISO 8601 formatı
}

// ─────────────────────────────────────────
// CRUD Fonksiyonları
// ─────────────────────────────────────────

/**
 * Tüm günlük kayıtlarını AsyncStorage'dan okur.
 * Veri yoksa boş dizi döner; JSON parse hatası olursa boş dizi döner.
 */
export const loadJournal = async (): Promise<JournalEntry[]> => {
  try {
    const rawData = await AsyncStorage.getItem(STORAGE_KEY);

    // Veri yoksa boş günlük döndür
    if (!rawData) return [];

    // JSON string'i JavaScript nesnesine dönüştür
    return JSON.parse(rawData) as JournalEntry[];
  } catch (error) {
    // JSON bozuksa veya AsyncStorage erişim hatası olursa güvenli çıkış
    console.error('[storageService] Günlük yüklenirken hata oluştu:', error);
    return [];
  }
};

/**
 * Yeni bir günlük kaydı ekler.
 * Yeni kayıt listenin en başına eklenir (en yenisi en üstte görünür).
 *
 * @param newEntry - Eklenecek günlük kaydı
 * @throws AsyncStorage yazma hatası durumunda hata fırlatır
 */
export const saveEntry = async (newEntry: JournalEntry): Promise<void> => {
  try {
    const existing = await loadJournal();

    // Yeni kaydı listenin başına ekle (ters kronolojik sıra)
    const updated = [newEntry, ...existing];

    // Güncellenmiş diziyi JSON olarak AsyncStorage'a yaz
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('[storageService] Kayıt eklenirken hata oluştu:', error);
    // Hatayı yukarıya ilet; çağıran fonksiyon kullanıcıya bildirebilir
    throw error;
  }
};

/**
 * Belirtilen ID'ye sahip günlük kaydını siler.
 * ID eşleşmesi yapılarak o kayıt diziden çıkarılır ve yeniden kaydedilir.
 *
 * @param id - Silinecek kaydın benzersiz kimliği
 * @throws AsyncStorage yazma hatası durumunda hata fırlatır
 */
export const deleteEntry = async (id: string): Promise<void> => {
  try {
    const existing = await loadJournal();

    // ID'si eşleşmeyen kayıtları sakla (eşleşeni filtrele)
    const updated = existing.filter((entry) => entry.id !== id);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('[storageService] Kayıt silinirken hata oluştu:', error);
    throw error;
  }
};

// ─────────────────────────────────────────
// Yardımcı Fonksiyonlar
// ─────────────────────────────────────────

/**
 * Benzersiz ID üreteci.
 * 'react-native-uuid' gibi harici kütüphane gerektirmeden benzersiz kimlik oluşturur.
 * Zaman damgası + rastgele sayı kombinasyonu çakışma olasılığını minimize eder.
 *
 * Örnek çıktı: "1748947200000-k3f7m2x9a"
 */
export const generateId = (): string => {
  const timestamp = Date.now();                               // Milisaniye cinsinden zaman
  const randomPart = Math.random().toString(36).substring(2, 11); // Base-36 rastgele string
  return `${timestamp}-${randomPart}`;
};
