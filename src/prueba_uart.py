#!/usr/bin/python3
import time
import serial

print("Prueba de motores")
print("1:afimacion")
print("2:negacion")
print("3:duda")     


serial_port = serial.Serial(
    port="/dev/ttyTHS0",
    baudrate=115200,
    bytesize=serial.EIGHTBITS,
    parity=serial.PARITY_NONE,
    stopbits=serial.STOPBITS_ONE,
)
# Wait a second to let the port initialize
time.sleep(1)

dict_action = {
    "saludo":"10",
    "negar":"20",
    "mirar-pantalla":"30",
    "lamentar":"40",
    "entregar-mando":"50",
    "despedida":"50",
    "celebrar":"50",
    "asentir":"50",
}

try:
    # Send a simple header
    #serial_port.write("UART Demonstration Program\r\n".encode())
    #serial_port.write("NVIDIA Jetson Nano Developer Kit\r\n".encode())
    while True:
        dato=input("Ingrese codigo de expresion: ")	
        serial_port.write(dato.encode())
        print(dato)
        #print(dict_action[dato])
        time.sleep(3)

	



except KeyboardInterrupt:
    print("Exiting Program")

except Exception as exception_error:
    print("Error occurred. Exiting Program")
    print("Error: " + str(exception_error))

finally:
    serial_port.close()
    pass
