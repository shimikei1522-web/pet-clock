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
let currentMoodName = "縺斐″縺偵ｓ";
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
let lastVoiceCommandFailAt = 0;
let voiceCommandFailureGuideShown = false;
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
  morning: { text: "縺翫・繧医≧縲ゆｻ頑律繧ゅｆ縺｣縺上ｊ蟋九ａ繧医≧縲・, replies: ["縺翫・繧医≧縲ゆｻ頑律繧ゅｆ縺｣縺上ｊ蟋九ａ繧医≧縲・, "譛昴・荳豁ｩ縺ｯ縲∽ｻ頑律縺ｮ豬√ｌ繧剃ｽ懊ｋ繧医・, "譛蛻昴・霆ｽ繧√〒繧ょ､ｧ荳亥､ｫ縲・, "譛昴・遨ｺ豌励〒縲∵ｰ玲戟縺｡繧定誠縺｡逹縺代ｈ縺・・, "莉頑律繧ゅｆ縺｣縺上ｊ蟋九ａ繧医≧縲・], action: "cheer" },
  afternoon: { text: "縺薙ｓ縺ｫ縺｡縺ｯ縲ゆｻ頑律繧ゅ＞縺・─縺倥↓騾ｲ繧√ｈ縺・・, replies: ["縺頑仂縺ｮ縺ゅ→繧ゅ∝ｰ代＠縺壹▽縺・％縺・・, "蜊亥ｾ後・蜊亥ｾ後・繝壹・繧ｹ縺ｧ螟ｧ荳亥､ｫ縲・, "縺薙％縺ｧ荳蝗槭∵ｵ√ｌ繧剃ｽ懊ｊ逶ｴ縺昴≧縲・, "蜊亥燕縺ｮ縺後ｓ縺ｰ繧翫√■繧・ｓ縺ｨ谿九▲縺ｦ繧九ｈ縲・, "逵縺上↑縺｣縺溘ｉ縲∝ｰ代＠菴薙ｒ蜍輔°縺昴≧縲・], action: "wave" },
  evening: { text: "縺薙ｓ縺ｰ繧薙・縲ゆｻ頑律繧ゅ♀縺､縺九ｌ縺輔∪縲・, replies: ["螟墓婿縺ｾ縺ｧ繧医￥騾ｲ繧√◆縺ｭ縲・, "莉頑律縺ｮ谿九ｊ縺ｯ縲∫┌逅・↑縺上＞縺薙≧縲・, "邨ゅｏ繧頑婿繧剃ｸ∝ｯｧ縺ｫ縺吶ｋ縺ｨ縲∵・譌･縺梧･ｽ縺繧医・, "縺ゅ→蟆代＠縺縺代∫援縺･縺代ｋ豌玲戟縺｡縺ｧ縺・％縺・・, "莉頑律縺ｧ縺阪◆縺薙→繧剃ｸ縺､隕九▽縺代ｈ縺・・], action: "wave" },
  night: { text: "縺薙ｓ縺ｰ繧薙・縲ゅ◎繧阪◎繧咲┌逅・＠縺吶℃縺ｪ縺・〒縺ｭ縲・, replies: ["螟懊・縺後ｓ縺ｰ繧翫☆縺取ｳｨ諢上□繧医・, "縺昴ｍ縺昴ｍ莨代・貅門ｙ繧ゅ＠縺ｦ縺・％縺・・, "譏取律縺ｮ閾ｪ蛻・↓繧・＆縺励￥縺励ｈ縺・・, "逵縺上↑繧句燕縺ｫ縲∝玄蛻・ｊ繧剃ｽ懊ｍ縺・・, "莉頑律縺ｯ縺薙％縺ｾ縺ｧ縺ｧ繧ょ香蛻・□繧医・], action: "shy" },
};

