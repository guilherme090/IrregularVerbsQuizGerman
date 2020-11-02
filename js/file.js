/*
----------------------------------------------------------------------------------
Objects and variables
----------------------------------------------------------------------------------
Store current and total scores.
*/

const aluno = {
    name: '',
    words_learned: 0,
    words_right: 0,
    words_total: 0
}

let logMessage = ''; // stores correct and incorrect values during the quiz

/* 
----------------------------------------------------------------------------------
Labels
----------------------------------------------------------------------------------
Labels that will store the student's data.
*/ 

// Student data with quiz parameters

let presentCheckbox = document.querySelector('#include-present');
let pastSimpleCheckbox = document.querySelector('#include-past-simple');
let pastParticipleCheckbox = document.querySelector('#include-past-participle');
let cefrCheckBoxes = document.querySelectorAll('.cefr');

/* 
----------------------------------------------------------------------------------
Auxiliary functions (toggleXXX())
----------------------------------------------------------------------------------
Activated when labels are clicked. If all are unchecked, check one of them.
*/ 

function togglePresent(){
    if(presentCheckbox.checked == false && pastSimpleCheckbox.checked == false && pastParticipleCheckbox.checked == false){
        pastSimpleCheckbox.checked = true;
    }
}

function togglePastSimple(){
    if(presentCheckbox.checked == false && pastSimpleCheckbox.checked == false && pastParticipleCheckbox.checked == false){
        pastParticipleCheckbox.checked = true;
    }
}

function togglePastParticiple(){
    if(presentCheckbox.checked == false && pastSimpleCheckbox.checked == false && pastParticipleCheckbox.checked == false){
        presentCheckbox.checked = true;
    }
}

function toggleCEFR(){
    let noneSelected = true;
    for(let i = 0; i < cefrCheckBoxes.length; i++){
        if (cefrCheckBoxes[i].checked === true){
            noneSelected = false;
        }
    }
    if(noneSelected === true){
        cefrCheckBoxes[0].checked = true;
    }
}

// Message board

let messageBoard = document.querySelector('#message');

// Quiz area

let wordNumber = document.querySelector('#word-no');
let correctPct = document.querySelector('#correct-pct');
let presentAnswer = document.querySelector('#answer-present');
let infinitiveAnswer = document.querySelector('#answer-infinitive');
let pastSimpleAnswer = document.querySelector('#answer-past-simple');
let pastParticipleAnswer = document.querySelector('#answer-past-participle');
let allLabels = document.getElementsByClassName('answers');

// Quiz log board

let quizLogBoard = document.querySelector('#message-log');

// Update functions

function updateStudentScore(){
    if(aluno.words_total === 0){
        correctPct.innerHTML = '0.00';
    }
    else{
        correctPct.innerHTML = (aluno.words_right / aluno.words_total * 100).toFixed(2); 
    } 
}

let rawListOfVerbs = 
    "beginnen#beginnt#begann#hat begonnen#@A1*" +
    "bleiben#bleibt#blieb#ist geblieben#@A1*" +
    "bringen#bringt#brachte#hat gebracht#@A1*" +
    "backen#backt#buk/backte#hat gebacken/hat gebackt#@A2*" +
    "biegen#biegt#bog#hat gebogen/ist gebogen#@A2*" +
    "bieten#bietet#bot#hat geboten#@A2*" +
    "befehlen#befiehlt#befahl#hat befohlen#@B1*" +
    "beißen#beißt#biss#hat gebissen#@B1*" +
    "binden#bindet#band#hat gebunden#@B1*" +
    "bergen#birgt#barg#hat geborgen#@B2*" +
    "blasen#bläst#blies#hat geblasen#@B2*" +
    "gebären#gebärt#gebar#hat geboren#@B2*" +
    "bewegen#bewegt#bewog/bewegte#hat bewogen/hat bewegt#@C1*" + 
    "dringen#dringt#drang#hat gedrungen/ist gedrungen#@C1*" +
    "erlöschen#erlischt#erlosch#ist erloschen#@C1*" +
    "bersten#birst#barst#ist geborsten#@C2*" +
    "bleichen#bleicht#blich/bleichte#ist geblichen/hat gebleicht#@C2*" +
    "dreschen#drischt#drosch#hat gedroschen#@C2";

/* 
----------------------------------------------------------------------------------
The verbs
----------------------------------------------------------------------------------
This part of the program reuses its desktop version in which the list of verbs is
read from a .txt file. Instead, it will be directly loaded here. 
*/ 

