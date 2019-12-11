'use strict';

function selectQuestion(questionId) {
    // This function will select a question from the question list
    console.log('`selectQuestion` ran');
    return questionList.find(question => question.id === questionId);
}

function renderQuiz(question) {
    // Render the quiz in the DOM
    console.log('`renderQuiz` ran');

    /*
    NEED TO CLEAN THIS UP, ADD IMAGEALT TO CHANGEIMAGE CALLOUTS
    */

    // Check if starting the quiz
    if (quizCounter === 0) {
        clearQuiz();
        changeImage(question.questionImage);
        changeQuestionText(question.question);
        changeButtonText('Start Quiz');
        quizCounter++;
    }
    // Check if ending the quiz
    else if (quizCounter === 11) {
        clearQuiz();
        changeImage(question.questionImage);

        // Create final message with score
        changeQuestionText(`Congratulations! You finished the quiz! You got ${quizScore} out of 10 answers correct. Press the button if you\'d like to try again.`);
        changeButtonText('Restart Quiz');

        // Reset counter and score to go back to start of quiz
        quizCounter = 0;
        quizScore = 0;
    }
    // Otherwise, answering questions for the quiz
    else {
        // Check if question should be displayed
        if (isQuestion) {
            clearQuiz();
            changeImage(question.questionImage);
            changeQuestionText(question.question);
            changeAnswerOptions(question.options);
            changeProgressText();
            changeScoreText();
            changeButtonText('Submit Answer');
        }
        // Otherwise, the answer check should be done
        else {
            // Get selected answer
            const userAnswer = $('input[name="options-list"]:checked').val();

            // Check to see if no answer is selected
            if (userAnswer !== undefined) {
                clearQuiz();
                changeImage(question.answerImage);
                changeAnswerOptions(`Correct Answer: ${question.answer}\n<br>\nYour Answer: ${userAnswer}`);
                changeProgressText();

                if (checkAnswer(userAnswer, question.answer)) {
                    // Show correct message
                    changeAnswerStatus(true);
                    // Increase score
                    quizScore += 1;
                }
                else {
                    // Show correct message
                    changeAnswerStatus(false);
                }

                changeScoreText();
                if (quizCounter === 10) {
                    changeButtonText('Finish Quiz');
                }
                else {
                    changeButtonText('Next Question');
                }
                //console.log(userAnswer);
            
                quizCounter++;
            }
            else {
                // Handle the case where no answer is selected
                clearQuiz();
                changeImage(question.questionImage);
                changeAnswerOptions('Please select an answer');
                changeButtonText('Try Again');
                changeProgressText();
                changeScoreText();
            }
        }
        // Toggle isQuestion tracking variable
        isQuestion = (isQuestion) ? false : true;        
    }

}

function changeImage(imageName, imageAlt) {
    // This function will change the image for each question and after a question has been answered
    console.log('`changeImage` ran');
    const image = $('#js-quiz-image');
    image.attr('src', 'images/' + imageName);
    image.attr('alt', imageAlt);
}

function changeQuestionText(questionText) {
    // This function will change the question text for each question
    console.log('`changeQuestionText` ran');
    const text = $('#js-quiz-text');
    text.append('<p>' + questionText + '</p>');
}

function changeAnswerOptions(quizOptions) {
    // This function will change the list of answer options
    console.log('`listAnswerOptions` ran');
    let optionString = '';
    // If quizOptions is array, build options list
    if (Array.isArray(quizOptions)) {
        optionString += '    <fieldset>';
        for (let i = 0; i < quizOptions.length; i++) {
            optionString += `
                <input type="radio" name="options-list" id="ans-${i + 1}" value="${quizOptions[i]}">
                <label for="ans-${i + 1}">${quizOptions[i]}</label>`;
            optionString += (i < quizOptions.length - 1) ? '\n        <br>' : '';
        }
        optionString += `\n    </fieldset>`;
    }
    // Otherwise, build answer string (in the case of the feedback page)
    else {
        /*
        NEED TO ADD BETTER STRING: 'Correct Answer: Answer, Your Answer: Answer'
        */
        optionString += `    <p class="answer">${quizOptions}</p>`
    }
    console.log(optionString);
    const optionsContainer = $('#js-quiz-options');
    optionsContainer.append(optionString);
}

function changeAnswerStatus(correct) {
    const quizAnswerStatus = $('#js-answer-status');
    if (correct) {
        // Answer correct, add proper class, correct message
        quizAnswerStatus.removeClass().addClass('answer-status-correct');
        quizAnswerStatus.text('You got it right!');
    }
    else {
        // Answer incorrect, add proper class, incorrect message
        quizAnswerStatus.removeClass().addClass('answer-status-incorrect');
        quizAnswerStatus.text('You got it wrong.');
    }
}

