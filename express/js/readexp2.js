var stepNumber = 0;

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

var userData = {
  repeatNumbers: 0,
  userUtter: [{ timeISO: Date.now(), time: "", uter: "continue" }],
  id: "p2",
  prototype: "ai",
  vAUtter: [{ timeISO: Date.now(), time: "", uter: "success" }],
};

var stopWords = ["stop", "bye", "bye-bye"];
var validateWord = true;
var currentStep = document.getElementById("currentStep");
var speakBtn = document.getElementById("speakBtn");
var btndes = document.getElementById("btndes");
var jumpnext = document.getElementById("jumpnext");
var userUtter = document.getElementById("userUtter");
var stepNumberInd = document.getElementById("stepNumberInd");
var stepMessage = document.getElementById("stepMessage");
var notListening = document.getElementById("notListening");
var stepNumbers = 7;
function sayItLoud() {
  speakBtn.innerHTML = "wait...";
  btndes.innerHTML = "You can talk after instruction";
  speakBtn.classList.remove("isRunning");
  speakBtn.disabled = true;
  voiceIntIcon.classList.add("isActive");
  if (validateWord === true) {
    var stepAudio = new Audio(
      "../../audios/ai/insAudio" + stepNumber.toString() + ".mp3"
    );
    stepNumberInd.innerHTML = "Step: " + stepNumber;
    stepMessage.innerHTML =
      "Please take the action based on the uttered instruction and change the related pieces on the puzzle playground";
    stepAudio.play();
    currentStep.classList.add("isActive");
    if (currentStep.classList.contains("failure")) {
      currentStep.classList.remove("failure");
    }
    currentStep.classList.add("success");
  } else {
    var stepAudio = new Audio("../../audios/ai/error.mp3");
    stepAudio.play();
    currentStep.classList.add("isActive");
    currentStep.classList.add("failure");
    if (currentStep.classList.contains("success")) {
      currentStep.classList.remove("success");
    }
  }
  stepAudio.addEventListener("ended", function () {
    stepMessage.innerHTML =
      'Please say <strong> "Repeat" </strong>to listen again   or <strong> "Next"  </strong>  to move on <br>  <strong> ! </strong> Click on the mic if the speech recognition has been stopped';
    runSpeechRecognition();
    voiceIntIcon.classList.remove("isActive");
    userUtter.classList.remove("isActive");
    postData();
  });
}
function stopInstructions(state) {
  if (state === "done") {
    var stepAudio = new Audio("../../audios/ai/byebye.mp3");
    jumpnext.classList.remove("ishiddn");
    jumpnext.classList.add("isactive");
    stepAudio.play();
  } else {
    var stepAudio = new Audio("../../audios/ai/byebye.mp3");
    jumpnext.classList.remove("ishiddn");
    jumpnext.classList.add("isactive");
    stepAudio.play();
  }

  currentStep.classList.add("isActive");
  if (currentStep.classList.contains("failure")) {
    currentStep.classList.remove("failure");
  }
  currentStep.classList.add("success");
}

function runSpeechRecognition() {
  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
  recognition.onstart = function () {
    btndes.innerHTML = "Now you can talk";
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
    //   var confidence = event.results[0][0].confidence;
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
        window.location = "./step05.html";
      }, 8000);
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
