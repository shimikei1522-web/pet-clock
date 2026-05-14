const canvas = document.querySelector("#pet");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const stage = document.querySelector("#stage");
const message = document.querySelector("#message");
const chefMessage = document.querySelector("#chefMessage");
const moodValue = document.querySelector("#mood");
const energyValue = document.querySelector("#energy");
const clock = document.querySelector("#clock");
const stageTimerLabel = document.querySelector("#stageTimerLabel");
const stageTimerDisplay = document.querySelector("#stageTimerDisplay");
const dailyQuoteButton = document.querySelector("#dailyQuoteButton");
const luckyFortuneButton = document.querySelector("#luckyFortuneButton");
const nameSettingsButton = document.querySelector("#nameSettingsButton");
const namePanel = document.querySelector("#namePanel");
const userNameInput = document.querySelector("#userNameInput");
const saveNameButton = document.querySelector("#saveNameButton");
const clearNameButton = document.querySelector("#clearNameButton");
const themeSettingsButton = document.querySelector("#themeSettingsButton");
const themePanel = document.querySelector("#themePanel");
const themeChoices = document.querySelectorAll(".theme-choice");
const bgmSettingsButton = document.querySelector("#bgmSettingsButton");
const bgmPanel = document.querySelector("#bgmPanel");
const bgmToggle = document.querySelector("#bgmToggle");
const bgmMode = document.querySelector("#bgmMode");
const bgmVolume = document.querySelector("#bgmVolume");
const timeChoices = document.querySelectorAll(".time-choice");
const customMinutes = document.querySelector("#customMinutes");
const startTimerButton = document.querySelector("#startTimer");
const pauseTimerButton = document.querySelector("#pauseTimer");
const resetTimerButton = document.querySelector("#resetTimer");
const alarmToggleButton = document.querySelector("#alarmToggle");
const alarmHourSelect = document.querySelector("#alarmHour");
const alarmMinuteSelect = document.querySelector("#alarmMinute");
const clockAlarmToggle = document.querySelector("#clockAlarmToggle");

const sheet = new Image();
sheet.src = "./assets/spritesheet.webp";

const columns = 8;
const rows = 9;
let frameWidth = 1;
let frameHeight = 1;
let frameIndex = 0;
let action = "idle";
let lastTick = 0;
let x = 0;
let targetX = 0;
let mood = 72;
let energy = 88;
let currentMoodName = "ごきげん";
let lastPeriod = "";
let selectedMinutes = 5;
let remainingSeconds = selectedMinutes * 60;
let timerEndAt = 0;
let timerRunning = false;
let timerId = 0;
let alarmEnabled = true;
let alarmRinging = false;
let alarmMode = "";
let celebrationUntil = 0;
let alarmId = 0;
let audioContext = null;
let bgmGain = null;
let bgmOscillators = [];
let bgmTimer = 0;
let bgmEnabled = false;
let bgmStarted = false;
let bgmModeValue = "off";
let bgmVolumeValue = 0.04;
let quoteHoldUntil = 0;
let chefBubbleTimer = 0;
let nextConversationAt = Date.now() + 120000;
let clockAlarmEnabled = false;
let clockAlarmLastKey = "";
let userName = "";
let selectedTheme = "fresh";
const PET_REACTION_HOLD_MS = 9000;

const bgmPatterns = {
  gentle: {
    step: 620,
    wave: "sine",
    level: 0.78,
    notes: [
      [523.25, 0.28],
      [659.25, 0.24],
      [783.99, 0.3],
      [659.25, 0.32],
      null,
      [587.33, 0.26],
      [659.25, 0.34],
      null,
    ],
  },
  cafe: {
    step: 430,
    wave: "triangle",
    level: 0.68,
    notes: [
      [523.25, 0.16],
      [659.25, 0.16],
      [783.99, 0.18],
      [880, 0.16],
      [783.99, 0.22],
      null,
      [659.25, 0.16],
      [587.33, 0.2],
    ],
  },
  focus: {
    step: 820,
    wave: "sine",
    level: 0.54,
    notes: [
      [392, 0.22],
      null,
      [587.33, 0.2],
      null,
      [493.88, 0.26],
      null,
    ],
  },
  night: {
    step: 760,
    wave: "sine",
    level: 0.46,
    notes: [
      [440, 0.32],
      null,
      [523.25, 0.28],
      [659.25, 0.34],
      null,
      [523.25, 0.36],
      null,
    ],
  },
};

const timePeriods = {
  morning: { text: "おはようございます！今日もがんばろう！", replies: ["朝の空気、ちょっと新しいね", "朝だよ！まずは深呼吸して始めよう", "今日もいい一日にしようね"], action: "cheer" },
  afternoon: { text: "こんにちは！少し休憩しながら進めよう", replies: ["午後の手順を一つ選ぼう", "お昼の元気、まだまだあるよ", "無理しすぎず、いいペースでいこう"], action: "wave" },
  evening: { text: "おかえりなさい！おおつかれさまです！", replies: ["夕方の確認タイムにしよう", "夕方だね。ここまでよく進めたね", "ひと息ついて、あと少しだけやろう"], action: "snack" },
  night: { text: "遅くまでおつかれさま。夜更かしないでね", replies: ["夜のメモは明日の味方だよ", "夜はゆっくりモードでいこう", "そろそろ休む準備も忘れないでね"], action: "shy" },
};

const actions = {
  idle: { row: 0, frames: [0, 1, 2, 3, 4, 5], speed: 420, text: "のんびりしています" },
  run: { row: 1, frames: [0, 1, 2, 3, 4, 5, 6, 7], speed: 92, text: "走っています" },
  wave: { row: 3, frames: [0, 1, 2, 3], speed: 180, text: "手を振っています" },
  cheer: { row: 4, frames: [0, 1, 2, 3, 4], speed: 145, text: "うれしそうです" },
  sad: { row: 5, frames: [0, 1, 2, 3, 4, 5, 6, 7], speed: 190, text: "ちょっとしょんぼり" },
  snack: { row: 7, frames: [0, 1, 2, 3, 4, 5], speed: 165, text: "おやつタイム" },
  shy: { row: 8, frames: [0, 1, 2, 3, 4, 5], speed: 190, text: "もじもじしています" },
};

const clickActions = ["run", "wave", "cheer", "snack", "shy", "sad"];
const exactTimeEvents = {
  "07:00": "おはよう！今日もいい一日にしよう！",
  "12:00": "お昼だよ！少し休憩しよう。",
  "15:00": "おやつの時間だよ！",
  "18:00": "今日もおつかれさま！",
  "22:00": "そろそろ休む準備をしよう。",
};
const dailyQuotes = [
  "今日も一つずつ丁寧にいこう！",
  "発酵も成長も、待つ時間が大切だね。",
  "少し休憩して、またおいしく進めよう。",
  "小さな積み重ねが、きれいな仕上がりにつながるよ。",
  "焼き上がりを待つみたいに、焦らずいこう。",
  "粉をふるうみたいに、気持ちも軽く整えよう。",
  "今日のひと手間が、明日の自信になるよ。",
  "うまくいかない日も、生地みたいに少し休ませて大丈夫。",
];
const seasonalEvents = {
  spring: {
    className: "season-spring",
    quotes: ["春の香りがするね。新しいことを始めるのにぴったり！", "いちごや桜みたいに、やさしい仕上がりを目指そう。"],
    sweets: ["いちごタルト", "桜シフォン", "軽いクリームのロールケーキ", "苺のショートケーキ"],
    messages: ["春は軽いクリームが似合うね。ふわっと進めよう。", "桜色の気分で、今日も一つずついこう。"],
  },
  summer: {
    className: "season-summer",
    quotes: ["暑い日は無理せず、水分補給しようね", "ゼリーやレモンみたいに、さっぱり気分でいこう。"],
    sweets: ["レモンゼリー", "アイスサンド", "マンゴープリン", "レモンタルト"],
    messages: ["夏は涼しさも大事だよ。少し休みながら進めよう。", "つるんとしたゼリーみたいに、軽やかにいこう。"],
  },
  autumn: {
    className: "season-autumn",
    quotes: ["栗やさつまいもがおいしい季節だね", "かぼちゃの甘さみたいに、じっくり仕上げよう。"],
    sweets: ["モンブラン", "かぼちゃプリン", "さつまいもパイ", "栗のパウンドケーキ"],
    messages: ["秋は焼き菓子が恋しいね。香ばしく進めよう。", "栗みたいに、こつこつ中身を育てていこう。"],
  },
  winter: {
    className: "season-winter",
    quotes: ["あたたかい飲み物と一緒に、ゆっくり進めよう", "シュトーレンやチョコの季節だね。甘く落ち着いていこう。"],
    sweets: ["シュトーレン", "ホットチョコケーキ", "ジンジャークッキー", "焼き菓子の詰め合わせ"],
    messages: ["冬は焼き菓子の香りがうれしいね。あたたかく進めよう。", "冷える日は無理せず、ほっと一息つこう。"],
  },
};
const luckySweets = ["クロワッサン", "シュークリーム", "マドレーヌ", "プリン", "ベーグル", "メロンパン", "フィナンシェ", "ロールケーキ"];
const luckyColors = ["ミントグリーン", "いちごレッド", "クリームイエロー", "ココアブラウン", "シュガーホワイト", "ベリーピンク", "空色ブルー", "ピスタチオグリーン"];
const luckyMessages = [
  "今日は丁寧に進めると良い日！",
  "ひと休みのあとに、いいアイデアが出そう。",
  "小さく試すと、きれいな仕上がりにつながるよ。",
  "焦らず温度を見ると、うまくいきそう。",
  "好きな香りを思い出すと元気が戻るよ。",
  "道具を整えると、気持ちも整う日。",
  "今日はやさしいペースが合っているよ。",
  "最後のひと手間がラッキーを呼びそう。",
];
const moodProfiles = [
  { name: "ねむい", minMood: 0, maxMood: 45, minEnergy: 0, maxEnergy: 46, messages: ["ちょっとねむいみたい。少し休もう", "今日はゆっくりめでいこう"] },
  { name: "おなかすいた", minMood: 0, maxMood: 58, minEnergy: 47, maxEnergy: 99, messages: ["おなかすいたかも。ひと息つこう", "軽く何か食べたら元気が出そう"] },
  { name: "のんびり中", minMood: 46, maxMood: 74, minEnergy: 0, maxEnergy: 62, messages: ["のんびり中。焦らず進めよう", "落ち着いたペースでいこう"] },
  { name: "ごきげん", minMood: 59, maxMood: 84, minEnergy: 45, maxEnergy: 99, messages: ["ごきげんだよ。今日もいい感じ！", "Pepaatennkoは楽しそうにしているよ"] },
  { name: "やる気満々", minMood: 75, maxMood: 99, minEnergy: 70, maxEnergy: 99, messages: ["やる気満々！この調子でいこう", "集中する準備ばっちりだよ"] },
];
const conversations = {
  normal: [
    ["今日もがんばってるね", "焦らず丁寧にいこう"],
    ["少し休憩する？", "休む時間も大事だよ"],
    ["今日はどんな一日にする？", "小さな目標を一つ決めるといいよ"],
    ["なんだかいい日になりそう", "その気持ち、大切にしよう"],
    ["一つずつ進めば大丈夫", "丁寧な積み重ねが力になるよ"],
    ["お菓子の香りがしてきそう", "丁寧な作業は、仕上がりに出るよ"],
    ["発酵って待つのが大事なんだよね", "そう。成長も同じだね"],
    ["パン生地みたいに成長中だね", "焦らず、じっくり育てよう"],
    ["焼き色って大事だよね", "最後の見極めが仕上がりを決めるよ"],
    ["急がなくても大丈夫", "丁寧に進める方が、きっといいよ"],
  ],
  focus: [
    ["タイマー、いい感じに進んでるよ", "その集中、すごくいいね"],
    ["あと少しだよ！", "最後まで落ち着いていこう"],
    ["今、集中できてるね", "この調子で進めよう"],
    ["ひと区切りまでがんばろう", "終わったら少し休もうね"],
  ],
  seasonal: {
    spring: ["春の香りがするね", "新しいことを始めるのにぴったりだね"],
    summer: ["暑い日は無理しないでね", "水分補給も忘れずに"],
    autumn: ["栗やさつまいもの季節だね", "秋の素材はわくわくするね"],
    winter: ["寒くなってきたね", "あたたかい飲み物と一緒に進めよう"],
  },
};

