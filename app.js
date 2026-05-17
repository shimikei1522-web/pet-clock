const canvas = document.querySelector("#pet");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const stage = document.querySelector("#stage");
const message = document.querySelector("#message");
const chefMessage = document.querySelector("#chefMessage");
const animalMessage = document.querySelector("#animalMessage");
const chefFriend = document.querySelector(".friend");
const animalFriend = document.querySelector(".animal-friend");
const analogClock = document.querySelector("#analogClock");
const controlPanel = document.querySelector(".panel");
const moodValue = document.querySelector("#mood");
const energyValue = document.querySelector("#energy");
const clock = document.querySelector("#clock");
const currentDateDisplay = document.querySelector("#currentDate");
const largeClockDisplay = document.querySelector("#largeClockDisplay");
const stageTimerLabel = document.querySelector("#stageTimerLabel");
const stageTimerDisplay = document.querySelector("#stageTimerDisplay");
const largeTimerDisplay = document.querySelector("#largeTimerDisplay");
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
const anniversarySettingsButton = document.querySelector("#anniversarySettingsButton");
const anniversaryPanel = document.querySelector("#anniversaryPanel");
const anniversaryType = document.querySelector("#anniversaryType");
const anniversaryMonth = document.querySelector("#anniversaryMonth");
const anniversaryDay = document.querySelector("#anniversaryDay");
const anniversaryName = document.querySelector("#anniversaryName");
const anniversaryMemo = document.querySelector("#anniversaryMemo");
const saveAnniversaryButton = document.querySelector("#saveAnniversaryButton");
const clearAnniversaryButton = document.querySelector("#clearAnniversaryButton");
const anniversaryList = document.querySelector("#anniversaryList");
const bgmSettingsButton = document.querySelector("#bgmSettingsButton");
const bgmPanel = document.querySelector("#bgmPanel");
const bgmToggle = document.querySelector("#bgmToggle");
const bgmMode = document.querySelector("#bgmMode");
const bgmVolume = document.querySelector("#bgmVolume");
const speechToggleButton = document.querySelector("#speechToggleButton");
const voiceCommandButton = document.querySelector("#voiceCommandButton");
const petStyleToggleButton = document.querySelector("#petStyleToggleButton");
const calculatorButton = document.querySelector("#calculatorButton");
const calculatorPanel = document.querySelector("#calculatorPanel");
const calculatorCloseButton = document.querySelector("#calculatorCloseButton");
const calculatorDisplay = document.querySelector("#calculatorDisplay");
const calculatorKeys = document.querySelector("#calculatorPanel .calculator-keys");
const timeChoices = document.querySelectorAll(".time-choice");
const customMinutes = document.querySelector("#customMinutes");
const startTimerButton = document.querySelector("#startTimer");
const pauseTimerButton = document.querySelector("#pauseTimer");
const resetTimerButton = document.querySelector("#resetTimer");
const largeTimerToggle = document.querySelector("#largeTimerToggle");
const largeClockToggle = document.querySelector("#largeClockToggle");
const analogClockToggle = document.querySelector("#analogClockToggle");
const alarmHourSelect = document.querySelector("#alarmHour");
const alarmMinuteSelect = document.querySelector("#alarmMinute");
const clockAlarmToggle = document.querySelector("#clockAlarmToggle");

const sheet = new Image();
sheet.src = "./assets/spritesheet.webp";
const petStyleSources = {
  classic: "./assets/spritesheet.webp",
  new: "./assets/pepaatennko-newstyle-spritesheet.png.png",
};

const columns = 8;
const rows = 9;
let frameWidth = 1;
let frameHeight = 1;
let frameIndex = 0;
let action = "idle";
let animationStarted = false;
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
let largeTimerEnabled = false;
let largeClockEnabled = false;
let clockDisplayMode = "digital";
let audioContext = null;
let bgmGain = null;
let bgmOscillators = [];
let bgmTimer = 0;
let bgmEnabled = false;
let bgmStarted = false;
let bgmModeValue = "off";
let bgmVolumeValue = 0.04;
let speechEnabled = false;
let speechSupported = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
let speechVoices = [];
let pendingSpeechItems = [];
let speechFlushQueued = false;
let speechVoiceListenerReady = false;
let voiceRecognition = null;
let voiceCommandListening = false;
let voiceCommandEnabled = false;
let voiceCommandRestartTimer = 0;
let lastVoiceCommandName = "";
let lastVoiceCommandAt = 0;
const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
let calculatorValue = "0";
let calculatorStoredValue = null;
let calculatorOperator = "";
let calculatorWaitingForValue = false;
let calculatorError = false;
let calculatorPressCount = 0;
let calculatorReactionTimer = 0;
let quoteHoldUntil = 0;
let chefBubbleTimer = 0;
let animalBubbleTimer = 0;
let nextConversationAt = Date.now() + 120000;
let clockIntervalId = 0;
let clockAlarmEnabled = false;
let clockAlarmLastKey = "";
let userName = "";
let anniversaries = {};
let selectedTheme = "fresh";
let selectedPetStyle = "classic";
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
  morning: { text: "おはよう。今日もゆっくり始めよう。", replies: ["おはよう。今日もゆっくり始めよう。", "朝の一歩は、今日の流れを作るよ。", "最初は軽めでも大丈夫。", "朝の空気で、気持ちを落ち着けよう。", "今日もゆっくり始めよう。"], action: "cheer" },
  afternoon: { text: "こんにちは。今日もいい感じに進めよう。", replies: ["お昼のあとも、少しずついこう。", "午後は午後のペースで大丈夫。", "ここで一回、流れを作り直そう。", "午前のがんばり、ちゃんと残ってるよ。", "眠くなったら、少し体を動かそう。"], action: "wave" },
  evening: { text: "こんばんは。今日もおつかれさま。", replies: ["夕方までよく進めたね。", "今日の残りは、無理なくいこう。", "終わり方を丁寧にすると、明日が楽だよ。", "あと少しだけ、片づける気持ちでいこう。", "今日できたことを一つ見つけよう。"], action: "wave" },
  night: { text: "こんばんは。そろそろ無理しすぎないでね。", replies: ["夜はがんばりすぎ注意だよ。", "そろそろ休む準備もしていこう。", "明日の自分にやさしくしよう。", "眠くなる前に、区切りを作ろう。", "今日はここまででも十分だよ。"], action: "shy" },
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
  "今日も一緒に、全力で楽しもうね！",
  "{name}なら絶対大丈夫、いってらっしゃい！",
  "いつも一生懸命なところ、本当にカッコいいと思ってるよ！",
  "無理しないで、自分のペースでボチボチがんばろ！",
  "何かあったらいつでも言ってね。私はずっと味方だから！",
  "今日も一日、お互いハッピーに過ごそうね！",
  "{name}の笑顔を見ると、こっちまで元気になっちゃうよ！",
  "テスト、緊張するかもしれないけど、いつもの{name}なら大丈夫！",
  "発表のとき緊張したら、私の席を見て！ニコって笑って応援してるからね。",
  "宿題とかいつも頑張っててえらい！今日も応援してるよ。",
  "間違えてもドンマイ！次、がんばれば全然オッケーだよ！",
  "今日の目標に向かって、一緒にファイトー！",
  "{name}なら、きっとうまくいくって信じてるよ！",
  "今日の試合、絶対勝てるよ！応援の準備はバッチリだからね！",
  "失敗しても気にしないで！みんなでカバーするから楽しもう！",
  "{name}の運動神経なら、今日のドッジボールや試合も大活躍間違いなし！",
  "同じチームになれてめちゃくちゃ嬉しい！一緒にがんばろうね。",
  "最後まであきらめずに走る姿、すっごく応援したくなる！",
  "今日もお疲れ様！がんばってるの、ちゃんと知ってるからね。",
  "いつも話を聞いてくれてありがとう。今日は私が元気をあげる番だよ！",
];
const DAILY_QUOTE_VERSION = 3;
const dailyQuoteFallbacks = {
  "{name}なら絶対大丈夫、いってらっしゃい！": "きっと大丈夫、いってらっしゃい！",
  "{name}の笑顔を見ると、こっちまで元気になっちゃうよ！": "笑顔を見ると、こっちまで元気になっちゃうよ！",
  "テスト、緊張するかもしれないけど、いつもの{name}なら大丈夫！": "テスト、緊張するかもしれないけど、いつも通りなら大丈夫！",
  "{name}なら、きっとうまくいくって信じてるよ！": "きっとうまくいくって信じてるよ！",
  "{name}の運動神経なら、今日のドッジボールや試合も大活躍間違いなし！": "今日のドッジボールや試合も、大活躍間違いなし！",
};

const seasonalEvents = {
  spring: { className: "season-spring", messages: ["春は新しいことを始めたくなるね。", "春の空気って、なんだかわくわくするね。"], quotes: ["春はゆっくり始めるのにぴったりだね。"], sweets: ["いちごタルト", "桜クッキー"] },
  summer: { className: "season-summer", messages: ["暑い日は、水分補給も作業のうちだよ。", "夏は少しゆっくりでも大丈夫。"], quotes: ["暑い日は無理しないくらいでいこう。"], sweets: ["レモンゼリー", "アイスクリーム"] },
  autumn: { className: "season-autumn", messages: ["秋の香りって、焼き菓子みたいだね。", "季節が変わると、作りたいものも変わるね。"], quotes: ["秋は香りを楽しみながら進めよう。"], sweets: ["栗のマフィン", "かぼちゃプリン"] },
  winter: { className: "season-winter", messages: ["寒い日は、あたたかい飲み物が味方だね。", "冬の作業は、手元をあたためてからね。"], quotes: ["寒い日は体をあたためてから始めよう。"], sweets: ["シュトーレン", "チョコケーキ"] },
};

const luckySweets = ["クロワッサン","シュークリーム","マドレーヌ","プリン","ベーグル","メロンパン","フィナンシェ","ロールケーキ","食パン","クリームパン","チョココロネ","カヌレ","スコーン","レモンタルト","いちごショート","アップルパイ","チーズケーキ","ドーナツ","バターロール","ミルクパン"];
const luckyColors = ["ミントグリーン","いちごレッド","クリームイエロー","ココアブラウン","シュガーホワイト","ベリーピンク","空色ブルー","ピスタチオグリーン","レモンイエロー","カフェラテ色","さくらピンク","オレンジ","ラベンダー","バニラホワイト","チョコレート色"];
const luckyMessages = ["今日は丁寧に進めると良い日！","ひと休みのあとに、いいアイデアが出そう。","しっかり確認すると安心だね。","次にやることを一つ決めよう。","無理しないくらいでいこう。","ラッキーお菓子はプリン。やさしく進めよう。","ラッキーパンはクロワッサン。いい流れが来そう。","ラッキー行動は深呼吸。落ち着くと見えてくるよ。","ラッキーカラーはクリーム色。やわらかい気持ちでいこう。","ラッキーお菓子はシュークリーム。ふんわり進めよう。","ラッキーパンは食パン。基本を大切にするとよさそう。","ラッキー行動は机をきれいにすること。","ラッキーカラーはミント。気分がすっきりしそう。","ラッキーお菓子はマドレーヌ。小さな幸せがありそう。","ラッキーパンはメロンパン。今日は少し楽しくいこう。","ラッキー行動は水分補給。元気が戻りそう。","ラッキーカラーはさくらピンク。やさしい日になりそう。","ラッキーお菓子はアップルパイ。いい香りの一日だよ。","ラッキーパンはバターロール。丸く進めば大丈夫。","ラッキー行動は道具をそろえること。"];

const moodProfiles = [
  { name: "ねむい", minMood: 0, maxMood: 45, minEnergy: 0, maxEnergy: 46, messages: ["少し眠そうだね。休憩しよう。", "今日はゆっくりめでいこう。"] },
  { name: "おなかすいた", minMood: 0, maxMood: 58, minEnergy: 47, maxEnergy: 99, messages: ["おなかすいたかも。ひと息つこう。", "軽く食べたら元気が出そう。"] },
  { name: "のんびり中", minMood: 46, maxMood: 72, minEnergy: 0, maxEnergy: 62, messages: ["のんびり進めよう。", "少しずつで大丈夫。"] },
  { name: "ごきげん", minMood: 59, maxMood: 99, minEnergy: 0, maxEnergy: 72, messages: ["今日もいい感じだよ。", "いい流れになってきたね。"] },
  { name: "やる気満々", minMood: 73, maxMood: 99, minEnergy: 63, maxEnergy: 99, messages: ["集中力が高まってきたね。", "その調子、その調子。"] },
];