const actions = {
  idle: { row: 0, frames: [0, 1, 2, 3, 4, 5], speed: 420, text: "縺ｮ繧薙・繧翫＠縺ｦ縺・∪縺・ },
  run: { row: 1, frames: [0, 1, 2, 3, 4, 5, 6, 7], speed: 92, text: "襍ｰ縺｣縺ｦ縺・∪縺・ },
  wave: { row: 3, frames: [0, 1, 2, 3], speed: 180, text: "謇九ｒ謖ｯ縺｣縺ｦ縺・∪縺・ },
  cheer: { row: 4, frames: [0, 1, 2, 3, 4], speed: 145, text: "縺・ｌ縺励◎縺・〒縺・ },
  sad: { row: 5, frames: [0, 1, 2, 3, 4, 5, 6, 7], speed: 190, text: "縺｡繧・▲縺ｨ縺励ｇ繧薙⊂繧・ },
  snack: { row: 7, frames: [0, 1, 2, 3, 4, 5], speed: 165, text: "縺翫ｄ縺､繧ｿ繧､繝" },
  shy: { row: 8, frames: [0, 1, 2, 3, 4, 5], speed: 190, text: "繧ゅ§繧ゅ§縺励※縺・∪縺・ },
};

const clickActions = ["run", "wave", "cheer", "snack", "shy", "sad"];
const exactTimeEvents = {
  "07:00": "縺翫・繧医≧・∽ｻ頑律繧ゅ＞縺・ｸ譌･縺ｫ縺励ｈ縺・ｼ・,
  "12:00": "縺頑仂縺繧茨ｼ∝ｰ代＠莨第・縺励ｈ縺・・,
  "15:00": "縺翫ｄ縺､縺ｮ譎る俣縺繧茨ｼ・,
  "18:00": "莉頑律繧ゅ♀縺､縺九ｌ縺輔∪・・,
  "22:00": "縺昴ｍ縺昴ｍ莨代・貅門ｙ繧偵＠繧医≧縲・,
};

let dailyQuotes = [
  "莉頑律繧ゆｸ邱偵↓縲∝・蜉帙〒讌ｽ縺励ｂ縺・・・・,
  "{name}縺ｪ繧臥ｵｶ蟇ｾ螟ｧ荳亥､ｫ縲√＞縺｣縺ｦ繧峨▲縺励ｃ縺・ｼ・,
  "縺・▽繧ゆｸ逕滓・蜻ｽ縺ｪ縺ｨ縺薙ｍ縲∵悽蠖薙↓繧ｫ繝・さ縺・＞縺ｨ諤昴▲縺ｦ繧九ｈ・・,
  "辟｡逅・＠縺ｪ縺・〒縲∬・蛻・・繝壹・繧ｹ縺ｧ繝懊メ繝懊メ縺後ｓ縺ｰ繧搾ｼ・,
  "菴輔°縺ゅ▲縺溘ｉ縺・▽縺ｧ繧りｨ縺｣縺ｦ縺ｭ縲らｧ√・縺壹▲縺ｨ蜻ｳ譁ｹ縺縺九ｉ・・,
  "莉頑律繧ゆｸ譌･縲√♀莠偵＞繝上ャ繝斐・縺ｫ驕弱＃縺昴≧縺ｭ・・,
  "{name}縺ｮ隨鷹｡斐ｒ隕九ｋ縺ｨ縲√％縺｣縺｡縺ｾ縺ｧ蜈・ｰ励↓縺ｪ縺｣縺｡繧・≧繧茨ｼ・,
  "繝・せ繝医∫ｷ雁ｼｵ縺吶ｋ縺九ｂ縺励ｌ縺ｪ縺・￠縺ｩ縲√＞縺､繧ゅ・{name}縺ｪ繧牙､ｧ荳亥､ｫ・・,
  "逋ｺ陦ｨ縺ｮ縺ｨ縺咲ｷ雁ｼｵ縺励◆繧峨∫ｧ√・蟶ｭ繧定ｦ九※・√ル繧ｳ縺｣縺ｦ隨代▲縺ｦ蠢懈抄縺励※繧九°繧峨・縲・,
  "螳ｿ鬘後→縺九＞縺､繧る大ｼｵ縺｣縺ｦ縺ｦ縺医ｉ縺・ｼ∽ｻ頑律繧ょｿ懈抄縺励※繧九ｈ縲・,
  "髢馴＆縺医※繧ゅラ繝ｳ繝槭う・∵ｬ｡縲√′繧薙・繧後・蜈ｨ辟ｶ繧ｪ繝・こ繝ｼ縺繧茨ｼ・,
  "莉頑律縺ｮ逶ｮ讓吶↓蜷代°縺｣縺ｦ縲∽ｸ邱偵↓繝輔ぃ繧､繝医・・・,
  "{name}縺ｪ繧峨√″縺｣縺ｨ縺・∪縺上＞縺上▲縺ｦ菫｡縺倥※繧九ｈ・・,
  "莉頑律縺ｮ隧ｦ蜷医∫ｵｶ蟇ｾ蜍昴※繧九ｈ・∝ｿ懈抄縺ｮ貅門ｙ縺ｯ繝舌ャ繝√Μ縺縺九ｉ縺ｭ・・,
  "螟ｱ謨励＠縺ｦ繧よｰ励↓縺励↑縺・〒・√∩繧薙↑縺ｧ繧ｫ繝舌・縺吶ｋ縺九ｉ讌ｽ縺励ｂ縺・ｼ・,
  "{name}縺ｮ驕句虚逾樒ｵ後↑繧峨∽ｻ頑律縺ｮ繝峨ャ繧ｸ繝懊・繝ｫ繧・ｩｦ蜷医ｂ螟ｧ豢ｻ霄埼俣驕輔＞縺ｪ縺暦ｼ・,
  "蜷後§繝√・繝縺ｫ縺ｪ繧後※繧√■繧・￥縺｡繧・ｬ峨＠縺・ｼ∽ｸ邱偵↓縺後ｓ縺ｰ繧阪≧縺ｭ縲・,
  "譛蠕後∪縺ｧ縺ゅ″繧峨ａ縺壹↓襍ｰ繧句ｧｿ縲√☆縺｣縺斐￥蠢懈抄縺励◆縺上↑繧具ｼ・,
  "莉頑律繧ゅ♀逍ｲ繧梧ｧ假ｼ√′繧薙・縺｣縺ｦ繧九・縲√■繧・ｓ縺ｨ遏･縺｣縺ｦ繧九°繧峨・縲・,
  "縺・▽繧りｩｱ繧定◇縺・※縺上ｌ縺ｦ縺ゅｊ縺後→縺・ゆｻ頑律縺ｯ遘√′蜈・ｰ励ｒ縺ゅ￡繧狗分縺繧茨ｼ・,
];
const DAILY_QUOTE_VERSION = 3;
const dailyQuoteFallbacks = {
  "{name}縺ｪ繧臥ｵｶ蟇ｾ螟ｧ荳亥､ｫ縲√＞縺｣縺ｦ繧峨▲縺励ｃ縺・ｼ・: "縺阪▲縺ｨ螟ｧ荳亥､ｫ縲√＞縺｣縺ｦ繧峨▲縺励ｃ縺・ｼ・,
  "{name}縺ｮ隨鷹｡斐ｒ隕九ｋ縺ｨ縲√％縺｣縺｡縺ｾ縺ｧ蜈・ｰ励↓縺ｪ縺｣縺｡繧・≧繧茨ｼ・: "隨鷹｡斐ｒ隕九ｋ縺ｨ縲√％縺｣縺｡縺ｾ縺ｧ蜈・ｰ励↓縺ｪ縺｣縺｡繧・≧繧茨ｼ・,
  "繝・せ繝医∫ｷ雁ｼｵ縺吶ｋ縺九ｂ縺励ｌ縺ｪ縺・￠縺ｩ縲√＞縺､繧ゅ・{name}縺ｪ繧牙､ｧ荳亥､ｫ・・: "繝・せ繝医∫ｷ雁ｼｵ縺吶ｋ縺九ｂ縺励ｌ縺ｪ縺・￠縺ｩ縲√＞縺､繧る壹ｊ縺ｪ繧牙､ｧ荳亥､ｫ・・,
  "{name}縺ｪ繧峨√″縺｣縺ｨ縺・∪縺上＞縺上▲縺ｦ菫｡縺倥※繧九ｈ・・: "縺阪▲縺ｨ縺・∪縺上＞縺上▲縺ｦ菫｡縺倥※繧九ｈ・・,
  "{name}縺ｮ驕句虚逾樒ｵ後↑繧峨∽ｻ頑律縺ｮ繝峨ャ繧ｸ繝懊・繝ｫ繧・ｩｦ蜷医ｂ螟ｧ豢ｻ霄埼俣驕輔＞縺ｪ縺暦ｼ・: "莉頑律縺ｮ繝峨ャ繧ｸ繝懊・繝ｫ繧・ｩｦ蜷医ｂ縲∝､ｧ豢ｻ霄埼俣驕輔＞縺ｪ縺暦ｼ・,
};

const seasonalEvents = {
  spring: { className: "season-spring", messages: ["譏･縺ｯ譁ｰ縺励＞縺薙→繧貞ｧ九ａ縺溘￥縺ｪ繧九・縲・, "譏･縺ｮ遨ｺ豌励▲縺ｦ縲√↑繧薙□縺九ｏ縺上ｏ縺上☆繧九・縲・], quotes: ["譏･縺ｯ繧・▲縺上ｊ蟋九ａ繧九・縺ｫ縺ｴ縺｣縺溘ｊ縺縺ｭ縲・], sweets: ["縺・■縺斐ち繝ｫ繝・, "譯懊け繝・く繝ｼ"] },
  summer: { className: "season-summer", messages: ["證代＞譌･縺ｯ縲∵ｰｴ蛻・｣懃ｵｦ繧ゆｽ懈･ｭ縺ｮ縺・■縺繧医・, "螟上・蟆代＠繧・▲縺上ｊ縺ｧ繧ょ､ｧ荳亥､ｫ縲・], quotes: ["證代＞譌･縺ｯ辟｡逅・＠縺ｪ縺・￥繧峨＞縺ｧ縺・％縺・・], sweets: ["繝ｬ繝｢繝ｳ繧ｼ繝ｪ繝ｼ", "繧｢繧､繧ｹ繧ｯ繝ｪ繝ｼ繝"] },
  autumn: { className: "season-autumn", messages: ["遘九・鬥吶ｊ縺｣縺ｦ縲∫┥縺崎藷蟄舌∩縺溘＞縺縺ｭ縲・, "蟄｣遽縺悟､峨ｏ繧九→縲∽ｽ懊ｊ縺溘＞繧ゅ・繧ょ､峨ｏ繧九・縲・], quotes: ["遘九・鬥吶ｊ繧呈･ｽ縺励∩縺ｪ縺後ｉ騾ｲ繧√ｈ縺・・], sweets: ["譬励・繝槭ヵ繧｣繝ｳ", "縺九⊂縺｡繧・・繝ｪ繝ｳ"] },
  winter: { className: "season-winter", messages: ["蟇偵＞譌･縺ｯ縲√≠縺溘◆縺九＞鬟ｲ縺ｿ迚ｩ縺悟袖譁ｹ縺縺ｭ縲・, "蜀ｬ縺ｮ菴懈･ｭ縺ｯ縲∵焔蜈・ｒ縺ゅ◆縺溘ａ縺ｦ縺九ｉ縺ｭ縲・], quotes: ["蟇偵＞譌･縺ｯ菴薙ｒ縺ゅ◆縺溘ａ縺ｦ縺九ｉ蟋九ａ繧医≧縲・], sweets: ["繧ｷ繝･繝医・繝ｬ繝ｳ", "繝√Ι繧ｳ繧ｱ繝ｼ繧ｭ"] },
};

let luckySweets = ["繧ｯ繝ｭ繝ｯ繝・し繝ｳ","繧ｷ繝･繝ｼ繧ｯ繝ｪ繝ｼ繝","繝槭ラ繝ｬ繝ｼ繝・,"繝励Μ繝ｳ","繝吶・繧ｰ繝ｫ","繝｡繝ｭ繝ｳ繝代Φ","繝輔ぅ繝翫Φ繧ｷ繧ｧ","繝ｭ繝ｼ繝ｫ繧ｱ繝ｼ繧ｭ","鬟溘ヱ繝ｳ","繧ｯ繝ｪ繝ｼ繝繝代Φ","繝√Ι繧ｳ繧ｳ繝ｭ繝・,"繧ｫ繝後Ξ","繧ｹ繧ｳ繝ｼ繝ｳ","繝ｬ繝｢繝ｳ繧ｿ繝ｫ繝・,"縺・■縺斐す繝ｧ繝ｼ繝・,"繧｢繝・・繝ｫ繝代う","繝√・繧ｺ繧ｱ繝ｼ繧ｭ","繝峨・繝翫ヤ","繝舌ち繝ｼ繝ｭ繝ｼ繝ｫ","繝溘Ν繧ｯ繝代Φ"];
let luckyColors = ["繝溘Φ繝医げ繝ｪ繝ｼ繝ｳ","縺・■縺斐Ξ繝・ラ","繧ｯ繝ｪ繝ｼ繝繧､繧ｨ繝ｭ繝ｼ","繧ｳ繧ｳ繧｢繝悶Λ繧ｦ繝ｳ","繧ｷ繝･繧ｬ繝ｼ繝帙Ρ繧､繝・,"繝吶Μ繝ｼ繝斐Φ繧ｯ","遨ｺ濶ｲ繝悶Ν繝ｼ","繝斐せ繧ｿ繝√が繧ｰ繝ｪ繝ｼ繝ｳ","繝ｬ繝｢繝ｳ繧､繧ｨ繝ｭ繝ｼ","繧ｫ繝輔ぉ繝ｩ繝・牡","縺輔￥繧峨ヴ繝ｳ繧ｯ","繧ｪ繝ｬ繝ｳ繧ｸ","繝ｩ繝吶Φ繝繝ｼ","繝舌ル繝ｩ繝帙Ρ繧､繝・,"繝√Ι繧ｳ繝ｬ繝ｼ繝郁牡"];
let luckyMessages = ["莉頑律縺ｯ荳∝ｯｧ縺ｫ騾ｲ繧√ｋ縺ｨ濶ｯ縺・律・・,"縺ｲ縺ｨ莨代∩縺ｮ縺ゅ→縺ｫ縲√＞縺・い繧､繝・い縺悟・縺昴≧縲・,"縺励▲縺九ｊ遒ｺ隱阪☆繧九→螳牙ｿ・□縺ｭ縲・,"谺｡縺ｫ繧・ｋ縺薙→繧剃ｸ縺､豎ｺ繧√ｈ縺・・,"辟｡逅・＠縺ｪ縺・￥繧峨＞縺ｧ縺・％縺・・,"繝ｩ繝・く繝ｼ縺願藷蟄舌・繝励Μ繝ｳ縲ゅｄ縺輔＠縺城ｲ繧√ｈ縺・・,"繝ｩ繝・く繝ｼ繝代Φ縺ｯ繧ｯ繝ｭ繝ｯ繝・し繝ｳ縲ゅ＞縺・ｵ√ｌ縺梧擂縺昴≧縲・,"繝ｩ繝・く繝ｼ陦悟虚縺ｯ豺ｱ蜻ｼ蜷ｸ縲り誠縺｡逹縺上→隕九∴縺ｦ縺上ｋ繧医・,"繝ｩ繝・く繝ｼ繧ｫ繝ｩ繝ｼ縺ｯ繧ｯ繝ｪ繝ｼ繝濶ｲ縲ゅｄ繧上ｉ縺九＞豌玲戟縺｡縺ｧ縺・％縺・・,"繝ｩ繝・く繝ｼ縺願藷蟄舌・繧ｷ繝･繝ｼ繧ｯ繝ｪ繝ｼ繝縲ゅ・繧薙ｏ繧企ｲ繧√ｈ縺・・,"繝ｩ繝・く繝ｼ繝代Φ縺ｯ鬟溘ヱ繝ｳ縲ょ渕譛ｬ繧貞､ｧ蛻・↓縺吶ｋ縺ｨ繧医＆縺昴≧縲・,"繝ｩ繝・く繝ｼ陦悟虚縺ｯ譛ｺ繧偵″繧後＞縺ｫ縺吶ｋ縺薙→縲・,"繝ｩ繝・く繝ｼ繧ｫ繝ｩ繝ｼ縺ｯ繝溘Φ繝医よｰ怜・縺後☆縺｣縺阪ｊ縺励◎縺・・,"繝ｩ繝・く繝ｼ縺願藷蟄舌・繝槭ラ繝ｬ繝ｼ繝後ょｰ上＆縺ｪ蟷ｸ縺帙′縺ゅｊ縺昴≧縲・,"繝ｩ繝・く繝ｼ繝代Φ縺ｯ繝｡繝ｭ繝ｳ繝代Φ縲ゆｻ頑律縺ｯ蟆代＠讌ｽ縺励￥縺・％縺・・,"繝ｩ繝・く繝ｼ陦悟虚縺ｯ豌ｴ蛻・｣懃ｵｦ縲ょ・豌励′謌ｻ繧翫◎縺・・,"繝ｩ繝・く繝ｼ繧ｫ繝ｩ繝ｼ縺ｯ縺輔￥繧峨ヴ繝ｳ繧ｯ縲ゅｄ縺輔＠縺・律縺ｫ縺ｪ繧翫◎縺・・,"繝ｩ繝・く繝ｼ縺願藷蟄舌・繧｢繝・・繝ｫ繝代う縲ゅ＞縺・ｦ吶ｊ縺ｮ荳譌･縺繧医・,"繝ｩ繝・く繝ｼ繝代Φ縺ｯ繝舌ち繝ｼ繝ｭ繝ｼ繝ｫ縲ゆｸｸ縺城ｲ繧√・螟ｧ荳亥､ｫ縲・,"繝ｩ繝・く繝ｼ陦悟虚縺ｯ驕灘・繧偵◎繧阪∴繧九％縺ｨ縲・];

const moodProfiles = [
  { name: "縺ｭ繧縺・, minMood: 0, maxMood: 45, minEnergy: 0, maxEnergy: 46, messages: ["蟆代＠逵縺昴≧縺縺ｭ縲ゆｼ第・縺励ｈ縺・・, "莉頑律縺ｯ繧・▲縺上ｊ繧√〒縺・％縺・・] },
  { name: "縺翫↑縺九☆縺・◆", minMood: 0, maxMood: 58, minEnergy: 47, maxEnergy: 99, messages: ["縺翫↑縺九☆縺・◆縺九ｂ縲ゅ・縺ｨ諱ｯ縺､縺薙≧縲・, "霆ｽ縺城｣溘∋縺溘ｉ蜈・ｰ励′蜃ｺ縺昴≧縲・] },
  { name: "縺ｮ繧薙・繧贋ｸｭ", minMood: 46, maxMood: 72, minEnergy: 0, maxEnergy: 62, messages: ["縺ｮ繧薙・繧企ｲ繧√ｈ縺・・, "蟆代＠縺壹▽縺ｧ螟ｧ荳亥､ｫ縲・] },
  { name: "縺斐″縺偵ｓ", minMood: 59, maxMood: 99, minEnergy: 0, maxEnergy: 72, messages: ["莉頑律繧ゅ＞縺・─縺倥□繧医・, "縺・＞豬√ｌ縺ｫ縺ｪ縺｣縺ｦ縺阪◆縺ｭ縲・] },
  { name: "繧・ｋ豌玲ｺ縲・, minMood: 73, maxMood: 99, minEnergy: 63, maxEnergy: 99, messages: ["髮・ｸｭ蜉帙′鬮倥∪縺｣縺ｦ縺阪◆縺ｭ縲・, "縺昴・隱ｿ蟄舌√◎縺ｮ隱ｿ蟄舌・] },
];

const conversations = { normal: [["莉頑律繧ゅ＞縺・─縺倥□縺ｭ", "縺昴・隱ｿ蟄舌〒縺・″縺ｾ縺励ｇ縺・], ["蟆代＠縺壹▽騾ｲ繧薙〒繧九・", "遨阪∩驥阪・縺悟､ｧ莠九〒縺・], ["辟ｦ繧峨↑縺上※縺・＞繧・, "荳∝ｯｧ縺輔ｒ螟ｧ蛻・↓縺励∪縺励ｇ縺・], ["髮・ｸｭ蜉帙′鬮倥∪縺｣縺ｦ縺阪◆縺ｭ", "縺・＞繝ｪ繧ｺ繝縺ｧ縺・], ["莨第・縺吶ｋ・・, "荳蠎ｦ莨代・縺ｮ繧ょ､ｧ蛻・〒縺・], ["菴懈･ｭ蜿ｰ縲√″繧後＞縺ｫ縺吶ｋ・・, "谺｡縺ｫ繧・ｋ縺薙→縺瑚ｦ九∴繧・☆縺上↑繧翫∪縺・], ["莉頑律縺ｯ貅門ｙ縺ｮ譌･縺九ｂ", "邨先棡縺ｯ縺ゅ→縺九ｉ縺､縺・※縺阪∪縺・], ["縺｡繧・▲縺ｨ閠・∴縺吶℃縺溘°繧・, "荳縺､隧ｦ縺吶→隕九∴縺ｦ縺阪∪縺・], ["莉翫・荳豁ｩ縲√ｈ縺九▲縺溘・", "蟆代＠騾ｲ繧薙□縺薙→繧貞､ｧ莠九↓縺励∪縺励ｇ縺・], ["辟ｼ縺丞燕縺ｮ遒ｺ隱阪▲縺ｦ螟ｧ莠九□縺ｭ", "譛蠕後・遒ｺ隱阪′莉穂ｸ翫′繧翫ｒ螳医ｊ縺ｾ縺・], ["莉頑律縺ｯ繧・▲縺上ｊ繧√〒縺・＞・・, "荳∝ｯｧ縺ｫ騾ｲ繧√ｋ譌･繧ょｿ・ｦ√〒縺・], ["鬆ｭ縺後＞縺｣縺ｱ縺・□縺ｭ", "荳縺､縺縺第嶌縺榊・縺励※縺ｿ縺ｾ縺励ｇ縺・], ["縺翫＞縺励＞莠域─縺後☆繧・, "縺昴・莠域─繧貞ｽ｢縺ｫ縺励※縺・″縺ｾ縺励ｇ縺・], ["髮・ｸｭ蜉帙′荳翫′縺｣縺ｦ縺阪◆縺ｭ", "縺・＞諢溘§縺ｧ騾ｲ繧薙〒縺・∪縺・], ["縺昴ｍ縺昴ｍ蛹ｺ蛻・ｋ・・, "蛹ｺ蛻・ｋ縺ｨ邯壹″縺梧･ｽ縺ｫ縺ｪ繧翫∪縺・], ["謇句・縲√＞縺・─縺倥□繧・, "關ｽ縺｡逹縺・※縺・∪縺吶・"], ["蟆代＠逵縺上↑縺・ｼ・, "辟｡逅・○縺壻ｼ第・繧貞・繧後∪縺励ｇ縺・], ["莉頑律繧りｦ句ｮ医▲縺ｦ繧九ｈ", "遘√ｂ隕句ｮ医▲縺ｦ縺・∪縺・], ["縺・＞鬥吶ｊ縺後＠縺昴≧", "荳∝ｯｧ縺ｪ菴懈･ｭ縺ｮ險ｼ諡縺ｧ縺吶・"], ["莉翫・遒ｺ隱阪√∴繧峨＞縺ｭ", "遒ｺ隱阪〒縺阪ｋ縺ｮ縺ｯ縲√→縺ｦ繧ゅ＞縺・％縺ｨ縺ｧ縺・]], morning: [["譛昴・繧・▲縺上ｊ蟋九ａ繧医≧", "譛蛻昴・豬√ｌ繧剃ｽ懊ｊ縺ｾ縺励ｇ縺・], ["蜊亥ｾ後ｂ蟆代＠縺壹▽縺ｭ", "繝壹・繧ｹ繧剃ｽ懊ｊ逶ｴ縺励∪縺励ｇ縺・], ["螟墓婿縺ｾ縺ｧ繧医￥騾ｲ繧薙□縺ｭ", "邨ゅｏ繧頑婿繧剃ｸ∝ｯｧ縺ｫ縺励∪縺励ｇ縺・], ["螟懊・辟｡逅・＠縺吶℃縺ｪ縺・〒縺ｭ", "譏取律縺ｮ閾ｪ蛻・↓繧ょ━縺励￥縺励∪縺励ｇ縺・]], afternoon: [["譏･縺｣縺ｦ繧上￥繧上￥縺吶ｋ縺ｭ", "譁ｰ縺励＞縺薙→繧貞ｧ九ａ縺溘￥縺ｪ繧句ｭ｣遽縺ｧ縺吶・"], ["證代＞譌･縺ｯ豌ｴ蛻・□縺ｭ", "菴楢ｪｿ邂｡逅・ｂ螟ｧ莠九〒縺・], ["遘九・辟ｼ縺崎藷蟄舌▲縺ｽ縺・・", "鬥吶ｊ繧呈･ｽ縺励∩縺溘￥縺ｪ繧翫∪縺吶・"], ["蟇偵＞譌･縺ｯ貂ｩ縺ｾ繧翫◆縺・・", "謇句・繧ょ・繧・＆縺ｪ縺・ｈ縺・↓縺励∪縺励ｇ縺・], ["髮ｨ縺ｮ譌･縺ｯ髱吶°縺縺ｭ", "髮・ｸｭ縺励ｄ縺吶＞遨ｺ豌励〒縺・], ["莉翫・荳縺､縺ｫ髮・ｸｭ縺縺ｭ", "縺昴・蛻､譁ｭ縺ｧ螟ｧ荳亥､ｫ縺ｧ縺・]], evening: [["繧ｿ繧､繝槭・荳ｭ縺繧・, "遏ｭ縺・凾髢薙ｒ螟ｧ蛻・↓縺励∪縺励ｇ縺・], ["縺ゅ→蟆代＠縺縺ｭ", "譛蠕後∪縺ｧ關ｽ縺｡逹縺・※"], ["邨ゅｏ縺｣縺溘・・・, "繧医￥髮・ｸｭ縺ｧ縺阪∪縺励◆"], ["莨第・縺ｮ譎る俣縺繧・, "縺励▲縺九ｊ莨代∩縺ｾ縺励ｇ縺・], ["繧｢繝ｩ繝ｼ繝魑ｴ縺｣縺ｦ繧九ｈ", "縺ｾ縺壽ｭ｢繧√※縺九ｉ遒ｺ隱阪＠縺ｾ縺励ｇ縺・]], night: [["BGM螟峨∴縺滂ｼ・, "豌怜・縺ｫ蜷医≧髻ｳ縺ｯ螟ｧ莠九〒縺吶・"], ["莉頑律縺ｮ縺ｲ縺ｨ縺薙→縲√＞縺・・", "縺・＞險闡峨〒縺励◆縺ｭ"], ["蜊縺・√←縺・□縺｣縺滂ｼ・, "縺・＞縺阪▲縺九￠縺ｫ縺励∪縺励ｇ縺・], ["蜷榊燕繧貞他縺ｶ縺ｨ霑代￥諢溘§繧九・", "閾ｪ辟ｶ縺ｧ縺・＞縺ｧ縺吶・"], ["縺｡繧・▲縺ｨ隨代▲縺ｦ繧ゅ＞縺・ｼ・, "豌玲戟縺｡縺後⊇縺舌ｌ繧九↑繧峨＞縺・〒縺吶・"]], focus: [["縺ｼ縺上∝ｿ懈抄荳頑焔縺九↑", "縺九↑繧贋ｸ頑焔縺ｧ縺吶ｈ"], ["繧ｷ繧ｧ繝輔ｂ隕句ｮ医▲縺ｦ繧具ｼ・, "繧ゅ■繧阪ｓ縺ｧ縺・], ["莉頑律縺ｮ髮・ｸｭ縲∫┥縺阪◆縺ｦ邏・, "縺九ｏ縺・＞險縺・婿縺ｧ縺吶・"], ["繧・ｋ豌励′縺ｵ縺上ｉ繧薙〒縺阪◆", "縺ｵ縺上ｉ縺ｿ縺吶℃縺ｫ縺ｯ豕ｨ諢上〒縺吶・"], ["莨第・繧ゆｻ穂ｺ九・縺・■・・, "繧ゅ■繧阪ｓ螟ｧ莠九〒縺・], ["驕灘・繧剃ｸｦ縺ｹ繧医≧縺九↑", "縺・＞蛻､譁ｭ縺ｧ縺・], ["莉翫・菴懈･ｭ縲∽ｸ∝ｯｧ縺縺ｭ", "莉穂ｸ翫′繧翫↓繧ょ・縺ｾ縺吶ｈ"], ["蟆代＠霑ｷ縺｣縺ｦ繧具ｼ・, "蝓ｺ譛ｬ縺ｫ謌ｻ繧翫∪縺励ｇ縺・]], timerComplete: [["螟ｱ謨励＠縺昴≧縺ｧ縺薙ｏ縺・・", "遒ｺ隱阪☆繧九→髦ｲ縺偵ｋ縺薙→繧ゅ≠繧翫∪縺・], ["荳蝗樊ｷｱ蜻ｼ蜷ｸ縺励ｈ縺・, "關ｽ縺｡逹縺阪・螟ｧ蛻・〒縺・], ["縺薙％縺ｾ縺ｧ譚･縺溘・", "縺薙％縺ｾ縺ｧ繧医￥騾ｲ繧√∪縺励◆"], ["莉頑律縺ｯ繧・▲縺上ｊ騾ｲ繧√ｋ譌･縺縺ｭ", "縺昴≧縺・≧譌･繧ょ､ｧ蛻・〒縺・], ["谺｡縺ｯ菴輔°繧峨ｄ繧具ｼ・, "縺・■縺ｰ繧鍋ｰ｡蜊倥↑縺ｨ縺薙ｍ縺九ｉ蟋九ａ縺ｾ縺励ｇ縺・], ["謇九′豁｢縺ｾ縺｣縺溘・", "閠・∴繧区凾髢薙ｂ蠢・ｦ√〒縺・], ["蟆代＠騾ｲ繧薙□繧・, "縺昴ｌ縺ｧ蜊∝・縺ｧ縺・], ["縺・＞陦ｨ諠・＠縺ｦ繧九ｈ", "髮・ｸｭ縺励※縺・ｋ險ｼ諡縺ｧ縺吶・"]], seasonal: { spring: ["譏･縺｣縺ｦ繧上￥繧上￥縺吶ｋ縺ｭ","譁ｰ縺励＞縺薙→繧貞ｧ九ａ縺溘￥縺ｪ繧句ｭ｣遽縺ｧ縺吶・"], summer: ["證代＞譌･縺ｯ豌ｴ蛻・□縺ｭ","菴楢ｪｿ邂｡逅・ｂ螟ｧ莠九〒縺・], autumn: ["遘九・辟ｼ縺崎藷蟄舌▲縺ｽ縺・・","鬥吶ｊ繧呈･ｽ縺励∩縺溘￥縺ｪ繧翫∪縺吶・"], winter: ["蟇偵＞譌･縺ｯ貂ｩ縺ｾ繧翫◆縺・・","謇句・繧ょ・繧・＆縺ｪ縺・ｈ縺・↓縺励∪縺励ｇ縺・] } };

const extraPetReplies = { normal: ["莉頑律繧ゅ＞縺・─縺倥□繧医・, "縺ｲ縺ｨ縺､縺壹▽騾ｲ繧√ｈ縺・・, "莉翫・繝壹・繧ｹ縺ｧ螟ｧ荳亥､ｫ縲・, "縺｡繧・ｓ縺ｨ蜑阪↓騾ｲ繧薙〒繧九ｈ縲・, "蟆代＠縺壹▽蠖｢縺ｫ縺ｪ縺｣縺ｦ繧九・縲・, "霑ｷ縺｣縺溘ｉ縲√∪縺壻ｸ縺､縺縺代ｄ縺｣縺ｦ縺ｿ繧医≧縲・, "莉翫〒縺阪ｋ縺薙→縺九ｉ蟋九ａ繧医≧縲・, "螳檎挑縺倥ｃ縺ｪ縺上※繧ょ､ｧ荳亥､ｫ縲・, "縺薙％縺ｾ縺ｧ譚･縺溘・縲√■繧・ｓ縺ｨ縺吶＃縺・ｈ縲・, "莉頑律縺ｮ荳豁ｩ縲√＞縺・ｸ豁ｩ縺縺ｭ縲・, "謇九ｒ蜍輔°縺吶→縲∵ｰ玲戟縺｡繧ょ虚縺上ｈ縲・, "縺・＞豬√ｌ縺ｫ縺ｪ縺｣縺ｦ縺阪◆縺ｭ縲・, "辟ｦ繧峨★縲∽ｻ翫・菴懈･ｭ繧貞､ｧ莠九↓縺励ｈ縺・・, "縺ｧ縺阪◆縺ｨ縺薙ｍ繧定ｦ九※縺ｿ繧医≧縲・, "縺｡繧・ｓ縺ｨ遨阪∩驥阪↑縺｣縺ｦ繧九ｈ縲・, "縺昴・隱ｿ蟄舌√◎縺ｮ隱ｿ蟄舌・, "莉頑律縺ｯ蟆代＠繧・▲縺上ｊ騾ｲ繧√※繧ゅ＞縺・ｈ縲・, "蟆上＆縺ｪ蜑埼ｲ繧ょ､ｧ莠九□繧医・, "縺ｾ縺壹・蟆代＠縺縺鷹ｲ繧√※縺ｿ繧医≧縲・, "髮・ｸｭ蜉帙′鬮倥∪縺｣縺ｦ縺阪◆縺ｭ縲・, "縺・∪縺ｮ鬆大ｼｵ繧翫∬ｦ九※縺溘ｈ縲・, "繧・▲縺上ｊ縺ｧ繧るｲ繧√・螟ｧ荳亥､ｫ縲・, "縺ｧ縺阪ｋ縺ｨ縺薙ｍ縺九ｉ縺ｧ縺・＞繧医・, "莉頑律縺ｯ閾ｪ蛻・↓繧ゅｄ縺輔＠縺上＠繧医≧縲・, "縺薙％縺九ｉ縺ｾ縺溷ｧ九ａ縺溘ｉ縺・＞繧医・, "縺ｲ縺ｨ縺､邨ゅｏ繧九→縲∵ｬ｡縺瑚ｻｽ縺上↑繧九ｈ縲・, "縺・∪縺上＞縺九↑縺・凾繧ゅ≠繧九ｈ縺ｭ縲・, "縺ｧ繧ゅ∫ｶ壹￠縺ｦ繧九・縺後☆縺斐＞繧医・, "莉翫・遒ｺ隱阪√＞縺・愛譁ｭ縺縺ｭ縲・, "荳∝ｯｧ縺ｫ騾ｲ繧√※繧九・縲∽ｼ昴ｏ繧九ｈ縲・, "莉頑律繧ゆｸ邱偵↓騾ｲ繧ゅ≧縺ｭ縲・, "蟆代＠縺壹▽縺ｧ縺阪※縺阪◆縺ｭ縲・, "縺・∪縺ｮ髮・ｸｭ縲√＞縺・─縺倥□繧医・, "辟ｦ繧峨★縲√・縺ｨ縺､縺壹▽縺・％縺・・, "縺後ｓ縺ｰ縺｣縺ｦ繧九・縲√■繧・ｓ縺ｨ隕九※繧九ｈ縲・, "莨第・縺励◆繧峨√∪縺滉ｸ邱偵↓蟋九ａ繧医≧縲・, "莉頑律縺ｮ菴懈･ｭ縲√＞縺・─縺倥↓騾ｲ繧薙〒繧九・縲・, "豺ｱ蜻ｼ蜷ｸ縺励※縲√ｂ縺・ｸ蝗槭＞縺薙≧縲・, "縺ｧ縺阪◆縺ｨ縺薙ｍ繧定ｦ九ｋ縺ｨ縲√■繧・▲縺ｨ蜈・ｰ怜・繧九ｈ縲・, "辟ｼ縺阪◆縺ｦ縺ｿ縺溘＞縺ｫ縲√＞縺・ｰ怜・縺ｫ縺ｪ縺｣縺ｦ縺阪◆縺ｭ縲・, "縺｡繧・▲縺ｨ縺壹▽騾ｲ繧縺ｮ縲√＞縺・・縲・, "縺薙％縺ｾ縺ｧ譚･縺溘ｉ縲√ｂ縺・香蛻・∴繧峨＞繧医・, "縺・∪縺ｮ荳豁ｩ縲√°繧上＞縺乗牛謇九＠縺溘＞縲・, "縺昴▲縺ｨ蠢懈抄縺励※繧九ｈ縲・, "莉頑律縺ｯ縺・＞豬√ｌ縺ｫ縺ｪ繧翫◎縺・・, "縺・∪縺上＞縺丈ｺ域─縺後☆繧九ｈ縲・, "蟆代＠莨代ｓ縺ｧ繧ゅ√■繧・ｓ縺ｨ謌ｻ繧後ｋ繧医・, "縺ｼ縺上ｂ縺ｨ縺ｪ繧翫〒隕九※繧九・縲・, "縺ゅｏ縺ｦ縺ｪ縺上※縺・＞繧医・, "縺・▲縺励ｇ縺ｫ繧・▲縺上ｊ騾ｲ繧ゅ≧縲・, "髮・ｸｭ縺励※繧矩｡斐∬・莠ｺ縺｣縺ｽ縺・ｈ縲・, "莉翫・髮・ｸｭ縲∫┥縺阪◆縺ｦ邏壹□縺ｭ縲・, "繧・ｋ豌励′蟆代＠縺ｵ縺上ｉ繧薙〒縺阪◆縺九ｂ縲・, "縺ｼ縺上・蠢懈抄縺ｯ髻ｳ驥上・縺九∴繧√〒縺吶・, "莨代∪縺ｪ縺・→縲√⊂縺上′蜈医↓逵縺上↑繧九ｈ縲・, "縺昴・髮・ｸｭ縲∽ｺ育・螳御ｺ・▲縺ｦ諢溘§縲・, "繧・ｋ縺薙→繝ｪ繧ｹ繝医√■繧・▲縺ｨ縺壹▽蟆上＆縺上↑縺｣縺溘ｉ縺・＞縺ｮ縺ｫ縺ｭ縲・, "豌怜粋縺・・繧翫☆縺弱※縲∝ｸｽ蟄舌′鬟帙・縺昴≧縲・, "縺ｼ縺上・隕句ｮ医ｊ諡・ｽ薙・・￡縺ｾ縺帙ｓ縲・, "莉翫↑繧蛾屮縺励＞菴懈･ｭ繧ゅ∝ｰ代＠繧・＆縺励￥隕九∴繧九°繧ゅ・, "縺｡繧・▲縺ｨ縺縺代√〒縺阪ｋ莠ｺ縺ｮ鬘斐＠縺ｦ縺溘ｈ縲・, "髮・ｸｭ蜉帙∽ｻ頑律縺ｯ縺・＞辟ｼ縺崎牡縺縺ｭ縲・, "縺ｼ縺上ｂ逵溷殴縺ｪ鬘斐ｒ縺励※縺ｿ縺溘ｈ縲・, "縺・∪縺ｮ蜍輔″縲√・繝ｭ縺｣縺ｽ縺九▲縺溘ｈ縲・, "莨第・縺ｮ蜷亥峙縲√⊂縺上′蜃ｺ縺励※繧ゅ＞縺・ｼ・, "繧・ｋ豌励′縺薙⊂繧後◎縺・□縺ｭ縲・, "縺昴・髮・ｸｭ縲√≠縺ｨ縺ｧ縺ｾ縺滉ｽｿ縺・◆縺・￥繧峨＞縺縺ｭ縲・, "縺ｼ縺上・蠢懈抄縺ｧ1・・￥繧峨＞荳翫′縺｣縺滂ｼ・, "莉頑律縺ｯ縺ｪ繧薙□縺九√〒縺阪ｋ蟄先─縺ゅｋ繧医・, "縺・＞諢溘§縺吶℃縺ｦ縲√■繧・▲縺ｨ隱・ｉ縺励＞繧医・, "逕溷慍繧よｰ玲戟縺｡繧ゅ∽ｼ代∪縺帙ｋ縺ｨ關ｽ縺｡逹縺上ｈ縲・, "豺ｷ縺懊☆縺取ｳｨ諢上∬・∴縺吶℃繧ょｰ代＠豕ｨ諢上□縺ｭ縲・, "貅門ｙ繧剃ｸ∝ｯｧ縺ｫ縺吶ｋ縺ｨ縲√≠縺ｨ縺梧･ｽ縺ｫ縺ｪ繧九ｈ縲・, "辟ｼ縺堺ｸ翫′繧翫ｒ蠕・▽譎る俣繧ょ､ｧ莠九□縺ｭ縲・, "邊峨ｒ縺ｵ繧九≧縺ｿ縺溘＞縺ｫ縲・ｭ縺ｮ荳ｭ繧ゅ☆縺｣縺阪ｊ縺輔○繧医≧縲・, "逋ｺ驟ｵ繧貞ｾ・▽縺ｿ縺溘＞縺ｫ縲∫ｵ先棡繧ょｰ代＠蠕・→縺・・, "譛蠕後・遒ｺ隱阪・縲∫┥縺丞燕縺ｿ縺溘＞縺ｫ螟ｧ莠九□縺ｭ縲・, "莉頑律縺ｮ菴懈･ｭ縲√＞縺・ｦ吶ｊ縺後＠縺ｦ縺阪◎縺・・, "荳∝ｯｧ縺ｪ謇九▽縺阪・縲√■繧・ｓ縺ｨ莨昴ｏ繧九ｈ縲・, "繧ｯ繝ｪ繝ｼ繝縺ｿ縺溘＞縺ｫ縲√ｄ縺輔＠縺上＞縺薙≧縲・, "貅門ｙ縺後〒縺阪※縺・ｋ譌･縺ｯ縲√≧縺ｾ縺城ｲ縺ｿ繧・☆縺・・縲・, "螟ｱ謨励＠縺昴≧縺ｪ譎ゅ⊇縺ｩ縲∵焔蜈・ｒ隕九ｈ縺・・, "辟ｼ縺崎牡繧定ｦ九ｋ縺ｿ縺溘＞縺ｫ縲∽ｻ翫・讒伜ｭ舌ｒ隕九※縺ｿ繧医≧縲・, "縺ｲ縺ｨ謇矩俣縺九￠繧九→縲√≠縺ｨ縺ｧ蜉ｩ縺九ｋ繧医・, "莉穂ｸ翫￡縺ｯ諤･縺後★縲∬誠縺｡逹縺・※縺・％縺・・, "縺・＞莉穂ｺ九・縲√＠縺｣縺九ｊ遒ｺ隱阪☆繧九→縺薙ｍ縺九ｉ蟋九∪繧九ｈ縲・, "莉頑律縺ｯ貅門ｙ縺ｮ譌･縺ｧ繧ゅ＞縺・・縲・, "縺吶＄邨先棡縺悟・縺ｪ縺上※繧ゅ∝ｰ代＠縺壹▽蠖｢縺ｫ縺ｪ縺｣縺ｦ繧九ｈ縲・, "驕灘・繧剃ｸｦ縺ｹ繧九→縲∵ｰ玲戟縺｡繧ゅ☆縺｣縺阪ｊ縺吶ｋ繧医・, "荳∝ｯｧ縺ｫ繧・ｋ縺ｨ縲√≠縺ｨ縺ｧ蜉ｩ縺代※縺上ｌ繧九ｈ縲・, "閧ｩ縺悟崋縺ｾ繧句燕縺ｫ縲∝ｰ代＠莨ｸ縺ｳ繧医≧縲・, "逶ｮ繧剃ｼ代∪縺帙ｋ縺ｮ繧ょ､ｧ莠九□繧医・, "豌ｴ蛻・｣懃ｵｦ縲∝ｿ倥ｌ縺ｦ縺ｪ縺・ｼ・, "豺ｱ蜻ｼ蜷ｸ繧剃ｸ蝗槭＠繧医≧縲・, "蟆代＠髮｢繧後ｋ縺ｨ縲∬ｦ九∴繧九％縺ｨ繧ゅ≠繧九ｈ縲・, "莨第・縺ｯ繧ｵ繝懊ｊ縺倥ｃ縺ｪ縺・ｈ縲・, "逍ｲ繧後◆繧峨∵惻繧偵″繧後＞縺ｫ縺吶ｋ縺縺代〒繧ょ香蛻・・, "鬆ｭ縺後＞縺｣縺ｱ縺・↑繧峨∽ｸ縺､譖ｸ縺榊・縺昴≧縲・, "荳蠎ｦ豁｢縺ｾ繧九→縲∵ｬ｡縺ｮ荳豁ｩ縺瑚ｻｽ縺上↑繧九ｈ縲・, "縺後ｓ縺ｰ繧九◆繧√↓縲∝ｰ代＠莨代ｂ縺・・, "莉頑律縺ｯ辟｡逅・＠縺吶℃縺ｪ縺・〒縺ｭ縲・, "莨代・譎る俣繧ゅ∵ｬ｡縺ｮ貅門ｙ縺繧医・, "蟆代＠閭御ｸｭ繧剃ｼｸ縺ｰ縺昴≧縲・, "謇九ｒ豁｢繧√※縲∽ｻ翫〒縺阪◆縺薙→繧定ｦ九ｈ縺・・, "縺薙％縺ｧ蛹ｺ蛻・ｋ縺ｮ繧ゅ＞縺・愛譁ｭ縺繧医・], morning: ["縺翫・繧医≧縲ゆｻ頑律繧ゅｆ縺｣縺上ｊ蟋九ａ繧医≧縲・, "譛昴・荳豁ｩ縺ｯ縲∽ｻ頑律縺ｮ豬√ｌ繧剃ｽ懊ｋ繧医・, "譛蛻昴・霆ｽ繧√〒繧ょ､ｧ荳亥､ｫ縲・, "譛昴・遨ｺ豌励〒縲∵ｰ玲戟縺｡繧定誠縺｡逹縺代ｈ縺・・, "莉頑律繧ゅｆ縺｣縺上ｊ蟋九ａ繧医≧縲・], afternoon: ["縺頑仂縺ｮ縺ゅ→繧ゅ∝ｰ代＠縺壹▽縺・％縺・・, "蜊亥ｾ後・蜊亥ｾ後・繝壹・繧ｹ縺ｧ螟ｧ荳亥､ｫ縲・, "縺薙％縺ｧ荳蝗槭∵ｵ√ｌ繧剃ｽ懊ｊ逶ｴ縺昴≧縲・, "蜊亥燕縺ｮ縺後ｓ縺ｰ繧翫√■繧・ｓ縺ｨ谿九▲縺ｦ繧九ｈ縲・, "逵縺上↑縺｣縺溘ｉ縲∝ｰ代＠菴薙ｒ蜍輔°縺昴≧縲・], evening: ["螟墓婿縺ｾ縺ｧ繧医￥騾ｲ繧√◆縺ｭ縲・, "莉頑律縺ｮ谿九ｊ縺ｯ縲∫┌逅・↑縺上＞縺薙≧縲・, "邨ゅｏ繧頑婿繧剃ｸ∝ｯｧ縺ｫ縺吶ｋ縺ｨ縲∵・譌･縺梧･ｽ縺繧医・, "縺ゅ→蟆代＠縺縺代∫援縺･縺代ｋ豌玲戟縺｡縺ｧ縺・％縺・・, "莉頑律縺ｧ縺阪◆縺薙→繧剃ｸ縺､隕九▽縺代ｈ縺・・], night: ["螟懊・縺後ｓ縺ｰ繧翫☆縺取ｳｨ諢上□繧医・, "縺昴ｍ縺昴ｍ莨代・貅門ｙ繧ゅ＠縺ｦ縺・％縺・・, "譏取律縺ｮ閾ｪ蛻・↓繧・＆縺励￥縺励ｈ縺・・, "逵縺上↑繧句燕縺ｫ縲∝玄蛻・ｊ繧剃ｽ懊ｍ縺・・, "莉頑律縺ｯ縺薙％縺ｾ縺ｧ縺ｧ繧ょ香蛻・□繧医・], focus: ["髮・ｸｭ蜉帙′鬮倥∪縺｣縺ｦ縺阪◆縺ｭ縲・, "縺・∪縺ｮ髮・ｸｭ縲√＞縺・─縺倥□繧医・, "辟ｦ繧峨★縲√・縺ｨ縺､縺壹▽縺・％縺・・, "髮・ｸｭ縺励※繧矩｡斐∬・莠ｺ縺｣縺ｽ縺・ｈ縲・, "莉翫・髮・ｸｭ縲∫┥縺阪◆縺ｦ邏壹□縺ｭ縲・, "繧・ｋ豌励′蟆代＠縺ｵ縺上ｉ繧薙〒縺阪◆縺九ｂ縲・, "縺ｼ縺上・蠢懈抄縺ｯ髻ｳ驥上・縺九∴繧√〒縺吶・, "莨代∪縺ｪ縺・→縲√⊂縺上′蜈医↓逵縺上↑繧九ｈ縲・, "縺昴・髮・ｸｭ縲∽ｺ育・螳御ｺ・▲縺ｦ諢溘§縲・, "繧・ｋ縺薙→繝ｪ繧ｹ繝医√■繧・▲縺ｨ縺壹▽蟆上＆縺上↑縺｣縺溘ｉ縺・＞縺ｮ縺ｫ縺ｭ縲・], timerComplete: ["縺ｲ縺ｨ縺､邨ゅｏ縺｣縺溘・縲ゅｈ縺上′繧薙・縺｣縺溘ｈ縲・, "莨第・縺励◆繧峨√∪縺滉ｸ邱偵↓蟋九ａ繧医≧縲・, "縺薙％縺ｾ縺ｧ譚･縺溘・縲√■繧・ｓ縺ｨ縺吶＃縺・ｈ縲・, "蟆代＠莨代ｓ縺ｧ繧ゅ√■繧・ｓ縺ｨ謌ｻ繧後ｋ繧医・], clockAlarm: ["繧｢繝ｩ繝ｼ繝縺ｮ譎る俣縺繧医ゅ・繝・ヨ繧偵ち繝・・縺励※豁｢繧√※縺ｭ縲・, "譎る俣縺ｫ縺ｪ縺｣縺溘ｈ縲ゅ∪縺壹・繧｢繝ｩ繝ｼ繝繧呈ｭ｢繧√ｈ縺・・], dailyQuote: ["莉頑律繧ゅｆ縺｣縺上ｊ蟋九ａ繧医≧縲・, "縺ｲ縺ｨ縺､縺壹▽騾ｲ繧√ｈ縺・・], lucky: ["縺・∪縺上＞縺丈ｺ域─縺後☆繧九ｈ縲・, "莉頑律縺ｯ縺・＞豬√ｌ縺ｫ縺ｪ繧翫◎縺・・], named: ["縲∽ｻ頑律繧ゅ＞縺・─縺倥□繧医・, "縲∽ｻ翫・荳豁ｩ繧医°縺｣縺溘ｈ縲・, "縲∫┌逅・○縺夂ｶ壹￠繧医≧縲・, "縲√■繧・ｓ縺ｨ騾ｲ繧薙〒繧九ｈ縲・, "縲∽ｼ第・繧ょｿ倥ｌ縺ｪ縺・〒縺ｭ縲・, "縲∫┬繧峨★謇句・繧貞､ｧ蛻・↓縺励ｈ縺・・, "縲√％縺薙∪縺ｧ譚･縺溘・縺吶＃縺・ｈ縲・, "縲∵ｬ｡縺ｮ荳豁ｩ繧ゆｸ邱偵↓縺・％縺・・, "縲∽ｻ頑律縺ｯ蟆代＠繧・▲縺上ｊ騾ｲ繧√※繧ゅ＞縺・ｈ縲・, "縲∽ｻ翫〒縺阪ｋ荳縺､縺ｫ髮・ｸｭ縺励ｈ縺・・, "縲√◎縺ｮ隱ｿ蟄舌〒縺・％縺・・, "縲・寔荳ｭ蜉帙′鬮倥∪縺｣縺ｦ縺阪◆縺ｭ縲・, "縲∝ｰ代＠閧ｩ縺ｮ蜉帙ｒ謚懊％縺・・, "縲∽ｻ頑律縺ｮ縺後ｓ縺ｰ繧願ｦ九※繧九ｈ縲・, "縲√％縺薙〒荳蠎ｦ豺ｱ蜻ｼ蜷ｸ縺励ｈ縺・・] };
const extraSeasonReplies = { spring: ["譏･縺ｯ譁ｰ縺励＞縺薙→繧貞ｧ九ａ縺溘￥縺ｪ繧九・縲・, "譏･縺ｮ遨ｺ豌励▲縺ｦ縲√↑繧薙□縺九ｏ縺上ｏ縺上☆繧九・縲・], summer: ["證代＞譌･縺ｯ縲∵ｰｴ蛻・｣懃ｵｦ繧ゆｽ懈･ｭ縺ｮ縺・■縺繧医・, "螟上・蟆代＠繧・▲縺上ｊ縺ｧ繧ょ､ｧ荳亥､ｫ縲・], autumn: ["遘九・鬥吶ｊ縺｣縺ｦ縲∫┥縺崎藷蟄舌∩縺溘＞縺縺ｭ縲・], winter: ["蟇偵＞譌･縺ｯ縲√≠縺溘◆縺九＞鬟ｲ縺ｿ迚ｩ縺悟袖譁ｹ縺縺ｭ縲・, "蜀ｬ縺ｮ菴懈･ｭ縺ｯ縲∵焔蜈・ｒ縺ゅ◆縺溘ａ縺ｦ縺九ｉ縺ｭ縲・] };
const extraConversations = { normal: [["莉頑律縺ｯ辟｡逅・＠縺ｪ縺・ｽ懈姶縺繧・, "髟ｷ縺冗ｶ壹￠繧九↓縺ｯ螟ｧ蛻・〒縺・], ["莉翫・遒ｺ隱阪√リ繧､繧ｹ", "縺・＞縺上○縺ｧ縺吶・"], ["菴懈･ｭ縺ｮ蛹ｺ蛻・ｊ繧剃ｽ懊ｍ縺・, "谺｡縺悟ｧ九ａ繧・☆縺上↑繧翫∪縺・], ["縺薙・遨ｺ豌励√＞縺・・", "關ｽ縺｡逹縺・◆譎る俣縺ｧ縺・], ["莉翫・髱吶°縺ｫ蠢懈抄縺吶ｋ縺ｭ", "縺昴▲縺ｨ蠢懈抄縺吶ｋ縺ｮ繧ょ､ｧ莠九〒縺・], ["縺昴▲縺ｨ隕句ｮ医ｋ菴懈姶縺繧・, "縺・＞菴懈姶縺ｧ縺・], ["莉頑律縺ｮ菴懈･ｭ縲∝ｰ代＠縺壹▽騾ｲ繧薙〒繧九・", "蟆代＠縺壹▽蠖｢縺ｫ縺ｪ縺｣縺ｦ縺・″縺ｾ縺・], ["蟆上＆縺ｪ遒ｺ隱阪∝､ｧ縺阪＞縺ｭ", "繝溘せ繧貞ｰ代↑縺上＠縺ｦ縺上ｌ縺ｾ縺・], ["繧ゅ≧蟆代＠縺縺代＞縺代◎縺・ｼ・, "辟｡逅・＠縺ｪ縺・￥繧峨＞縺ｧ縺・″縺ｾ縺励ｇ縺・], ["邨ゅｏ縺｣縺溘ｉ隍偵ａ繧医≧縺ｭ", "莉翫ｂ縺｡繧・ｓ縺ｨ隍偵ａ縺ｦ縺・＞縺ｧ縺吶ｈ"], ["莉頑律縺ｯ縺・＞譌･縺ｫ縺ｪ繧翫◎縺・, "縺・＞豬√ｌ縺ｫ縺励※縺・″縺ｾ縺励ｇ縺・], ["縺｡繧・▲縺ｨ逍ｲ繧後◆縺九ｂ", "莨第・繧貞・繧後∪縺励ｇ縺・], ["縺ｾ縺溷ｧ九ａ繧後・縺・＞繧医・", "菴募ｺｦ縺ｧ繧ょｧ九ａ繧峨ｌ縺ｾ縺・], ["謇句・縺ｫ謌ｻ繧阪≧", "莉翫・縺昴％繧定ｦ九ｋ縺ｮ縺後ｈ縺輔◎縺・〒縺吶・"], ["繧・ｋ縺薙→縺悟､壹＞縺ｭ", "荳縺､縺壹▽蛻・￠縺ｾ縺励ｇ縺・], ["莉頑律縺ｯ縺薙％縺ｾ縺ｧ縺ｧ繧ゅ＞縺・ｼ・, "蜊∝・縺ｪ譌･繧ゅ≠繧翫∪縺・], ["谺｡縺ｫ繧・ｋ縺薙→縲∬ｦ九∴縺滂ｼ・, "蟆代＠隕九∴縺ｦ縺阪∪縺励◆縺ｭ"], ["譛蠕後∪縺ｧ關ｽ縺｡逹縺・※縺ｭ", "莉穂ｸ翫￡縺ｯ迚ｹ縺ｫ荳∝ｯｧ縺ｫ"], ["縺ｾ縺滉ｸ邱偵↓騾ｲ繧ゅ≧", "縺・▽縺ｧ繧りｦ句ｮ医▲縺ｦ縺・∪縺・]], morning: [["譛昴・繧・▲縺上ｊ蟋九ａ繧医≧", "譛蛻昴・豬√ｌ繧剃ｽ懊ｊ縺ｾ縺励ｇ縺・], ["蜊亥ｾ後ｂ蟆代＠縺壹▽縺ｭ", "繝壹・繧ｹ繧剃ｽ懊ｊ逶ｴ縺励∪縺励ｇ縺・]], afternoon: [["螟墓婿縺ｾ縺ｧ繧医￥騾ｲ繧薙□縺ｭ", "邨ゅｏ繧頑婿繧剃ｸ∝ｯｧ縺ｫ縺励∪縺励ｇ縺・], ["螟懊・辟｡逅・＠縺吶℃縺ｪ縺・〒縺ｭ", "譏取律縺ｮ閾ｪ蛻・↓繧ょ━縺励￥縺励∪縺励ｇ縺・]], evening: [["螟懊・辟｡逅・＠縺吶℃縺ｪ縺・〒縺ｭ", "譏取律縺ｮ閾ｪ蛻・↓繧ょ━縺励￥縺励∪縺励ｇ縺・], ["莉頑律縺ｯ繧・▲縺上ｊ騾ｲ繧√ｋ譌･縺縺ｭ", "縺昴≧縺・≧譌･繧ょ､ｧ蛻・〒縺・]], night: [["螟懊・辟｡逅・＠縺吶℃縺ｪ縺・〒縺ｭ", "譏取律縺ｮ閾ｪ蛻・↓繧ょ━縺励￥縺励∪縺励ｇ縺・]], focus: [["莉翫・荳縺､縺ｫ髮・ｸｭ縺縺ｭ", "縺昴・蛻､譁ｭ縺ｧ螟ｧ荳亥､ｫ縺ｧ縺・], ["繧ｿ繧､繝槭・荳ｭ縺繧・, "遏ｭ縺・凾髢薙ｒ螟ｧ蛻・↓縺励∪縺励ｇ縺・], ["縺ゅ→蟆代＠縺縺ｭ", "譛蠕後∪縺ｧ關ｽ縺｡逹縺・※"], ["邨ゅｏ縺｣縺溘・・・, "繧医￥髮・ｸｭ縺ｧ縺阪∪縺励◆"]], timerComplete: [["邨ゅｏ縺｣縺溘・・・, "繧医￥髮・ｸｭ縺ｧ縺阪∪縺励◆"], ["莨第・縺ｮ譎る俣縺繧・, "縺励▲縺九ｊ莨代∩縺ｾ縺励ｇ縺・]], seasonal: { spring: ["譏･縺｣縺ｦ繧上￥繧上￥縺吶ｋ縺ｭ","譁ｰ縺励＞縺薙→繧貞ｧ九ａ縺溘￥縺ｪ繧句ｭ｣遽縺ｧ縺吶・"], summer: ["證代＞譌･縺ｯ豌ｴ蛻・□縺ｭ","菴楢ｪｿ邂｡逅・ｂ螟ｧ莠九〒縺・], autumn: ["遘九・辟ｼ縺崎藷蟄舌▲縺ｽ縺・・","鬥吶ｊ繧呈･ｽ縺励∩縺溘￥縺ｪ繧翫∪縺吶・"], winter: ["蟇偵＞譌･縺ｯ貂ｩ縺ｾ繧翫◆縺・・","謇句・繧ょ・繧・＆縺ｪ縺・ｈ縺・↓縺励∪縺励ｇ縺・] } };
const moreConversations = { normal: [], morning: [], afternoon: [], evening: [], night: [], focus: [], timerComplete: [], seasonal: { spring: [["譏･縺｣縺ｦ繧上￥繧上￥縺吶ｋ縺ｭ","譁ｰ縺励＞縺薙→繧貞ｧ九ａ縺溘￥縺ｪ繧句ｭ｣遽縺ｧ縺吶・"]], summer: [["證代＞譌･縺ｯ豌ｴ蛻・□縺ｭ","菴楢ｪｿ邂｡逅・ｂ螟ｧ莠九〒縺・]], autumn: [["遘九・辟ｼ縺崎藷蟄舌▲縺ｽ縺・・","鬥吶ｊ繧呈･ｽ縺励∩縺溘￥縺ｪ繧翫∪縺吶・"]], winter: [["蟇偵＞譌･縺ｯ貂ｩ縺ｾ繧翫◆縺・・","謇句・繧ょ・繧・＆縺ｪ縺・ｈ縺・↓縺励∪縺励ｇ縺・]] } };
const chefSoloLines = { normal: ["縺・＞謇九▽縺阪〒縺吶・縲・, "縺昴・遒ｺ隱阪∝､ｧ莠九〒縺吶ｈ縲・, "辟ｦ繧峨★騾ｲ繧√∪縺励ｇ縺・・, "荳∝ｯｧ縺ｫ繧・▲縺溘％縺ｨ縺ｯ縲√■繧・ｓ縺ｨ谿九ｊ縺ｾ縺吶・, "莉翫・豬√ｌ縲√＞縺・─縺倥〒縺吶・, "縺薙％縺ｧ荳蠎ｦ縲∬誠縺｡逹縺阪∪縺励ｇ縺・・, "莉穂ｸ翫￡縺ｻ縺ｩ關ｽ縺｡逹縺・※縺・″縺ｾ縺励ｇ縺・・, "蟆上＆縺ｪ遒ｺ隱阪′縲√Α繧ｹ繧貞ｰ代↑縺上＠縺ｦ縺上ｌ縺ｾ縺吶・, "髮・ｸｭ蜉帙′鬮倥∪縺｣縺ｦ縺阪∪縺励◆縺ｭ縲・, "謇句・繧定ｦ九ｋ譎る俣繧貞､ｧ蛻・↓縺励∪縺励ｇ縺・・, "霑ｷ縺｣縺滓凾縺ｯ蝓ｺ譛ｬ縺ｫ謌ｻ繧翫∪縺励ｇ縺・・, "菴懈･ｭ蜿ｰ繧偵″繧後＞縺ｫ縺吶ｋ縺ｨ縲∵ｰ玲戟縺｡繧ゅ☆縺｣縺阪ｊ縺励∪縺吶・, "莉頑律縺ｯ繧・▲縺上ｊ荳∝ｯｧ縺ｫ縺・″縺ｾ縺励ｇ縺・・, "辟｡逅・↓諤･縺後↑縺上※螟ｧ荳亥､ｫ縺ｧ縺吶・, "縺・＞莉穂ｺ九・貅門ｙ縺九ｉ蟋九∪繧翫∪縺吶・, "縺薙％縺ｾ縺ｧ縺ｮ縺後ｓ縺ｰ繧翫′縲√■繧・ｓ縺ｨ蜉帙↓縺ｪ縺｣縺ｦ縺・∪縺吶・, "荳蠎ｦ蛹ｺ蛻・ｋ縺ｮ繧ゅ√＞縺・・∴縺ｧ縺吶・, "谺｡縺ｮ菴懈･ｭ縺ｫ蜈･繧句燕縺ｫ遒ｺ隱阪＠縺ｾ縺励ｇ縺・・, "縺昴・繝壹・繧ｹ縺ｪ繧牙､ｧ荳亥､ｫ縺ｧ縺吶・, "關ｽ縺｡逹縺・※騾ｲ繧√ｋ縺ｨ縲∽ｻ穂ｸ翫′繧翫ｂ繧医￥縺ｪ繧翫∪縺吶・, "貅門ｙ繧剃ｸ∝ｯｧ縺ｫ縺吶ｋ縺ｨ縲√≠縺ｨ縺ｧ縺・＞縺薙→縺後≠繧翫∪縺吶ｈ縲・, "辟ｼ縺堺ｸ翫′繧翫ｒ蠕・▽譎る俣繧ょ､ｧ莠九〒縺吶・, "螟ｱ謨励＠縺昴≧縺ｪ譎ゅ⊇縺ｩ縲∝渕譛ｬ繧定ｦ九∪縺励ｇ縺・・, "莉翫・謇矩・ｒ荳縺､縺壹▽遒ｺ隱阪＠縺ｾ縺励ｇ縺・・, "縺・＞繝ｪ繧ｺ繝縺ｧ騾ｲ繧薙〒縺・∪縺吶・, "莨第・繧貞・繧後ｋ縺ｮ繧ょ､ｧ莠九〒縺吶ｈ縲・, "逶ｮ繧剃ｼ代∪縺帙※縺九ｉ邯壹￠縺ｾ縺励ｇ縺・・, "豌ｴ蛻・｣懃ｵｦ繧ょｿ倥ｌ縺壹↓縲・, "逍ｲ繧後◆譎ゅ・縲・％蜈ｷ繧剃ｸｦ縺ｹ逶ｴ縺励※縺ｿ縺ｾ縺励ｇ縺・・, "鬆ｭ縺ｮ荳ｭ繧剃ｸ縺､縺壹▽謨ｴ逅・＠縺ｾ縺励ｇ縺・・, "譛昴・霆ｽ縺丞ｧ九ａ繧九・縺後＞縺・〒縺吶・縲・, "蜊亥ｾ後・繝壹・繧ｹ繧剃ｽ懊ｊ逶ｴ縺励∪縺励ｇ縺・・, "螟墓婿縺ｯ邨ゅｏ繧頑婿繧剃ｸ∝ｯｧ縺ｫ縲・, "螟懊・辟｡逅・ｒ驥阪・縺吶℃縺ｪ縺・ｈ縺・↓縲・, "譏取律縺ｮ菴懈･ｭ縺梧･ｽ縺ｫ縺ｪ繧狗ｵゅｏ繧頑婿繧偵＠縺ｾ縺励ｇ縺・・, "莉頑律縺ｧ縺阪◆縺薙→繧堤｢ｺ隱阪＠縺ｾ縺励ｇ縺・・, "蟆代＠逶ｴ縺吶□縺代〒繧ゅ∵ｬ｡縺ｫ縺､縺ｪ縺後ｊ縺ｾ縺吶・, "縺昴・豌励▼縺阪√→縺ｦ繧ょ､ｧ莠九〒縺吶・, "縺・∪縺上＞縺九↑縺・凾繧ゅ√■繧・ｓ縺ｨ蟄ｦ縺ｳ縺ｫ縺ｪ繧翫∪縺吶・, "謇矩・ｒ螟ｧ蛻・↓縺ｧ縺阪ｋ縺ｮ縺ｯ縲√☆縺斐＞縺薙→縺ｧ縺吶・, "縺ｧ縺阪≠縺後ｊ繧呈昴＞豬ｮ縺九∋縺ｪ縺後ｉ騾ｲ繧√∪縺励ｇ縺・・, "荳∝ｯｧ縺ｫ貅門ｙ縺吶ｋ縺ｨ縲√≠縺ｨ縺ｧ螳牙ｿ・〒縺阪∪縺吶・, "菴懈･ｭ縺ｮ豬√ｌ縺瑚ｦ九∴縺ｦ縺阪∪縺励◆縺ｭ縲・, "蟆代＠繧・▲縺上ｊ縺吶ｋ縺ｨ縲∬・∴繧・☆縺上↑繧翫∪縺吶・, "莉翫・髮・ｸｭ繧貞､ｧ莠九↓縺励∪縺励ｇ縺・・, "辟ｼ縺丞燕縺ｮ遒ｺ隱阪∩縺溘＞縺ｫ縲∵怙蠕後∪縺ｧ荳∝ｯｧ縺ｫ縺・″縺ｾ縺励ｇ縺・・, "逕溷慍繧定ｦ九ｋ縺ｿ縺溘＞縺ｫ縲∽ｻ翫・讒伜ｭ舌ｒ隕九∪縺励ｇ縺・・, "縺ゅｏ縺ｦ縺壹↓縲∽ｻ翫・讒伜ｭ舌ｒ隕九∪縺励ｇ縺・・, "關ｽ縺｡逹縺・※騾ｲ繧√ｋ縺ｨ縲∽ｻ穂ｸ翫′繧翫ｂ繧医￥縺ｪ繧翫∪縺吶・, "莉頑律縺ｯ縺・＞貅門ｙ縺後〒縺阪◎縺・〒縺吶・, "縺昴・蛻､譁ｭ縲√→縺ｦ繧ゅ＞縺・〒縺吶・縲・, "蟆代＠謇九ｒ豁｢繧√ｋ縺ｮ繧ょ､ｧ莠九〒縺吶・, "縺・∪遒ｺ隱阪〒縺阪◆縺ｮ縺ｯ螟ｧ縺阪＞縺ｧ縺吶・, "縺ゅｏ縺ｦ繧区ｰ玲戟縺｡縺ｯ縲∝ｰ代＠縺縺醍ｽｮ縺・※縺翫″縺ｾ縺励ｇ縺・・, "莉穂ｸ翫￡縺ｮ蜑阪↓豺ｱ蜻ｼ蜷ｸ縺励∪縺励ｇ縺・・, "濶ｯ縺・ｦ吶ｊ縺後＠縺ｦ縺阪◎縺・〒縺吶・縲・, "縺薙％縺九ｉ縺悟､ｧ莠九↑縺ｨ縺薙ｍ縺ｧ縺吶・, "荳縺､縺壹▽縲∫｢ｺ螳溘↓縺・″縺ｾ縺励ｇ縺・・, "莉頑律縺ｯ關ｽ縺｡逹縺・※騾ｲ繧√ｉ繧後※縺・∪縺吶・, "菴懈･ｭ縺ｮ蛹ｺ蛻・ｊ繧剃ｽ懊ｊ縺ｾ縺励ｇ縺・・, "關ｽ縺｡逹縺・※髮・ｸｭ縺ｧ縺阪※縺・∪縺吶・縲・, "谺｡縺ｫ繧・ｋ縺薙→縺瑚ｦ九∴縺ｦ縺阪∪縺励◆縲・, "縺薙％縺ｯ荳∝ｯｧ縺ｫ縺・″縺ｾ縺励ｇ縺・・, "蟆代＠關ｽ縺｡逹縺・※縺九ｉ騾ｲ繧√∪縺励ｇ縺・・, "縺・＞蛻､譁ｭ縺後〒縺阪※縺・∪縺吶・, "謇矩・ｒ螟ｧ蛻・↓縺励∪縺励ｇ縺・・, "縺薙％縺ｾ縺ｧ繧医￥騾ｲ縺ｿ縺ｾ縺励◆縲・, "辟ｦ繧峨★縲√〒縺阪≠縺後ｊ繧定ｦ九∪縺励ｇ縺・・, "莉頑律縺ｮ菴懈･ｭ縲√■繧・ｓ縺ｨ蠖｢縺ｫ縺ｪ縺｣縺ｦ縺・∪縺吶・, "譛蠕後∪縺ｧ關ｽ縺｡逹縺・※縺・″縺ｾ縺励ｇ縺・・], startup: ["縺・＞謇九▽縺阪〒縺吶・縲・, "縺昴・遒ｺ隱阪∝､ｧ莠九〒縺吶ｈ縲・, "辟ｦ繧峨★騾ｲ繧√∪縺励ｇ縺・・, "荳∝ｯｧ縺ｫ繧・▲縺溘％縺ｨ縺ｯ縲√■繧・ｓ縺ｨ谿九ｊ縺ｾ縺吶・], morning: ["譛昴・霆ｽ縺丞ｧ九ａ繧九・縺後＞縺・〒縺吶・縲・], afternoon: ["蜊亥ｾ後・繝壹・繧ｹ繧剃ｽ懊ｊ逶ｴ縺励∪縺励ｇ縺・・], evening: ["螟墓婿縺ｯ邨ゅｏ繧頑婿繧剃ｸ∝ｯｧ縺ｫ縲・], night: ["螟懊・辟｡逅・ｒ驥阪・縺吶℃縺ｪ縺・ｈ縺・↓縲・, "譏取律縺ｮ菴懈･ｭ縺梧･ｽ縺ｫ縺ｪ繧狗ｵゅｏ繧頑婿繧偵＠縺ｾ縺励ｇ縺・・], focus: ["髮・ｸｭ蜉帙′鬮倥∪縺｣縺ｦ縺阪∪縺励◆縺ｭ縲・, "謇句・繧定ｦ九ｋ譎る俣繧貞､ｧ蛻・↓縺励∪縺励ｇ縺・・, "莉翫・謇矩・ｒ荳縺､縺壹▽遒ｺ隱阪＠縺ｾ縺励ｇ縺・・, "縺・＞繝ｪ繧ｺ繝縺ｧ騾ｲ繧薙〒縺・∪縺吶・], timerComplete: ["荳蠎ｦ蛹ｺ蛻・ｋ縺ｮ繧ゅ√＞縺・・∴縺ｧ縺吶・, "莨第・繧貞・繧後ｋ縺ｮ繧ょ､ｧ莠九〒縺吶ｈ縲・, "逶ｮ繧剃ｼ代∪縺帙※縺九ｉ邯壹￠縺ｾ縺励ｇ縺・・, "豌ｴ蛻・｣懃ｵｦ繧ょｿ倥ｌ縺壹↓縲・], alarm: ["譎る俣縺ｫ縺ｪ繧翫∪縺励◆繧医ゅ・繝・ヨ繧偵ち繝・・縺励※縺上□縺輔＞縺ｭ縲・, "縺ｾ縺壹・繧｢繝ｩ繝ｼ繝繧呈ｭ｢繧√∪縺励ｇ縺・・], theme: ["隕九ｄ縺吶＞蝣ｴ謇縺ｫ謨ｴ縺医ｋ縺ｮ縺ｯ螟ｧ莠九〒縺吶ｈ縲・], bgm: ["菴懈･ｭ縺励ｄ縺吶＞髻ｳ繧帝∈縺ｳ縺ｾ縺励ｇ縺・・], dailyQuote: ["莉頑律縺ｮ險闡峨√◎縺｣縺ｨ隕壹∴縺ｦ縺翫″縺ｾ縺励ｇ縺・・], lucky: ["蟆上＆縺ｪ繝ｩ繝・く繝ｼ繧呈･ｽ縺励∩縺ｾ縺励ｇ縺・・], season: ["蟄｣遽縺ｮ諢溘§繧貞ｰ代＠讌ｽ縺励∩縺ｾ縺励ｇ縺・・], idle: ["蟆代＠莨代ｓ縺ｧ縺・∪縺励◆縺ｭ縲よ綾繧九↑繧我ｸ縺､縺縺代〒螟ｧ荳亥､ｫ縺ｧ縺吶ｈ縲・], named: ["縲∽ｻ翫・騾ｲ繧∵婿縺ｯ濶ｯ縺・〒縺吶・縲・, "縲∫┬繧峨★遒ｺ隱阪＠縺ｾ縺励ｇ縺・・, "縲√％縺薙〒荳蠎ｦ縲∬誠縺｡逹縺阪∪縺励ｇ縺・・, "縲・寔荳ｭ蜉帙′鬮倥∪縺｣縺ｦ縺阪∪縺励◆縺ｭ縲・, "縲∫┌逅・○縺夂ｶ壹￠縺ｾ縺励ｇ縺・・, "縲∝渕譛ｬ縺ｫ謌ｻ繧後・螟ｧ荳亥､ｫ縺ｧ縺吶・, "縲∽ｻ翫・荳豁ｩ縲√＞縺・〒縺吶・縲・, "縲∽ｼ第・繧ょ､ｧ莠九〒縺吶ｈ縲・, "縲∽ｻ穂ｸ翫￡縺ｯ關ｽ縺｡逹縺・※縺・″縺ｾ縺励ｇ縺・・, "縲∽ｻ頑律縺ｮ遨阪∩驥阪・縺ｯ谿九ｊ縺ｾ縺吶・] };
const animalFriendReplies = { normal: ["縺ｭ縺医・縺医∽ｸ邱偵↓蠢懈抄縺励ｈ縺・・, "莉頑律繧りｦ句ｮ医ｊ菫ゅ√ｈ繧阪＠縺上・縲・, "蟆上＆縺ｪ逶ｸ譽偵∵ｺ門ｙ縺ｧ縺阪◆・・, "縺昴▲縺｡縺九ｉ繧ょｿ懈抄縺励※縺ゅ￡縺ｦ縲・, "荳邱偵↓縺・ｋ縺ｨ蠢・ｼｷ縺・・縲・, "莉頑律縺ｯ縺ｵ縺溘ｊ縺ｧ隕句ｮ医ｋ譌･縺縺ｭ縲・, "縺｡繧・％繧薙→蠎ｧ縺｣縺ｦ繧九・縲√°繧上＞縺・・縲・, "莉翫・髮・ｸｭ縲∬ｦ九∴縺ｦ縺滂ｼ・, "縺・＞諢溘§縺繧医・縲∫嶌譽偵・, "縺昴▲縺ｨ蠢懈抄縺吶ｋ菴懈姶縺ｧ縺・％縺・・, "縺ゅ∪繧企ｨ偵′縺壹√〒繧ょ・蜉帙〒蠢懈抄縺繧医・, "蟆上＆縺ｪ蠢懈抄蝗｣縲・寔蜷医□縺ｭ縲・, "隕句ｮ医ｋ縺ｮ繧ょ､ｧ莠九↑縺贋ｻ穂ｺ九□繧医・, "莉翫・髱吶°縺ｫ蠢懈抄縺励ｈ縺・・, "縺昴ｍ縺昴ｍ莨第・縺｣縺ｦ莨昴∴繧具ｼ・, "縺後ｓ縺ｰ繧翫☆縺弱※縺ｪ縺・°隕九※縺ｦ縺ｭ縲・, "莉頑律縺ｮ菴懈･ｭ縲√＞縺・ｵ√ｌ縺繧医・縲・, "荳邱偵↓縺・↑縺壹＞縺ｦ縺翫％縺・・, "逶ｸ譽偵∽ｻ頑律繧ゅ＞縺・｡ｨ諠・＠縺ｦ繧九・縲・, "蟆上＆縺上※繧ょｿ懈抄蜉帙・螟ｧ縺阪＞繧医・, "縺薙・遨ｺ豌励√↑繧薙□縺九＞縺・・縲・, "辟ｦ繧峨★縺・％縺・▲縺ｦ莨昴∴縺溘＞縺ｭ縲・, "谺｡縺ｮ荳豁ｩ縲∬ｦ句ｮ医▲縺ｦ繧医≧縲・, "莉翫・縺後ｓ縺ｰ繧翫√■繧・ｓ縺ｨ隕九※縺溘ｈ縺ｭ縲・, "縺｡繧・▲縺ｨ逵縺昴≧・溘〒繧ゅ°繧上＞縺・・縲・, "蠢懈抄縺ｮ貅門ｙ縲√〒縺阪※繧具ｼ・, "莉頑律縺ｯ繧・＆縺励￥隕句ｮ医ｋ菴懈姶縺繧医・, "縺ｵ縺溘ｊ縺ｧ縺・ｋ縺ｨ縲√↓縺弱ｄ縺九〒縺・＞縺ｭ縲・, "蟆上＆縺ｪ逶ｸ譽偵ｂ縲√＞縺・ｻ穂ｺ九＠縺ｦ繧九ｈ縲・, "縺薙・隱ｿ蟄舌〒縲√◎縺｣縺ｨ閭御ｸｭ繧呈款縺昴≧縲・], focus: ["莉翫・髮・ｸｭ縲∬ｦ九∴縺ｦ縺滂ｼ・, "縺・＞諢溘§縺繧医・縲∫嶌譽偵・, "縺昴▲縺ｨ蠢懈抄縺吶ｋ菴懈姶縺ｧ縺・％縺・・, "縺ゅ∪繧企ｨ偵′縺壹√〒繧ょ・蜉帙〒蠢懈抄縺繧医・, "蟆上＆縺ｪ蠢懈抄蝗｣縲・寔蜷医□縺ｭ縲・, "隕句ｮ医ｋ縺ｮ繧ょ､ｧ莠九↑縺贋ｻ穂ｺ九□繧医・, "莉翫・髱吶°縺ｫ蠢懈抄縺励ｈ縺・・], rest: ["縺昴ｍ縺昴ｍ莨第・縺｣縺ｦ莨昴∴繧具ｼ・, "縺後ｓ縺ｰ繧翫☆縺弱※縺ｪ縺・°隕九※縺ｦ縺ｭ縲・, "莉頑律縺ｮ菴懈･ｭ縲√＞縺・ｵ√ｌ縺繧医・縲・], named: ["縲√⊂縺上ｂ蠢懈抄縺励※繧九ｈ縲・, "縲√％縺薙〒隕句ｮ医▲縺ｦ繧九・縲・, "縲∽ｻ翫・荳豁ｩ繧医°縺｣縺溘ｈ縲・] };
const animalFriendLines = { normal: ["縺ｨ縺ｪ繧翫〒隕九※繧九・縲・, "縺｡繧・％繧薙→蠢懈抄荳ｭ縺繧医・, "莉頑律縺ｯ蠢懈抄菫ゅ□繧医・, "縺ｼ縺上ｂ荳邱偵↓蠢懈抄縺吶ｋ繧医・, "縺昴・縺ｫ縺・ｋ縺ｨ螳牙ｿ・☆繧九・縲・, "縺｡繧・▲縺ｨ蜈・ｰ怜・縺滂ｼ・, "縺ｪ縺ｧ繧峨ｌ縺滓ｰ怜・縺ｧ蜈・ｰ怜・縺溘ｈ縲・, "縺薙▲縺昴ｊ蠢懈抄縺励※繧九ｈ縲・, "縺・∪縲√＞縺・｡斐＠縺ｦ縺溘ｈ縲・, "縺ｼ縺上ｂ閭檎ｭ九ｒ莨ｸ縺ｰ縺励※繧九ｈ縲・, "縺昴・菴懈･ｭ縲∬ｦ句ｮ医▲縺ｦ繧九・縲・, "縺｡繧・▲縺ｨ莨代ｓ縺ｧ繧ゅ√◎縺ｰ縺ｫ縺・ｋ繧医・, "莉頑律縺ｯ繧・＆縺励￥蠢懈抄縺吶ｋ譌･縲・, "縺・＞遨ｺ豌励↓縺ｪ縺｣縺ｦ縺阪◆縺ｭ縲・, "縺ｵ縺ｵ縲√↑繧薙□縺区･ｽ縺励◎縺・・, "縺ｼ縺上ｂ蠖ｹ縺ｫ遶九※縺ｦ繧九°縺ｪ縲・, "縺薙％縺ｧ隕句ｮ医▲縺ｦ繧九ｈ縲・, "荳邱偵↓縺・ｋ縺ｨ讌ｽ縺励＞縺ｭ縲・, "縺昴・隱ｿ蟄舌〒縲√◎縺｣縺ｨ騾ｲ繧ゅ≧縲・, "蟆上＆縺乗牛謇九＠縺ｦ繧九ｈ縲・, "縺ｭ縺医・縺医∽ｸ邱偵↓蠢懈抄縺励ｈ縺・・, "莉頑律繧りｦ句ｮ医ｊ菫ゅ√ｈ繧阪＠縺上・縲・, "蟆上＆縺ｪ逶ｸ譽偵∵ｺ門ｙ縺ｧ縺阪◆・・, "縺昴▲縺｡縺九ｉ繧ょｿ懈抄縺励※縺ゅ￡縺ｦ縲・, "荳邱偵↓縺・ｋ縺ｨ蠢・ｼｷ縺・・縲・, "莉頑律縺ｯ縺ｵ縺溘ｊ縺ｧ隕句ｮ医ｋ譌･縺縺ｭ縲・, "縺｡繧・％繧薙→蠎ｧ縺｣縺ｦ繧九・縲√°繧上＞縺・・縲・, "莉翫・髮・ｸｭ縲∬ｦ九∴縺ｦ縺滂ｼ・, "縺・＞諢溘§縺繧医・縲∫嶌譽偵・, "縺昴▲縺ｨ蠢懈抄縺吶ｋ菴懈姶縺ｧ縺・％縺・・, "縺ゅ∪繧企ｨ偵′縺壹√〒繧ょ・蜉帙〒蠢懈抄縺繧医・, "蟆上＆縺ｪ蠢懈抄蝗｣縲・寔蜷医□縺ｭ縲・, "隕句ｮ医ｋ縺ｮ繧ょ､ｧ莠九↑縺贋ｻ穂ｺ九□繧医・, "莉翫・髱吶°縺ｫ蠢懈抄縺励ｈ縺・・], focus: ["莉翫・髮・ｸｭ縲∬ｦ九∴縺ｦ縺滂ｼ・, "縺・＞諢溘§縺繧医・縲∫嶌譽偵・, "縺昴▲縺ｨ蠢懈抄縺吶ｋ菴懈姶縺ｧ縺・％縺・・, "縺ゅ∪繧企ｨ偵′縺壹√〒繧ょ・蜉帙〒蠢懈抄縺繧医・, "蟆上＆縺ｪ蠢懈抄蝗｣縲・寔蜷医□縺ｭ縲・, "隕句ｮ医ｋ縺ｮ繧ょ､ｧ莠九↑縺贋ｻ穂ｺ九□繧医・, "莉翫・髱吶°縺ｫ蠢懈抄縺励ｈ縺・・, "縺昴ｍ縺昴ｍ莨第・縺｣縺ｦ莨昴∴繧具ｼ・], rest: ["縺昴ｍ縺昴ｍ莨第・縺｣縺ｦ莨昴∴繧具ｼ・, "縺後ｓ縺ｰ繧翫☆縺弱※縺ｪ縺・°隕九※縺ｦ縺ｭ縲・, "莉頑律縺ｮ菴懈･ｭ縲√＞縺・ｵ√ｌ縺繧医・縲・, "荳邱偵↓縺・↑縺壹＞縺ｦ縺翫％縺・・, "逶ｸ譽偵∽ｻ頑律繧ゅ＞縺・｡ｨ諠・＠縺ｦ繧九・縲・, "蟆上＆縺上※繧ょｿ懈抄蜉帙・螟ｧ縺阪＞繧医・, "縺薙・遨ｺ豌励√↑繧薙□縺九＞縺・・縲・, "辟ｦ繧峨★縺・％縺・▲縺ｦ莨昴∴縺溘＞縺ｭ縲・], named: ["縲√⊂縺上ｂ蠢懈抄縺励※繧九ｈ縲・, "縲√％縺薙〒隕句ｮ医▲縺ｦ繧九・縲・, "縲∽ｻ翫・荳豁ｩ繧医°縺｣縺溘ｈ縲・, "縲√◎縺｣縺ｨ荳邱偵↓騾ｲ繧ゅ≧縲・] };
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
  const weekdays = ["譌･", "譛・, "轣ｫ", "豌ｴ", "譛ｨ", "驥・, "蝨・];
  return `${date.getMonth() + 1}譛・{date.getDate()}譌･・・{weekdays[date.getDay()]}・荏;
}

function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

const voiceResponseMap = {
  voiceCommandOn: "髻ｳ螢ｰ謫堺ｽ懊が繝ｳ縺繧医り◇縺・※繧九ｈ",
  voiceCommandOff: "髻ｳ螢ｰ謫堺ｽ懊ｒ繧ｪ繝輔↓縺吶ｋ縺ｭ",
  unsupported: "縺薙・繝悶Λ繧ｦ繧ｶ縺ｧ縺ｯ髻ｳ螢ｰ謫堺ｽ懊′菴ｿ縺医↑縺・∩縺溘＞",
  micPermission: "繝槭う繧ｯ縺ｮ險ｱ蜿ｯ縺悟ｿ・ｦ√∩縺溘＞",
  timerStart: "繧ｿ繧､繝槭・繧貞ｧ九ａ繧九・",
  timerResume: "邯壹″縺九ｉ蟋九ａ繧九・",
  timerPause: "繧ｿ繧､繝槭・繧呈ｭ｢繧√ｋ縺ｭ",
  timerReset: "繧ｿ繧､繝槭・繧偵Μ繧ｻ繝・ヨ縺励◆繧・,
  calculatorOpen: "髮ｻ蜊薙ｒ髢九￥縺ｭ",
  calculatorClose: "髮ｻ蜊薙ｒ髢峨§繧九・",
  speechOff: "髻ｳ螢ｰ繧偵が繝輔↓縺励◆繧・,
  speechOn: "繧ｻ繝ｪ繝暮浹螢ｰ繧偵が繝ｳ縺ｫ縺吶ｋ縺ｭ",
  alarmStop: "繧｢繝ｩ繝ｼ繝繧呈ｭ｢繧√ｋ縺ｭ",
};

function getVoiceResponseText(id, fallback = "") {
  return csvLinePools.voiceCommand[id] || voiceResponseMap[id] || fallback;
}

const csvLinePools = {
  pepaatennko: { normal: [], newStyle: [] },
  chef: [],
  animal: [],
  conversation: [],
  anniversary: [],
  calculatorResult: [],
  calculatorError: [],
  timerComplete: [],
  alarmGuide: [],
  voiceCommand: {},
};

function resetCsvLinePools() {
  csvLinePools.pepaatennko.normal = [];
  csvLinePools.pepaatennko.newStyle = [];
  csvLinePools.chef = [];
  csvLinePools.animal = [];
  csvLinePools.conversation = [];
  csvLinePools.anniversary = [];
  csvLinePools.calculatorResult = [];
  csvLinePools.calculatorError = [];
  csvLinePools.timerComplete = [];
  csvLinePools.alarmGuide = [];
  csvLinePools.voiceCommand = {};
}

function parseCsv(text) {
  const rows = [];
  let i = 0, field = "", row = [], inQuotes = false;
  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i += 2; continue; }
      if (c === '"') { inQuotes = false; i += 1; continue; }
      field += c; i += 1; continue;
    }
    if (c === '"') { inQuotes = true; i += 1; continue; }
    if (c === ",") { row.push(field); field = ""; i += 1; continue; }
    if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; i += 1; continue; }
    if (c === "\r") { i += 1; continue; }
    field += c; i += 1;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function csvEnabled(value) {
  return String(value || "").trim().toLowerCase() === "true";
}

function firstEnabledText(lines, category, id = "") {
  const item = lines.find((l) => l.category === category && (!id || l.id === id) && csvEnabled(l.enabled));
  return item?.text || "";
}

async function loadCharacterLinesCsv() {
  try {
    resetCsvLinePools();
    const res = await fetch("./public/data/character-lines.csv", { cache: "no-store" });
    if (!res.ok) throw new Error(`csv load failed: ${res.status}`);
    const csv = await res.text();
    const rows = parseCsv(csv);
    if (!rows.length) return;
    const header = rows[0];
    const idx = Object.fromEntries(header.map((h, n) => [h.trim(), n]));
    const lines = rows.slice(1).map((r) => ({
      id: r[idx.id] || "",
      character: r[idx.character] || "",
      style: r[idx.style] || "",
      category: r[idx.category] || "",
      text: r[idx.text] || "",
      speechText: r[idx.speechText] || "",
      enabled: r[idx.enabled] || "",
      notes: r[idx.notes] || "",
    })).filter((l) => l.text.trim());

    const enabledLines = lines.filter((l) => csvEnabled(l.enabled));
    const daily = enabledLines.filter((l) => l.category === "daily").map((l) => l.text);
    if (daily.length) dailyQuotes = daily;
    const sweets = enabledLines.filter((l) => l.category === "fortuneSweet").map((l) => l.text);
    if (sweets.length) luckySweets = sweets;
    const colors = enabledLines.filter((l) => l.category === "fortuneColor").map((l) => l.text);
    if (colors.length) luckyColors = colors;
    const fortunes = enabledLines.filter((l) => l.category === "fortuneMessage").map((l) => l.text);
    if (fortunes.length) luckyMessages = fortunes;

    csvLinePools.pepaatennko.normal = enabledLines
      .filter((l) => l.character === "pepaatennko" && (l.style === "normal" || l.style === "any") && l.category === "solo")
      .map((l) => l.text);
    csvLinePools.pepaatennko.newStyle = enabledLines
      .filter((l) => l.character === "pepaatennko" && (l.style === "newStyle" || l.style === "new") && l.category === "solo")
      .map((l) => l.text);
    csvLinePools.chef = enabledLines.filter((l) => l.character === "chef" && l.category === "solo").map((l) => l.text);
    csvLinePools.animal = enabledLines.filter((l) => l.character === "animal" && l.category === "solo").map((l) => l.text);
    csvLinePools.conversation = enabledLines
      .filter((l) => l.character === "system" && l.category === "conversation")
      .map((l) => l.text)
      .filter((text) => text.includes("|"))
      .map((text) => {
        const [pet, chef] = text.split("|");
        return [pet.trim(), chef.trim()];
      });
    csvLinePools.anniversary = enabledLines.filter((l) => l.category === "anniversary").map((l) => l.text);
    csvLinePools.calculatorResult = enabledLines.filter((l) => l.category === "calculatorResult").map((l) => l.text);
    csvLinePools.calculatorError = enabledLines.filter((l) => l.category === "calculatorError").map((l) => l.text);
    csvLinePools.timerComplete = enabledLines.filter((l) => l.category === "timerComplete").map((l) => l.text);
    csvLinePools.alarmGuide = enabledLines.filter((l) => l.category === "alarmGuide").map((l) => l.text);
    enabledLines
      .filter((l) => l.category === "voiceCommand")
      .forEach((l) => {
        if (l.id) csvLinePools.voiceCommand[l.id] = l.text;
      });

    const mapUpdates = {
      voiceCommandOn: firstEnabledText(lines, "voiceCommand", "voiceCommandOn"),
      voiceCommandOff: firstEnabledText(lines, "voiceCommand", "voiceCommandOff"),
      unsupported: firstEnabledText(lines, "voiceCommand", "unsupported"),
      micPermission: firstEnabledText(lines, "voiceCommand", "micPermission"),
      timerStart: firstEnabledText(lines, "timer", "timerStart"),
      timerResume: firstEnabledText(lines, "timer", "timerResume"),
      timerPause: firstEnabledText(lines, "timer", "timerPause"),
      timerReset: firstEnabledText(lines, "timer", "timerReset"),
      calculatorOpen: firstEnabledText(lines, "calculator", "calculatorOpen"),
      calculatorClose: firstEnabledText(lines, "calculator", "calculatorClose"),
      speechOff: firstEnabledText(lines, "voiceCommand", "speechOff"),
      speechOn: firstEnabledText(lines, "voiceCommand", "speechOn"),
      alarmStop: firstEnabledText(lines, "voiceCommand", "alarmStop"),
    };
    Object.entries(mapUpdates).forEach(([k, v]) => { if (v) voiceResponseMap[k] = v; });
  } catch (error) {
    resetCsvLinePools();
    console.warn("character-lines.csv load failed; fallback lines are used.", error);
  }
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
    const csvError = csvLinePools.calculatorError.length ? randomItem(csvLinePools.calculatorError) : "";
    showCalculatorPetMessage(csvError || (isDivideByZero ? "\u0030\u3067\u306f\u5272\u308c\u306a\u3044\u3088" : "\u3046\u307e\u304f\u8a08\u7b97\u3067\u304d\u306a\u304b\u3063\u305f\u307f\u305f\u3044"), 8000);
    return;
  }
  const result = calculatorValue.length > 14 ? calculatorValue.slice(0, 14) : calculatorValue;
  const texts = [
    `\u7b54\u3048\u306f ${result} \u3060\u3088`,
    `\u8a08\u7b97\u3067\u304d\u305f\u3088\u3002\u7b54\u3048\u306f ${result}`,
    `\u3067\u304d\u305f\uff01\u7b54\u3048\u306f ${result}`,
  ];
  const csvResult = csvLinePools.calculatorResult.length ? randomItem(csvLinePools.calculatorResult).replace("{result}", result) : "";
  showCalculatorPetMessage(csvResult || randomItem(texts), 8500);
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
      ? "繧ｻ繝ｪ繝暮浹螢ｰON"
      : "繧ｻ繝ｪ繝暮浹螢ｰOFF"
    : "髻ｳ螢ｰ髱槫ｯｾ蠢・;
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
  const japaneseVoices = speechVoices.filter((voice) => /ja|japanese|譌･譛ｬ/i.test(`${voice.lang} ${voice.name}`));
  const pool = japaneseVoices.length ? japaneseVoices : speechVoices;
  if (!pool.length) return null;
  if (character === "chef") {
    return (
      pool.find((voice) => /male|逕ｷ諤ｧ|otoya|ichiro/i.test(voice.name) && !/female|螂ｳ諤ｧ/i.test(voice.name)) ||
      pool.find((voice) => /ja|japanese|譌･譛ｬ/i.test(`${voice.lang} ${voice.name}`)) ||
      pool[0]
    );
  }
  if (character === "animal") {
    return (
      pool.find((voice) => /female|螂ｳ諤ｧ|haruka|nanami|kyoko|sayaka|yuna/i.test(voice.name)) ||
      pool.find((voice) => /ja|japanese|譌･譛ｬ/i.test(`${voice.lang} ${voice.name}`)) ||
      pool[0]
    );
  }
  return (
    pool.find((voice) => /female|螂ｳ諤ｧ|haruka|nanami|kyoko|sayaka|yuna/i.test(voice.name)) ||
    pool.find((voice) => /ja|japanese|譌･譛ｬ/i.test(`${voice.lang} ${voice.name}`)) ||
    pool[0]
  );
}

const classicPepaatennkoSpeechProfile = { pitch: 1.85, rate: 1.22, volume: 1 };
const newStylePepaatennkoSpeechProfile = { pitch: 1.4, rate: 0.98, volume: 1 };

function getPepaatennkoVoiceProfile() {
  return selectedPetStyle === "new" ? newStylePepaatennkoSpeechProfile : classicPepaatennkoSpeechProfile;
}

function getSpeechProfile(character) {
  if (character === "chef") {
    return { pitch: 0.84, rate: 1.03, volume: 0.95 };
  }
  if (character === "animal") {
    return { pitch: 2, rate: 1.4, volume: 0.8 };
  }
  return getPepaatennkoVoiceProfile();
}

const speechReplacementDictionary = [
  ["髮・ｸｭ繧ｿ繧､繝槭・", "縺励ｅ縺・■繧・≧繧ｿ繧､繝槭・"],
  ["譎ょ綾繧｢繝ｩ繝ｼ繝", "縺倥％縺上い繝ｩ繝ｼ繝"],
  ["豌ｴ蛻・｣懃ｵｦ", "縺吶＞縺ｶ繧薙⊇縺阪ｅ縺・],
  ["髮・ｸｭ蜉・, "縺励ｅ縺・■繧・≧繧翫ｇ縺・],
  ["菴懈･ｭ蜿ｰ", "縺輔℃繧・≧縺縺・],
  ["險伜ｿｵ譌･", "縺阪・繧薙・"],
  ["辟ｼ縺崎牡", "繧・″縺・ｍ"],
  ["螟ｧ荳亥､ｫ", "縺縺・§繧・≧縺ｶ"],
  ["荳譌･", "縺・■縺ｫ縺｡"],
  ["莉頑律", "縺阪ｇ縺・],
  ["譏取律", "縺ゅ＠縺・],
  ["荳頑焔", "縺倥ｇ縺・★"],
  ["髻ｳ螢ｰ", "縺翫ｓ縺帙＞"],
  ["逕溷慍", "縺阪§"],
  ["逋ｺ驟ｵ", "縺ｯ縺｣縺薙≧"],
  ["辟ｼ謌・, "縺励ｇ縺・○縺・],
  ["謌ｻ繧後ｋ", "繧ゅ←繧後ｋ"],
  ["螟ｧ莠・, "縺縺・§"],
  ["蜃ｺ繧・, "縺ｧ繧・],
  ["菴・, "縺九ｉ縺"],
];

function normalizeSpeechText(text) {
  return speechReplacementDictionary.reduce((result, [from, to]) => result.replaceAll(from, to), text);
}

function cleanSpeechText(text) {
  const cleaned = String(text || "")
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "")
    .replace(/[笙ｪ笙ｫ笘・・笳・裸笆笆｡笳鞘雷]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return normalizeSpeechText(cleaned);
}

function shouldSpeakText(text) {
  if (!speechEnabled || !speechSupported || !text) return false;
  if (!alarmRinging) return true;
  return /繧｢繝ｩ繝ｼ繝|繧ｿ繝・・|豁｢繧－譎る俣|蜷亥峙/.test(text);
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
    message.textContent = "螢ｰ縺ｧ繧ゅ♀謇倶ｼ昴＞縺吶ｋ縺ｭ";
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
  largeClockToggle.textContent = largeClockEnabled ? "螟ｧ逕ｻ髱｢譎りｨ・N" : "螟ｧ逕ｻ髱｢譎りｨ・FF";
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
  analogClockToggle.textContent = clockDisplayMode === "analog" ? "繝・ず繧ｿ繝ｫ譎りｨ医↓謌ｻ縺・ : "繧｢繝翫Ο繧ｰ譎りｨ医↓縺吶ｋ";
}

function updateLargeTimerState() {
  largeTimerDisplay.hidden = !largeTimerEnabled;
  largeTimerDisplay.classList.toggle("running", largeTimerEnabled && timerRunning);
  largeTimerDisplay.classList.toggle("paused", largeTimerEnabled && !timerRunning);
  document.body.classList.toggle("large-timer-mode", largeTimerEnabled);
  largeTimerToggle.classList.toggle("active", largeTimerEnabled);
  largeTimerToggle.setAttribute("aria-pressed", String(largeTimerEnabled));
  largeTimerToggle.textContent = largeTimerEnabled ? "螟ｧ逕ｻ髱｢ON" : "螟ｧ逕ｻ髱｢OFF";
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
    message.textContent = largeTimerEnabled ? "螟ｧ縺阪￥陦ｨ遉ｺ縺吶ｋ縺ｭ" : namedPeriodText();
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
    message.textContent = clockDisplayMode === "analog" ? "繧ｷ繧ｧ繝輔・霑代￥縺ｫ譎りｨ医ｒ蜃ｺ縺吶・" : "繝・ず繧ｿ繝ｫ譎りｨ医↓謌ｻ縺吶・";
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
    message.textContent = largeClockEnabled ? "譎りｨ医ｒ螟ｧ縺阪￥陦ｨ遉ｺ縺吶ｋ縺ｭ" : namedPeriodText();
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

function speakVoiceCommandResponse(text, options = {}) {
  showVoiceResponseById("voice_auto_047", "操作を実行したよ");
  if (!speechEnabled || !speechSupported || alarmRinging) return;
  queueSpeech("pet", text);
}

function announcePetStyleChange(text, options = {}) {
  showVoiceResponseById("voice_auto_048", "操作を実行したよ");
  if (!speechEnabled || !speechSupported || alarmRinging) return;
  queueSpeech("pet", text);
}

function handleVoiceCommandFailure(reason = "unknown") {
  if (!voiceCommandEnabled) return;
  const now = Date.now();
  if (now - lastVoiceCommandFailAt < 15000) return;
  lastVoiceCommandFailAt = now;

  const text = "繧難ｼ・;
  voiceCommandFailureGuideShown = true;
  showVoiceResponseById("voice_auto_049", "操作を実行したよ");
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
  const csvChef = csvLinePools.chef.length ? csvLinePools.chef : [];
  const pool = [
    ...csvChef,
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
  const csvPetPool = selectedPetStyle === "new"
    ? [...csvLinePools.pepaatennko.newStyle, ...csvLinePools.pepaatennko.normal]
    : csvLinePools.pepaatennko.normal;
  return [
    ...csvPetPool,
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
    ...csvLinePools.animal,
    ...animalFriendLines.normal,
    ...(timerRunning ? animalFriendLines.focus : animalFriendLines.rest),
    ...namedReplies,
  ];
}

function isAnimalLikePetLine(text) {
  return ["縺ｨ縺ｪ繧・, "縺｡繧・％繧・, "蠢懈抄菫・, "縺ｪ縺ｧ繧峨ｌ", "縺薙▲縺昴ｊ", "閭檎ｭ・, "縺昴・縺ｫ縺・ｋ", "隍偵ａ縺ｦ", "隕句ｮ医ｊ諡・ｽ・].some((word) =>
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
  return userName ? `${userName}縲～ : "";
}

function withName(text) {
  return userName ? `${userName}縲・{text}` : text;
}

function namedPeriodText(period = getTimePeriod()) {
  if (!userName) return timePeriods[period].text;
  const namedTexts = {
    morning: `${userName}縲∽ｻ頑律繧ゅｆ縺｣縺上ｊ蟋九ａ繧医≧縲Ａ,
    afternoon: `${userName}縲∽ｻ頑律繧ゅ＞縺・─縺倥↓騾ｲ繧√ｈ縺・Ａ,
    evening: `${userName}縲∽ｻ頑律繧ゅ♀縺､縺九ｌ縺輔∪縲Ａ,
    night: `${userName}縲√◎繧阪◎繧咲┌逅・＠縺吶℃縺ｪ縺・〒縺ｭ縲Ａ,
  };
  return namedTexts[period] || timePeriods[period].text;
}

function getStartupGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return withName("縺翫・繧医≧縲ゆｻ頑律繧ゅｆ縺｣縺上ｊ蟋九ａ繧医≧縲・);
  if (hour >= 11 && hour < 17) return withName("縺薙ｓ縺ｫ縺｡縺ｯ縲ゆｻ頑律繧ゅ＞縺・─縺倥↓騾ｲ繧√ｈ縺・・);
  if (hour >= 17 && hour < 21) return withName("縺薙ｓ縺ｰ繧薙・縲ゆｻ頑律繧ゅ♀縺､縺九ｌ縺輔∪縲・);
  if (hour >= 21) return withName("縺薙ｓ縺ｰ繧薙・縲ゅ◎繧阪◎繧咲┌逅・＠縺吶℃縺ｪ縺・〒縺ｭ縲・);
  return withName("驕・￥縺ｾ縺ｧ縺翫▽縺九ｌ縺輔∪縲ょｰ代＠莨代・貅門ｙ繧ゅ＠繧医≧縺ｭ縲・);
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
  message.textContent = userName ? `${userName}縲√％繧後°繧峨ｈ繧阪＠縺上・・～ : "蜷榊燕險ｭ螳壹ｒ繧ｯ繝ｪ繧｢縺励◆繧・;
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
  if (type === "birthday") return "隱慕函譌･";
  return type === "anniversary1" ? "險伜ｿｵ譌･1" : "險伜ｿｵ譌･2";
}

function renderAnniversaryList() {
  if (!anniversaryList) return;
  const rows = Object.entries(anniversaries)
    .filter(([, entry]) => entry && entry.month && entry.day)
    .map(([type, entry]) => {
      const title = entry.name || getAnniversaryTypeLabel(type);
      const memo = entry.memo ? " / " + entry.memo : "";
      return '<button class="anniversary-list-item" type="button" data-type="' + type + '">' + getAnniversaryTypeLabel(type) + "・・ + entry.month + "譛・ + entry.day + "譌･ " + title + memo + "</button>";
    });
  anniversaryList.innerHTML = rows.length ? rows.join("") : '<span class="anniversary-empty">縺ｾ縺逋ｻ骭ｲ縺後≠繧翫∪縺帙ｓ</span>';
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
  if (csvLinePools.anniversary.length) {
    const template = randomItem(csvLinePools.anniversary);
    return namePrefix() + template.replaceAll("{label}", label).replaceAll("{name}", userName || "");
  }
  const pool = [
    "莉頑律縺ｯ" + label + "縺縺ｭ縲ゅ♀繧√〒縺ｨ縺・ｼ・,
    "莉頑律縺ｯ" + label + "縺縺ｭ縲ゅ＞縺・ｸ譌･縺ｫ縺ｪ繧翫∪縺吶ｈ縺・↓縲・,
    "險伜ｿｵ譌･縺縺ｭ縲ゅ＞縺｣縺励ｇ縺ｫ縺顔･昴＞縺励ｈ縺・・,
    "莉頑律縺ｯ縺｡繧・▲縺ｨ迚ｹ蛻･縺ｪ豌怜・縺縺ｭ縲・,
    "螟ｧ蛻・↑譌･繧定ｦ壹∴縺ｦ縺・ｋ繧医・,
    "莉頑律縺ｯ縺顔･昴＞縺ｮ譌･縺縺ｭ縲ゅｆ縺｣縺上ｊ讌ｽ縺励ｂ縺・・,
    "縺翫ａ縺ｧ縺ｨ縺・ゅ☆縺ｦ縺阪↑荳譌･縺ｫ縺ｪ繧翫∪縺吶ｈ縺・↓縲・,
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
    message.textContent = namePrefix() + "譛医→譌･繧呈ｭ｣縺励￥蜈･繧後※縺ｭ";
    return;
  }
  anniversaries[anniversaryType.value] = entry;
  saveAnniversaries();
  renderAnniversaryList();
  fillAnniversaryForm();
  if (getTodayAnniversaries().some((item) => item.type === anniversaryType.value)) {
    maybeShowAnniversaryComment(true);
  } else {
    message.textContent = namePrefix() + "險伜ｿｵ譌･繧剃ｿ晏ｭ倥＠縺溘ｈ";
  }
}

function clearAnniversaryEntry() {
  delete anniversaries[anniversaryType.value];
  saveAnniversaries();
  renderAnniversaryList();
  fillAnniversaryForm();
  message.textContent = namePrefix() + "險伜ｿｵ譌･繧貞炎髯､縺励◆繧・;
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
  clockAlarmToggle.textContent = clockAlarmEnabled ? "譎ょ綾繧｢繝ｩ繝ｼ繝ON" : "譎ょ綾繧｢繝ｩ繝ｼ繝OFF";
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
  bgmToggle.textContent = bgmEnabled ? "BGM蛛懈ｭ｢" : "BGM蜀咲函";
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
    ? `${namePrefix()}${alarmHourSelect.value}:${alarmMinuteSelect.value} 縺ｫ繧｢繝ｩ繝ｼ繝繧偵そ繝・ヨ縺励◆繧・
    : `${namePrefix()}譎ょ綾繧｢繝ｩ繝ｼ繝繧丹FF縺ｫ縺励◆繧・;
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
  stageTimerLabel.textContent = "繧ｿ繝・・縺励※豁｢繧√※縺ｭ";
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
  const labels = { fresh: "縺輔ｏ繧・°", night: "螟懃ｩｺ", forest: "譽ｮ", cafe: "繧ｫ繝輔ぉ", season: "蟄｣遽" };
  message.textContent = `${namePrefix()}閭梧勹繧偵・{labels[selectedTheme]}縲阪↓縺励◆繧・;
  showChefSolo("theme", 9000, 0.65);
}

const voiceThemeCommands = [
  {
    theme: "night",
    response: "螟懃ｩｺ縺ｫ螟峨∴繧九・",
    patterns: ["螟懃ｩｺ", "螟懊・閭梧勹", "螟懊▲縺ｽ縺・, "閭梧勹繧貞､懃ｩｺ"],
  },
  {
    theme: "fresh",
    response: "縺輔ｏ繧・°縺ｪ閭梧勹縺ｫ縺吶ｋ縺ｭ",
    patterns: ["縺輔ｏ繧・°", "辷ｽ繧・°", "譏弱ｋ縺・レ譎ｯ", "閭梧勹繧偵＆繧上ｄ縺・],
  },
  {
    theme: "forest",
    response: "譽ｮ縺ｮ閭梧勹縺ｫ縺吶ｋ縺ｭ",
    patterns: ["譽ｮ縺ｫ縺励※", "譽ｮ縺ｮ閭梧勹", "閭梧勹繧呈｣ｮ", "閾ｪ辟ｶ縺｣縺ｽ縺・],
  },
  {
    theme: "cafe",
    response: "繧ｫ繝輔ぉ縺ｮ閭梧勹縺ｫ縺吶ｋ縺ｭ",
    patterns: ["繧ｫ繝輔ぉ", "繧ｫ繝輔ぉ縺ｮ閭梧勹", "閭梧勹繧偵き繝輔ぉ", "縺雁ｺ励▲縺ｽ縺・],
  },
  {
    theme: "season",
    response: "蟄｣遽縺ｮ閭梧勹縺ｫ縺吶ｋ縺ｭ",
    patterns: ["蟄｣遽縺ｫ縺励※", "蟄｣遽縺ｮ閭梧勹", "閭梧勹繧貞ｭ｣遽", "蟄｣遽諢・],
  },
];

const voiceCommandDefinitions = [
  {
    name: "timerLargeOff",
    patterns: ["繧ｿ繧､繝槭・縺ｮ螟ｧ逕ｻ髱｢繧偵ｄ繧・, "髮・ｸｭ繧ｿ繧､繝槭・縺ｮ螟ｧ逕ｻ髱｢繧偵ｄ繧・, "繧ｿ繧､繝槭・螟ｧ逕ｻ髱｢繧偵ｄ繧・],
    action: () => {
      setLargeTimerMode(false);
      showVoiceResponseById("voice_auto_001", "繧ｿ繧､繝槭・縺ｮ螟ｧ逕ｻ髱｢繧偵ｄ繧√ｋ縺ｭ");
    },
  },
  {
    name: "timerLargeOn",
    patterns: ["繧ｿ繧､繝槭・繧貞､ｧ逕ｻ髱｢", "髮・ｸｭ繧ｿ繧､繝槭・繧貞､ｧ逕ｻ髱｢", "繧ｿ繧､繝槭・繧貞､ｧ縺阪￥"],
    action: () => {
      setLargeTimerMode(true);
      showVoiceResponseById("voice_auto_002", "髮・ｸｭ繧ｿ繧､繝槭・繧貞､ｧ縺阪￥陦ｨ遉ｺ縺吶ｋ縺ｭ");
    },
  },
  {
    name: "clockLargeOff",
    patterns: ["螟ｧ逕ｻ髱｢繧偵ｄ繧・, "譎りｨ医・螟ｧ逕ｻ髱｢繧偵ｄ繧・, "譎ょ綾縺ｮ螟ｧ逕ｻ髱｢繧偵ｄ繧・, "螟ｧ縺阪＞譎りｨ医ｒ繧・ａ"],
    action: () => {
      if (!largeClockEnabled && largeTimerEnabled) {
        setLargeTimerMode(false);
      } else {
        setLargeClockMode(false);
      }
      showVoiceResponseById("voice_auto_003", "螟ｧ逕ｻ髱｢繧偵ｄ繧√ｋ縺ｭ");
    },
  },
  {
    name: "clockLargeOn",
    patterns: ["螟ｧ逕ｻ髱｢縺ｫ縺励※", "螟ｧ縺阪￥縺励※", "譎りｨ医ｒ螟ｧ逕ｻ髱｢", "譎ょ綾繧貞､ｧ逕ｻ髱｢", "譎りｨ医ｒ螟ｧ縺阪￥"],
    action: () => {
      setLargeClockMode(true);
      showVoiceResponseById("voice_auto_004", "譎りｨ医ｒ螟ｧ縺阪￥陦ｨ遉ｺ縺吶ｋ縺ｭ");
    },
  },
  {
    name: "volumeUp",
    patterns: ["髻ｳ驥上ｒ荳翫￡", "髻ｳ驥丈ｸ翫￡", "髻ｳ繧貞､ｧ縺阪￥", "繝懊Μ繝･繝ｼ繝荳翫￡"],
    action: () => {
      changeAppVolume(1);
      showVoiceResponseById("voice_auto_005", "髻ｳ驥上ｒ蟆代＠荳翫￡縺溘ｈ");
    },
  },
  {
    name: "volumeDown",
    patterns: ["髻ｳ驥上ｒ蟆上＆縺・, "髻ｳ繧貞ｰ上＆縺・, "髻ｳ驥丈ｸ九￡", "繝懊Μ繝･繝ｼ繝荳九￡"],
    action: () => {
      changeAppVolume(-1);
      showVoiceResponseById("voice_auto_006", "髻ｳ驥上ｒ蟆代＠蟆上＆縺上＠縺溘ｈ");
    },
  },
  {
    name: "focusStart",
    patterns: ["髮・ｸｭ繧ｿ繧､繝槭・繧貞ｧ九ａ", "繧ｿ繧､繝槭・蟋九ａ", "髮・ｸｭ蟋九ａ", "繧ｿ繧､繝槭・繧偵せ繧ｿ繝ｼ繝・],
    action: () => {
      startFocusTimer();
      showVoiceResponseById("voice_auto_007", "髮・ｸｭ繧ｿ繧､繝槭・繧貞ｧ九ａ繧九・");
    },
  },
  {
    name: "focusPause",
    patterns: ["繧ｿ繧､繝槭・繧呈ｭ｢繧・, "繧ｿ繧､繝槭・豁｢繧・, "荳譎ょ●豁｢", "繧ｿ繧､繝槭・繧剃ｸ譎ょ●豁｢"],
    action: () => {
      if (timerRunning) {
        pauseFocusTimer();
        showVoiceResponseById("voice_auto_008", "繧ｿ繧､繝槭・繧呈ｭ｢繧√ｋ縺ｭ");
      } else {
        showVoiceResponseById("voice_auto_009", "莉翫・繧ｿ繧､繝槭・縺ｯ蜍輔＞縺ｦ縺・↑縺・ｈ");
      }
    },
  },
  {
    name: "calculatorOpen",
    patterns: ["髮ｻ蜊薙ｒ髢・, "髮ｻ蜊馴幕", "險育ｮ玲ｩ溘ｒ髢・],
    action: () => {
      openCalculatorPanel({ announce: false });
      showVoiceResponseById("voice_auto_010", "髮ｻ蜊薙ｒ髢九￥縺ｭ");
    },
  },
  {
    name: "calculatorClose",
    patterns: ["髮ｻ蜊薙ｒ髢峨§", "髮ｻ蜊馴哩縺・, "險育ｮ玲ｩ溘ｒ髢峨§"],
    action: () => {
      closeCalculatorPanel();
      showVoiceResponseById("voice_auto_011", "髮ｻ蜊薙ｒ髢峨§繧九・");
    },
  },
  {
    name: "speechOff",
    patterns: ["髻ｳ螢ｰ繧ｪ繝・, "髻ｳ螢ｰ繧偵が繝・, "髻ｳ螢ｰ蛻・▲縺ｦ", "隱ｭ縺ｿ荳翫￡繧ｪ繝・, "螢ｰ繧貞・縺｣縺ｦ"],
    action: () => {
      setSpeechEnabled(false);
      showVoiceResponseById("voice_auto_050", "操作を実行したよ");
    },
  },
];

function normalizeVoiceCommandText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[ 縲\t\r\n縲√・.!?・・ｼ溘後阪弱擾ｼ茨ｼ・)]/g, "")
    .replace(/繝ｴ/g, "繝・)
    .trim();
}

function runVoiceCommand(rawText) {
  const commandText = normalizeVoiceCommandText(rawText);
  if (!commandText) {
    handleVoiceCommandFailure("empty");
    return;
  }

  const themeCommand = voiceThemeCommands.find((item) => item.patterns.some((pattern) => commandText.includes(normalizeVoiceCommandText(pattern))));
  if (themeCommand) {
    saveTheme(themeCommand.theme);
    showVoiceResponseById("voice_auto_051", "操作を実行したよ");
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

  handleVoiceCommandFailure("unknown");
}

function updateVoiceCommandUi() {
  if (!voiceCommandButton) return;
  const supported = Boolean(SpeechRecognitionClass);
  voiceCommandButton.disabled = !supported;
  voiceCommandButton.classList.toggle("active", voiceCommandListening);
  voiceCommandButton.setAttribute("aria-pressed", String(voiceCommandListening));
  voiceCommandButton.textContent = supported ? (voiceCommandListening ? "閨槭＞縺ｦ縺・∪縺吮ｦ" : "髻ｳ螢ｰ謫堺ｽ・) : "髻ｳ螢ｰ謫堺ｽ憺撼蟇ｾ蠢・;
}

function startVoiceCommandRecognition() {
  if (!SpeechRecognitionClass) {
    showVoiceResponseById("voice_auto_012", "縺薙・繝悶Λ繧ｦ繧ｶ縺ｧ縺ｯ髻ｳ螢ｰ謫堺ｽ懊′菴ｿ縺医↑縺・∩縺溘＞");
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
    };
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      runVoiceCommand(transcript);
    };
    recognition.onerror = (event) => {
      if (event?.error === "not-allowed" || event?.error === "service-not-allowed") {
        showVoiceResponseById("voice_auto_013", "繝槭う繧ｯ縺ｮ險ｱ蜿ｯ縺悟ｿ・ｦ√∩縺溘＞");
        return;
      }
      if (event?.error !== "no-speech") {
        handleVoiceCommandFailure(event?.error || "unknown");
      }
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
    showVoiceResponseById("voice_auto_014", "髻ｳ螢ｰ謫堺ｽ懊ｒ蟋九ａ繧峨ｌ縺ｪ縺九▲縺溘∩縺溘＞");
  }
}

function updatePetStyleUi() {
  if (!petStyleToggleButton) return;
  const isNewStyle = selectedPetStyle === "new";
  petStyleToggleButton.classList.toggle("active", isNewStyle);
  petStyleToggleButton.setAttribute("aria-pressed", String(isNewStyle));
  petStyleToggleButton.textContent = isNewStyle ? "譁ｰ繧ｹ繧ｿ繧､繝ｫ" : "騾壼ｸｸ繧ｹ繧ｿ繧､繝ｫ";
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
    announcePetStyleChange(selectedPetStyle === "new" ? "縺｡繧・▲縺ｨ謌宣聞縺励◆繧茨ｼ・ : "縺・▽繧ゅ・蟋ｿ縺ｫ謌ｻ縺｣縺溘ｈ");
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
    speakVoiceCommandResponse(target === "new" ? "繧ゅ≧譁ｰ繧ｹ繧ｿ繧､繝ｫ縺繧・ : "繧ゅ≧騾壼ｸｸ繧ｹ繧ｿ繧､繝ｫ縺繧・);
    return;
  }
  applyPetStyle(target);
  savePetStyle();
  speakVoiceCommandResponse(target === "new" ? "縺｡繧・▲縺ｨ謌宣聞縺励◆繧茨ｼ・ : "縺・▽繧ゅ・繧ｹ繧ｿ繧､繝ｫ縺ｫ謌ｻ縺吶・");
}

function setFocusMinutesFromVoice(minutes) {
  setActiveChoice(minutes);
  customMinutes.value = "";
  setSelectedMinutes(minutes);
  showVoiceResponseById("timerReset", `${minutes}蛻・ち繧､繝槭・縺ｫ縺励◆繧・);
}

function setClockDisplayModeFromVoice(mode) {
  clockDisplayMode = mode === "analog" ? "analog" : "digital";
  if (clockDisplayMode === "analog" && largeClockEnabled) {
    setLargeClockMode(false);
  }
  saveClockDisplayMode();
  updateClockDisplayModeState();
  updateClockDisplay();
  showVoiceResponseById("voice_auto_052", "操作を実行したよ");
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
  showVoiceResponseById("voice_auto_053", "操作を実行したよ");
}

function setVoiceSpeechFromVoice(enabled) {
  setSpeechEnabled(enabled);
  showVoiceResponseById(enabled ? "speechOn" : "speechOff", enabled ? "繧ｻ繝ｪ繝暮浹螢ｰ繧偵が繝ｳ縺ｫ縺吶ｋ縺ｭ" : "髻ｳ螢ｰ繧偵が繝輔↓縺励◆繧・);
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
  voiceCommandFailureGuideShown = false;
  lastVoiceCommandFailAt = 0;
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
  { name: "themeNight", theme: "night", response: "螟懃ｩｺ縺ｫ螟峨∴繧九・", patterns: ["螟懃ｩｺ縺ｫ縺励※", "閭梧勹繧貞､懃ｩｺ縺ｫ縺励※", "螟懊・閭梧勹縺ｫ縺励※", "螟懊▲縺ｽ縺上＠縺ｦ", "螟懃ｩｺ", "繧医◇繧・, "螟・, "螟懊・閭梧勹"] },
  { name: "themeFresh", theme: "fresh", response: "縺輔ｏ繧・°縺ｪ閭梧勹縺ｫ縺吶ｋ縺ｭ", patterns: ["縺輔ｏ繧・°縺ｫ縺励※", "辷ｽ繧・°縺ｫ縺励※", "閭梧勹繧偵＆繧上ｄ縺九↓縺励※", "譏弱ｋ縺・レ譎ｯ縺ｫ縺励※", "縺輔ｏ繧・°", "辷ｽ繧・°", "譏弱ｋ縺・, "縺吶▲縺阪ｊ", "髱堤ｩｺ", "繧・＆縺励＞", "蜆ｪ縺励＞"] },
  { name: "themeForest", theme: "forest", response: "譽ｮ縺ｮ閭梧勹縺ｫ縺吶ｋ縺ｭ", patterns: ["譽ｮ縺ｫ縺励※", "閭梧勹繧呈｣ｮ縺ｫ縺励※", "譽ｮ縺ｮ閭梧勹縺ｫ縺励※", "閾ｪ辟ｶ縺｣縺ｽ縺上＠縺ｦ", "譽ｮ", "繧ゅｊ", "閾ｪ辟ｶ", "邱・, "縺ｿ縺ｩ繧・] },
  { name: "themeCafe", theme: "cafe", response: "繧ｫ繝輔ぉ縺ｮ閭梧勹縺ｫ縺吶ｋ縺ｭ", patterns: ["繧ｫ繝輔ぉ縺ｫ縺励※", "閭梧勹繧偵き繝輔ぉ縺ｫ縺励※", "繧ｫ繝輔ぉ縺ｮ閭梧勹縺ｫ縺励※", "縺雁ｺ励▲縺ｽ縺上＠縺ｦ", "繧ｫ繝輔ぉ", "縺雁ｺ・, "蠎・, "蝟ｫ闌ｶ蠎・] },
  { name: "themeSeason", theme: "season", response: "蟄｣遽縺ｮ閭梧勹縺ｫ縺吶ｋ縺ｭ", patterns: ["蟄｣遽縺ｫ縺励※", "閭梧勹繧貞ｭ｣遽縺ｫ縺励※", "蟄｣遽縺ｮ閭梧勹縺ｫ縺励※", "蟄｣遽諢溘・縺ゅｋ閭梧勹縺ｫ縺励※", "蟄｣遽", "縺阪○縺､", "蟄｣遽諢・] },
];

const continuousVoiceCommands = [
  { name: "voiceCommandOff", patterns: ["髻ｳ螢ｰ謫堺ｽ懊が繝・, "髻ｳ螢ｰ謫堺ｽ懊ｒ繧ｪ繝・, "繝槭う繧ｯ繧ｪ繝・, "繝槭う繧ｯ繧偵が繝・, "閨槭″蜿悶ｊ繧偵ｄ繧√※"], action: () => { showVoiceResponseById("voiceCommandOff", "髻ｳ螢ｰ謫堺ｽ懊ｒ繧ｪ繝輔↓縺吶ｋ縺ｭ"); stopVoiceRecognition(); } },
  { name: "voiceCommandOn", patterns: ["髻ｳ螢ｰ謫堺ｽ懊が繝ｳ", "髻ｳ螢ｰ謫堺ｽ懊ｒ繧ｪ繝ｳ", "繝槭う繧ｯ繧ｪ繝ｳ", "繝槭う繧ｯ繧偵が繝ｳ"], action: () => showVoiceResponseById("voiceCommandOn", "髻ｳ螢ｰ謫堺ｽ懊・繧ゅ≧繧ｪ繝ｳ縺繧・) },
  { name: "newPetStyle", patterns: ["譁ｰ繧ｹ繧ｿ繧､繝ｫ縺ｫ縺励※", "譁ｰ縺励＞繧ｹ繧ｿ繧､繝ｫ縺ｫ縺励※", "譁ｰ縺励＞Pepaatennko縺ｫ縺励※", "譁ｰ縺励＞繝壹ヱ繝ｼ縺ｦ繧薙％縺ｫ縺励※", "譁ｰ縺励＞蟋ｿ縺ｫ縺励※", "繧ｹ繧ｿ繧､繝ｫ繧呈眠縺励￥縺励※"], action: () => setPetStyleFromVoice("new") },
  { name: "classicPetStyle", patterns: ["騾壼ｸｸ繧ｹ繧ｿ繧､繝ｫ縺ｫ縺励※", "縺・▽繧ゅ・繧ｹ繧ｿ繧､繝ｫ縺ｫ縺励※", "譎ｮ騾壹・繧ｹ繧ｿ繧､繝ｫ縺ｫ縺励※", "縺・▽繧ゅ・Pepaatennko縺ｫ縺励※", "縺・▽繧ゅ・繝壹ヱ繝ｼ縺ｦ繧薙％縺ｫ縺励※", "騾壼ｸｸ迚医↓謌ｻ縺励※"], action: () => setPetStyleFromVoice("classic") },
  { name: "timer5", patterns: ["5蛻・ち繧､繝槭・縺ｫ縺励※", "5蛻・↓縺励※", "繧ｿ繧､繝槭・5蛻・, "髮・ｸｭ繧ｿ繧､繝槭・5蛻・, "5蛻・寔荳ｭ", "莠泌・繧ｿ繧､繝槭・縺ｫ縺励※", "縺斐・繧薙ち繧､繝槭・縺ｫ縺励※", "縺斐・繧薙ち繧､繝槭・縺ｫ縺励※"], action: () => setFocusMinutesFromVoice(5) },
  { name: "timer10", patterns: ["10蛻・ち繧､繝槭・縺ｫ縺励※", "10蛻・↓縺励※", "繧ｿ繧､繝槭・10蛻・, "髮・ｸｭ繧ｿ繧､繝槭・10蛻・, "10蛻・寔荳ｭ", "蜊∝・繧ｿ繧､繝槭・縺ｫ縺励※", "縺倥ｅ縺｣縺ｷ繧薙ち繧､繝槭・縺ｫ縺励※"], action: () => setFocusMinutesFromVoice(10) },
  { name: "timer15", patterns: ["15蛻・ち繧､繝槭・縺ｫ縺励※", "15蛻・↓縺励※", "繧ｿ繧､繝槭・15蛻・, "髮・ｸｭ繧ｿ繧､繝槭・15蛻・, "15蛻・寔荳ｭ", "蜊∽ｺ泌・繧ｿ繧､繝槭・縺ｫ縺励※", "縺倥ｅ縺・＃縺ｵ繧薙ち繧､繝槭・縺ｫ縺励※"], action: () => setFocusMinutesFromVoice(15) },
  { name: "timer25", patterns: ["25蛻・ち繧､繝槭・縺ｫ縺励※", "25蛻・↓縺励※", "繧ｿ繧､繝槭・25蛻・, "髮・ｸｭ繧ｿ繧､繝槭・25蛻・, "25蛻・寔荳ｭ", "莠悟香莠泌・繧ｿ繧､繝槭・縺ｫ縺励※", "縺ｫ縺倥ｅ縺・＃縺ｵ繧薙ち繧､繝槭・縺ｫ縺励※"], action: () => setFocusMinutesFromVoice(25) },
  { name: "timer45", patterns: ["45蛻・ち繧､繝槭・縺ｫ縺励※", "45蛻・↓縺励※", "繧ｿ繧､繝槭・45蛻・, "髮・ｸｭ繧ｿ繧､繝槭・45蛻・, "45蛻・寔荳ｭ", "蝗帛香莠泌・繧ｿ繧､繝槭・縺ｫ縺励※", "繧医ｓ縺倥ｅ縺・＃縺ｵ繧薙ち繧､繝槭・縺ｫ縺励※"], action: () => setFocusMinutesFromVoice(45) },
  { name: "analogClock", patterns: ["繧｢繝翫Ο繧ｰ譎りｨ医↓縺励※", "繧｢繝翫Ο繧ｰ縺ｫ縺励※", "譎りｨ医ｒ繧｢繝翫Ο繧ｰ縺ｫ縺励※", "荳ｸ縺・凾險医↓縺励※"], action: () => setClockDisplayModeFromVoice("analog") },
  { name: "digitalClock", patterns: ["繝・ず繧ｿ繝ｫ譎りｨ医↓縺励※", "繝・ず繧ｿ繝ｫ縺ｫ縺励※", "譎りｨ医ｒ繝・ず繧ｿ繝ｫ縺ｫ縺励※", "謨ｰ蟄励・譎りｨ医↓縺励※"], action: () => setClockDisplayModeFromVoice("digital") },
  { name: "bgmOn", patterns: ["BGM繧呈ｵ√＠縺ｦ", "BGM縺､縺代※", "髻ｳ讌ｽ繧呈ｵ√＠縺ｦ", "髻ｳ讌ｽ縺､縺代※", "BGM繧ｪ繝ｳ", "髻ｳ讌ｽ繧ｪ繝ｳ"], action: () => setBgmFromVoice(true) },
  { name: "bgmOff", patterns: ["BGM繧呈ｭ｢繧√※", "BGM豸医＠縺ｦ", "髻ｳ讌ｽ繧呈ｭ｢繧√※", "髻ｳ讌ｽ豸医＠縺ｦ", "BGM繧ｪ繝・, "髻ｳ讌ｽ繧ｪ繝・], action: () => setBgmFromVoice(false) },
  { name: "themeReset", patterns: ["閭梧勹繧呈綾縺励※", "閭梧勹繧貞・縺ｫ謌ｻ縺励※", "蜈・・閭梧勹縺ｫ縺励※", "繝・ヵ繧ｩ繝ｫ繝郁レ譎ｯ縺ｫ縺励※", "閭梧勹繝ｪ繧ｻ繝・ヨ"], action: () => { saveTheme("fresh"); showVoiceResponseById("voice_auto_015", "閭梧勹繧呈綾縺吶・"); } },
  { name: "alarmStop", patterns: ["繧｢繝ｩ繝ｼ繝繧呈ｭ｢繧√※", "繧｢繝ｩ繝ｼ繝豁｢繧√※", "繧｢繝ｩ繝ｼ繝豸医＠縺ｦ", "魑ｴ縺｣縺ｦ繧矩浹繧呈ｭ｢繧√※", "逶ｮ隕壹∪縺玲ｭ｢繧√※"], action: () => { if (alarmRinging) { stopAlarm(); showVoiceResponseById("alarmStop", "繧｢繝ｩ繝ｼ繝繧呈ｭ｢繧√ｋ縺ｭ"); } else { showVoiceResponseById("voice_auto_016", "莉翫・繧｢繝ｩ繝ｼ繝縺ｯ魑ｴ縺｣縺ｦ縺・↑縺・ｈ"); } } },
  { name: "speechOn", patterns: ["髻ｳ螢ｰ繧ｪ繝ｳ", "螢ｰ繧貞・縺励※", "隱ｭ縺ｿ荳翫￡繧ｪ繝ｳ", "繧ｻ繝ｪ繝輔ｒ隱ｭ繧薙〒", "螢ｰ縺ゅｊ縺ｫ縺励※"], action: () => setVoiceSpeechFromVoice(true) },
  { name: "speechOff", patterns: ["髻ｳ螢ｰ繧ｪ繝・, "髻ｳ螢ｰ繧偵が繝・, "髻ｳ螢ｰ蛻・▲縺ｦ", "隱ｭ縺ｿ荳翫￡繧ｪ繝・, "螢ｰ繧貞・縺｣縺ｦ"], action: () => setVoiceSpeechFromVoice(false) },
  { name: "timerLargeOff", patterns: ["繧ｿ繧､繝槭・縺ｮ螟ｧ逕ｻ髱｢繧偵ｄ繧√※", "髮・ｸｭ繧ｿ繧､繝槭・縺ｮ螟ｧ逕ｻ髱｢繧偵ｄ繧√※", "繧ｿ繧､繝槭・螟ｧ逕ｻ髱｢繧偵ｄ繧√※"], action: () => { setLargeTimerMode(false); showVoiceResponseById("voice_auto_017", "繧ｿ繧､繝槭・縺ｮ螟ｧ逕ｻ髱｢繧偵ｄ繧√ｋ縺ｭ"); } },
  { name: "timerLargeOn", patterns: ["繧ｿ繧､繝槭・繧貞､ｧ逕ｻ髱｢縺ｫ縺励※", "髮・ｸｭ繧ｿ繧､繝槭・繧貞､ｧ逕ｻ髱｢縺ｫ縺励※", "繧ｿ繧､繝槭・繧貞､ｧ縺阪￥縺励※"], action: () => { setLargeTimerMode(true); showVoiceResponseById("voice_auto_018", "髮・ｸｭ繧ｿ繧､繝槭・繧貞､ｧ縺阪￥陦ｨ遉ｺ縺吶ｋ縺ｭ"); } },
  { name: "clockLargeOff", patterns: ["螟ｧ逕ｻ髱｢繧偵ｄ繧√※", "譎りｨ医・螟ｧ逕ｻ髱｢繧偵ｄ繧√※", "譎ょ綾縺ｮ螟ｧ逕ｻ髱｢繧偵ｄ繧√※"], action: () => { if (!largeClockEnabled && largeTimerEnabled) setLargeTimerMode(false); else setLargeClockMode(false); showVoiceResponseById("voice_auto_019", "螟ｧ逕ｻ髱｢繧偵ｄ繧√ｋ縺ｭ"); } },
  { name: "clockLargeOn", patterns: ["螟ｧ逕ｻ髱｢縺ｫ縺励※", "螟ｧ縺阪￥縺励※", "譎りｨ医ｒ螟ｧ逕ｻ髱｢縺ｫ縺励※", "譎ょ綾繧貞､ｧ逕ｻ髱｢縺ｫ縺励※", "譎りｨ医ｒ螟ｧ縺阪￥縺励※"], action: () => { setLargeClockMode(true); showVoiceResponseById("voice_auto_020", "譎りｨ医ｒ螟ｧ縺阪￥陦ｨ遉ｺ縺吶ｋ縺ｭ"); } },
  { name: "volumeUp", patterns: ["髻ｳ驥上ｒ荳翫￡縺ｦ", "髻ｳ驥丈ｸ翫￡縺ｦ", "髻ｳ繧貞､ｧ縺阪￥縺励※", "繝懊Μ繝･繝ｼ繝荳翫￡縺ｦ"], action: () => { changeAppVolume(1); showVoiceResponseById("voice_auto_021", "髻ｳ驥上ｒ蟆代＠荳翫￡縺溘ｈ"); } },
  { name: "volumeDown", patterns: ["髻ｳ驥上ｒ蟆上＆縺上＠縺ｦ", "髻ｳ繧貞ｰ上＆縺上＠縺ｦ", "髻ｳ驥丈ｸ九￡縺ｦ", "繝懊Μ繝･繝ｼ繝荳九￡縺ｦ"], action: () => { changeAppVolume(-1); showVoiceResponseById("voice_auto_022", "髻ｳ驥上ｒ蟆代＠蟆上＆縺上＠縺溘ｈ"); } },
  { name: "focusStart", patterns: ["髮・ｸｭ繧ｿ繧､繝槭・繧貞ｧ九ａ縺ｦ", "繧ｿ繧､繝槭・蟋九ａ縺ｦ", "髮・ｸｭ蟋九ａ縺ｦ", "繧ｿ繧､繝槭・繧偵せ繧ｿ繝ｼ繝・], action: () => { startFocusTimer(); showVoiceResponseById("timerStart", "髮・ｸｭ繧ｿ繧､繝槭・繧貞ｧ九ａ繧九・"); } },
  { name: "focusPause", patterns: ["繧ｿ繧､繝槭・繧呈ｭ｢繧√※", "繧ｿ繧､繝槭・豁｢繧√※", "荳譎ょ●豁｢", "繧ｿ繧､繝槭・繧剃ｸ譎ょ●豁｢"], action: () => { if (timerRunning) { pauseFocusTimer(); showVoiceResponseById("timerPause", "繧ｿ繧､繝槭・繧呈ｭ｢繧√ｋ縺ｭ"); } else { showVoiceResponseById("voice_auto_023", "莉翫・繧ｿ繧､繝槭・縺ｯ蜍輔＞縺ｦ縺・↑縺・ｈ"); } } },
  { name: "calculatorOpen", patterns: ["髮ｻ蜊薙ｒ髢九＞縺ｦ", "髮ｻ蜊馴幕縺・※", "險育ｮ玲ｩ溘ｒ髢九＞縺ｦ"], action: () => { openCalculatorPanel({ announce: false }); showVoiceResponseById("calculatorOpen", "髮ｻ蜊薙ｒ髢九￥縺ｭ"); } },
  { name: "calculatorClose", patterns: ["髮ｻ蜊薙ｒ髢峨§縺ｦ", "髮ｻ蜊馴哩縺倥※", "險育ｮ玲ｩ溘ｒ髢峨§縺ｦ"], action: () => { closeCalculatorPanel(); showVoiceResponseById("calculatorClose", "髮ｻ蜊薙ｒ髢峨§繧九・"); } },
];

function normalizeContinuousVoiceCommandText(text) {
  const katakanaToHiragana = (value) => value.replace(/[\u30a1-\u30f6]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0x60));
  return katakanaToHiragana(String(text || ""))
    .toLowerCase()
    .replace(/[ 縲\t\r\n縲√・.!?・・ｼ溘後阪弱擾ｼ茨ｼ・)]/g, "")
    .replace(/・費ｼ怖蝗帛香莠・g, "45")
    .replace(/・抵ｼ怖莠悟香莠・g, "25")
    .replace(/・托ｼ怖蜊∽ｺ・g, "15")
    .replace(/・托ｼ酢蜊∝・|蜊・g, "10")
    .replace(/・怖莠・g, "5")
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
    showVoiceResponseById("voice_auto_054", "操作を実行したよ");
    return;
  }
  const wasPaused = isFocusTimerPaused();
  startFocusTimer();
  showVoiceResponseById("voice_auto_055", "操作を実行したよ");
}

function pauseFocusTimerFromVoice() {
  if (alarmRinging) {
    stopAlarm();
    showVoiceResponseById("voice_auto_024", "繧｢繝ｩ繝ｼ繝繧呈ｭ｢繧√ｋ縺ｭ");
    return;
  }
  if (timerRunning) {
    pauseFocusTimer();
    showVoiceResponseById("voice_auto_025", "繧ｿ繧､繝槭・繧呈ｭ｢繧√ｋ縺ｭ");
    return;
  }
  if (bgmEnabled) {
    setBgmFromVoice(false);
    return;
  }
  showVoiceResponseById("voice_auto_026", "莉翫・豁｢繧√ｋ繧ゅ・縺後↑縺・ｈ");
}

function resetFocusTimerFromVoice() {
  resetFocusTimer();
  showVoiceResponseById("voice_auto_056", "操作を実行したよ");
}

function clearCalculatorFromVoice() {
  if (calculatorPanel.hidden) {
    showVoiceResponseById("voice_auto_027", "髮ｻ蜊薙・縺ｾ縺髢九＞縺ｦ縺・↑縺・ｈ");
    return;
  }
  resetCalculator();
  updateCalculatorDisplay();
  showVoiceResponseById("voice_auto_057", "操作を実行したよ");
}

function calculatorOperatorFromVoice(text) {
  if (/(雜ｳ縺處縺溘☆|縺ｷ繧峨☆|繝励Λ繧ｹ|蜉縺医ｋ)/.test(text)) return "add";
  if (/(蠑輔￥|縺ｲ縺楯縺ｾ縺・↑縺處繝槭う繝翫せ)/.test(text)) return "subtract";
  if (/(縺九￠繧弓謗帙￠繧弓縺九￠縺ｦ|荵礼ｮ慾ﾃ・/.test(text)) return "multiply";
  if (/(蜑ｲ繧弓繧上ｋ|蜑ｲ縺｣縺ｦ|髯､邂慾ﾃｷ)/.test(text)) return "divide";
  return "";
}

function normalizeCalculatorVoiceDigits(text) {
  return String(text || "")
    .replace(/蜈ｨ隗・g, "")
    .replace(/繧ｼ繝ｭ|縺懊ｍ/g, "0")
    .replace(/縺・■/g, "1")
    .replace(/縺ｫ/g, "2")
    .replace(/縺輔ｓ/g, "3")
    .replace(/繧医ｓ/g, "4")
    .replace(/縺・g, "4")
    .replace(/縺・g, "5")
    .replace(/繧阪￥/g, "6")
    .replace(/縺ｪ縺ｪ/g, "7")
    .replace(/縺励■/g, "7")
    .replace(/縺ｯ縺｡/g, "8")
    .replace(/縺阪ｅ縺・g, "9")
    .replace(/縺・g, "9")
    .replace(/蟆乗焚轤ｹ|縺励ｇ縺・☆縺・※繧倒縺ｩ縺｣縺ｨ|繝峨ャ繝・轤ｹ|縺ｦ繧・g, ".")
    .replace(/[^\d.]/g, "");
}

function inputCalculatorDigitsFromVoice(rawDigits) {
  const normalized = normalizeCalculatorVoiceDigits(rawDigits);
  if (!normalized) return false;
  for (const char of normalized) {
    if (char === ".") inputCalculatorDecimal();
    else inputCalculatorDigit(char);
  }
  updateCalculatorDisplay();
  maybeShowCalculatorTypingMessage("digit");
  return true;
}

function tryBulkCalculatorExpression(commandText) {
  const operator = calculatorOperatorFromVoice(commandText);
  if (!operator) return false;
  const parts = commandText.split(/雜ｳ縺處縺溘☆|縺ｷ繧峨☆|繝励Λ繧ｹ|蜉縺医ｋ|蠑輔￥|縺ｲ縺楯縺ｾ縺・↑縺處繝槭う繝翫せ|縺九￠繧弓謗帙￠繧弓縺九￠縺ｦ|荵礼ｮ慾ﾃ慾蜑ｲ繧弓繧上ｋ|蜑ｲ縺｣縺ｦ|髯､邂慾ﾃｷ/);
  if (parts.length < 2) return false;
  const left = normalizeCalculatorVoiceDigits(parts[0]);
  const right = normalizeCalculatorVoiceDigits(parts.slice(1).join(""));
  if (!left || !right) return false;
  if (calculatorPanel.hidden) openCalculatorPanel({ announce: false });
  resetCalculator();
  updateCalculatorDisplay();
  inputCalculatorDigitsFromVoice(left);
  inputCalculatorOperator(operator);
  inputCalculatorDigitsFromVoice(right);
  inputCalculatorEquals();
  return true;
}

function handleCalculatorVoiceCommand(commandText) {
  const hasCalculatorContext = voiceIncludes(commandText, ["髮ｻ蜊・, "險育ｮ・, "縺代＞縺輔ｓ"]);
  const canOperateCalculator = !calculatorPanel.hidden || hasCalculatorContext;

  if (voiceIncludes(commandText, ["髮ｻ蜊薙ｒ髢九＞縺ｦ", "髮ｻ蜊馴幕縺・※", "髮ｻ蜊・, "險育ｮ・, "險育ｮ励＠縺溘＞"])) {
    if (calculatorPanel.hidden) {
      openCalculatorPanel({ announce: false });
      showVoiceResponseById("voice_auto_028", "髮ｻ蜊薙ｒ髢九￥縺ｭ");
    } else {
      showVoiceResponseById("voice_auto_058", "操作を実行したよ");
    }
    return true;
  }

  if (!calculatorPanel.hidden && voiceIncludes(commandText, ["髮ｻ蜊薙ｒ髢峨§縺ｦ", "髮ｻ蜊馴哩縺倥※", "髢峨§縺ｦ", "縺ｨ縺倥※", "縺励∪縺｣縺ｦ", "髢峨§繧・])) {
    closeCalculatorPanel();
    showVoiceResponseById("voice_auto_029", "髮ｻ蜊薙ｒ髢峨§繧九・");
    return true;
  }

  if (canOperateCalculator && voiceIncludes(commandText, ["髮ｻ蜊薙け繝ｪ繧｢", "髮ｻ蜊薙Μ繧ｻ繝・ヨ", "險育ｮ玲ｶ医＠縺ｦ"])) {
    if (calculatorPanel.hidden) openCalculatorPanel({ announce: false });
    clearCalculatorFromVoice();
    return true;
  }

  if (!calculatorPanel.hidden && voiceIncludes(commandText, ["1譁・ｭ玲ｶ医＠縺ｦ", "荳譁・ｭ玲ｶ医＠縺ｦ", "縺ｲ縺ｨ縺､豸医＠縺ｦ", "繝舌ャ繧ｯ繧ｹ繝壹・繧ｹ", "蜑企勁", "謌ｻ繧・])) {
    inputCalculatorBackspace();
    updateCalculatorDisplay();
    showVoiceResponseById("voice_auto_030", "1譁・ｭ玲ｶ医＠縺溘ｈ");
    return true;
  }

  if (!calculatorPanel.hidden && voiceIncludes(commandText, ["繧ｯ繝ｪ繧｢", "ac", "豸医＠縺ｦ", "蜈ｨ驛ｨ豸医＠縺ｦ"])) {
    clearCalculatorFromVoice();
    return true;
  }

  if (!calculatorPanel.hidden && voiceIncludes(commandText, ["縺・％繝ｼ繧・, "繧､繧ｳ繝ｼ繝ｫ", "險育ｮ励＠縺ｦ", "遲斐∴", "遲斐∴繧貞・縺励※", "邨先棡"])) {
    inputCalculatorEquals();
    return true;
  }

  if (canOperateCalculator && tryBulkCalculatorExpression(commandText)) {
    return true;
  }

  if (!calculatorPanel.hidden) {
    const operator = calculatorOperatorFromVoice(commandText);
    if (operator) {
      inputCalculatorOperator(operator);
      return true;
    }
    if (inputCalculatorDigitsFromVoice(commandText)) {
      return true;
    }
  }

  return false;
}

function setFocusMinutesMaybeStart(minutes, commandText) {
  setFocusMinutesFromVoice(minutes);
  if (voiceIncludes(commandText, ["繧ｹ繧ｿ繝ｼ繝・, "蟋九ａ縺ｦ", "縺ｯ縺倥ａ縺ｦ", "髢句ｧ・, "蜀埼幕"])) {
    startFocusTimerFromVoice();
  }
}

function parseKanjiNumber(value) {
  const map = { "髮ｶ": 0, "縲・: 0, "荳": 1, "莠・: 2, "荳・: 3, "蝗・: 4, "莠・: 5, "蜈ｭ": 6, "荳・: 7, "蜈ｫ": 8, "荵・: 9 };
  if (!value) return null;
  if (/^\d+$/.test(value)) return Number(value);
  if (value === "蜊・) return 10;
  if (value.endsWith("蜊・)) {
    const head = value.slice(0, -1);
    const tens = head ? map[head] : 1;
    return tens == null ? null : tens * 10;
  }
  if (value.includes("蜊・)) {
    const [head, tail] = value.split("蜊・);
    const tens = head ? map[head] : 1;
    const ones = tail ? map[tail] : 0;
    if (tens == null || ones == null) return null;
    return tens * 10 + ones;
  }
  return map[value] ?? null;
}

function parseVoiceAlarmTime(commandText) {
  const source = String(commandText || "");
  const hasAlarmContext = /(繧｢繝ｩ繝ｼ繝|逶ｮ隕壹∪縺慾繧√＊縺ｾ縺・/.test(source);
  const hasClockShape = /譎・.test(source);
  if (!hasClockShape) return null;
  if (/(蛻・ち繧､繝槭・|髮・ｸｭ|繧ｿ繧､繝槭・)/.test(source) && !hasAlarmContext) return null;

  const meridiem = source.includes("蜊亥ｾ・) ? "pm" : source.includes("蜊亥燕") ? "am" : "";
  const timeMatch = source.match(/([0-9荳莠御ｸ牙屁莠泌・荳・・荵晏香縲・峺]+)譎・?:(蜊・|([0-9荳莠御ｸ牙屁莠泌・荳・・荵晏香縲・峺]+)蛻・)?/);
  if (!timeMatch) return null;
  const hour = parseKanjiNumber(timeMatch[1]);
  if (hour == null || hour < 0 || hour > 23) return null;
  let minute = 0;
  if (timeMatch[2]) {
    minute = 30;
  } else if (timeMatch[3]) {
    const parsedMinute = parseKanjiNumber(timeMatch[3]);
    if (parsedMinute == null || parsedMinute < 0 || parsedMinute > 59) return null;
    minute = parsedMinute;
  }

  let normalizedHour = hour;
  if (meridiem === "am" && normalizedHour === 12) normalizedHour = 0;
  if (meridiem === "pm" && normalizedHour < 12) normalizedHour += 12;
  if (!meridiem && normalizedHour > 23) return null;

  return { hour: normalizedHour, minute };
}

function setClockAlarmFromVoice(commandText) {
  const parsed = parseVoiceAlarmTime(commandText);
  if (!parsed) return false;
  alarmHourSelect.value = String(parsed.hour).padStart(2, "0");
  alarmMinuteSelect.value = String(parsed.minute).padStart(2, "0");
  clockAlarmEnabled = true;
  enableAlarmSound();
  saveClockAlarm();
  updateClockAlarmUi();
  quoteHoldUntil = Date.now() + 8000;
  hideChefMessage();
  message.textContent = `${parsed.hour}譎・{parsed.minute ? `${parsed.minute}蛻・ : ""}縺ｫ繧｢繝ｩ繝ｼ繝繧偵そ繝・ヨ縺励◆繧・;
  return true;
}

function handleShortVoiceCommand(commandText) {
  if (handleCalculatorVoiceCommand(commandText)) {
    return true;
  }

  if (setClockAlarmFromVoice(commandText)) {
    return true;
  }

  if (voiceIncludes(commandText, ["繝ｪ繧ｻ繝・ヨ", "繧ｿ繧､繝槭・繝ｪ繧ｻ繝・ヨ", "髮・ｸｭ繧ｿ繧､繝槭・繝ｪ繧ｻ繝・ヨ", "譛蛻昴↓謌ｻ縺励※", "縺ｯ縺倥ａ縺ｫ謌ｻ縺励※", "繧ｿ繧､繝槭・繧呈綾縺励※", "譎る俣繧呈綾縺励※", "繧ゅ≧荳蠎ｦ譛蛻昴°繧・, "譛蛻昴°繧・])) {
    resetFocusTimerFromVoice();
    return true;
  }

  const timerMinuteCommands = [
    [45, ["45蛻・, "45蛻・ち繧､繝槭・", "45蛻・寔荳ｭ", "繧医ｓ縺倥ｅ縺・＃縺ｵ繧・, "蝗帛香莠泌・"]],
    [25, ["25蛻・, "25蛻・ち繧､繝槭・", "25蛻・寔荳ｭ", "縺ｫ縺倥ｅ縺・＃縺ｵ繧・, "莠悟香莠泌・"]],
    [15, ["15蛻・, "15蛻・ち繧､繝槭・", "15蛻・寔荳ｭ", "縺倥ｅ縺・＃縺ｵ繧・, "蜊∽ｺ泌・"]],
    [10, ["10蛻・, "10蛻・ち繧､繝槭・", "10蛻・寔荳ｭ", "縺倥ｅ縺｣縺ｷ繧・, "蜊∝・"]],
    [5, ["5蛻・, "5蛻・ち繧､繝槭・", "5蛻・寔荳ｭ", "縺斐・繧・, "縺斐・繧・, "莠泌・"]],
  ];
  const minuteCommand = timerMinuteCommands.find(([, patterns]) => voiceIncludes(commandText, patterns));
  if (minuteCommand) {
    setFocusMinutesMaybeStart(minuteCommand[0], commandText);
    return true;
  }

  if (alarmRinging && voiceIncludes(commandText, ["豁｢繧√※", "縺ｨ繧√※", "繧ｹ繝医ャ繝・, "蛛懈ｭ｢", "繧｢繝ｩ繝ｼ繝豁｢繧√※", "繧｢繝ｩ繝ｼ繝繧呈ｭ｢繧√※", "縺・ｋ縺輔＞", "逶ｮ隕壹∪縺玲ｭ｢繧√※"])) {
    stopAlarm();
    showVoiceResponseById("voice_auto_031", "繧｢繝ｩ繝ｼ繝繧呈ｭ｢繧√ｋ縺ｭ");
    return true;
  }

  if (voiceIncludes(commandText, ["繧ｹ繧ｿ繝ｼ繝・, "繧ｿ繧､繝槭・繧ｹ繧ｿ繝ｼ繝・, "蟋九ａ縺ｦ", "縺ｯ縺倥ａ縺ｦ", "髢句ｧ・, "蜀埼幕", "繧ゅ≧荳蝗・, "繧ゅ≧荳蠎ｦ", "蜍輔°縺励※", "邯壹￠縺ｦ"])) {
    startFocusTimerFromVoice();
    return true;
  }

  if (voiceIncludes(commandText, ["豁｢繧√※", "縺ｨ繧√※", "繧ｹ繝医ャ繝・, "蛛懈ｭ｢", "荳譎ょ●豁｢", "莨第・", "蠕・▲縺ｦ", "縺・▲縺溘ｓ豁｢繧√※"])) {
    pauseFocusTimerFromVoice();
    return true;
  }

  if (voiceIncludes(commandText, ["閭梧勹謌ｻ縺励※", "閭梧勹繧呈綾縺励※", "蜈・↓謌ｻ縺励※", "繝・ヵ繧ｩ繝ｫ繝・, "閭梧勹繝ｪ繧ｻ繝・ヨ"])) {
    saveTheme("fresh");
    showVoiceResponseById("voice_auto_032", "閭梧勹繧呈綾縺吶・");
    return true;
  }

  const shortThemeCommand = continuousVoiceThemeCommands.find((item) => voiceIncludes(commandText, item.patterns));
  if (shortThemeCommand) {
    saveTheme(shortThemeCommand.theme);
    showVoiceResponseById("voice_auto_059", "操作を実行したよ");
    return true;
  }

  if (bgmEnabled && voiceIncludes(commandText, ["荳翫￡縺ｦ", "縺ゅ￡縺ｦ", "螟ｧ縺阪￥縺励※", "繧ゅ▲縺ｨ螟ｧ縺阪￥", "閨槭％縺医↑縺・])) {
    changeAppVolume(1);
    showVoiceResponseById("voice_auto_033", "髻ｳ驥上ｒ蟆代＠荳翫￡縺溘ｈ");
    return true;
  }
  if (voiceIncludes(commandText, ["髻ｳ驥丈ｸ翫￡縺ｦ", "髻ｳ驥上ｒ荳翫￡縺ｦ"])) {
    changeAppVolume(1);
    showVoiceResponseById("voice_auto_034", "髻ｳ驥上ｒ蟆代＠荳翫￡縺溘ｈ");
    return true;
  }
  if (bgmEnabled && voiceIncludes(commandText, ["荳九￡縺ｦ", "縺輔￡縺ｦ", "蟆上＆縺上＠縺ｦ", "縺・ｋ縺輔＞", "髱吶°縺ｫ縺励※"])) {
    changeAppVolume(-1);
    showVoiceResponseById("voice_auto_035", "髻ｳ驥上ｒ蟆代＠蟆上＆縺上＠縺溘ｈ");
    return true;
  }
  if (voiceIncludes(commandText, ["髻ｳ驥丈ｸ九￡縺ｦ", "髻ｳ驥上ｒ荳九￡縺ｦ"])) {
    changeAppVolume(-1);
    showVoiceResponseById("voice_auto_036", "髻ｳ驥上ｒ蟆代＠蟆上＆縺上＠縺溘ｈ");
    return true;
  }

  if (voiceIncludes(commandText, ["bgm豁｢繧√※", "bgm豸医＠縺ｦ", "bgm繧ｪ繝・, "髻ｳ讌ｽ豁｢繧√※", "髻ｳ讌ｽ豸医＠縺ｦ", "髻ｳ讌ｽ繧ｪ繝・])) {
    setBgmFromVoice(false);
    return true;
  }

  if (voiceIncludes(commandText, ["bgm", "髻ｳ讌ｽ", "豬√＠縺ｦ", "縺九￠縺ｦ"])) {
    setBgmFromVoice(true);
    return true;
  }

  if (voiceIncludes(commandText, ["蟆上＆縺・, "螟ｧ逕ｻ髱｢繧・ａ縺ｦ", "譎ｮ騾壹↓謌ｻ縺励※", "謌ｻ縺励※"])) {
    if (largeClockEnabled) {
      setLargeClockMode(false);
      showVoiceResponseById("voice_auto_037", "螟ｧ逕ｻ髱｢繧偵ｄ繧√ｋ縺ｭ");
      return true;
    }
    if (largeTimerEnabled) {
      setLargeTimerMode(false);
      showVoiceResponseById("voice_auto_038", "繧ｿ繧､繝槭・縺ｮ螟ｧ逕ｻ髱｢繧偵ｄ繧√ｋ縺ｭ");
      return true;
    }
    if (selectedPetStyle === "new" && voiceIncludes(commandText, ["謌ｻ縺励※", "縺・▽繧ゅ・", "騾壼ｸｸ迚・, "蜈・・繝壹ヱ繝ｼ縺ｦ繧薙％"])) {
      setPetStyleFromVoice("classic");
      return true;
    }
  }

  if (voiceIncludes(commandText, ["繧ｿ繧､繝槭・螟ｧ逕ｻ髱｢", "繧ｿ繧､繝槭・螟ｧ縺阪￥", "繧ｫ繧ｦ繝ｳ繝亥､ｧ縺阪￥"])) {
    setLargeTimerMode(true);
    showVoiceResponseById("voice_auto_039", "髮・ｸｭ繧ｿ繧､繝槭・繧貞､ｧ縺阪￥陦ｨ遉ｺ縺吶ｋ縺ｭ");
    return true;
  }
  if (voiceIncludes(commandText, ["繧ｿ繧､繝槭・蟆上＆縺・, "繧ｿ繧､繝槭・螟ｧ逕ｻ髱｢繧・ａ縺ｦ"])) {
    setLargeTimerMode(false);
    showVoiceResponseById("voice_auto_040", "繧ｿ繧､繝槭・縺ｮ螟ｧ逕ｻ髱｢繧偵ｄ繧√ｋ縺ｭ");
    return true;
  }
  const timerLargeKeywords = ["繧ｿ繧､繝槭・", "髮・ｸｭ繧ｿ繧､繝槭・", "繧ｫ繧ｦ繝ｳ繝・, "繧ｫ繧ｦ繝ｳ繝医ム繧ｦ繝ｳ"];
  const clockLargeKeywords = ["譎りｨ・, "譎ょ綾", "譎る俣"];
  const hasTimerLargeKeyword = voiceIncludes(commandText, timerLargeKeywords);
  const hasClockLargeKeyword = voiceIncludes(commandText, clockLargeKeywords);
  const asksLarge = voiceIncludes(commandText, ["螟ｧ逕ｻ髱｢", "螟ｧ縺阪￥", "譎りｨ亥､ｧ縺阪￥", "譎りｨ医ｒ螟ｧ縺阪￥", "譎ょ綾螟ｧ逕ｻ髱｢"]);

  if (asksLarge) {
    if (hasTimerLargeKeyword || ((!hasClockLargeKeyword) && (timerRunning || isFocusTimerPaused()))) {
      setLargeTimerMode(true);
      showVoiceResponseById("voice_auto_041", "髮・ｸｭ繧ｿ繧､繝槭・繧貞､ｧ縺阪￥陦ｨ遉ｺ縺吶ｋ縺ｭ");
      return true;
    }
    setLargeClockMode(true);
    showVoiceResponseById("voice_auto_042", "譎りｨ医ｒ螟ｧ縺阪￥陦ｨ遉ｺ縺吶ｋ縺ｭ");
    return true;
  }

  if (voiceIncludes(commandText, ["繧｢繝翫Ο繧ｰ", "荳ｸ縺・凾險・, "繧｢繝翫Ο繧ｰ譎りｨ・])) {
    setClockDisplayModeFromVoice("analog");
    return true;
  }
  if (voiceIncludes(commandText, ["繝・ず繧ｿ繝ｫ", "謨ｰ蟄励・譎りｨ・, "繝・ず繧ｿ繝ｫ譎りｨ・])) {
    setClockDisplayModeFromVoice("digital");
    return true;
  }
  if (voiceIncludes(commandText, ["譁ｰ繧ｹ繧ｿ繧､繝ｫ", "譁ｰ縺励＞繧ｹ繧ｿ繧､繝ｫ", "譁ｰ縺励＞蟋ｿ", "譁ｰ縺励＞繝壹ヱ繝ｼ縺ｦ繧薙％"])) {
    setPetStyleFromVoice("new");
    return true;
  }
  if (voiceIncludes(commandText, ["騾壼ｸｸ繧ｹ繧ｿ繧､繝ｫ", "縺・▽繧ゅ・", "縺・▽繧ゅ・蟋ｿ", "騾壼ｸｸ迚・, "蜈・・繝壹ヱ繝ｼ縺ｦ繧薙％"])) {
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
      showVoiceResponseById("voice_auto_060", "操作を実行したよ");
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

  handleVoiceCommandFailure("unknown");
}

function updateVoiceCommandUi() {
  if (!voiceCommandButton) return;
  const supported = Boolean(SpeechRecognitionClass);
  voiceCommandButton.disabled = !supported;
  voiceCommandButton.classList.toggle("active", voiceCommandEnabled);
  voiceCommandButton.setAttribute("aria-pressed", String(voiceCommandEnabled));
  if (!supported) {
    voiceCommandButton.textContent = "髻ｳ螢ｰ謫堺ｽ憺撼蟇ｾ蠢・;
  } else if (voiceCommandEnabled) {
    voiceCommandButton.textContent = voiceCommandListening ? "髻ｳ螢ｰ謫堺ｽ廾N" : "髻ｳ螢ｰ謫堺ｽ廾N";
  } else {
    voiceCommandButton.textContent = "髻ｳ螢ｰ謫堺ｽ廾FF";
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
        showVoiceResponseById("voice_auto_043", "繝槭う繧ｯ縺ｮ險ｱ蜿ｯ縺悟ｿ・ｦ√∩縺溘＞");
        return;
      }
      if (event.error !== "no-speech") {
        handleVoiceCommandFailure(event.error || "unknown");
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
    showVoiceResponseById("voice_auto_044", "縺薙・繝悶Λ繧ｦ繧ｶ縺ｧ縺ｯ髻ｳ螢ｰ謫堺ｽ懊′菴ｿ縺医↑縺・∩縺溘＞");
    updateVoiceCommandUi();
    return;
  }
  if (voiceCommandEnabled) {
    showVoiceResponseById("voice_auto_045", "髻ｳ螢ｰ謫堺ｽ懊ｒ繧ｪ繝輔↓縺吶ｋ縺ｭ");
    stopVoiceRecognition();
    return;
  }
  voiceCommandEnabled = true;
  saveVoiceCommandSetting();
  updateVoiceCommandUi();
  voiceCommandFailureGuideShown = false;
  lastVoiceCommandFailAt = 0;
  showVoiceResponseById("voice_auto_046", "髻ｳ螢ｰ謫堺ｽ懊が繝ｳ縺繧医り◇縺・※繧九ｈ", { holdMs: 3500 });
  if (speechEnabled && speechSupported && !alarmRinging) {
    queueSpeech("pet", "髻ｳ螢ｰ謫堺ｽ懊が繝ｳ縺繧医り◇縺・※繧九ｈ");
  }
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
  message.textContent = `莉頑律縺ｮ縺ｲ縺ｨ縺薙→・・{formatDailyQuote(quote)}`;
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
  message.textContent = `繝ｩ繝・く繝ｼ縺願藷蟄撰ｼ・{fortune.sweet} / 繝ｩ繝・く繝ｼ繧ｫ繝ｩ繝ｼ・・{fortune.color} / 縺ｲ縺ｨ縺薙→・・{namePrefix()}${fortune.message}`;
  showChefSolo("lucky", 9000, 0.55);
}

function getConversationPair() {
  if (csvLinePools.conversation.length) {
    return pickFreshConversation(csvLinePools.conversation);
  }
  if (userName && Math.random() < 0.35) {
    return pickFreshConversation([
      [`${userName}縲√＞縺・─縺倥□繧・, `${userName}縲√◎縺ｮ隱ｿ蟄舌〒縺兪],
      [`${userName}縲∽ｼ第・繧ょｿ倥ｌ縺ｪ縺・〒縺ｭ`, `${userName}縲∽ｼ代・譎る俣繧ょ､ｧ蛻・〒縺兪],
      [`${userName}縲∫┬繧峨↑縺上※縺・＞繧・, `${userName}縲∽ｸ∝ｯｧ縺ｫ縺・″縺ｾ縺励ｇ縺・],
      [`${userName}縲√■繧・ｓ縺ｨ騾ｲ繧薙〒繧九ｈ`, `${userName}縲∫ｩ阪∩驥阪↑縺｣縺ｦ縺・∪縺兪],
      [`${userName}縲√％縺薙〒豺ｱ蜻ｼ蜷ｸ縺励ｈ縺・, `${userName}縲∬誠縺｡逹縺・※邯壹￠縺ｾ縺励ｇ縺・],
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
    return moodProfiles.find((profile) => profile.name === "繧・ｋ豌玲ｺ縲・);
  }
  if (alarmRinging) {
    return moodProfiles.find((profile) => profile.name === "縺斐″縺偵ｓ");
  }
  return (
    moodProfiles.find((profile) => mood >= profile.minMood && mood <= profile.maxMood && energy >= profile.minEnergy && energy <= profile.maxEnergy) ||
    moodProfiles.find((profile) => profile.name === "縺斐″縺偵ｓ")
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
  setAction("cheer", `${namePrefix()}髮・ｸｭ繧ｹ繧ｿ繝ｼ繝茨ｼ￣epaatennko繧ょｿ懈抄縺励※縺・ｋ繧・);
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
  message.textContent = `${namePrefix()}荳譎ょ●豁｢荳ｭ縲よｺ門ｙ縺ｧ縺阪◆繧峨∪縺溷ｧ九ａ繧医≧`;
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
  stageTimerLabel.textContent = csvLinePools.alarmGuide[0] || "繧ｿ繝・・縺励※豁｢繧√※縺ｭ";
  const timerDoneLine = csvLinePools.timerComplete.length ? randomItem(csvLinePools.timerComplete) : randomItem(extraPetReplies.timerComplete);
  setAction("cheer", `${namePrefix()}${timerDoneLine} 繝壹ャ繝医ｒ繧ｿ繝・・縺励※縺ｭ`);
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
    message.textContent = stoppedMode === "clock" ? `${namePrefix()}莠亥ｮ壹・蜷亥峙繧呈ｭ｢繧√◆繧・ : `${namePrefix()}${randomItem(extraPetReplies.timerComplete)}`;
    hideChefMessage();
    setAction("cheer", stoppedMode === "clock" ? `${namePrefix()}遏･繧峨○繧堤｢ｺ隱阪〒縺阪◆縺ｭ` : `${namePrefix()}${randomItem(extraPetReplies.timerComplete)}`);
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
  message.textContent = "逕ｻ蜒上′隕九▽縺九ｊ縺ｾ縺帙ｓ";
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

async function initializeApp() {
  await loadCharacterLinesCsv();
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
}

function showVoiceResponseById(id, fallback = "", options = {}) {
  showVoiceResponseById("voice_auto_061", "操作を実行したよ");
}

initializeApp();



