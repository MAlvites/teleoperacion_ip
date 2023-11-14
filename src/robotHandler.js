#!/usr/bin/env node
'use strict';

const Three = require('three');
const Immutable = require('immutable');
const rosnodejs = require('rosnodejs');
const std_msgs = rosnodejs.require('std_msgs').msg;
const geometry_msgs = rosnodejs.require('geometry_msgs').msg;

//var actions=["cero", "explicacion3", "mirar-pantalla", "lamentar", "entregar-mando", "despedida", "celebrar", "asentir"]
var velocity_msg = new geometry_msgs.Twist()

exports.robotHandler = function() {

    let instance = null;

    let stateMachine = function(rosNode) {
        this.movePublisher = rosNode.advertise('/cmd_vel', geometry_msgs.Twist);
        this.actionPublisher = rosNode.advertise('/action_arm', std_msgs.String);
        rosNode.subscribe('/amcl_pose', geometry_msgs.PoseWithCovarianceStamped,(msg)=>{
            this.updatePose(msg)
        })
    };

    stateMachine.getInstance = function(rosNode) {
        if (instance === null) {
            instance = new stateMachine(rosNode);
        }
        return instance;
    };
  

    stateMachine.prototype.movement = function(command) {
        let msg = new geometry_msgs.Twist()
        switch (command){
            case "avanzar":
                velocity_msg.linear.x += 0.02;
                break;
            case "parar":
                velocity_msg.linear.x = 0.0;
                velocity_msg.angular.z = 0.0;
                break;
            case "girar-izquierda":
                velocity_msg.angular.z += -0.1;
                break;
            case "girar-derecha":
                velocity_msg.angular.z += 0.1;
                break;
            default:
                break;

        }

        this.movePublisher.publish(velocity_msg)      
    };

    let robotState = Immutable.Map({
        robotPoseX : 0.00,
        robotPoseY : 0.00,
        robotPoseTheta : 0.00
    })

    stateMachine.prototype.action = function(command) {
        let msg = new std_msgs.String();
        //if (actions.includes(command)){
            msg.data=command
            this.actionPublisher.publish(msg)
            console.log("Se ejecuta " + command)
        //}
        //else{
        //    console.log(command + " no es una accion válida")
        //}
    };

    stateMachine.prototype.getPose = function() {
        return robotState.toJS();
    };

    stateMachine.prototype.getOrientationFromQuaternion = function(ros_orientation_quaternion){
        var q = new Three.Quaternion(
            ros_orientation_quaternion.x,
            ros_orientation_quaternion.y,
            ros_orientation_quaternion.z,
            ros_orientation_quaternion.w,
        );
        //convert to euler
        var euler = new Three.Euler().setFromQuaternion(q);
        return euler["_z"] * (180/Math.PI);
    };

    stateMachine.prototype.updatePose = function(msg){
        robotState = robotState.set('robotPoseX',msg.pose.pose.position.x.toFixed(3))
        robotState = robotState.set('robotPoseY',msg.pose.pose.position.y.toFixed(3))
        robotState = robotState.set('robotPoseTheta', this.getOrientationFromQuaternion(msg.pose.pose.orientation).toFixed(3))
    };     

    return stateMachine.getInstance;

};

    

