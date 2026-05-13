const canvas = document.querySelector("#pet");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const stage = document.querySelector("#stage");
const message = document.querySelector("#message");
const moodValue = document.querySelector("#mood");
const energyValue = document.querySelector("#energy");
const clock = document.querySelector("#clock");
const stageTimerLabel = document.querySelector("#stageTimerLabel");
const stageTimerDisplay = document.querySelector("#stageTimerDisplay");
const dailyQuoteButton = document.querySelector("#dailyQuoteButton");
const luckyFortuneButton = document.querySelector("#luckyFortuneButton");
const timeChoices = document.querySelectorAll(".time-choice");
const customMinutes = document.querySelector("#customMinutes");
const startTimerButton = document.querySelector("#startTimer");
const pauseTimerButton = document.querySelector("#pauseTimer");
const resetTimerButton = document.querySelector("#resetTimer");
const alarmToggleButton = document.querySelector("#alarmToggle");

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
let alarmId = 0;
let audioContext = null;
let quoteHoldUntil = 0;

const timePeriods = {
  morning: { text: "おはようございます！今日もがんばろう！", replies: ["おはようございます！今日もがんばろう！", "朝だよ！まずは深呼吸して始めよう", "今日もいい一日にしようね"], action: "cheer" },
  afternoon: { text: "こんにちは！少し休憩しながら進めよう", replies: ["こんにちは！少し休憩しながら進めよう", "お昼の元気、まだまだあるよ", "無理しすぎず、いいペースでいこう"], action: "wave" },
  evening: { text: "おかえりなさい！おおつかれさまです！", replies: ["おかえりなさい！おおつかれさまです！", "夕方だね。ここまでよく進めたね", "ひと息ついて、あと少しだけやろう"], action: "snack" },
  night: { text: "遅くまでおつかれさま。夜更かしないでね", replies: ["遅くまでおつかれさま。夜更かしないでね", "夜はゆっくりモードでいこう", "そろそろ休む準備も忘れないでね"], action: "shy" },
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
    const index = Math.abs([...today].reduce((total, char) => total + char.charCodeAt(0), 0)) % dailyQuotes.length;
    const quote = dailyQuotes[index];
    localStorage.setItem("pepaatennkoDailyQuote", JSON.stringify({ date: today, quote }));
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
      sweet: pickFromList(luckySweets, today, 11),
      color: pickFromList(luckyColors, today, 23),
      message: pickFromList(luckyMessages, today, 37),
    };
    localStorage.setItem("pepaatennkoLuckyFortune", JSON.stringify(fortune));
    return fortune;
  } catch {
    return {
      sweet: luckySweets[new Date().getDate() % luckySweets.length],
      color: luckyColors[new Date().getDay() % luckyColors.length],
      message: luckyMessages[new Date().getMonth() % luckyMessages.length],
    };
  }
}

function showDailyQuote() {
  if (alarmRinging) return;
  const quote = pickDailyQuote();
  quoteHoldUntil = Date.now() + 8000;
  action = "wave";
  frameIndex = 0;
  window.clearTimeout(setAction.timer);
  message.textContent = `今日のひとこと：${quote}`;
}

function showLuckyFortune() {
  if (alarmRinging) return;
  const fortune = pickLuckyFortune();
  quoteHoldUntil = Date.now() + 8000;
  action = "wave";
  frameIndex = 0;
  window.clearTimeout(setAction.timer);
  message.textContent = `ラッキーお菓子：${fortune.sweet} / ラッキーカラー：${fortune.color} / ひとこと：${fortune.message}`;
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
  message.textContent = text;
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
  showExactTimeEvent(now);
  if (period !== lastPeriod && !timerRunning && !alarmRinging && Date.now() >= quoteHoldUntil) {
    lastPeriod = period;
    updateMoodDisplay();
    message.textContent = timePeriods[period].text;
  }
}

function chooseAction() {
  quoteHoldUntil = 0;
  const period = timePeriods[getTimePeriod()];
  const profile = updateMoodDisplay();
  const next = Math.random() < 0.55 ? period.action : randomItem(clickActions);
  setAction(next, randomItem([...period.replies, ...profile.messages]));
  mood = clamp(mood + (next === "sad" ? -4 : 3), 0, 99);
  energy = clamp(energy + (next === "run" ? -6 : 1), 0, 99);
  updateMoodDisplay();
  energyValue.textContent = energy;
}

