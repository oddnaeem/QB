let allQuestions = [];
let selectedQuestions = [];
let score = 0;

async function loadQuestions() {
  const response = await fetch("data.json");
  allQuestions = await response.json();
}

function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function startExam() {
  loadQuestions().then(() => {
    const subjects = ["Bangla", "English", "Math", "ICT", "GK"];
    selectedQuestions = [];

    for (let subject of subjects) {
      const subjectQs = allQuestions.filter(q => q.subject === subject);
      selectedQuestions.push(...shuffleArray(subjectQs).slice(0, 5));
    }

    document.getElementById("startSection").classList.add("d-none");
    document.getElementById("quizSection").classList.remove("d-none");
    renderQuestions();
  });
}

function renderQuestions() {
  const form = document.getElementById("quizForm");
  form.innerHTML = "";

  selectedQuestions.forEach((q, i) => {
    const card = document.createElement("div");
    card.className = "card mb-3";

    const header = document.createElement("div");
    header.className = "card-header";
    header.innerHTML = `<span class="badge bg-secondary">বিষয়: ${q.subject}</span>`;
    card.appendChild(header);

    const body = document.createElement("div");
    body.className = "card-body";
    body.innerHTML = `<h5>${i + 1}. ${q.question}</h5>`;
    body.setAttribute("data-index", i);

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
        const inputs = document.getElementsByName(`q${i}`);
        inputs.forEach(inp => (inp.disabled = true));

        if (opt === q.answer) {
          input.parentElement.classList.add("correct");
        } else {
          input.parentElement.classList.add("incorrect");
          const correctInput = [...inputs].find(inp => inp.value === q.answer);
          if (correctInput) {
            correctInput.parentElement.classList.add("correct");
          }
        }

        if (q.explain) {
          const ex = document.createElement("div");
          ex.className = "alert alert-info mt-2";
          ex.textContent = `ব্যাখ্যা: ${q.explain}`;
          card.appendChild(ex);
        }
      });

      div.appendChild(input);
      div.appendChild(label);
      body.appendChild(div);
    });

    card.appendChild(body);
    form.appendChild(card);
  });
}

function submitExam() {
  let total = selectedQuestions.length;
  let correct = 0;

  selectedQuestions.forEach((q, i) => {
    const inputs = document.getElementsByName(`q${i}`);
    inputs.forEach(input => {
      input.disabled = true;
      if (input.checked && input.value === q.answer) {
        correct++;
      }
    });
  });

  document.getElementById("result").textContent = `মোট স্কোর: ${correct} / ${total}`;
}
