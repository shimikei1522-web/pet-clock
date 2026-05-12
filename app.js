const canvas = document.querySelector("#petSprite");
const photoPet = document.querySelector("#petPhoto");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const stage = document.querySelector("#stage");
const message = document.querySelector("#message");
const moodValue = document.querySelector("#mood");
const energyValue = document.querySelector("#energy");
const clock = document.querySelector("#clock");

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

const timePeriods = {
  morning: {
    text: "おはようございます！今日もがんばろう！",
    replies: [
      "おはようございます！今日もがんばろう！",
      "朝だよ！まずは深呼吸して始めよう",
      "今日もいい一日にしようね",
    ],
    action: "cheer",
  },
  afternoon: {
    text: "こんにちは！少し休憩しながら進めよう",
    replies: [
      "こんにちは！少し休憩しながら進めよう",
      "お昼の元気、まだまだあるよ",
      "無理しすぎず、いいペースでいこう",
    ],
    action: "wave",
  },
  evening: {
    text: "おかえりなさい！おおつかれさまです！",
    replies: [
      "おかえりなさい！おおつかれさまです！",
      "夕方だね。ここまでよく進めたね",
      "ひと息ついて、あと少しだけやろう",
    ],
    action: "snack",
  },
  night: {
    text: "遅くまでおつかれさま。夜更かしないでね",
    replies: [
      "遅くまでおつかれさま。夜更かしないでね",
      "夜はゆっくりモードでいこう",
      "そろそろ休む準備も忘れないでね",
    ],
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
  return [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
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

  if (period !== lastPeriod) {
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
    setAction.timer = window.setTimeout(() => setAction("idle", timePeriods[getTimePeriod()].text), next === "run" ? 1600 : 1200);
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

function movePets(offsetX, offsetY) {
  const value = `${offsetX}px ${offsetY}px`;
  canvas.style.translate = value;
  photoPet.style.translate = value;
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
  movePets(x, action === "cheer" ? -12 : 0);
  drawFrame();
  requestAnimationFrame(animate);
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  if (!["http:", "https:"].includes(window.location.protocol)) return;
  navigator.serviceWorker.register("./service-worker.js").catch(() => {});
}

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
window.setInterval(updateClock, 1000);
registerServiceWorker();