class verb {
    constructor(infinitive, present, past_simple, past_participle, token, isTaken){
        this._infinitive = infinitive;
        this._present = present;
        this._past_simple = past_simple;
        this._past_participle = past_participle;
        this._token = token; // an identifier that separates groups of similar verbs
        this._taken = isTaken;       
    }

    get infinitive(){
        return this._infinitive;
    }

    get present(){
        return this._present;
    }

    get pastSimple(){
        return this._past_simple;
    }

    get pastParticiple(){
        return this._past_participle;
    }

    get token(){
        return this._token;
    }

    set token(newToken){
        this._token = newToken;
    }

    get taken(){
        return this._taken;
    }

    set taken(newTaken){
        this._taken = newTaken;
    }
}

/*
----------------------------------------------------------------------------------
Initializing list of verbs
----------------------------------------------------------------------------------
Here, verbs are already inside the program's data structures. The program sets
the attribute taken to false, meaning that the student has not answered a question
about that particular verb. When it happens, the value will be set to true.
*/

function resetVerbList(theListOfVerbs){
    theListOfVerbs.forEach(
        function(theVerb){
            theVerb.taken = false;
        }
    );
}

function resetStudentScore(){
    aluno.words_right = 0;
    aluno.words_total = 0;
}



let shuffledIndex = 0; // Initialize shuffled number

function shuffleVerb(currentListOfVerbs, currentWordCount){
    // Shuffled number is a number between 0 and the end of the verb array (excluding verbs already taken)
    // the number of verbs that were already taken is the current wordCount - 1.
    let takenVerbs = Number(currentWordCount.innerHTML) - 1;
    console.log('Word count = ' + takenVerbs);
    let shuffledNumber = Math.floor(Math.random() * (Number(aluno.words_learned) - takenVerbs)); 
    console.log('shuffled number = ' + shuffledNumber);
    // Scan the whole list of verbs to point to a non-taken verb in sorted position
    for(let i = 0; i < shuffledNumber || currentListOfVerbs[i].taken === true ; i++){
        if(currentListOfVerbs[i].taken === true){
            shuffledNumber++;
        }
    }
    console.log('shuffled index = ' + shuffledNumber);

    // tell list of verbs that this particular verb was taken
    currentListOfVerbs[shuffledNumber].taken = true;
    return shuffledNumber;
}

function showInfinitive(theInfinitive, thePresent, thePastSimple, thePastParticiple, theListOfVerbs, theIndex){
    theInfinitive.innerHTML = theListOfVerbs[theIndex].infinitive;
    thePresent.value = '';
    thePastSimple.value = '';
    thePastParticiple.value = '';
}

function showPast(theInfinitive, thePresent, thePastSimple, thePastParticiple, theListOfVerbs, theIndex){
    messageBoard.innerHTML = messageBoard.innerHTML + '<br />' + '<br />' +
    '(' + theListOfVerbs[theIndex].infinitive + ' - ' + 
    theListOfVerbs[theIndex].present + ' - ' +
    theListOfVerbs[theIndex].pastSimple + ' - ' 
    + theListOfVerbs[theIndex].pastParticiple + ')';
}

/*
----------------------------------------------------------------------------------
List of verbs
----------------------------------------------------------------------------------
Instead of reading an external .txt file, the list of verbs was hard coded above, but it will be
converted to a data structure inside the program in the same way as before.
*/

let verbsReadWithLineBreak = rawListOfVerbs.replace(/(\r\n|\n|\r)/gm,""); 

let verbsRead = verbsReadWithLineBreak.split('*');

console.log(verbsRead);

const listOfVerbs = []; // stores all verbs that are in the txt file loaded as verb list.

verbsRead.forEach(verbForm => {
    let singleVerb = verbForm.split('#');
    listOfVerbs.push(new verb(singleVerb[0], singleVerb[1], singleVerb[2], singleVerb[3], singleVerb[4], false));   
});

console.log(listOfVerbs);

/*
----------------------------------------------------------------------------------
calculateWordsLearned()
----------------------------------------------------------------------------------
This function sets the words_learned value for students.
To be used by excludeByTag();
*/

function calculateWordsLearned(theStudent){
    theStudent.words_learned = listOfVerbs.length;
}

/*
----------------------------------------------------------------------------------
excludeByTag()
----------------------------------------------------------------------------------
This function will set words of all unwanted (unchecked) tags as taken. It will
then update the number of possible words.
*/