const extraPetReplies = {
  normal: [
    "手を止めて、今できたことを一つ見つけよう",
    "迷ったら、最初の目的に戻ってみよう",
    "道具を並べ直すだけでも前進だよ",
    "今の一口分だけ進めよう",
    "作業台を整えると、気持ちも少し整うよ",
    "考えすぎたら、まず一つだけ試してみよう",
    "できたところから見れば、ちゃんと進んでいるよ",
    "小さな確認が、大きな失敗を防いでくれるよ",
    "全部完璧じゃなくても、前には進んでるよ",
    "手を動かすと、気持ちも少し動き出すよ",
    "少しずつ形になってきたね",
    "続けているだけで、もう強いよ",
    "今の一歩、ちゃんと前に進んでるよ",
    "途中の景色も、ちゃんと成果の一部だよ",
    "今日は仕込みの日。あとから育つよ",
    "小さく試して、合う形を探そう",
    "やることを一つだけ小さくしよう",
    "できない日じゃなくて、調整の日かも",
    "メモ一行でも、次の自分を助けるよ",
    "ここまで来たなら、もう半歩いけるかも",
    "となりで見てるからね",
    "ちょこんと応援してるよ",
    "今日のぼく、応援係です",
    "なでられた気分で元気出た",
    "一緒にいると、なんだか楽しいね",
    "ちょっとだけ褒めてほしい顔してるよ",
    "がんばる姿、こっそり見てたよ",
    "ぼくも背筋を伸ばして応援するね",
    "そばにいるだけで、応援になるかな",
    "集中してる顔、ちょっと職人っぽいよ",
    "今の集中力、焼きたて級だね",
    "ぼくの応援、音量は控えめです",
    "やることリスト、ぼくが食べられたらいいのに",
    "気合い入りすぎて、帽子が飛びそう",
    "今なら難しい作業も少しだけ優しく見えるかも",
    "ぼくは見守り担当、失敗しても逃げません",
    "まずは一口サイズの作業にしよう",
    "見直し一回、未来の自分が喜ぶよ",
    "机の上の平和は、心の平和かも",
  ],
  morning: [
    "朝の一手目は、軽く整えるところから",
    "今日のメモを一行だけ書いてみよう",
    "窓を開けるみたいに、気持ちも少し広げよう",
    "最初の準備が、あとで助けてくれるよ",
    "朝の一歩は、今日の流れを作るよ",
    "おはよう。今日はどんな日にしようか",
    "最初の作業は、軽めでも大丈夫",
    "朝の空気で、気持ちを整えよう",
    "今日の仕込み、始めよう",
    "朝の光みたいに、少しずつ広げよう",
    "まだ眠いなら、ゆっくり目を覚まそう",
    "最初の確認は、未来への合図だよ",
    "朝のうちに、作業台を一度見てみよう",
    "今日の一番小さな目標を決めよう",
  ],
  afternoon: [
    "午後は道具チェックから始めてもいいよ",
    "目が疲れたら、遠くを少し見よう",
    "お昼のあとこそ、ゆっくり切り替えよう",
    "一度に抱えず、順番を決めてみよう",
    "お昼のあとも、少しずついこう",
    "午後の自分に、やさしく進めよう",
    "ここで一回、流れを整えよう",
    "午前のがんばり、ちゃんと残ってるよ",
    "午後は午後のペースで大丈夫",
    "眠気が来たら、手元だけ整えよう",
    "午後の山は、小さな階段にしよう",
    "次の一手を決めるだけでも前進だよ",
    "お茶を置いて、また始めよう",
    "午後の集中は、短く区切ると扱いやすいよ",
  ],
  evening: [
    "今日できたことを、ひとつだけ数えよう",
    "片づけまでが、明日の準備になるよ",
    "夕方は仕上げより確認が似合う時間だね",
    "残りは小さく区切って進めよう",
    "夕方までよく進めたね",
    "今日の残りは、無理なく整えよう",
    "終わり方を丁寧にすると、明日が楽になるよ",
    "あと少しだけ、片づける気持ちでいこう",
    "夕方の色、ちょっと焼き色みたいだね",
    "今日のメモを残しておくと安心だよ",
    "ここからは仕上げより整え時間にしよう",
    "できた分を見れば、ちゃんと進んでるよ",
    "明日の自分に、いいバトンを渡そう",
    "夕方の集中は、欲張らずにいこう",
  ],
  night: [
    "夜は考えをメモに預けてもいいよ",
    "眠る前の準備も、立派な作業だよ",
    "明日の自分に、少し余白を残そう",
    "今日はここまで、という合図も大切だよ",
    "夜はがんばりすぎ注意だよ",
    "そろそろ休む準備もしていこう",
    "明日の自分に仕事を残しすぎないでね",
    "眠くなる前に、区切りを作ろう",
    "今日はここまででも十分だよ",
    "夜の作業は、静かに小さく進めよう",
    "目がしょぼしょぼなら、今日は閉店だよ",
    "考えごとは、紙に置いて休ませよう",
    "あたたかい飲み物で、気持ちをゆるめよう",
    "夜更かしの誘惑、ぼくが見張ってるよ",
  ],
  focus: [
    "今は一つの作業だけ見ていよう",
    "集中の波に、静かに乗れているよ",
    "余計なことは、あとで拾えば大丈夫",
    "手順を一つ終えたら、小さく丸をつけよう",
    "いいリズム、そのままいこう",
    "今は一つにしぼって進めよう",
    "集中の流れ、できてるよ",
    "あと少し、静かに応援してるね",
    "手元に意識を戻してみよう",
    "この時間は、自分のための時間だよ",
    "急がず、でも止まらず",
    "今の集中、かなりいい感じ",
    "よそ見したくなったら、また戻ればいいよ",
    "短い時間でも、積み重なるよ",
    "いま開いている作業だけ見よう",
    "音を小さくして、手元を大きく見よう",
    "集中の糸、やさしく持っていよう",
    "ひと工程だけ進めれば十分だよ",
  ],
  timerComplete: [
    "一つ区切れたね。肩をゆるめよう",
    "よく戻ってこられたね。ここで一息",
    "集中のあとには、整える時間をどうぞ",
    "今の積み重ね、ちゃんと残っているよ",
    "ひと区切り達成。えらい！",
    "今の時間、ちゃんと力になってるよ",
    "終わったあとの休憩は、ちょっと特別だね",
    "次に進む前に、今の成果を見てみよう",
    "集中完了。いい仕事だったよ",
    "ここまで進めたの、ちゃんとすごいよ",
    "小さな達成、いただきました",
    "休憩の準備、できてるよ",
    "よく集中できたね。手をゆるめよう",
    "一区切りの鐘、心の中で鳴ったよ",
  ],
  clockAlarm: [
    "約束の時間だよ。タップで止めてね",
    "時間になったよ。合図に気づいてね",
    "ここで一度、予定を確認しよう",
    "お知らせだよ。ペットをタップしてね",
    "予定の時間だよ。忘れものないかな",
    "今の時刻、チェックしてね",
    "お知らせ係、ちゃんと働いたよ",
    "合図の時間だよ。タップで止まるよ",
    "ここで予定を切り替えよう",
  ],
  dailyQuote: [
    "今日の言葉、ポケットに入れておこう",
    "この一言、あとで効いてくるかも",
    "読めたね。次は小さく動いてみよう",
    "ひとこと読んだら、少し背筋が伸びるね",
    "今日の合言葉にしておこう",
    "この言葉、作業台のすみに置いておこう",
    "読んだぶんだけ、気持ちが整ったかも",
    "いい一文、見つけたね",
  ],
  lucky: [
    "今日のラッキー、こっそり味方だよ",
    "いい予感は、作業台のすみに置いておこう",
    "ラッキーを見つける目、今日は冴えてるよ",
    "ラッキーは、小さく使うと効きそうだよ",
    "今日の色、どこかに置いてみたいね",
    "甘い運気、少し香ってきたかも",
    "ラッキーお菓子、想像しただけで元気出るね",
    "いい予感、こぼさないように持っていこう",
  ],
  named: [
    "、今できたところから見てみよう",
    "、今日は整える日でもいいよ",
    "、迷ったら一つだけ試してみよう",
    "、手順を小さく分けてみよう",
    "、今の一歩いい感じだよ",
    "、無理せず続けよう",
    "、今できる一つに集中しよう",
    "、休憩も忘れないでね",
    "、ちゃんと進んでるよ",
    "、今日のがんばり見てるよ",
    "、手元を大切にしよう",
    "、ここまで来たのすごいよ",
    "、次の一歩も一緒にいこう",
    "、今日は少し軽く進めよう",
  ],
};

