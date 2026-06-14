/**
 * explore.tsx — Eski Kesfet Yonlendirmesi
 *
 * Uygulamanin eski sablonunda bulunan "/explore" rotasi artik
 * kullanilmamaktadir. "/gunluk" (Gunlugum sekmesi) adresine yonlendirilir.
 *
 * Bu dosya geriye donuk uyumluluk icin korunmaktadir.
 */

import { Redirect } from 'expo-router';

export default function Explore() {
  // "/explore" -> "/gunluk" yonlendirmesi
  // (tabs)/gunluk.tsx dosyasina karsilik gelir
  return <Redirect href={'/gunluk' as any} />;
}
