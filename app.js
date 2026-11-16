const quizForm = document.querySelector('#quiz-form');
const questionsContainer = document.querySelector('#quiz-questions');
const questionCount = document.querySelector('#question-count');
const submitButton = quizForm.querySelector('button[type="submit"]');
const retryButton = document.querySelector('#retry-button');
const quizAlert = document.querySelector('#quiz-alert');
const quizResult = document.querySelector('#quiz-result');

const answerStyleClasses = [
  'fw-semibold',
  'bg-success-subtle',
  'text-success-emphasis',
  'bg-danger-subtle',
  'text-danger-emphasis'
];

// незаповнені питання.
function showAlert(message) {
  quizAlert.textContent = message;
  quizAlert.classList.remove('d-none');
}

function hideAlert() {
  quizAlert.textContent = '';
  quizAlert.classList.add('d-none');
}

// результат тесту.
function showResult(correctCount, totalCount) {
  quizResult.textContent = `Correct answers: ${correctCount} / ${totalCount}.`;
  quizResult.classList.remove('d-none');
}

function hideResult() {
  quizResult.textContent = '';
  quizResult.classList.add('d-none');
}

function renderQuestions(questions) {
  questionsContainer.replaceChildren();

  questions.forEach(function (question, questionIndex) {
    if (questionIndex > 0) {
      const separator = document.createElement('hr');
      separator.className = 'my-4';
      questionsContainer.append(separator);
    }

    const fieldset = document.createElement('fieldset');
    fieldset.className = 'mb-4';
    fieldset.dataset.correctAnswer = question.correctAnswer;

    const legend = document.createElement('legend');
    legend.className = 'fs-5 fw-semibold mb-3';
    legend.textContent = `${questionIndex + 1}. ${question.text}`;
    fieldset.append(legend);

    question.answers.forEach(function (answer, answerIndex) {
      const wrapper = document.createElement('div');
      wrapper.className = 'form-check rounded py-2 px-5 mb-2';

      const input = document.createElement('input');
      input.className = 'form-check-input';
      input.type = 'radio';
      input.name = question.id;
      input.id = `${question.id}-${answerIndex}`;
      input.value = answer.value;

      const label = document.createElement('label');
      label.className = 'form-check-label';
      label.htmlFor = input.id;
      label.textContent = answer.text;

      wrapper.append(input, label);
      fieldset.append(wrapper);
    });

    questionsContainer.append(fieldset);
  });

  questionCount.textContent = `${questions.length} questions`;
}

// Прибирає підсвічування 
function clearAnswerStyles(question) {
  question.querySelectorAll('.form-check').forEach(function (answer) {
    answer.classList.remove(...answerStyleClasses);
  });

  question.querySelectorAll('.form-check-input').forEach(function (input) {
    input.classList.remove('is-valid', 'is-invalid');
  });
}

// Підсвічує відповідь 
function highlightAnswer(input, status) {
  const answer = input.closest('.form-check');
  const colorClasses = status === 'correct'
    ? ['bg-success-subtle', 'text-success-emphasis']
    : ['bg-danger-subtle', 'text-danger-emphasis'];

  answer.classList.add('fw-semibold');
  answer.classList.add(...colorClasses);
  input.classList.add(status === 'correct' ? 'is-valid' : 'is-invalid');
}

// Завдання 1
function areAllQuestionsAnswered(questions) {
  for (const question of questions) {
    const selectedAnswer = question.querySelector('input[type="radio"]:checked');
    if (!selectedAnswer) {
      return false;
    }
  }
  return true;
}

// Перевіряємо заповнення
quizForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const questions = quizForm.querySelectorAll('fieldset');

  // Завдання 1
  if (!areAllQuestionsAnswered(questions)) {
    showAlert('Answer all the questions.');
    return;
  }

  hideAlert();

  // Завдання 2
  let correctAnswersCount = 0;

  questions.forEach(function (question) {
    clearAnswerStyles(question);

    const selectedAnswer = question.querySelector('input[type="radio"]:checked');
    const correctAnswer = question.dataset.correctAnswer;
    const correctInput = question.querySelector(
      `input[value="${correctAnswer}"]`
    );

    if (selectedAnswer.value === correctAnswer) {
      highlightAnswer(selectedAnswer, 'correct');
      correctAnswersCount += 1;
    } else {
      highlightAnswer(selectedAnswer, 'incorrect');
      highlightAnswer(correctInput, 'correct');
    }
  });

  
  showResult(correctAnswersCount, questions.length);

  quizForm.querySelectorAll('input[type="radio"]').forEach(function (input) {
    input.disabled = true;
  });

  submitButton.disabled = true;
});

// Завдання 3
retryButton.addEventListener('click', function () {
  const questions = quizForm.querySelectorAll('fieldset');

  questions.forEach(function (question) {
    clearAnswerStyles(question);

    question.querySelectorAll('input[type="radio"]').forEach(function (input) {
      input.checked = false;
      input.disabled = false;
    });
  });

  hideAlert();
  hideResult();
  submitButton.disabled = false;
});

const quizQuestions = fetchQuizQuestions();
renderQuestions(quizQuestions);
submitButton.disabled = false;
//yz