const extraSeasonReplies = {
  spring: [
    "春の軽さで、まず一つ整えよう",
    "いちごみたいに明るい一歩にしよう",
    "春は新しいことを始めたくなるね",
    "春の仕込みは、なんだかわくわくするね",
    "桜色の気分で、やさしく進めよう",
    "軽いクリームみたいに、ふわっといこう",
  ],
  summer: [
    "レモンみたいに、さっぱり切り替えよう",
    "暑い日は、確認も涼しめにいこう",
    "夏は水分補給も作業の一部だよ",
    "ゼリーみたいに、涼しくまとまるといいね",
    "アイスが溶ける前に、ひと区切りしよう",
    "夏の作業は、風通しも味方だよ",
  ],
  autumn: [
    "栗をむくみたいに、少しずつ進めよう",
    "かぼちゃ色の落ち着きで見直そう",
    "秋の香りって、なんだか焼き菓子みたい",
    "さつまいもみたいに、ほくほく進めよう",
    "秋は見直しが似合う季節だね",
    "香ばしい気分で、もう一工程いこう",
  ],
  winter: [
    "焼き菓子の香りみたいに、ゆっくり温めよう",
    "冷える日は、手元を大事に進めよう",
    "寒い日は、あたたかい飲み物が味方だね",
    "冬の作業は、手元をあたためてからね",
    "シュトーレンみたいに、少し寝かせてもいいよ",
    "チョコみたいに、ゆっくり溶かして考えよう",
  ],
};

const extraConversations = {
  normal: [
    ["作業台、少し整える？", "整えると、次の一手が見えやすいよ"],
    ["今日は仕込みの日かも", "すぐ結果が出ない日も大切だよ"],
    ["ちょっと考えすぎたかも", "一つ試すと、次が見えてくるよ"],
    ["今の一歩、見逃さないでね", "小さな進歩ほど大事にしよう"],
    ["焼く前の確認って大事だね", "最後の確認が仕上がりを守るよ"],
    ["なんだか頭がいっぱい", "一つだけ紙に書き出してみよう"],
    ["おいしい予感がする", "予感を形にするのが職人の仕事だね"],
    ["粉の袋、ちゃんと閉めた？", "そういう確認が平和を守るんだよ"],
  ],
  morning: [
    ["朝の準備、何からする？", "道具を一つ選ぶだけでも始まるよ"],
    ["今日は軽く始めたいな", "最初は小さな確認で十分だよ"],
  ],
  afternoon: [
    ["午後のリズム、探してる", "水分を置いてから始めよう"],
    ["お昼のあと、眠いかも", "手元を明るくして切り替えよう"],
  ],
  evening: [
    ["今日の仕上げ、どうする？", "明日に渡す形まで整えよう"],
    ["夕方の色、焼き色みたい", "見極める時間にぴったりだね"],
  ],
  night: [
    ["夜の作業は静かだね", "音を減らすと体も休まりやすいよ"],
    ["明日に残してもいい？", "もちろん。続きのメモだけ置こう"],
  ],
  focus: [
    ["集中の音がしてる気がする", "いいリズムに入っている合図かも"],
    ["そろそろ区切る？", "区切りを作ると、続きが楽になるよ"],
    ["今は一皿ぶんだけ見よう", "範囲を小さくすると手が動くよ"],
    ["確認の時間、入れる？", "途中の確認は失敗を減らしてくれるよ"],
  ],
  timerComplete: [
    ["一つ区切れたね", "次の前に、手を休めよう"],
    ["集中、ちゃんと形になったよ", "短い休憩で整えよう"],
  ],
  seasonal: {
    spring: ["桜の色、やさしいね", "新しい手順を試すのにいい季節だね"],
    summer: ["ゼリーみたいに涼しくいこう", "温度と休憩を忘れずにね"],
    autumn: ["栗の季節は集中しやすいね", "香ばしい気分で見直そう"],
    winter: ["シュトーレンみたいに寝かせる？", "待つことで深まるものもあるよ"],
  },
};

const moreConversations = {
  normal: [
    ["作業台、今ちょっと広くする？", "余白ができると、手順も見えやすいよ"],
    ["材料の声、聞こえた気がする", "状態を見る目が育っている証拠だね"],
    ["今日は細かい確認の日かも", "小さな確認は、あとで大きく助けてくれるよ"],
    ["迷ったら一口分だけ進めよう", "全部を決めなくても、次の一手は選べるよ"],
    ["道具を並べるだけでも前進？", "もちろん。始める準備は立派な作業だよ"],
    ["ちょっと背筋のばしてみる？", "姿勢が変わると、集中の入り口も変わるよ"],
    ["今の手順、忘れたくないね", "短くメモしておくと、未来の自分が助かるよ"],
    ["完成を急がなくてもいい？", "工程を大事にすると、仕上がりもついてくるよ"],
    ["今日は試作みたいな気持ちで", "試す日は、発見がいちばんの収穫だよ"],
    ["手元が少し整ってきたね", "整うと、判断もやさしくなるよ"],
    ["うまくいかない時もあるよ", "原因探しは責めるためじゃなく、次を楽にするためだよ"],
    ["ひとつ片づいたら拍手だね", "小さな完了を数えると、気持ちが続きやすいよ"],
  ],
  morning: [
    ["朝の光、ちょっと味方っぽい", "最初の一手を軽くすると流れに乗れるよ"],
    ["今日の仕込み、何から始める？", "小さい順に並べると入りやすいよ"],
    ["朝は確認からいこうかな", "いいね。温度を見るみたいに気持ちも見よう"],
    ["眠気が少し残ってるかも", "急発進せず、ゆっくり温めていこう"],
    ["朝の一歩、焼きたてみたい", "新しい香りで始められるね"],
    ["まず机を整える？", "朝の整頓は、一日の型を作ってくれるよ"],
  ],
  afternoon: [
    ["午後の山、見えてきたね", "登る前に水分と段取りを確認しよう"],
    ["お昼の後はゆっくり戻ろう", "手元から始めると、頭も追いついてくるよ"],
    ["午後って少し眠いね", "眠気ごと抱えて、短い作業からいこう"],
    ["一回、作業の順番を見直す？", "午後は優先順位を軽く整えると進みやすいよ"],
    ["甘い香りがほしい時間だね", "気分転換を少し入れて、また戻ろう"],
    ["午後の自分、がんばってる", "午前とは違うペースで十分だよ"],
  ],
  evening: [
    ["夕方の色、落ち着くね", "終わり方を整えるのに向いている時間だよ"],
    ["あと少し、片づけモード？", "明日の自分が助かる形にしておこう"],
    ["今日の成果、ひとつ見つけた？", "見つけるところまでが今日の作業だよ"],
    ["そろそろ区切りの準備かな", "次に続けやすい印を残しておこう"],
    ["夕方は無理しない作戦で", "最後の力は、整えるために使おう"],
    ["今日の焼き色、どうかな", "完璧より、今の進み具合を見よう"],
  ],
  night: [
    ["夜の作業、静かだね", "静けさに乗りすぎないよう、区切りも忘れずに"],
    ["もう少しだけって思っちゃう", "その言葉が出たら、終わり方を決める合図だよ"],
    ["明日に回してもいいかな", "いい判断だよ。休むと見えることもあるからね"],
    ["夜の集中、深くなりすぎ注意", "体の声も作業の大切な材料だよ"],
    ["眠る前にメモだけ残す？", "続きの自分へのレシピになるよ"],
    ["今日はここまででもいい？", "もちろん。閉じる勇気も技術のひとつだよ"],
  ],
  focus: [
    ["今はひとつだけ見よう", "余計なことは、あとでちゃんと拾えばいいよ"],
    ["集中の泡、消さないように", "静かに続けるのが今のコツだね"],
    ["手元に戻ってきたよ", "戻れたこと自体が集中力だよ"],
    ["あと少し、落ち着いて", "急ぐより、最後の形を守ろう"],
    ["この時間、ちゃんと育ってる", "短くても濃い作業になっているよ"],
    ["よそ見しても戻ればOK", "戻る練習も集中の一部だよ"],
    ["いま、いいテンポだね", "そのテンポを守るために、言葉は少なめでいこう"],
    ["一段だけ進めよう", "段を分けると、手が止まりにくいよ"],
  ],
  timerComplete: [
    ["一区切り、焼き上がり！", "すぐ次に行かず、余熱を冷まそう"],
    ["集中の山、越えたね", "ここで肩をゆるめると次が楽だよ"],
    ["今の時間、ちゃんと残るよ", "見えない積み重ねほど力になるね"],
    ["できたところを見てみよう", "達成を確認すると、次の方向が決まるよ"],
    ["休憩の鐘、鳴った感じ", "水分を取って、体も整えよう"],
    ["ひとつ完了、うれしいね", "終わりを祝うと、続ける力になるよ"],
  ],
  seasonal: {
    spring: [
      ["いちごの季節、気分が軽いね", "新しい型を試すのに向いているよ"],
      ["春の仕込み、わくわくする", "軽いクリームみたいに進めよう"],
    ],
    summer: [
      ["レモンみたいに、さっぱり進めたいね", "暑い日は作業も休憩も小分けにしよう"],
      ["ゼリーみたいに、ひんやり落ち着こう", "無理せず、温度管理も忘れずにね"],
    ],
    autumn: [
      ["栗とかぼちゃ、どっちも呼んでる", "香ばしい季節は、見直しにも向いているよ"],
      ["秋は焼き色が似合うね", "落ち着いて仕上げを見る季節だよ"],
    ],
    winter: [
      ["焼き菓子の香りが似合う時間だね", "寒い日は、手元を温めてから始めよう"],
      ["シュトーレンみたいに少しずつ育てよう", "待つ楽しさも冬の味だね"],
    ],
  },
};

