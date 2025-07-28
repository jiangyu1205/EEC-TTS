// ====== 三元组任务数据 ======
const tripleGroups = [
  ['gt_audio/speaker1_gen_ref.wav', 'gt_audio/speaker1_gen_raw.wav', 'gt_audio/speaker1_gt.wav'],
  ['gt_audio/speaker2_gen_raw.wav', 'gt_audio/speaker2_gen_ref.wav', 'gt_audio/speaker2_gt.wav'],
  ['gt_audio/speaker3_gen_ref.wav', 'gt_audio/speaker3_gen_raw.wav', 'gt_audio/speaker3_gt.wav'],
  ['gt_audio/speaker4_gen_ref.wav', 'gt_audio/speaker4_gen_raw.wav', 'gt_audio/speaker4_gt.wav'],
  ['gt_audio/speaker5_gen_raw.wav', 'gt_audio/speaker5_gen_ref.wav', 'gt_audio/speaker5_gt.wav'],
  ['gt_audio/speaker6_gen_raw.wav', 'gt_audio/speaker6_gen_ref.wav', 'gt_audio/speaker6_gt.wav'],
  ['gt_audio/speaker7_gen_ref.wav', 'gt_audio/speaker7_gen_raw.wav', 'gt_audio/speaker7_gt.wav'],
  ['gt_audio/speaker8_gen_raw.wav', 'gt_audio/speaker8_gen_ref.wav', 'gt_audio/speaker8_gt.wav'],
  ['gt_audio/speaker9_gen_ref.wav', 'gt_audio/speaker9_gen_raw.wav', 'gt_audio/speaker9_gt.wav'],
  ['gt_audio/speaker10_gen_ref.wav', 'gt_audio/speaker10_gen_raw.wav', 'gt_audio/speaker10_gt.wav']
];

// ====== 情感分类任务数据 ======
const emotionAudios = [
  'emotion_audio/0003_000371_seed15_0.wav',
  'emotion_audio/0003_000379_seed38_0.wav',
  'emotion_audio/0003_000371_seed100_0.wav',
  'emotion_audio/0003_000371_seed23_0.wav',
  'emotion_audio/0012_001072_seed2_0.wav',
  'emotion_audio/0019_001079.wav',
  'emotion_audio/0019_001071.wav',
  'emotion_audio/0019_000400.wav',
  'emotion_audio/0019_001072.wav',
  'emotion_audio/0019_000399.wav'
];

// ====== 全局状态变量 ======
let current = 0;
let results = [];
let emotionResults = [];

// ====== 页面加载时绑定事件 ======
window.onload = () => {
  document.getElementById("startAB").addEventListener("click", () => {
    document.getElementById("cover-page").style.display = "none";
    document.getElementById("questionnaire").style.display = "block";
    current = 0;
    results = [];
    loadQuestion(current);
  });

  document.getElementById("startEmotion").addEventListener("click", () => {
    document.getElementById("cover-page").style.display = "none";
    document.getElementById("emotion-task").style.display = "block";
    current = 0;
    emotionResults = [];
    loadEmotionQuestion(current);
  });

  document.getElementById("rating-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const emotion = formData.get("emotion_similarity");
    const quality = formData.get("audio_quality");

    results.push({
      question: current + 1,
      audioA: tripleGroups[current][0],
      audioB: tripleGroups[current][1],
      audioC: tripleGroups[current][2],
      emotionSimilarity: emotion,
      audioQuality: quality,
      timestamp: new Date().toISOString()
    });

    current++;
    if (current < tripleGroups.length) {
      loadQuestion(current);
    } else {
      document.getElementById("rating-form").style.display = "none";
      document.getElementById("complete").style.display = "block";
    }
  });

  document.getElementById("emotion-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const label = formData.get("emotion_label");

    emotionResults.push({
      question: current + 1,
      audio: emotionAudios[current],
      label: label,
      timestamp: new Date().toISOString()
    });

    current++;
    if (current < emotionAudios.length) {
      loadEmotionQuestion(current);
    } else {
      document.getElementById("emotion-form").style.display = "none";
      document.getElementById("complete-emotion").style.display = "block";
    }
  });
};

// ====== 加载三元组任务题目 ======
function loadQuestion(index) {
  document.getElementById("question-counter").textContent = `题目 ${index + 1} / ${tripleGroups.length}`;
  const [aSrc, bSrc, cSrc] = tripleGroups[index];
  document.getElementById("audioA").src = aSrc;
  document.getElementById("audioB").src = bSrc;
  document.getElementById("audioC").src = cSrc;
  document.getElementById("rating-form").reset();
}

// ====== 加载情感分类题目 ======
function loadEmotionQuestion(index) {
  document.getElementById("emotion-counter").textContent = `题目 ${index + 1} / ${emotionAudios.length}`;
  document.getElementById("emotionAudio").src = emotionAudios[index];
  document.getElementById("emotion-form").reset();
}

// ====== 下载三元组任务结果 ======
function downloadCSV() {
  if (results.length === 0) return;
  const header = Object.keys(results[0]).join(",");
  const lines = results.map(r => Object.values(r).join(","));
  const csv = [header, ...lines].join("\n");
  downloadBlob(csv, "triple_audio_results.csv");
}

// ====== 下载情感任务结果 ======
function downloadEmotionCSV() {
  if (emotionResults.length === 0) return;
  const header = Object.keys(emotionResults[0]).join(",");
  const lines = emotionResults.map(r => Object.values(r).join(","));
  const csv = [header, ...lines].join("\n");
  downloadBlob(csv, "emotion_label_results.csv");
}

// ====== 通用下载函数 ======
function downloadBlob(content, filename) {
  const blob = new Blob([content], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}
