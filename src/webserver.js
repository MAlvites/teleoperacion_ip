#!/usr/bin/env node
'use strict';

const https = require("https");
const fs = require("fs");
const express = require('express');
const cors = require('cors');
const rosnodejs = require('rosnodejs');
const robotHandler = require('./robotHandler');

const app = express();
let robotState = null;
var moveCommand = "parar";

var poseRobot;
const port =8080;

// Certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/bot.qhalirobot.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/bot.qhalirobot.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/bot.qhalirobot.com/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};



app.use(cors());

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
        /*app.listen(port, () => {
            console.log(port);
          }) 
*/
        https.createServer(credentials, app).listen(port);
        console.log(port);
    });