const chefSoloLines = {
  startup: [
    "今日は道具の準備から、ゆっくり始めよう",
    "最初の一手は小さくて大丈夫だよ",
    "作業台を整えると、気持ちも入りやすいよ",
    "今日の流れを一緒に見守るね",
    "無理なく続く段取りでいこう",
  ],
  normal: [
    "手順を短く分けると、進みやすいよ",
    "迷ったら、目的を一度だけ見直そう",
    "道具の位置が決まると、動きが楽になるよ",
    "今できる確認を一つだけしよう",
    "仕上がりは、準備の静かさに出るよ",
    "焦る時ほど、手元をゆっくり見よう",
    "小さな違和感に気づけるのは良いことだよ",
    "作業を減らす工夫も、立派な技術だよ",
    "完璧より、続けられる形を選ぼう",
    "次の一手が見えたら、それで十分だよ",
    "頭の中も、粉をふるうみたいに整えよう",
    "手を止める時間が、判断を助けることもあるよ",
    "同じ工程でも、今日の気づきは新しいね",
    "一つ試せば、次の答えが近づくよ",
    "片づけは、未来の集中への仕込みだよ",
  ],
  morning: [
    "朝は軽い確認から入るといいよ",
    "まだ温まりきらなくても大丈夫",
    "今日の仕込みを小さく始めよう",
    "最初の五分で、流れは作れるよ",
    "朝の空気で、段取りを整えよう",
    "急がず、手元を起こしていこう",
  ],
  afternoon: [
    "午後は水分を置いてから始めよう",
    "眠気が来たら、短い作業に切り替えよう",
    "午前の続きは、まず確認からでいいよ",
    "午後の山は、分ければ登りやすいよ",
    "一度立ち上がるだけでも流れが戻るよ",
    "甘いものの前に、深呼吸を一つどうぞ",
  ],
  evening: [
    "夕方は、終わり方を整える時間だよ",
    "明日に残すメモを短く書いておこう",
    "今日のよかった工程を一つ拾おう",
    "片づけながら、成果も確認しよう",
    "あと少しは、無理なく決めよう",
    "終盤ほど、確認はやさしく丁寧にね",
  ],
  night: [
    "夜は判断が重くなりやすいから、短く区切ろう",
    "明日の自分に任せるのも上手な進め方だよ",
    "眠る前のメモは、続きのレシピになるよ",
    "今日はここまで、と決めるのも大切だよ",
    "静かな時間ほど、体の声も聞こう",
    "夜更かしの前に、温かい飲み物を思い出してね",
    "最後の確認だけして、休む準備に入ろう",
  ],
  focus: [
    "今は一つの工程だけ見ればいいよ",
    "集中の流れを静かに守ろう",
    "途中で戻れたら、それも集中だよ",
    "音を減らして、手元に戻ろう",
    "短い時間でも、濃く使えているよ",
    "焦らず、でも止まらずにいこう",
    "今のテンポを保つことを優先しよう",
    "あと少しだけ、同じ姿勢で進めよう",
  ],
  timerComplete: [
    "よく区切れたね。休憩の準備をしよう",
    "集中の余熱を、少し冷ましておこう",
    "今の積み重ねは、ちゃんと残るよ",
    "次に進む前に、水分を取ろう",
    "ここまでの成果を一度眺めよう",
    "終わった瞬間を大事にすると続けやすいよ",
  ],
  alarm: [
    "予定の時間だよ。ペットをタップして止めてね",
    "合図が鳴っているよ。落ち着いて止めよう",
    "気づけたら大丈夫。ペットをタップだよ",
    "今はアラーム確認を優先しよう",
    "音を止めたら、次の行動を一つ決めよう",
  ],
  theme: [
    "背景が変わると、気分の温度も変わるね",
    "今のテーマに合わせて、ゆっくり進めよう",
    "見やすい環境は、作業の味方だよ",
    "景色を整えるのも、集中の準備だね",
    "この背景なら、気持ちも切り替えやすいね",
  ],
  bgm: [
    "音は小さめから合わせるのがいいよ",
    "作業の邪魔にならない音量がちょうどいいね",
    "気分に合う音を選ぶのも、段取りの一つだよ",
    "リズムが強すぎたら、すぐ変えて大丈夫",
    "静かな音でも、作業の合図になるよ",
  ],
  dailyQuote: [
    "今日の言葉を、作業台の端に置いておこう",
    "読んだ言葉は、少しあとで効いてくるよ",
    "一言だけでも、気持ちの向きは変わるね",
    "今日のテーマにしてみるのもいいよ",
    "言葉を選ぶ時間も、整える時間だよ",
  ],
  lucky: [
    "ラッキーは、気づいた人から使える材料だよ",
    "色やお菓子から、今日の気分を作ってみよう",
    "小さな縁起を持って作業するのも楽しいね",
    "今日のラッキーを、どこかに一つ足してみよう",
    "楽しむ気持ちは、仕上がりにも少し出るよ",
  ],
  season: [
    "季節の素材は、気持ちにも香りをくれるね",
    "今の季節らしいペースで進めよう",
    "季節が変わると、作りたいものも変わるね",
    "旬のものを思い浮かべると、手元が楽しくなるよ",
    "季節の空気を少しだけ作業に混ぜよう",
  ],
  idle: [
    "少し間が空いたね。戻るなら一つだけでいいよ",
    "眺める時間も、考えを寝かせる時間だよ",
    "再開するなら、机の上を一つ動かそう",
    "止まっても大丈夫。戻り方を知っていればいいよ",
    "今は次の一手を選ぶ時間かもしれないね",
  ],
  named: [
    "、今のペースで十分だよ",
    "、手元を大切に進めよう",
    "、今日は小さく整える日でもいいよ",
    "、次の一手を一緒に見よう",
    "、ここまでの進みもちゃんと見えているよ",
  ],
};

const animalFriendReplies = {
  normal: [
    "ねえねえ、一緒に応援しよう",
    "今日も見守り係、よろしくね",
    "小さな相棒、準備できた？",
    "そっちからも応援してあげて",
    "一緒にいると心強いね",
    "今日はふたりで見守る日だね",
    "ちょこんと座ってるの、かわいいね",
    "いい感じだよね、相棒",
    "そっと応援する作戦でいこう",
    "小さな応援団、集合だね",
    "見守るのも大事なお仕事だよ",
    "今日の作業、いい流れだよね",
    "一緒にうなずいておこう",
    "相棒、今日もいい表情してるね",
    "小さくても応援力は大きいよ",
    "この空気、なんだかいいね",
    "次の一歩、見守ってよう",
    "ちょっと眠そう？でもかわいいね",
    "応援の準備、できてる？",
    "ふたりでいると、にぎやかでいいね",
  ],
  focus: [
    "今は静かに応援しよう",
    "あまり騒がず、でも全力で応援だよ",
    "今の集中、見えてた？",
    "この調子で、そっと背中を押そう",
    "小さな相棒も、いい仕事してるよ",
    "そっと見守る係、お願いね",
  ],
  rest: [
    "そろそろ休憩って伝える？",
    "がんばりすぎてないか見ててね",
    "焦らずいこうって伝えたいね",
    "今日はやさしく見守る作戦だよ",
  ],
  named: [
    "、相棒も応援してるよ",
    "、今日はふたりで見守ってるよ",
    "、今の一歩を相棒も見てたよ",
    "、小さな応援団がついてるよ",
  ],
};

