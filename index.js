'use strict'

const questionList = [
    {
        id: 1,
        question: 'What character was frozen for 1000 years in the pilot episode?',
        options: [
            'Professor Farnsworth',
            'Fry',
            'Leela',
            'Scruffy'
        ],
        answer: 'Fry',
        questionImage: 'cryo_tube.png',
        answerImage: 'fry.png'
    },
    {
        id: 2,
        question: 'What Planet Express employee is a from planet Decapod 10?',
        options: [
            'Zoidberg',
            'Hermes',
            'Amy',
            'Bender'
        ],
        answer: 'Zoidberg',
        questionImage: 'decapod_10.png',
        answerImage: 'zoidberg.png'
    },
];

function renderQuiz() {
    // Render the quiz in the DOM
    console.log('`renderQuiz` ran');
}

function changeImage() {
    // This function will change the image for each question and after a question has been answered
    console.log('`changeImage` ran');
}

function listAnswerOptions() {
    // This function will change the list of answer options
    console.log('`listAnswerOptions` ran');
}

function checkAnswer() {
    // This function will check the submitted answer and display feedback
    console.log('`checkAnswer` ran');
}

function selectQuestion() {
    // This function will select a question from the question list
    console.log('`selectQuestion` ran');
}

function trackProgress() {
    // This function will track the score and progress through the quiz
    console.log('`trackProgress` ran');
}

function quizComplete() {
    // This function will run when the quiz is completed
    console.log('`quizComplete` ran');
}

function startQuiz() {
    renderQuiz();

}

// When page loads, call `startQuiz`
$(startQuiz);