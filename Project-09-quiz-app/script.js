// ---- QUIZ QUESTIONS ----
const questions = [
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Hyper Transfer Markup Logic",
      "Home Tool Markup Language"
    ],
    correct: 0,
    explanation: "HTML stands for Hyper Text Markup Language — the standard language for creating web pages."
  },
  {
    question: "Which CSS property is used to change text color?",
    options: ["font-color", "text-color", "color", "foreground"],
    correct: 2,
    explanation: "The 'color' property sets the text color in CSS. font-color and text-color do not exist."
  },
  {
    question: "What does CSS stand for?",
    options: [
      "Creative Style Sheets",
      "Cascading Style Sheets",
      "Computer Style System",
      "Coded Styling Standard"
    ],
    correct: 1,
    explanation: "CSS stands for Cascading Style Sheets — used to style and layout HTML pages."
  },
  {
    question: "Which keyword declares a variable in modern JavaScript?",
    options: ["var", "let", "dim", "int"],
    correct: 1,
    explanation: "'let' is the modern way to declare variables in JavaScript. 'var' is older and has scope issues."
  },
  {
    question: "What does Git help developers do?",
    options: [
      "Design user interfaces",
      "Write faster JavaScript",
      "Track and manage code changes",
      "Deploy websites automatically"
    ],
    correct: 2,
    explanation: "Git is a version control system that tracks changes to code over time and enables collaboration."
  }
];

// ---- STATE VARIABLES ----
let currentQuestion = 0;
let score = 0;
let answered = false;
let timerInterval = null;
let timeLeft = 30;
let userAnswers = [];

// ---- START QUIZ ----
function startQuiz() {
  currentQuestion = 0;
  score = 0;
  answered = false;
  userAnswers = [];

  showScreen("quizScreen");
  loadQuestion();
}

// ---- LOAD CURRENT QUESTION ----
function loadQuestion() {
  answered = false;
  timeLeft = 30;

  const q = questions[currentQuestion];

  // Update question number and progress
  document.getElementById("questionNumber").textContent =
    `Question ${currentQuestion + 1} of ${questions.length}`;

  const progress = ((currentQuestion) / questions.length) * 100;
  document.getElementById("progressFill").style.width = progress + "%";

  // Set question text
  document.getElementById("questionText").textContent = q.question;

  // Build option buttons
  const optionsList = document.getElementById("optionsList");
  optionsList.innerHTML = q.options.map((option, index) => `
    <button class="option" onclick="selectAnswer(${index})">
      ${option}
    </button>
  `).join("");

  // Hide feedback and next button
  document.getElementById("feedback").classList.add("hidden");
  document.getElementById("nextBtn").classList.add("hidden");

  // Reset timer
  const timerEl = document.getElementById("timer");
  timerEl.classList.remove("urgent");

  clearInterval(timerInterval);
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 10) {
      timerEl.classList.add("urgent");
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timeOut();
    }
  }, 1000);
}

// ---- UPDATE TIMER DISPLAY ----
function updateTimerDisplay() {
  document.getElementById("timer").textContent = timeLeft;
}

// ---- TIME RAN OUT ----
function timeOut() {
  answered = true;
  userAnswers.push({ questionIndex: currentQuestion, selected: -1, correct: false });

  const options = document.querySelectorAll(".option");
  options.forEach(opt => opt.classList.add("disabled"));

  // Show correct answer
  options[questions[currentQuestion].correct].classList.add("correct");

  showFeedback(false, "⏰ Time's up! " + questions[currentQuestion].explanation);
  document.getElementById("nextBtn").classList.remove("hidden");
}

// ---- SELECT AN ANSWER ----
function selectAnswer(index) {
  if (answered) return;
  answered = true;

  clearInterval(timerInterval);

  const q = questions[currentQuestion];
  const options = document.querySelectorAll(".option");
  const isCorrect = index === q.correct;

  // Disable all options
  options.forEach(opt => opt.classList.add("disabled"));

  // Highlight correct and wrong
  options[q.correct].classList.add("correct");
  if (!isCorrect) {
    options[index].classList.add("wrong");
  }

  // Update score
  if (isCorrect) score++;

  // Store answer for breakdown
  userAnswers.push({
    questionIndex: currentQuestion,
    selected: index,
    correct: isCorrect
  });

  // Show feedback
  const message = isCorrect
    ? "✅ Correct! " + q.explanation
    : "❌ Not quite. " + q.explanation;

  showFeedback(isCorrect, message);
  document.getElementById("nextBtn").classList.remove("hidden");

  // Update next button text on last question
  if (currentQuestion === questions.length - 1) {
    document.getElementById("nextBtn").textContent = "See Results 🏆";
  }
}

// ---- SHOW FEEDBACK ----
function showFeedback(isCorrect, message) {
  const feedback = document.getElementById("feedback");
  feedback.textContent = message;
  feedback.className = "feedback " + (isCorrect ? "correct" : "wrong");
  feedback.classList.remove("hidden");
}

// ---- NEXT QUESTION ----
function nextQuestion() {
  currentQuestion++;

  if (currentQuestion >= questions.length) {
    showResults();
  } else {
    loadQuestion();
  }
}

// ---- SHOW RESULTS ----
function showResults() {
  clearInterval(timerInterval);
  showScreen("resultsScreen");

  // Set score
  document.getElementById("scoreText").textContent = score;

  // Set emoji and message based on score
  let emoji, message;
  if (score === 5) {
    emoji = "🏆"; message = "Perfect score! You're a web dev genius!";
  } else if (score >= 4) {
    emoji = "🌟"; message = "Excellent work! Almost perfect!";
  } else if (score >= 3) {
    emoji = "👍"; message = "Good job! Keep learning and you'll ace it!";
  } else if (score >= 2) {
    emoji = "📚"; message = "Keep studying — you're getting there!";
  } else {
    emoji = "💪"; message = "Don't give up! Review the topics and try again!";
  }

  document.getElementById("resultsEmoji").textContent = emoji;
  document.getElementById("resultsMessage").textContent = message;

  // Build breakdown
  const breakdown = document.getElementById("breakdown");
  breakdown.innerHTML = userAnswers.map(answer => {
    const q = questions[answer.questionIndex];
    const icon = answer.correct ? "✅" : "❌";
    return `
      <div class="breakdown-item">
        <span class="breakdown-icon">${icon}</span>
        <span>${q.question}</span>
      </div>
    `;
  }).join("");

  // Fill progress bar to 100%
  document.getElementById("progressFill").style.width = "100%";
}

// ---- RESTART QUIZ ----
function restartQuiz() {
  startQuiz();
}

// ---- SHOW A SCREEN ----
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.add("hidden");
  });
  document.getElementById(screenId).classList.remove("hidden");
}