function excludeByTag(theListOfVerbs, theListOfCheckboxes, theStudent){
    const levels = ['@A1', '@A2', '@B1', '@B2', '@C1', '@C2' ]; // tags that relate to CEFR level options
    for(let i = 0; i < theListOfCheckboxes.length; i++){
        if(theListOfCheckboxes[i].checked === false){
            for(let j = 0; j < theListOfVerbs.length; j++){
                if(theListOfVerbs[j].token === levels[i]){
                    console.log(theListOfVerbs[j].infinitive + ' was taken');
                    theListOfVerbs[j].taken = true;
                    theStudent.words_learned --;
                }
            }
        }
    }
}

let startBtn = document.querySelector('#btn-start');
startBtn.onclick = function(){
    // Only start the quiz if there is a list of verbs loaded to the system.
    if(listOfVerbs.length > 0){
        wordNumber.innerHTML = 1;
        resetVerbList(listOfVerbs);
        // Initialize score
        resetStudentScore();
        updateStudentScore();
        logMessage = 'QUIZ LOG:<br><br>';

        calculateWordsLearned(aluno);
        excludeByTag(listOfVerbs, cefrCheckBoxes, aluno);

        console.log(listOfVerbs);

        stateMachine(states.QUIZ_STARTED_NO_ANSWER);
    }
    else{
        alert('Cannot start quiz because there are no verbs to be shown. Load a valid list of verbs to the application.');
    }
    
}

/*
----------------------------------------------------------------------------------
isCorrect
----------------------------------------------------------------------------------
This function breaks the answer found in the verb list in the possible answers
that will be accepted as true and checks if any of them matches the user's answer.
Ex: got/gotten will compare the user's response to both got and gotten.
*/

function isCorrectPresent(userPresent, programPresent){
    // In case the program is not checking past simple, say it is correct. 
    if(presentCheckbox.checked == false){
        return true;
    }
    let correctPresent = programPresent.split('/'); // all possibilities for past simple
    for(let i = 0; i < correctPresent.length; i++){
        if (userPresent === correctPresent[i]){
            return true;
        }
    }
    return false;
}

function isCorrectPastSimple(userPastSimple, programPastSimple){
    // In case the program is not checking past simple, say it is correct. 
    if(pastSimpleCheckbox.checked == false){
        return true;
    }
    let correctPastSimple = programPastSimple.split('/'); // all possibilities for past simple
    for(let i = 0; i < correctPastSimple.length; i++){
        if (userPastSimple === correctPastSimple[i]){
            return true;
        }
    }
    return false;
}

function isCorrectPastParticiple(userPastParticiple, programPastParticiple){
    // In case the program is not checking past participle, say it is correct. 
    if(pastParticipleCheckbox.checked == false){
        return true;
    }
    let correctPastParticiple = programPastParticiple.split('/'); // all possibilities for past simple
    for(let i = 0; i < correctPastParticiple.length; i++){
        if (userPastParticiple === correctPastParticiple[i]){
            return true;
        }
    }
    return false;
}

function correctWord(){
    aluno.words_right ++;
    aluno.words_total ++;
    console.log(aluno);
    updateStudentScore();
    logMessage = logMessage.concat('| ' + infinitiveAnswer.innerHTML + ' | ' + 
    presentAnswer.value.toLowerCase() + ' | ' +
    pastSimpleAnswer.value.toLowerCase() + ' | ' + 
    pastParticipleAnswer.value.toLowerCase() + ' |' + ' >>> (correct)' + '<br>');
    quizLogBoard.innerHTML = logMessage;
};

function incorrectWord(){
    aluno.words_total ++;
    console.log(aluno);
    updateStudentScore();
    logMessage = logMessage.concat('*| ' + infinitiveAnswer.innerHTML + ' | ' + 
    presentAnswer.value.toLowerCase() + ' | ' +
    pastSimpleAnswer.value.toLowerCase() + ' | ' + 
    pastParticipleAnswer.value.toLowerCase() + ' |' + ' >>> (incorrect)' + '<br>');
    quizLogBoard.innerHTML = logMessage;
};

let showAnsBtn = document.querySelector('#btn-show-answer');
showAnsBtn.onclick = function(){
    // Signal to the state machine that answer was shown
    if(isCorrectPresent(presentAnswer.value.toLowerCase(), listOfVerbs[shuffledIndex].present) &&
       isCorrectPastSimple(pastSimpleAnswer.value.toLowerCase(), listOfVerbs[shuffledIndex].pastSimple) &&
       isCorrectPastParticiple(pastParticipleAnswer.value.toLowerCase(), listOfVerbs[shuffledIndex].pastParticiple) ){
        correctWord();
        stateMachine(states.QUIZ_STARTED_ANSWER_CORRECT);
    }else{
        incorrectWord();
        stateMachine(states.QUIZ_STARTED_ANSWER_INCORRECT);
    }
};