function changeProgressText() {
    const progressText = $('#js-quiz-progress');
    progressText.append(`Question: ${quizCounter} of 10`);
}

function changeScoreText() {
    const scoreText = $('#js-quiz-score');
    scoreText.append(`Score: ${quizScore} out of 10`);
}

function checkAnswer(userAnswer, questionAnswer) {
    // This function will check the submitted answer and display feedback
    console.log('`checkAnswer` ran');

    return (userAnswer === questionAnswer);
}

function changeButtonText(buttonText) {
    const button = $('#js-button-text');
    button.text(buttonText);
}

function clearQuiz() {
    const quizText = $('#js-quiz-text');
    const quizOptions = $('#js-quiz-options');
    const quizAnswerStatus = $('#js-answer-status');
    const quizProgress = $('#js-quiz-progress');
    const quizScore = $('#js-quiz-score');
    const quizButton = $('#js-button-text');
    quizText.empty();
    quizOptions.empty();
    quizAnswerStatus.empty();
    quizProgress.empty();
    quizScore.empty();
    quizButton.empty();
}

let quizCounter = 10;
let quizScore = 0;
let isQuestion = true;
const questionList = [
    {
        id: 0,
        question: 'This is an interactive multiple choice quiz about the TV show Futurama. When you\'re ready to start the quiz, click the Start Quiz button.',
        options: [
        ],
        answer: '',
        questionImage: 'futurama_square.png',
        answerImage: ''
    },
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
    {
        id: 3,
        question: 'Where is the Planet Express building located?',
        options: [
            'New New York',
            'Milwaukee',
            'Vergon 6',
            'Omicron Persei 8'
        ],
        answer: 'New New York',
        questionImage: 'planet_express_building.png',
        answerImage: 'nny.png'
    },
    {
        id: 4,
        question: 'What was the name of the snack food that turned out to be Omicronian babies?',
        options: [
            'Zittzers',
            'Fried Prawns',
            'Popplers',
            'Roddenberries'
        ],
        answer: 'Popplers',
        questionImage: 'popplers.png',
        answerImage: 'fishy_joes.png'
    },
    {
        id: 5,
        question: 'What is the name of Leela\'s pet alien?',
        options: [
            'Buster',
            'Snuffles',
            'Nibbler',
            'Scruffy'
        ],
        answer: 'Nibbler',
        questionImage: 'nibbler.png',
        answerImage: 'lord_nibbler.png'
    },
    {
        id: 6,
        question: 'What is the name of the lost city under the sea?',
        options: [
            'Atlantis',
            'Atlanta',
            'Atlantic City',
            'Antartica'
        ],
        answer: 'Atlanta',
        questionImage: 'underwater_city.png',
        answerImage: 'atlanta.png'
    },
    {
        id: 7,
        question: 'Where does the crew find an amusement park?',
        options: [
            'Saturn',
            'The Moon',
            'Venus',
            'Pluto'
        ],
        answer: 'The Moon',
        questionImage: 'amusement_park.png',
        answerImage: 'luna_park.png'
    },
    {
        id: 8,
        question: 'What livestock do Amy\'s parent raise on Mars?',
        options: [
            'Bison',
            'Buffalo',
            'Buggalo',
            'Beetle Cows'
        ],
        answer: 'Buggalo',
        questionImage: 'livestock.png',
        answerImage: 'betsy.png'
    },
    {
        id: 9,
        question: 'What planet has a crippling shortage of lug nuts?',
        options: [
            'Zantar 4',
            'Chapek 9',
            'Quantax 8',
            'Spheron 1'
        ],
        answer: 'Chapek 9',
        questionImage: 'lug_nut_planet.png',
        answerImage: 'got_milk.png'
    },
    {
        id: 10,
        question: 'What word does Bender say the most?',
        options: [
            'Pimpmobile',
            'Chump',
            'Daffodil',
            'Ass'
        ],
        answer: 'Ass',
        questionImage: 'bender.png',
        answerImage: 'bender_bottom.png'
    },
    {
        id: 11,
        question: '',
        options: [
        ],
        answer: '',
        questionImage: 'futurama_square.png',
        answerImage: ''
    }
];

function startQuiz() {
    // Do intial render to show quiz start page. Grab content from question list.
    let question = selectQuestion(quizCounter);    
    renderQuiz(question);

    // Listen for submit button click to work through quiz
    $('#js-quiz-container').submit(function (event) {
    //$('.quiz-button').on('click', function (event) {
        event.preventDefault();
        console.log('Button clicked');
        question = selectQuestion(quizCounter);
        renderQuiz(question);
    });

}

// When page loads, call `startQuiz`
$(startQuiz);