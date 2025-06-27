let allQuestions = [];
let selectedQuestions = [];
let score = 0;
const NEGATIVE_MARK = 0.25;

// প্রশ্ন JSON ফাইল থেকে লোড করবে
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

// অ্যারে এলোমেলো করার ফাংশন
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// একবার স্টার্ট করলে প্রশ্ন সিলেক্ট করবে, ৫টা করে প্রতিটি সাবজেক্ট থেকে
async function startExam() {
  await loadQuestions();

  if (allQuestions.length === 0) {
    alert('প্রশ্ন পাওয়া যায়নি।');
    return;
  }

  const subjects = ['Bangla', 'English', 'Math', 'ICT', 'GK'];
  selectedQuestions = [];

  subjects.forEach(subject => {
    const filtered = allQuestions.filter(q => q.subject === subject);
    const shuffled = shuffleArray(filtered).slice(0, 5);
    selectedQuestions.push(...shuffled);
  });

  score = 0;
  document.getElementById("startSection").classList.add("d-none");
  document.getElementById("quizSection").classList.remove("d-none");
  renderQuestions();
  document.getElementById("submitBtn").disabled = true;
  document.getElementById("result").textContent = '';
}

// প্রশ্নগুলো রেন্ডার করবে
function renderQuestions() {
  const form = document.getElementById("quizForm");
  form.innerHTML = "";

  selectedQuestions.forEach((q, i) => {
    const card = document.createElement("div");
    card.className = "card mb-3";

    const cardHeader = document.createElement("div");
    cardHeader.className = "card-header";
    cardHeader.innerHTML = `<span class="badge bg-secondary">বিষয়: ${q.subject}</span>`;
    card.appendChild(cardHeader);

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const questionTitle = document.createElement("h5");
    questionTitle.className = "card-title question-title";
    questionTitle.textContent = `${i + 1}. ${q.question}`;
    cardBody.appendChild(questionTitle);

    q.options.forEach((opt, idx) => {
      const optionId = `q${i}opt${idx}`;

      const div = document.createElement("div");
      div.className = "form-check";

      const input = document.createElement("input");
      input.className = "form-check-input";
      input.type = "radio";
      input.name = `q${i}`;
      input.value = opt;
      input.id = optionId;

      const label = document.createElement("label");
      label.className = "form-check-label option-label";
      label.setAttribute("for", optionId);
      label.textContent = opt;

      // একবার সিলেক্ট করার পর আর পরিবর্তন করা যাবে না
      input.addEventListener("change", () => {
        // disable same প্রশ্নের অন্য অপশন গুলো
        const inputs = document.querySelectorAll(`input[name='q${i}']`);
        inputs.forEach(inp => inp.disabled = true);

        // চেক যদি হয় তাহলে সাবমিট বাটন এনেবল করো যদি সব প্রশ্নে উত্তর দেয়া হয়
        if (allQuestionsAnswered()) {
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

// সব প্রশ্নে উত্তর হয়েছে কিনা চেক করবে
function allQuestionsAnswered() {
  for (let i = 0; i < selectedQuestions.length; i++) {
    const checked = document.querySelector(`input[name='q${i}']:checked`);
    if (!checked) return false;
  }
  return true;
}

// সাবমিট ফাংশন: সঠিক/ভুল দেখাবে, ব্যাকগ্রাউন্ড কালার দিবে, ব্যাখ্যা দেখাবে
function submitExam() {
  score = 0;
  for (let i = 0; i < selectedQuestions.length; i++) {
    const q = selectedQuestions[i];
    const inputs = document.querySelectorAll(`input[name='q${i}']`);
    let selectedValue = null;

    inputs.forEach(input => {
      input.disabled = true;
      if (input.checked) selectedValue = input.value;
    });

    inputs.forEach(input => {
      const label = document.querySelector(`label[for='${input.id}']`);
      label.classList.remove("correct", "incorrect");
      if (input.value === q.answer) {
        label.classList.add("correct");
      }
      if (input.checked) {
        if (input.value === q.answer) {
          score++;
        } else {
          label.classList.add("incorrect");
        }
      }
    });

    // ব্যাখ্যা দেখাবে যদি থাকে
    if (q.explain && q.explain.trim() !== "") {
      const card = inputs[0].closest(".card-body");
      const existingExplanation = card.querySelector(".explanation");
      if (!existingExplanation) {
        const explanationDiv = document.createElement("div");
        explanationDiv.className = "explanation";
        explanationDiv.textContent = `ব্যাখ্যা: ${q.explain}`;
        card.appendChild(explanationDiv);
      }
    }
  }

  document.getElementById("result").textContent = `মোট স্কোর: ${score} / ${selectedQuestions.length}`;
  document.getElementById("submitBtn").disabled = true;
}