let nextWordBtn = document.querySelector('#btn-next-word');
nextWordBtn.onclick = function(){
    // Check if all words were already taken. No new words to show.
    if(aluno.words_total >= Number(aluno.words_learned))
    {
        stateMachine(states.NO_MORE_WORDS);
    } else{
        wordNumber.innerHTML = aluno.words_total + 1;
        stateMachine(states.QUIZ_STARTED_NO_ANSWER);
    }
}

/* 
----------------------------------------------------------------------------------
Program resetting
----------------------------------------------------------------------------------
The program erases all data and becomes prepared to a new quiz.
*/ 

const saveBtn = document.querySelector('#btn-save');
saveBtn.onclick = function(){
    
    // Erase quiz log
    quizLogBoard.innerHTML = 'QUIZ LOG:';
    
    stateMachine(states.STUDENT_REGISTERED);
    wordNumber.innerHTML = 0;
    infinitiveAnswer.innerHTML = '';
    presentAnswer.value = '';
    pastSimpleAnswer.value = '';
    pastParticipleAnswer.value = '';
    resetStudentScore();
    updateStudentScore();
}

/* 
----------------------------------------------------------------------------------
Clearing all labels
----------------------------------------------------------------------------------
The program shifts between answer labels to be visible and invisible. This is meant
so the message board and the answer labels can occupy the same space to optimize
space (especially in smartphones)
*/ 
function setLabelVisibility(visibilityMode){
    for(let i = 0; i < allLabels.length; i++){
        allLabels[i].style.visibility = visibilityMode;
    }
}

/* 
----------------------------------------------------------------------------------
State Machine
----------------------------------------------------------------------------------
This part of the code configures every button that must be activated or
deactivated depending on the program's state to prevent users from activating
forbidden functions (like starting a quiz without a verb list).
*/ 

const states = {
    STUDENT_REGISTERED: 'student-registered',
    QUIZ_STARTED_NO_ANSWER: 'quiz-started-no-answer', 
    QUIZ_STARTED_ANSWER_SHOWN: 'quiz-started-answer-shown',
    QUIZ_STARTED_ANSWER_CORRECT: 'quiz-started-answer-correct',
    QUIZ_STARTED_ANSWER_INCORRECT: 'quiz-started-answer-incorrect',
    NO_MORE_WORDS: 'no-more-words'
};

stateMachine(states.STUDENT_REGISTERED);