const conversations = { normal: [["今日もいい感じだね", "その調子でいきましょう"], ["少しずつ進んでるね", "積み重ねが大事です"], ["焦らなくていいよ", "丁寧さを大切にしましょう"], ["集中力が高まってきたね", "いいリズムです"], ["休憩する？", "一度休むのも大切です"], ["作業台、きれいにする？", "次にやることが見えやすくなります"], ["今日は準備の日かも", "結果はあとからついてきます"], ["ちょっと考えすぎたかも", "一つ試すと見えてきます"], ["今の一歩、よかったね", "少し進んだことを大事にしましょう"], ["焼く前の確認って大事だね", "最後の確認が仕上がりを守ります"], ["今日はゆっくりめでいい？", "丁寧に進める日も必要です"], ["頭がいっぱいだね", "一つだけ書き出してみましょう"], ["おいしい予感がする", "その予感を形にしていきましょう"], ["集中力が上がってきたね", "いい感じで進んでいます"], ["そろそろ区切る？", "区切ると続きが楽になります"], ["手元、いい感じだよ", "落ち着いていますね"], ["少し眠くない？", "無理せず休憩を入れましょう"], ["今日も見守ってるよ", "私も見守っています"], ["いい香りがしそう", "丁寧な作業の証拠ですね"], ["今の確認、えらいね", "確認できるのは、とてもいいことです"]], morning: [["朝はゆっくり始めよう", "最初の流れを作りましょう"], ["午後も少しずつね", "ペースを作り直しましょう"], ["夕方までよく進んだね", "終わり方を丁寧にしましょう"], ["夜は無理しすぎないでね", "明日の自分にも優しくしましょう"]], afternoon: [["春ってわくわくするね", "新しいことを始めたくなる季節ですね"], ["暑い日は水分だね", "体調管理も大事です"], ["秋は焼き菓子っぽいね", "香りを楽しみたくなりますね"], ["寒い日は温まりたいね", "手元も冷やさないようにしましょう"], ["雨の日は静かだね", "集中しやすい空気です"], ["今は一つに集中だね", "その判断で大丈夫です"]], evening: [["タイマー中だよ", "短い時間を大切にしましょう"], ["あと少しだね", "最後まで落ち着いて"], ["終わったね！", "よく集中できました"], ["休憩の時間だよ", "しっかり休みましょう"], ["アラーム鳴ってるよ", "まず止めてから確認しましょう"]], night: [["BGM変えた？", "気分に合う音は大事ですね"], ["今日のひとこと、いいね", "いい言葉でしたね"], ["占い、どうだった？", "いいきっかけにしましょう"], ["名前を呼ぶと近く感じるね", "自然でいいですね"], ["ちょっと笑ってもいい？", "気持ちがほぐれるならいいですね"]], focus: [["ぼく、応援上手かな", "かなり上手ですよ"], ["シェフも見守ってる？", "もちろんです"], ["今日の集中、焼きたて級", "かわいい言い方ですね"], ["やる気がふくらんできた", "ふくらみすぎには注意ですね"], ["休憩も仕事のうち？", "もちろん大事です"], ["道具を並べようかな", "いい判断です"], ["今の作業、丁寧だね", "仕上がりにも出ますよ"], ["少し迷ってる？", "基本に戻りましょう"]], timerComplete: [["失敗しそうでこわいね", "確認すると防げることもあります"], ["一回深呼吸しよう", "落ち着きは大切です"], ["ここまで来たね", "ここまでよく進めました"], ["今日はゆっくり進める日だね", "そういう日も大切です"], ["次は何からやる？", "いちばん簡単なところから始めましょう"], ["手が止まったね", "考える時間も必要です"], ["少し進んだよ", "それで十分です"], ["いい表情してるよ", "集中している証拠ですね"]], seasonal: { spring: ["春ってわくわくするね","新しいことを始めたくなる季節ですね"], summer: ["暑い日は水分だね","体調管理も大事です"], autumn: ["秋は焼き菓子っぽいね","香りを楽しみたくなりますね"], winter: ["寒い日は温まりたいね","手元も冷やさないようにしましょう"] } };

const extraPetReplies = { normal: ["今日もいい感じだよ。", "ひとつずつ進めよう。", "今のペースで大丈夫。", "ちゃんと前に進んでるよ。", "少しずつ形になってるね。", "迷ったら、まず一つだけやってみよう。", "今できることから始めよう。", "完璧じゃなくても大丈夫。", "ここまで来たの、ちゃんとすごいよ。", "今日の一歩、いい一歩だね。", "手を動かすと、気持ちも動くよ。", "いい流れになってきたね。", "焦らず、今の作業を大事にしよう。", "できたところを見てみよう。", "ちゃんと積み重なってるよ。", "その調子、その調子。", "今日は少しゆっくり進めてもいいよ。", "小さな前進も大事だよ。", "まずは少しだけ進めてみよう。", "集中力が高まってきたね。", "いまの頑張り、見てたよ。", "ゆっくりでも進めば大丈夫。", "できるところからでいいよ。", "今日は自分にもやさしくしよう。", "ここからまた始めたらいいよ。", "ひとつ終わると、次が軽くなるよ。", "うまくいかない時もあるよね。", "でも、続けてるのがすごいよ。", "今の確認、いい判断だね。", "丁寧に進めてるの、伝わるよ。", "今日も一緒に進もうね。", "少しずつできてきたね。", "いまの集中、いい感じだよ。", "焦らず、ひとつずついこう。", "がんばってるの、ちゃんと見てるよ。", "休憩したら、また一緒に始めよう。", "今日の作業、いい感じに進んでるね。", "深呼吸して、もう一回いこう。", "できたところを見ると、ちょっと元気出るよ。", "焼きたてみたいに、いい気分になってきたね。", "ちょっとずつ進むの、いいね。", "ここまで来たら、もう十分えらいよ。", "いまの一歩、かわいく拍手したい。", "そっと応援してるよ。", "今日はいい流れになりそう。", "うまくいく予感がするよ。", "少し休んでも、ちゃんと戻れるよ。", "ぼくもとなりで見てるね。", "あわてなくていいよ。", "いっしょにゆっくり進もう。", "集中してる顔、職人っぽいよ。", "今の集中、焼きたて級だね。", "やる気が少しふくらんできたかも。", "ぼくの応援は音量ひかえめです。", "休まないと、ぼくが先に眠くなるよ。", "その集中、予熱完了って感じ。", "やることリスト、ちょっとずつ小さくなったらいいのにね。", "気合い入りすぎて、帽子が飛びそう。", "ぼくは見守り担当、逃げません。", "今なら難しい作業も、少しやさしく見えるかも。", "ちょっとだけ、できる人の顔してたよ。", "集中力、今日はいい焼き色だね。", "ぼくも真剣な顔をしてみたよ。", "いまの動き、プロっぽかったよ。", "休憩の合図、ぼくが出してもいい？", "やる気がこぼれそうだね。", "その集中、あとでまた使いたいくらいだね。", "ぼくの応援で1％くらい上がった？", "今日はなんだか、できる子感あるよ。", "いい感じすぎて、ちょっと誇らしいよ。", "生地も気持ちも、休ませると落ち着くよ。", "混ぜすぎ注意、考えすぎも少し注意だね。", "準備を丁寧にすると、あとが楽になるよ。", "焼き上がりを待つ時間も大事だね。", "粉をふるうみたいに、頭の中もすっきりさせよう。", "発酵を待つみたいに、結果も少し待とう。", "最後の確認は、焼く前みたいに大事だね。", "今日の作業、いい香りがしてきそう。", "丁寧な手つきは、ちゃんと伝わるよ。", "クリームみたいに、やさしくいこう。", "準備ができている日は、うまく進みやすいね。", "失敗しそうな時ほど、手元を見よう。", "焼き色を見るみたいに、今の様子を見てみよう。", "ひと手間かけると、あとで助かるよ。", "仕上げは急がず、落ち着いていこう。", "いい仕事は、しっかり確認するところから始まるよ。", "今日は準備の日でもいいね。", "すぐ結果が出なくても、少しずつ形になってるよ。", "道具を並べると、気持ちもすっきりするよ。", "丁寧にやると、あとで助けてくれるよ。", "肩が固まる前に、少し伸びよう。", "目を休ませるのも大事だよ。", "水分補給、忘れてない？", "深呼吸を一回しよう。", "少し離れると、見えることもあるよ。", "休憩はサボりじゃないよ。", "疲れたら、机をきれいにするだけでも十分。", "頭がいっぱいなら、一つ書き出そう。", "一度止まると、次の一歩が軽くなるよ。", "がんばるために、少し休もう。", "今日は無理しすぎないでね。", "休む時間も、次の準備だよ。", "少し背中を伸ばそう。", "手を止めて、今できたことを見よう。", "ここで区切るのもいい判断だよ。"], morning: ["おはよう。今日もゆっくり始めよう。", "朝の一歩は、今日の流れを作るよ。", "最初は軽めでも大丈夫。", "朝の空気で、気持ちを落ち着けよう。", "今日もゆっくり始めよう。"], afternoon: ["お昼のあとも、少しずついこう。", "午後は午後のペースで大丈夫。", "ここで一回、流れを作り直そう。", "午前のがんばり、ちゃんと残ってるよ。", "眠くなったら、少し体を動かそう。"], evening: ["夕方までよく進めたね。", "今日の残りは、無理なくいこう。", "終わり方を丁寧にすると、明日が楽だよ。", "あと少しだけ、片づける気持ちでいこう。", "今日できたことを一つ見つけよう。"], night: ["夜はがんばりすぎ注意だよ。", "そろそろ休む準備もしていこう。", "明日の自分にやさしくしよう。", "眠くなる前に、区切りを作ろう。", "今日はここまででも十分だよ。"], focus: ["集中力が高まってきたね。", "いまの集中、いい感じだよ。", "焦らず、ひとつずついこう。", "集中してる顔、職人っぽいよ。", "今の集中、焼きたて級だね。", "やる気が少しふくらんできたかも。", "ぼくの応援は音量ひかえめです。", "休まないと、ぼくが先に眠くなるよ。", "その集中、予熱完了って感じ。", "やることリスト、ちょっとずつ小さくなったらいいのにね。"], timerComplete: ["ひとつ終わったね。よくがんばったよ。", "休憩したら、また一緒に始めよう。", "ここまで来たの、ちゃんとすごいよ。", "少し休んでも、ちゃんと戻れるよ。"], clockAlarm: ["アラームの時間だよ。ペットをタップして止めてね。", "時間になったよ。まずはアラームを止めよう。"], dailyQuote: ["今日もゆっくり始めよう。", "ひとつずつ進めよう。"], lucky: ["うまくいく予感がするよ。", "今日はいい流れになりそう。"], named: ["、今日もいい感じだよ。", "、今の一歩よかったよ。", "、無理せず続けよう。", "、ちゃんと進んでるよ。", "、休憩も忘れないでね。", "、焦らず手元を大切にしよう。", "、ここまで来たのすごいよ。", "、次の一歩も一緒にいこう。", "、今日は少しゆっくり進めてもいいよ。", "、今できる一つに集中しよう。", "、その調子でいこう。", "、集中力が高まってきたね。", "、少し肩の力を抜こう。", "、今日のがんばり見てるよ。", "、ここで一度深呼吸しよう。"] };
const extraSeasonReplies = { spring: ["春は新しいことを始めたくなるね。", "春の空気って、なんだかわくわくするね。"], summer: ["暑い日は、水分補給も作業のうちだよ。", "夏は少しゆっくりでも大丈夫。"], autumn: ["秋の香りって、焼き菓子みたいだね。"], winter: ["寒い日は、あたたかい飲み物が味方だね。", "冬の作業は、手元をあたためてからね。"] };
const extraConversations = { normal: [["今日は無理しない作戦だよ", "長く続けるには大切です"], ["今の確認、ナイス", "いいくせですね"], ["作業の区切りを作ろう", "次が始めやすくなります"], ["この空気、いいね", "落ち着いた時間です"], ["今は静かに応援するね", "そっと応援するのも大事です"], ["そっと見守る作戦だよ", "いい作戦です"], ["今日の作業、少しずつ進んでるね", "少しずつ形になっていきます"], ["小さな確認、大きいね", "ミスを少なくしてくれます"], ["もう少しだけいけそう？", "無理しないくらいでいきましょう"], ["終わったら褒めようね", "今もちゃんと褒めていいですよ"], ["今日はいい日になりそう", "いい流れにしていきましょう"], ["ちょっと疲れたかも", "休憩を入れましょう"], ["また始めればいいよね", "何度でも始められます"], ["手元に戻ろう", "今はそこを見るのがよさそうですね"], ["やることが多いね", "一つずつ分けましょう"], ["今日はここまででもいい？", "十分な日もあります"], ["次にやること、見えた？", "少し見えてきましたね"], ["最後まで落ち着いてね", "仕上げは特に丁寧に"], ["また一緒に進もう", "いつでも見守っています"]], morning: [["朝はゆっくり始めよう", "最初の流れを作りましょう"], ["午後も少しずつね", "ペースを作り直しましょう"]], afternoon: [["夕方までよく進んだね", "終わり方を丁寧にしましょう"], ["夜は無理しすぎないでね", "明日の自分にも優しくしましょう"]], evening: [["夜は無理しすぎないでね", "明日の自分にも優しくしましょう"], ["今日はゆっくり進める日だね", "そういう日も大切です"]], night: [["夜は無理しすぎないでね", "明日の自分にも優しくしましょう"]], focus: [["今は一つに集中だね", "その判断で大丈夫です"], ["タイマー中だよ", "短い時間を大切にしましょう"], ["あと少しだね", "最後まで落ち着いて"], ["終わったね！", "よく集中できました"]], timerComplete: [["終わったね！", "よく集中できました"], ["休憩の時間だよ", "しっかり休みましょう"]], seasonal: { spring: ["春ってわくわくするね","新しいことを始めたくなる季節ですね"], summer: ["暑い日は水分だね","体調管理も大事です"], autumn: ["秋は焼き菓子っぽいね","香りを楽しみたくなりますね"], winter: ["寒い日は温まりたいね","手元も冷やさないようにしましょう"] } };
const moreConversations = { normal: [], morning: [], afternoon: [], evening: [], night: [], focus: [], timerComplete: [], seasonal: { spring: [["春ってわくわくするね","新しいことを始めたくなる季節ですね"]], summer: [["暑い日は水分だね","体調管理も大事です"]], autumn: [["秋は焼き菓子っぽいね","香りを楽しみたくなりますね"]], winter: [["寒い日は温まりたいね","手元も冷やさないようにしましょう"]] } };
const chefSoloLines = { normal: ["いい手つきですね。", "その確認、大事ですよ。", "焦らず進めましょう。", "丁寧にやったことは、ちゃんと残ります。", "今の流れ、いい感じです。", "ここで一度、落ち着きましょう。", "仕上げほど落ち着いていきましょう。", "小さな確認が、ミスを少なくしてくれます。", "集中力が高まってきましたね。", "手元を見る時間を大切にしましょう。", "迷った時は基本に戻りましょう。", "作業台をきれいにすると、気持ちもすっきりします。", "今日はゆっくり丁寧にいきましょう。", "無理に急がなくて大丈夫です。", "いい仕事は準備から始まります。", "ここまでのがんばりが、ちゃんと力になっています。", "一度区切るのも、いい考えです。", "次の作業に入る前に確認しましょう。", "そのペースなら大丈夫です。", "落ち着いて進めると、仕上がりもよくなります。", "準備を丁寧にすると、あとでいいことがありますよ。", "焼き上がりを待つ時間も大事です。", "失敗しそうな時ほど、基本を見ましょう。", "今は手順を一つずつ確認しましょう。", "いいリズムで進んでいます。", "休憩を入れるのも大事ですよ。", "目を休ませてから続けましょう。", "水分補給も忘れずに。", "疲れた時は、道具を並べ直してみましょう。", "頭の中を一つずつ整理しましょう。", "朝は軽く始めるのがいいですね。", "午後はペースを作り直しましょう。", "夕方は終わり方を丁寧に。", "夜は無理を重ねすぎないように。", "明日の作業が楽になる終わり方をしましょう。", "今日できたことを確認しましょう。", "少し直すだけでも、次につながります。", "その気づき、とても大事です。", "うまくいかない時も、ちゃんと学びになります。", "手順を大切にできるのは、すごいことです。", "できあがりを思い浮かべながら進めましょう。", "丁寧に準備すると、あとで安心できます。", "作業の流れが見えてきましたね。", "少しゆっくりすると、考えやすくなります。", "今の集中を大事にしましょう。", "焼く前の確認みたいに、最後まで丁寧にいきましょう。", "生地を見るみたいに、今の様子を見ましょう。", "あわてずに、今の様子を見ましょう。", "落ち着いて進めると、仕上がりもよくなります。", "今日はいい準備ができそうです。", "その判断、とてもいいですね。", "少し手を止めるのも大事です。", "いま確認できたのは大きいです。", "あわてる気持ちは、少しだけ置いておきましょう。", "仕上げの前に深呼吸しましょう。", "良い香りがしてきそうですね。", "ここからが大事なところです。", "一つずつ、確実にいきましょう。", "今日は落ち着いて進められています。", "作業の区切りを作りましょう。", "落ち着いて集中できていますね。", "次にやることが見えてきました。", "ここは丁寧にいきましょう。", "少し落ち着いてから進めましょう。", "いい判断ができています。", "手順を大切にしましょう。", "ここまでよく進みました。", "焦らず、できあがりを見ましょう。", "今日の作業、ちゃんと形になっています。", "最後まで落ち着いていきましょう。"], startup: ["いい手つきですね。", "その確認、大事ですよ。", "焦らず進めましょう。", "丁寧にやったことは、ちゃんと残ります。"], morning: ["朝は軽く始めるのがいいですね。"], afternoon: ["午後はペースを作り直しましょう。"], evening: ["夕方は終わり方を丁寧に。"], night: ["夜は無理を重ねすぎないように。", "明日の作業が楽になる終わり方をしましょう。"], focus: ["集中力が高まってきましたね。", "手元を見る時間を大切にしましょう。", "今は手順を一つずつ確認しましょう。", "いいリズムで進んでいます。"], timerComplete: ["一度区切るのも、いい考えです。", "休憩を入れるのも大事ですよ。", "目を休ませてから続けましょう。", "水分補給も忘れずに。"], alarm: ["時間になりましたよ。ペットをタップしてくださいね。", "まずはアラームを止めましょう。"], theme: ["見やすい場所に整えるのは大事ですよ。"], bgm: ["作業しやすい音を選びましょう。"], dailyQuote: ["今日の言葉、そっと覚えておきましょう。"], lucky: ["小さなラッキーを楽しみましょう。"], season: ["季節の感じを少し楽しみましょう。"], idle: ["少し休んでいましたね。戻るなら一つだけで大丈夫ですよ。"], named: ["、今の進め方は良いですね。", "、焦らず確認しましょう。", "、ここで一度、落ち着きましょう。", "、集中力が高まってきましたね。", "、無理せず続けましょう。", "、基本に戻れば大丈夫です。", "、今の一歩、いいですね。", "、休憩も大事ですよ。", "、仕上げは落ち着いていきましょう。", "、今日の積み重ねは残ります。"] };
const animalFriendReplies = { normal: ["ねえねえ、一緒に応援しよう。", "今日も見守り係、よろしくね。", "小さな相棒、準備できた？", "そっちからも応援してあげて。", "一緒にいると心強いね。", "今日はふたりで見守る日だね。", "ちょこんと座ってるの、かわいいね。", "今の集中、見えてた？", "いい感じだよね、相棒。", "そっと応援する作戦でいこう。", "あまり騒がず、でも全力で応援だよ。", "小さな応援団、集合だね。", "見守るのも大事なお仕事だよ。", "今は静かに応援しよう。", "そろそろ休憩って伝える？", "がんばりすぎてないか見ててね。", "今日の作業、いい流れだよね。", "一緒にうなずいておこう。", "相棒、今日もいい表情してるね。", "小さくても応援力は大きいよ。", "この空気、なんだかいいね。", "焦らずいこうって伝えたいね。", "次の一歩、見守ってよう。", "今のがんばり、ちゃんと見てたよね。", "ちょっと眠そう？でもかわいいね。", "応援の準備、できてる？", "今日はやさしく見守る作戦だよ。", "ふたりでいると、にぎやかでいいね。", "小さな相棒も、いい仕事してるよ。", "この調子で、そっと背中を押そう。"], focus: ["今の集中、見えてた？", "いい感じだよね、相棒。", "そっと応援する作戦でいこう。", "あまり騒がず、でも全力で応援だよ。", "小さな応援団、集合だね。", "見守るのも大事なお仕事だよ。", "今は静かに応援しよう。"], rest: ["そろそろ休憩って伝える？", "がんばりすぎてないか見ててね。", "今日の作業、いい流れだよね。"], named: ["、ぼくも応援してるよ。", "、ここで見守ってるね。", "、今の一歩よかったよ。"] };
const animalFriendLines = { normal: ["となりで見てるね。", "ちょこんと応援中だよ。", "今日は応援係だよ。", "ぼくも一緒に応援するよ。", "そばにいると安心するね。", "ちょっと元気出た？", "なでられた気分で元気出たよ。", "こっそり応援してるよ。", "いま、いい顔してたよ。", "ぼくも背筋を伸ばしてるよ。", "その作業、見守ってるね。", "ちょっと休んでも、そばにいるよ。", "今日はやさしく応援する日。", "いい空気になってきたね。", "ふふ、なんだか楽しそう。", "ぼくも役に立ててるかな。", "ここで見守ってるよ。", "一緒にいると楽しいね。", "その調子で、そっと進もう。", "小さく拍手してるよ。", "ねえねえ、一緒に応援しよう。", "今日も見守り係、よろしくね。", "小さな相棒、準備できた？", "そっちからも応援してあげて。", "一緒にいると心強いね。", "今日はふたりで見守る日だね。", "ちょこんと座ってるの、かわいいね。", "今の集中、見えてた？", "いい感じだよね、相棒。", "そっと応援する作戦でいこう。", "あまり騒がず、でも全力で応援だよ。", "小さな応援団、集合だね。", "見守るのも大事なお仕事だよ。", "今は静かに応援しよう。"], focus: ["今の集中、見えてた？", "いい感じだよね、相棒。", "そっと応援する作戦でいこう。", "あまり騒がず、でも全力で応援だよ。", "小さな応援団、集合だね。", "見守るのも大事なお仕事だよ。", "今は静かに応援しよう。", "そろそろ休憩って伝える？"], rest: ["そろそろ休憩って伝える？", "がんばりすぎてないか見ててね。", "今日の作業、いい流れだよね。", "一緒にうなずいておこう。", "相棒、今日もいい表情してるね。", "小さくても応援力は大きいよ。", "この空気、なんだかいいね。", "焦らずいこうって伝えたいね。"], named: ["、ぼくも応援してるよ。", "、ここで見守ってるね。", "、今の一歩よかったよ。", "、そっと一緒に進もう。"] };
const friendlyChefSoloLines = chefSoloLines;


