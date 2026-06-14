/**
 * cities.ts — Sabit Şehir Verisi
 *
 * Uygulamada gösterilen 10 popüler şehrin tüm bilgilerini içerir.
 * Gerçek bir API çağrısı yapılmadığı için şehir konumları (enlem/boylam),
 * Unsplash görsel URL'leri ve gezilecek yerler burada sabit olarak tanımlanmıştır.
 */

// ─────────────────────────────────────────
// Tip Tanımlamaları
// ─────────────────────────────────────────

/** Gezilecek yer bilgisi */
export interface Place {
  name: string;         // Yer adı
  description: string;  // Kısa açıklama
  icon: string;         // Emoji ikon
}

/** Şehir bilgisi */
export interface City {
  id: string;           // URL-safe benzersiz kimlik (navigasyonda /city/:id olarak kullanılır)
  name: string;         // Şehir adı (Türkçe)
  country: string;      // Ülke adı
  latitude: number;     // Enlem — harita merkezlemesi için
  longitude: number;    // Boylam — harita merkezlemesi için
  imageUrl: string;     // Unsplash şehir fotoğrafı URL'i
  description: string;  // Kısa şehir tanımı
  places: Place[];      // Gezilecek yer önerileri (4–6 adet)
}

// ─────────────────────────────────────────
// Popüler Şehirler Listesi
// ─────────────────────────────────────────

