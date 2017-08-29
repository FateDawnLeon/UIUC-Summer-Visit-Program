"""
This is a simple website backend based on Flask using Python language.

To run this server for testing, you need to open up a console
in the project directory and input the command:

        python app.py [localtest] [webcam]

1. The first argument 'localtest' decides whether you want the server
runs on localhost. 0=yes and 1=false.
2. The second argument 'webcam' tells which camera you want to use.
By default it is assigned as 0, which denotes the camera above your
screen if you are using a laptop. You can also input 1, which will 
select the first webcam that is connected with your computer through
USB port.
3. This is an example:

        $ python app.py 1 1

By input the above command the server will run on public host
and open the first connected webcam to stream video when you click
the 'start' button. In this case you should check your public IP address
and input this ip and port(5000) to see the result.
"""

from flask import Flask, render_template, Response, request
from camera import VideoCamera
import os, sys

HOST = '127.0.0.1'
webcam_num = 0
app = Flask(__name__)


def gen(camera):
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')


@app.route('/')
def home():
    return render_template('index.html', images='')


@app.route('/start_play')
def start_play():
    return render_template('index.html', images='/video_feed')


@app.route('/video_feed')
def video_feed():
    return Response(gen(VideoCamera(webcam_num)), mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == "__main__":

    if not len(sys.argv) == 3:
        print("Incorrect argument number!")
        exit(1)

    is_local_test = (sys.argv[1] == '0')
    webcam_num = int(sys.argv[2])
    if not is_local_test:
        # this code is for automatically aquiring the IPv4 address of the computer on the public internet
        HOST = [a for a in os.popen('route print').readlines(
        ) if '0.0.0.0' in a][0].split()[-2]
    app.run(host=HOST, debug=True)
