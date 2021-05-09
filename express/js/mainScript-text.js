var stepNumber = 0;
var loading = document.getElementById("loading");
var msg = new SpeechSynthesisUtterance();
var voices = window.speechSynthesis.getVoices();
msg.voiceURI = "native";
msg.lang = "en-US";

var allSteps = document.getElementById("allSteps");
var recordingsList = document.getElementById("recordingsList");

var continueWords = [
  "continue",
  "next",
  "step",
  "next step",
  "go on",
  "ok",
  "Okay",
];
var repeatWords = [
  "repeat",
  "what",
  "tell me again",
  "tell me",
  "I didn't understand",
];
var stopWords = ["stop", "bye", "bye-bye"];

function stopRecording() {
  gumStream.getAudioTracks()[0].stop();
  recorder.finishRecording();
}
function createDownloadLink(blob, encoding) {
  var url = URL.createObjectURL(blob);
  var au = document.createElement("audio");
  var aDiv = document.createElement("div");
  var link = document.createElement("a");
  au.controls = true;
  au.src = url;
  link.href = url;
  link.download = new Date().toISOString() + "." + encoding;
  link.innerHTML = "DL";

  aDiv.appendChild(au);
  aDiv.appendChild(link);
  recordingsList.appendChild(aDiv);
  stepNumber = stepNumber + 1;
}

function runSpeechRecognition() {
  var result = document.getElementById("result");
  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
  recognition.onstart = function () {
    
    loading.classList.add("isActive");
  };
  recognition.onspeechend = function () {

    loading.classList.remove("isActive");
    recognition.stop();
  };

  recognition.onresult = function (event) {
    var transcript = event.results[0][0].transcript;
    var confidence = event.results[0][0].confidence;
    result.innerHTML =
      "<b>Last Step:</b> " +
      transcript +
      "<br/> <b>Confidence:</b> " +
      confidence * 100 +
      "%";
    result.classList.remove("hide");

    addStep(transcript);
  };

  recognition.start();
}

function sayItLoud(transcript) {
  msg.voice = voices[10];
  if (stepNumber === 0) {
    msg.text =
      "Hello your cooper is here to help you in creating instruction, what is your first step?";
    stepNumber = stepNumber + 1;
  } else {
    msg.text = "You Said, " + transcript + ", now, what is your next step?";
  }
  msg.onend = function () {
    runSpeechRecognition();
  };
  speechSynthesis.speak(msg);
}

function stopSaying(transcript) {
  msg.voice = voices[10];

  msg.text = transcript;

  msg.onend = function (e) {};
  speechSynthesis.speak(msg);
}

function addStep(transcript) {
  if (stopWords.includes(transcript)) {
    var endMessage = "Ok, Your steps are ready, you can add more steps later";
    stopSaying(endMessage);
  } else {
    sayItLoud(transcript);
    console.log(transcript);
    let stepRow = document.createElement("div");
    let stepLabel = document.createElement("label");
    stepRow.classList.add("row");
    stepRow.classList.add("channel-row");
    Object.assign(stepLabel, {
      for: "step" + String(stepNumber),
    });
    stepLabel.innerHTML = "Step" + String(stepNumber);
    stepRow.appendChild(stepLabel);
    let stepInput = document.createElement("input");
    Object.assign(stepInput, {
      className: "u-full-width adt-text-inpt",
      type: "text",
      placeholder: "Say Sth",
      id: "setp" + String(stepNumber),
      value: transcript,
    });
    stepRow.appendChild(stepInput);
    allSteps.appendChild(stepRow);
  }
}
