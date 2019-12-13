'use strict';

function selectQuestion(questionId) {
    // This function will select a question from the question list
    console.log('`selectQuestion` ran');
    
    return questionList.find(question => question.id === questionId);
}

function renderQuiz(question) {
    // Render the quiz in the DOM
    console.log('`renderQuiz` ran');
    
    // Declare render variables to default values
    let clear = false;
    let imageName = question.questionImage;
    let imageAlt = question.questionImageAlt;
    let questionText = question.question;
    let answerOptions = '';
    let answerStatus = null;
    let displayProgress = true;
    let displayScore = true;
    let buttonText = '';
    let incrementCounter = false;

    // Check if starting the quiz
    if (quizCounter === 0) {
        // Set render variables
        clear = true;
        displayProgress = false;
        displayScore = false;
        buttonText = 'Start Quiz';
        incrementCounter = true;
    }
    // Check if ending the quiz
    else if (quizCounter === 11) {
        // Set render variables
        clear = true;
        displayProgress = false;
        displayScore = false;
        buttonText = 'Restart Quiz';

        // Create final message with score
        questionText = `Congratulations! You finished the quiz! You got ${quizScore} out of 10 answers correct.`;
        // Add sentence depending on the score
        if (quizScore > 7) {
            questionText += ' You sure know a lot about Futurama.';
        }
        else if (quizScore > 4) {
            questionText += ' You\'ve seen this show before, but maybe you should watch it again.';
        }
        else {
            questionText += ' You probably haven\'t seen this show before.';
        }
        questionText += ' Press the button if you\'d like to try again.';
        
        // Reset counter and score to prepare for restarting quiz
        quizCounter = 0;
        quizScore = 0;
    }
    // Otherwise, answering questions for the quiz
    else {
        // Check if question should be displayed
        if (isQuestion) {
            // Set render variables
            clear = true;
            answerOptions = question.options;
            buttonText = 'Submit Answer';
        }
        // Otherwise, the answer should be displayed and the answer check should be done
        else {
            // Get user selected answer
            const userAnswer = $('input[name="options-list"]:checked').val();

            // Only run if answer is selected
            if (userAnswer !== undefined) {
                // Set render variables
                clear = true;
                imageName = question.answerImage;
                imageAlt = question.answerImageAlt;
                answerOptions = `Correct Answer: ${question.answer}\n<br>\nYour Answer: ${userAnswer}`;
                incrementCounter = true;
                
                // Show message for correct answer
                if (checkAnswer(userAnswer, question.answer)) {
                    answerStatus = true;
                    // Increase score
                    quizScore += 1;
                }
                // Show message for incorrect answer
                else {
                    answerStatus = false; // Delete this section?
                }

                // Set button text for end of quiz or middle of quiz
                if (quizCounter === 10) {
                    buttonText = 'Finish Quiz';
                }
                else {
                    buttonText = 'Next Question';
                }
            }
            // Handle the case where no answer is selected
            else {
                clear = true;
                answerOptions = 'Please select an answer';
                displayProgress = false;
                displayScore = false;
                buttonText = 'Try Again';
            }
        }
        // Toggle isQuestion tracking variable
        isQuestion = (isQuestion) ? false : true;
    }
    // Render everything
    clearQuiz(clear);
    changeImage(imageName, imageAlt);
    changeQuestionText(questionText);
    changeAnswerOptions(answerOptions);
    changeAnswerStatus(answerStatus);
    changeProgressText(displayProgress);
    changeScoreText(displayScore);
    changeButtonText(buttonText);

    // Increment quizCounter if moving on to next question
    if (incrementCounter) quizCounter++;

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

    // Start with empty string and build from there
    let optionString = '';

    // If quizOptions is array, build options list using fieldset, radio inputs, labels
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
        optionString += `    <p class="answer">${quizOptions}</p>`
    }
    
    // Hook into options element and add the options text
    const optionsContainer = $('#js-quiz-options');
    optionsContainer.append(optionString);
}

function changeAnswerStatus(correct) {
    // This function will change the answer status (correct/incorrect) and assign the proper class
    // to have the right style
    console.log('`listAnswerOptions` ran');

    // Hook into answer status element
    const quizAnswerStatus = $('#js-answer-status');

    // Only run if correct has been set properly
    if (correct !== null) {
        // Answer correct, add proper class, correct message
        if (correct) {
            quizAnswerStatus.removeClass().addClass('answer-status-correct');
            quizAnswerStatus.text('You got it right!');
        }
        // Answer incorrect, add proper class, incorrect message
        else {
            quizAnswerStatus.removeClass().addClass('answer-status-incorrect');
            quizAnswerStatus.text('You got it wrong.');
        }
    }
}

