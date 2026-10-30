const sections = Array.from(document.querySelectorAll('main .lesson'));
const navLinks = Array.from(document.querySelectorAll('#lesson-nav a'));
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const themeToggle = document.getElementById('theme-toggle');
const tabs = Array.from(document.querySelectorAll('.tab'));
const panels = Array.from(document.querySelectorAll('.panel'));

let current = 0;

// ---------- Questions (check-ins and quiz) ----------

// A "choice" question has options and the index of the right one.
// A "text" question has a list of accepted answers.
const checkins = {
  'outcomes': {
    type: 'choice',
    text: 'What does an if statement let a program do?',
    options: [
      'Choose which lines run, depending on a condition',
      'Repeat the same lines many times',
      'Store a value in a variable',
      'Display text on the screen'
    ],
    answer: 0,
    explain: 'An if statement checks a condition and runs its lines only when the condition is true.'
  },
  'recap': {
    type: 'text',
    text: "What does len('Python') return?",
    answers: ['6'],
    explain: "'Python' has 6 characters, and len() counts them."
  },
  'if-statement': {
    type: 'choice',
    text: 'What does this code display?',
    code: "a = 12\nif a < 10:\n    print('small')",
    options: ['small', 'Nothing', 'An IndentationError', '12'],
    answer: 1,
    explain: 'a < 10 is False when a is 12, so Python skips the indented action.'
  },
  'comparison-operators': {
    type: 'text',
    text: 'What does print(5 != 5) display?',
    answers: ['false'],
    explain: '!= means "not equal to", and 5 is equal to 5, so the result is False.'
  },
  'elif-else': {
    type: 'choice',
    text: 'In an if / elif / else chain where two conditions are both true, how many blocks run?',
    options: [
      'Only the first block whose condition is true',
      'Both blocks',
      'Both blocks, then the else block',
      'None of them'
    ],
    answer: 0,
    explain: 'Python runs the first block whose condition is true and skips the rest of the chain.'
  },
  'logical-operators': {
    type: 'text',
    text: 'What does print(a > 0 and b > 0) display?',
    code: 'a = 3\nb = -1',
    answers: ['false'],
    explain: 'and needs both sides to be true, but b > 0 is False when b is -1.'
  },
  'exercises': {
    type: 'choice',
    text: 'In Exercise 1, why does each grade branch use and?',
    options: [
      'To check both ends of a score range',
      'To join two strings together',
      'To repeat the code',
      'To turn the input into a number'
    ],
    answer: 0,
    explain: 'A range such as 14 to 15 needs the score to be at least 14 and at most 15.'
  },
  'summary': {
    type: 'choice',
    text: 'Which logical operator flips True to False (and False to True)?',
    options: ['and', 'or', 'not', 'elif'],
    answer: 2,
    explain: 'not reverses a Boolean result.'
  }
};

const quizQuestions = [
  {
    type: 'choice',
    text: 'What does this code display?',
    code: "word = 'love'\nprint(word.replace('e', 'o'))",
    options: ['lovo', 'leve', 'levo', 'love'],
    answer: 0,
    explain: "replace() swaps every 'e' for an 'o'."
  },
  {
    type: 'choice',
    text: 'What happens if the line under an if statement is not indented?',
    options: [
      'Python raises an IndentationError',
      'It runs normally',
      'The line is skipped',
      'Python indents it automatically'
    ],
    answer: 0,
    explain: 'Indentation is mandatory in Python. It tells Python which lines belong to the if.'
  },
  {
    type: 'choice',
    text: 'What does this code display?',
    code: "a = 7\nif a < 10:\n    print('A')\nelif a < 20:\n    print('B')\nelse:\n    print('C')",
    options: ['A', 'B', 'C', 'A and B'],
    answer: 0,
    explain: 'a < 10 is True, so the first block runs and the rest of the chain is skipped, even though a < 20 is also true.'
  },
  {
    type: 'choice',
    text: 'Which operator means "not equal to"?',
    options: ['==', '!=', '>=', 'not'],
    answer: 1,
    explain: '!= compares two values and is True when they differ.'
  },
  {
    type: 'text',
    text: 'What does print(1 >= 2) display?',
    answers: ['false'],
    explain: '1 is not greater than or equal to 2, so the result is False.'
  },
  {
    type: 'choice',
    text: "Why does the case-insensitive code use userinput.lower() == 'true' instead of userinput == 'True'?",
    options: [
      'So the answer is accepted whatever capital letters the user types',
      'So the input becomes a number',
      'So the code runs faster',
      'So spaces are removed from the input'
    ],
    answer: 0,
    explain: "lower() turns 'TRUE', 'True' and 'true' into 'true' before comparing."
  },
  {
    type: 'text',
    text: 'What does print(a > 0 or b > 0) display?',
    code: 'a = -2\nb = 5',
    answers: ['true'],
    explain: 'or only needs one side to be true, and b > 0 is True.'
  },
  {
    type: 'text',
    text: 'Using the table from Exercise 1, which grade does a score of 15 get? (Type the letter.)',
    answers: ['b'],
    explain: '14 to 15 marks is a B.'
  }
];

