This is a simple website backend based on Flask using Python language.

To run this server for testing, you need to open up a console in the project directory and input the command:

    $ python app.py [localtest] [webcam]

1.The first argument 'localtest' decides whether you want the server runs on localhost. 0=yes and 1=false.

2.The second argument 'webcam' tells which camera you want to use. By default it is assigned as 0, which denotes the camera above your screen if you are using a laptop. You can also input 1, which will select the first webcam that is connected with your computer through
USB port.

3.This is an example:

    $ python app.py 1 1

By input the above command the server will run on public host
and open the first connected webcam to stream video when you click
the 'start' button. In this case you should check your public IP address
and input this ip and port(5000) to see the result.
