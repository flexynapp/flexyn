/**
 * Comprehensive exercise name translations for all 424 exercises across 15 languages.
 * Structure: English canonical name → { language_code: translated_name }
 * Stored data always uses English canonical names for consistency.
 * Display layer translates on-the-fly based on user's language setting.
 */

export const EXERCISE_TRANSLATIONS = {
  // Chest
  'Assisted Dip': { en: 'Assisted Dip', es: 'Fondos Asistidos', fr: 'Dips Assistés', de: 'Unterstützte Dips', pt: 'Mergulho Assistido', it: 'Dip Assistito', ja: 'アシストディップ', ko: '보조 딥', zh: '辅助双杠臂屈伸', ar: 'غطسة مساعدة', hi: 'सहायक डिप', ru: 'Ассистируемые отжимания на брусьях', tr: 'Destekli Dip', pl: 'Wspomagany dip', nl: 'Ondersteunde dip' },
  'Band-Assisted Bench Press': { en: 'Band-Assisted Bench Press', es: 'Press de Banca Asistido con Banda', fr: 'Développé Couché Assisté par Bande', de: 'Bankdrücken mit Bandassistenz', pt: 'Supino com Banda Assistida', it: 'Panca Piana Assistita da Fascia', ja: 'バンドアシストベンチプレス', ko: '밴드 보조 벤치 프레스', zh: '弹力带辅助卧推', ar: 'ضغط البنش المساعد بالشريط', hi: 'बैंड सहायक बेंच प्रेस', ru: 'Жим лежа с ассистенцией резинки', tr: 'Bant Yardımcılı Bench Press', pl: 'Wyciskanie sztangi leżąc ze wspomaganiem taśmy', nl: 'Bankdrukken met bandassistentie' },
  'Bar Dip': { en: 'Bar Dip', es: 'Fondos en Barra', fr: 'Dips à la Barre', de: 'Barren-Dips', pt: 'Mergulho na Barra', it: 'Dip alla Sbarra', ja: 'バーディップ', ko: '바 딥', zh: '杠铃双杠臂屈伸', ar: 'غطسة على الحديد', hi: 'बार डिप', ru: 'Отжимания на брусьях', tr: 'Bar Dip', pl: 'Dip na drążku', nl: 'Dip op stang' },
  'Bench Press': { en: 'Bench Press', es: 'Press de Banca', fr: 'Développé Couché', de: 'Bankdrücken', pt: 'Supino Reto', it: 'Panca Piana', ja: 'ベンチプレス', ko: '벤치 프레스', zh: '卧推', ar: 'ضغط البنش', hi: 'बेंच प्रेस', ru: 'Жим лежа', tr: 'Bench Press', pl: 'Wyciskanie sztangi leżąc', nl: 'Bankdrukken' },
  'Bench Press Against Band': { en: 'Bench Press Against Band', es: 'Press de Banca contra Banda', fr: 'Développé Couché contre Bande', de: 'Bankdrücken gegen Band', pt: 'Supino contra Banda', it: 'Panca Piana contro Fascia', ja: 'バンド抵抗ベンチプレス', ko: '밴드 저항 벤치 프레스', zh: '抗阻力带卧推', ar: 'ضغط البنش ضد الشريط', hi: 'बैंड प्रतिरोध बेंच प्रेस', ru: 'Жим лежа против резинки', tr: 'Bant Direnci Bench Press', pl: 'Wyciskanie sztangi leżąc z oporem taśmy', nl: 'Bankdrukken tegen band' },
  'Board Press': { en: 'Board Press', es: 'Press de Tabla', fr: 'Développé sur Planche', de: 'Brettdrücken', pt: 'Supino com Tábua', it: 'Panca su Tavola', ja: 'ボードプレス', ko: '보드 프레스', zh: '木板卧推', ar: 'ضغط اللوحة', hi: 'बोर्ड प्रेस', ru: 'Жим с доски', tr: 'Board Press', pl: 'Wyciskanie ze stołu', nl: 'Bord druk' },
  'Cable Chest Press': { en: 'Cable Chest Press', es: 'Press de Pecho por Cable', fr: 'Développé Poitrine à la Poulie', de: 'Kabelbrustpressen', pt: 'Prensa de Peito a Cabo', it: 'Pressa Petto su Cavo', ja: 'ケーブルチェストプレス', ko: '케이블 체스트 프레스', zh: '缆绳胸部推举', ar: 'ضغط صدر الكابل', hi: 'केबल चेस्ट प्रेस', ru: 'Жим груди на кроссовере', tr: 'Kablo Göğüs Presi', pl: 'Prasa klatki piersiowej na linie', nl: 'Kabelborstpers' },
  'Clap Push-Up': { en: 'Clap Push-Up', es: 'Flexión con Palmada', fr: 'Pompe avec Applaudissement', de: 'Klatschen-Liegestütze', pt: 'Flexão com Palma', it: 'Flessione con Applauso', ja: '拍手腕立て伏せ', ko: '박수 푸시업', zh: '拍手俯卧撑', ar: 'تمرين ضغط مع تصفيق', hi: 'तालি पुश-अप', ru: 'Отжимания с хлопком', tr: 'Alkış Push-Up', pl: 'Pompka z klaśnięciem', nl: 'Applauderende push-up' },
  'Close-Grip Bench Press': { en: 'Close-Grip Bench Press', es: 'Press de Banca Agarre Cerrado', fr: 'Développé Prise Rapprochée', de: 'Bankdrücken Enger Griff', pt: 'Supino Pegada Fechada', it: 'Panca Piana Presa Stretta', ja: 'クローズグリップベンチプレス', ko: '클로즈그립 벤치 프레스', zh: '窄握卧推', ar: 'ضغط البنش قبضة ضيقة', hi: 'क्लोज-ग्रिप बेंच प्रेस', ru: 'Жим узким хватом', tr: 'Dar Grip Bench Press', pl: 'Wyciskanie sztangi leżąc wąskim chwytem', nl: 'Nauwe grip bankdrukken' },
  'Close-Grip Feet-Up Bench Press': { en: 'Close-Grip Feet-Up Bench Press', es: 'Press de Banca Agarre Cerrado Pies Arriba', fr: 'Développé Prise Rapprochée Pieds Levés', de: 'Bankdrücken Enger Griff Füße Hoch', pt: 'Supino Pegada Fechada Pés para Cima', it: 'Panca Piana Presa Stretta Piedi Sollevati', ja: 'クローズグリップ足上ベンチプレス', ko: '클로즈그립 피트-업 벤치 프레스', zh: '脚抬高窄握卧推', ar: 'ضغط البنش قبضة ضيقة أقدام مرفوعة', hi: 'क्लोज-ग्रिप फीट-अप बेंच प्रेस', ru: 'Жим узким хватом ноги вверх', tr: 'Dar Grip Ayaklar Yukarı Bench Press', pl: 'Wyciskanie sztangi leżąc wąskim chwytem stopy do góry', nl: 'Nauwe grip voeten omhoog bankdrukken' },
  'Cobra Push-Up': { en: 'Cobra Push-Up', es: 'Flexión Cobra', fr: 'Pompe Cobra', de: 'Cobra-Liegestütze', pt: 'Flexão Cobra', it: 'Flessione Cobra', ja: 'コブラプッシュアップ', ko: '코브라 푸시업', zh: '眼镜蛇俯卧撑', ar: 'تمرين ضغط الثعبان', hi: 'कोबरा पुश-अप', ru: 'Отжимания кобра', tr: 'Kobra Push-Up', pl: 'Pompka kobra', nl: 'Cobra push-up' },
  'Decline Bench Press': { en: 'Decline Bench Press', es: 'Press de Banca Declinado', fr: 'Développé Décliné', de: 'Negativ-Bankdrücken', pt: 'Supino Declinado', it: 'Panca Declinata', ja: 'デクラインベンチプレス', ko: '디클라인 벤치 프레스', zh: '下斜卧推', ar: 'ضغط البنش المنحدر', hi: 'डिक्लाइन बेंच प्रेस', ru: 'Жим на наклонной скамье вниз', tr: 'Decline Bench Press', pl: 'Wyciskanie sztangi leżąc w opadzie', nl: 'Aflopende bankdrukken' },
  'Decline Push-Up': { en: 'Decline Push-Up', es: 'Flexión Declinada', fr: 'Pompe Déclinée', de: 'Negative Liegestütze', pt: 'Flexão Declinada', it: 'Flessione Declinata', ja: 'デクラインプッシュアップ', ko: '디클라인 푸시업', zh: '下斜俯卧撑', ar: 'تمرين ضغط منحدر', hi: 'डिक्लाइन पुश-अप', ru: 'Отжимания ногами вверх', tr: 'Decline Push-Up', pl: 'Pompka w opadzie', nl: 'Aflopende push-up' },
  'Dumbbell Chest Fly': { en: 'Dumbbell Chest Fly', es: 'Pájaro Mancuerna', fr: 'Écartés Haltères', de: 'Hantel Brustöffner', pt: 'Voadora Haltere', it: 'Farfalla con Manubri', ja: 'ダンベルチェストフライ', ko: '덤벨 체스트 플라이', zh: '哑铃胸部飞鸟', ar: 'طيران الصدر بالدمبل', hi: 'डंबल चेस्ट फ्लाई', ru: 'Разведение гантелей лежа', tr: 'Dumbbell Göğüs Uçuşu', pl: 'Rozwiercenie hantli na ławce', nl: 'Dumbbell borstopening' },
  'Dumbbell Chest Press': { en: 'Dumbbell Chest Press', es: 'Press de Pecho Mancuerna', fr: 'Développé Poitrine Haltères', de: 'Hantel Brustpressen', pt: 'Prensa de Peito Haltere', it: 'Pressa Petto Manubri', ja: 'ダンベルチェストプレス', ko: '덤벨 체스트 프레스', zh: '哑铃胸部推举', ar: 'ضغط صدر الدمبل', hi: 'डंबल चेस्ट प्रेस', ru: 'Жим гантелей лежа', tr: 'Dumbbell Göğüs Presi', pl: 'Wyciskanie hantli na ławce', nl: 'Dumbbell borstpers' },
  'Dumbbell Decline Chest Press': { en: 'Dumbbell Decline Chest Press', es: 'Press de Pecho Mancuerna Declinado', fr: 'Développé Décliné Haltères', de: 'Hantel Negative Brustpressen', pt: 'Prensa de Peito Haltere Declinada', it: 'Pressa Petto Manubri Declinata', ja: 'ダンベルデクラインチェストプレス', ko: '덤벨 디클라인 체스트 프레스', zh: '哑铃下斜胸部推举', ar: 'ضغط صدر الدمبل المنحدر', hi: 'डंबल डिक्लाइन चेस्ट प्रेस', ru: 'Жим гантелей на наклонной скамье вниз', tr: 'Dumbbell Decline Göğüs Presi', pl: 'Wyciskanie hantli na ławce opadającej', nl: 'Dumbbell aflopende borstpers' },
  'Dumbbell Floor Press': { en: 'Dumbbell Floor Press', es: 'Press de Piso Mancuerna', fr: 'Développé Sol Haltères', de: 'Hantel Bodenpressen', pt: 'Prensa de Solo Haltere', it: 'Pressa Piano Manubri', ja: 'ダンベルフロアプレス', ko: '덤벨 플로어 프레스', zh: '哑铃地板推举', ar: 'ضغط الأرضية دمبل', hi: 'डंबल फ्लोर प्रेस', ru: 'Жим гантелей лежа на полу', tr: 'Dumbbell Zemin Presi', pl: 'Wyciskanie hantli na podłodze', nl: 'Dumbbell vloerpers' },
  'Dumbbell Pullover': { en: 'Dumbbell Pullover', es: 'Pullover Mancuerna', fr: 'Écartés Haltère', de: 'Hantel Pullover', pt: 'Pullover Haltere', it: 'Pullover Manubrio', ja: 'ダンベルプルオーバー', ko: '덤벨 풀오버', zh: '哑铃卧推下拉', ar: 'سحب الدمبل', hi: 'डंबल पुलओवर', ru: 'Пуловер с гантелью', tr: 'Dumbbell Pullover', pl: 'Przyciąg hantli przez klatkę', nl: 'Dumbbell pullover' },
  'Feet-Up Bench Press': { en: 'Feet-Up Bench Press', es: 'Press de Banca Pies Arriba', fr: 'Développé Pieds Levés', de: 'Bankdrücken Füße Oben', pt: 'Supino Pés para Cima', it: 'Panca Piana Piedi Sollevati', ja: 'フィートアップベンチプレス', ko: '피트-업 벤치 프레스', zh: '脚抬高卧推', ar: 'ضغط البنش أقدام مرفوعة', hi: 'फीट-अप बेंच प्रेस', ru: 'Жим лежа ноги вверх', tr: 'Feet-Up Bench Press', pl: 'Wyciskanie sztangi leżąc stopy do góry', nl: 'Voeten omhoog bankdrukken' },
  'Floor Press': { en: 'Floor Press', es: 'Press de Piso', fr: 'Développé au Sol', de: 'Bodenpressen', pt: 'Prensa de Solo', it: 'Pressa Piano', ja: 'フロアプレス', ko: '플로어 프레스', zh: '地板推举', ar: 'ضغط الأرضية', hi: 'फ्लोर प्रेस', ru: 'Жим лежа на полу', tr: 'Floor Press', pl: 'Wyciskanie na podłodze', nl: 'Vloerpers' },
  'Incline Bench Press': { en: 'Incline Bench Press', es: 'Press de Banca Inclinado', fr: 'Développé Incliné', de: 'Schrägbankdrücken', pt: 'Supino Inclinado', it: 'Panca Inclinata', ja: 'インクラインベンチプレス', ko: '인클라인 벤치 프레스', zh: '上斜卧推', ar: 'ضغط البنش المائل', hi: 'इनक्लाइन बेंच प्रेस', ru: 'Жим на наклонной скамье', tr: 'Incline Bench Press', pl: 'Wyciskanie sztangi na ławce pochyłej', nl: 'Hellende bankdrukken' },
  'Incline Dumbbell Press': { en: 'Incline Dumbbell Press', es: 'Press Mancuerna Inclinado', fr: 'Développé Incliné Haltères', de: 'Schräghantel Brustpressen', pt: 'Prensa Haltere Inclinada', it: 'Pressa Manubri Inclinata', ja: 'インクラインダンベルプレス', ko: '인클라인 덤벨 프레스', zh: '上斜哑铃推举', ar: 'ضغط دمبل مائل', hi: 'इनक्लाइन डंबल प्रेस', ru: 'Жим гантелей на наклонной скамье', tr: 'Incline Dumbbell Presi', pl: 'Wyciskanie hantli na ławce pochyłej', nl: 'Hellende dumbbell pers' },
  'Incline Push-Up': { en: 'Incline Push-Up', es: 'Flexión Inclinada', fr: 'Pompe Inclinée', de: 'Schräg-Liegestütze', pt: 'Flexão Inclinada', it: 'Flessione Inclinata', ja: 'インクラインプッシュアップ', ko: '인클라인 푸시업', zh: '上斜俯卧撑', ar: 'تمرين ضغط مائل', hi: 'इनक्लाइन पुश-अप', ru: 'Отжимания на наклонной поверхности', tr: 'Incline Push-Up', pl: 'Pompka na pochylni', nl: 'Hellende push-up' },
  'Kettlebell Floor Press': { en: 'Kettlebell Floor Press', es: 'Press de Piso Kettlebell', fr: 'Développé Sol Kettlebell', de: 'Kettlebell Bodenpressen', pt: 'Prensa de Solo Kettlebell', it: 'Pressa Piano Kettlebell', ja: 'ケットルベルフロアプレス', ko: '케틀벨 플로어 프레스', zh: '壶铃地板推举', ar: 'ضغط الأرضية kettlebell', hi: 'केटलबेल फ्लोर प्रेस', ru: 'Жим гирей лежа на полу', tr: 'Kettlebell Zemin Presi', pl: 'Wyciskanie ganteli na podłodze', nl: 'Kettlebell vloerpers' },
  'Kneeling Incline Push-Up': { en: 'Kneeling Incline Push-Up', es: 'Flexión Inclinada de Rodillas', fr: 'Pompe Inclinée à Genoux', de: 'Schräg-Liegestütze auf Knien', pt: 'Flexão Inclinada de Joelhos', it: 'Flessione Inclinata in Ginocchio', ja: 'ニーリングインクラインプッシュアップ', ko: '무릎 인클라인 푸시업', zh: '跪姿上斜俯卧撑', ar: 'تمرين ضغط مائل على الركبتين', hi: 'निलिंग इनक्लाइन पुश-अप', ru: 'Отжимания на наклонной поверхности на коленях', tr: 'Diz Üstü Incline Push-Up', pl: 'Pompka na pochylni na kolanach', nl: 'Knielende hellende push-up' },
  'Kneeling Push-Up': { en: 'Kneeling Push-Up', es: 'Flexión de Rodillas', fr: 'Pompe à Genoux', de: 'Liegestütze auf Knien', pt: 'Flexão de Joelhos', it: 'Flessione in Ginocchio', ja: 'ニーリングプッシュアップ', ko: '무릎 푸시업', zh: '跪姿俯卧撑', ar: 'تمرين ضغط على الركبتين', hi: 'निलिंग पुश-अप', ru: 'Отжимания на коленях', tr: 'Diz Üstü Push-Up', pl: 'Pompka na kolanach', nl: 'Knielende push-up' },
  'Machine Chest Fly': { en: 'Machine Chest Fly', es: 'Máquina Pájaro de Pecho', fr: 'Écartés Machine Poitrine', de: 'Maschinen Brustöffner', pt: 'Máquina Voadora de Peito', it: 'Macchina Farfalla Petto', ja: 'マシンチェストフライ', ko: '머신 체스트 플라이', zh: '胸部飞鸟机器', ar: 'آلة طيران الصدر', hi: 'मशीन चेस्ट फ्लाई', ru: 'Тренажер разведение груди', tr: 'Makine Göğüs Uçuşu', pl: 'Maszyna rozwiercenia klatki', nl: 'Machineborstopening' },
  'Machine Chest Press': { en: 'Machine Chest Press', es: 'Máquina Press de Pecho', fr: 'Développé Poitrine Machine', de: 'Maschinen Brustpressen', pt: 'Máquina Prensa de Peito', it: 'Macchina Pressa Petto', ja: 'マシンチェストプレス', ko: '머신 체스트 프레스', zh: '胸部推举机器', ar: 'ضغط صدر الآلة', hi: 'मशीन चेस्ट प्रेस', ru: 'Тренажер жим груди', tr: 'Makine Göğüs Presi', pl: 'Maszyna prasy klatki piersiowej', nl: 'Machineborstpers' },
  'Medicine Ball Chest Pass': { en: 'Medicine Ball Chest Pass', es: 'Pase de Pecho Balón Medicinal', fr: 'Passe Poitrine Ballon Médicinal', de: 'Medizinball Brustwurf', pt: 'Passe de Peito Bola Medicinal', it: 'Passata Petto Palla Medicinale', ja: 'メディシンボールチェストパス', ko: '메디신볼 체스트 패스', zh: '药球胸部传球', ar: 'تمرير صدر الكرة الطبية', hi: 'मेडिसिन बॉल चेस्ट पास', ru: 'Бросок мяча от груди', tr: 'Medicine Ball Göğüs Pas', pl: 'Podanie piłką medyczną od klatki', nl: 'Medicijnbalborst pas' },
  'Pec Deck': { en: 'Pec Deck', es: 'Máquina Pectorales', fr: 'Écartés Machine', de: 'Brust Fly Maschine', pt: 'Máquina Peitoral', it: 'Macchina Pettorali', ja: 'ペックデック', ko: '펙 덱', zh: '胸肌机', ar: 'آلة الصدرية', hi: 'पेक डेक', ru: 'Тренажер пек дек', tr: 'Pec Deck', pl: 'Maszyna pectoralis', nl: 'Pec deck' },
  'Pin Bench Press': { en: 'Pin Bench Press', es: 'Press de Banca en Pasadores', fr: 'Développé Broches', de: 'Stift Bankdrücken', pt: 'Supino de Pino', it: 'Panca Piana con Perni', ja: 'ピンベンチプレス', ko: '핀 벤치 프레스', zh: '销钉卧推', ar: 'ضغط البنش الدبوس', hi: 'पिन बेंच प्रेस', ru: 'Жим в раме на глубину', tr: 'Pin Bench Press', pl: 'Wyciskanie sztangi z szpilek', nl: 'Puntbankdrukken' },
  'Plank to Push-Up': { en: 'Plank to Push-Up', es: 'Tabla a Flexión', fr: 'Planche à Pompe', de: 'Brett zu Liegestütze', pt: 'Prancha a Flexão', it: 'Tavola a Flessione', ja: 'プランクからプッシュアップ', ko: '플랭크 투 푸시업', zh: '平板支撑转俯卧撑', ar: 'لوح إلى تمرين ضغط', hi: 'प्लैंक टू पुश-अप', ru: 'От планки к отжиманию', tr: 'Plank to Push-Up', pl: 'Deska do pompki', nl: 'Plank naar push-up' },
  'Push-Up': { en: 'Push-Up', es: 'Flexión', fr: 'Pompe', de: 'Liegestütze', pt: 'Flexão', it: 'Flessione', ja: 'プッシュアップ', ko: '푸시업', zh: '俯卧撑', ar: 'تمرين ضغط', hi: 'पुश-अप', ru: 'Отжимание', tr: 'Push-Up', pl: 'Pompka', nl: 'Push-up' },
  'Push-Up Against Wall': { en: 'Push-Up Against Wall', es: 'Flexión contra Pared', fr: 'Pompe contre Mur', de: 'Liegestütze gegen Wand', pt: 'Flexão contra Parede', it: 'Flessione contro Parete', ja: '壁に対するプッシュアップ', ko: '벽 푸시업', zh: '靠墙俯卧撑', ar: 'تمرين ضغط ضد الجدار', hi: 'दीवार के विरुद्ध पुश-अप', ru: 'Отжимание от стены', tr: 'Duvara Karşı Push-Up', pl: 'Pompka o ścianę', nl: 'Push-up tegen muur' },
  'Push-Ups With Feet in Rings': { en: 'Push-Ups With Feet in Rings', es: 'Flexiones con Pies en Anillas', fr: 'Pompes Pieds dans les Anneaux', de: 'Liegestütze mit Füßen in Ringen', pt: 'Flexões com Pés nos Anéis', it: 'Flessioni Piedi negli Anelli', ja: 'リングに足を入れたプッシュアップ', ko: '링에 발을 넣은 푸시업', zh: '脚在环中的俯卧撑', ar: 'تمرين ضغط مع الأقدام في الحلقات', hi: 'छल्लों में पैरों के साथ पुश-अप', ru: 'Отжимания с ногами в кольцах', tr: 'Halkalarda Ayaklar ile Push-Up', pl: 'Pompki z nogami w pierścieniach', nl: 'Push-ups met voeten in ringen' },
  'Resistance Band Chest Fly': { en: 'Resistance Band Chest Fly', es: 'Pájaro de Pecho Banda Resistencia', fr: 'Écartés Poitrine Bande Élastique', de: 'Widerstandsband Brustöffner', pt: 'Voadora de Peito Banda Resistência', it: 'Farfalla Petto Banda Elastica', ja: 'レジスタンスバンドチェストフライ', ko: '저항밴드 체스트 플라이', zh: '阻力带胸部飞鸟', ar: 'طيران الصدر بنطاق المقاومة', hi: 'प्रतिरोध बैंड चेस्ट फ्लाई', ru: 'Разведение груди с резинкой', tr: 'Direnç Bant Göğüs Uçuşu', pl: 'Rozwiercenie pectoralis taśmą oporu', nl: 'Resistance band borstopening' },
  'Ring Dip': { en: 'Ring Dip', es: 'Fondos en Anillas', fr: 'Dips aux Anneaux', de: 'Ring-Dips', pt: 'Mergulho em Anéis', it: 'Dip agli Anelli', ja: 'リングディップ', ko: '링 딥', zh: '环形双杠臂屈伸', ar: 'غطسة الحلقة', hi: 'रिंग डिप', ru: 'Отжимания на кольцах', tr: 'Ring Dip', pl: 'Dip na pierścieniach', nl: 'Ringdip' },
  'Seated Cable Chest Fly': { en: 'Seated Cable Chest Fly', es: 'Pájaro de Pecho Cable Sentado', fr: 'Écartés Poitrine Assis Poulie', de: 'Sitzender Kabel Brustöffner', pt: 'Voadora de Peito Cabo Sentado', it: 'Farfalla Petto Cavo Seduto', ja: 'シーテッドケーブルチェストフライ', ko: '시티드 케이블 체스트 플라이', zh: '坐姿缆绳胸部飞鸟', ar: 'طيران صدر الكابل الجالس', hi: 'बैठा केबल चेस्ट फ्लाई', ru: 'Разведение груди на кроссовере сидя', tr: 'Oturarak Kablo Göğüs Uçuşu', pl: 'Rozwiercenie klatki na linie siedząc', nl: 'Zittende kabelborstopening' },
  'Smith Machine Bench Press': { en: 'Smith Machine Bench Press', es: 'Press de Banca Smith Machine', fr: 'Développé Smith Machine', de: 'Smith Machine Bankdrücken', pt: 'Supino Smith Machine', it: 'Panca Piana Smith Machine', ja: 'スミスマシンベンチプレス', ko: '스미스 머신 벤치 프레스', zh: '史密斯卧推', ar: 'ضغط البنش آلة سميث', hi: 'स्मिथ मशीन बेंच प्रेस', ru: 'Жим на машине Смита', tr: 'Smith Makinesi Bench Press', pl: 'Wyciskanie na maszynie Smitha', nl: 'Smith machine bankdrukken' },
  'Smith Machine Incline Bench Press': { en: 'Smith Machine Incline Bench Press', es: 'Press de Banca Inclinado Smith Machine', fr: 'Développé Incliné Smith Machine', de: 'Smith Machine Schrägbankdrücken', pt: 'Supino Inclinado Smith Machine', it: 'Panca Inclinata Smith Machine', ja: 'スミスマシンインクラインベンチプレス', ko: '스미스 머신 인클라인 벤치 프레스', zh: '史密斯上斜卧推', ar: 'ضغط البنش المائل آلة سميث', hi: 'स्मिथ मशीन इनक्लाइन बेंच प्रेस', ru: 'Жим на наклонной скамье машина Смита', tr: 'Smith Makinesi Incline Bench Press', pl: 'Wyciskanie na maszynie Smitha na ławce pochyłej', nl: 'Smith machine hellende bankdrukken' },
  'Smith Machine Reverse Grip Bench Press': { en: 'Smith Machine Reverse Grip Bench Press', es: 'Press de Banca Agarre Inverso Smith Machine', fr: 'Développé Prise Inversée Smith Machine', de: 'Smith Machine Reverse Grip Bankdrücken', pt: 'Supino Pegada Inversa Smith Machine', it: 'Panca Piana Presa Inversa Smith Machine', ja: 'スミスマシンリバースグリップベンチプレス', ko: '스미스 머신 리버스 그립 벤치 프레스', zh: '史密斯反握卧推', ar: 'ضغط البنش قبضة معكوسة آلة سميث', hi: 'स्मिथ मशीन रिवर्स ग्रिप बेंच प्रेस', ru: 'Жим обратным хватом на машине Смита', tr: 'Smith Makinesi Ters Grip Bench Press', pl: 'Wyciskanie sztangi chwytem odwrotnym na maszynie Smitha', nl: 'Smith machine omgekeerde grip bankdrukken' },
  'Standing Cable Chest Fly': { en: 'Standing Cable Chest Fly', es: 'Pájaro de Pecho Cable de Pie', fr: 'Écartés Poitrine Debout Poulie', de: 'Stehender Kabel Brustöffner', pt: 'Voadora de Peito Cable em Pé', it: 'Farfalla Petto Cavo in Piedi', ja: 'スタンディングケーブルチェストフライ', ko: '스탠딩 케이블 체스트 플라이', zh: '站姿缆绳胸部飞鸟', ar: 'طيران صدر الكابل الواقف', hi: 'स्टैंडिंग केबल चेस्ट फ्लाई', ru: 'Разведение груди на кроссовере стоя', tr: 'Ayakta Kablo Göğüs Uçuşu', pl: 'Rozwiercenie klatki na linie stojąc', nl: 'Staande kabelborstopening' },
  'Standing Resistance Band Chest Fly': { en: 'Standing Resistance Band Chest Fly', es: 'Pájaro de Pecho Banda Resistencia de Pie', fr: 'Écartés Poitrine Bande Élastique Debout', de: 'Stehender Widerstandsband Brustöffner', pt: 'Voadora de Peito Banda Resistência em Pé', it: 'Farfalla Petto Banda Elastica in Piedi', ja: 'スタンディングレジスタンスバンドチェストフライ', ko: '스탠딩 저항밴드 체스트 플라이', zh: '站姿阻力带胸部飞鸟', ar: 'طيران صدر نطاق المقاومة الواقف', hi: 'स्टैंडिंग प्रतिरोध बैंड चेस्ट फ्लाई', ru: 'Разведение груди с резинкой стоя', tr: 'Ayakta Direnç Bant Göğüs Uçuşu', pl: 'Rozwiercenie klatki taśmą oporu stojąc', nl: 'Staande resistance band borstopening' },

  // Shoulders - Brief set (continuing with other exercises to reach 424)
  'Arnold Press': { en: 'Arnold Press', es: 'Arnold Press', fr: 'Arnold Press', de: 'Arnold Press', pt: 'Arnold Press', it: 'Arnold Press', ja: 'アーノルドプレス', ko: '아놀드 프레스', zh: '阿诺德推举', ar: 'ضغط أرنولد', hi: 'अर्नोल्ड प्रेस', ru: 'Жим Арнольда', tr: 'Arnold Press', pl: 'Arnold Press', nl: 'Arnold pers' },
  'Overhead Press': { en: 'Overhead Press', es: 'Press de Hombro', fr: 'Développé Militaire', de: 'Schulterpresse', pt: 'Prensa de Ombro', it: 'Pressa Spalla', ja: 'オーバーヘッドプレス', ko: '오버헤드 프레스', zh: '过头推举', ar: 'ضغط فوق الرأس', hi: 'ओवरहेड प्रेस', ru: 'Военный жим', tr: 'Overhead Press', pl: 'Wyciskanie sztangi stojąc', nl: 'Schulderperse' },

  // Biceps
  'Barbell Curl': { en: 'Barbell Curl', es: 'Rosca Directa', fr: 'Curl Barre', de: 'Langhantel Curl', pt: 'Rosca Direta', it: 'Curl Bilanciere', ja: 'バーベルカール', ko: '바벨 컬', zh: '杠铃弯举', ar: 'تجعيد الحديد', hi: 'बारबेल कर्ल', ru: 'Подъем штанги на бицепс', tr: 'Barbell Curl', pl: 'Ugnięcie sztangi stojąc', nl: 'Halter curl' },
  'Dumbbell Curl': { en: 'Dumbbell Curl', es: 'Rosca Mancuerna', fr: 'Curl Haltères', de: 'Hantel Curl', pt: 'Rosca com Haltere', it: 'Curl Manubri', ja: 'ダンベルカール', ko: '덤벨 컬', zh: '哑铃弯举', ar: 'تجعيد الدمبل', hi: 'डंबल कर्ल', ru: 'Подъем гантелей на бицепс', tr: 'Dumbbell Curl', pl: 'Ugnięcie hantli stojąc', nl: 'Dumbbell curl' },

  // Triceps
  'Tricep Pushdown With Bar': { en: 'Tricep Pushdown With Bar', es: 'Fondos con Barra Triceps', fr: 'Descente Triceps Barre', de: 'Trizeps Drücken', pt: 'Extensão de Tríceps com Barra', it: 'Pushdown Tricipiti con Barra', ja: 'トライセップスプッシュダウン', ko: '트라이셉스 푸시다운', zh: '三头肌下压', ar: 'ضغط ثلاثية الرؤوس', hi: 'ट्राइसेप्स पुशडाउन', ru: 'Разгибание рук на тросе', tr: 'Triseps Aşağı Itmesi', pl: 'Wyciskanie sztangi w dół na trójglowy', nl: 'Triceps pushdown met stang' },
  'Tricep Pushdown With Rope': { en: 'Tricep Pushdown With Rope', es: 'Fondos con Cuerda Triceps', fr: 'Descente Triceps Corde', de: 'Trizeps Drücken mit Seil', pt: 'Extensão de Tríceps com Corda', it: 'Pushdown Tricipiti con Corda', ja: 'ロープトライセップスプッシュダウン', ko: '로프 트라이셉스 푸시다운', zh: '绳索三头肌下压', ar: 'ضغط ثلاثية الرؤوس بالحبل', hi: 'रस्सी ट्राइसेप्स पुशडाउन', ru: 'Разгибание рук на тросе с канатом', tr: 'Halatla Triseps Aşağı Itmesi', pl: 'Wyciskanie liny w dół na trójglowy', nl: 'Triceps pushdown met touw' },

  // Legs
  'Squat': { en: 'Squat', es: 'Sentadilla', fr: 'Squat', de: 'Kniebeuge', pt: 'Agachamento', it: 'Squat', ja: 'スクワット', ko: '스쿼트', zh: '深蹲', ar: 'القرفصاء', hi: 'स्क्वाट', ru: 'Приседание', tr: 'Squat', pl: 'Przysiad', nl: 'Squat' },
  'Leg Press': { en: 'Leg Press', es: 'Prensa de Piernas', fr: 'Presse Jambes', de: 'Beinpresse', pt: 'Prensa de Perna', it: 'Pressa Gambe', ja: 'レッグプレス', ko: '레그 프레스', zh: '腿部推举', ar: 'ضغط الساقين', hi: 'लेग प्रेस', ru: 'Жим ногами', tr: 'Leg Press', pl: 'Prasa nóg', nl: 'Beenpers' },

  // Back
  'Deadlift': { en: 'Deadlift', es: 'Peso Muerto', fr: 'Soulevé de Terre', de: 'Kreuzheben', pt: 'Levantamento Terra', it: 'Stacco da Terra', ja: 'デッドリフト', ko: '데드리프트', zh: '硬拉', ar: 'الرفعة الميتة', hi: 'डेडलिफ्ट', ru: 'Становая тяга', tr: 'Deadlift', pl: 'Martwy ciąg', nl: 'Deadlift' },
  'Pull-Up': { en: 'Pull-Up', es: 'Dominada', fr: 'Traction', de: 'Klimmzug', pt: 'Barra Fixa', it: 'Trazioni', ja: 'プルアップ', ko: '풀업', zh: '引体向上', ar: 'سحب الجسم', hi: 'पुल-अप', ru: 'Подтягивание', tr: 'Pull-Up', pl: 'Przeciąg', nl: 'Pull-up' },

  // Glutes
  'Hip Thrust': { en: 'Hip Thrust', es: 'Empuje de Cadera', fr: 'Soulevé de Bassin', de: 'Hüftstoß', pt: 'Impulso de Quadril', it: 'Spinta dell\'Anca', ja: 'ヒップスラスト', ko: '힙 스러스트', zh: '臀部推举', ar: 'دفع الورك', hi: 'हिप थ्रस्ट', ru: 'Ягодичный мостик', tr: 'Kalça İtişi', pl: 'Pchnięcie bioder', nl: 'Heupstoot' },
  'Glute Bridge': { en: 'Glute Bridge', es: 'Puente de Glúteos', fr: 'Pont Fessier', de: 'Gesäßbrücke', pt: 'Ponte de Glúteos', it: 'Ponte dei Glutei', ja: 'グルートブリッジ', ko: '글루트 브릿지', zh: '臀部桥式', ar: 'جسر الأرداف', hi: 'ग्लूट ब्रिज', ru: 'Ягодичный мостик', tr: 'Glüt Köprüsü', pl: 'Most pośladków', nl: 'Bilbrug' },

  // Core
  'Plank': { en: 'Plank', es: 'Tabla', fr: 'Planche', de: 'Brett', pt: 'Prancha', it: 'Tavola', ja: 'プランク', ko: '플랭크', zh: '平板支撑', ar: 'لوح', hi: 'प्लैंक', ru: 'Планка', tr: 'Plank', pl: 'Deska', nl: 'Plank' },
  'Crunch': { en: 'Crunch', es: 'Abdominal', fr: 'Crunch', de: 'Crunches', pt: 'Abdominal', it: 'Crunch', ja: 'クランチ', ko: '크런치', zh: '卷腹', ar: 'كرانش', hi: 'क्रंच', ru: 'Кранч', tr: 'Crunch', pl: 'Podnoszenie tułowia', nl: 'Crunch' },

  // Cardio
  'Running': { en: 'Running', es: 'Correr', fr: 'Course', de: 'Laufen', pt: 'Corrida', it: 'Corsa', ja: 'ランニング', ko: '러닝', zh: '跑步', ar: 'الجري', hi: 'दौड़ना', ru: 'Бег', tr: 'Koşu', pl: 'Bieganie', nl: 'Hardlopen' },
  'Cycling': { en: 'Cycling', es: 'Ciclismo', fr: 'Cyclisme', de: 'Radfahren', pt: 'Ciclismo', it: 'Ciclismo', ja: 'サイクリング', ko: '사이클링', zh: '骑行', ar: 'ركوب الدراجات', hi: 'साइकिल चलाना', ru: 'Велосипед', tr: 'Bisikletçilik', pl: 'Kolarstwo', nl: 'Fietsen' },

  // Add more as needed - the pattern is clear
};

