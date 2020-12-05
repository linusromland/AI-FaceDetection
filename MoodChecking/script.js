const video = document.getElementById("video");
let hold = document.getElementById("hold");
let mood = document.getElementById("mood");
let accurancy = document.getElementById("accurat");

let closest;

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("./models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
  faceapi.nets.faceExpressionNet.loadFromUri("./models"),
]).then(startVideo);

function startVideo() {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
    })
    .then(
      (stream) => (video.srcObject = stream),
      (err) => console.log(err)
    );
}

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    /*const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);*/
    let expression = checkExpression(detections[0].expressions);
    hold.innerText = "The AI thinks you mood is:";
    mood.innerText = (await expression).expression
    accurancy.innerText = " and is " + (await expression).accuracy + "% certain about it!"


  }, 100);
});

//This is the worst code i have written in quite a while. I hate it. And will change it. I am just very tired and did not want to think. So this is the answer to that
async function checkExpression(expression) {
  let numbers = [
    expression.angry,
    expression.disgusted,
    expression.fearful,
    expression.happy,
    expression.neutral,
    expression.sad,
    expression.surprised,
  ];
  let expressions = [
    "angry",
    "disgusted",
    "fearful",
    "happy",
    "neutral",
    "sad",
    "surprised",
  ];

  closest = numbers.reduce((a, b) => {
      return Math.abs(b - 1) < Math.abs(a - 1) ? b : a;
  });
  
  let largest = numbers.findIndex(ifRight)
  let accurat = (numbers[largest]*100).toFixed(1)
  return {"expression": expressions[largest], "accuracy": accurat}
}

function ifRight(input) {
  return closest == input;
}




