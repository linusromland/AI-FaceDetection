require("@tensorflow/tfjs-node");
const canvas = require("canvas");
const faceapi = require("face-api.js");
const fs = require("fs");
//const fetch = require("node-fetch");
const express = require("express");
let app;
const port = 3000;

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
//faceapi.env.monkeyPatch({ fetch: fetch });

let models = __dirname + "/models";

console.log(models);

Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromDisk(models),
  faceapi.nets.faceLandmark68Net.loadFromDisk(models),
  faceapi.nets.ssdMobilenetv1.loadFromDisk(models),
]).then((app = express()));

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Server listening on port ${port}!`));
