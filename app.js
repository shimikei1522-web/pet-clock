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
  ],
  morning: [
    "朝の一手目は、軽く整えるところから",
    "今日のメモを一行だけ書いてみよう",
    "窓を開けるみたいに、気持ちも少し広げよう",
    "最初の準備が、あとで助けてくれるよ",
  ],
  afternoon: [
    "午後は道具チェックから始めてもいいよ",
    "目が疲れたら、遠くを少し見よう",
    "お昼のあとこそ、ゆっくり切り替えよう",
    "一度に抱えず、順番を決めてみよう",
  ],
  evening: [
    "今日できたことを、ひとつだけ数えよう",
    "片づけまでが、明日の準備になるよ",
    "夕方は仕上げより確認が似合う時間だね",
    "残りは小さく区切って進めよう",
  ],
  night: [
    "夜は考えをメモに預けてもいいよ",
    "眠る前の準備も、立派な作業だよ",
    "明日の自分に、少し余白を残そう",
    "今日はここまで、という合図も大切だよ",
  ],
  focus: [
    "今は一つの作業だけ見ていよう",
    "集中の波に、静かに乗れているよ",
    "余計なことは、あとで拾えば大丈夫",
    "手順を一つ終えたら、小さく丸をつけよう",
  ],
  timerComplete: [
    "一つ区切れたね。肩をゆるめよう",
    "よく戻ってこられたね。ここで一息",
    "集中のあとには、整える時間をどうぞ",
    "今の積み重ね、ちゃんと残っているよ",
  ],
  clockAlarm: [
    "約束の時間だよ。タップで止めてね",
    "時間になったよ。合図に気づいてね",
    "ここで一度、予定を確認しよう",
    "お知らせだよ。ペットをタップしてね",
  ],
  dailyQuote: [
    "今日の言葉、ポケットに入れておこう",
    "この一言、あとで効いてくるかも",
    "読めたね。次は小さく動いてみよう",
  ],
  lucky: [
    "今日のラッキー、こっそり味方だよ",
    "いい予感は、作業台のすみに置いておこう",
    "ラッキーを見つける目、今日は冴えてるよ",
  ],
  named: [
    "、今できたところから見てみよう",
    "、今日は整える日でもいいよ",
    "、迷ったら一つだけ試してみよう",
    "、手順を小さく分けてみよう",
  ],
};

const extraSeasonReplies = {
  spring: ["春の軽さで、まず一つ整えよう", "いちごみたいに明るい一歩にしよう"],
  summer: ["レモンみたいに、さっぱり切り替えよう", "暑い日は、確認も涼しめにいこう"],
  autumn: ["栗をむくみたいに、少しずつ進めよう", "かぼちゃ色の落ち着きで見直そう"],
  winter: ["焼き菓子の香りみたいに、ゆっくり温めよう", "冷える日は、手元を大事に進めよう"],
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
  if (Math.random() < 0.35) showChefMessage(randomItem(extraPetReplies.dailyQuote), 8000);
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
  if (Math.random() < 0.35) showChefMessage(randomItem(extraPetReplies.lucky), 8000);
}

function scheduleNextConversation(delay = 120000 + Math.random() * 180000) {
  nextConversationAt = Date.now() + delay;
}

function getConversationPair() {
  if (userName && Math.random() < 0.35) {
    return randomItem([
      [`${userName}、手元を一つ整えよう`, `${userName}のペースで十分だよ`],
      [`${userName}、今の一歩を見てね`, "そこから次が見えてくるよ"],
      [`${userName}、考えすぎたら一つ試そう`, "小さく試すのはいい方法だよ"],
    ]);
  }
  if (Math.random() < 0.25) {
    return randomItem([conversations.seasonal[getSeasonKey()], extraConversations.seasonal[getSeasonKey()]]);
  }
  const period = getTimePeriod();
  const pool = timerRunning
    ? [...conversations.focus, ...extraConversations.focus]
    : [...conversations.normal, ...extraConversations.normal, ...extraConversations[period]];
  return randomItem(pool);
}

function maybeShowConversation() {
  const now = Date.now();
  if (now < nextConversationAt) return;
  if (alarmRinging || now < quoteHoldUntil) {
    scheduleNextConversation(60000);
    return;
  }
  const [petText, chefText] = getConversationPair();
  quoteHoldUntil = now + 10000;
  message.textContent = petText;
  showChefMessage(chefText, 10000);
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
  setAction(next, randomItem(replyPool));
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
  if (next !== "idle" && !alarmRinging) {
    setAction.timer = window.setTimeout(() => setAction("idle", timerRunning ? `${namePrefix()}${randomItem(extraPetReplies.focus)}` : namedPeriodText()), next === "run" ? 1600 : 1200);
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
    const [petText, chefText] = randomItem(extraConversations.timerComplete);
    message.textContent = `${namePrefix()}${petText}`;
    showChefMessage(chefText, 10000);
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
});
alarmMinuteSelect.addEventListener("change", () => {
  saveClockAlarm();
  clockAlarmLastKey = "";
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
});
bgmVolume.addEventListener("change", () => {
  bgmVolumeValue = Number(bgmVolume.value) || 0.04;
  if (bgmGain && audioContext) {
    bgmGain.gain.setTargetAtTime(alarmRinging ? bgmVolumeValue * 0.12 : bgmVolumeValue, audioContext.currentTime, 0.2);
  }
  saveBgmSettings();
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
window.setInterval(updateClock, 1000);
registerServiceWorker();
