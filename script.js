// ====== Triplet Task Data ======
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

// ====== Emotion Classification Task Data ======
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

// ====== Age Classification Task Data ======
const ageAudios = [
  'age_audio/00025.wav',
  'age_audio/00057.wav',
  'age_audio/00093.wav',
  'age_audio/00120.wav',
  'age_audio/00044.wav',
  'age_audio/00029.wav',
  'age_audio/00268.wav',
  'age_audio/00186.wav',
  'age_audio/00208.wav',
  'age_audio/00445.wav'
];

const ageImages = [
  'age_audio/0176_01.jpg',
  'age_audio/0043_01.jpg',
  'age_audio/0652_01.jpg',
  'age_audio/0574_01.jpg',
  'age_audio/0332_01.jpg',
  'age_audio/0096_01.jpg',
  'age_audio/0202_01.jpg',
  'age_audio/0178_01.jpg',
  'age_audio/0175_01.jpg',
  'age_audio/0129_01.jpg'
];

// ====== Global State Variables ======
let current = 0;
let results = [];
let emotionResults = [];
let ageResults = [];

// ====== Event Binding on Page Load ======
window.onload = () => {
  document.getElementById("startAB").addEventListener("click", () => {
    showTask("questionnaire");
    current = 0;
    results = [];
    loadQuestion(current);
  });

  document.getElementById("startEmotion").addEventListener("click", () => {
    showTask("emotion-task");
    current = 0;
    emotionResults = [];
    loadEmotionQuestion(current);
  });

  document.getElementById("startAge").addEventListener("click", () => {
    showTask("age-task");
    current = 0;
    ageResults = [];
    loadAgeQuestion(current);
  });

  // A-B Task Submission
  document.getElementById('rating-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const emotion = formData.get('emotion_similarity');
    const quality = formData.get('audio_quality');

    results.push({
      question: current + 1,
      audioA: tripleGroups[current][0],
      audioB: tripleGroups[current][1],
      audioC: tripleGroups[current][2],
      emotionSimilarity: emotion,
      audioQuality: quality,
      timestamp: new Date().toISOString(),
    });

    current++;
    if (current < tripleGroups.length) {
      loadQuestion(current);
    } else {
      document.getElementById('rating-form').style.display = 'none';
      document.getElementById('complete').style.display = 'block';
    }
  });

  // Emotion Task Submission
  document.getElementById('emotion-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const label = formData.get('emotion_label');

    emotionResults.push({
      question: current + 1,
      audio: emotionAudios[current],
      label: label,
      timestamp: new Date().toISOString(),
    });

    current++;
    if (current < emotionAudios.length) {
      loadEmotionQuestion(current);
    } else {
      document.getElementById('emotion-form').style.display = 'none';
      document.getElementById('complete-emotion').style.display = 'block';
    }
  });

  // Age Task Submission
  document.getElementById('age-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('age_input');
    const value = input.value.trim();

    if (!/^\d+$/.test(value)) {
      alert("Please enter a valid integer age.");
      return;
    }

    ageResults.push({
      question: current + 1,
      audio: ageAudios[current],
      label: value,
      timestamp: new Date().toISOString(),
    });

    current++;
    if (current < ageAudios.length) {
      loadAgeQuestion(current);
    } else {
      document.getElementById('age-form').style.display = 'none';
      document.getElementById('complete-age').style.display = 'block';
    }
  });
};

// ====== Download A-B Task Result ======
function downloadCSV() {
  if (results.length === 0) return alert('No A-B results to download.');
  const header = Object.keys(results[0]).join(',');
  const lines = results.map((r) => Object.values(r).join(','));
  const csv = [header, ...lines].join('\n');
  downloadBlob(csv, 'triple_audio_results.csv');
}

// ====== Download Emotion Task Result ======
function downloadEmotionCSV() {
  if (emotionResults.length === 0) return alert('No emotion results to download.');
  const header = Object.keys(emotionResults[0]).join(',');
  const lines = emotionResults.map((r) => Object.values(r).join(','));
  const csv = [header, ...lines].join('\n');
  downloadBlob(csv, 'emotion_label_results.csv');
}

// ====== Download Age Task Result ======
function downloadAgeCSV() {
  if (ageResults.length === 0) return alert('No age results to download.');
  const header = Object.keys(ageResults[0]).join(',');
  const lines = ageResults.map((r) => Object.values(r).join(','));
  const csv = [header, ...lines].join('\n');
  downloadBlob(csv, 'age_label_results.csv');
}

// ====== General CSV Downloader ======
function downloadBlob(content, filename) {
  const blob = new Blob([content], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

// ====== Show Selected Task, Hide Others ======
function showTask(taskId) {
  document.getElementById('cover-page').style.display = 'none';
  const tasks = ['questionnaire', 'emotion-task', 'age-task', 'complete', 'complete-emotion', 'complete-age'];
  tasks.forEach(id => {
    document.getElementById(id).style.display = (id === taskId) ? 'block' : 'none';
  });
  ['rating-form', 'emotion-form', 'age-form'].forEach(formId => {
    document.getElementById(formId).style.display = 'block';
  });
}

// ====== Load Triplet Task Question ======
function loadQuestion(index) {
  document.getElementById("question-counter").textContent = `Question ${index + 1} / ${tripleGroups.length}`;
  const [aSrc, bSrc, cSrc] = tripleGroups[index];
  document.getElementById("audioA").src = aSrc;
  document.getElementById("audioB").src = bSrc;
  document.getElementById("audioC").src = cSrc;
  document.getElementById("rating-form").reset();
}

// ====== Load Emotion Task Question ======
function loadEmotionQuestion(index) {
  document.getElementById("emotion-counter").textContent = `Question ${index + 1} / ${emotionAudios.length}`;
  document.getElementById("emotionAudio").src = emotionAudios[index];
  document.getElementById("emotion-form").reset();
}

// ====== Load Age Task Question ======
function loadAgeQuestion(index) {
  document.getElementById("age-counter").textContent = `Question ${index + 1} / ${ageAudios.length}`;
  const audioPath = ageAudios[index];
  document.getElementById("ageAudio").src = audioPath;
  document.getElementById("ageImage").src = ageImages[index];
  document.getElementById("age-form").reset();
}

function downloadFile(filePath, fileName) {
  const link = document.createElement('a');
  link.href = filePath;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 下载已有的 AB 答案
function downloadABAnswer() {
  downloadFile('answers/ab.txt', 'ab.txt');
}

// 下载已有的 Emotion 答案
function downloadEmotionAnswer() {
  downloadFile('answers/emotion.txt', 'label.txt');
}

// 下载已有的 Age 答案
function downloadAgeAnswer() {
  downloadFile('answers/age.txt', 'age.txt');
}