const recentPetLines = [];
const recentChefLines = [];
const recentConversationLines = [];
const recentAnimalLines = [];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatTime(date) {
  return [date.getHours(), date.getMinutes(), date.getSeconds()].map((value) => String(value).padStart(2, "0")).join(":");
}

function formatLargeClockTime(date) {
  const hour = String(date.getHours());
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");
  return `${hour}:${minute}:${second}`;
}

function formatDateLabel(date) {
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  return `${date.getMonth() + 1}月${date.getDate()}日（${weekdays[date.getDay()]}）`;
}

function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

const CALCULATOR_ERROR_TEXT = "\u30a8\u30e9\u30fc";
const calculatorOpenMessages = [
  "\u8a08\u7b97\u306e\u304a\u624b\u4f1d\u3044\u3059\u308b\u306d",
  "\u6570\u5b57\u3001\u307e\u304b\u305b\u3066\uff01",
  "\u3044\u3063\u3057\u3087\u306b\u8a08\u7b97\u3057\u3088\u3046",
];
const calculatorTypingMessages = [
  "\u3044\u3044\u611f\u3058\u306b\u5165\u529b\u3067\u304d\u3066\u308b\u3088",
  "\u8a08\u7b97\u4e2d\u3060\u306d",
  "\u6570\u5b57\u304c\u306a\u3089\u3093\u3067\u304d\u305f\u306d",
];

function formatCalculatorResult(value) {
  if (!Number.isFinite(value)) return CALCULATOR_ERROR_TEXT;
  const rounded = Math.round((value + Number.EPSILON) * 100000000) / 100000000;
  const normal = String(rounded);
  if (normal.length <= 12) return normal;
  return rounded.toPrecision(10).replace(/\.?0+e/, "e").replace(/\.?0+$/, "");
}

function updateCalculatorDisplay() {
  calculatorDisplay.textContent = calculatorValue;
}

function resetCalculator() {
  calculatorValue = "0";
  calculatorStoredValue = null;
  calculatorOperator = "";
  calculatorWaitingForValue = false;
  calculatorError = false;
  updateCalculatorDisplay();
}

function calculateValues(left, right, operator) {
  if (operator === "add") return left + right;
  if (operator === "subtract") return left - right;
  if (operator === "multiply") return left * right;
  if (operator === "divide") return right === 0 ? NaN : left / right;
  return right;
}

function setCalculatorError() {
  calculatorValue = CALCULATOR_ERROR_TEXT;
  calculatorStoredValue = null;
  calculatorOperator = "";
  calculatorWaitingForValue = true;
  calculatorError = true;
  updateCalculatorDisplay();
}

function inputCalculatorDigit(value) {
  if (calculatorError || calculatorWaitingForValue) {
    calculatorValue = value;
    calculatorWaitingForValue = false;
    calculatorError = false;
  } else if (calculatorValue === "0") {
    calculatorValue = value;
  } else if (calculatorValue.replace("-", "").replace(".", "").length < 12) {
    calculatorValue += value;
  }
  updateCalculatorDisplay();
}

function inputCalculatorDecimal() {
  if (calculatorError || calculatorWaitingForValue) {
    calculatorValue = "0.";
    calculatorWaitingForValue = false;
    calculatorError = false;
  } else if (!calculatorValue.includes(".")) {
    calculatorValue += ".";
  }
  updateCalculatorDisplay();
}

function inputCalculatorBackspace() {
  if (calculatorError || calculatorWaitingForValue) {
    resetCalculator();
    return;
  }
  calculatorValue = calculatorValue.length > 1 ? calculatorValue.slice(0, -1) : "0";
  updateCalculatorDisplay();
}

function inputCalculatorOperator(operator) {
  const current = Number(calculatorValue);
  if (!Number.isFinite(current)) {
    setCalculatorError();
    return;
  }
  if (calculatorStoredValue !== null && calculatorOperator && !calculatorWaitingForValue) {
    const result = calculateValues(calculatorStoredValue, current, calculatorOperator);
    const formatted = formatCalculatorResult(result);
    if (formatted === CALCULATOR_ERROR_TEXT) {
      setCalculatorError();
      triggerCalculatorPetAnimation("error");
      showCalculatorResultMessage(true, calculatorOperator === "divide" && current === 0);
      return;
    }
    calculatorStoredValue = Number(formatted);
    calculatorValue = formatted;
  } else {
    calculatorStoredValue = current;
  }
  calculatorOperator = operator;
  calculatorWaitingForValue = true;
  calculatorError = false;
  updateCalculatorDisplay();
}

function inputCalculatorEquals() {
  if (!calculatorOperator || calculatorStoredValue === null) return;
  const current = Number(calculatorValue);
  const result = calculateValues(calculatorStoredValue, current, calculatorOperator);
  const formatted = formatCalculatorResult(result);
  if (formatted === CALCULATOR_ERROR_TEXT) {
    setCalculatorError();
    triggerCalculatorPetAnimation("error");
    showCalculatorResultMessage(true, calculatorOperator === "divide" && current === 0);
    return;
  }
  calculatorValue = formatted;
  calculatorStoredValue = null;
  calculatorOperator = "";
  calculatorWaitingForValue = true;
  calculatorError = false;
  updateCalculatorDisplay();
  triggerCalculatorPetAnimation("success");
  showCalculatorResultMessage(false);
}

function handleCalculatorInput(button) {
  const action = button.dataset.calc;
  playCalculatorClick();
  if (action === "digit") inputCalculatorDigit(button.dataset.value);
  if (action === "decimal") inputCalculatorDecimal();
  if (action === "operator") inputCalculatorOperator(button.dataset.operator);
  if (action === "equals") inputCalculatorEquals();
  if (action === "clear") resetCalculator();
  if (action === "backspace") inputCalculatorBackspace();
  maybeShowCalculatorTypingMessage(action);
}

function playCalculatorClick() {
  if (alarmRinging) return;
  const context = ensureAudioContext();
  if (!context || context.state !== "running") return;
  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(880, now);
  oscillator.frequency.exponentialRampToValueAtTime(1320, now + 0.045);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.055, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.085);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.09);
}

function showCalculatorPetMessage(text, holdMs = 6500) {
  if (alarmRinging) return;
  if (Date.now() < quoteHoldUntil) return;
  quoteHoldUntil = Date.now() + holdMs;
  action = "wave";
  frameIndex = 0;
  window.clearTimeout(setAction.timer);
  hideChefMessage();
  hideAnimalMessage();
  message.textContent = text;
}

function maybeShowCalculatorTypingMessage(action) {
  if (alarmRinging || action === "equals") return;
  calculatorPressCount += 1;
  if (calculatorPressCount % 4 === 0) triggerCalculatorPetAnimation("tap");
  if (Date.now() < quoteHoldUntil) return;
  if (calculatorPressCount < 4 || calculatorPressCount % 5 !== 0 || Math.random() > 0.35) return;
  showCalculatorPetMessage(randomItem(calculatorTypingMessages), 5500);
}

function showCalculatorOpenMessage() {
  showCalculatorPetMessage(randomItem(calculatorOpenMessages), 6500);
}