function changeProgressText(display) {
    // This function will show the quiz progress if display is true
    console.log('`changeProgressText` ran');

    if (display) {
        const progressText = $('#js-quiz-progress');
        progressText.text(`Question: ${quizCounter} of 10`);
    }
}

function changeScoreText(display) {
    // This function will show the quiz score if display is true
    console.log('`changeScoreText` ran');

    if (display) {
        const scoreText = $('#js-quiz-score');
        // Show proper possible score: use question number when on question page,
        // question number minus one on answer page
        if (isQuestion) {
            scoreText.text(`Score: ${quizScore} out of ${quizCounter}`);
        }
        else {
            scoreText.text(`Score: ${quizScore} out of ${quizCounter - 1}`);
        }
    }
}

function checkAnswer(userAnswer, questionAnswer) {
    // This function will check the user answer against the correct answer and return the result
    console.log('`checkAnswer` ran');

    return (userAnswer === questionAnswer);
}

function changeButtonText(buttonText) {
    // This function will change the text of the quiz button to buttonText
    console.log('`changeButtonText` ran');

    const button = $('#js-button-text');
    button.text(buttonText);
}

function clearQuiz(clear) {
    // This function will clear out the text of all elements of the quiz
    console.log('`clearQuiz` ran');

    // Only run if called properly
    if (clear) {
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
}

// Declare and set global tracking variables, question list
let quizCounter = 0;
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
        questionImageAlt: 'Futurama crew standing under the stylized title',
        answerImage: '',
        answerImageAlt: ''
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
        questionImageAlt: 'Character frozen inside cryo-tube while a city is destroyed through the window',
        answerImage: 'fry.png',
        answerImageAlt: 'Headshot of fry'
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
        questionImageAlt: 'Decapod 10 seen from space',
        answerImage: 'zoidberg.png',
        answerImageAlt: 'Headshot of Zoidberg'
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
        questionImageAlt: 'Planet Express building with city in the background',
        answerImage: 'nny.png',
        answerImageAlt: 'New New York Public Library as the brains are attacking'
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
        questionImageAlt: 'Fry and Bender looking at a hole full of alien snacks',
        answerImage: 'fishy_joes.png',
        answerImageAlt: 'Fishy Joe\'s billboard advertising billions of Popplers sold'
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
        questionImageAlt: 'Leela\'s pet sitting in a diaper, wearing a cape',
        answerImage: 'lord_nibbler.png',
        answerImageAlt: 'Nibbler wearing a space suit, looking serious'
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
        questionImageAlt: 'Underwater city from afar',
        answerImage: 'atlanta.png',
        answerImageAlt: 'Leela clearing a sign that reveals Atlanta as the city name'
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
        questionImageAlt: 'Bird\'s eye view of space amusement park under a dome',
        answerImage: 'luna_park.png',
        answerImageAlt: 'People waiting in line to get into Luna Park on the Moon'
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
        questionImageAlt: 'Leela and fry milking black and white, large, beetle-like creatures',
        answerImage: 'betsy.png',
        answerImageAlt: 'Amy running toward her pet Buggalo, Betsy, with Buggalo herd in background'
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
        questionImageAlt: 'Mysterious planet from space',
        answerImage: 'got_milk.png',
        answerImageAlt: 'Billboard from Chapek 9, indicating that humans must be killed'
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
        questionImageAlt: 'Headshot of Bender',
        answerImage: 'bender_bottom.png',
        answerImageAlt: 'Bender showing off his newly installed shock absorbing ass'
    },
    {
        id: 11,
        question: '',
        options: [
        ],
        answer: '',
        questionImage: 'futurama_square.png',
        questionImageAlt: '',
        answerImage: '',
        answerImageAlt: ''
    }
];

function startQuiz() {
    // This function will start the quiz and listen for form submissions to progress through the quiz
    console.log('`startQuiz` ran');

    // Grab content from question list. Do intial render to show quiz start page.
    let question = selectQuestion(quizCounter);    
    renderQuiz(question);

    // Listen for submit button click to progress through quiz
    $('#js-quiz-container').submit(function (event) {
        // Stop standard form submittal
        event.preventDefault();
        console.log('Button clicked');
        
        // Get new question from question list
        question = selectQuestion(quizCounter);

        // Render the quiz
        renderQuiz(question);
    });

}

// When page loads, call `startQuiz`
$(startQuiz);