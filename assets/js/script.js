//use querySelector to access HTML
var highScores = document.querySelector("#highScore");
var timeLeft = document.querySelector("#timeLeft");
var mainSection = document.querySelector("#main-section");
var title = document.querySelector("#title");
var question = document.querySelector("#question");
var start = document.querySelector("#start");
var answer = document.querySelector("#answer");
var timeDisplay = document.querySelector("timeDisplay");

//original set of question and answer list, didnt work out this way ...
//var questionList = { 
    //question: { 
        //0 : "Commonly used data types DO NOT include",
        //1 : "Arrays in javascript can be used to store _______.",
        //2 : "The condition in an if / else statement is enclosed within _______.", 
        //3 : "String values must be enclosed within _______ when being assigne to variables.", 
        //4 : "A very useful tool used druing development and debugging for printing content to the debugger is:"
    //}
//};

//var answerList = { 
    //answer: { 
        //0 : {
        //    0: "Strings",
        //   1: "Boolean",
        //    2: "Alerts",
        //   3: "Numbers"},
        //1 : { 
        //    0: "Number of strings",
        //    1: "Other arrays",
        //    2: "Booleans",
        //    3: "All of the above"},
        //2 : {
        //    0: "Quotes",
        //    1: "Curly Brackets",
        //    2: "Parentheses",  
        //    3: "Square Brackets"},      
        //3 : { 
        //    0: "Commas",
        //    1: "Curly brackets",
        //    2: "Quotes", 
        //    3: "Parentheses"}, 
        //4 : { 
        //    0: "Javascript",
        //    1: "Terminal/bash",
        //    2: "For loops", 
        //    3: "Console.log"},      
    //}
//};

//make question of the quiz, using this new 'sturcture' way
class questionList  {
    constructor(question, option, answer) {
        this.question = question;
        this.option = option;
        this.answer = answer;
    }
}

var questionCombo = [];

//make question and use push() to put into questionCombo array
var option1 = ["1. strings", "2. booleans", "3. alerts", "4. numbers"]; 
var question1 = new questionList("Commonly used data types DO NOT include", option1, "3. alerts");
questionCombo.push(question1);

var option2 = ["1. numbers and strings", "2. other arrays", "3. booleans", "4. all of above"]; 
var question2 = new questionList("Arrays in javascript can be used to store _______.", option2, "4. all of above");
questionCombo.push(question2);

var option3 = ["1. quotes", "2. curly brackets", "3. parentheses", "4. square brackets"]; 
var question3 = new questionList("The condition in an if / else statement is enclosed within _______.", option3, "3. parentheses");
questionCombo.push(question3);

var option4 = ["1. commas", "2. curly brackets", "3. quotes", "4. parentheses"]; 
var question4 = new questionList("String values must be enclosed within _______ when being assigne to variables.", option4, "3. quotes");
questionCombo.push(question4);

var option5 = ["1. JavaScript", "2. terminal/bash", "3. for loops", "4. console.log"]; 
var question5 = new questionList("A very useful tool used druing development and debugging for printing content to the debugger is:", option5, "4. console.log");
questionCombo.push(question5);

//main function, make quiz and score clickable in HTML
function begain() {
    start.addEventListener("click", questionPage);
    highScores.addEventListener("click", scoreDisplay);
}

//make var for functions to use
var choiceList = [];
var timeRemain = 75;
var questionNumber = 0;
var rightWrong = false;
var score = 0;
var initList = [];

//question not-display before the start of quiz and creat buttons for options
function questionPage () {
    //set timer
    var seconds = setInterval(function(){
        timeRemain --;
        timeLeft.textContent = timeRemain;
        if(timeRemain === 0) {
            clearInterval(seconds);
            if (title.textContent !== "All Done."){
                endPage();
            }
        }
    }, 1000)
    
    start.setAttribute("style", "display: none");
    question.setAttribute("style", "display: none");

    for (var i = 0; i < questionCombo[0].option.length; i++){
        var realChoice = document.createElement("button");
        mainSection.appendChild(realChoice);
        choiceList.push(realChoice);
        realChoice.setAttribute("id", "buttonNew");
        }
        nextPage();
}

//based on number of current question, if the last one, go next question or end page
function nextPage(event) {
    makeChoice(event);
    if (questionNumber < questionCombo.length){
        newPage();
    } else {
        endPage();
    }
}