const recentPetLines = [];
const recentChefLines = [];
const recentConversationLines = [];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatTime(date) {
  return [date.getHours(), date.getMinutes(), date.getSeconds()].map((value) => String(value).padStart(2, "0")).join(":");
}

function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function populateClockAlarmOptions() {
  for (let hour = 0; hour < 24; hour += 1) {
    const option = document.createElement("option");
    option.value = String(hour).padStart(2, "0");
    option.textContent = String(hour).padStart(2, "0");
    alarmHourSelect.append(option);
  }
  for (let minute = 0; minute < 60; minute += 1) {
    const option = document.createElement("option");
    option.value = String(minute).padStart(2, "0");
    option.textContent = String(minute).padStart(2, "0");
    alarmMinuteSelect.append(option);
  }
}

function setTimerDisplays(seconds) {
  const value = formatDuration(seconds);
  stageTimerDisplay.textContent = value;
}

function getTimePeriod(date = new Date()) {
  const hour = date.getHours();
  if (hour >= 5 && hour <= 10) return "morning";
  if (hour >= 11 && hour <= 16) return "afternoon";
  if (hour >= 17 && hour <= 20) return "evening";
  return "night";
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function rememberRecent(list, value, limit = 10) {
  if (!value) return;
  list.unshift(value);
  while (list.length > limit) list.pop();
}

function pickFresh(items, recentList, limit = 10) {
  const available = items.filter((item) => !recentList.includes(item));
  const picked = randomItem(available.length ? available : items);
  rememberRecent(recentList, picked, limit);
  return picked;
}

function pickFreshConversation(pairs) {
  const available = pairs.filter((pair) => !recentConversationLines.includes(pair.join(" / ")));
  const picked = randomItem(available.length ? available : pairs);
  rememberRecent(recentConversationLines, picked.join(" / "), 8);
  return picked;
}

function getChefLinePool(context = "normal") {
  const period = getTimePeriod();
  const pool = [
    ...chefSoloLines.normal,
    ...(chefSoloLines[period] || []),
    ...(chefSoloLines[context] || []),
  ];
  if (timerRunning) pool.push(...chefSoloLines.focus);
  if (period === "night") pool.push(...chefSoloLines.night);
  if (selectedTheme === "season") pool.push(...chefSoloLines.season);
  if (userName) pool.push(...chefSoloLines.named.map((text) => `${userName}${text}`));
  return pool;
}

function showChefSolo(context = "normal", duration = 10000, chance = 1) {
  if (alarmRinging || Math.random() > chance) return false;
  showChefMessage(pickFresh(getChefLinePool(context), recentChefLines), duration);
  return true;
}

function getAutoPetLinePool() {
  const period = getTimePeriod();
  const profile = getMoodProfile();
  const season = getSeasonEvent();
  const namedReplies = userName ? extraPetReplies.named.map((text) => `${userName}${text}`) : [];
  return [
    ...extraPetReplies.normal,
    ...extraPetReplies[period],
    ...(timerRunning ? extraPetReplies.focus : []),
    ...profile.messages,
    ...season.messages,
    ...extraSeasonReplies[getSeasonKey()],
    ...namedReplies,
  ];
}

function getAnimalFriendReplyPool() {
  const namedReplies = userName ? animalFriendReplies.named.map((text) => `${userName}${text}`) : [];
  return [
    ...animalFriendReplies.normal,
    ...(timerRunning ? animalFriendReplies.focus : animalFriendReplies.rest),
    ...namedReplies,
  ];
}

function scheduleNextConversation(delay = null) {
  const base = timerRunning ? 42000 : 20000;
  const range = timerRunning ? 36000 : 40000;
  nextConversationAt = Date.now() + (delay ?? base + Math.random() * range);
}

function cleanUserName(value) {
  return value.trim().replace(/\s+/g, " ").slice(0, 12);
}

function loadUserName() {
  try {
    userName = cleanUserName(localStorage.getItem("pepaatennkoUserName") || "");
  } catch {
    userName = "";
  }
  userNameInput.value = userName;
}

function namePrefix() {
  return userName ? `${userName}、` : "";
}

function namedPeriodText(period = getTimePeriod()) {
  if (!userName) return timePeriods[period].text;
  const namedTexts = {
    morning: `${userName}、朝の準備を一つだけ始めよう`,
    afternoon: `${userName}、午後は順番を決めて動こう`,
    evening: `${userName}、今日できたことを一つ見つけよう`,
    night: `${userName}、続きはメモに預けてもいいよ`,
  };
  return namedTexts[period] || timePeriods[period].text;
}

function saveUserName() {
  userName = cleanUserName(userNameInput.value);
  userNameInput.value = userName;
  try {
    if (userName) {
      localStorage.setItem("pepaatennkoUserName", userName);
    } else {
      localStorage.removeItem("pepaatennkoUserName");
    }
  } catch {
    // localStorage may be unavailable in some private browsing modes.
  }
  namePanel.hidden = true;
  nameSettingsButton.setAttribute("aria-expanded", "false");
  quoteHoldUntil = Date.now() + 8000;
  hideChefMessage();
  message.textContent = userName ? `${userName}、これからよろしくね！` : "名前設定をクリアしたよ";
}

function showChefMessage(text, duration = 10000) {
  chefMessage.hidden = false;
  chefMessage.textContent = text;
  window.clearTimeout(chefBubbleTimer);
  chefBubbleTimer = window.setTimeout(() => {
    chefMessage.hidden = true;
    chefMessage.textContent = "";
  }, duration);
}

function hideChefMessage() {
  window.clearTimeout(chefBubbleTimer);
  chefMessage.hidden = true;
  chefMessage.textContent = "";
}

function getSeasonClass(date = new Date()) {
  return seasonalEvents[getSeasonKey(date)].className;
}

function getSeasonKey(date = new Date()) {
  const month = date.getMonth() + 1;
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

function getSeasonEvent(date = new Date()) {
  return seasonalEvents[getSeasonKey(date)];
}

function applyTheme(theme) {
  selectedTheme = ["fresh", "night", "forest", "cafe", "season"].includes(theme) ? theme : "fresh";
  document.body.classList.remove("theme-night", "theme-forest", "theme-cafe", "theme-season", "season-spring", "season-summer", "season-autumn", "season-winter");
  if (selectedTheme !== "fresh") {
    document.body.classList.add(`theme-${selectedTheme}`);
  }
  if (selectedTheme === "season") {
    document.body.classList.add(getSeasonClass());
  }
  themeChoices.forEach((button) => button.classList.toggle("active", button.dataset.theme === selectedTheme));
}

function loadTheme() {
  try {
    selectedTheme = localStorage.getItem("pepaatennkoTheme") || "fresh";
  } catch {
    selectedTheme = "fresh";
  }
  applyTheme(selectedTheme);
}

function loadClockAlarm() {
  try {
    const saved = JSON.parse(localStorage.getItem("pepaatennkoClockAlarm") || "{}");
    alarmHourSelect.value = saved.hour || "07";
    alarmMinuteSelect.value = saved.minute || "00";
    clockAlarmEnabled = Boolean(saved.enabled);
  } catch {
    alarmHourSelect.value = "07";
    alarmMinuteSelect.value = "00";
    clockAlarmEnabled = false;
  }
  updateClockAlarmUi();
}

function saveClockAlarm() {
  try {
    localStorage.setItem(
      "pepaatennkoClockAlarm",
      JSON.stringify({ hour: alarmHourSelect.value, minute: alarmMinuteSelect.value, enabled: clockAlarmEnabled }),
    );
  } catch {
    // localStorage may be unavailable in some private browsing modes.
  }
}

function updateClockAlarmUi() {
  clockAlarmToggle.classList.toggle("active", clockAlarmEnabled);
  clockAlarmToggle.textContent = clockAlarmEnabled ? "時刻アラームON" : "時刻アラームOFF";
  clockAlarmToggle.setAttribute("aria-pressed", String(clockAlarmEnabled));
}

function ensureAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioContext) audioContext = new AudioContextClass();
  if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
  return audioContext;
}

function enableAlarmSound() {
  alarmEnabled = true;
  alarmToggleButton.classList.add("active");
  alarmToggleButton.textContent = "タイマーON";
  alarmToggleButton.setAttribute("aria-pressed", "true");
  prepareAlarm();
}

function loadBgmSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem("pepaatennkoBgm") || "{}");
    bgmModeValue = bgmPatterns[saved.mode] ? saved.mode : saved.enabled ? "gentle" : "off";
    bgmEnabled = false;
    bgmVolumeValue = Number(saved.volume) || 0.04;
  } catch {
    bgmEnabled = false;
    bgmModeValue = "off";
    bgmVolumeValue = 0.04;
  }
  bgmMode.value = bgmModeValue;
  bgmVolume.value = String(bgmVolumeValue);
  updateBgmUi();
}

function saveBgmSettings() {
  try {
    localStorage.setItem("pepaatennkoBgm", JSON.stringify({ enabled: bgmEnabled, mode: bgmModeValue, volume: bgmVolumeValue }));
  } catch {
    // localStorage may be unavailable in some private browsing modes.
  }
}

function updateBgmUi() {
  bgmToggle.classList.toggle("active", bgmEnabled);
  bgmToggle.textContent = bgmEnabled ? "BGM停止" : "BGM再生";
  bgmToggle.setAttribute("aria-pressed", String(bgmEnabled));
  bgmMode.value = bgmModeValue;
}