function stateMachine(currentState){
    if(!currentState){
        throw new Error('State is not defined');
    }
    switch(currentState){
        case states.STUDENT_REGISTERED:
            setLabelVisibility('hidden'); // Hide verbs. Message Board is showing a message
            messageBoard.innerHTML = 'Choose how many words from the list you already know in the "learned words" box and start the quiz anytime.';
            startBtn.disabled = false;
            startBtn.style.backgroundColor="#DDDD00";
            showAnsBtn.disabled = true;
            showAnsBtn.style.backgroundColor="#555500";
            nextWordBtn.disabled = true;
            nextWordBtn.style.backgroundColor="#555500";
            saveBtn.disabled = true;
            saveBtn.style.backgroundColor="#555500";
            presentCheckbox.checked = true;
            pastSimpleCheckbox.checked = true;
            pastParticipleCheckbox.checked = true;
            presentCheckbox.disabled = false;
            pastSimpleCheckbox.disabled = false;
            pastParticipleCheckbox.disabled = false;
            cefrCheckBoxes.forEach(
                function(checkbox){
                    checkbox.disabled = false;
                }   
            );
            cefrCheckBoxes.forEach(
                function(checkbox){
                    checkbox.checked = false;
                }   
            );
            cefrCheckBoxes[0].checked = true; 
            break;
        case states.QUIZ_STARTED_NO_ANSWER:
            setLabelVisibility('visible'); // Show verbs. Student needs to write the answers
            messageBoard.innerHTML = '';
            shuffledIndex = shuffleVerb(listOfVerbs, wordNumber);
            console.log(shuffledIndex);
            showInfinitive(infinitiveAnswer, presentAnswer, pastSimpleAnswer, pastParticipleAnswer, listOfVerbs, shuffledIndex);
            startBtn.disabled = true;
            startBtn.style.backgroundColor="#555500";
            showAnsBtn.disabled = false;
            showAnsBtn.style.backgroundColor="#DDDD00";
            nextWordBtn.disabled = true;
            nextWordBtn.style.backgroundColor="#555500";
            saveBtn.disabled = false;
            saveBtn.style.backgroundColor="#DDDD00";
            presentCheckbox.disabled = true;
            pastSimpleCheckbox.disabled = true;
            pastParticipleCheckbox.disabled = true;
            if(presentCheckbox.checked == false){
                presentAnswer.value = '---';
                presentAnswer.disabled = true;
            }else{
                presentAnswer.disabled = false;
            }
            if(pastSimpleCheckbox.checked == false){
                pastSimpleAnswer.value = '---';
                pastSimpleAnswer.disabled = true;
            }else{
                pastSimpleAnswer.disabled = false;
            }
            if(pastParticipleCheckbox.checked == false){
                pastParticipleAnswer.value = '---';
                pastParticipleAnswer.disabled = true;
            }else{
                pastParticipleAnswer.disabled = false;
            }
            cefrCheckBoxes.forEach(
                function(checkbox){
                    checkbox.disabled = true;
                }   
            );
            break;
        case states.QUIZ_STARTED_ANSWER_SHOWN:
            messageBoard.innerHTML = 'Was the given answer correct or incorrect?';
            showPast(infinitiveAnswer, pastSimpleAnswer, pastParticipleAnswer, listOfVerbs, shuffledIndex);
            startBtn.disabled = true;
            startBtn.style.backgroundColor="#555500";
            showAnsBtn.disabled = true;
            showAnsBtn.style.backgroundColor="#555500";
            nextWordBtn.disabled = false;
            nextWordBtn.style.backgroundColor="#DDDD00";
            saveBtn.disabled = false;
            saveBtn.style.backgroundColor="#DDDD00";
            break;
        case states.QUIZ_STARTED_ANSWER_CORRECT:
            setLabelVisibility('hidden'); // Hide verbs. Message Board is showing a message
            messageBoard.innerHTML = 'Congratulations! Your answer is correct. Click on NEXT WORD to proceed.';
            showPast(infinitiveAnswer, presentAnswer, pastSimpleAnswer, pastParticipleAnswer, listOfVerbs, shuffledIndex);
            startBtn.disabled = true;
            startBtn.style.backgroundColor="#555500";
            showAnsBtn.disabled = true;
            showAnsBtn.style.backgroundColor="#555500";
            nextWordBtn.disabled = false;
            nextWordBtn.style.backgroundColor="#DDDD00";
            saveBtn.disabled = false;
            saveBtn.style.backgroundColor="#DDDD00";
            break;
        case states.QUIZ_STARTED_ANSWER_INCORRECT:
            setLabelVisibility('hidden'); // Hide verbs. Message Board is showing a message
            messageBoard.innerHTML = 'Unfortunately, your answer is incorrect. Click on NEXT WORD to proceed.';
            showPast(infinitiveAnswer, presentAnswer, pastSimpleAnswer, pastParticipleAnswer, listOfVerbs, shuffledIndex);
            startBtn.disabled = true;
            startBtn.style.backgroundColor="#555500";
            showAnsBtn.disabled = true;
            showAnsBtn.style.backgroundColor="#555500";
            nextWordBtn.disabled = false;
            nextWordBtn.style.backgroundColor="#DDDD00";
            saveBtn.disabled = false;
            saveBtn.style.backgroundColor="#DDDD00";
            break;
        case states.NO_MORE_WORDS:
            setLabelVisibility('hidden'); // Hide verbs. Message Board is showing a message
            let messageToBeShown = 'Your score: ' + aluno.words_right + ' words out of ' + aluno.words_total + '. ';
            if(aluno.words_right / aluno.words_total < 0.6){
                messageToBeShown = messageToBeShown.concat('Keep working on your list. You will soon memorize a lot of words!');
            }else if(aluno.words_right / aluno.words_total < 0.9){
                messageToBeShown = messageToBeShown.concat('You have done a great job! You learned many words from the list!');
            }else{
                messageToBeShown = messageToBeShown.concat('Your memorization skills are impressive! You should consider adding more verbs to your list.');
            }
            messageToBeShown = messageToBeShown.concat('<br>There are no more words to show. Press RESET QUIZ to create a new quiz.');           
            messageBoard.innerHTML = messageToBeShown; 
            startBtn.disabled = true;
            startBtn.style.backgroundColor="#555500";
            showAnsBtn.disabled = true;
            showAnsBtn.style.backgroundColor="#555500";
            nextWordBtn.disabled = true;
            nextWordBtn.style.backgroundColor="#555500";
            saveBtn.disabled = false;
            saveBtn.style.backgroundColor="#DDDD00";
            break;
    }
}