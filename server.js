const http = require("http");
const express = require("express");
var multer = require("multer");
const path = require("path");
const app = express();
const fs = require('fs');
app.use(express.json());

const usersData = [];
var userID = 0;


app.post("/userID", function (req, res) {
  userID = userID + 1;
  console.log(userID);
  var consent = JSON.stringify("consent approved by userID:" + userID);
  var filepath = "data/consent" + userID.toString() + ".json";
  fs.writeFile(filepath, consent, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON data is saved.");
});
  res.status(200).send("Test");
});


app.post("/api", function (req, res) {
  usersData.push(req.body);
  var DataString = JSON.stringify(usersData);
  var filepath = "data/d" + userID.toString() + ".json";
  res.status(200).send("Test");
  fs.writeFile(filepath, DataString, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON data is saved.");
});
});




app.get("/api", function (req, res) {
  var data = JSON.stringify(usersData);
  res.send(data);
});


var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'uploads/')
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + ".mp3")
  }
});

var upload = multer({ storage: storage }).single('upl'); 


app.post('/api/test', function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
    } else if (err) {
      // An unknown error occurred when uploading.
    }

    // Everything went fine.
  })
})

app.use(express.static("express"));

app.use("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/express"));
});



app.post("/", (req, res) => {
  return res.send("Received a POST HTTP method");
});

const server = http.createServer(app);
const port = 3000;

server.listen(port);
console.debug("Server listening on port " + port);
