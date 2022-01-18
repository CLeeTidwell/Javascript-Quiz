/*globally declared variable*/
  var intervalID;
  var time;
  var currentQuestion;

/*select each card div by id and assign to variables*/
const startCard = document.querySelector("#start-card");
const questionCard = document.querySelector("#question-card");
const scoreCard = document.querySelector("#score-card");
const leaderboardCard = document.querySelector("#leaderboard-card");
  
/*hides cards with set attribute*/
function hideCards() {
startCard.setAttribute("hidden", true);
questionCard.setAttribute("hidden", true);
scoreCard.setAttribute("hidden", true);
leaderboardCard.setAttribute("hidden", true);
}
  
const resultDiv = document.querySelector("#result-div");
const resultText = document.querySelector("#result-text");
  
/*hides the result div to be displayed later*/
function hideResultText() {
resultDiv.style.display = "none";}

/*start quiz function on click event listener*/
document.querySelector("#start-button").addEventListener("click", startQuiz);
  
function startQuiz() {
/*replaces all displayed cards to show(.removeattribute 'hidden') question card*/
hideCards();
questionCard.removeAttribute("hidden");
  
/*assigns currentQuestion to 0 when start is clicked and displays currentQuestion in the card*/ 
currentQuestion = 0;
displayQuestion();
  
/*set timer to number of questions x 10*/
time = questions.length * 10;
  
/*runs the function for countdown every 1000ms to update time and display in header*/
intervalID = setInterval(countdown, 1000);
  
/*run displayTime to ensure time appears correctly as soon as the start button is clicked*/
displayTime();
}
  
/*countdown timer, if time out then end quiz*/
function countdown() {
time--;
displayTime();
if (time < 1) {
endQuiz();}
}
  
/*display time*/
const timeDisplay = document.querySelector("#time");
function displayTime() {
timeDisplay.textContent = time;
}
  
/*display current question and answer selection*/
function displayQuestion() {
let question = questions[currentQuestion];
let options = question.options;
let h2QuestionElement = document.querySelector("#question-text");
h2QuestionElement.textContent = question.questionText;
  
for (let i = 0; i < options.length; i++) {
let option = options[i];
let optionButton = document.querySelector("#option" + i);
optionButton.textContent = option;}
}
  
/*add event listener on click to show #quiz-options*/
document.querySelector("#quiz-options").addEventListener("click", checkAnswer);
  
/*run function to check selected answer against correct answer*/
function optionIsCorrect(optionButton) {
return optionButton.textContent === questions[currentQuestion].answer;
}
  
/*function to deduct time for incorrect selection, end game when wrong answer chosen < 10 on timer*/
function checkAnswer(eventObject) {
let optionButton = eventObject.target;
resultDiv.style.display = "block";
if (optionIsCorrect(optionButton)) {
resultText.textContent = "Right Answer!";
setTimeout(hideResultText, 1000);} 
else {
resultText.textContent = "Wrong Answer!";
setTimeout(hideResultText, 1000);
if (time >= 10) {
time = time - 10;
displayTime();} 
else {
time = 0;
displayTime();
endQuiz();}
}

/*increment current question by 1 to change to next question in array*/
currentQuestion++;

/*end quiz when out of questions*/
if (currentQuestion < questions.length) {
displayQuestion();} 
else {
endQuiz();}
}
  
/*display scorecard and hide other divs*/
const score = document.querySelector("#score");
  
/*clear the timer at end of quiz, hide visible cards and display the score card*/
function endQuiz() {
clearInterval(intervalID);
hideCards();
scoreCard.removeAttribute("hidden");
score.textContent = time;}
  
const submitButton = document.querySelector("#submit-button");
const inputElement = document.querySelector("#initials");
  
/*store initials and score when submit button is clicked to local storage*/
submitButton.addEventListener("click", storeScore);
  
function storeScore(event) {
/*stops default form submission*/
event.preventDefault();
  
/*check for input, if left empty give alert*/
if (!inputElement.value) {
alert("Please enter your initials before pressing confirm!");
return;}
  
/*store score and initials*/
let leaderboardItem = {
initials: inputElement.value,
score: time,
};
  
updateStoredLeaderboard(leaderboardItem);
  
/*hide the question card to display the leaderboardcard*/
hideCards();
leaderboardCard.removeAttribute("hidden");
  
renderLeaderboard();
}
  
/*updates the leaderboard stored in local storage*/
function updateStoredLeaderboard(leaderboardItem) {
let leaderboardArray = getLeaderboard();

/*.push new leaderboard item to leaderboard array*/
leaderboardArray.push(leaderboardItem);
localStorage.setItem("leaderboardArray", JSON.stringify(leaderboardArray));
}
  
/*gets "leaderboardArray" from local storage(unless none) and .parse it into a javascript object using JSON.parse*/
function getLeaderboard() {
let storedLeaderboard = localStorage.getItem("leaderboardArray");
if (storedLeaderboard !== null) {
let leaderboardArray = JSON.parse(storedLeaderboard);
return leaderboardArray;} 
else {
leaderboardArray = [];}
return leaderboardArray;
}

/*display leaderboard on leaderboard card*/
function renderLeaderboard() {
let sortedLeaderboardArray = sortLeaderboard();
const highscoreList = document.querySelector("#highscore-list");
highscoreList.innerHTML = "";
for (let i = 0; i < sortedLeaderboardArray.length; i++) {
let leaderboardEntry = sortedLeaderboardArray[i];
let newListItem = document.createElement("li");
newListItem.textContent =
leaderboardEntry.initials + " - " + leaderboardEntry.score;
highscoreList.append(newListItem);}
}
  
/*sort leaderboard array from highest to lowest*/
function sortLeaderboard() {
let leaderboardArray = getLeaderboard();
if (!leaderboardArray) {
return;}  
leaderboardArray.sort(function (a, b) {
return b.score - a.score;
});
return leaderboardArray;
}

/*add event listener click to clear high scores*/  
const clearButton = document.querySelector("#clear-button");
clearButton.addEventListener("click", clearHighscores);
  
/*clear local storage and display empty leaderboard*/
function clearHighscores() {
localStorage.clear();
renderLeaderboard();
}

/*add event listener click to return to start*/   
const backButton = document.querySelector("#back-button");
backButton.addEventListener("click", returnToStart);
  
/*hide leaderboard card, show start card*/
function returnToStart() {
hideCards();
startCard.removeAttribute("hidden");
}
  
/*add event listener to view highscores by clicking link from any point in time on page*/
const leaderboardLink = document.querySelector("#leaderboard-link");
leaderboardLink.addEventListener("click", showLeaderboard);
  
function showLeaderboard() {
hideCards();
leaderboardCard.removeAttribute("hidden");
  
/*stop countdown*/
clearInterval(intervalID);
  
/*assign undefined to time then display it(undefined = nothing shown) so time does not appear on page*/
time = undefined;
displayTime();
  
/*display scores on leaderboard card*/
renderLeaderboard();
}