const questionGroups = [
  ['audio/1_left.wav', 'audio/1_right.wav'],
  ['audio/2_left.wav', 'audio/2_right.wav'],
  ['audio/3_left.wav', 'audio/3_right.wav']
];

let current = 0;
let results = [];

window.onload = () => {
  document.getElementById("startButton").addEventListener("click", startQuestionnaire);
  loadQuestion(current);
};

function startQuestionnaire() {
  document.getElementById("cover-page").style.display = "none";
  document.getElementById("questionnaire").style.display = "block";
}

function loadQuestion(index) {
  document.getElementById("question-counter").textContent = `题目 ${index + 1} / ${questionGroups.length}`;
  const [leftSrc, rightSrc] = questionGroups[index];
  document.getElementById("audioLeft").src = leftSrc;
  document.getElementById("audioRight").src = rightSrc;
  document.getElementById("rating-form").reset();
}

document.getElementById("rating-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const selected = new FormData(e.target).get("preference");
  results.push({
    question: current + 1,
    leftAudio: questionGroups[current][0],
    rightAudio: questionGroups[current][1],
    preference: selected,
    timestamp: new Date().toISOString()
  });
  current++;
  if (current < questionGroups.length) {
    loadQuestion(current);
  } else {
    document.getElementById("rating-form").style.display = "none";
    document.getElementById("complete").style.display = "block";
  }
});

function downloadCSV() {
  const header = Object.keys(results[0]).join(",");
  const lines = results.map(r => Object.values(r).join(","));
  const csv = [header, ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "ab_test_results.csv";
  a.click();
}