function showCalculatorResultMessage(isError, isDivideByZero = false) {
  if (alarmRinging) return;
  quoteHoldUntil = 0;
  if (isError) {
    showCalculatorPetMessage(isDivideByZero ? "\u0030\u3067\u306f\u5272\u308c\u306a\u3044\u3088" : "\u3046\u307e\u304f\u8a08\u7b97\u3067\u304d\u306a\u304b\u3063\u305f\u307f\u305f\u3044", 8000);
    return;
  }
  const result = calculatorValue.length > 14 ? calculatorValue.slice(0, 14) : calculatorValue;
  const texts = [
    `\u7b54\u3048\u306f ${result} \u3060\u3088`,
    `\u8a08\u7b97\u3067\u304d\u305f\u3088\u3002\u7b54\u3048\u306f ${result}`,
    `\u3067\u304d\u305f\uff01\u7b54\u3048\u306f ${result}`,
  ];
  showCalculatorPetMessage(randomItem(texts), 8500);
}

function loadSpeechSettings() {
  try {
    speechEnabled = localStorage.getItem("pepaatennkoSpeechEnabled") === "true";
  } catch {
    speechEnabled = false;
  }
  if (!speechSupported) speechEnabled = false;
  updateSpeechToggleUi();
}

function saveSpeechSettings() {
  try {
    localStorage.setItem("pepaatennkoSpeechEnabled", String(speechEnabled));
  } catch {
    // localStorage may be unavailable in some private browsing modes.
  }
}

function updateSpeechToggleUi() {
  if (!speechToggleButton) return;
  speechToggleButton.disabled = !speechSupported;
  speechToggleButton.classList.toggle("active", speechEnabled);
  speechToggleButton.setAttribute("aria-pressed", String(speechEnabled));
  speechToggleButton.textContent = speechSupported
    ? speechEnabled
      ? "セリフ音声ON"
      : "セリフ音声OFF"
    : "音声非対応";
}

function refreshSpeechVoices() {
  if (!speechSupported) return;
  speechVoices = window.speechSynthesis.getVoices();
}

function ensureSpeechVoiceListener() {
  if (!speechSupported || speechVoiceListenerReady) return;
  if (typeof window.speechSynthesis.addEventListener === "function") {
    window.speechSynthesis.addEventListener("voiceschanged", refreshSpeechVoices);
  } else {
    window.speechSynthesis.onvoiceschanged = refreshSpeechVoices;
  }
  speechVoiceListenerReady = true;
}

function pickSpeechVoice(character) {
  const japaneseVoices = speechVoices.filter((voice) => /ja|japanese|日本/i.test(`${voice.lang} ${voice.name}`));
  const pool = japaneseVoices.length ? japaneseVoices : speechVoices;
  if (!pool.length) return null;
  if (character === "chef") {
    return (
      pool.find((voice) => /male|男性|otoya|ichiro/i.test(voice.name) && !/female|女性/i.test(voice.name)) ||
      pool.find((voice) => /ja|japanese|日本/i.test(`${voice.lang} ${voice.name}`)) ||
      pool[0]
    );
  }
  if (character === "animal") {
    return (
      pool.find((voice) => /female|女性|haruka|nanami|kyoko|sayaka|yuna/i.test(voice.name)) ||
      pool.find((voice) => /ja|japanese|日本/i.test(`${voice.lang} ${voice.name}`)) ||
      pool[0]
    );
  }
  return (
    pool.find((voice) => /female|女性|haruka|nanami|kyoko|sayaka|yuna/i.test(voice.name)) ||
    pool.find((voice) => /ja|japanese|日本/i.test(`${voice.lang} ${voice.name}`)) ||
    pool[0]
  );
}

function getSpeechProfile(character) {
  if (character === "chef") {
    return { pitch: 0.84, rate: 1.03, volume: 0.95 };
  }
  if (character === "animal") {
    return { pitch: 2, rate: 1.4, volume: 0.8 };
  }
  return { pitch: 1.85, rate: 1.22, volume: 1 };
}

const speechReplacementDictionary = [
  ["集中タイマー", "しゅうちゅうタイマー"],
  ["時刻アラーム", "じこくアラーム"],
  ["水分補給", "すいぶんほきゅう"],
  ["集中力", "しゅうちゅうりょく"],
  ["作業台", "さぎょうだい"],
  ["記念日", "きねんび"],
  ["焼き色", "やきいろ"],
  ["大丈夫", "だいじょうぶ"],
  ["一日", "いちにち"],
  ["今日", "きょう"],
  ["明日", "あした"],
  ["上手", "じょうず"],
  ["音声", "おんせい"],
  ["生地", "きじ"],
  ["発酵", "はっこう"],
  ["焼成", "しょうせい"],
  ["戻れる", "もどれる"],
  ["大事", "だいじ"],
  ["出る", "でる"],
  ["体", "からだ"],
];

function normalizeSpeechText(text) {
  return speechReplacementDictionary.reduce((result, [from, to]) => result.replaceAll(from, to), text);
}

function cleanSpeechText(text) {
  const cleaned = String(text || "")
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "")
    .replace(/[♪♫★☆◆◇■□●○]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return normalizeSpeechText(cleaned);
}

function shouldSpeakText(text) {
  if (!speechEnabled || !speechSupported || !text) return false;
  if (!alarmRinging) return true;
  return /アラーム|タップ|止め|時間|合図/.test(text);
}

function getSpeechTargets(character) {
  if (character === "chef") return { characterElement: chefFriend, bubbleElement: chefMessage };
  if (character === "animal") return { characterElement: animalFriend, bubbleElement: animalMessage };
  return { characterElement: canvas, bubbleElement: message };
}

function clearSpeakingState() {
  [canvas, chefFriend, animalFriend, message, chefMessage, animalMessage].forEach((element) => {
    element?.classList.remove("speaking");
  });
}

function setSpeakingState(character, active) {
  if (!active) {
    clearSpeakingState();
    return;
  }
  clearSpeakingState();
  const { characterElement, bubbleElement } = getSpeechTargets(character);
  characterElement?.classList.add("speaking");
  bubbleElement?.classList.add("speaking");
}

function playSpeechCue(character) {
  if (!speechEnabled || alarmRinging) return;
  const context = ensureAudioContext();
  if (!context || context.state !== "running") return;
  try {
    const now = context.currentTime;
    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(character === "animal" ? 0.045 : 0.055, now + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    gain.connect(context.destination);

    const notes =
      character === "chef"
        ? [
            [392, 0],
            [523.25, 0.08],
          ]
        : character === "animal"
          ? [
              [880, 0],
              [1174.66, 0.055],
            ]
          : [
              [659.25, 0],
              [987.77, 0.07],
            ];

    notes.forEach(([frequency, offset]) => {
      const oscillator = context.createOscillator();
      oscillator.type = character === "chef" ? "sine" : "triangle";
      oscillator.frequency.setValueAtTime(frequency, now + offset);
      oscillator.connect(gain);
      oscillator.start(now + offset);
      oscillator.stop(now + offset + 0.12);
    });
  } catch {
    // Speech cue is decorative; ignore browser audio restrictions.
  }
}

function queueSpeech(character, text) {
  const cleanText = cleanSpeechText(text);
  if (!shouldSpeakText(cleanText)) return;
  pendingSpeechItems.push({ character, text: cleanText });
  if (speechFlushQueued) return;
  speechFlushQueued = true;
  if (typeof window.queueMicrotask === "function") {
    window.queueMicrotask(flushSpeechQueue);
  } else {
    window.setTimeout(flushSpeechQueue, 0);
  }
}

function flushSpeechQueue() {
  speechFlushQueued = false;
  if (!speechEnabled || !speechSupported || !pendingSpeechItems.length) {
    pendingSpeechItems = [];
    return;
  }
  const order = { pet: 0, chef: 1, animal: 2 };
  const items = pendingSpeechItems
    .splice(0)
    .sort((a, b) => (order[a.character] ?? 9) - (order[b.character] ?? 9))
    .slice(0, 3);
  try {
    clearSpeakingState();
    window.speechSynthesis.cancel();
    items.forEach(({ character, text }) => {
      const utterance = new SpeechSynthesisUtterance(text);
      const profile = getSpeechProfile(character);
      const voice = pickSpeechVoice(character);
      if (voice) utterance.voice = voice;
      utterance.lang = voice?.lang || "ja-JP";
      utterance.pitch = profile.pitch;
      utterance.rate = profile.rate;
      utterance.volume = alarmRinging ? Math.min(profile.volume, 0.55) : profile.volume;
      utterance.onstart = () => {
        setSpeakingState(character, true);
        playSpeechCue(character);
      };
      utterance.onend = () => clearSpeakingState();
      utterance.onerror = () => clearSpeakingState();
      window.speechSynthesis.speak(utterance);
    });
  } catch {
    clearSpeakingState();
    // Some mobile browsers block synthesis until a user gesture; keep the app running.
  }
}

function stopSpeech() {
  pendingSpeechItems = [];
  clearSpeakingState();
  if (!speechSupported) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // Ignore browser-specific speech cancellation errors.
  }
}

function toggleSpeech() {
  if (!speechSupported) return;
  speechEnabled = !speechEnabled;
  saveSpeechSettings();
  updateSpeechToggleUi();
  if (!speechEnabled) {
    stopSpeech();
    return;
  }
  ensureSpeechVoiceListener();
  refreshSpeechVoices();
  if (!alarmRinging) {
    quoteHoldUntil = Date.now() + 6500;
    hideChefMessage();
    hideAnimalMessage();
    message.textContent = "声でもお手伝いするね";
  }
}

function setSpeechEnabled(enabled) {
  if (!speechSupported) return;
  speechEnabled = Boolean(enabled);
  saveSpeechSettings();
  updateSpeechToggleUi();
  if (!speechEnabled) stopSpeech();
}

function watchBubbleSpeech(element, character) {
  if (!element) return;
  const handleChange = () => {
    if (element.hidden) return;
    queueSpeech(character, element.textContent);
  };
  const observer = new MutationObserver(handleChange);
  observer.observe(element, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ["hidden"] });
}

function setupSpeechSynthesis() {
  if (!speechSupported) {
    updateSpeechToggleUi();
    return;
  }
  if (speechEnabled) {
    ensureSpeechVoiceListener();
    refreshSpeechVoices();
  }
  watchBubbleSpeech(message, "pet");
  watchBubbleSpeech(chefMessage, "chef");
  watchBubbleSpeech(animalMessage, "animal");
}

function setCalculatorMode(isOpen) {
  canvas.classList.toggle("calc-mode", isOpen && !alarmRinging);
  if (!isOpen) {
    canvas.classList.remove("calc-success", "calc-error", "calc-tap");
    window.clearTimeout(calculatorReactionTimer);
  }
}

function closeCalculatorPanel() {
  calculatorPanel.hidden = true;
  calculatorButton.setAttribute("aria-expanded", "false");
  controlPanel.classList.remove("calculator-open");
  setCalculatorMode(false);
}

function openCalculatorPanel({ announce = true } = {}) {
  calculatorPanel.hidden = false;
  calculatorButton.setAttribute("aria-expanded", "true");
  controlPanel.classList.add("calculator-open");
  setCalculatorMode(true);
  namePanel.hidden = true;
  themePanel.hidden = true;
  anniversaryPanel.hidden = true;
  bgmPanel.hidden = true;
  nameSettingsButton.setAttribute("aria-expanded", "false");
  themeSettingsButton.setAttribute("aria-expanded", "false");
  anniversarySettingsButton.setAttribute("aria-expanded", "false");
  bgmSettingsButton.setAttribute("aria-expanded", "false");
  if (announce) showCalculatorOpenMessage();
}

function triggerCalculatorPetAnimation(type) {
  if (alarmRinging) return;
  const className = type === "error" ? "calc-error" : type === "tap" ? "calc-tap" : "calc-success";
  canvas.classList.remove("calc-success", "calc-error", "calc-tap");
  void canvas.offsetWidth;
  canvas.classList.add(className);
  window.clearTimeout(calculatorReactionTimer);
  calculatorReactionTimer = window.setTimeout(() => {
    canvas.classList.remove(className);
  }, type === "tap" ? 460 : type === "error" ? 760 : 820);
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
  largeTimerDisplay.textContent = value;
  updateLargeTimerState();
  updateStageTimerDisplayMode();
}

function saveLargeTimerSetting() {
  try {
    localStorage.setItem("pepaatennkoLargeTimer", JSON.stringify({ enabled: largeTimerEnabled }));
  } catch {
    // localStorage may be unavailable in some private browsing modes.
  }
}

function saveLargeClockSetting() {
  try {
    localStorage.setItem("pepaatennkoLargeClock", JSON.stringify({ enabled: largeClockEnabled }));
  } catch {
    // localStorage may be unavailable in some private browsing modes.
  }
}

function updateLargeClockState() {
  largeClockDisplay.hidden = !largeClockEnabled;
  document.body.classList.toggle("large-clock-mode", largeClockEnabled);
  largeClockToggle.classList.toggle("active", largeClockEnabled);
  largeClockToggle.setAttribute("aria-pressed", String(largeClockEnabled));
  largeClockToggle.textContent = largeClockEnabled ? "大画面時計ON" : "大画面時計OFF";
  updateClockDisplayModeState();
}

function saveClockDisplayMode() {
  try {
    localStorage.setItem("pepaatennkoClockDisplayMode", clockDisplayMode);
  } catch {
    // localStorage may be unavailable in some private browsing modes.
  }
}

function updateClockDisplayModeState() {
  const analogVisible = clockDisplayMode === "analog" && !largeClockEnabled && !largeTimerEnabled;
  analogClock.hidden = !analogVisible;
  document.body.classList.toggle("analog-clock-mode", analogVisible);
  analogClockToggle.classList.toggle("active", clockDisplayMode === "analog");
  analogClockToggle.setAttribute("aria-pressed", String(clockDisplayMode === "analog"));
  analogClockToggle.textContent = clockDisplayMode === "analog" ? "デジタル時計に戻す" : "アナログ時計にする";
}

