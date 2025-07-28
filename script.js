const tripleGroups = [
  ['gt_audio/speaker1_ref.wav', 'gt_audio/speaker1_gt_noisy_reverb.wav', 'gt_audio/speaker1_gt.wav'],
  ['gt_audio/speaker2_gt_noisy_reverb.wav', 'gt_audio/speaker2_ref.wav', 'gt_audio/speaker2_gt.wav'],
  ['gt_audio/speaker3_ref.wav', 'gt_audio/speaker3_gt_noisy_reverb.wav', 'gt_audio/speaker3_gt.wav'],
  ['gt_audio/speaker4_ref.wav', 'gt_audio/speaker4_gt_noisy_reverb.wav', 'gt_audio/speaker4_gt.wav'],
  ['gt_audio/speaker5_gt_noisy_reverb.wav', 'gt_audio/speaker5_ref.wav', 'gt_audio/speaker5_gt.wav'],
  ['gt_audio/speaker6_gt_noisy_reverb.wav', 'gt_audio/speaker6_ref.wav', 'gt_audio/speaker6_gt.wav'],
  ['gt_audio/speaker7_ref.wav', 'gt_audio/speaker7_gt_noisy_reverb.wav', 'gt_audio/speaker7_gt.wav'],
  ['gt_audio/speaker8_gt_noisy_reverb.wav', 'gt_audio/speaker8_ref.wav', 'gt_audio/speaker8_gt.wav'],
  ['gt_audio/speaker9_ref.wav', 'gt_audio/speaker9_gt_noisy_reverb.wav', 'gt_audio/speaker9_gt.wav'],
  ['gt_audio/speaker10_ref.wav', 'gt_audio/speaker10_gt_noisy_reverb.wav', 'gt_audio/speaker10_gt.wav']
];

let current = 0;
let results = [];

window.onload = () => {
  document.getElementById("startButton").addEventListener("click", () => {
    document.getElementById("cover-page").style.display = "none";
    document.getElementById("questionnaire").style.display = "block";
    loadQuestion(current);
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
};

function loadQuestion(index) {
  document.getElementById("question-counter").textContent = `题目 ${index + 1} / ${tripleGroups.length}`;
  const [aSrc, bSrc, cSrc] = tripleGroups[index];
  document.getElementById("audioA").src = aSrc;
  document.getElementById("audioB").src = bSrc;
  document.getElementById("audioC").src = cSrc;
  document.getElementById("rating-form").reset();
}

function downloadCSV() {
  const header = Object.keys(results[0]).join(",");
  const lines = results.map(r => Object.values(r).join(","));
  const csv = [header, ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "triple_audio_results.csv";
  a.click();
}
