#!/usr/bin/env node
'use strict';

const https = require("https");
const fs = require("fs");
const express = require('express');
const cors = require('cors');
const rosnodejs = require('rosnodejs');
const robotHandler = require('./robotHandler');
const bodyParser = require('body-parser');

const app = express();
let robotState = null;
var moveCommand = "parar";
let lexHandler = null;
var poseRobot;
const port =8080;
var privateKey = fs.readFileSync( '/home/jetson/catkin_ws/src/teleoperacion_ip/src/Certificates/key.pem' );
var certificate = fs.readFileSync( '/home/jetson/catkin_ws/src/teleoperacion_ip/src/Certificates/cert.pem' );

app.use(cors())

// Movimientos
app.post('/move/:mov', (req, res) => {
    moveCommand=req.params.mov;
    console.log("Se recibio un movimiento " + req.params.mov)
    res.send("OK");
});

//Acciones
app.post('/action/:act', (req, res) => {
    console.log("Se recibio un accion " + req.params.act)
    robotState.action(req.params.act);
    res.send("OK");
});

//Subscriber
//app.get('/pose', (req,res)=>{
//    poseRobot=robotState.getPose()
//    res.send(poseRobot)
//})

//Send velocity
function sendVel(){
    robotState.movement(moveCommand)
    moveCommand = ""
}

rosnodejs.initNode('/webserver', { onTheFly: true})
    .then((rosNode) => {
        robotState = robotHandler.robotHandler()(rosNode);
        poseRobot = robotState.robotState
        setInterval(sendVel,200)
        https.createServer({
            key: privateKey,
            cert: certificate
        }, app).listen(port);
        console.log(port);
    });