function setAction(next, text = actions[next].text) {
  action = next;
  frameIndex = 0;
  message.textContent = text;
  window.clearTimeout(setAction.timer);
  if (next !== "idle" && !alarmRinging) {
    setAction.timer = window.setTimeout(() => setAction("idle", timerRunning ? "集中タイマー中だよ。いい調子！" : timePeriods[getTimePeriod()].text), next === "run" ? 1600 : 1200);
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
  setAction("cheer", "集中スタート！Pepaatennkoも応援しているよ");
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
  message.textContent = "一時停止中。準備できたらまた始めよう";
}

function resetFocusTimer() {
  stopAlarm();
  quoteHoldUntil = 0;
  timerRunning = false;
  window.clearInterval(timerId);
  remainingSeconds = selectedMinutes * 60;
  stageTimerLabel.textContent = "FOCUS";
  setTimerDisplays(remainingSeconds);
  message.textContent = timePeriods[getTimePeriod()].text;
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
  updateMoodDisplay();
  stageTimerLabel.textContent = "タップして止めてね";
  message.textContent = "おつかれさま！よくがんばったね！";
  setAction("cheer", "おつかれさま！よくがんばったね！");
  startAlarmLoop();
}

function prepareAlarm() {
  if (!alarmEnabled) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  if (!audioContext) audioContext = new AudioContextClass();
  if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
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

function playAlarmPattern() {
  if (!alarmEnabled) return;
  prepareAlarm();
  if (!audioContext || audioContext.state !== "running") return;
  const now = audioContext.currentTime;
  playTone(now, 880, 0.14);
  playTone(now + 0.2, 988, 0.14);
  playTone(now + 0.4, 1175, 0.22);
}

function startAlarmLoop() {
  window.clearInterval(alarmId);
  playAlarmPattern();
  alarmId = window.setInterval(() => {
    if (!alarmRinging) return;
    playAlarmPattern();
  }, 1200);
}

function stopAlarm() {
  const wasRinging = alarmRinging;
  alarmRinging = false;
  window.clearInterval(alarmId);
  stageTimerLabel.textContent = "FOCUS";
  if (audioContext && audioContext.state === "running") {
    audioContext.suspend().catch(() => {});
  }
  if (wasRinging) {
    quoteHoldUntil = 0;
    updateMoodDisplay();
    message.textContent = "おつかれさま！アラームを止めたよ";
    setAction("cheer", "おつかれさま！アラームを止めたよ");
  }
}

function toggleAlarm() {
  quoteHoldUntil = 0;
  alarmEnabled = !alarmEnabled;
  if (!alarmEnabled) stopAlarm();
  alarmToggleButton.classList.toggle("active", alarmEnabled);
  alarmToggleButton.textContent = alarmEnabled ? "アラームON" : "アラームOFF";
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
    targetX += alarmRinging ? 2.4 : 1.8;
    if (Math.abs(targetX) > stage.clientWidth * 0.24) targetX *= -1;
  } else {
    targetX *= 0.86;
  }
  x += (targetX - x) * 0.08;
  canvas.style.translate = `${x}px ${action === "cheer" || alarmRinging ? "-12px" : "0"}`;
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
dailyQuoteButton.addEventListener("click", showDailyQuote);
luckyFortuneButton.addEventListener("click", showLuckyFortune);

sheet.addEventListener("load", () => {
  frameWidth = Math.floor(sheet.naturalWidth / columns);
  frameHeight = Math.floor(sheet.naturalHeight / rows);
  canvas.width = Math.max(1, Math.round(frameWidth * 2));
  canvas.height = Math.max(1, Math.round(frameHeight * 2));
  drawFrame();
  requestAnimationFrame(animate);
});

sheet.addEventListener("error", () => {
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

updateClock();
updateMoodDisplay();
setTimerDisplays(remainingSeconds);
window.setInterval(updateClock, 1000);
registerServiceWorker();