function updateLargeTimerState() {
  largeTimerDisplay.hidden = !largeTimerEnabled;
  largeTimerDisplay.classList.toggle("running", largeTimerEnabled && timerRunning);
  largeTimerDisplay.classList.toggle("paused", largeTimerEnabled && !timerRunning);
  document.body.classList.toggle("large-timer-mode", largeTimerEnabled);
  largeTimerToggle.classList.toggle("active", largeTimerEnabled);
  largeTimerToggle.setAttribute("aria-pressed", String(largeTimerEnabled));
  largeTimerToggle.textContent = largeTimerEnabled ? "大画面ON" : "大画面OFF";
  updateClockDisplayModeState();
  updateStageTimerDisplayMode();
}

function isFocusTimerUnused() {
  return !largeTimerEnabled && !timerRunning && timerEndAt === 0 && remainingSeconds === selectedMinutes * 60;
}

function updateStageTimerDisplayMode() {
  const showDate = isFocusTimerUnused();
  currentDateDisplay.hidden = !showDate;
  stageTimerDisplay.hidden = showDate;
  if (showDate) {
    stageTimerLabel.textContent = "DATE";
  } else if (stageTimerLabel.textContent === "DATE") {
    stageTimerLabel.textContent = "FOCUS";
  }
}

function loadLargeTimerSetting() {
  try {
    const saved = JSON.parse(localStorage.getItem("pepaatennkoLargeTimer") || "{}");
    largeTimerEnabled = Boolean(saved.enabled);
  } catch {
    largeTimerEnabled = false;
  }
  updateLargeTimerState();
}

function loadLargeClockSetting() {
  try {
    const saved = JSON.parse(localStorage.getItem("pepaatennkoLargeClock") || "{}");
    largeClockEnabled = Boolean(saved.enabled);
  } catch {
    largeClockEnabled = false;
  }
  updateLargeClockState();
}

function loadClockDisplayMode() {
  try {
    const saved = localStorage.getItem("pepaatennkoClockDisplayMode");
    clockDisplayMode = saved === "analog" ? "analog" : "digital";
  } catch {
    clockDisplayMode = "digital";
  }
  updateClockDisplayModeState();
}

function toggleLargeTimer() {
  largeTimerEnabled = !largeTimerEnabled;
  if (largeTimerEnabled && largeClockEnabled) {
    largeClockEnabled = false;
    saveLargeClockSetting();
    updateLargeClockState();
  }
  saveLargeTimerSetting();
  updateLargeTimerState();
  if (!alarmRinging && Date.now() >= quoteHoldUntil) {
    quoteHoldUntil = Date.now() + 6500;
    hideChefMessage();
    hideAnimalMessage();
    message.textContent = largeTimerEnabled ? "大きく表示するね" : namedPeriodText();
  }
}

function toggleClockDisplayMode() {
  clockDisplayMode = clockDisplayMode === "analog" ? "digital" : "analog";
  saveClockDisplayMode();
  updateClockDisplayModeState();
  updateClockDisplay();
  if (!alarmRinging && Date.now() >= quoteHoldUntil) {
    quoteHoldUntil = Date.now() + 6500;
    hideChefMessage();
    hideAnimalMessage();
    message.textContent = clockDisplayMode === "analog" ? "シェフの近くに時計を出すね" : "デジタル時計に戻すね";
  }
}

function toggleLargeClock() {
  largeClockEnabled = !largeClockEnabled;
  if (largeClockEnabled && largeTimerEnabled) {
    largeTimerEnabled = false;
    saveLargeTimerSetting();
    updateLargeTimerState();
  }
  saveLargeClockSetting();
  updateLargeClockState();
  updateClockDisplay();
  if (!alarmRinging && Date.now() >= quoteHoldUntil) {
    quoteHoldUntil = Date.now() + 6500;
    hideChefMessage();
    hideAnimalMessage();
    message.textContent = largeClockEnabled ? "時計を大きく表示するね" : namedPeriodText();
  }
}

function setLargeTimerMode(enabled) {
  largeTimerEnabled = Boolean(enabled);
  if (largeTimerEnabled && largeClockEnabled) {
    largeClockEnabled = false;
    saveLargeClockSetting();
    updateLargeClockState();
  }
  saveLargeTimerSetting();
  updateLargeTimerState();
}

function setLargeClockMode(enabled) {
  largeClockEnabled = Boolean(enabled);
  if (largeClockEnabled && largeTimerEnabled) {
    largeTimerEnabled = false;
    saveLargeTimerSetting();
    updateLargeTimerState();
  }
  saveLargeClockSetting();
  updateLargeClockState();
  updateClockDisplay();
}

function showVoiceCommandResponse(text, options = {}) {
  quoteHoldUntil = Date.now() + (options.holdMs || 7000);
  hideChefMessage();
  hideAnimalMessage();
  message.textContent = text;
}

function changeAppVolume(direction) {
  const levels = [0.04, 0.08, 0.13];
  const nearestIndex = levels.reduce((best, level, index) => {
    return Math.abs(level - bgmVolumeValue) < Math.abs(levels[best] - bgmVolumeValue) ? index : best;
  }, 0);
  const nextIndex = clamp(nearestIndex + direction, 0, levels.length - 1);
  bgmVolumeValue = levels[nextIndex];
  bgmVolume.value = String(bgmVolumeValue);
  if (bgmGain && audioContext) {
    bgmGain.gain.setTargetAtTime(alarmRinging ? bgmVolumeValue * 0.02 : bgmVolumeValue, audioContext.currentTime, 0.16);
  }
  saveBgmSettings();
  updateBgmUi();
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
    ...friendlyChefSoloLines.normal,
    ...(friendlyChefSoloLines[period] || []),
    ...(friendlyChefSoloLines[context] || []),
  ];
  if (timerRunning) pool.push(...friendlyChefSoloLines.focus);
  if (period === "night") pool.push(...friendlyChefSoloLines.night);
  if (selectedTheme === "season") pool.push(...friendlyChefSoloLines.season);
  if (userName) pool.push(...friendlyChefSoloLines.named.map((text) => `${userName}${text}`));
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
  ].filter((text) => !isAnimalLikePetLine(text));
}

function getAnimalFriendReplyPool() {
  const namedReplies = userName ? animalFriendLines.named.map((text) => `${userName}${text}`) : [];
  return [
    ...animalFriendLines.normal,
    ...(timerRunning ? animalFriendLines.focus : animalFriendLines.rest),
    ...namedReplies,
  ];
}

function isAnimalLikePetLine(text) {
  return ["となり", "ちょこん", "応援係", "なでられ", "こっそり", "背筋", "そばにいる", "褒めて", "見守り担当"].some((word) =>
    text.includes(word),
  );
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

function withName(text) {
  return userName ? `${userName}、${text}` : text;
}

function namedPeriodText(period = getTimePeriod()) {
  if (!userName) return timePeriods[period].text;
  const namedTexts = {
    morning: `${userName}、今日もゆっくり始めよう。`,
    afternoon: `${userName}、今日もいい感じに進めよう。`,
    evening: `${userName}、今日もおつかれさま。`,
    night: `${userName}、そろそろ無理しすぎないでね。`,
  };
  return namedTexts[period] || timePeriods[period].text;
}

function getStartupGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return withName("おはよう。今日もゆっくり始めよう。");
  if (hour >= 11 && hour < 17) return withName("こんにちは。今日もいい感じに進めよう。");
  if (hour >= 17 && hour < 21) return withName("こんばんは。今日もおつかれさま。");
  if (hour >= 21) return withName("こんばんは。そろそろ無理しすぎないでね。");
  return withName("遅くまでおつかれさま。少し休む準備もしようね。");
}

