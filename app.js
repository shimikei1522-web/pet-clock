const canvas = document.querySelector("#pet");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const stage = document.querySelector("#stage");
const message = document.querySelector("#message");
const moodValue = document.querySelector("#mood");
const energyValue = document.querySelector("#energy");
const clock = document.querySelector("#clock");
const timerDisplay = document.querySelector("#timerDisplay");
const timeChoices = document.querySelectorAll(".time-choice");
const customMinutes = document.querySelector("#customMinutes");
const startTimerButton = document.querySelector("#startTimer");
const pauseTimerButton = document.querySelector("#pauseTimer");
const resetTimerButton = document.querySelector("#resetTimer");

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
let lastPeriod = "";
let selectedMinutes = 5;
let remainingSeconds = selectedMinutes * 60;
let timerEndAt = 0;
let timerRunning = false;
let timerId = 0;

const timePeriods = {
  morning: {
    text: "おはようございます！今日もがんばろう！",
    replies: ["おはようございます！今日もがんばろう！", "朝だよ！まずは深呼吸して始めよう", "今日もいい一日にしようね"],
    action: "cheer",
  },
  afternoon: {
    text: "こんにちは！少し休憩しながら進めよう",
    replies: ["こんにちは！少し休憩しながら進めよう", "お昼の元気、まだまだあるよ", "無理しすぎず、いいペースでいこう"],
    action: "wave",
  },
  evening: {
    text: "おかえりなさい！おおつかれさまです！",
    replies: ["おかえりなさい！おおつかれさまです！", "夕方だね。ここまでよく進めたね", "ひと息ついて、あと少しだけやろう"],
    action: "snack",
  },
  night: {
    text: "遅くまでおつかれさま。夜更かしないでね",
    replies: ["遅くまでおつかれさま。夜更かしないでね", "夜はゆっくりモードでいこう", "そろそろ休む準備も忘れないでね"],
    action: "shy",
  },
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

function updateClock() {
  const now = new Date();
  const period = getTimePeriod(now);
  const value = formatTime(now);
  clock.textContent = value;
  clock.dateTime = now.toTimeString().slice(0, 8);

  if (period !== lastPeriod && !timerRunning) {
    lastPeriod = period;
    message.textContent = timePeriods[period].text;
  }
}

function chooseAction() {
  const period = timePeriods[getTimePeriod()];
  const next = Math.random() < 0.55 ? period.action : randomItem(clickActions);
  setAction(next, randomItem(period.replies));
  mood = clamp(mood + (next === "sad" ? -4 : 3), 0, 99);
  energy = clamp(energy + (next === "run" ? -6 : 1), 0, 99);
  moodValue.textContent = mood;
  energyValue.textContent = energy;
}

function setAction(next, text = actions[next].text) {
  action = next;
  frameIndex = 0;
  message.textContent = text;
  window.clearTimeout(setAction.timer);
  if (next !== "idle") {
    setAction.timer = window.setTimeout(() => setAction("idle", timerRunning ? "集中タイマー中だよ。いい調子！" : timePeriods[getTimePeriod()].text), next === "run" ? 1600 : 1200);
  }
}

function setSelectedMinutes(minutes) {
  selectedMinutes = clamp(Math.round(minutes), 1, 180);
  remainingSeconds = selectedMinutes * 60;
  timerEndAt = 0;
  timerRunning = false;
  window.clearInterval(timerId);
  timerDisplay.textContent = formatDuration(remainingSeconds);
}

function setActiveChoice(minutes) {
  timeChoices.forEach((button) => {
    const isActive = Number(button.dataset.minutes) === minutes;
    button.classList.toggle("active", isActive);
  });
}

function startFocusTimer() {
  if (timerRunning) return;
  if (remainingSeconds <= 0) {
    remainingSeconds = selectedMinutes * 60;
  }
  timerRunning = true;
  timerEndAt = Date.now() + remainingSeconds * 1000;
  message.textContent = "集中スタート！Pepaatennkoも応援しているよ";
  setAction("cheer", "集中スタート！Pepaatennkoも応援しているよ");
  window.clearInterval(timerId);
  timerId = window.setInterval(tickFocusTimer, 250);
  tickFocusTimer();
}

function pauseFocusTimer() {
  if (!timerRunning) return;
  timerRunning = false;
  remainingSeconds = Math.max(0, Math.ceil((timerEndAt - Date.now()) / 1000));
  window.clearInterval(timerId);
  timerDisplay.textContent = formatDuration(remainingSeconds);
  message.textContent = "一時停止中。準備できたらまた始めよう";
}

function resetFocusTimer() {
  timerRunning = false;
  window.clearInterval(timerId);
  remainingSeconds = selectedMinutes * 60;
  timerDisplay.textContent = formatDuration(remainingSeconds);
  message.textContent = timePeriods[getTimePeriod()].text;
}

function finishFocusTimer() {
  timerRunning = false;
  window.clearInterval(timerId);
  remainingSeconds = 0;
  timerDisplay.textContent = "00:00";
  mood = clamp(mood + 8, 0, 99);
  energy = clamp(energy + 3, 0, 99);
  moodValue.textContent = mood;
  energyValue.textContent = energy;
  setAction("cheer", "おつかれさま！よくがんばったね！");
  window.setTimeout(() => {
    if (!timerRunning) {
      remainingSeconds = selectedMinutes * 60;
      timerDisplay.textContent = formatDuration(remainingSeconds);
    }
  }, 2400);
}

function tickFocusTimer() {
  if (!timerRunning) return;
  remainingSeconds = Math.max(0, Math.ceil((timerEndAt - Date.now()) / 1000));
  timerDisplay.textContent = formatDuration(remainingSeconds);
  if (remainingSeconds === 0) {
    finishFocusTimer();
  }
}

function drawFrame() {
  const current = actions[action];
  const frame = current.frames[frameIndex % current.frames.length];
  const sx = frame * frameWidth;
  const sy = current.row * frameHeight;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(sheet, sx, sy, frameWidth, frameHeight, 0, 0, canvas.width, canvas.height);

  try {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    for (let i = 0; i < pixels.length; i += 4) {
      const brightness = Math.max(pixels[i], pixels[i + 1], pixels[i + 2]);
      if (brightness < 42) {
        pixels[i + 3] = 0;
      } else if (brightness < 72) {
        pixels[i + 3] = Math.round(pixels[i + 3] * ((brightness - 42) / 30));
      }
    }
    ctx.putImageData(imageData, 0, 0);
  } catch {
    // Some browsers lock pixel reads from double-clicked local files.
    // The pet still animates from the source sprite in that case.
  }
}

function animate(time = 0) {
  const current = actions[action];
  if (time - lastTick > current.speed) {
    frameIndex += 1;
    lastTick = time;
  }

  if (action === "run") {
    targetX += 1.8;
    if (Math.abs(targetX) > stage.clientWidth * 0.24) {
      targetX *= -1;
    }
  } else {
    targetX *= 0.86;
  }

  x += (targetX - x) * 0.08;
  canvas.style.translate = `${x}px ${action === "cheer" ? "-12px" : "0"}`;
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

stage.addEventListener("click", chooseAction);
stage.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    chooseAction();
  }
});
stage.tabIndex = 0;

updateClock();
timerDisplay.textContent = formatDuration(remainingSeconds);
window.setInterval(updateClock, 1000);
registerServiceWorker();