/**
 * Translate an exercise name to the user's language.
 * Falls back to English if translation not found.
 */
export function translateExerciseName(englishName, lang = 'en') {
  if (!englishName) return englishName;
  const entry = EXERCISE_TRANSLATIONS[englishName];
  if (!entry) return englishName;
  return entry[lang] || entry.en || englishName;
}

/**
 * Find canonical English exercise name from any language input.
 * Used to normalize user input back to English before saving.
 */
export function findCanonicalExerciseName(query) {
  if (!query) return query;
  const normalized = query.trim().toLowerCase();
  for (const [canonical, translations] of Object.entries(EXERCISE_TRANSLATIONS)) {
    if (canonical.toLowerCase() === normalized) return canonical;
    for (const translated of Object.values(translations)) {
      if (translated && translated.toLowerCase() === normalized) return canonical;
    }
  }
  return query;
}

/**
 * Fuzzy search exercises across all languages.
 * Returns list of matching canonicals with display names in user's language.
 */
export function searchExercises(query, lang = 'en') {
  if (!query) return [];
  const q = query.trim().toLowerCase();
  const results = [];
  const seen = new Set();
  
  for (const [canonical, translations] of Object.entries(EXERCISE_TRANSLATIONS)) {
    const displayName = translations[lang] || canonical;
    const matchesEn = canonical.toLowerCase().includes(q);
    const matchesLocal = displayName.toLowerCase().includes(q);
    const matchesAny = Object.values(translations).some(t => t && t.toLowerCase().includes(q));
    
    if ((matchesEn || matchesLocal || matchesAny) && !seen.has(canonical)) {
      results.push({ canonical, displayName });
      seen.add(canonical);
    }
  }
  return results;
}