function playBgmNote(frequency, duration, wave, level) {
  if (!audioContext || !bgmGain || !frequency) return;
  const startTime = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = wave;
  oscillator.frequency.setValueAtTime(frequency, startTime);
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, level), startTime + 0.035);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  oscillator.connect(gain);
  gain.connect(bgmGain);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.04);
  bgmOscillators.push(oscillator);
  oscillator.addEventListener("ended", () => {
    bgmOscillators = bgmOscillators.filter((item) => item !== oscillator);
  });
}

function scheduleBgmLoop(stepIndex = 0) {
  if (!bgmStarted || !bgmEnabled || !bgmPatterns[bgmModeValue]) return;
  const pattern = bgmPatterns[bgmModeValue];
  const note = pattern.notes[stepIndex % pattern.notes.length];
  if (note) playBgmNote(note[0], note[1], pattern.wave, pattern.level);
  bgmTimer = window.setTimeout(() => scheduleBgmLoop(stepIndex + 1), pattern.step);
}

function startBgm() {
  if (!bgmEnabled || bgmModeValue === "off") return;
  const context = ensureAudioContext();
  if (!context || bgmStarted) return;
  bgmGain = context.createGain();
  bgmGain.gain.setValueAtTime(alarmRinging ? bgmVolumeValue * 0.12 : bgmVolumeValue, context.currentTime);
  bgmGain.connect(context.destination);
  bgmStarted = true;
  scheduleBgmLoop();
}

function stopBgm() {
  window.clearTimeout(bgmTimer);
  bgmOscillators.forEach((oscillator) => {
    try {
      oscillator.stop();
    } catch {
      // Oscillator may already be stopped.
    }
  });
  bgmOscillators = [];
  if (bgmGain) bgmGain.disconnect();
  bgmGain = null;
  bgmStarted = false;
}

function setBgmDucked(ducked) {
  if (!bgmGain || !audioContext) return;
  const target = ducked ? bgmVolumeValue * 0.12 : bgmVolumeValue;
  bgmGain.gain.cancelScheduledValues(audioContext.currentTime);
  bgmGain.gain.setTargetAtTime(target, audioContext.currentTime, 0.35);
}

function toggleBgm() {
  bgmEnabled = !bgmEnabled;
  if (bgmEnabled) {
    if (bgmModeValue === "off") bgmModeValue = "gentle";
    startBgm();
  } else {
    bgmModeValue = "off";
    stopBgm();
  }
  saveBgmSettings();
  updateBgmUi();
  showChefSolo("bgm", 9000, 0.65);
}

function toggleClockAlarm() {
  clockAlarmEnabled = !clockAlarmEnabled;
  if (clockAlarmEnabled) enableAlarmSound();
  saveClockAlarm();
  updateClockAlarmUi();
  quoteHoldUntil = Date.now() + 8000;
  hideChefMessage();
  message.textContent = clockAlarmEnabled
    ? `${namePrefix()}${alarmHourSelect.value}:${alarmMinuteSelect.value} にアラームをセットしたよ`
    : `${namePrefix()}時刻アラームをOFFにしたよ`;
  showChefSolo("alarm", 9000, 0.7);
}

function checkClockAlarm(now) {
  if (!clockAlarmEnabled || alarmRinging) return;
  if (now.getSeconds() !== 0) return;
  const eventKey = `${getTodayKey()}-${alarmHourSelect.value}:${alarmMinuteSelect.value}`;
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  if (currentTime !== `${alarmHourSelect.value}:${alarmMinuteSelect.value}` || clockAlarmLastKey === eventKey) return;
  clockAlarmLastKey = eventKey;
  enableAlarmSound();
  alarmRinging = true;
  alarmMode = "clock";
  celebrationUntil = 0;
  timerRunning = false;
  window.clearInterval(timerId);
  updateMoodDisplay();
  stageTimerLabel.textContent = "タップして止めてね";
  setAction("cheer", `${namePrefix()}${randomItem(extraPetReplies.clockAlarm)}`);
  startAlarmLoop();
}

function saveTheme(theme) {
  applyTheme(theme);
  try {
    localStorage.setItem("pepaatennkoTheme", selectedTheme);
  } catch {
    // localStorage may be unavailable in some private browsing modes.
  }
  themePanel.hidden = true;
  themeSettingsButton.setAttribute("aria-expanded", "false");
  quoteHoldUntil = Date.now() + 8000;
  hideChefMessage();
  const labels = { fresh: "さわやか", night: "夜空", forest: "森", cafe: "カフェ", season: "季節" };
  message.textContent = `${namePrefix()}背景を「${labels[selectedTheme]}」にしたよ`;
  showChefSolo("theme", 9000, 0.65);
}

function getTodayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function pickDailyQuote() {
  const today = getTodayKey();
  try {
    const saved = JSON.parse(localStorage.getItem("pepaatennkoDailyQuote") || "{}");
    if (saved.date === today && typeof saved.quote === "string") {
      return saved.quote;
    }
    const quotePool = [...dailyQuotes, ...extraPetReplies.dailyQuote, ...getSeasonEvent().quotes, ...extraSeasonReplies[getSeasonKey()]];
    const index = Math.abs([...today].reduce((total, char) => total + char.charCodeAt(0), 0)) % quotePool.length;
    const quote = quotePool[index];
    localStorage.setItem("pepaatennkoDailyQuote", JSON.stringify({ date: today, quote }));
    return quote;
  } catch {
    const quotePool = [...dailyQuotes, ...extraPetReplies.dailyQuote, ...getSeasonEvent().quotes, ...extraSeasonReplies[getSeasonKey()]];
    return quotePool[new Date().getDate() % quotePool.length];
  }
}

function pickFromList(list, seed, offset = 0) {
  const total = [...seed].reduce((sum, char) => sum + char.charCodeAt(0), offset);
  return list[Math.abs(total) % list.length];
}

function pickLuckyFortune() {
  const today = getTodayKey();
  try {
    const saved = JSON.parse(localStorage.getItem("pepaatennkoLuckyFortune") || "{}");
    if (saved.date === today && saved.sweet && saved.color && saved.message) {
      return saved;
    }
    const fortune = {
      date: today,
      sweet: pickFromList([...luckySweets, ...getSeasonEvent().sweets], today, 11),
      color: pickFromList(luckyColors, today, 23),
      message: pickFromList([...luckyMessages, ...extraPetReplies.lucky, ...getSeasonEvent().messages, ...extraSeasonReplies[getSeasonKey()]], today, 37),
    };
    localStorage.setItem("pepaatennkoLuckyFortune", JSON.stringify(fortune));
    return fortune;
  } catch {
    return {
      sweet: [...luckySweets, ...getSeasonEvent().sweets][new Date().getDate() % [...luckySweets, ...getSeasonEvent().sweets].length],
      color: luckyColors[new Date().getDay() % luckyColors.length],
      message: [...luckyMessages, ...extraPetReplies.lucky, ...getSeasonEvent().messages, ...extraSeasonReplies[getSeasonKey()]][
        new Date().getMonth() % [...luckyMessages, ...extraPetReplies.lucky, ...getSeasonEvent().messages, ...extraSeasonReplies[getSeasonKey()]].length
      ],
    };
  }
}

function hasShownSeasonEvent(today) {
  try {
    const saved = JSON.parse(localStorage.getItem("pepaatennkoSeasonEvent") || "{}");
    return saved.date === today && saved.season === getSeasonKey();
  } catch {
    return false;
  }
}

function markSeasonEventShown(today) {
  try {
    localStorage.setItem("pepaatennkoSeasonEvent", JSON.stringify({ date: today, season: getSeasonKey() }));
  } catch {
    // localStorage may be unavailable in some private browsing modes.
  }
}

function showSeasonEvent(now) {
  if (timerRunning || alarmRinging || Date.now() < quoteHoldUntil) return;
  if (now.getSeconds() > 2) return;
  const today = getTodayKey();
  if (hasShownSeasonEvent(today)) return;
  markSeasonEventShown(today);
  const season = getSeasonEvent(now);
  quoteHoldUntil = Date.now() + 8000;
  action = "wave";
  frameIndex = 0;
  stage.classList.remove("season-event", "season-event-spring", "season-event-summer", "season-event-autumn", "season-event-winter");
  stage.classList.add("season-event", `season-event-${getSeasonKey(now)}`);
  window.setTimeout(() => {
    stage.classList.remove("season-event", "season-event-spring", "season-event-summer", "season-event-autumn", "season-event-winter");
  }, 2600);
  window.clearTimeout(setAction.timer);
  hideChefMessage();
  message.textContent = `${namePrefix()}${randomItem([...season.messages, ...extraSeasonReplies[getSeasonKey()]])}`;
  showChefSolo("season", 9000, 0.45);
}

function showDailyQuote() {
  if (alarmRinging) return;
  const quote = pickDailyQuote();
  quoteHoldUntil = Date.now() + 8000;
  action = "wave";
  frameIndex = 0;
  window.clearTimeout(setAction.timer);
  hideChefMessage();
  message.textContent = `今日のひとこと：${namePrefix()}${quote}`;
  showChefSolo("dailyQuote", 9000, 0.55);
}

function showLuckyFortune() {
  if (alarmRinging) return;
  const fortune = pickLuckyFortune();
  quoteHoldUntil = Date.now() + 8000;
  action = "wave";
  frameIndex = 0;
  window.clearTimeout(setAction.timer);
  hideChefMessage();
  message.textContent = `ラッキーお菓子：${fortune.sweet} / ラッキーカラー：${fortune.color} / ひとこと：${namePrefix()}${fortune.message}`;
  showChefSolo("lucky", 9000, 0.55);
}

