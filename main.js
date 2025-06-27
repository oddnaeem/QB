let allQuestions = []; let selectedQuestions = []; let score = 0; let attempted = 0; const NEGATIVE_MARK = 0.25;

async function loadQuestions() { try { const response = await fetch('Data.json'); if (!response.ok) throw new Error('JSON লোড করতে সমস্যা হয়েছে'); allQuestions = await response.json(); } catch (err) { alert('প্রশ্ন লোড করতে সমস্যা: ' + err.message); allQuestions = []; } }

function shuffleArray(array) { return array.sort(() => Math.random() - 0.5); }

function startExam() { loadQuestions().then(() => { if (allQuestions.length === 0) { alert('প্রশ্ন পাওয়া যায়নি।'); return; }

const subjects = ['Bangla', 'English', 'GK', 'Math', 'ICT'];
selectedQuestions = [];

for (const subject of subjects) {
  const subjectQuestions = allQuestions.filter(q => q.subject === subject);
  const shuffled = shuffleArray([...subjectQuestions]).slice(0, 5);
  selectedQuestions.push(...shuffled);
}

score = 0;
attempted = 0;
document.getElementById("startSection").classList.add("d-none");
document.getElementById("quizSection").classList.remove("d-none");
renderQuestions();

}); }

function renderQuestions() { const form = document.getElementById("quizForm"); form.innerHTML = "";

selectedQuestions.forEach((q, i) => { const card = document.createElement("div"); card.className = "card mb-3";

const cardHeader = document.createElement("div");
cardHeader.className = "card-header";
cardHeader.innerHTML = `<span class="badge bg-secondary">বিষয়: ${q.subject}</span>`;
card.appendChild(cardHeader);

const cardBody = document.createElement("div");
cardBody.className = "card-body";
cardBody.innerHTML = `<h5 class="card-title">${i + 1}. ${q.question}</h5>`;

shuffleArray(q.options).forEach((opt, idx) => {
  const div = document.createElement("div");
  div.className = "form-check";

  const input = document.createElement("input");
  input.className = "form-check-input";
  input.type = "radio";
  input.name = `q${i}`;
  input.value = opt;
  input.id = `q${i}opt${idx}`;

  const label = document.createElement("label");
  label.className = "form-check-label";
  label.setAttribute("for", `q${i}opt${idx}`);
  label.innerText = opt;

  input.addEventListener("change", () => {
    const allSelected = Array.from(document.querySelectorAll('input[type="radio"]')).filter(inp => inp.checked);
    if (allSelected.length === selectedQuestions.length) {
      document.getElementById("submitBtn").disabled = false;
    }
    const siblings = document.querySelectorAll(`input[name='q${i}']`);
    siblings.forEach(el => el.disabled = true);
  });

  div.appendChild(input);
  div.appendChild(label);
  cardBody.appendChild(div);
});

card.appendChild(cardBody);
form.appendChild(card);

}); }

function submitExam() { const form = document.getElementById("quizForm"); const questions = form.querySelectorAll(".card");

selectedQuestions.forEach((q, i) => { const inputs = document.querySelectorAll(input[name='q${i}']); let selected = null; inputs.forEach(input => { input.disabled = true; if (input.checked) selected = input.value; });

inputs.forEach(input => {
  if (input.value === q.answer) {
    input.parentElement.classList.add("bg-success", "text-white", "p-2", "rounded");
  }
  if (input.checked && input.value !== q.answer) {
    input.parentElement.classList.add("bg-danger", "text-white", "p-2", "rounded");
  }
});

if (selected === q.answer) {
  score++;
} else if (selected) {
  score -= NEGATIVE_MARK;
}

if (q.explain) {
  const explanation = document.createElement("div");
  explanation.className = "alert alert-info mt-2";
  explanation.textContent = `ব্যাখ্যা: ${q.explain}`;
  questions[i].appendChild(explanation);
}

});

document.getElementById("result").textContent = মোট স্কোর: ${score.toFixed(2)} / ${selectedQuestions.length}; document.getElementById("submitBtn").disabled = true; }
