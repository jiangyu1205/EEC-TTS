
const questionGroups = [
['demo_all/see2sound/2b81e2de-6380-46f7-b46b-00ce187b7f1c.mp4', 'demo_all/mmaudio/2b81e2de-6380-46f7-b46b-00ce187b7f1c.mp4', 'demo_all/FoleySpace/2b81e2de-6380-46f7-b46b-00ce187b7f1c.mp4'],
['demo_all/see2sound/68f2197a-d021-4aab-8973-11c41866489c.mp4', 'demo_all/mmaudio/68f2197a-d021-4aab-8973-11c41866489c.mp4', 'demo_all/FoleySpace/68f2197a-d021-4aab-8973-11c41866489c.mp4'],
];

let current = 0;
let results = [];

window.onload = () => {
  document.getElementById("startButton").addEventListener("click", startQuestionnaire);
  populateRadios();
  loadQuestion(current);
};

function startQuestionnaire() {
  document.getElementById("cover-page").style.display = "none";
  document.getElementById("questionnaire").style.display = "block";
}

function populateRadios() {
  for (let i = 0; i < 3; i++) {
    ["audioQuality", "spatialConsistency", "semanticConsistency", "temporalConsistency", "userPreference"].forEach(metric => {
      const container = document.getElementById(metric + i);
      container.innerHTML = "";
      for (let v = 1; v <= 5; v++) {
        const label = document.createElement("label");
        label.innerHTML = `<input type="radio" name="${metric}${i}" value="${v}" required> ${v}`;
        container.appendChild(label);
      }
    });
  }
}

function loadQuestion(index) {
  document.getElementById("question-counter").textContent = `题目 ${index + 1} / ${questionGroups.length}`;
  const videos = questionGroups[index];
  videos.forEach((src, i) => {
    document.getElementById(`video${i}`).src = src;
  });
  document.getElementById("rating-form").reset();
}

document.getElementById("rating-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  for (let i = 0; i < 3; i++) {
    results.push({
      question: current + 1,
      video: questionGroups[current][i],
      audioQuality: data.get(`audioQuality${i}`),
      spatialConsistency: data.get(`spatialConsistency${i}`),
      semanticConsistency: data.get(`semanticConsistency${i}`),
      temporalConsistency: data.get(`temporalConsistency${i}`),
      userPreference: data.get(`userPreference${i}`),
      timestamp: new Date().toISOString()
    });
  }
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
  a.download = "user_study_results.csv";
  a.click();
}