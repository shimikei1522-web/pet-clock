const canvas = document.querySelector("#pet");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const stage = document.querySelector("#stage");
const message = document.querySelector("#message");
const chefMessage = document.querySelector("#chefMessage");
const animalMessage = document.querySelector("#animalMessage");
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
const timeChoices = document.querySelectorAll(".time-choice");
const customMinutes = document.querySelector("#customMinutes");
const startTimerButton = document.querySelector("#startTimer");
const pauseTimerButton = document.querySelector("#pauseTimer");
const resetTimerButton = document.querySelector("#resetTimer");
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
let animalBubbleTimer = 0;
let nextConversationAt = Date.now() + 120000;
let clockIntervalId = 0;
let clockAlarmEnabled = false;
let clockAlarmLastKey = "";
let userName = "";
let anniversaries = {};
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

const dailyQuotes = ["今日もゆっくり始めよう。", "ひとつずつ進めよう。", "少し休んだら、また始めよう。", "しっかり確認すると安心だね。", "準備を丁寧にすると、あとでいいことがあるよ。", "今の様子を見てみよう。", "次にやることを一つ決めよう。", "無理しないくらいでいこう。"];

const seasonalEvents = {
  spring: { className: "season-spring", messages: ["春は新しいことを始めたくなるね。", "春の空気って、なんだかわくわくするね。"], quotes: ["春はゆっくり始めるのにぴったりだね。"], sweets: ["いちごタルト", "桜クッキー"] },
  summer: { className: "season-summer", messages: ["暑い日は、水分補給も作業のうちだよ。", "夏は少しゆっくりでも大丈夫。"], quotes: ["暑い日は無理しないくらいでいこう。"], sweets: ["レモンゼリー", "アイスクリーム"] },
  autumn: { className: "season-autumn", messages: ["秋の香りって、焼き菓子みたいだね。", "季節が変わると、作りたいものも変わるね。"], quotes: ["秋は香りを楽しみながら進めよう。"], sweets: ["栗のマフィン", "かぼちゃプリン"] },
  winter: { className: "season-winter", messages: ["寒い日は、あたたかい飲み物が味方だね。", "冬の作業は、手元をあたためてからね。"], quotes: ["寒い日は体をあたためてから始めよう。"], sweets: ["シュトーレン", "チョコケーキ"] },
};

const luckySweets = ["クロワッサン", "シュークリーム", "マドレーヌ", "プリン", "ベーグル", "メロンパン", "フィナンシェ", "ロールケーキ"];
const luckyColors = ["ミントグリーン", "いちごレッド", "クリームイエロー", "ココアブラウン", "シュガーホワイト", "ベリーピンク", "空色ブルー", "ピスタチオグリーン"];
const luckyMessages = ["今日は丁寧に進めると良い日！", "ひと休みのあとに、いいアイデアが出そう。", "しっかり確認すると安心だね。", "次にやることを一つ決めよう。", "無理しないくらいでいこう。"];

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
  bgmGain.gain.setValueAtTime(alarmRinging ? bgmVolumeValue * 0.04 : bgmVolumeValue, context.currentTime);
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
  const target = ducked ? bgmVolumeValue * 0.04 : bgmVolumeValue;
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

function playTone(startTime, frequency, duration, level = 0.28) {
  if (!audioContext || !alarmEnabled) return;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, startTime);
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(Math.min(level, 0.42), startTime + 0.025);
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
  playTone(now, 880, 0.14, 0.34);
  playTone(now + 0.2, 988, 0.14, 0.34);
  playTone(now + 0.4, 1175, 0.22, 0.38);
}

function playTimerCompletePattern() {
  if (!alarmEnabled) return;
  prepareAlarm();
  if (!audioContext || audioContext.state !== "running") return;
  const now = audioContext.currentTime;
  playTone(now, 660, 0.38, 0.28);
  playTone(now + 0.42, 880, 0.5, 0.32);
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
    themeSettingsButton.setAttribute("aria-expanded", "false");
    bgmSettingsButton.setAttribute("aria-expanded", "false");
    anniversarySettingsButton.setAttribute("aria-expanded", "false");
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
    nameSettingsButton.setAttribute("aria-expanded", "false");
    bgmSettingsButton.setAttribute("aria-expanded", "false");
    anniversarySettingsButton.setAttribute("aria-expanded", "false");
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
    nameSettingsButton.setAttribute("aria-expanded", "false");
    themeSettingsButton.setAttribute("aria-expanded", "false");
    bgmSettingsButton.setAttribute("aria-expanded", "false");
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
    nameSettingsButton.setAttribute("aria-expanded", "false");
    themeSettingsButton.setAttribute("aria-expanded", "false");
    anniversarySettingsButton.setAttribute("aria-expanded", "false");
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
    bgmGain.gain.setTargetAtTime(alarmRinging ? bgmVolumeValue * 0.04 : bgmVolumeValue, audioContext.currentTime, 0.2);
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
loadAnniversaries();
populateClockAlarmOptions();
loadClockAlarm();
loadBgmSettings();
loadTheme();
startClockUpdates();
showStartupGreeting();
maybeShowAnniversaryComment(true);
updateMoodDisplay();
setTimerDisplays(remainingSeconds);
scheduleNextConversation(20000 + Math.random() * 40000);
window.setTimeout(() => showChefSolo("startup", 10000, 0.8), 6500);
registerServiceWorker();
