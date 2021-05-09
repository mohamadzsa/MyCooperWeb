var stepNumber = 0;

URL = window.URL || window.webkitURL;
var gumStream;
var recorder;
var input;
var encodingType;
var encodeAfterRecord = true;
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext;

var allSteps = document.getElementById("allSteps");
var recordingsList = document.getElementById("recordingsList");
var stepdes = document.getElementById("stepdes");
var steppic = document.getElementById("steppic");
var stepbpic = document.getElementById("stepbpic");
var recStopBtn = document.getElementById("recStopBtn");
var recStartBtn = document.getElementById("recStartBtn");

var stepdesArray = [
  "",
  "Tip: Yellow Pin --> Red Pin",
  "Tip: (Yellow line) Green Area-->  Red Area",
  "Tip: (Circle on the tower) up --> right ",
  "Tip: (Pins) blue, yellow and green  -->  green, blue, and yellow",
  "Tip: purple pin -> attach ",
  "Tip: Blue circle red -> yellow ",
  "Try to ask someone to take a picture of the completed puzzle with his or her cellphone",
  "Thanks a lot for your help you can close the windows now",
  "Thank you!",
  "",
  "",
  "",
  "",
  ""
];

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

  stepNumber = stepNumber + 1;
  console.log(blob);
  var fd = new FormData();
  fd.append("upl", blob, "sss.mp3");

  fetch("/api/test", {
    method: "post",
    enctype: "multipart/form-data",
    body: fd,
  });
  addStep(aDiv);
}

function startRecording() {
  
  var constraints = { audio: true, video: false };
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      audioContext = new AudioContext();
 
      gumStream = stream;

      input = audioContext.createMediaStreamSource(stream);

      encodingType = "mp3";

      recorder = new WebAudioRecorder(input, {
        workerDir: "js/",
        encoding: encodingType,
        numChannels: 2,
      });

      recorder.onComplete = function (recorder, blob) {
        createDownloadLink(blob, recorder.encoding);
      };

      recorder.setOptions({
        timeLimit: 120,
        encodeAfterRecord: encodeAfterRecord,
        ogg: { quality: 0.5 },
        mp3: { bitRate: 160 },
      });
      recorder.startRecording();
      
    })
    .catch(function (err) {});
}
function addStep(audioP) {
  var imgSrc = "./images/Steps/step" + stepNumber + ".png";
  var imgBSrc= "./images/Steps/stepb" + stepNumber + ".png";
  console.log(stepNumber)
  stepdes.innerHTML = stepdesArray[stepNumber];
  steppic.src = imgSrc;
  stepbpic.src = imgBSrc;
  let stepRow = document.createElement("div");
  let stepLabel = document.createElement("label");
  stepRow.classList.add("row");
  stepRow.classList.add("channel-row");
  Object.assign(stepLabel, {
    for: "step" + String(stepNumber),
  });
  stepLabel.innerHTML = "Step" + String(stepNumber);
  stepRow.appendChild(stepLabel);

  stepRow.appendChild(audioP);
  allSteps.appendChild(stepRow);
}


function skipStep() {
  stepNumber = stepNumber + 1;
  var imgSrc = "./images/Steps/step" + stepNumber + ".png";
  var imgBSrc= "./images/Steps/stepb" + stepNumber + ".png";
  console.log(stepNumber)
  stepdes.innerHTML = stepdesArray[stepNumber];
  steppic.src = imgSrc;
  stepbpic.src = imgBSrc;
  
}