function normalize(text) {
  return text.trim().toLowerCase().replace(/^['"]|['"]$/g, '').replace(/\s+/g, '');
}

function correctText(question) {
  return question.type === 'choice' ? question.options[question.answer] : question.answers[0];
}

// Builds one question. onAnswer(isCorrect) is called once, after the first response.
function buildQuestion(question, onAnswer, hint) {
  const wrap = document.createElement('div');
  wrap.className = 'question';

  const prompt = document.createElement('p');
  prompt.className = 'question-text';
  prompt.textContent = question.text;
  wrap.appendChild(prompt);

  if (question.code) {
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.textContent = question.code;
    pre.appendChild(code);
    wrap.appendChild(pre);
  }

  const feedback = document.createElement('p');
  feedback.className = 'feedback';
  feedback.setAttribute('role', 'status');

  function finish(isCorrect) {
    feedback.textContent = isCorrect
      ? 'Correct! ' + question.explain
      : 'Not quite. The answer is "' + correctText(question) + '". ' + question.explain;
    if (hint) {
      feedback.textContent += ' ' + hint;
    }
    feedback.classList.add(isCorrect ? 'right' : 'wrong');
    onAnswer(isCorrect);
  }

  if (question.type === 'choice') {
    const list = document.createElement('div');
    list.className = 'options';
    const buttons = question.options.map((option, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = option;
      button.addEventListener('click', () => {
        buttons.forEach((b, j) => {
          b.disabled = true;
          if (j === question.answer) {
            b.classList.add('correct-option');
          }
        });
        button.classList.add('chosen');
        finish(i === question.answer);
      });
      list.appendChild(button);
      return button;
    });
    wrap.appendChild(list);
  } else {
    const form = document.createElement('form');
    const input = document.createElement('input');
    input.type = 'text';
    input.setAttribute('aria-label', 'Your answer');
    input.autocomplete = 'off';
    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.textContent = 'Check answer';
    form.append(input, ' ', submit);
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (input.value.trim() === '') {
        return;
      }
      input.disabled = true;
      submit.disabled = true;
      const given = normalize(input.value);
      finish(question.answers.some((answer) => normalize(answer) === given));
    });
    wrap.appendChild(form);
  }

  wrap.appendChild(feedback);
  return wrap;
}

// ---------- Lesson tab ----------

sections.forEach((section, i) => {
  const question = checkins[section.id];
  if (!question) {
    return;
  }
  const box = document.createElement('div');
  box.className = 'checkin';
  const heading = document.createElement('h3');
  heading.textContent = 'Check-in question';
  box.appendChild(heading);
  const hint = i < sections.length - 1 ? 'Use Next to continue.' : '';
  box.appendChild(buildQuestion(question, () => {}, hint));
  section.appendChild(box);
});

function showSection(index) {
  current = index;
  sections.forEach((section, i) => {
    section.hidden = i !== index;
  });
  navLinks.forEach((link, i) => {
    if (i === index) {
      link.setAttribute('aria-current', 'true');
    } else {
      link.removeAttribute('aria-current');
    }
  });
  prevButton.disabled = index === 0;
  nextButton.disabled = index === sections.length - 1;
  document.title = sections[index].querySelector('h2').textContent + ' – Lesson 5';
}

function indexFromHash() {
  const id = window.location.hash.slice(1);
  const index = sections.findIndex((section) => section.id === id);
  return index === -1 ? 0 : index;
}

function goTo(hash) {
  history.pushState(null, '', '#' + hash);
  route();
  window.scrollTo(0, 0);
}

navLinks.forEach((link, i) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    goTo(sections[i].id);
  });
});

prevButton.addEventListener('click', () => goTo(sections[current - 1].id));
nextButton.addEventListener('click', () => goTo(sections[current + 1].id));

// ---------- Tabs ----------

const tabNames = tabs.map((tab) => tab.dataset.tab);
const tabTitles = { quiz: 'Quiz', simulator: 'Practice Simulator' };

function showTab(name) {
  tabs.forEach((tab) => {
    const selected = tab.dataset.tab === name;
    tab.setAttribute('aria-selected', selected ? 'true' : 'false');
    tab.tabIndex = selected ? 0 : -1;
  });
  panels.forEach((panel) => {
    panel.hidden = panel.id !== 'panel-' + name;
  });
  if (tabTitles[name]) {
    document.title = tabTitles[name] + ' – Lesson 5';
  }
}

