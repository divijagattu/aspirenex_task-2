document.addEventListener('DOMContentLoaded', () => {
    const createQuizNav = document.getElementById('create-quiz-nav');
    const takeQuizNav = document.getElementById('take-quiz-nav');
    const createQuizSection = document.getElementById('create-quiz-section');
    const takeQuizSection = document.getElementById('take-quiz-section');
    const quizForm = document.getElementById('quiz-form');
    const addQuestionButton = document.getElementById('add-question');
    const fetchQuizButton = document.getElementById('fetch-quiz');
    const quizContainer = document.getElementById('quiz-container');
    const submitQuizButton = document.getElementById('submit-quiz');

    let questions = [];

    createQuizNav.addEventListener('click', (e) => {
        e.preventDefault();
        createQuizSection.style.display = 'block';
        takeQuizSection.style.display = 'none';
    });

    takeQuizNav.addEventListener('click', (e) => {
        e.preventDefault();
        createQuizSection.style.display = 'none';
        takeQuizSection.style.display = 'block';
    });

    addQuestionButton.addEventListener('click', () => {
        const questionBlock = document.createElement('div');
        questionBlock.classList.add('question-block');
        questionBlock.innerHTML = `
            <label for="question">Question:</label>
            <input type="text" name="question" required>
            <label for="option1">Option 1:</label>
            <input type="text" name="option1" required>
            <label for="option2">Option 2:</label>
            <input type="text" name="option2" required>
            <label for="option3">Option 3:</label>
            <input type="text" name="option3" required>
            <label for="option4">Option 4:</label>
            <input type="text" name="option4" required>
            <label for="correct-option">Correct Option:</label>
            <select name="correct-option" required>
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
                <option value="3">Option 3</option>
                <option value="4">Option 4</option>
            </select>
        `;
        quizForm.insertBefore(questionBlock, addQuestionButton);
    });

    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const questionBlocks = document.querySelectorAll('.question-block');
        questions = Array.from(questionBlocks).map(block => {
            return {
                question: block.querySelector('input[name="question"]').value,
                options: [
                    block.querySelector('input[name="option1"]').value,
                    block.querySelector('input[name="option2"]').value,
                    block.querySelector('input[name="option3"]').value,
                    block.querySelector('input[name="option4"]').value
                ],
                correctOption: block.querySelector('select[name="correct-option"]').value
            };
        });
        fetch('http://localhost:5001/create-quiz', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(questions),
        }).then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch((error) => console.error('Error:', error));
    });

    fetchQuizButton.addEventListener('click', (e) => {
        fetchAndRenderQuiz();
    });

    function renderQuiz(questions) {
        quizContainer.innerHTML = '';
        questions.forEach((q, index) => {
            const questionElement = document.createElement('div');
            questionElement.classList.add('question');
            questionElement.innerHTML = `
                <h3>${index + 1}. ${q.question}</h3>
                <label><input type="radio" name="q${index}" value="1"> ${q.options[0]}</label><br>
                <label><input type="radio" name="q${index}" value="2"> ${q.options[1]}</label><br>
                <label><input type="radio" name="q${index}" value="3"> ${q.options[2]}</label><br>
                <label><input type="radio" name="q${index}" value="4"> ${q.options[3]}</label><br>
            `;
            quizContainer.appendChild(questionElement);
        });
        submitQuizButton.style.display = 'block';
    }

    function fetchAndRenderQuiz() {
        fetch('http://localhost:5001/take-quiz')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                questions = data;
                renderQuiz(questions);
            })
            .catch((error) => console.error('Error fetching quiz:', error));
    }

    submitQuizButton.addEventListener('click', () => {
        const answers = Array.from(document.querySelectorAll('.question')).map((q, index) => {
            const selectedOption = q.querySelector(`input[name="q${index}"]:checked`);
            return selectedOption ? selectedOption.value : null;
        });
        let score = 0;
        answers.forEach((answer, index) => {
            if (answer === questions[index].correctOption) {
                score++;
            }
        });
        alert(`You scored ${score} out of ${questions.length}`);
    });
});
