var stepNumber = 0;
var msg = new SpeechSynthesisUtterance();
var voices;
var readyToPlay = false;
var voiceIntIcon = document.getElementById("voiceIntIcon");
var continueWords = [
  "continue",
  "next",
  "step",
  "next step",
  "go on",
  "ok",
  "Okay",
  "what is the next step?",
  "what's the next step?",
];
var repeatWords = [
  "repeat",
  "again",
  "what",
  "tell me again",
  "tell me",
  "I didn't understand",
];
var stopWords = ["stop", "bye", "bye-bye"];
var validateWord = true;
var currentStep = document.getElementById("currentStep");
var speakBtn = document.getElementById("speakBtn");
var stepMessage = document.getElementById("stepMessage");
var userUtter = document.getElementById("userUtter");
var stepNumberInd = document.getElementById("stepNumberInd");
var notListening = document.getElementById("notListening");
msg.voiceURI = "native";
msg.lang = "en-US";

var instructionSteps = [
  "Hello I'm here to help you in solving tasks, say continue to start",
  "First, On top right of the playground turn the arrow from deactivate mode to active mode",
  "Well done! now in the middle right rotate the blue spinner from red to yellow",
  "On the bottom left move the yellow connector from red-red to blue-blue",
  "In the top left corner,there is a circle shaped handler, rotate the handler from top to right",
  "There are three pins on the bottom right, reorder them from top to bottom in this color order green and blue",
  "Thank you, now please take a photo of the puzzle with your mobile phone",
];

var stepNumbers = instructionSteps.length;

document.addEventListener("DOMContentLoaded", function () {
  voices = window.speechSynthesis.getVoices();
});

var userData = {
  repeatNumbers: 0,
  userUtter: [{ timeISO: Date.now(), time: "", uter: "continue" }],
  id: "p1",
  prototype: 1,
  vAUtter: [{ timeISO: Date.now(), time: "", uter: "success" }],
};

function sayItLoud() {
  speakBtn.innerHTML = "wait...";
  speakBtn.classList.remove("isRunning");
  speakBtn.disabled = true;
  msg.voice = voices[1];
  continueMessage = ". Say Continue when you're done with the task";
  voiceIntIcon.classList.add("isActive");
  if (validateWord === true) {
    msg.text = instructionSteps[stepNumber] + "";
    stepNumberInd.innerHTML = "Step: " + stepNumber;
    stepMessage.innerHTML =
      "Please take the action based on the uttered instruction and change the related pieces on the puzzle playground";
    currentStep.classList.add("isActive");
    if (currentStep.classList.contains("failure")) {
      currentStep.classList.remove("failure");
    }
    currentStep.classList.add("success");
  } else {
    msg.text =
      "Sorry, I couldn't understand, please repeat your word, or try some thing else.";
    stepMessage.innerHTML = "<span><b>Error: </b></span>" + msg.text;
    currentStep.classList.add("isActive");
    currentStep.classList.add("failure");
    if (currentStep.classList.contains("success")) {
      currentStep.classList.remove("success");
    }
  }
  msg.onend = function (e) {
    runSpeechRecognition();
    voiceIntIcon.classList.remove("isActive");
    userUtter.classList.remove("isActive");
    postData();
  };

  speechSynthesis.speak(msg);
}
function stopInstructions(state) {
  console.log(state);
  msg.voice = voices[1];
  if (state === "done") {
    msg.text =
      "You have done all the tasks successfully. Thanks a lot for your participation";
  } else {
    msg.text = "Ok, Bye Bye";
  }
  stepMessage.innerHTML =
    "Please take the action based on the uttered instruction and change the related pieces on the puzzle playground";
  currentStep.classList.add("isActive");
  if (currentStep.classList.contains("failure")) {
    currentStep.classList.remove("failure");
  }
  currentStep.classList.add("success");
  msg.onend = function (e) {};
  speechSynthesis.speak(msg);
}

function runSpeechRecognition() {
  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
  recognition.onstart = function () {
    speakBtn.classList.add("isRunning");
    speakBtn.innerHTML =
      '<img class="micIcon" src="../images/MicActive.svg" alt="">';
    speakBtn.disabled = true;
  };
  recognition.onspeechend = function () {
    recognition.stop();
  };
  recognition.onresult = function (event) {
    var transcript = event.results[0][0].transcript;
    userUtter.innerHTML = transcript;
    userUtter.classList.add("isActive");
    validateUserUtterance(transcript);
    console.log(transcript);
  };

  recognition.onend = function (event) {
    speakBtn.classList.remove("isRunning");
    speakBtn.innerHTML = '<img class="micIcon" src="../images/Mic.svg" alt="">';
    speakBtn.disabled = false;
  };
  recognition.start();
}

function validateUserUtterance(transcript) {
  console.log(stepNumber);
  console.log(stepNumbers);
  var currTime = new Date();
  var utterData = {
    timeISO: currTime.toISOString(),
    time: Date.now(),
    uter: transcript,
  };
  userData.userUtter.push(utterData);
  var instructionState = "stop";
  if (continueWords.includes(transcript)) {
    if (stepNumber > stepNumbers - 2) {
      var instructionState = "done";
      stopInstructions(instructionState);
      setTimeout(function () {
        window.location = "./step03.html";
      }, 4000);
    } else {
      var vaDataSuccess = {
        timeISO: currTime.toISOString(),
        time: Date.now(),
        uter: "success",
      };
      userData.vAUtter.push(vaDataSuccess);
      validateWord = true;
      stepNumber = stepNumber + 1;
      sayItLoud();
    }
  } else if (repeatWords.includes(transcript)) {
    validateWord = true;
    sayItLoud();
  } else if (stopWords.includes(transcript)) {
    validateWord = true;
    stopInstructions(instructionState);
  } else {
    var vaDataFalse = {
      timeISO: currTime.toISOString(),
      time: Date.now(),
      uter: "False",
    };
    userData.vAUtter.push(vaDataFalse);
    validateWord = false;
    sayItLoud();
  }
}

function postData() {
  fetch("/api", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },

    //make sure to serialize your JSON body
    body: JSON.stringify(userData),
  }).then((response) => {
    console.log(response);
    //do something awesome that makes the world a better place
  });
}