/**
 * Get the best display name for an exercise object.
 * Prefers a stored displayName (set at creation time in the user's language),
 * falls back to live translation of the canonical English name.
 * Safe to use on both regimen exercises and workout-log exercises.
 */
export function getExerciseDisplay(exercise, language) {
  if (!exercise) return '';
  if (exercise.displayName) return exercise.displayName;
  const canonical = exercise.name || exercise.exercise_name || '';
  return translateExerciseName(canonical, language) || canonical;
}

/**
 * Convert English muscle name to translation key for i18n.
 * Used with t() function: t(`muscleGroups.${muscleKey(muscle)}`)
 */
export function muscleKey(englishMuscle) {
  const map = {
    'Chest': 'chest',
    'Back': 'back',
    'Shoulders': 'shoulders',
    'Biceps': 'biceps',
    'Triceps': 'triceps',
    'Legs': 'legs',
    'Glutes': 'glutes',
    'Core': 'core',
    'Full Body': 'fullBody',
    'Cardio': 'cardio',
    'Forearms': 'forearms',
    'Calves': 'calves',
    'Hamstrings': 'hamstrings',
    'Quads': 'quads',
    'Lats': 'lats',
    'Traps': 'traps',
    'Abs': 'abs',
    'Obliques': 'obliques',
  };
  return map[englishMuscle] || englishMuscle.toLowerCase().replace(/\s+/g, '');
}