function getConversationPair() {
  if (userName && Math.random() < 0.35) {
    return pickFreshConversation([
      [`${userName}、手元を一つ整えよう`, `${userName}のペースで十分だよ`],
      [`${userName}、今の一歩を見てね`, "そこから次が見えてくるよ"],
      [`${userName}、考えすぎたら一つ試そう`, "小さく試すのはいい方法だよ"],
    ]);
  }
  if (Math.random() < 0.25) {
    const seasonKey = getSeasonKey();
    return pickFreshConversation([conversations.seasonal[seasonKey], extraConversations.seasonal[seasonKey], ...moreConversations.seasonal[seasonKey]]);
  }
  const period = getTimePeriod();
  const pool = timerRunning
    ? [...conversations.focus, ...extraConversations.focus, ...moreConversations.focus]
    : [...conversations.normal, ...extraConversations.normal, ...moreConversations.normal, ...extraConversations[period], ...moreConversations[period]];
  return pickFreshConversation(pool);
}

function maybeShowConversation() {
  const now = Date.now();
  if (now < nextConversationAt) return;
  if (alarmRinging || now < quoteHoldUntil) {
    scheduleNextConversation(timerRunning ? 70000 : 30000);
    return;
  }

  const roll = Math.random();
  if (roll < (timerRunning ? 0.35 : 0.3)) {
    quoteHoldUntil = now + 10000;
    const pool = Math.random() < (timerRunning ? 0.12 : 0.18) ? getAnimalFriendReplyPool() : getAutoPetLinePool();
    message.textContent = pickFresh(pool, recentPetLines, 12);
    if (Math.random() < 0.35) showChefSolo(timerRunning ? "focus" : "idle", 10000);
  } else if (roll < (timerRunning ? 0.65 : 0.55)) {
    showChefSolo(timerRunning ? "focus" : "idle", 10000);
  } else {
    const [petText, chefText] = getConversationPair();
    quoteHoldUntil = now + 10000;
    message.textContent = petText;
    showChefMessage(chefText, 10000);
  }
  scheduleNextConversation();
}

function hasShownExactTimeEvent(today, eventKey) {
  try {
    const saved = JSON.parse(localStorage.getItem("pepaatennkoExactTimeEvents") || "{}");
    return saved.date === today && Array.isArray(saved.keys) && saved.keys.includes(eventKey);
  } catch {
    return false;
  }
}

function markExactTimeEventShown(today, eventKey) {
  try {
    const saved = JSON.parse(localStorage.getItem("pepaatennkoExactTimeEvents") || "{}");
    const keys = saved.date === today && Array.isArray(saved.keys) ? saved.keys : [];
    if (!keys.includes(eventKey)) keys.push(eventKey);
    localStorage.setItem("pepaatennkoExactTimeEvents", JSON.stringify({ date: today, keys }));
  } catch {
    // localStorage may be unavailable in some private browsing modes.
  }
}

function showExactTimeEvent(now) {
  if (timerRunning || alarmRinging || Date.now() < quoteHoldUntil) return;
  const eventKey = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const text = exactTimeEvents[eventKey];
  if (!text || now.getSeconds() > 3) return;
  const today = getTodayKey();
  if (hasShownExactTimeEvent(today, eventKey)) return;
  markExactTimeEventShown(today, eventKey);
  quoteHoldUntil = Date.now() + 8000;
  action = "wave";
  frameIndex = 0;
  window.clearTimeout(setAction.timer);
  message.textContent = `${namePrefix()}${text}`;
  hideChefMessage();
}

function getMoodProfile() {
  if (timerRunning) {
    return moodProfiles.find((profile) => profile.name === "やる気満々");
  }
  if (alarmRinging) {
    return moodProfiles.find((profile) => profile.name === "ごきげん");
  }
  return (
    moodProfiles.find((profile) => mood >= profile.minMood && mood <= profile.maxMood && energy >= profile.minEnergy && energy <= profile.maxEnergy) ||
    moodProfiles.find((profile) => profile.name === "ごきげん")
  );
}

function updateMoodDisplay() {
  const profile = getMoodProfile();
  currentMoodName = profile.name;
  moodValue.textContent = currentMoodName;
  return profile;
}

function updateClock() {
  const now = new Date();
  const period = getTimePeriod(now);
  const value = formatTime(now);
  clock.textContent = value;
  clock.dateTime = now.toTimeString().slice(0, 8);
  checkClockAlarm(now);
  showExactTimeEvent(now);
  showSeasonEvent(now);
  maybeShowConversation();
  if (period !== lastPeriod && !timerRunning && !alarmRinging && Date.now() >= quoteHoldUntil) {
    lastPeriod = period;
    updateMoodDisplay();
    message.textContent = namedPeriodText(period);
  }
}

function chooseAction() {
  quoteHoldUntil = 0;
  const period = timePeriods[getTimePeriod()];
  const profile = updateMoodDisplay();
  const season = getSeasonEvent();
  const next = Math.random() < 0.55 ? period.action : randomItem(clickActions);
  const namedReplies = userName
    ? extraPetReplies.named.map((text) => `${userName}${text}`)
    : [];
  const replyPool = [
    ...period.replies,
    ...extraPetReplies.normal,
    ...extraPetReplies[getTimePeriod()],
    ...(timerRunning ? extraPetReplies.focus : []),
    ...profile.messages,
    ...season.messages,
    ...extraSeasonReplies[getSeasonKey()],
    ...namedReplies,
  ];
  const linePool = Math.random() < (timerRunning ? 0.12 : 0.18) ? getAnimalFriendReplyPool() : replyPool;
  setAction(next, pickFresh(linePool, recentPetLines, 12));
  mood = clamp(mood + (next === "sad" ? -4 : 3), 0, 99);
  energy = clamp(energy + (next === "run" ? -6 : 1), 0, 99);
  updateMoodDisplay();
  energyValue.textContent = energy;
}

function setAction(next, text = actions[next].text) {
  action = next;
  frameIndex = 0;
  hideChefMessage();
  message.textContent = text;
  window.clearTimeout(setAction.timer);
  if (next !== "idle") {
    quoteHoldUntil = Date.now() + PET_REACTION_HOLD_MS;
  }
  if (next !== "idle" && !alarmRinging) {
    setAction.timer = window.setTimeout(() => setAction("idle", timerRunning ? `${namePrefix()}${randomItem(extraPetReplies.focus)}` : namedPeriodText()), PET_REACTION_HOLD_MS);
  }
}

function setSelectedMinutes(minutes) {
  stopAlarm();
  selectedMinutes = clamp(Math.round(minutes), 1, 180);
  remainingSeconds = selectedMinutes * 60;
  timerEndAt = 0;
  timerRunning = false;
  window.clearInterval(timerId);
  setTimerDisplays(remainingSeconds);
}

function setActiveChoice(minutes) {
  timeChoices.forEach((button) => button.classList.toggle("active", Number(button.dataset.minutes) === minutes));
}

function startFocusTimer() {
  stopAlarm();
  quoteHoldUntil = 0;
  if (timerRunning) return;
  prepareAlarm();
  if (remainingSeconds <= 0) remainingSeconds = selectedMinutes * 60;
  timerRunning = true;
  updateMoodDisplay();
  stageTimerLabel.textContent = "FOCUS";
  timerEndAt = Date.now() + remainingSeconds * 1000;
  setAction("cheer", `${namePrefix()}集中スタート！Pepaatennkoも応援しているよ`);
  showChefSolo("focus", 9000, 0.75);
  scheduleNextConversation(45000 + Math.random() * 30000);
  window.clearInterval(timerId);
  timerId = window.setInterval(tickFocusTimer, 250);
  tickFocusTimer();
}

function pauseFocusTimer() {
  if (!timerRunning) return;
  quoteHoldUntil = 0;
  timerRunning = false;
  remainingSeconds = Math.max(0, Math.ceil((timerEndAt - Date.now()) / 1000));
  window.clearInterval(timerId);
  setTimerDisplays(remainingSeconds);
  hideChefMessage();
  message.textContent = `${namePrefix()}一時停止中。準備できたらまた始めよう`;
}

function resetFocusTimer() {
  stopAlarm();
  quoteHoldUntil = 0;
  timerRunning = false;
  window.clearInterval(timerId);
  remainingSeconds = selectedMinutes * 60;
  stageTimerLabel.textContent = "FOCUS";
  setTimerDisplays(remainingSeconds);
  hideChefMessage();
  message.textContent = namedPeriodText();
}

function finishFocusTimer() {
  quoteHoldUntil = 0;
  timerRunning = false;
  window.clearInterval(timerId);
  remainingSeconds = 0;
  setTimerDisplays(0);
  mood = clamp(mood + 8, 0, 99);
  energy = clamp(energy + 3, 0, 99);
  updateMoodDisplay();
  energyValue.textContent = energy;
  alarmRinging = true;
  alarmMode = "timer";
  celebrationUntil = Date.now() + 10000;
  updateMoodDisplay();
  stageTimerLabel.textContent = "タップして止めてね";
  setAction("cheer", `${namePrefix()}${randomItem(extraPetReplies.timerComplete)} ペットをタップしてね`);
  if (Math.random() < 0.6) {
    const [petText, chefText] = pickFreshConversation([...extraConversations.timerComplete, ...moreConversations.timerComplete]);
    message.textContent = `${namePrefix()}${petText}`;
    showChefMessage(chefText, 10000);
  } else {
    showChefSolo("timerComplete", 10000, 0.7);
  }
  startAlarmLoop();
}

function prepareAlarm() {
  if (!alarmEnabled) return;
  ensureAudioContext();
}

function playTone(startTime, frequency, duration) {
  if (!audioContext || !alarmEnabled) return;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, startTime);
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(0.16, startTime + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.03);
}