function showStartupGreeting() {
  clearMessageTimer();
  clearConversationTimer();
  message.textContent = getStartupGreeting();
  message.hidden = false;
  chefMessage.hidden = true;
  animalMessage.hidden = true;
  quoteHoldUntil = Date.now() + 10000;
  lastPeriod = getTimePeriod();
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

function cleanAnniversaryEntry(entry = {}) {
  const month = Number(entry.month);
  const day = Number(entry.day);
  const name = String(entry.name || "").trim().slice(0, 18);
  const memo = String(entry.memo || "").trim().slice(0, 32);
  if (!Number.isInteger(month) || month < 1 || month > 12) return null;
  const maxDay = new Date(2024, month, 0).getDate();
  if (!Number.isInteger(day) || day < 1 || day > maxDay) return null;
  return { month, day, name, memo };
}

function loadAnniversaries() {
  try {
    const saved = localStorage.getItem("petAnniversaries") || localStorage.getItem("pepaatennkoAnniversaries") || "{}";
    anniversaries = JSON.parse(saved) || {};
  } catch {
    anniversaries = {};
  }
  renderAnniversaryList();
  fillAnniversaryForm();
}

function saveAnniversaries() {
  try {
    localStorage.setItem("petAnniversaries", JSON.stringify(anniversaries));
    localStorage.setItem("pepaatennkoAnniversaries", JSON.stringify(anniversaries));
  } catch {
    // localStorage may be unavailable in some private browsing modes.
  }
}

function fillAnniversaryForm() {
  const entry = anniversaries[anniversaryType.value] || {};
  anniversaryMonth.value = entry.month || "";
  anniversaryDay.value = entry.day || "";
  anniversaryName.value = entry.name || "";
  anniversaryMemo.value = entry.memo || "";
}

function getAnniversaryTypeLabel(type) {
  if (type === "birthday") return "誕生日";
  return type === "anniversary1" ? "記念日1" : "記念日2";
}

function renderAnniversaryList() {
  if (!anniversaryList) return;
  const rows = Object.entries(anniversaries)
    .filter(([, entry]) => entry && entry.month && entry.day)
    .map(([type, entry]) => {
      const title = entry.name || getAnniversaryTypeLabel(type);
      const memo = entry.memo ? " / " + entry.memo : "";
      return '<button class="anniversary-list-item" type="button" data-type="' + type + '">' + getAnniversaryTypeLabel(type) + "：" + entry.month + "月" + entry.day + "日 " + title + memo + "</button>";
    });
  anniversaryList.innerHTML = rows.length ? rows.join("") : '<span class="anniversary-empty">まだ登録がありません</span>';
  anniversaryList.querySelectorAll(".anniversary-list-item").forEach((button) => {
    button.addEventListener("click", () => {
      anniversaryType.value = button.dataset.type;
      fillAnniversaryForm();
    });
  });
}

function getTodayAnniversaries(now = new Date()) {
  const month = now.getMonth() + 1;
  const day = now.getDate();
  return Object.entries(anniversaries)
    .map(([type, entry]) => ({ type, ...entry }))
    .filter((entry) => Number(entry.month) === month && Number(entry.day) === day);
}

function getAnniversaryLabel(entry) {
  return entry.name || entry.memo || getAnniversaryTypeLabel(entry.type);
}

function getAnniversaryMessage(entry) {
  const label = getAnniversaryLabel(entry);
  const pool = [
    "今日は" + label + "だね。おめでとう！",
    "今日は" + label + "だね。いい一日になりますように。",
    "記念日だね。いっしょにお祝いしよう。",
    "今日はちょっと特別な気分だね。",
    "大切な日を覚えているよ。",
    "今日はお祝いの日だね。ゆっくり楽しもう。",
    "おめでとう。すてきな一日になりますように。",
  ];
  return namePrefix() + randomItem(pool);
}

function readAnniversaryStatus() {
  try {
    return JSON.parse(localStorage.getItem("pepaatennkoAnniversaryStatus") || "{}") || {};
  } catch {
    return {};
  }
}

function writeAnniversaryStatus(status) {
  try {
    localStorage.setItem("pepaatennkoAnniversaryStatus", JSON.stringify(status));
  } catch {
    // localStorage may be unavailable in some private browsing modes.
  }
}

function maybeShowAnniversaryComment(force = false) {
  if (alarmRinging) return false;
  const todays = getTodayAnniversaries();
  if (!todays.length) return false;
  const today = getTodayKey();
  const status = readAnniversaryStatus();
  const count = status.date === today ? Number(status.count) || 0 : 0;
  if (!force && (count >= 4 || Date.now() < quoteHoldUntil || Math.random() > 0.18)) return false;
  const entry = todays[count % todays.length];
  quoteHoldUntil = Date.now() + 12000;
  hideChefMessage();
  hideAnimalMessage();
  message.textContent = getAnniversaryMessage(entry);
  writeAnniversaryStatus({ date: today, count: count + 1, lastAt: Date.now() });
  return true;
}

function saveAnniversaryEntry() {
  const entry = cleanAnniversaryEntry({
    month: anniversaryMonth.value,
    day: anniversaryDay.value,
    name: anniversaryName.value,
    memo: anniversaryMemo.value,
  });
  quoteHoldUntil = Date.now() + 9000;
  if (!entry) {
    message.textContent = namePrefix() + "月と日を正しく入れてね";
    return;
  }
  anniversaries[anniversaryType.value] = entry;
  saveAnniversaries();
  renderAnniversaryList();
  fillAnniversaryForm();
  if (getTodayAnniversaries().some((item) => item.type === anniversaryType.value)) {
    maybeShowAnniversaryComment(true);
  } else {
    message.textContent = namePrefix() + "記念日を保存したよ";
  }
}

function clearAnniversaryEntry() {
  delete anniversaries[anniversaryType.value];
  saveAnniversaries();
  renderAnniversaryList();
  fillAnniversaryForm();
  message.textContent = namePrefix() + "記念日を削除したよ";
  quoteHoldUntil = Date.now() + 8000;
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

function showAnimalMessage(text, duration = 8500) {
  if (!animalMessage) return;
  animalMessage.hidden = false;
  animalMessage.textContent = text;
  window.clearTimeout(animalBubbleTimer);
  animalBubbleTimer = window.setTimeout(() => {
    animalMessage.hidden = true;
    animalMessage.textContent = "";
  }, duration);
}

function hideAnimalMessage() {
  if (!animalMessage) return;
  window.clearTimeout(animalBubbleTimer);
  animalMessage.hidden = true;
  animalMessage.textContent = "";
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
  bgmGain.gain.setValueAtTime(alarmRinging ? bgmVolumeValue * 0.02 : bgmVolumeValue, context.currentTime);
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
  const target = ducked ? bgmVolumeValue * 0.02 : bgmVolumeValue;
  bgmGain.gain.cancelScheduledValues(audioContext.currentTime);
  bgmGain.gain.setTargetAtTime(target, audioContext.currentTime, ducked ? 0.12 : 0.35);
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
  setCalculatorMode(false);
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

const voiceThemeCommands = [
  {
    theme: "night",
    response: "夜空に変えるね",
    patterns: ["夜空", "夜の背景", "夜っぽく", "背景を夜空"],
  },
  {
    theme: "fresh",
    response: "さわやかな背景にするね",
    patterns: ["さわやか", "爽やか", "明るい背景", "背景をさわやか"],
  },
  {
    theme: "forest",
    response: "森の背景にするね",
    patterns: ["森にして", "森の背景", "背景を森", "自然っぽく"],
  },
  {
    theme: "cafe",
    response: "カフェの背景にするね",
    patterns: ["カフェ", "カフェの背景", "背景をカフェ", "お店っぽく"],
  },
  {
    theme: "season",
    response: "季節の背景にするね",
    patterns: ["季節にして", "季節の背景", "背景を季節", "季節感"],
  },
];

const voiceCommandDefinitions = [
  {
    name: "timerLargeOff",
    patterns: ["タイマーの大画面をやめ", "集中タイマーの大画面をやめ", "タイマー大画面をやめ"],
    action: () => {
      setLargeTimerMode(false);
      showVoiceCommandResponse("タイマーの大画面をやめるね");
    },
  },
  {
    name: "timerLargeOn",
    patterns: ["タイマーを大画面", "集中タイマーを大画面", "タイマーを大きく"],
    action: () => {
      setLargeTimerMode(true);
      showVoiceCommandResponse("集中タイマーを大きく表示するね");
    },
  },
  {
    name: "clockLargeOff",
    patterns: ["大画面をやめ", "時計の大画面をやめ", "時刻の大画面をやめ", "大きい時計をやめ"],
    action: () => {
      if (!largeClockEnabled && largeTimerEnabled) {
        setLargeTimerMode(false);
      } else {
        setLargeClockMode(false);
      }
      showVoiceCommandResponse("大画面をやめるね");
    },
  },
  {
    name: "clockLargeOn",
    patterns: ["大画面にして", "大きくして", "時計を大画面", "時刻を大画面", "時計を大きく"],
    action: () => {
      setLargeClockMode(true);
      showVoiceCommandResponse("時計を大きく表示するね");
    },
  },
  {
    name: "volumeUp",
    patterns: ["音量を上げ", "音量上げ", "音を大きく", "ボリューム上げ"],
    action: () => {
      changeAppVolume(1);
      showVoiceCommandResponse("音量を少し上げたよ");
    },
  },
  {
    name: "volumeDown",
    patterns: ["音量を小さく", "音を小さく", "音量下げ", "ボリューム下げ"],
    action: () => {
      changeAppVolume(-1);
      showVoiceCommandResponse("音量を少し小さくしたよ");
    },
  },
  {
    name: "focusStart",
    patterns: ["集中タイマーを始め", "タイマー始め", "集中始め", "タイマーをスタート"],
    action: () => {
      startFocusTimer();
      showVoiceCommandResponse("集中タイマーを始めるね");
    },
  },
  {
    name: "focusPause",
    patterns: ["タイマーを止め", "タイマー止め", "一時停止", "タイマーを一時停止"],
    action: () => {
      if (timerRunning) {
        pauseFocusTimer();
        showVoiceCommandResponse("タイマーを止めるね");
      } else {
        showVoiceCommandResponse("今はタイマーは動いていないよ");
      }
    },
  },
  {
    name: "calculatorOpen",
    patterns: ["電卓を開", "電卓開", "計算機を開"],
    action: () => {
      openCalculatorPanel({ announce: false });
      showVoiceCommandResponse("電卓を開くね");
    },
  },
  {
    name: "calculatorClose",
    patterns: ["電卓を閉じ", "電卓閉じ", "計算機を閉じ"],
    action: () => {
      closeCalculatorPanel();
      showVoiceCommandResponse("電卓を閉じるね");
    },
  },
  {
    name: "speechOff",
    patterns: ["音声オフ", "音声をオフ", "音声切って", "読み上げオフ", "声を切って"],
    action: () => {
      setSpeechEnabled(false);
      showVoiceCommandResponse("音声をオフにしたよ");
    },
  },
];

function normalizeVoiceCommandText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[ 　\t\r\n、。,.!?！？「」『』（）()]/g, "")
    .replace(/ヴ/g, "ブ")
    .trim();
}

function runVoiceCommand(rawText) {
  const commandText = normalizeVoiceCommandText(rawText);
  if (!commandText) {
    showVoiceCommandResponse("ごめんね、もう一回言ってね");
    return;
  }

  const themeCommand = voiceThemeCommands.find((item) => item.patterns.some((pattern) => commandText.includes(normalizeVoiceCommandText(pattern))));
  if (themeCommand) {
    saveTheme(themeCommand.theme);
    showVoiceCommandResponse(themeCommand.response);
    return;
  }

  const volumeCommand = voiceCommandDefinitions
    .filter((item) => item.name === "volumeUp" || item.name === "volumeDown")
    .find((item) => item.patterns.some((pattern) => commandText.includes(normalizeVoiceCommandText(pattern))));
  if (volumeCommand) {
    volumeCommand.action();
    return;
  }

  const command = voiceCommandDefinitions
    .filter((item) => item.name !== "volumeUp" && item.name !== "volumeDown")
    .find((item) => item.patterns.some((pattern) => commandText.includes(normalizeVoiceCommandText(pattern))));
  if (command) {
    command.action();
    return;
  }

  showVoiceCommandResponse("ごめんね、もう一回言ってね");
}

function updateVoiceCommandUi() {
  if (!voiceCommandButton) return;
  const supported = Boolean(SpeechRecognitionClass);
  voiceCommandButton.disabled = !supported;
  voiceCommandButton.classList.toggle("active", voiceCommandListening);
  voiceCommandButton.setAttribute("aria-pressed", String(voiceCommandListening));
  voiceCommandButton.textContent = supported ? (voiceCommandListening ? "聞いています…" : "音声操作") : "音声操作非対応";
}

function startVoiceCommandRecognition() {
  if (!SpeechRecognitionClass) {
    showVoiceCommandResponse("このブラウザでは音声操作が使えないみたい");
    updateVoiceCommandUi();
    return;
  }
  if (voiceCommandListening) {
    voiceRecognition?.abort?.();
    return;
  }

  try {
    const recognition = new SpeechRecognitionClass();
    voiceRecognition = recognition;
    recognition.lang = "ja-JP";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => {
      voiceCommandListening = true;
      updateVoiceCommandUi();
      showVoiceCommandResponse("聞いています…", { holdMs: 3000 });
    };
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      runVoiceCommand(transcript);
    };
    recognition.onerror = () => {
      showVoiceCommandResponse("ごめんね、もう一回言ってね");
    };
    recognition.onend = () => {
      voiceCommandListening = false;
      voiceRecognition = null;
      updateVoiceCommandUi();
    };
    recognition.start();
  } catch {
    voiceCommandListening = false;
    voiceRecognition = null;
    updateVoiceCommandUi();
    showVoiceCommandResponse("音声操作を始められなかったみたい");
  }
}

function updatePetStyleUi() {
  if (!petStyleToggleButton) return;
  const isNewStyle = selectedPetStyle === "new";
  petStyleToggleButton.classList.toggle("active", isNewStyle);
  petStyleToggleButton.setAttribute("aria-pressed", String(isNewStyle));
  petStyleToggleButton.textContent = isNewStyle ? "新スタイル" : "通常スタイル";
}

function savePetStyle() {
  try {
    localStorage.setItem("pepaatennkoPetStyle", selectedPetStyle);
  } catch {
    // localStorage may be unavailable in some private browsing modes.
  }
}

function applyPetStyle(style, { announce = false } = {}) {
  selectedPetStyle = petStyleSources[style] ? style : "classic";
  const source = petStyleSources[selectedPetStyle];
  if (!sheet.src.endsWith(source.replace("./", ""))) {
    sheet.src = source;
  }
  updatePetStyleUi();
  if (announce && !alarmRinging) {
    quoteHoldUntil = Date.now() + 7000;
    hideChefMessage();
    hideAnimalMessage();
    message.textContent = selectedPetStyle === "new" ? "新しい姿になったよ" : "いつもの姿に戻ったよ";
  }
}

function loadPetStyle() {
  try {
    selectedPetStyle = localStorage.getItem("pepaatennkoPetStyle") || "classic";
  } catch {
    selectedPetStyle = "classic";
  }
  applyPetStyle(selectedPetStyle);
}

function togglePetStyle() {
  applyPetStyle(selectedPetStyle === "new" ? "classic" : "new", { announce: true });
  savePetStyle();
}

function setPetStyleFromVoice(style) {
  const target = petStyleSources[style] ? style : "classic";
  if (selectedPetStyle === target) {
    showVoiceCommandResponse(target === "new" ? "もう新スタイルだよ" : "もう通常スタイルだよ");
    return;
  }
  applyPetStyle(target);
  savePetStyle();
  showVoiceCommandResponse(target === "new" ? "新しいスタイルにするね" : "いつものスタイルに戻すね");
}

function setFocusMinutesFromVoice(minutes) {
  setActiveChoice(minutes);
  customMinutes.value = "";
  setSelectedMinutes(minutes);
  showVoiceCommandResponse(`${minutes}分タイマーにしたよ`);
}

function setClockDisplayModeFromVoice(mode) {
  clockDisplayMode = mode === "analog" ? "analog" : "digital";
  if (clockDisplayMode === "analog" && largeClockEnabled) {
    setLargeClockMode(false);
  }
  saveClockDisplayMode();
  updateClockDisplayModeState();
  updateClockDisplay();
  showVoiceCommandResponse(clockDisplayMode === "analog" ? "アナログ時計にするね" : "デジタル時計にするね");
}

function setBgmFromVoice(enabled) {
  bgmEnabled = Boolean(enabled);
  if (bgmEnabled) {
    if (bgmModeValue === "off") bgmModeValue = "gentle";
    startBgm();
  } else {
    bgmModeValue = "off";
    stopBgm();
  }
  saveBgmSettings();
  updateBgmUi();
  showVoiceCommandResponse(bgmEnabled ? "BGMを流すね" : "BGMを止めるね");
}

function setVoiceSpeechFromVoice(enabled) {
  setSpeechEnabled(enabled);
  showVoiceCommandResponse(enabled ? "セリフ音声をオンにするね" : "音声をオフにしたよ");
}

function saveVoiceCommandSetting() {
  try {
    localStorage.setItem("pepaatennkoVoiceCommandEnabled", String(voiceCommandEnabled));
  } catch {
    // localStorage may be unavailable in some private browsing modes.
  }
}

function loadVoiceCommandSetting() {
  // For privacy, never auto-start the microphone on page load.
  voiceCommandEnabled = false;
  updateVoiceCommandUi();
}

function stopVoiceRecognition() {
  window.clearTimeout(voiceCommandRestartTimer);
  voiceCommandRestartTimer = 0;
  voiceCommandEnabled = false;
  voiceCommandListening = false;
  if (voiceRecognition) {
    const recognition = voiceRecognition;
    voiceRecognition = null;
    try {
      recognition.onend = null;
      recognition.onerror = null;
      recognition.abort?.();
      recognition.stop?.();
    } catch {
      // Browser implementations vary; stopping is best effort.
    }
  }
  saveVoiceCommandSetting();
  updateVoiceCommandUi();
}

const continuousVoiceThemeCommands = [
  { name: "themeNight", theme: "night", response: "夜空に変えるね", patterns: ["夜空にして", "背景を夜空にして", "夜の背景にして", "夜っぽくして", "夜空", "よぞら", "夜", "夜の背景"] },
  { name: "themeFresh", theme: "fresh", response: "さわやかな背景にするね", patterns: ["さわやかにして", "爽やかにして", "背景をさわやかにして", "明るい背景にして", "さわやか", "爽やか", "明るい", "すっきり", "青空", "やさしい", "優しい"] },
  { name: "themeForest", theme: "forest", response: "森の背景にするね", patterns: ["森にして", "背景を森にして", "森の背景にして", "自然っぽくして", "森", "もり", "自然", "緑", "みどり"] },
  { name: "themeCafe", theme: "cafe", response: "カフェの背景にするね", patterns: ["カフェにして", "背景をカフェにして", "カフェの背景にして", "お店っぽくして", "カフェ", "お店", "店", "喫茶店"] },
  { name: "themeSeason", theme: "season", response: "季節の背景にするね", patterns: ["季節にして", "背景を季節にして", "季節の背景にして", "季節感のある背景にして", "季節", "きせつ", "季節感"] },
];

