let allQuestions = [];
let selectedQuestions = [];
let score = 0;

async function loadQuestions() {
  try {
    const response = await fetch('data.json');
    if (!response.ok) throw new Error('JSON লোড করতে সমস্যা হয়েছে');
    allQuestions = await response.json();
  } catch (err) {
    alert('প্রশ্ন লোড করতে সমস্যা: ' + err.message);
    allQuestions = [];
  }
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function startExam() {
  loadQuestions().then(() => {
    if (allQuestions.length === 0) {
      alert('প্রশ্ন পাওয়া যায়নি।');
      return;
    }

    const totalQuestions = parseInt(document.getElementById("qCount").value) || 25;
    selectedQuestions = shuffleArray([...allQuestions]).slice(0, totalQuestions);

    score = 0;
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
    card.id = `question-${i}`;

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
        // একবার সিলেক্ট করলে সবার জন্য সাবমিট চালু হবে, তবে একবার সিলেক্ট করা প্রশ্ন আর পরিবর্তন করা যাবে না
        if (document.querySelectorAll('input[type="radio"]:checked').length === selectedQuestions.length) {
          document.getElementById("submitBtn").disabled = false;
        }
      });

      div.appendChild(input);
      div.appendChild(label);
      cardBody.appendChild(div);
    });

    card.appendChild(cardBody);
    form.appendChild(card);
  });
}

function submitExam() {
  score = 0;
  selectedQuestions.forEach((q, i) => {
    const card = document.getElementById(`question-${i}`);
    const inputs = document.querySelectorAll(`input[name='q${i}']`);
    let selectedValue = null;

    inputs.forEach(input => {
      input.disabled = true;
      if (input.checked) selectedValue = input.value;
    });

    card.classList.remove("correct", "incorrect");

    if (selectedValue === q.answer) {
      score++;
      card.classList.add("correct");
    } else {
      card.classList.add("incorrect");
      // সঠিক উত্তরটাও সবুজ দেখানো
      inputs.forEach(input => {
        if (input.value === q.answer) {
          input.parentElement.classList.add("correct");
        }
      });
    }

    // ব্যাখ্যা দেখানো (যদি থাকে)
    if (q.explain && q.explain.trim() !== "") {
      let explanationDiv = card.querySelector(".explanation");
      if (!explanationDiv) {
        explanationDiv = document.createElement("div");
        explanationDiv.className = "alert alert-info explanation";
        card.appendChild(explanationDiv);
      }
      explanationDiv.textContent = `ব্যাখ্যা: ${q.explain}`;
    }
  });

  document.getElementById("result").textContent = `মোট স্কোর: ${score} / ${selectedQuestions.length}`;
  document.getElementById("submitBtn").disabled = true;
}