function route() {
  const id = window.location.hash.slice(1);
  if (id === 'quiz' || id === 'simulator') {
    showTab(id);
  } else {
    showTab('lesson');
    showSection(indexFromHash());
  }
}

tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => {
    const name = tab.dataset.tab;
    goTo(name === 'lesson' ? sections[current].id : name);
  });
  tab.addEventListener('keydown', (event) => {
    let target = -1;
    if (event.key === 'ArrowRight') {
      target = (i + 1) % tabs.length;
    } else if (event.key === 'ArrowLeft') {
      target = (i - 1 + tabs.length) % tabs.length;
    }
    if (target !== -1) {
      event.preventDefault();
      tabs[target].focus();
      tabs[target].click();
    }
  });
});

window.addEventListener('popstate', route);

// ---------- Quiz tab ----------

const quizContainer = document.getElementById('quiz-questions');
const quizProgress = document.getElementById('quiz-progress');
const quizScore = document.getElementById('quiz-score');
const quizScoreValue = document.getElementById('quiz-score-value');
const quizRetry = document.getElementById('quiz-retry');

let quizAnswered = 0;
let quizCorrect = 0;

function buildQuiz() {
  quizAnswered = 0;
  quizCorrect = 0;
  quizContainer.textContent = '';
  quizScore.hidden = true;
  quizProgress.textContent = 'Answered 0 of ' + quizQuestions.length;
  quizQuestions.forEach((question, i) => {
    const item = document.createElement('div');
    item.className = 'quiz-item';
    const number = document.createElement('h3');
    number.textContent = 'Question ' + (i + 1) + ' of ' + quizQuestions.length;
    item.appendChild(number);
    item.appendChild(buildQuestion(question, (isCorrect) => {
      quizAnswered += 1;
      if (isCorrect) {
        quizCorrect += 1;
      }
      quizProgress.textContent = 'Answered ' + quizAnswered + ' of ' + quizQuestions.length;
      if (quizAnswered === quizQuestions.length) {
        quizScoreValue.textContent = quizCorrect + ' out of ' + quizQuestions.length;
        quizScore.hidden = false;
      }
    }));
    quizContainer.appendChild(item);
  });
}

quizRetry.addEventListener('click', () => {
  buildQuiz();
  window.scrollTo(0, 0);
});

buildQuiz();

// ---------- Simulator tab ----------

const OPERATORS = ['<', '>', '<=', '>=', '==', '!='];
const simA = document.getElementById('sim-a');
const simB = document.getElementById('sim-b');
const simCode = document.getElementById('sim-code');
const simTrace = document.getElementById('sim-trace');
const simOutput = document.getElementById('sim-output');

function compare(x, operator, y) {
  switch (operator) {
    case '<': return x < y;
    case '>': return x > y;
    case '<=': return x <= y;
    case '>=': return x >= y;
    case '==': return x === y;
    default: return x !== y;
  }
}

function makeSelect(label, options) {
  const select = document.createElement('select');
  select.setAttribute('aria-label', label);
  options.forEach(([value, text]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    select.appendChild(option);
  });
  select.addEventListener('change', updateSimulator);
  return select;
}

function makeNumber(label) {
  const input = document.createElement('input');
  input.type = 'number';
  input.step = 'any';
  input.setAttribute('aria-label', label);
  input.addEventListener('input', updateSimulator);
  return input;
}

// Builds the controls for one condition and returns them so they can be read later.
function buildCondition(container, name) {
  const notBox = document.createElement('input');
  notBox.type = 'checkbox';
  notBox.addEventListener('change', updateSimulator);
  const notLabel = document.createElement('label');
  notLabel.append(notBox, ' not (flip the result)');

  const variableOptions = [['a', 'a'], ['b', 'b']];
  const operatorOptions = OPERATORS.map((op) => [op, op]);
  const first = {
    variable: makeSelect(name + ' first value', variableOptions),
    operator: makeSelect(name + ' first comparison', operatorOptions),
    number: makeNumber(name + ' first number')
  };
  const join = makeSelect(name + ' join', [['', 'no second comparison'], ['and', 'and'], ['or', 'or']]);
  const second = {
    variable: makeSelect(name + ' second value', variableOptions),
    operator: makeSelect(name + ' second comparison', operatorOptions),
    number: makeNumber(name + ' second number')
  };
  const secondRow = document.createElement('span');
  secondRow.append(second.variable, ' ', second.operator, ' ', second.number);

  const firstRow = document.createElement('div');
  firstRow.append(first.variable, ' ', first.operator, ' ', first.number);
  const joinRow = document.createElement('div');
  joinRow.append(join, ' ', secondRow);

  join.addEventListener('change', () => {
    secondRow.hidden = join.value === '';
  });

  container.append(notLabel, firstRow, joinRow);
  return { notBox, first, join, second, secondRow };
}