const continuousVoiceCommands = [
  { name: "voiceCommandOff", patterns: ["音声操作オフ", "音声操作をオフ", "マイクオフ", "マイクをオフ", "聞き取りをやめて"], action: () => { showVoiceCommandResponse("音声操作をオフにするね"); stopVoiceRecognition(); } },
  { name: "voiceCommandOn", patterns: ["音声操作オン", "音声操作をオン", "マイクオン", "マイクをオン"], action: () => showVoiceCommandResponse("音声操作はもうオンだよ") },
  { name: "newPetStyle", patterns: ["新スタイルにして", "新しいスタイルにして", "新しいPepaatennkoにして", "新しいペパーてんこにして", "新しい姿にして", "スタイルを新しくして"], action: () => setPetStyleFromVoice("new") },
  { name: "classicPetStyle", patterns: ["通常スタイルにして", "いつものスタイルにして", "普通のスタイルにして", "いつものPepaatennkoにして", "いつものペパーてんこにして", "通常版に戻して"], action: () => setPetStyleFromVoice("classic") },
  { name: "timer5", patterns: ["5分タイマーにして", "5分にして", "タイマー5分", "集中タイマー5分", "5分集中", "五分タイマーにして", "ごふんタイマーにして", "ごぶんタイマーにして"], action: () => setFocusMinutesFromVoice(5) },
  { name: "timer10", patterns: ["10分タイマーにして", "10分にして", "タイマー10分", "集中タイマー10分", "10分集中", "十分タイマーにして", "じゅっぷんタイマーにして"], action: () => setFocusMinutesFromVoice(10) },
  { name: "timer15", patterns: ["15分タイマーにして", "15分にして", "タイマー15分", "集中タイマー15分", "15分集中", "十五分タイマーにして", "じゅうごふんタイマーにして"], action: () => setFocusMinutesFromVoice(15) },
  { name: "timer25", patterns: ["25分タイマーにして", "25分にして", "タイマー25分", "集中タイマー25分", "25分集中", "二十五分タイマーにして", "にじゅうごふんタイマーにして"], action: () => setFocusMinutesFromVoice(25) },
  { name: "timer45", patterns: ["45分タイマーにして", "45分にして", "タイマー45分", "集中タイマー45分", "45分集中", "四十五分タイマーにして", "よんじゅうごふんタイマーにして"], action: () => setFocusMinutesFromVoice(45) },
  { name: "analogClock", patterns: ["アナログ時計にして", "アナログにして", "時計をアナログにして", "丸い時計にして"], action: () => setClockDisplayModeFromVoice("analog") },
  { name: "digitalClock", patterns: ["デジタル時計にして", "デジタルにして", "時計をデジタルにして", "数字の時計にして"], action: () => setClockDisplayModeFromVoice("digital") },
  { name: "bgmOn", patterns: ["BGMを流して", "BGMつけて", "音楽を流して", "音楽つけて", "BGMオン", "音楽オン"], action: () => setBgmFromVoice(true) },
  { name: "bgmOff", patterns: ["BGMを止めて", "BGM消して", "音楽を止めて", "音楽消して", "BGMオフ", "音楽オフ"], action: () => setBgmFromVoice(false) },
  { name: "themeReset", patterns: ["背景を戻して", "背景を元に戻して", "元の背景にして", "デフォルト背景にして", "背景リセット"], action: () => { saveTheme("fresh"); showVoiceCommandResponse("背景を戻すね"); } },
  { name: "alarmStop", patterns: ["アラームを止めて", "アラーム止めて", "アラーム消して", "鳴ってる音を止めて", "目覚まし止めて"], action: () => { if (alarmRinging) { stopAlarm(); showVoiceCommandResponse("アラームを止めるね"); } else { showVoiceCommandResponse("今はアラームは鳴っていないよ"); } } },
  { name: "speechOn", patterns: ["音声オン", "声を出して", "読み上げオン", "セリフを読んで", "声ありにして"], action: () => setVoiceSpeechFromVoice(true) },
  { name: "speechOff", patterns: ["音声オフ", "音声をオフ", "音声切って", "読み上げオフ", "声を切って"], action: () => setVoiceSpeechFromVoice(false) },
  { name: "timerLargeOff", patterns: ["タイマーの大画面をやめて", "集中タイマーの大画面をやめて", "タイマー大画面をやめて"], action: () => { setLargeTimerMode(false); showVoiceCommandResponse("タイマーの大画面をやめるね"); } },
  { name: "timerLargeOn", patterns: ["タイマーを大画面にして", "集中タイマーを大画面にして", "タイマーを大きくして"], action: () => { setLargeTimerMode(true); showVoiceCommandResponse("集中タイマーを大きく表示するね"); } },
  { name: "clockLargeOff", patterns: ["大画面をやめて", "時計の大画面をやめて", "時刻の大画面をやめて"], action: () => { if (!largeClockEnabled && largeTimerEnabled) setLargeTimerMode(false); else setLargeClockMode(false); showVoiceCommandResponse("大画面をやめるね"); } },
  { name: "clockLargeOn", patterns: ["大画面にして", "大きくして", "時計を大画面にして", "時刻を大画面にして", "時計を大きくして"], action: () => { setLargeClockMode(true); showVoiceCommandResponse("時計を大きく表示するね"); } },
  { name: "volumeUp", patterns: ["音量を上げて", "音量上げて", "音を大きくして", "ボリューム上げて"], action: () => { changeAppVolume(1); showVoiceCommandResponse("音量を少し上げたよ"); } },
  { name: "volumeDown", patterns: ["音量を小さくして", "音を小さくして", "音量下げて", "ボリューム下げて"], action: () => { changeAppVolume(-1); showVoiceCommandResponse("音量を少し小さくしたよ"); } },
  { name: "focusStart", patterns: ["集中タイマーを始めて", "タイマー始めて", "集中始めて", "タイマーをスタート"], action: () => { startFocusTimer(); showVoiceCommandResponse("集中タイマーを始めるね"); } },
  { name: "focusPause", patterns: ["タイマーを止めて", "タイマー止めて", "一時停止", "タイマーを一時停止"], action: () => { if (timerRunning) { pauseFocusTimer(); showVoiceCommandResponse("タイマーを止めるね"); } else { showVoiceCommandResponse("今はタイマーは動いていないよ"); } } },
  { name: "calculatorOpen", patterns: ["電卓を開いて", "電卓開いて", "計算機を開いて"], action: () => { openCalculatorPanel({ announce: false }); showVoiceCommandResponse("電卓を開くね"); } },
  { name: "calculatorClose", patterns: ["電卓を閉じて", "電卓閉じて", "計算機を閉じて"], action: () => { closeCalculatorPanel(); showVoiceCommandResponse("電卓を閉じるね"); } },
];

function normalizeContinuousVoiceCommandText(text) {
  const katakanaToHiragana = (value) => value.replace(/[\u30a1-\u30f6]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0x60));
  return katakanaToHiragana(String(text || ""))
    .toLowerCase()
    .replace(/[ 　\t\r\n、。,.!?！？「」『』（）()]/g, "")
    .replace(/４５|四十五/g, "45")
    .replace(/２５|二十五/g, "25")
    .replace(/１５|十五/g, "15")
    .replace(/１０|十分|十/g, "10")
    .replace(/５|五/g, "5")
    .trim();
}

function voiceIncludes(commandText, patterns) {
  return patterns.some((pattern) => commandText.includes(normalizeContinuousVoiceCommandText(pattern)));
}

function isFocusTimerPaused() {
  return !timerRunning && timerEndAt > 0 && remainingSeconds > 0 && remainingSeconds < selectedMinutes * 60;
}

function startFocusTimerFromVoice() {
  if (timerRunning) {
    showVoiceCommandResponse("もう動いているよ");
    return;
  }
  const wasPaused = isFocusTimerPaused();
  startFocusTimer();
  showVoiceCommandResponse(wasPaused ? "続きから始めるね" : "タイマーを始めるね");
}

function pauseFocusTimerFromVoice() {
  if (alarmRinging) {
    stopAlarm();
    showVoiceCommandResponse("アラームを止めるね");
    return;
  }
  if (timerRunning) {
    pauseFocusTimer();
    showVoiceCommandResponse("タイマーを止めるね");
    return;
  }
  if (bgmEnabled) {
    setBgmFromVoice(false);
    return;
  }
  showVoiceCommandResponse("今は止めるものがないよ");
}

function resetFocusTimerFromVoice() {
  resetFocusTimer();
  showVoiceCommandResponse("タイマーをリセットしたよ");
}

function clearCalculatorFromVoice() {
  if (calculatorPanel.hidden) {
    showVoiceCommandResponse("電卓はまだ開いていないよ");
    return;
  }
  resetCalculator();
  showVoiceCommandResponse("電卓をクリアしたよ");
}

function setFocusMinutesMaybeStart(minutes, commandText) {
  setFocusMinutesFromVoice(minutes);
  if (voiceIncludes(commandText, ["スタート", "始めて", "はじめて", "開始", "再開"])) {
    startFocusTimerFromVoice();
  }
}

function handleShortVoiceCommand(commandText) {
  if (voiceIncludes(commandText, ["リセット", "タイマーリセット", "集中タイマーリセット", "最初に戻して", "はじめに戻して", "タイマーを戻して", "時間を戻して", "もう一度最初から", "最初から"])) {
    resetFocusTimerFromVoice();
    return true;
  }

  const timerMinuteCommands = [
    [45, ["45分", "45分タイマー", "45分集中", "よんじゅうごふん", "四十五分"]],
    [25, ["25分", "25分タイマー", "25分集中", "にじゅうごふん", "二十五分"]],
    [15, ["15分", "15分タイマー", "15分集中", "じゅうごふん", "十五分"]],
    [10, ["10分", "10分タイマー", "10分集中", "じゅっぷん", "十分"]],
    [5, ["5分", "5分タイマー", "5分集中", "ごふん", "ごぶん", "五分"]],
  ];
  const minuteCommand = timerMinuteCommands.find(([, patterns]) => voiceIncludes(commandText, patterns));
  if (minuteCommand) {
    setFocusMinutesMaybeStart(minuteCommand[0], commandText);
    return true;
  }

  if (alarmRinging && voiceIncludes(commandText, ["止めて", "とめて", "ストップ", "停止", "アラーム止めて", "アラームを止めて", "うるさい", "目覚まし止めて"])) {
    stopAlarm();
    showVoiceCommandResponse("アラームを止めるね");
    return true;
  }

  if (voiceIncludes(commandText, ["スタート", "タイマースタート", "始めて", "はじめて", "開始", "再開", "もう一回", "もう一度", "動かして", "続けて"])) {
    startFocusTimerFromVoice();
    return true;
  }

  if (voiceIncludes(commandText, ["止めて", "とめて", "ストップ", "停止", "一時停止", "休憩", "待って", "いったん止めて"])) {
    pauseFocusTimerFromVoice();
    return true;
  }

  if (!calculatorPanel.hidden && voiceIncludes(commandText, ["閉じて", "とじて", "閉じる", "しまって"])) {
    closeCalculatorPanel();
    showVoiceCommandResponse("電卓を閉じるね");
    return true;
  }

  if (!calculatorPanel.hidden && voiceIncludes(commandText, ["クリア", "ac", "消して", "計算消して"])) {
    clearCalculatorFromVoice();
    return true;
  }

  if (voiceIncludes(commandText, ["電卓", "計算", "計算する", "計算したい", "開いて"])) {
    if (calculatorPanel.hidden) {
      openCalculatorPanel({ announce: false });
      showVoiceCommandResponse("電卓を開くね");
    } else {
      showVoiceCommandResponse("もう電卓は開いているよ");
    }
    return true;
  }

  if (voiceIncludes(commandText, ["背景戻して", "背景を戻して", "元に戻して", "デフォルト", "背景リセット"])) {
    saveTheme("fresh");
    showVoiceCommandResponse("背景を戻すね");
    return true;
  }

  const shortThemeCommand = continuousVoiceThemeCommands.find((item) => voiceIncludes(commandText, item.patterns));
  if (shortThemeCommand) {
    saveTheme(shortThemeCommand.theme);
    showVoiceCommandResponse(shortThemeCommand.response);
    return true;
  }

  if (bgmEnabled && voiceIncludes(commandText, ["上げて", "あげて", "大きくして", "もっと大きく", "聞こえない"])) {
    changeAppVolume(1);
    showVoiceCommandResponse("音量を少し上げたよ");
    return true;
  }
  if (voiceIncludes(commandText, ["音量上げて", "音量を上げて"])) {
    changeAppVolume(1);
    showVoiceCommandResponse("音量を少し上げたよ");
    return true;
  }
  if (bgmEnabled && voiceIncludes(commandText, ["下げて", "さげて", "小さくして", "うるさい", "静かにして"])) {
    changeAppVolume(-1);
    showVoiceCommandResponse("音量を少し小さくしたよ");
    return true;
  }
  if (voiceIncludes(commandText, ["音量下げて", "音量を下げて"])) {
    changeAppVolume(-1);
    showVoiceCommandResponse("音量を少し小さくしたよ");
    return true;
  }

  if (voiceIncludes(commandText, ["bgm止めて", "bgm消して", "bgmオフ", "音楽止めて", "音楽消して", "音楽オフ"])) {
    setBgmFromVoice(false);
    return true;
  }

  if (voiceIncludes(commandText, ["bgm", "音楽", "流して", "かけて"])) {
    setBgmFromVoice(true);
    return true;
  }

  if (voiceIncludes(commandText, ["小さく", "大画面やめて", "普通に戻して", "戻して"])) {
    if (largeClockEnabled) {
      setLargeClockMode(false);
      showVoiceCommandResponse("大画面をやめるね");
      return true;
    }
    if (largeTimerEnabled) {
      setLargeTimerMode(false);
      showVoiceCommandResponse("タイマーの大画面をやめるね");
      return true;
    }
    if (selectedPetStyle === "new" && voiceIncludes(commandText, ["戻して", "いつもの", "通常版", "元のペパーてんこ"])) {
      setPetStyleFromVoice("classic");
      return true;
    }
  }

  if (voiceIncludes(commandText, ["タイマー大画面", "タイマー大きく", "カウント大きく"])) {
    setLargeTimerMode(true);
    showVoiceCommandResponse("集中タイマーを大きく表示するね");
    return true;
  }
  if (voiceIncludes(commandText, ["タイマー小さく", "タイマー大画面やめて"])) {
    setLargeTimerMode(false);
    showVoiceCommandResponse("タイマーの大画面をやめるね");
    return true;
  }
  if (voiceIncludes(commandText, ["大画面", "大きく", "時計大きく", "時計を大きく", "時刻大画面"])) {
    setLargeClockMode(true);
    showVoiceCommandResponse("時計を大きく表示するね");
    return true;
  }

  if (voiceIncludes(commandText, ["アナログ", "丸い時計", "アナログ時計"])) {
    setClockDisplayModeFromVoice("analog");
    return true;
  }
  if (voiceIncludes(commandText, ["デジタル", "数字の時計", "デジタル時計"])) {
    setClockDisplayModeFromVoice("digital");
    return true;
  }
  if (voiceIncludes(commandText, ["新スタイル", "新しいスタイル", "新しい姿", "新しいペパーてんこ"])) {
    setPetStyleFromVoice("new");
    return true;
  }
  if (voiceIncludes(commandText, ["通常スタイル", "いつもの", "いつもの姿", "通常版", "元のペパーてんこ"])) {
    setPetStyleFromVoice("classic");
    return true;
  }

  return false;
}

function executeContinuousVoiceCommand(name, action) {
  const now = Date.now();
  if (lastVoiceCommandName === name && now - lastVoiceCommandAt < 1600) return;
  lastVoiceCommandName = name;
  lastVoiceCommandAt = now;
  action();
}

