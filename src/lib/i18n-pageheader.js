/**
 * i18n-pageheader.js
 *
 * Translation patch for the unified PageHeader component and the new
 * S-tier page-level UI introduced alongside the Dashboard redesign.
 *
 * Keys cover:
 *   - pageHeader.kicker.* — small uppercase eyebrow text shown above page titles
 *   - workout.startKicker — eyebrow on the Workout page primary CTA card
 *   - nutrition.prevDay / nextDay — accessible labels for the day navigator
 *
 * 8 keys × 15 languages = 120 entries. All values translated explicitly.
 *
 * Wired into i18n.js via a single import + spread into mergeTranslations().
 */

export const pageHeaderI18n = {
  en: {
    'pageHeader.kicker.progress':  'Your journey',
    'pageHeader.kicker.workout':   'Today\'s training',
    'pageHeader.kicker.today':     'Today',
    'pageHeader.kicker.yesterday': 'Yesterday',
    'pageHeader.kicker.tomorrow':  'Tomorrow',

    'nutrition.prevDay':           'Previous day',
    'nutrition.nextDay':           'Next day',
    'workout.startKicker':         'Ready when you are',
  },

  es: {
    'pageHeader.kicker.progress':  'Tu camino',
    'pageHeader.kicker.workout':   'Entrenamiento de hoy',
    'pageHeader.kicker.today':     'Hoy',
    'pageHeader.kicker.yesterday': 'Ayer',
    'pageHeader.kicker.tomorrow':  'Mañana',

    'nutrition.prevDay':           'Día anterior',
    'nutrition.nextDay':           'Día siguiente',
    'workout.startKicker':         'Cuando estés listo',
  },

  fr: {
    'pageHeader.kicker.progress':  'Votre parcours',
    'pageHeader.kicker.workout':   'Entraînement du jour',
    'pageHeader.kicker.today':     'Aujourd\'hui',
    'pageHeader.kicker.yesterday': 'Hier',
    'pageHeader.kicker.tomorrow':  'Demain',

    'nutrition.prevDay':           'Jour précédent',
    'nutrition.nextDay':           'Jour suivant',
    'workout.startKicker':         'Quand tu es prêt',
  },

  de: {
    'pageHeader.kicker.progress':  'Dein Weg',
    'pageHeader.kicker.workout':   'Heutiges Training',
    'pageHeader.kicker.today':     'Heute',
    'pageHeader.kicker.yesterday': 'Gestern',
    'pageHeader.kicker.tomorrow':  'Morgen',

    'nutrition.prevDay':           'Vorheriger Tag',
    'nutrition.nextDay':           'Nächster Tag',
    'workout.startKicker':         'Wenn du bereit bist',
  },

  pt: {
    'pageHeader.kicker.progress':  'Sua jornada',
    'pageHeader.kicker.workout':   'Treino de hoje',
    'pageHeader.kicker.today':     'Hoje',
    'pageHeader.kicker.yesterday': 'Ontem',
    'pageHeader.kicker.tomorrow':  'Amanhã',

    'nutrition.prevDay':           'Dia anterior',
    'nutrition.nextDay':           'Próximo dia',
    'workout.startKicker':         'Quando você estiver pronto',
  },

  it: {
    'pageHeader.kicker.progress':  'Il tuo percorso',
    'pageHeader.kicker.workout':   'Allenamento di oggi',
    'pageHeader.kicker.today':     'Oggi',
    'pageHeader.kicker.yesterday': 'Ieri',
    'pageHeader.kicker.tomorrow':  'Domani',

    'nutrition.prevDay':           'Giorno precedente',
    'nutrition.nextDay':           'Giorno successivo',
    'workout.startKicker':         'Quando sei pronto',
  },

  ja: {
    'pageHeader.kicker.progress':  'あなたの軌跡',
    'pageHeader.kicker.workout':   '今日のトレーニング',
    'pageHeader.kicker.today':     '今日',
    'pageHeader.kicker.yesterday': '昨日',
    'pageHeader.kicker.tomorrow':  '明日',

    'nutrition.prevDay':           '前日',
    'nutrition.nextDay':           '翌日',
    'workout.startKicker':         '準備ができたら',
  },

  ko: {
    'pageHeader.kicker.progress':  '나의 여정',
    'pageHeader.kicker.workout':   '오늘의 훈련',
    'pageHeader.kicker.today':     '오늘',
    'pageHeader.kicker.yesterday': '어제',
    'pageHeader.kicker.tomorrow':  '내일',

    'nutrition.prevDay':           '이전 날',
    'nutrition.nextDay':           '다음 날',
    'workout.startKicker':         '준비됐을 때',
  },

  zh: {
    'pageHeader.kicker.progress':  '你的旅程',
    'pageHeader.kicker.workout':   '今日训练',
    'pageHeader.kicker.today':     '今天',
    'pageHeader.kicker.yesterday': '昨天',
    'pageHeader.kicker.tomorrow':  '明天',

    'nutrition.prevDay':           '前一天',
    'nutrition.nextDay':           '后一天',
    'workout.startKicker':         '准备好就开始',
  },

  ar: {
    'pageHeader.kicker.progress':  'رحلتك',
    'pageHeader.kicker.workout':   'تمرين اليوم',
    'pageHeader.kicker.today':     'اليوم',
    'pageHeader.kicker.yesterday': 'أمس',
    'pageHeader.kicker.tomorrow':  'غداً',

    'nutrition.prevDay':           'اليوم السابق',
    'nutrition.nextDay':           'اليوم التالي',
    'workout.startKicker':         'عندما تكون جاهزًا',
  },

  hi: {
    'pageHeader.kicker.progress':  'आपकी यात्रा',
    'pageHeader.kicker.workout':   'आज की ट्रेनिंग',
    'pageHeader.kicker.today':     'आज',
    'pageHeader.kicker.yesterday': 'कल',
    'pageHeader.kicker.tomorrow':  'कल',

    'nutrition.prevDay':           'पिछला दिन',
    'nutrition.nextDay':           'अगला दिन',
    'workout.startKicker':         'जब आप तैयार हों',
  },

  ru: {
    'pageHeader.kicker.progress':  'Твой путь',
    'pageHeader.kicker.workout':   'Сегодняшняя тренировка',
    'pageHeader.kicker.today':     'Сегодня',
    'pageHeader.kicker.yesterday': 'Вчера',
    'pageHeader.kicker.tomorrow':  'Завтра',

    'nutrition.prevDay':           'Предыдущий день',
    'nutrition.nextDay':           'Следующий день',
    'workout.startKicker':         'Когда будешь готов',
  },

  tr: {
    'pageHeader.kicker.progress':  'Senin yolculuğun',
    'pageHeader.kicker.workout':   'Bugünkü antrenman',
    'pageHeader.kicker.today':     'Bugün',
    'pageHeader.kicker.yesterday': 'Dün',
    'pageHeader.kicker.tomorrow':  'Yarın',

    'nutrition.prevDay':           'Önceki gün',
    'nutrition.nextDay':           'Sonraki gün',
    'workout.startKicker':         'Hazır olduğunda',
  },

  pl: {
    'pageHeader.kicker.progress':  'Twoja droga',
    'pageHeader.kicker.workout':   'Dzisiejszy trening',
    'pageHeader.kicker.today':     'Dziś',
    'pageHeader.kicker.yesterday': 'Wczoraj',
    'pageHeader.kicker.tomorrow':  'Jutro',

    'nutrition.prevDay':           'Poprzedni dzień',
    'nutrition.nextDay':           'Następny dzień',
    'workout.startKicker':         'Gdy będziesz gotowy',
  },

  nl: {
    'pageHeader.kicker.progress':  'Jouw reis',
    'pageHeader.kicker.workout':   'Training van vandaag',
    'pageHeader.kicker.today':     'Vandaag',
    'pageHeader.kicker.yesterday': 'Gisteren',
    'pageHeader.kicker.tomorrow':  'Morgen',

    'nutrition.prevDay':           'Vorige dag',
    'nutrition.nextDay':           'Volgende dag',
    'workout.startKicker':         'Wanneer je klaar bent',
  },
};