import { enUS, es, fr, de, it, pt, nl, sv, da, nb, fi, pl, ru, zhCN, ja } from 'date-fns/locale';

const DATE_LOCALES = {
  en: enUS,
  es,
  fr,
  de,
  it,
  pt: pt,
  nl,
  sv,
  da,
  nb,
  fi,
  pl,
  ru,
  zh: zhCN,
  ja,
};

export function getDateLocale(lang) {
  return DATE_LOCALES[lang] ?? enUS;
}