function runVoiceCommand(rawText) {
  const commandText = normalizeContinuousVoiceCommandText(rawText);
  if (commandText.length < 2) return;

  if (handleShortVoiceCommand(commandText)) return;

  const themeCommand = continuousVoiceThemeCommands.find((item) =>
    voiceIncludes(commandText, item.patterns),
  );
  if (themeCommand) {
    executeContinuousVoiceCommand(themeCommand.name, () => {
      saveTheme(themeCommand.theme);
      showVoiceCommandResponse(themeCommand.response);
    });
    return;
  }

  const priorityNames = ["voiceCommandOff", "voiceCommandOn", "volumeUp", "volumeDown", "timerLargeOff", "timerLargeOn"];
  const orderedCommands = [
    ...continuousVoiceCommands.filter((item) => priorityNames.includes(item.name)),
    ...continuousVoiceCommands.filter((item) => !priorityNames.includes(item.name)),
  ];
  const command = orderedCommands.find((item) =>
    voiceIncludes(commandText, item.patterns),
  );

  if (command) {
    executeContinuousVoiceCommand(command.name, command.action);
    return;
  }

  if (Date.now() - lastVoiceCommandAt > 4500) {
    showVoiceCommandResponse("ごめんね、もう一回言ってね", { holdMs: 3500 });
  }
}

function updateVoiceCommandUi() {
  if (!voiceCommandButton) return;
  const supported = Boolean(SpeechRecognitionClass);
  voiceCommandButton.disabled = !supported;
  voiceCommandButton.classList.toggle("active", voiceCommandEnabled);
  voiceCommandButton.setAttribute("aria-pressed", String(voiceCommandEnabled));
  if (!supported) {
    voiceCommandButton.textContent = "音声操作非対応";
  } else if (voiceCommandEnabled) {
    voiceCommandButton.textContent = voiceCommandListening ? "音声操作ON" : "音声操作ON";
  } else {
    voiceCommandButton.textContent = "音声操作OFF";
  }
}

function scheduleVoiceRecognitionRestart(delay = 750) {
  window.clearTimeout(voiceCommandRestartTimer);
  if (!voiceCommandEnabled || !SpeechRecognitionClass) return;
  voiceCommandRestartTimer = window.setTimeout(() => {
    if (voiceCommandEnabled && !voiceCommandListening) startVoiceRecognitionSession();
  }, delay);
}

function startVoiceRecognitionSession() {
  if (!voiceCommandEnabled || !SpeechRecognitionClass || voiceCommandListening) return;
  try {
    const recognition = new SpeechRecognitionClass();
    voiceRecognition = recognition;
    recognition.lang = "ja-JP";
    recognition.interimResults = false;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => {
      voiceCommandListening = true;
      updateVoiceCommandUi();
    };
    recognition.onresult = (event) => {
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        if (!event.results[index].isFinal) continue;
        runVoiceCommand(event.results[index][0]?.transcript || "");
      }
    };
    recognition.onerror = (event) => {
      voiceCommandListening = false;
      updateVoiceCommandUi();
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        stopVoiceRecognition();
        showVoiceCommandResponse("マイクの許可が必要みたい");
        return;
      }
      scheduleVoiceRecognitionRestart(event.error === "no-speech" ? 900 : 1500);
    };
    recognition.onend = () => {
      voiceCommandListening = false;
      voiceRecognition = null;
      updateVoiceCommandUi();
      scheduleVoiceRecognitionRestart();
    };
    recognition.start();
  } catch {
    voiceCommandListening = false;
    voiceRecognition = null;
    updateVoiceCommandUi();
    scheduleVoiceRecognitionRestart(1500);
  }
}

function startVoiceCommandRecognition() {
  if (!SpeechRecognitionClass) {
    showVoiceCommandResponse("このブラウザでは音声操作が使えないみたい");
    updateVoiceCommandUi();
    return;
  }
  if (voiceCommandEnabled) {
    showVoiceCommandResponse("音声操作をオフにするね");
    stopVoiceRecognition();
    return;
  }
  voiceCommandEnabled = true;
  saveVoiceCommandSetting();
  updateVoiceCommandUi();
  showVoiceCommandResponse("音声操作ON。聞き取り中だよ", { holdMs: 4500 });
  startVoiceRecognitionSession();
}

function getTodayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function formatDailyQuote(quote) {
  if (userName) return quote.replaceAll("{name}", userName);
  return dailyQuoteFallbacks[quote] || quote.replaceAll("{name}", "");
}

function pickDailyQuote() {
  const today = getTodayKey();
  try {
    const saved = JSON.parse(localStorage.getItem("pepaatennkoDailyQuote") || "{}");
    if (saved.date === today && saved.version === DAILY_QUOTE_VERSION && dailyQuotes.includes(saved.quote)) {
      return saved.quote;
    }
    const index = Math.abs([...today].reduce((total, char) => total + char.charCodeAt(0), 0)) % dailyQuotes.length;
    const quote = dailyQuotes[index];
    localStorage.setItem("pepaatennkoDailyQuote", JSON.stringify({ date: today, version: DAILY_QUOTE_VERSION, quote }));
    return quote;
  } catch {
    return dailyQuotes[new Date().getDate() % dailyQuotes.length];
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
  message.textContent = `今日のひとこと：${formatDailyQuote(quote)}`;
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
      [`${userName}、いい感じだよ`, `${userName}、その調子です`],
      [`${userName}、休憩も忘れないでね`, `${userName}、休む時間も大切です`],
      [`${userName}、焦らなくていいよ`, `${userName}、丁寧にいきましょう`],
      [`${userName}、ちゃんと進んでるよ`, `${userName}、積み重なっています`],
      [`${userName}、ここで深呼吸しよう`, `${userName}、落ち着いて続けましょう`],
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
  if (!timerRunning && maybeShowAnniversaryComment(false)) {
    scheduleNextConversation(45000 + Math.random() * 30000);
    return;
  }

  const roll = Math.random();
  if (roll < (timerRunning ? 0.35 : 0.3)) {
    if (Math.random() < (timerRunning ? 0.12 : 0.18)) {
      showAnimalMessage(pickFresh(getAnimalFriendReplyPool(), recentAnimalLines, 10), 8500);
    } else {
      quoteHoldUntil = now + 10000;
      hideAnimalMessage();
      message.textContent = pickFresh(getAutoPetLinePool(), recentPetLines, 12);
      if (Math.random() < 0.35) showChefSolo(timerRunning ? "focus" : "idle", 10000);
    }
  } else if (roll < (timerRunning ? 0.65 : 0.55)) {
    hideAnimalMessage();
    showChefSolo(timerRunning ? "focus" : "idle", 10000);
  } else {
    const [petText, chefText] = getConversationPair();
    quoteHoldUntil = now + 10000;
    hideAnimalMessage();
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

function updateClockDisplay(now = new Date()) {
  const value = formatTime(now);
  clock.textContent = value;
  clock.dateTime = now.toTimeString().slice(0, 8);
  currentDateDisplay.textContent = formatDateLabel(now);
  currentDateDisplay.dateTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  largeClockDisplay.textContent = formatLargeClockTime(now);
  largeClockDisplay.dateTime = clock.dateTime;
  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours() % 12;
  analogClock.style.setProperty("--second-angle", `${seconds * 6}deg`);
  analogClock.style.setProperty("--minute-angle", `${(minutes + seconds / 60) * 6}deg`);
  analogClock.style.setProperty("--hour-angle", `${(hours + minutes / 60) * 30}deg`);
}

function updateClock() {
  const now = new Date();
  const period = getTimePeriod(now);
  updateClockDisplay(now);
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

function safeUpdateClock() {
  try {
    updateClock();
  } catch {
    updateClockDisplay();
  }
}

function startClockUpdates() {
  window.clearInterval(clockIntervalId);
  safeUpdateClock();
  clockIntervalId = window.setInterval(safeUpdateClock, 1000);
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
  ].filter((text) => !isAnimalLikePetLine(text));
  const animalTalk = Math.random() < (timerRunning ? 0.12 : 0.18);
  setAction(next, pickFresh(replyPool, recentPetLines, 12));
  if (animalTalk && !alarmRinging) {
    showAnimalMessage(pickFresh(getAnimalFriendReplyPool(), recentAnimalLines, 10), 8500);
  } else {
    hideAnimalMessage();
  }
  mood = clamp(mood + (next === "sad" ? -4 : 3), 0, 99);
  energy = clamp(energy + (next === "run" ? -6 : 1), 0, 99);
  updateMoodDisplay();
  energyValue.textContent = energy;
}

function setAction(next, text = actions[next].text) {
  action = next;
  frameIndex = 0;
  hideChefMessage();
  hideAnimalMessage();
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
  timerEndAt = 0;
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
  celebrationUntil = Date.now() + 30000;
  setCalculatorMode(false);
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

function playTone(startTime, frequency, duration, level = 0.36) {
  if (!audioContext || !alarmEnabled) return;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, startTime);
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(Math.min(level, 0.58), startTime + 0.025);
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
  playTone(now, 784, 0.18, 0.48);
  playTone(now + 0.2, 988, 0.18, 0.5);
  playTone(now + 0.4, 1175, 0.24, 0.54);
  playTone(now + 0.68, 988, 0.18, 0.48);
}

function playTimerCompletePattern() {
  if (!alarmEnabled) return;
  prepareAlarm();
  if (!audioContext || audioContext.state !== "running") return;
  const now = audioContext.currentTime;
  playTone(now, 660, 0.45, 0.4);
  playTone(now + 0.42, 880, 0.58, 0.44);
  playTone(now + 0.96, 990, 0.42, 0.34);
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
    if (!calculatorPanel.hidden) setCalculatorMode(true);
  }
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
largeTimerToggle.addEventListener("click", toggleLargeTimer);
largeClockToggle.addEventListener("click", toggleLargeClock);
analogClockToggle.addEventListener("click", toggleClockDisplayMode);
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
    anniversaryPanel.hidden = true;
    calculatorPanel.hidden = true;
    controlPanel.classList.remove("calculator-open");
    setCalculatorMode(false);
    themeSettingsButton.setAttribute("aria-expanded", "false");
    bgmSettingsButton.setAttribute("aria-expanded", "false");
    anniversarySettingsButton.setAttribute("aria-expanded", "false");
    calculatorButton.setAttribute("aria-expanded", "false");
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
    anniversaryPanel.hidden = true;
    calculatorPanel.hidden = true;
    controlPanel.classList.remove("calculator-open");
    setCalculatorMode(false);
    nameSettingsButton.setAttribute("aria-expanded", "false");
    bgmSettingsButton.setAttribute("aria-expanded", "false");
    anniversarySettingsButton.setAttribute("aria-expanded", "false");
    calculatorButton.setAttribute("aria-expanded", "false");
  }
});
themeChoices.forEach((button) => {
  button.addEventListener("click", () => saveTheme(button.dataset.theme));
});
anniversarySettingsButton.addEventListener("click", () => {
  const willOpen = anniversaryPanel.hidden;
  anniversaryPanel.hidden = !willOpen;
  anniversarySettingsButton.setAttribute("aria-expanded", String(willOpen));
  if (willOpen) {
    namePanel.hidden = true;
    themePanel.hidden = true;
    bgmPanel.hidden = true;
    calculatorPanel.hidden = true;
    controlPanel.classList.remove("calculator-open");
    setCalculatorMode(false);
    nameSettingsButton.setAttribute("aria-expanded", "false");
    themeSettingsButton.setAttribute("aria-expanded", "false");
    bgmSettingsButton.setAttribute("aria-expanded", "false");
    calculatorButton.setAttribute("aria-expanded", "false");
    fillAnniversaryForm();
  }
});
anniversaryType.addEventListener("change", fillAnniversaryForm);
saveAnniversaryButton.addEventListener("click", saveAnniversaryEntry);
clearAnniversaryButton.addEventListener("click", clearAnniversaryEntry);
bgmSettingsButton.addEventListener("click", () => {
  const willOpen = bgmPanel.hidden;
  bgmPanel.hidden = !willOpen;
  bgmSettingsButton.setAttribute("aria-expanded", String(willOpen));
  if (willOpen) {
    namePanel.hidden = true;
    themePanel.hidden = true;
    anniversaryPanel.hidden = true;
    calculatorPanel.hidden = true;
    controlPanel.classList.remove("calculator-open");
    setCalculatorMode(false);
    nameSettingsButton.setAttribute("aria-expanded", "false");
    themeSettingsButton.setAttribute("aria-expanded", "false");
    anniversarySettingsButton.setAttribute("aria-expanded", "false");
    calculatorButton.setAttribute("aria-expanded", "false");
  }
});
calculatorButton.addEventListener("click", () => {
  const willOpen = calculatorPanel.hidden;
  if (willOpen) {
    openCalculatorPanel();
  } else {
    closeCalculatorPanel();
  }
});
calculatorCloseButton.addEventListener("click", () => {
  closeCalculatorPanel();
});
calculatorKeys.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  handleCalculatorInput(button);
});
speechToggleButton?.addEventListener("click", toggleSpeech);
voiceCommandButton?.addEventListener("click", startVoiceCommandRecognition);
petStyleToggleButton?.addEventListener("click", togglePetStyle);
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
    bgmGain.gain.setTargetAtTime(alarmRinging ? bgmVolumeValue * 0.02 : bgmVolumeValue, audioContext.currentTime, 0.2);
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
  if (!animationStarted) {
    animationStarted = true;
    requestAnimationFrame(animate);
  }
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
loadAnniversaries();
populateClockAlarmOptions();
loadClockAlarm();
loadBgmSettings();
loadSpeechSettings();
loadVoiceCommandSetting();
loadTheme();
loadPetStyle();
loadLargeTimerSetting();
loadLargeClockSetting();
loadClockDisplayMode();
if (largeClockEnabled && largeTimerEnabled) {
  largeTimerEnabled = false;
  saveLargeTimerSetting();
  updateLargeTimerState();
}
setupSpeechSynthesis();
startClockUpdates();
showStartupGreeting();
maybeShowAnniversaryComment(true);
updateMoodDisplay();
setTimerDisplays(remainingSeconds);
scheduleNextConversation(20000 + Math.random() * 40000);
window.setTimeout(() => showChefSolo("startup", 10000, 0.8), 6500);
registerServiceWorker();
