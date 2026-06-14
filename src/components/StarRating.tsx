/**
 * StarRating.tsx — Yıldız Puanlama Bileşeni
 *
 * 1'den 5'e kadar yıldız puanı görüntüler ve girişine olanak tanır.
 * "readonly" prop'u ile salt okunur (sadece görüntüleme) moduna geçilir.
 *
 * Kullanım örnekleri:
 *   <StarRating rating={4} onRatingChange={setRating} />     ← Girdi modu
 *   <StarRating rating={3} readonly />                        ← Görüntüleme modu
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// ─────────────────────────────────────────
// Tip Tanımlamaları
// ─────────────────────────────────────────

interface StarRatingProps {
  rating: number;                           // Mevcut puan (1–5)
  onRatingChange?: (rating: number) => void; // Puan değişince çağrılacak callback (opsiyonel)
  readonly?: boolean;                        // true ise tıklanamaz — varsayılan: false
  size?: number;                             // Yıldız emoji font boyutu — varsayılan: 24
}

// ─────────────────────────────────────────
// Bileşen
// ─────────────────────────────────────────

export const StarRating = ({
  rating,
  onRatingChange,
  readonly = false,
  size = 24,
}: StarRatingProps) => {
  // 1'den 5'e kadar yıldız indisleri
  const stars = [1, 2, 3, 4, 5];

  return (
    <View style={styles.container}>
      {stars.map((star) => (
        <TouchableOpacity
          key={star}
          // Readonly modda dokunma devre dışı
          onPress={() => {
            if (!readonly && onRatingChange) {
              onRatingChange(star);
            }
          }}
          disabled={readonly}
          // Tıklanabilir alanı büyüt
          hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          style={styles.star}
          activeOpacity={readonly ? 1 : 0.7}
        >
          <Text style={{ fontSize: size }}>
            {/* Dolulu yıldız (≤ mevcut puan) veya boş yıldız */}
            {star <= rating ? '⭐' : '☆'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// ─────────────────────────────────────────
// Stiller
// ─────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',   // Yıldızları yan yana diz
    alignItems: 'center',
  },
  star: {
    marginRight: 2,          // Yıldızlar arası küçük boşluk
  },
});