//if current question is not first question, check answer of the prebious question
//reduce the time by 10 if answer wrong
function makeChoice(event) {
    if (event !== undefined) {
        if (event.currentTarget.textContent === questionCombo[questionNumber - 1].answer) {
            rightWrong = true;
            answer.textContent = "correct";
        } else {
            rightWrong = false;
            answer.textContent = "wrong";
            if (timeRemain > 10) {
                timeRemain = timeRemain-10;
            } else {
                timeRemain = 1;
            }
        }
        score = timeRemain;
    }
}

//change question and choice
function newPage() {
    title.textContent = questionCombo[questionNumber].question;
    for (var i = 0; i < questionCombo[questionNumber].option.length; i++ ) {
        choiceList[i].textContent = questionCombo[questionNumber].option[i];
        choiceList[i].addEventListener("click", nextPage);
    }
    questionNumber++;
}

//quiz end and display score, generate form and ask for initials
function endPage() {
    title.textContent = "All Done.";
    timeRemain = 1;
    choiceReset();
    question.setAttribute("style", "display: visible");
    question.textContent = "your final score is " + score;
    
    //after 3s, clear the last right/wrong
    var removeLastAnswer = 0;
    removeLastAnswer = setTimeout(function(){
        answer.textContent = "";
    }, 3000);
    
    //form for initials input
    var newForm = document.createElement("form");
    mainSection.appendChild(newForm);
    newForm.setAttribute("id", "form");

    var label = document.createElement("label");
    newForm.appendChild(label);
    label.textContent = "Enter initials: "

    var input = document.createElement("input")
    newForm.appendChild(input);
    input.setAttribute("id", "initials");

    var submit = document.createElement("button");
    newForm.appendChild(submit);
    submit.textContent = "Submit";

    title.setAttribute("style", "align-self: start");

    input.addEventListener("keydown", preventReload);
    submit.addEventListener("click", scoreAdding);
}

//clear the choice array, get ready for the restart of the game
function choiceReset () {
    for(var i = 0; i < choiceList.length; i++ ) {
        choiceList[i].remove();
    }
    choiceList = [];
}

//prevent enter to reload the page
function preventReload(event) {
    if(event.key === "Enter") {
        event.preventDefault();
    }
}

//save the score and prevent submit to reload the page
function scoreAdding (event) {
    if (event !== undefined) {
        event.preventDefault();
    }

    var initial = document.getElementById("initials");
    document.getElementById("form").remove();
    scoreStorage(initial);
}

//using JSON add score to local storage
function scoreStorage(initial) {
    if(localStorage.getItem("initList") !== null) {
        initList = JSON.parse(localStorage.getItem("initList"));
    }

    initList.push(initial.value + " - " + score);
    localStorage.setItem("initList", JSON.stringify(initList));

    scoreDisplay();
}

//show the score page, hide start button if check before the game
function scoreDisplay() {
    title.textContent = "Highscore";
    
    start.setAttribute("style","display: none");

    question.textContent = "";
    question.setAttribute("style", "white-space: pre-wrap; font-size: 200%");
    if(localStorage.getItem("initList") !== null) {
        initList = JSON.parse(localStorage.getItem("initList"));
    }

    for (var i = 0; i < initList.length; i++) {
        question.textContent += initList[i] + "\n";
    }
    
    endGame();
}

//creat the go back/clear high score button if not already
function endGame() {
    if(!document.getElementById("restart")) {
        var again = document.createElement("button");
        mainSection.appendChild(again);
        again.textContent = "Go Back";
        again.setAttribute("id", "restart");
        
        var clear = document.createElement("button");
        mainSection.appendChild(clear);
        clear.textContent = "Clear High Scores";
        clear.setAttribute("id", "resetScores");
        
        again.addEventListener("click", restart);
        clear.addEventListener("click", resetScores);
    }
}

//restar the game
function restart() {
    title.setAttribute("style", "align-self: center");
    question.setAttribute("style", "align-self: center; font-size: 120%");

    document.getElementById("restart").remove();
    document.getElementById("resetScores").remove();

    title.textContent = "Coding Quiz Challenge";
    question.textContent = "Try to answer the following code-related questions within the time limit. Keep in mind that incorrect answers will penalize your score/time by ten seconds!";
    start.setAttribute("style", "display: visible");

    questionNumber = 0;
    score = 0;
    timeRemain = 75;

    begain();
}

//clear score
function resetScores() {
    localStorage.clear();
    question.textContent = "";
    initList = [];
}


//-------------------------------------------------
begain();