/**
 * index.tsx - Kok Yonlendirme
 *
 * Uygulama acildiginda "/" (kok) URL'e yapilan istek buraya gelir.
 * Ilk sekme ekrani olan "Kesfet" ekranina yonlendirilir.
 */

import { Redirect } from 'expo-router';

export default function Index() {
  // "/" -> "/kesfet" yonlendirmesi
  return <Redirect href={'/kesfet' as any} />;
}