export const CITIES: City[] = [
  // ── 1. İstanbul ──────────────────────────
  {
    id: 'istanbul',
    name: 'İstanbul',
    country: 'Türkiye',
    latitude: 41.0082,
    longitude: 28.9784,
    imageUrl:
      'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&auto=format&fit=crop',
    description: 'İki kıtaya yayılan, tarihin ve modernliğin buluştuğu eşsiz şehir.',
    places: [
      { name: 'Ayasofya', description: 'Bizans ve Osmanlı mirasının simgesi', icon: '🕌' },
      { name: 'Topkapı Sarayı', description: "Osmanlı İmparatorluğu'nun kalbi", icon: '🏰' },
      { name: 'Kapalıçarşı', description: "Dünyanın en büyük kapalı çarşılarından", icon: '🛍️' },
      { name: 'Boğaz Turu', description: "Avrupa ile Asya'yı birleştiren muhteşem su yolu", icon: '⛵' },
      { name: 'Galata Kulesi', description: "Şehrin tarihi sembolü ve panoramik manzarası", icon: '🗼' },
    ],
  },

  // ── 2. Paris ─────────────────────────────
  {
    id: 'paris',
    name: 'Paris',
    country: 'Fransa',
    latitude: 48.8566,
    longitude: 2.3522,
    imageUrl:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop',
    description: "Aşk, sanat ve gastronomi şehri; Avrupa'nın kültür başkenti.",
    places: [
      { name: 'Eyfel Kulesi', description: "Fransa'nın ikonik sembolü", icon: '🗼' },
      { name: 'Louvre Müzesi', description: "Dünyanın en büyük sanat müzesi", icon: '🎨' },
      { name: 'Notre-Dame Katedrali', description: 'Gotik mimarinin şaheseri', icon: '⛪' },
      { name: 'Champs-Élysées', description: "Paris'in ünlü bulvarı ve alışveriş caddesi", icon: '🛍️' },
      { name: 'Versailles Sarayı', description: 'Fransız kraliyet mirasının merkezi', icon: '👑' },
    ],
  },

  // ── 3. Tokyo ─────────────────────────────
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japonya',
    latitude: 35.6762,
    longitude: 139.6503,
    imageUrl:
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop',
    description: "Gelenekle modernliğin mükemmel sentezi; dünyanın en kalabalık metropolü.",
    places: [
      { name: 'Senso-ji Tapınağı', description: "Tokyo'nun en eski Budist tapınağı", icon: '⛩️' },
      { name: 'Şibuya Kavşağı', description: "Dünyanın en yoğun yaya geçidi", icon: '🚶' },
      { name: 'Akihabara', description: 'Elektronik ve anime kültürünün merkezi', icon: '🎮' },
      { name: 'Fuji Dağı', description: "Japonya'nın kutsal dağı ve ulusal sembolü", icon: '🗻' },
      { name: 'Tsukiji Pazarı', description: 'Taze deniz ürünleri için dünyaca ünlü pazar', icon: '🐟' },
    ],
  },

  // ── 4. New York ───────────────────────────
  {
    id: 'new-york',
    name: 'New York',
    country: 'ABD',
    latitude: 40.7128,
    longitude: -74.006,
    imageUrl:
      'https://images.unsplash.com/photo-1492644383167-49d99e3fddb7?w=800&auto=format&fit=crop',
    description: "Fırsatlar şehri; milyonların rüyasını süsleyen dev metropol.",
    places: [
      { name: 'Özgürlük Heykeli', description: "Amerika'nın özgürlük ve demokrasi sembolü", icon: '🗽' },
      { name: 'Central Park', description: 'Şehrin yeşil akciğeri; dinlence alanı', icon: '🌳' },
      { name: 'Times Square', description: "Dünyanın en hareketli meydanı", icon: '🌆' },
      { name: 'Empire State Binası', description: 'Art Deco mimarisinin ikonik yapısı', icon: '🏙️' },
      { name: 'Brooklyn Köprüsü', description: 'Tarihi ve büyüleyici asma köprü', icon: '🌉' },
    ],
  },

  // ── 5. Barselona ──────────────────────────
  {
    id: 'barcelona',
    name: 'Barselona',
    country: 'İspanya',
    latitude: 41.3851,
    longitude: 2.1734,
    imageUrl:
      'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&auto=format&fit=crop',
    description: "Gaudi'nin eserleriyle bezeli, sanat dolu Akdeniz kenti.",
    places: [
      { name: 'Sagrada Familia', description: "Gaudi'nin tamamlanmamış başyapıtı kilise", icon: '⛪' },
      { name: 'Park Güell', description: 'Mozaik süslemeli büyüleyici doğal park', icon: '🌿' },
      { name: 'La Rambla', description: "Şehrin en ünlü yürüyüş caddesi", icon: '🚶' },
      { name: 'Barselona Plajları', description: "Akdeniz'in en güzel plajları", icon: '🏖️' },
      { name: 'Gotik Mahalle', description: 'Ortaçağdan kalma tarihi taş sokaklar', icon: '🏛️' },
    ],
  },

  // ── 6. Roma ───────────────────────────────
  {
    id: 'rome',
    name: 'Roma',
    country: 'İtalya',
    latitude: 41.9028,
    longitude: 12.4964,
    imageUrl:
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop',
    description: "Ebedi şehir; antik uygarlığın kalbinde tarihin derin izleri.",
    places: [
      { name: 'Kolezyum', description: "Antik Roma'nın en büyük amfitiyatrosu", icon: '🏛️' },
      { name: 'Vatikan', description: 'Katolik dünyasının ruhi ve idari merkezi', icon: '⛪' },
      { name: 'Trevi Çeşmesi', description: 'Efsanevi dilek çeşmesi', icon: '⛲' },
      { name: 'Forum Romanum', description: "Roma İmparatorluğu'nun siyasi kalbi", icon: '🏺' },
      { name: 'Pantheon', description: 'Mükemmel korunmuş antik tapınak', icon: '🕍' },
    ],
  },

  // ── 7. Dubai ──────────────────────────────
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'Birleşik Arap Emirlikleri',
    latitude: 25.2048,
    longitude: 55.2708,
    imageUrl:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop',
    description: 'Çölün ortasında yükselen ultra modern şehir; lüksün başkenti.',
    places: [
      { name: 'Burj Khalifa', description: "Dünyanın en uzun binası (828 m)", icon: '🏙️' },
      { name: 'Dubai Mall', description: "Dünyanın en büyük alışveriş merkezlerinden", icon: '🛍️' },
      { name: 'Palm Jumeirah', description: 'Yapay palmiye adası ve lüks tatil köyleri', icon: '🌴' },
      { name: 'Çöl Safari', description: 'Safaride gün batımı ve geleneksel Bedevi gecesi', icon: '🏜️' },
      { name: 'Dubai Marina', description: 'Teknelerle dolu muhteşem yat limanı', icon: '⛵' },
    ],
  },

  // ── 8. Amsterdam ─────────────────────────
  {
    id: 'amsterdam',
    name: 'Amsterdam',
    country: 'Hollanda',
    latitude: 52.3676,
    longitude: 4.9041,
    imageUrl:
      'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&auto=format&fit=crop',
    description: 'Kanallar, bisikletler ve lale bahçeleriyle eşsiz Kuzey Avrupa kenti.',
    places: [
      { name: 'Anne Frank Evi', description: 'İkinci Dünya Savaşı tarihinin önemli müzesi', icon: '🏠' },
      { name: 'Rijksmuseum', description: 'Hollanda sanat ve tarih müzesi', icon: '🎨' },
      { name: 'Kanal Turu', description: 'Tarihi kanallar boyunca tekne gezisi', icon: '🚤' },
      { name: 'Keukenhof', description: "Dünyanın en büyük lale bahçesi", icon: '🌷' },
      { name: 'Vondelpark', description: "Şehrin kalbindeki büyük şehir parkı", icon: '🌳' },
    ],
  },

  // ── 9. Sidney ────────────────────────────
  {
    id: 'sydney',
    name: 'Sidney',
    country: 'Avustralya',
    latitude: -33.8688,
    longitude: 151.2093,
    imageUrl:
      'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&auto=format&fit=crop',
    description: "Opera Binası ve Köprüsüyle dünyaca tanınan Avustralya'nın incisi.",
    places: [
      { name: 'Opera Binası', description: 'Modern mimarinin ikonik başyapıtı', icon: '🎭' },
      { name: 'Sydney Köprüsü', description: 'Tırmanılabilir tarihi liman köprüsü', icon: '🌉' },
      { name: 'Bondi Beach', description: "Sörfçülerin gözde plajı", icon: '🏄' },
      { name: 'Blue Mountains', description: 'Nefes kesen doğal park ve kanyonlar', icon: '🏔️' },
      { name: 'Darling Harbour', description: 'Restoranlar ve eğlence merkezi', icon: '🌊' },
    ],
  },

  // ── 10. Prag ─────────────────────────────
  {
    id: 'prague',
    name: 'Prag',
    country: 'Çekya',
    latitude: 50.0755,
    longitude: 14.4378,
    imageUrl:
      'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&auto=format&fit=crop',
    description: "Gotik kuleler ve tarihi köprülerle süslü Orta Avrupa'nın masallar şehri.",
    places: [
      { name: 'Praha Kalesi', description: "Avrupa'nın en büyük ortaçağ kalesi", icon: '🏰' },
      { name: 'Charles Köprüsü', description: 'Heykellerle bezeli tarihi taş köprü', icon: '🌉' },
      { name: 'Eski Şehir Meydanı', description: 'Astronomik saat ve gotik kiliseler', icon: '⛪' },
      { name: 'Zlatá Ulička', description: "Ortaçağ'dan kalma renkli dar sokak", icon: '🏘️' },
      { name: 'Kafka Müzesi', description: 'Dünyaca ünlü yazar Franz Kafka müzesi', icon: '📚' },
    ],
  },
];
