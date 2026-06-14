/**
 * weatherService.ts — Hava Durumu Servisi
 *
 * OpenWeatherMap API üzerinden şehirlerin güncel hava durumu verilerini çeker.
 * API Dökümantasyonu: https://openweathermap.org/current
 *
 * Kullanım:
 *   const weather = await fetchWeather('Istanbul');
 *
 * .env dosyasında EXPO_PUBLIC_OWM_API_KEY tanımlı olmalıdır.
 */

// ─────────────────────────────────────────
// Sabitler
// ─────────────────────────────────────────

/** Expo managed workflow'da EXPO_PUBLIC_ ön ekiyle tanımlanan env değişkenleri
 *  client bundle'a dahil edilir — asla hassas veri koyma */
const OWM_API_KEY = process.env.EXPO_PUBLIC_OWM_API_KEY ?? '';

/** OpenWeatherMap güncel hava durumu endpoint'i */
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// ─────────────────────────────────────────
// Tip Tanımlamaları
// ─────────────────────────────────────────

/** Uygulamada kullanılacak hava durumu verisi */
export interface WeatherData {
  temperature: number;   // Anlık sıcaklık (°C)
  feelsLike: number;     // Hissedilen sıcaklık (°C)
  description: string;   // Hava durumu açıklaması — Türkçe (lang=tr parametresiyle)
  humidity: number;      // Bağıl nem oranı (%)
  windSpeed: number;     // Rüzgar hızı (m/s)
  iconCode: string;      // OpenWeatherMap ikon kodu (örn. "01d", "10n")
}

// ─────────────────────────────────────────
// API Fonksiyonları
// ─────────────────────────────────────────

/**
 * Verilen şehir adına göre OpenWeatherMap'ten güncel hava durumu verisini çeker.
 *
 * @param cityName - İngilizce veya yerel şehir adı (örn. "Istanbul", "Paris")
 * @throws Ağ hatası, API hatası veya şehir bulunamama durumunda hata fırlatır
 */
export const fetchWeather = async (cityName: string): Promise<WeatherData> => {
  // API anahtarı yoksa anlamlı hata ver
  if (!OWM_API_KEY) {
    throw new Error(
      'API anahtarı bulunamadı. .env dosyasına EXPO_PUBLIC_OWM_API_KEY ekleyin.'
    );
  }

  // URL'i oluştur: şehir adını encode et, metrik birim (°C), Türkçe açıklama
  const url =
    `${BASE_URL}` +
    `?q=${encodeURIComponent(cityName)}` +
    `&appid=${OWM_API_KEY}` +
    `&units=metric` +   // Fahrenheit yerine Celsius
    `&lang=tr`;          // Türkçe hava durumu açıklaması

  const response = await fetch(url);

  // HTTP hata kodlarına göre kullanıcı dostu mesajlar
  if (!response.ok) {
    switch (response.status) {
      case 401:
        throw new Error('Geçersiz API anahtarı. Lütfen .env dosyasını kontrol edin.');
      case 404:
        throw new Error(`"${cityName}" şehri bulunamadı.`);
      case 429:
        throw new Error('API istek limiti aşıldı. Lütfen bir süre bekleyin.');
      default:
        throw new Error(`Hava durumu alınamadı (Hata ${response.status})`);
    }
  }

  // JSON yanıtını parse et
  const data = await response.json();

  // Gerekli alanları çıkar ve tip dönüşümü yap
  return {
    temperature: Math.round(data.main.temp),           // Ondalık yuvarlama
    feelsLike: Math.round(data.main.feels_like),
    description: data.weather[0].description,           // Türkçe açıklama (API'den gelir)
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 10) / 10,  // 1 ondalık basamak
    iconCode: data.weather[0].icon,                    // "01d", "02n" vb.
  };
};

// ─────────────────────────────────────────
// Yardımcı Fonksiyonlar
// ─────────────────────────────────────────

/**
 * OpenWeatherMap ikon koduna göre emoji döndürür.
 * Harici ikon kütüphanesi kullanmadan görsel geri bildirim sağlar.
 *
 * İkon kodu formatı: 2 rakam (durum) + 1 harf (d=gündüz / n=gece)
 * Tam liste: https://openweathermap.org/weather-conditions
 */
export const getWeatherEmoji = (iconCode: string): string => {
  // İlk 2 karakter hava durumu kategorisini belirler
  const code = iconCode.slice(0, 2);

  const emojiMap: Record<string, string> = {
    '01': '☀️',  // Açık hava
    '02': '⛅',  // Az bulutlu
    '03': '☁️',  // Dağınık bulutlu
    '04': '☁️',  // Çok bulutlu
    '09': '🌧️',  // Sağanak yağış
    '10': '🌦️',  // Yağmurlu
    '11': '⛈️',  // Gök gürültülü fırtına
    '13': '❄️',  // Karlı
    '50': '🌫️',  // Sisli
  };

  // Eşleşme bulunamazsa termometre emojisi göster
  return emojiMap[code] ?? '🌡️';
};