function playClockAlarmPattern() {
  if (!alarmEnabled) return;
  prepareAlarm();
  if (!audioContext || audioContext.state !== "running") return;
  const now = audioContext.currentTime;
  playTone(now, 880, 0.14);
  playTone(now + 0.2, 988, 0.14);
  playTone(now + 0.4, 1175, 0.22);
}

function playTimerCompletePattern() {
  if (!alarmEnabled) return;
  prepareAlarm();
  if (!audioContext || audioContext.state !== "running") return;
  const now = audioContext.currentTime;
  playTone(now, 660, 0.38);
  playTone(now + 0.42, 880, 0.5);
}

function playAlarmPattern() {
  if (alarmMode === "timer") {
    playTimerCompletePattern();
    return;
  }
  playClockAlarmPattern();
}

function startAlarmLoop() {
  window.clearInterval(alarmId);
  setBgmDucked(true);
  playAlarmPattern();
  alarmId = window.setInterval(() => {
    if (!alarmRinging) return;
    if (alarmMode === "timer" && Date.now() >= celebrationUntil) {
      stopAlarm();
      return;
    }
    playAlarmPattern();
  }, alarmMode === "timer" ? 1800 : 1200);
}

function stopAlarm() {
  const wasRinging = alarmRinging;
  alarmRinging = false;
  const stoppedMode = alarmMode;
  alarmMode = "";
  celebrationUntil = 0;
  window.clearInterval(alarmId);
  stageTimerLabel.textContent = "FOCUS";
  setBgmDucked(false);
  if (audioContext && audioContext.state === "running") {
    if (!bgmStarted) audioContext.suspend().catch(() => {});
  }
  if (wasRinging) {
    quoteHoldUntil = 0;
    updateMoodDisplay();
    message.textContent = stoppedMode === "clock" ? `${namePrefix()}予定の合図を止めたよ` : `${namePrefix()}${randomItem(extraPetReplies.timerComplete)}`;
    hideChefMessage();
    setAction("cheer", stoppedMode === "clock" ? `${namePrefix()}知らせを確認できたね` : `${namePrefix()}${randomItem(extraPetReplies.timerComplete)}`);
  }
}

function toggleAlarm() {
  quoteHoldUntil = 0;
  alarmEnabled = !alarmEnabled;
  if (!alarmEnabled) stopAlarm();
  alarmToggleButton.classList.toggle("active", alarmEnabled);
  alarmToggleButton.textContent = alarmEnabled ? "タイマーON" : "タイマーOFF";
  alarmToggleButton.setAttribute("aria-pressed", String(alarmEnabled));
  if (alarmEnabled) prepareAlarm();
}

function tickFocusTimer() {
  if (!timerRunning) return;
  remainingSeconds = Math.max(0, Math.ceil((timerEndAt - Date.now()) / 1000));
  setTimerDisplays(remainingSeconds);
  if (remainingSeconds === 0) finishFocusTimer();
}

function drawFrame() {
  const current = actions[action];
  const frame = current.frames[frameIndex % current.frames.length];
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(sheet, frame * frameWidth, current.row * frameHeight, frameWidth, frameHeight, 0, 0, canvas.width, canvas.height);
  try {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    for (let i = 0; i < pixels.length; i += 4) {
      const brightness = Math.max(pixels[i], pixels[i + 1], pixels[i + 2]);
      if (brightness < 42) pixels[i + 3] = 0;
      else if (brightness < 72) pixels[i + 3] = Math.round(pixels[i + 3] * ((brightness - 42) / 30));
    }
    ctx.putImageData(imageData, 0, 0);
  } catch {
    // Some browsers lock pixel reads from double-clicked local files.
  }
}

function animate(time = 0) {
  const current = actions[action];
  if (time - lastTick > current.speed) {
    frameIndex += 1;
    lastTick = time;
  }
  if (action === "run" || alarmRinging) {
    targetX += alarmRinging ? (alarmMode === "timer" ? 0.9 : 2.6) : 1.8;
    if (Math.abs(targetX) > stage.clientWidth * 0.24) targetX *= -1;
  } else {
    targetX *= 0.86;
  }
  x += (targetX - x) * 0.08;
  const alarmLift = alarmMode === "timer" ? "-9px" : "-14px";
  canvas.style.translate = `${x}px ${action === "cheer" || alarmRinging ? alarmLift : "0"}`;
  if (alarmRinging && action !== "cheer") action = "cheer";
  drawFrame();
  requestAnimationFrame(animate);
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  if (!["http:", "https:"].includes(window.location.protocol)) return;
  navigator.serviceWorker.register("./service-worker.js").catch(() => {});
}

timeChoices.forEach((button) => {
  button.addEventListener("click", () => {
    const minutes = Number(button.dataset.minutes);
    setActiveChoice(minutes);
    customMinutes.value = "";
    setSelectedMinutes(minutes);
  });
});

customMinutes.addEventListener("change", () => {
  const minutes = Number(customMinutes.value);
  if (!Number.isFinite(minutes) || minutes <= 0) return;
  setActiveChoice(0);
  setSelectedMinutes(minutes);
});

startTimerButton.addEventListener("click", startFocusTimer);
pauseTimerButton.addEventListener("click", pauseFocusTimer);
resetTimerButton.addEventListener("click", resetFocusTimer);
alarmToggleButton.addEventListener("click", toggleAlarm);
clockAlarmToggle.addEventListener("click", toggleClockAlarm);
alarmHourSelect.addEventListener("change", () => {
  saveClockAlarm();
  clockAlarmLastKey = "";
  showChefSolo("alarm", 9000, 0.35);
});
alarmMinuteSelect.addEventListener("change", () => {
  saveClockAlarm();
  clockAlarmLastKey = "";
  showChefSolo("alarm", 9000, 0.35);
});
dailyQuoteButton.addEventListener("click", showDailyQuote);
luckyFortuneButton.addEventListener("click", showLuckyFortune);
nameSettingsButton.addEventListener("click", () => {
  const willOpen = namePanel.hidden;
  namePanel.hidden = !willOpen;
  nameSettingsButton.setAttribute("aria-expanded", String(willOpen));
  if (willOpen) {
    themePanel.hidden = true;
    bgmPanel.hidden = true;
    themeSettingsButton.setAttribute("aria-expanded", "false");
    bgmSettingsButton.setAttribute("aria-expanded", "false");
  }
  if (willOpen) userNameInput.focus();
});
saveNameButton.addEventListener("click", saveUserName);
clearNameButton.addEventListener("click", () => {
  userNameInput.value = "";
  saveUserName();
});
userNameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") saveUserName();
});
themeSettingsButton.addEventListener("click", () => {
  const willOpen = themePanel.hidden;
  themePanel.hidden = !willOpen;
  themeSettingsButton.setAttribute("aria-expanded", String(willOpen));
  if (willOpen) {
    namePanel.hidden = true;
    bgmPanel.hidden = true;
    nameSettingsButton.setAttribute("aria-expanded", "false");
    bgmSettingsButton.setAttribute("aria-expanded", "false");
  }
});
themeChoices.forEach((button) => {
  button.addEventListener("click", () => saveTheme(button.dataset.theme));
});
bgmSettingsButton.addEventListener("click", () => {
  const willOpen = bgmPanel.hidden;
  bgmPanel.hidden = !willOpen;
  bgmSettingsButton.setAttribute("aria-expanded", String(willOpen));
  if (willOpen) {
    namePanel.hidden = true;
    themePanel.hidden = true;
    nameSettingsButton.setAttribute("aria-expanded", "false");
    themeSettingsButton.setAttribute("aria-expanded", "false");
  }
});
bgmToggle.addEventListener("click", toggleBgm);
bgmMode.addEventListener("change", () => {
  bgmModeValue = bgmMode.value;
  bgmEnabled = bgmModeValue !== "off";
  stopBgm();
  if (bgmEnabled) startBgm();
  saveBgmSettings();
  updateBgmUi();
  showChefSolo("bgm", 9000, 0.6);
});
bgmVolume.addEventListener("change", () => {
  bgmVolumeValue = Number(bgmVolume.value) || 0.04;
  if (bgmGain && audioContext) {
    bgmGain.gain.setTargetAtTime(alarmRinging ? bgmVolumeValue * 0.12 : bgmVolumeValue, audioContext.currentTime, 0.2);
  }
  saveBgmSettings();
  showChefSolo("bgm", 9000, 0.35);
});

sheet.addEventListener("load", () => {
  frameWidth = Math.floor(sheet.naturalWidth / columns);
  frameHeight = Math.floor(sheet.naturalHeight / rows);
  canvas.width = Math.max(1, Math.round(frameWidth * 2));
  canvas.height = Math.max(1, Math.round(frameHeight * 2));
  drawFrame();
  requestAnimationFrame(animate);
});

sheet.addEventListener("error", () => {
  hideChefMessage();
  message.textContent = "画像が見つかりません";
});

stage.addEventListener("click", () => {
  if (alarmRinging) {
    stopAlarm();
    return;
  }
  chooseAction();
});
stage.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    if (alarmRinging) {
      stopAlarm();
      return;
    }
    chooseAction();
  }
});
stage.tabIndex = 0;

loadUserName();
populateClockAlarmOptions();
loadClockAlarm();
loadBgmSettings();
loadTheme();
updateClock();
updateMoodDisplay();
setTimerDisplays(remainingSeconds);
scheduleNextConversation(20000 + Math.random() * 40000);
window.setTimeout(() => showChefSolo("startup", 10000, 0.8), 6500);
window.setInterval(updateClock, 1000);
registerServiceWorker();
