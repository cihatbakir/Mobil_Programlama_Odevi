// gunluk karti - her kaydi listede gosterir, uzun basinca silinir

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { JournalEntry } from '@/services/storageService';
import { StarRating } from './StarRating';

// ─────────────────────────────────────────
// Tip Tanımlamaları
// ─────────────────────────────────────────

interface JournalEntryCardProps {
  entry: JournalEntry;                // Gösterilecek günlük kaydı
  onLongPress: (id: string) => void;  // Uzun basınca çağrılır (silme için)
}

// ─────────────────────────────────────────
// Bileşen
// ─────────────────────────────────────────

export const JournalEntryCard = ({ entry, onLongPress }: JournalEntryCardProps) => {
  // tarih formatini cevir: YYYY-MM-DD -> DD.MM.YYYY
  const formattedDate = entry.visitDate
    ? entry.visitDate.split('-').reverse().join('.')
    : '—';

  // notu kisalt
  const NOTE_PREVIEW_LENGTH = 100;
  const notePreview =
    entry.note.length > NOTE_PREVIEW_LENGTH
      ? `${entry.note.substring(0, NOTE_PREVIEW_LENGTH)}…`
      : entry.note;

  return (
    <TouchableOpacity
      style={styles.card}
      onLongPress={() => onLongPress(entry.id)}
      // Uzun basma süresi (ms) — varsayılan 500ms yeterli
      delayLongPress={500}
      activeOpacity={0.85}
    >
      {/* ── Kart Başlığı ──────────────────── */}
      <View style={styles.header}>
        {/* Sol: Şehir ve ülke */}
        <View style={styles.cityBlock}>
          <Text style={styles.cityName} numberOfLines={1}>
            {entry.cityName}
          </Text>
          <Text style={styles.country} numberOfLines={1}>
            {entry.country}
          </Text>
        </View>
        {/* Sağ: Ziyaret tarihi */}
        <Text style={styles.date}>{formattedDate}</Text>
      </View>

      {/* ── Not Önizlemesi ────────────────── */}
      {notePreview ? (
        <Text style={styles.note} numberOfLines={3}>
          {notePreview}
        </Text>
      ) : (
        <Text style={styles.emptyNote}>Not eklenmemiş.</Text>
      )}

      {/* ── Alt Bilgi: Puan + Silme İpucu ── */}
      <View style={styles.footer}>
        {/* Yıldız puanı — salt okunur modda */}
        <StarRating rating={entry.rating} readonly size={16} />
        {/* Silme ipucu */}
        <Text style={styles.deleteHint}>Silmek için basılı tut</Text>
      </View>
    </TouchableOpacity>
  );
};

// ─────────────────────────────────────────
// Stiller
// ─────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    // Kart gölgesi (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    // Kart gölgesi (Android)
    elevation: 3,
    // Sol kenarda renk çizgisi — seyahat teması
    borderLeftWidth: 4,
    borderLeftColor: '#0891B2',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  cityBlock: {
    flex: 1,
    marginRight: 10,
  },
  cityName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  country: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: '#0891B2',
    fontWeight: '600',
    flexShrink: 0, // Tarihin kesilmesini engelle
  },
  note: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
    marginBottom: 12,
  },
  emptyNote: {
    fontSize: 14,
    color: '#94A3B8',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  deleteHint: {
    fontSize: 10,
    color: '#CBD5E1',
    fontStyle: 'italic',
  },
});