const simIf = buildCondition(document.getElementById('sim-if'), 'if');
const simElif = buildCondition(document.getElementById('sim-elif'), 'elif');

function setCondition(condition, defaults) {
  condition.notBox.checked = defaults.not;
  condition.first.variable.value = defaults.first[0];
  condition.first.operator.value = defaults.first[1];
  condition.first.number.value = defaults.first[2];
  condition.join.value = defaults.join;
  condition.second.variable.value = defaults.second[0];
  condition.second.operator.value = defaults.second[1];
  condition.second.number.value = defaults.second[2];
  condition.secondRow.hidden = defaults.join === '';
}

function resetSimulator() {
  simA.value = '7';
  simB.value = '3';
  setCondition(simIf, { not: false, first: ['a', '<', '10'], join: '', second: ['b', '>', '0'] });
  setCondition(simElif, { not: false, first: ['a', '>', '10'], join: '', second: ['b', '>', '0'] });
  updateSimulator();
}

// Reads one condition. Returns null if a number is missing.
function readCondition(condition, values) {
  const terms = [condition.first];
  if (condition.join.value !== '') {
    terms.push(condition.second);
  }
  const parts = [];
  const results = [];
  for (const term of terms) {
    const number = term.number.valueAsNumber;
    if (Number.isNaN(number)) {
      return null;
    }
    const variable = term.variable.value;
    const operator = term.operator.value;
    parts.push(variable + ' ' + operator + ' ' + number);
    results.push(compare(values[variable], operator, number));
  }
  const joiner = condition.join.value;
  let text = parts.join(' ' + joiner + ' ');
  let result = results[0];
  if (joiner === 'and') {
    result = results[0] && results[1];
  } else if (joiner === 'or') {
    result = results[0] || results[1];
  }
  if (condition.notBox.checked) {
    text = 'not (' + text + ')';
    result = !result;
  }
  return { text, result };
}

function updateSimulator() {
  simCode.textContent = '';
  simTrace.textContent = '';
  const values = { a: simA.valueAsNumber, b: simB.valueAsNumber };
  const ifCondition = readCondition(simIf, values);
  const elifCondition = readCondition(simElif, values);
  if (Number.isNaN(values.a) || Number.isNaN(values.b) || !ifCondition || !elifCondition) {
    simOutput.textContent = 'Fill in every number box to see the result.';
    return;
  }

  // Which block runs: 0 = if, 1 = elif, 2 = else.
  let running = 2;
  if (ifCondition.result) {
    running = 0;
  } else if (elifCondition.result) {
    running = 1;
  }

  const lines = [
    ['a = ' + values.a, -1],
    ['b = ' + values.b, -1],
    ['if ' + ifCondition.text + ':', 0],
    ["    print('The if condition is true')", 0],
    ['elif ' + elifCondition.text + ':', 1],
    ["    print('The elif condition is true')", 1],
    ['else:', 2],
    ["    print('Neither condition is true')", 2]
  ];
  lines.forEach(([text, block]) => {
    const line = document.createElement('span');
    line.className = 'code-line';
    if (block === running) {
      line.classList.add('running');
    }
    line.textContent = text;
    simCode.appendChild(line);
  });

  const steps = [
    'if ' + ifCondition.text + ' is ' + (ifCondition.result ? 'True, so its action runs.' : 'False, so Python moves on.'),
    ifCondition.result
      ? 'elif is not checked, because the if condition was already True.'
      : 'elif ' + elifCondition.text + ' is ' + (elifCondition.result ? 'True, so its action runs.' : 'False, so Python moves on.'),
    running === 2
      ? 'else runs, because no condition above was True.'
      : 'else is skipped, because a condition above was True.'
  ];
  steps.forEach((step) => {
    const item = document.createElement('li');
    item.textContent = step;
    simTrace.appendChild(item);
  });

  const outputs = ['The if condition is true', 'The elif condition is true', 'Neither condition is true'];
  simOutput.textContent = 'Output: ' + outputs[running];
}

simA.addEventListener('input', updateSimulator);
simB.addEventListener('input', updateSimulator);
document.getElementById('sim-reset').addEventListener('click', resetSimulator);
resetSimulator();

// ---------- Theme ----------

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'dark' ? 'Light theme' : 'Dark theme';
}

let savedTheme = null;
try {
  savedTheme = localStorage.getItem('theme');
} catch (error) {
  // Storage can be blocked; fall back to the default light theme.
}
setTheme(savedTheme === 'dark' ? 'dark' : 'light');

themeToggle.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  setTheme(next);
  try {
    localStorage.setItem('theme', next);
  } catch (error) {
    // Ignore: the choice just won't be remembered.
  }
});

route();
