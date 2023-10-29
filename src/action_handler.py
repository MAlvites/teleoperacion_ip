#!/usr/bin/python2

import rospy
from std_msgs.msg import String
import time
import serial

#Dictionary of actions
dict_action = {
    "cero":"00",
    "explicacion3":"10",
    "saludo":"20",
    "corto":"30",
    "lamentar":"40",
    "explicacion2":"50",
    "explicacion1":"60",
    "estiramiento":"70",
    "apuntar":"80",
    "rutina1":"62",
    "rutina2":"12",
}

def send_action(message):
    if message.data in dict_action.keys():
        serial_port.write(dict_action[message.data].encode())
        print("Se envio "+ message.data + " = " + dict_action[message.data])

if __name__ == '__main__':
    serial_port = serial.Serial(
        port="/dev/ttyTHS0",
        baudrate=115200,
        bytesize=serial.EIGHTBITS,
        parity=serial.PARITY_NONE,
        stopbits=serial.STOPBITS_ONE,
        timeout=0,
    )
    # Wait a second to let the port initialize
    time.sleep(1)

    print("UART ready to receive actions")
    rospy.init_node('action_handler', anonymous=True)
    rospy.Subscriber("/action_arm",String,send_action)
    rospy.spin()
